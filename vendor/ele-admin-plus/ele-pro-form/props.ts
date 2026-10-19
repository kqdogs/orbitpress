import type { PropType, CSSProperties, ExtractPropTypes } from 'vue';
import { formProps, formEmits } from 'element-plus';
import type {
  ElRowProps,
  ElColProps,
  ElFormItemProps,
  ElButtonProps,
  ElLinkProps
} from '../ele-app/el';
import { pick } from '../utils/common';
import type {
  ProFormItemKey,
  ProFormItemProps,
  ProFormItemTypeData,
  ProFormItemRenderSlots,
  ScreenSize,
  ProFormLocale
} from './types';

/**
 * 属性
 */
export const proFormProps = {
  ...formProps,
  /** 标签宽度 */
  labelWidth: {
    type: [String, Number],
    default: '80px'
  },
  /** 表单项 */
  items: Array as PropType<ProFormItemProps[]>,
  /** 是否栅格布局 */
  grid: [Boolean, Object] as PropType<boolean | ElColProps>,
  /** 栅格布局时更多 ElRow 属性 */
  rowProps: Object as PropType<ElRowProps>,
  /** 是否需要底栏 */
  footer: Boolean,
  /** 底栏 ElFormItem 属性 */
  footerProps: Object as PropType<ElFormItemProps>,
  /** 底栏 ElFormItem 插槽 */
  footerSlots: Object,
  /** 栅格布局时底栏 ElCol 属性 */
  footerColProps: Object as PropType<ElColProps>,
  /** 自动计算底栏栅格份数 */
  autoFooterCol: Boolean,
  /** 底栏样式 */
  footerStyle: Object as PropType<CSSProperties>,
  /** 提交按钮文本 */
  submitText: String,
  /** 重置按钮文本 */
  resetText: String,
  /** 提交按钮属性 */
  submitButtonProps: Object as PropType<ElButtonProps>,
  /** 重置按钮属性 */
  resetButtonProps: Object as PropType<ElButtonProps>,
  /** 是否在底栏显示表单展开收起按钮 */
  showSearchExpand: Boolean,
  /** 展开和收起按钮属性 */
  searchExpandButtonProps: Object as PropType<ElLinkProps>,
  /** 展开按钮的文字 */
  searchExpandText: String,
  /** 收起按钮的文字 */
  searchShrinkText: String,
  /** 搜索表单展开状态 */
  searchExpand: Boolean,
  /** 阻止表单原生的表单提交事件 */
  preventFormSubmit: {
    type: Boolean,
    default: true
  },
  /** 编辑模式 */
  editable: Boolean,
  /** 屏幕尺寸 */
  screenSize: String as PropType<ScreenSize>,
  /** 编辑模式选中的表单项 */
  activeItemKey: [String, Number] as PropType<ProFormItemKey>,
  /** 组件类型数据 */
  itemTypeData: Array as PropType<ProFormItemTypeData[]>,
  /** 远程数据源请求工具 */
  httpRequest: [Object, Function],
  /** 国际化 */
  locale: Object as PropType<Partial<ProFormLocale>>
};

export type ProFormProps = ExtractPropTypes<typeof proFormProps>;

/**
 * 事件
 */
export const proFormEmits = {
  ...formEmits,
  'update:searchExpand': (_expand: boolean) => true,
  updateValue: (_prop: string, _value: unknown) => true,
  'update:items': (_items: ProFormItemProps[]) => true,
  'update:activeItemKey': (_activeKey: ProFormItemKey) => true,
  submit: (_model: Record<string, any>) => true,
  reset: () => true
};

/**
 * 表单项数据渲染组件属性
 */
export const childrenRenderProps = {
  ...pick(proFormProps, [
    'model',
    'items',
    'rules',
    'grid',
    'rowProps',
    'editable',
    'screenSize',
    'activeItemKey',
    'itemTypeData',
    'httpRequest'
  ]),
  /** 额外的 ElCol 属性 */
  contentExtraColProps: Object as PropType<ElColProps>,
  /** 自动计算额外的 ElCol 份数 */
  autoContentExtraCol: {
    type: Boolean,
    required: false
  },
  /** 父级表单项 */
  parentItem: Object as PropType<ProFormItemProps>,
  /** 全部的表单项 */
  formItems: Array as PropType<ProFormItemProps[]>,
  /** 搜索表单展开状态 */
  searchExpand: Boolean,
  /** 编辑模式禁用子级排序 */
  sortDisabled: Boolean,
  /** 编辑模式父级拖拽容器是否可点击选中 */
  containerSelectable: Boolean,
  /** 直接传递插槽数据 */
  slots: Object as PropType<ProFormItemRenderSlots>,
  /** 获取表单组件的组件引用数据方法 */
  getProFormRefs: Function as PropType<() => Record<string, any>>,
  /** 获取并缓存代码解析结果方法 */
  getAndCacheCode: Function as PropType<(code: string, codeResult: any) => any>,
  /** 更新表单数据属性值方法 */
  updateItemValue: Function as PropType<(prop: string, value: any) => void>,
  /** 编辑模式更新表单项数据方法 */
  updateItemsData: Function as PropType<
    (items: ProFormItemProps[], parentItem?: ProFormItemProps) => void
  >,
  /** 更新编辑模式选中项方法 */
  updateActiveItemKey: Function as PropType<
    (activeKey?: ProFormItemKey) => void
  >,
  /** 默认的必填提示文本 */
  requiredLang: String,
  /** 兼容旧版 */
  item: Object as PropType<ProFormItemProps>
};

export type ChildrenRenderProps = ExtractPropTypes<typeof childrenRenderProps>;

/**
 * 渲染表单项数据方法参数
 */
export type RenderProFormContentProps = Partial<
  Omit<ChildrenRenderProps, 'item'>
>;

/**
 * 渲染表单项组件方法参数
 */
export interface RenderProFormItemProps extends Pick<
  RenderProFormContentProps,
  | 'model'
  | 'rules'
  | 'formItems'
  | 'searchExpand'
  | 'editable'
  | 'screenSize'
  | 'activeItemKey'
  | 'updateItemValue'
  | 'updateItemsData'
  | 'updateActiveItemKey'
  | 'getProFormRefs'
  | 'getAndCacheCode'
  | 'itemTypeData'
  | 'httpRequest'
  | 'slots'
  | 'requiredLang'
> {
  /** 循环的 key */
  key?: ProFormItemKey;
  /** 表单项 */
  item: ProFormItemProps;
}

/**
 * 渲染表单项组件时的插槽额外参数
 */
export type RenderSlotProFormParam = Partial<
  Omit<
    ChildrenRenderProps,
    'items' | 'contentExtraColProps' | 'sortDisabled' | 'containerSelectable'
  >
>;
