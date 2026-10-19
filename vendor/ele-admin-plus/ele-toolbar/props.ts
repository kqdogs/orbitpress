import type { PropType, ExtractPropTypes, InjectionKey } from 'vue';
import type { StyleValue } from '../ele-app/types';
import type { EleTextProps } from '../ele-app/plus';
import type { ToolbarTheme, ToolbarProvide } from './types';

/**
 * 属性
 */
export const toolbarProps = {
  /** 标题 */
  title: String,
  /** 二级标题 */
  subtitle: String,
  /** 主题风格 */
  theme: {
    type: String as PropType<ToolbarTheme>,
    default: 'plain'
  },
  /** 标题区样式 */
  titleStyle: Object as PropType<StyleValue>,
  /** 内容区样式 */
  bodyStyle: Object as PropType<StyleValue>,
  /** 按钮区样式 */
  toolsStyle: Object as PropType<StyleValue>,
  /** 标题组件属性 */
  titleProps: Object as PropType<EleTextProps>,
  /** 二级标题组件属性 */
  subtitleProps: Object as PropType<EleTextProps>
};

export type ToolbarProps = ExtractPropTypes<typeof toolbarProps>;

/**
 * 共享数据key
 */
export const TOOLBAR_KEY = Symbol('toolbar') as InjectionKey<ToolbarProvide>;
