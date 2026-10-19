/**
 * 标记项
 */
export interface MarkerItem extends Record<string, any> {
  /** 唯一值 */
  key?: any;
  /** 横坐标 */
  x?: number;
  /** 纵坐标 */
  y?: number;
  /** 是否固定原始尺寸和方向 */
  fixed?: boolean;
}
