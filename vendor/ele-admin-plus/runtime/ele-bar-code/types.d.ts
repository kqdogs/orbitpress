import type { api } from 'jsbarcode';

/**
 * 条形码实例
 */
export type JsBarCodeInstance = Required<api> | null;

/**
 * 条码渲染方式
 */
export type BarCodeTag = 'svg' | 'img' | 'canvas';
