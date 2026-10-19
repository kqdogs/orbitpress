import type { ExtractPropTypes, PropType } from 'vue';
import type { StyleValue } from '../ele-app/types';
import type { ElCardProps } from '../ele-app/el';

/**
 * 属性
 */
export const cardProps = {
  /** 标题 */
  header: String,
  /** 标题类名 */
  headerClass: String,
  /** 页脚 */
  footer: String,
  /** 页脚类名 */
  footerClass: String,
  /** 主体样式 */
  bodyStyle: Object as PropType<StyleValue>,
  /** 主体类名 */
  bodyClass: String,
  /** 阴影 */
  shadow: String as PropType<ElCardProps['shadow']>,
  /** 边框 */
  bordered: Boolean,
  /** 标题栏样式 */
  headerStyle: Object as PropType<StyleValue>,
  /** 标题样式 */
  titleStyle: Object as PropType<StyleValue>,
  /** 页脚样式 */
  footerStyle: Object as PropType<StyleValue>,
  /** 是否可折叠 */
  collapsable: [Boolean, String] as PropType<boolean | 'header'>,
  /** 是否折叠 */
  collapse: Boolean,
  /** 折叠按钮样式 */
  collapseIconStyle: Object as PropType<StyleValue>,
  /** 是否是搜索表单卡片 */
  searchForm: Boolean,
  /** 内部表格是否弹性布局 */
  flexTable: [Boolean, String] as PropType<boolean | 'auto'>
};

export type CardProps = ExtractPropTypes<typeof cardProps>;

/**
 * 事件
 */
export const cardEmits = {
  /** 折叠展开事件 */
  collapseChange: (_collapse: boolean) => true
};
