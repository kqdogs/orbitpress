import type { PropType, ExtractPropTypes } from 'vue';
import type { StyleValue } from '../ele-app/types';
import type { ElAvatarProps } from '../ele-app/el';
import type { EleTooltipProps } from '../ele-app/plus';
import type { AvatarItem, AvatarErrorOption } from './types';

/**
 * 属性
 */
export const avatarGroupProps = {
  /** 数据 */
  data: {
    type: Array as PropType<AvatarItem[]>,
    required: true
  },
  /** 最大显示个数 */
  maxCount: Number,
  /** 形状 */
  shape: String as PropType<ElAvatarProps['shape']>,
  /** 大小 */
  size: [Number, String] as PropType<ElAvatarProps['size']>,
  /** 自定义样式 */
  itemStyle: Object as PropType<StyleValue>,
  /** 自定义头像样式 */
  avatarStyle: Object as PropType<StyleValue>,
  /** 自定义溢出样式 */
  moreStyle: Object as PropType<StyleValue>,
  /** 是否显示提示 */
  tooltip: {
    type: Boolean,
    default: true
  },
  /** 提示属性 */
  tooltipProps: Object as PropType<EleTooltipProps>,
  /** 是否显示溢出气泡 */
  overflowPopover: {
    type: Boolean,
    default: true
  },
  /** 溢出气泡属性 */
  overflowPopoverProps: Object as PropType<EleTooltipProps>,
  /** 是否鼠标移入展开 */
  hoverOpen: Boolean
};

export type AvatarGroupProps = ExtractPropTypes<typeof avatarGroupProps>;

/**
 * 事件
 */
export const avatarGroupEmits = {
  /** item 点击事件 */
  itemClick: (_item: AvatarItem) => true,
  /** 更多点击事件 */
  moreClick: () => true,
  /** 图片加载失败事件 */
  error: (_option: AvatarErrorOption) => true
};
