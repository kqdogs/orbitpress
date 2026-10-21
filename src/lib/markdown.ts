import { Marked } from 'marked';
import sanitize from 'sanitize-html';
import {escapeHtml,youtubeMarkup} from './video-embed';
import {translator,type Locale} from './i18n';

const youtubeEmbed = /^https:\/\/www\.youtube(?:-nocookie)?\.com\/embed\/[A-Za-z0-9_-]{11}(?:\?(?:playsinline=1|rel=0|start=\d+)(?:&(?:playsinline=1|rel=0|start=\d+))*)?$/;
const bilibiliEmbed =
  /^https:\/\/player\.bilibili\.com\/player\.html\?(?:bvid=BV[A-Za-z0-9]{10}|aid=\d{1,20})&page=[1-9]\d{0,2}&autoplay=0$/;

function createMarkdown(locale:Locale) {
 const t=translator(locale);
 return new Marked({
  renderer: {
    code({text,lang}) {
      const language=(lang||'text').split(/\s/)[0].slice(0,80)||'text';
      return `<div class="code-block"><div class="code-toolbar"><span>${escapeHtml(language)}</span><button type="button" data-copy-code="true" aria-label="${t('复制代码')}">${t('复制代码')}</button></div><pre><code class="language-${escapeHtml(language)}">${escapeHtml(text)}</code></pre></div>\n`;
    }
  },
  extensions: [
    {
      name: 'videoEmbed',
      level: 'block',
      start(src: string) {
        return src.match(/^:::(?:youtube|bilibili)\s/m)?.index;
      },
      tokenizer(src: string) {
        const match =
          /^:::(youtube|bilibili)[ \t]+([A-Za-z0-9_-]+)(?:[ \t]+(p|t)=([0-9]{1,5}))?[ \t]*(?:\n|$)/.exec(
            src,
          );
        if (!match) return;
        const [, provider, id, parameter, value] = match;
        if (provider === 'youtube' && (!/^[A-Za-z0-9_-]{11}$/.test(id) || parameter==='p'||Number(value||0)>86400)) return;
        if (provider === 'bilibili' && (!/^(?:BV[A-Za-z0-9]{10}|av\d{1,20})$/.test(id)||parameter==='t'||(value&&!/^[1-9]\d{0,2}$/.test(value)))) return;
        return { type: 'videoEmbed', raw: match[0], provider, id, page: parameter==='p'?value:'1',start:parameter==='t'?Number(value):0 };
      },
      renderer(token) {
        const provider = String(token.provider),
          id = String(token.id),
          page = String(token.page);
        if(provider==='youtube')return youtubeMarkup(id,Number(token.start),locale);
        const src =
          provider === 'youtube'
            ? 'https://www.youtube-nocookie.com/embed/' + id
            : 'https://player.bilibili.com/player.html?' +
              (id.startsWith('av') ? 'aid=' + id.slice(2) : 'bvid=' + id) +
              '&page=' +
              page +
              '&autoplay=0';
        return (
          '<div class="video-embed video-embed-' +
          provider +
          '"><iframe src="' +
          src +
          '" title="' +
          t(provider === 'youtube' ? 'YouTube 视频' : '哔哩哔哩视频') +
          '" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>\n'
        );
      },
    },
  ],
});
}

export function renderMarkdown(body: string,options:{omitImage?:string;locale?:Locale}={}) {
  const markdown=createMarkdown(options.locale||'zh-CN');
  const raw = markdown.parse(body, { async: false, gfm: true, breaks: false });
  let index = 0;
  const toc: { id: string; text: string; level: number }[] = [];
  const html = sanitize(raw, {
    allowedTags: [
      'p',
      'br',
      'hr',
      'h2',
      'h3',
      'h4',
      'strong',
      'em',
      'del',
      'ul',
      'ol',
      'li',
      'blockquote',
      'pre',
      'code',
      'a',
      'img',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'div',
      'iframe',
      'span',
      'button',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'loading'],
      code: ['class'],
      div: ['class', 'data-video-id','data-video-start'],
      span: ['class'],
      p: ['class'],
      button: ['type','data-copy-code','aria-label'],
      iframe: ['src', 'title', 'loading', 'allow', 'allowfullscreen', 'referrerpolicy'],
    },
    allowedSchemes: ['https', 'http', 'mailto'],
    allowProtocolRelative: false,
    exclusiveFilter: frame => frame.tag==='img'&&Boolean(options.omitImage)&&frame.attribs.src===options.omitImage,
    transformTags: {
      a: (_tag, attrs) => ({
        tagName: 'a',
        attribs: { ...attrs, rel: 'noopener noreferrer', target: '_blank' },
      }),
      img: (_tag, attrs) => ({
        tagName: 'img',
        attribs: {
          ...attrs,
          src: /^\/(?:images|media)\/[a-zA-Z0-9._-]+$/.test(attrs.src || '') ? attrs.src : '',
          loading: 'lazy',
        },
      }),
      iframe: (_tag, attrs) => {
        const src = attrs.src || '';
        return {
          tagName: 'iframe',
          attribs: youtubeEmbed.test(src) || bilibiliEmbed.test(src) ? { ...attrs, src } : {},
        };
      },
    },
  }).replace(/<(h[234])>(.*?)<\/\1>/g, (_match, tag, text) => {
    const id = `section-${++index}`;
    toc.push({
      id,
      text: sanitize(text, { allowedTags: [], allowedAttributes: {} }),
      level: Number(tag[1]),
    });
    return `<${tag} id="${id}">${text}</${tag}>`;
  });
  return { html, toc };
}
