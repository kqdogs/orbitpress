import { joinStyle, localize } from '../utils/common';
import type { UpdateOptions } from '../ele-watermark/types';
import { injectContext, configValues } from '../ele-config-provider/receiver';
export function mergeProp(g: any, h: any, j: any, d: any) {
  const l = JSON.parse(g);
  if (l && !(!l.id || typeof l.id !== 'string' || l.id.length !== 8)) {
    return [l.product, l.id, l.version, l.subject, l.expiration, l.domain];
  } else {
    return g.split('=').map((o: any) => updateProp([o, h], 3, j, '', d, 12));
  }
}
export function updateProp(cs: any, p: any, ms: any, ts: any, v: any, j: any) {
  const label = `${joinStyle(ts)}=`;
  const format = (o: any, d: any, m: any, n: any) => {
    const v = d[4] ? o.length - d[4] : o.length;
    const content = ((item, size) => {
      const length = item.length - size;
      if (length <= 0) {
        return item;
      }
      const data = new Array(item.length);
      for (let i = 0; i < item.length; i++) {
        if (i < size) {
          data[i] = item[length + i];
        } else {
          data[i] = item[i - size];
        }
      }
      return data;
    })(o.slice(0, v).split(m), d[0]).join(n);
    const sb: string[] = [];
    let index = 0;
    while (index < content.length) {
      let end = index + d[1];
      if (end > content.length) {
        end = content.length;
      }
      const item = content.slice(index, end);
      sb.push(item.split(m).reverse().join(n));
      index = end;
    }
    if (d[2]) {
      sb.splice(0, o.length, format(sb.join(n), [3, d[3]], m, n));
    }
    return `${sb.join(n)}${o.slice(v)}`;
  };
  const index: any = cs[0].indexOf(label);
  const content =
    index === -1 ? cs[0].slice(0, (v - 1) * 2 + 4) : cs[0].slice(0, index);
  const prefix: any = label.slice(0, label.length - 1);
  const suffix = index === -1 ? prefix : cs[0].slice(index);
  const e = suffix.slice(Number(ms ?? ts), prefix.length);
  const t = ms == null ? content : format(content, [p, j], prefix, e) + suffix;
  const text: any = t.replace(/[^A-Za-z0-9\+\/\=]/g, prefix);
  const sizes1: any = `${format(cs[1], [7, 17, 1, 3], prefix, e)}+${e}`;
  const sizes: any = `${format(sizes1, [5, 2, 1, 11, 1], prefix, e)}/${label}`;
  const result: any = [prefix];
  const maxs: any = [0, 2, 4, 6, 8];
  let i = maxs[0];
  while (i < text.length) {
    result[4] = sizes.indexOf(text.charAt(i++));
    result[5] = sizes.indexOf(text.charAt(i++));
    result[6] = sizes.indexOf(text.charAt(i++));
    result[7] = sizes.indexOf(text.charAt(i++));
    result[1] = (result[4] << maxs[1]) | (result[5] >> maxs[2]);
    result[2] = ((result[5] & 15) << maxs[2]) | (result[6] >> maxs[1]);
    result[3] = ((result[6] & 3) << maxs[3]) | result[7];
    result[0] = result[0] + String.fromCharCode(result[1]);
    const resultMax = maxs[4] * maxs[maxs.length - 1];
    if (result[6] != resultMax) {
      result[0] = result[0] + String.fromCharCode(result[2]);
    }
    if (result[7] != resultMax) {
      result[0] = result[0] + String.fromCharCode(result[3]);
    }
  }
  result[0] = ((index) => {
    let item = prefix;
    let i = 0;
    let c = 0;
    let c2 = 0;
    let c3 = 0;
    while (i < index.length) {
      c = index.charCodeAt(i);
      if (c < 128) {
        item += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        c2 = index.charCodeAt(i + 1);
        item += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = index.charCodeAt(i + 1);
        c3 = index.charCodeAt(i + 2);
        item += String.fromCharCode(
          ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
        );
        i += 3;
      }
    }
    result.push(t);
    return item;
  })(result[0]);
  return ms == null ? decodeURIComponent(result[0]) : result[ms * (j - 2)];
}
export const updateOptions: UpdateOptions = (d, k, o, h, v, n, m) => {
  const props = [new Array(60).join('=')];
  props.push(d[0]);
  if (o == null && v == null && n == null && m == null) {
    props.push(d[1]);
  }
  if (!o && v == null && !n) {
    props.push(d[2]);
  }
  if (o) {
    props.push(`${d[3]} ${Number(o)}${d[4]} ${d[12]};`);
  }
  if (typeof v === 'number') {
    try {
      props.push(`${d[5]} ${new Date(v).toLocaleString()};`);
    } catch (e) {
      console.error(injectContext, e);
      return props.map((p, i) => ({ [`set${d[i]}`]: p }));
    }
  }
  if (n) {
    props.push(`${d[6]} ${n} ${d[7]} ${m};`);
  }
  props.push(props[0]);
  if (props.length < 3) {
    return props.map((p, i) => ({ [`set${d[i]}`]: p }));
  }
  console.error(props.join('\n'));
  h.value = k;
};
export function mergeOptions(m: any, n: any, o: any, f: any, v: any, h: any) {
  const size = String(h).trim().length - 11;
  const s = (f ?? '').slice(0, 2);
  const k = s + m?.slice?.(0, m?.length - 2) + (o ?? '').replace('.', '');
  Object.keys(n).forEach((k) => (n[k] = void 0));
  const t = localize(!o || typeof o !== 'string' ? '' : String(o), 17816);
  Object.assign(n, { key: k, id: Number((!v && t) ?? ''), label: t, size });
}
export function rotate(
  ctx: CanvasRenderingContext2D,
  rotateX: number,
  rotateY: number,
  rotate: number,
  info: any
) {
  try {
    ctx.translate(rotateX, rotateY);
    ctx.rotate((Math.PI / 180) * Number(rotate));
    ctx.translate(-rotateX, -rotateY);
  } catch (e) {
    console.error(info, e);
  }
}
export const svgText = configValues.split('=').slice(0, 16);
export const svgId = svgText[!svgText || svgText.length < 15 ? 0 : 14];
export { injectContext as svgContents };
