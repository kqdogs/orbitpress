/**
 * 数据
 */
export interface AvatarItem extends Record<keyof any, any> {
  /** 循环的 key */
  key?: PropertyKey;
  /** 头像名称 */
  label?: string;
  /** 头像链接 */
  value?: string;
}

/**
 * 图片加载失败事件参数
 */
export interface AvatarErrorOption {
  /** 数据 */
  item: AvatarItem;
  /** 事件 */
  e: Event;
}
