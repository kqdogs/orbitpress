import { generate } from '@ant-design/colors';
import { FastColor } from '@ant-design/fast-color';
import type { RGB } from '@ant-design/fast-color';
import type { UserComponent } from '../ele-app/types';

/**
 * 预设常用布局
 */
export interface PredefinedLayout {
  /** 布局名称 */
  name: string;
  /** 布局展示名称 */
  title?: string;
  /** 缩略图 */
  cover: UserComponent;
  /** 布局配置 */
  config: Record<string, any>;
  /** 非圆角主题下需要调整的布局配置 */
  traditionalThemeConfig?: Record<string, any>;
}

/**
 * 主题皮肤配置
 */
export interface SkinConfig {
  /** 主题皮肤名称 */
  name?: string;
  /** 主题展示名称 */
  title?: string;
  /** 主题皮肤缩略图 */
  cover?: string;
  /** 自定义主题皮肤基于的默认主题皮肤名称 */
  skinName?: string;
  /** 主题色 */
  color?: string;
  /** 背景图片 */
  wallpaper?: string;
  /** 背景蒙层 */
  maskColor?: string;
  /** 顶栏背景 */
  headerBg?: string;
  /** 侧栏背景 */
  sidebarBg?: string;
  /** 卡片背景 */
  cardBg?: string;
  /** 弹层背景 */
  overlayBg?: string;
  /** 弹层背景蒙层 */
  overlayMaskColor?: string;
  /** 暗黑主题配置 */
  darkConfig: Omit<SkinConfig, 'name' | 'darkConfig' | 'layouts'>;
  /** 主题样式 */
  themeCss?: string;
  /** 主题类名 */
  themeClass?: string;
  /** 预设常用布局 */
  layouts?: PredefinedLayout[];
  /** 默认使用的预设布局名称 */
  defaultLayout?: string;
}

/**
 * 色阶
 */
export interface ColorLevels {
  /** 主色 */
  color: string;
  /** 亮 */
  colorL: string;
  /** 很亮 */
  colorXL: string;
  /** 特亮 */
  colorXXL: string;
  /** 超亮 */
  colorXXXL: string;
  /** 极亮 */
  colorXXXXL: string;
  /** 暗 */
  colorD: string;
  /** 是否是透明模式 */
  isTransparent: boolean;
}

/**
 * 获取主题变量选择器
 * @param themeSelector 主题变量选择器
 */
function getThemeSelector(themeSelector?: string): string {
  return themeSelector ?? ':root';
}

/**
 * 获取暗黑主题变量选择器
 * @param darkSelector 暗黑主题变量选择器
 */
function getDarkSelector(darkSelector?: string): string {
  return darkSelector ?? 'html.dark';
}

/**
 * 获取暗黑主题节点类名
 * @param darkClass 暗黑主题节点类名
 */
function getDarkClass(darkClass?: string): string {
  return darkClass ?? 'dark';
}

/**
 * 主题节点设置主题色属性
 * @param color 主题色
 * @param themeEl 主题节点
 */
function setColorAttr(color: string | null | undefined, themeEl: HTMLElement) {
  if (color) {
    themeEl.dataset.color = color;
  } else {
    themeEl.removeAttribute('data-color');
  }
}

/**
 * 判断是否是颜色值
 * @param value 颜色
 */
export function isColorValue(value?: string): boolean {
  let color: FastColor | undefined = void 0;
  try {
    color = value ? new FastColor(value) : void 0;
    if (color != null) {
      const rgb = color.toRgb();
      if (
        rgb.r === 0 &&
        rgb.g === 0 &&
        rgb.b === 0 &&
        rgb.a === 1 &&
        color.toRgbString() !== value
      ) {
        color = void 0;
      }
    }
  } catch (_e) {
    //
  }
  return color != null;
}

/**
 * 生成背景值
 * @param bg 背景
 * @param mask 背景蒙层
 */
function getBgValue(bg?: string, mask?: string): string | undefined {
  if (!mask || !bg) {
    return bg;
  }
  if (!isColorValue(mask)) {
    return `${mask}, ${bg}`;
  }
  return `linear-gradient(${mask}, ${mask}) center / 102% 102%, ${bg}`;
}

/**
 * 增加颜色透明度
 * @param rgb 颜色
 * @param minus 增加的透明度
 */
export function getColorLevel(rgb: RGB, minus: number): string {
  const a = (Math.min(Math.max(rgb.a * 100 - minus, 0), 100) / 100).toFixed(2);
  return new FastColor({ ...rgb, a: Number(a) }).toRgbString();
}

/**
 * 生成色阶
 * @param color 颜色
 * @param dark 是否暗黑模式
 * @param isTransparent 是否透明模式
 */
function generateColors(
  color: string,
  dark: boolean,
  isTransparent: boolean
): ColorLevels {
  const levels = generate(color, dark ? { theme: 'dark' } : {});
  const colors: ColorLevels = {
    color, // 主色
    colorL: levels[4], // 亮
    colorXL: levels[3], // 很亮
    colorXXL: levels[2], // 特亮
    colorXXXL: levels[1], // 超亮
    colorXXXXL: levels[0], // 极亮
    colorD: dark ? levels[5] : levels[6], // 暗
    isTransparent
  };
  if (!isTransparent) {
    return colors;
  }
  const rgb = new FastColor(color).toRgb();
  return {
    color, // 主色
    colorL: getColorLevel(rgb, 18), // 亮
    colorXL: getColorLevel(rgb, 36), // 很亮
    colorXXL: getColorLevel(rgb, 58), // 特亮
    colorXXXL: getColorLevel(rgb, 72), // 超亮
    colorXXXXL: getColorLevel(rgb, 86), // 极亮
    colorD: colors.colorD, // 暗
    isTransparent
  };
}

