import type { VNode } from 'vue';
import type { ElFormItemProps, ElRowProps, ElColProps } from '../ele-app/el';
import type { UserComponent } from '../ele-app/types';

/**
 * 表单项 key
 */
export type ProFormItemKey = keyof any;

/**
 * 表单项数据
 */
export interface ProFormItemProps {
  /** 表单项 key */
  key?: ProFormItemKey;
  /** 字段名 */
  prop?: string;
  /** 标题 */
  label?: string;
  /** 是否为必填项 */
  required?: boolean;
  /** 必填校验信息 */
  requiredMessage?: string;
  /** ElFormItem 属性 */
  itemProps?: ElFormItemProps;
  /** ElFormItem 插槽 */
  itemSlots?: Record<string, string>;
  /** 组件类型 */
  type?: string;
  /** 组件属性 */
  props?: Record<string, any>;
  /** 组件插槽 */
  slots?: Record<string, string>;
  /** ElCol 属性 */
  colProps?: ElColProps;
  /** 容器组件是否栅格布局 */
  grid?: boolean | ElColProps;
  /** 容器组件栅格布局 ElRow 属性 */
  rowProps?: ElRowProps;
  /** 自定义组件类型时标识表单项类型 */
  itemType?: 'default' | 'view' | 'container';
  /** 显示条件 */
  vIf?: any;
  /** 容器组件编辑模式是否可拖拽排序 */
  containerDraggable?: boolean;
  /** 初始值 */
  initValue?: any;
  /** 子级 */
  children?: ProFormItemProps[];
}

/**
 * 获取表单项类型组件属性的方法参数
 */
export interface ProFormItemPropsFunctionParams {
  /** 表单项数据 */
  item: ProFormItemProps;
  /** 表单项对应的绑定值 */
  modelValue: any;
  /** 更新绑定值的方法 */
  updateModelValue: (value: any) => void;
  /** 判断表单项是否展示的方法 */
  isShowFormItem: (item: ProFormItemProps) => boolean;
  /** 渲染表单项子级的方法 */
  renderChildren: (
    item: ProFormItemProps,
    sortDisabled?: boolean,
    containerSelectable?: boolean
  ) => string | VNode | Array<string | VNode> | undefined;
}

/**
 * 表单项类型数据
 */
export interface ProFormItemTypeData {
  /** 组件类型 */
  type: string;
  /** 组件 */
  component: UserComponent;
  /** 是否是容器组件 */
  isContainer?: boolean;
  /** 容器组件在编辑模式下是否禁用拖拽功能 */
  sortDisabled?: boolean;
  /** 容器组件在编辑模式下是否可选中 */
  containerSelectable?: boolean;
  /** 是否渲染 label 属性为文本内容 */
  renderLabelText?: boolean;
  /** 组件的默认属性 */
  defaultProps?: (
    params: ProFormItemPropsFunctionParams
  ) => Record<string, any>;
  /** 组件的保留属性 */
  reservedProps?: (
    params: ProFormItemPropsFunctionParams
  ) => Record<string, any>;
  /** 组件的保留插槽 */
  reservedSlots?: (
    params: ProFormItemPropsFunctionParams
  ) => ProFormItemRenderSlots;
  /** 必填校验触发方式 */
  requiredTrigger?: string;
}

/**
 * 渲染表单项组件时的插槽数据
 */
export type ProFormItemRenderSlots = Record<
  string,
  (
    slotProps?: Record<string, any>
  ) => string | VNode | Array<string | VNode> | undefined
>;

/**
 * 屏幕尺寸
 */
export type ScreenSize = 'pc' | 'pad' | 'phone';

/**
 * 国际化
 */
export interface ProFormLocale {
  submit: string;
  reset: string;
  expand: string;
  shrink: string;
  required: string;
}
