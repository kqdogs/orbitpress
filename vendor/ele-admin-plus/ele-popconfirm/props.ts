import type { PropType, ExtractPropTypes, EmitsToProps } from 'vue';
import type { StyleValue } from '../ele-app/types';
import type {
  ElPopconfirmProps,
  ElIconProps,
  ElButtonProps
} from '../ele-app/el';
import type { ElePopoverProps } from '../ele-app/plus';
import { popoverProps, popoverEmits } from '../ele-popover/props';

/**
 * 属性
 */
export const popconfirmProps = {
  ...popoverProps,
  trigger: {
    type: String as PropType<ElePopoverProps['trigger']>,
    default: 'click'
  },
  /** 确认按钮文字 */
  confirmButtonText: String,
  /** 取消按钮文字 */
  cancelButtonText: String,
  /** 确认按钮类型 */
  confirmButtonType: {
    type: String as PropType<ElPopconfirmProps['confirmButtonType']>,
    default: 'primary'
  },
  /** 取消按钮类型 */
  cancelButtonType: {
    type: String as PropType<ElPopconfirmProps['cancelButtonType']>,
    default: 'text'
  },
  /** 自定义图标 */
  icon: [String, Object, Function] as PropType<ElPopconfirmProps['icon']>,
  /** 图标颜色 */
  iconColor: {
    type: String,
    default: '#f90'
  },
  /** 是否隐藏图标 */
  hideIcon: Boolean,
  /** 是否隐藏确认按钮 */
  hideConfirmButton: Boolean,
  /** 是否隐藏取消按钮 */
  hideCancelButton: Boolean,
  /** 图标样式 */
  iconStyle: Object as PropType<StyleValue>,
  /** 图标组件属性 */
  iconProps: Object as PropType<ElIconProps>,
  /** 确认按钮组件属性 */
  confirmButtonProps: Object as PropType<ElButtonProps>,
  /** 取消按钮组件属性 */
  cancelButtonProps: Object as PropType<ElButtonProps>,
  /** 底栏样式 */
  footerStyle: Object as PropType<StyleValue>
};

export type PopconfirmProps = ExtractPropTypes<typeof popconfirmProps>;

/**
 * 事件
 */
export const popconfirmEmits = {
  ...popoverEmits,
  confirm: (_e: MouseEvent) => true,
  cancel: (_e: MouseEvent) => true
};

export type PopconfirmEmitsProps = EmitsToProps<typeof popconfirmEmits>;

export type PopconfirmPropsAndEmits = PopconfirmProps & PopconfirmEmitsProps;
