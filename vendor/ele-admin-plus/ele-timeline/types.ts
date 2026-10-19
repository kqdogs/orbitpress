import type { CSSProperties } from 'vue';
import type { ElIconProps } from '../ele-app/el';
import type { UserComponent } from '../ele-app/types';

/**
 * 时间线项类型
 */
export type TimelineItemType = 'default' | 'primary' | 'danger';

/**
 * 时间线项数据
 */
export interface TimelineItem extends Record<string, any> {
  /** 循环的 key */
  key?: PropertyKey;
  /** 类型 */
  type?: TimelineItemType;
  /** 标题 */
  title?: string;
  /** 描述 */
  description?: string;
  /** 图标 */
  icon?: UserComponent;
  /** 自定义图标属性 */
  iconProps?: ElIconProps;
  /** 自定义图标样式 */
  iconStyle?: CSSProperties;
  /** 样式 */
  style?: CSSProperties;
  /** 类名 */
  class?: string;
}

/**
 * 时间线单元格数据
 */
export interface TimelineCell {
  /** 循环的 key */
  key: PropertyKey;
  /** 时间线项数据 */
  data?: TimelineItem;
  /** 时间线项数据索引 */
  dataIndex?: number;
  /** 下一个时间线项数据的类型 */
  nextDataType?: TimelineItemType;
  /** 是否是第一个时间线项数据 */
  isFirst?: boolean;
  /** 是否是最后一个时间线项数据 */
  isLast?: boolean;
}

/**
 * 时间线行数据
 */
export interface TimelineRow {
  /** 循环的 key */
  key: PropertyKey;
  /** 时间线单元格数据 */
  items: TimelineCell[];
  /** 是否是偶数行 */
  isEvenRow?: boolean;
}
