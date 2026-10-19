/**
 * 加载器类型
 */
export type LoadingType = 'circle' | 'dot';

/**
 * 加载器尺寸
 */
export type LoadingSize = 'small' | 'default' | 'large';

/**
 * 圆形加载器属性
 */
export interface CircleProps {
  ['element-loading-text']?: string;
  ['element-loading-background']?: string;
  ['element-loading-spinner']?: string;
  ['element-loading-svg-view-box']?: string;
}
