import type { PropType, ExtractPropTypes } from 'vue';
import type { StyleValue } from '../ele-app/types';
import type { ElAlertProps, ElIconProps } from '../ele-app/el';

/**
 * 属性
 */
export const alertProps = {
  /** 标题 */
  title: String,
  /** 类型 */
  type: String as PropType<ElAlertProps['type']>,
  /** 描述 */
  description: {
    type: [String, Boolean],
    default: ''
  },
  /** 是否可关闭 */
  closable: {
    type: Boolean,
    default: true
  },
  /** 是否居中 */
  center: Boolean,
  /** 自定义关闭按钮文字 */
  closeText: String,
  /** 是否显示图标 */
  showIcon: Boolean,
  /** 主题 */
  effect: String as PropType<ElAlertProps['effect']>,
  /** 图标样式 */
  iconStyle: Object as PropType<StyleValue>,
  /** 图标组件属性 */
  iconProps: Object as PropType<ElIconProps>,
  /** 关闭图标样式 */
  closeIconStyle: Object as PropType<StyleValue>,
  /** 关闭图标组件属性 */
  closeIconProps: Object as PropType<ElIconProps>,
  /** 内容区样式 */
  bodyStyle: Object as PropType<StyleValue>,
  /** 标题样式 */
  titleStyle: Object as PropType<StyleValue>,
  /** 描述样式 */
  descriptionStyle: Object as PropType<StyleValue>,
  /** 过渡动画名称 */
  transitionName: {
    type: String,
    default: 'ele-alert-fade'
  }
};

export type AlertProps = ExtractPropTypes<typeof alertProps>;

/**
 * 事件
 */
export const alertEmits = {
  /** 关闭的事件 */
  close: (_e: MouseEvent) => true
};
