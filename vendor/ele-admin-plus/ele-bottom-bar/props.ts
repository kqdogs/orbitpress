import type { PropType, ExtractPropTypes } from 'vue';
import type { StyleValue } from '../ele-app/types';

/**
 * 属性
 */
export const bottomBarProps = {
  /** 内容样式 */
  bodyStyle: Object as PropType<StyleValue>,
  /** 右侧样式 */
  extraStyle: Object as PropType<StyleValue>,
  /** 是否插入到布局的内容节点后 */
  teleported: Boolean
};

export type BottomBarProps = ExtractPropTypes<typeof bottomBarProps>;
