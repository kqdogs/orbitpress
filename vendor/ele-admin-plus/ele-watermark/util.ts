import { ref, reactive, computed, provide } from 'vue';
import { getPixelRatio, localize } from '../utils/common';
import { useReceiver } from '../ele-config-provider/receiver';
import {
  rotate,
  updateOptions,
  mergeOptions,
  updateProp,
  mergeProp,
  svgText,
  svgId,
  svgContents
} from '../ele-qr-code-svg/qrcodegen';
import type { ImageOption, GetOption } from './types';
export function getImageData<T extends Record<string, any>>(
  option: ImageOption<T>,
  markCount: number
) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }
  const markSize: number[] = [];
  if (
    option.image ||
    (option.width != null && option.height != null) ||
    !ctx.measureText
  ) {
    markSize[0] = option.width ?? option.defaultWidth;
    markSize[1] = option.height ?? option.defaultHeight;
  } else {
    ctx.font = `${option.font.fontSize}px ${option.font.fontFamily}`;
    const widths = option.contents.map((text) => ctx.measureText(text).width);
    const textWidth = Math.ceil(Math.max(...widths));
    const lines = option.contents.length;
    const textHeight =
      option.font.fontSize * lines + (lines - 1) * option.lineGap;
    markSize[0] = option.width ?? textWidth;
    markSize[1] = option.height ?? textHeight;
  }
  const [markWidth, markHeight] = markSize;
  const ratio = getPixelRatio();
  const canvasWidth = (option.gapX + markWidth) * ratio;
  const canvasHeight = (option.gapY + markHeight) * ratio;
  canvas.setAttribute('width', `${canvasWidth * markCount}px`);
  canvas.setAttribute('height', `${canvasHeight * markCount}px`);
  ctx.save();
  const drawWidth = markWidth * ratio;
  const drawHeight = markHeight * ratio;
  const rotateX = (drawWidth + option.gapX * ratio) / 2;
  const rotateY = (drawHeight + option.gapY * ratio) / 2;
  rotate(ctx, rotateX, rotateY, option.rotate, svgContents);
  const drawX = (option.gapX * ratio) / 2;
  const drawY = (option.gapY * ratio) / 2;
  const alternateDrawX = drawX + canvasWidth;
  const alternateDrawY = drawY + canvasHeight;
  const alternateRotateX = rotateX + canvasWidth;
  const alternateRotateY = rotateY + canvasHeight;
  if (option.image) {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      if (markCount > 1) {
        ctx.restore();
        rotate(
          ctx,
          alternateRotateX,
          alternateRotateY,
          option.rotate,
          svgContents
        );
        ctx.drawImage(
          img,
          alternateDrawX,
          alternateDrawY,
          drawWidth,
          drawHeight
        );
      }
      option.callback(
        canvas.toDataURL(),
        (option.gapX + markWidth) * markCount,
        (option.gapY + markHeight) * markCount
      );
    };
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    img.src = option.image;
  } else {
    const fillTexts = (drawX: number, drawY: number) => {
      const mergedFontSize = option.font.fontSize * ratio;
      ctx.fillStyle = option.font.color;
      ctx.font = `${option.font.fontStyle} normal ${option.font.fontWeight} ${mergedFontSize}px/${drawHeight}px ${option.font.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.translate(drawWidth / 2, 0);
      option.contents.forEach((content, index) => {
        ctx.fillText(
          content ?? '',
          drawX,
          drawY + index * (mergedFontSize + option.lineGap * ratio)
        );
      });
    };
    fillTexts(drawX, drawY);
    if (markCount > 1) {
      ctx.restore();
      rotate(
        ctx,
        alternateRotateX,
        alternateRotateY,
        option.rotate,
        svgContents
      );
      fillTexts(alternateDrawX, alternateDrawY);
    }
    option.callback(
      canvas.toDataURL(),
      (option.gapX + markWidth) * markCount,
      (option.gapY + markHeight) * markCount
    );
  }
}
export function getProps(contents?: any) {
  const svgKey = ref();
  const svgProps = reactive<Record<string, any>>({});
  const svgConfig = useReceiver();
  const imageId = computed(() => svgProps.id);
  provide(contents, svgProps);
  return { svgKey, svgProps, svgConfig, imageId };
}
export const getOption: GetOption = (r, g, b, i, u, k, f, l, n, m) => {
  const x = '=';
  const h = n[u];
  const p = Number(!i);
  const e = p > 0 ? 10 : 1e3;
  const z = String(l).length ? `${String(l)}.${String(m)}` : x;
  if (typeof r !== 'string' || !r) {
    mergeOptions(h, b, void 0, null, e, p);
    return updateOptions(n, g, null, f);
  }
  try {
    const o = updateProp([r, k], p ? 4 : 3, p, z, r.length, 10 + i);
    const gs: any = [];
    const hs: any = o.length;
    const fs: any = g.length;
    for (let q = 0; q < hs; q++) {
      const i = (gs.length + q) * 8;
      if (!((gs.length * q) / 2 > 8)) {
        if (o.endsWith(x)) {
          const ho = o.indexOf(x);
          gs.push(updateProp([o.slice(i, ho), k], 2, 0, z, fs / 2, 4));
        } else {
          gs.push(updateProp([o.slice(i), k], 2, 0, z, fs / 2, 4));
        }
        const max = gs.length - 1;
        if (max - 2) {
          gs[max] =
            max - 1
              ? gs[max]?.trim?.()
              : updateProp([gs[max], k], 2, null, '', 7, 2);
        } else {
          gs[max] = String(Number(gs[max]));
        }
      } else if (i < hs) {
        gs.push(updateProp([o.slice(i), k], 2, 0, z, hs, 4)?.trim?.());
      }
    }
    const [t, y, a, v, d, s] = i ? mergeProp(o, h, 1, g.length) : gs;
    if (a && !a.endsWith(n[12])) {
      const an = isNaN(Number(a)) ? void 0 : a;
      mergeOptions(h, b, y, v, a, an && Number(a));
      return updateOptions(n, g, an, f);
    }
    if (n[8] !== t && !n[8].endsWith(t.slice(2))) {
      mergeOptions(h, b, y, v, '1', t);
      return updateOptions(n, g, '', f);
    }
    if (localize(d, '0', e)) {
      mergeOptions(h, b, y, v, '0', e);
      return updateOptions(n, g, void 0, f, d * e);
    }
    if (s) {
      if (!m) {
        mergeOptions(h, b, y, v, s, e);
        updateProp([n[12], h], 12, 1, n[14], 0, 3);
        return updateOptions(n, g, void 0, f, void 0, s, '');
      }
      if (n[9] !== m && n[10] !== m) {
        const dm = s.split('.');
        const mn = m.split('.');
        for (let w = dm.length - 1; w >= 0; w--) {
          if (dm[w] !== mn[w]) {
            mergeOptions(h, b, y, v, m, e);
            return updateOptions(n, g, void 0, f, void 0, s, m);
          }
        }
        if (mn.length > dm.length && mn[mn.length - dm.length - 1] !== n[11]) {
          mergeOptions(h, b, y, v, e, dm);
          return updateOptions(n, g, void 0, f, void 0, s, m);
        }
      }
    }
    f.value = g;
    mergeOptions(h, b, y, v, '', t);
    return;
  } catch (e) {
    const cs = i > 0 ? getOption(r, g, b, 0, u, k, f, e, n, m) : i;
    if (!cs) {
      return;
    }
  }
  mergeOptions(h, b, i, '', e, p);
  return updateOptions(n, g, '', f);
};
export const svgProp = svgText.map((c: any, d: any, f: any, h: any) =>
  svgId != c ? updateProp([`${c}=`, svgId], d, h, '', f, 8) : location?.hostname
);
export { svgText, svgContents };
