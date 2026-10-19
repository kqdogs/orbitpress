/**
 * 纸张方向
 */
export type PrintDirection = 'landscape' | 'portrait' | string;

/**
 * 纸张旋转
 */
export type PrintOrientation = 'upright' | 'rotate-left' | 'rotate-right';

/**
 * 打印位置
 */
export type PrintTarget = '_self' | '_blank' | '_iframe';

/**
 * 打印参数
 */
export interface PrintOption {
  /** 页面标题 */
  title?: string;
  /** 页间距 */
  margin?: string | number;
  /** 纸张方向 */
  direction?: string | null;
  /** 纸张旋转 */
  orientation?: string | null;
  /** 打印方法参数 */
  options?: any;
}

/**
 * pdf 打印参数
 */
export interface PrintPdfOption {
  /** pdf 链接地址 */
  url?: string;
  /** 直接指定 arraybuffer 数据 */
  arraybuffer?: ArrayBuffer;
  /** 打印完成的回调 */
  done?: () => void;
  /** 错误回调 */
  error?: (status: number, result: string) => void;
  /** 打印方法参数 */
  options?: any;
}
