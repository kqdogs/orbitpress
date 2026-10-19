import type { PropType, ExtractPropTypes } from 'vue';
import type { TabSize, TabType } from '../ele-tabs/types';

/**
 * 属性
 */
export const tabWrapProps = {
  /** 尺寸 */
  size: String as PropType<TabSize>,
  /** 风格类型 */
  type: String as PropType<TabType>
};

export type TabWrapProps = ExtractPropTypes<typeof tabWrapProps>;
