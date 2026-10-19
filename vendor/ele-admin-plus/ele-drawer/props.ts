import type { PropType, ExtractPropTypes, EmitsToProps } from 'vue';
import {
  drawerProps as elDrawerProps,
  drawerEmits as elDrawerEmits
} from 'element-plus';
import type { EleLoadingProps } from '../ele-app/plus';
import type { StyleValue } from '../ele-app/types';

/**
 * 属性
 */
export const drawerProps = {
  ...elDrawerProps,
  appendToBody: {
    type: Boolean,
    default: true
  },
  /** 是否限制在主体内部 */
  inner: Boolean,
  /** 自定义标题样式 */
  headerStyle: Object as PropType<StyleValue>,
  /** 标题样式 */
  titleStyle: Object as PropType<StyleValue>,
  /** 自定义主体样式 */
  bodyStyle: Object as PropType<StyleValue>,
  /** 自定义底部样式 */
  footerStyle: Object as PropType<StyleValue>,
  /** 自定义关闭按钮样式 */
  closeBtnStyle: Object as PropType<StyleValue>,
  /** 主体类名 */
  drawerBodyClass: String,
  /** 是否是失活状态 */
  isDeactivated: Boolean,
  /** 异步内容组件时加载状态 */
  compLoading: Boolean,
  /** 加载状态 */
  loading: Boolean,
  /** 加载组件属性 */
  loadingProps: Object as PropType<EleLoadingProps>,
  /** 是否开启响应式 */
  responsive: {
    type: Boolean,
    default: null
  },
  /** 内部表格弹性布局 */
  flexTable: [Boolean, String] as PropType<boolean | 'auto'>,
  /** 是否是在内容区添加自定义底栏 */
  customFooter: Boolean,
  /** 是否是表单抽屉 */
  form: Boolean
};

export type DrawerProps = ExtractPropTypes<typeof drawerProps>;

/**
 * 事件
 */
export const drawerEmits = {
  ...elDrawerEmits
};

export type DrawerEmitsProps = EmitsToProps<typeof drawerEmits>;

export type DrawerPropsAndEmits = DrawerProps & DrawerEmitsProps;

/**
 * 抽屉组件属性名
 */
export type ElDrawerPropKeys = Array<keyof typeof elDrawerProps>;

export const elDrawerPropKeys: ElDrawerPropKeys = Object.keys(
  elDrawerProps
) as any;
