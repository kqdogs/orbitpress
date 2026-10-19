/**
 * 容错等级
 */
export type Level = 'L' | 'M' | 'Q' | 'H';

/**
 * 自定义图片参数
 */
export interface ImageSettings {
  /** 地址 */
  src?: string;
  /** 高度 */
  height?: number;
  /** 宽度 */
  width?: number;
  /** x坐标 */
  x?: number;
  /** y坐标 */
  y?: number;
  /** 是否擦除图片区域二维码 */
  excavate?: boolean;
}

/**
 * 渲染标签
 */
export type QrCodeTag = 'img' | 'canvas' | 'svg';

/**
 * 二维码数据
 */
export type Modules = boolean[][];

/**
 * 擦除区域
 */
export interface Excavation {
  /** x坐标 */
  x: number;
  /** y坐标 */
  y: number;
  /** 宽度 */
  w: number;
  /** 高度 */
  h: number;
}