/**
 * 生成色阶 css 变量
 * @param color 颜色
 * @param dark 是否暗黑模式
 * @param isTransparent 是否透明模式
 * @param varName 颜色对应的变量名
 */
function generateCssVar(
  color: string,
  dark?: boolean,
  isTransparent?: boolean,
  varName = 'primary'
) {
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

/**
 * 切换主题色
 * @param color 颜色值
 * @param dark 是否暗黑模式
 * @param isTransparent 是否是皮肤主题
 * @param themeEl 主题节点
 * @param themeSelector 主题变量选择器
 * @param darkClass 暗黑主题节点类名
 * @param darkSelector 暗黑主题变量选择器
 * @returns 主题色对应的色阶
 */
export function changeColor(
  color?: string | null,
  dark?: boolean,
  isTransparent?: boolean,
  themeEl?: HTMLElement,
  themeSelector?: string,
  darkClass?: string,
  darkSelector?: string
): ColorLevels | undefined {
  const $el = themeEl ?? document.documentElement;
  if (!$el) {
    return;
  }
  const id = 'ele-theme-var';
  const el = document.getElementById(id);
  if (el?.parentNode) {
    el.parentNode.removeChild(el);
  }
  let colorLevels: ColorLevels | undefined;
  if (color) {
    const selector = dark
      ? getDarkSelector(darkSelector)
      : getThemeSelector(themeSelector);
    const { colors, cssVars: colorCssVar } = generateCssVar(
      color,
      dark,
      isTransparent
    );
    colorLevels = colors;
    if (isTransparent) {
      colorCssVar.push(
        generateCssVar(
          dark ? '#49aa19' : '#52c41a',
          dark,
          isTransparent,
          'success'
        ).cssVars.join('')
      );
      colorCssVar.push(
        generateCssVar(
          dark ? '#d89614' : '#faad14',
          dark,
          isTransparent,
          'warning'
        ).cssVars.join('')
      );
      colorCssVar.push(
        generateCssVar(
          dark ? '#dc4446' : '#ff4d4f',
          dark,
          isTransparent,
          'danger'
        ).cssVars.join('')
      );
      colorCssVar.push(
        generateCssVar(
          dark ? '#dc4446' : '#ff4d4f',
          dark,
          isTransparent,
          'error'
        ).cssVars.join('')
      );
      colorCssVar.push(
        generateCssVar(
          dark ? '#8b8b8b' : '#909399',
          dark,
          isTransparent,
          'info'
        ).cssVars.join('')
      );
    }
    const elem = document.createElement('style');
    elem.id = id;
    elem.setAttribute('type', 'text/css');
    elem.innerHTML = `${selector}{ ${colorCssVar.join('')} }`;
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

/**
 * 切换主题皮肤
 * @param skinConfig 主题皮肤配置
 * @param dark 是否暗黑模式
 * @param themeEl 主题节点
 * @param themeSelector 主题变量选择器
 * @param themeClass 主题节点类名
 */
export function changeSkin(
  skinConfig?: SkinConfig | null,
  dark?: boolean,
  themeEl?: HTMLElement,
  themeSelector?: string,
  themeClass?: string
) {
  const $el = themeEl ?? document.documentElement;
  if (!$el) {
    return;
  }
  const id = 'ele-skin-var';
  const el = document.getElementById(id);
  if (el?.parentNode) {
    el.parentNode.removeChild(el);
  }
  const className = themeClass ?? 'is-transparent';
  const skinCfg = dark ? skinConfig?.darkConfig : skinConfig;
  const isTransparent = !(
    !skinCfg ||
    (!skinCfg.wallpaper &&
      !skinCfg.maskColor &&
      !skinCfg.headerBg &&
      !skinCfg.sidebarBg &&
      !skinCfg.cardBg &&
      !skinCfg.overlayBg &&
      !skinCfg.overlayMaskColor)
  );
  if (!isTransparent) {
    $el.classList.remove(className);
    if (skinCfg?.themeCss) {
      const elem = document.createElement('style');
      elem.id = id;
      elem.setAttribute('type', 'text/css');
      elem.innerHTML = skinCfg.themeCss;
      document.head.appendChild(elem);
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
  const selector = themeSelector ?? 'html.is-transparent';
  const cssVar = [
    `${selector}{`,
    wallpaper ? `--ele-skin-bg-wallpaper:${wallpaper};` : void 0,
    skin.headerBg ? `--ele-skin-bg-header:${skin.headerBg};` : void 0,
    skin.sidebarBg ? `--ele-skin-bg-sidebar:${skin.sidebarBg};` : void 0,
    skin.cardBg ? `--ele-skin-bg-card:${skin.cardBg};` : void 0,
    overlayBg ? `--ele-skin-bg-overlay:${overlayBg};` : void 0,
    tooltipBg ? `--ele-skin-bg-tooltip:${tooltipBg};` : void 0,
    '}',
    skin.themeCss
  ];
  const elem = document.createElement('style');
  elem.id = id;
  elem.setAttribute('type', 'text/css');
  elem.innerHTML = cssVar.filter((s) => !!s).join('');
  document.head.appendChild(elem);
  $el.classList.add(className);
}
