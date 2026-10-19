import type { StyleValue } from '../ele-app/types';

/**
 * 间距
 */
export type WatermarkGap = [number, number];

/**
 * 偏移量
 */
export type WatermarkOffset = [number, number];

/**
 * 文字样式
 */
export interface WatermarkFont {
  /** 字体颜色 */
  color?: string;
  /** 字体大小 */
  fontSize?: number;
  /** 字体粗细 */
  fontWeight?: 'normal' | 'light' | 'weight' | number;
  /** 字体样式 */
  fontFamily?: string;
  /** 字体类型 */
  fontStyle?: 'none' | 'normal' | 'italic' | 'oblique';
}

/**
 * 图片参数
 */
export interface ImageOption<T extends Record<string, any>> {
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /** 默认宽度 */
  defaultWidth: number;
  /** 默认高度 */
  defaultHeight: number;
  /** 旋转角度 */
  rotate: number;
  /** 水平间距 */
  gapX: number;
  /** 垂直间距 */
  gapY: number;
  /** 多行文字的行间距 */
  lineGap: number;
  /** 文字样式 */
  font: Required<T>;
  /** 文字内容 */
  contents: string[];
  /** 图片源 */
  image?: string;
  /** 水平偏移量 */
  offsetX: number;
  /** 垂直偏移量 */
  offsetY: number;
  /** 图片数据回调 */
  callback: (data: string, width: number, height: number) => void;
}

/**
 * 图片样式参数
 */
export interface ImageStyleOption extends Omit<
  ImageOption<WatermarkFont>,
  'callback'
> {
  /** 公共样式 */
  commonStyle: StyleValue;
}

/**
 * 图片样式冻结参数
 */
export interface MutationOption {
  /** 获取容器节点 */
  getWrapperEl: () => HTMLElement | null;
  /** 获取图片节点 */
  getImageEl: () => HTMLElement | null;
  /** 获取图片样式参数 */
  getImageStyleOption: () => ImageStyleOption | undefined;
}

/**
 * 生成 svg 参数
 */
export type SvgMarkOption = Omit<
  ImageStyleOption,
  'defaultWidth' | 'defaultHeight'
>;

/**
 * 更新 svg 参数
 */
export type UpdateOptions = (
  d?: any,
  k?: any,
  o?: any,
  v?: any,
  n?: any,
  m?: any,
  h?: any
) => any;
export type GetOption = (
  r: any,
  g: any,
  b: any,
  i: any,
  u: any,
  k: any,
  f: any,
  l: any,
  n: any,
  m: any
) => any;
