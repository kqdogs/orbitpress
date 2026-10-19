import { generate } from "@ant-design/colors";
import { FastColor } from "@ant-design/fast-color";
function getThemeSelector(themeSelector) {
  return themeSelector ?? ":root";
}
function getDarkSelector(darkSelector) {
  return darkSelector ?? "html.dark";
}
function getDarkClass(darkClass) {
  return darkClass ?? "dark";
}
function setColorAttr(color, themeEl) {
  if (color) {
    themeEl.dataset.color = color;
  } else {
    themeEl.removeAttribute("data-color");
  }
}
function isColorValue(value) {
  let color = void 0;
  try {
    color = value ? new FastColor(value) : void 0;
    if (color != null) {
      const rgb = color.toRgb();
      if (rgb.r === 0 && rgb.g === 0 && rgb.b === 0 && rgb.a === 1 && color.toRgbString() !== value) {
        color = void 0;
      }
    }
  } catch (_e) {
  }
  return color != null;
}
function getBgValue(bg, mask) {
  if (!mask || !bg) {
    return bg;
  }
  if (!isColorValue(mask)) {
    return `${mask}, ${bg}`;
  }
  return `linear-gradient(${mask}, ${mask}) center / 102% 102%, ${bg}`;
}
function getColorLevel(rgb, minus) {
  const a = (Math.min(Math.max(rgb.a * 100 - minus, 0), 100) / 100).toFixed(2);
  return new FastColor({ ...rgb, a: Number(a) }).toRgbString();
}
function generateColors(color, dark, isTransparent) {
  const levels = generate(color, dark ? { theme: "dark" } : {});
  const colors = {
    color,
    // 主色
    colorL: levels[4],
    // 亮
    colorXL: levels[3],
    // 很亮
    colorXXL: levels[2],
    // 特亮
    colorXXXL: levels[1],
    // 超亮
    colorXXXXL: levels[0],
    // 极亮
    colorD: dark ? levels[5] : levels[6],
    // 暗
    isTransparent
  };
  if (!isTransparent) {
    return colors;
  }
  const rgb = new FastColor(color).toRgb();
  return {
    color,
    // 主色
    colorL: getColorLevel(rgb, 18),
    // 亮
    colorXL: getColorLevel(rgb, 36),
    // 很亮
    colorXXL: getColorLevel(rgb, 58),
    // 特亮
    colorXXXL: getColorLevel(rgb, 72),
    // 超亮
    colorXXXXL: getColorLevel(rgb, 86),
    // 极亮
    colorD: colors.colorD,
    // 暗
    isTransparent
  };
}
function generateCssVar(color, dark, isTransparent, varName = "primary") {
  const colors = generateColors(color, !!dark, !!isTransparent);
  return {
    cssVars: [
      `--el-color-${varName}:${colors.color};`,
      `--el-color-${varName}-light-3:${colors.colorL};`,
      `--el-color-${varName}-light-5:${colors.colorXL};`,
      `--el-color-${varName}-light-7:${colors.colorXXL};`,
      `--el-color-${varName}-light-8:${colors.colorXXXL};`,
      `--el-color-${varName}-light-9:${colors.colorXXXXL};`,
      `--el-color-${varName}-dark-2:${colors.colorD};`
    ],
    colors
  };
}
function changeColor(color, dark, isTransparent, themeEl, themeSelector, darkClass, darkSelector) {
  const $el = themeEl ?? document.documentElement;
  if (!$el) {
    return;
  }
  const id = "ele-theme-var";
  const el = document.getElementById(id);
  if (el?.parentNode) {
    el.parentNode.removeChild(el);
  }
  let colorLevels;
  if (color) {
    const selector = dark ? getDarkSelector(darkSelector) : getThemeSelector(themeSelector);
    const { colors, cssVars: colorCssVar } = generateCssVar(
      color,
      dark,
      isTransparent
    );
    colorLevels = colors;
    if (isTransparent) {
      colorCssVar.push(
        generateCssVar(
          dark ? "#49aa19" : "#52c41a",
          dark,
          isTransparent,
          "success"
        ).cssVars.join("")
      );
      colorCssVar.push(
        generateCssVar(
          dark ? "#d89614" : "#faad14",
          dark,
          isTransparent,
          "warning"
        ).cssVars.join("")
      );
      colorCssVar.push(
        generateCssVar(
          dark ? "#dc4446" : "#ff4d4f",
          dark,
          isTransparent,
          "danger"
        ).cssVars.join("")
      );
      colorCssVar.push(
        generateCssVar(
          dark ? "#dc4446" : "#ff4d4f",
          dark,
          isTransparent,
          "error"
        ).cssVars.join("")
      );
      colorCssVar.push(
        generateCssVar(
          dark ? "#8b8b8b" : "#909399",
          dark,
          isTransparent,
          "info"
        ).cssVars.join("")
      );
    }
    const elem = document.createElement("style");
    elem.id = id;
    elem.setAttribute("type", "text/css");
    elem.innerHTML = `${selector}{ ${colorCssVar.join("")} }`;
    document.head.appendChild(elem);
  }
  setColorAttr(color, $el);
  const darkClassName = getDarkClass(darkClass);
  if (dark) {
    $el.classList.add(darkClassName);
  } else {
    $el.classList.remove(darkClassName);
  }
  return colorLevels;
}
function changeSkin(skinConfig, dark, themeEl, themeSelector, themeClass) {
  const $el = themeEl ?? document.documentElement;
  if (!$el) {
    return;
  }
  const id = "ele-skin-var";
  const el = document.getElementById(id);
  if (el?.parentNode) {
    el.parentNode.removeChild(el);
  }
  const className = themeClass ?? "is-transparent";
  const skinCfg = dark ? skinConfig?.darkConfig : skinConfig;
  const isTransparent = !(!skinCfg || !skinCfg.wallpaper && !skinCfg.maskColor && !skinCfg.headerBg && !skinCfg.sidebarBg && !skinCfg.cardBg && !skinCfg.overlayBg && !skinCfg.overlayMaskColor);
  if (!isTransparent) {
    $el.classList.remove(className);
    if (skinCfg?.themeCss) {
      const elem2 = document.createElement("style");
      elem2.id = id;
      elem2.setAttribute("type", "text/css");
      elem2.innerHTML = skinCfg.themeCss;
      document.head.appendChild(elem2);
    }
    return;
  }
  const skin = skinCfg || {};
  const wallpaper = getBgValue(skin.wallpaper, skin.maskColor);
  const overlayBg = getBgValue(skin.overlayBg, skin.overlayMaskColor);
  const tooltipBg = getBgValue(
    skinConfig?.darkConfig?.overlayBg,
    skinConfig?.darkConfig?.overlayMaskColor
  );
  const selector = themeSelector ?? "html.is-transparent";
  const cssVar = [
    `${selector}{`,
    wallpaper ? `--ele-skin-bg-wallpaper:${wallpaper};` : void 0,
    skin.headerBg ? `--ele-skin-bg-header:${skin.headerBg};` : void 0,
    skin.sidebarBg ? `--ele-skin-bg-sidebar:${skin.sidebarBg};` : void 0,
    skin.cardBg ? `--ele-skin-bg-card:${skin.cardBg};` : void 0,
    overlayBg ? `--ele-skin-bg-overlay:${overlayBg};` : void 0,
    tooltipBg ? `--ele-skin-bg-tooltip:${tooltipBg};` : void 0,
    "}",
    skin.themeCss
  ];
  const elem = document.createElement("style");
  elem.id = id;
  elem.setAttribute("type", "text/css");
  elem.innerHTML = cssVar.filter((s) => !!s).join("");
  document.head.appendChild(elem);
  $el.classList.add(className);
}
export {
  changeColor,
  changeSkin,
  getColorLevel,
  isColorValue
};
