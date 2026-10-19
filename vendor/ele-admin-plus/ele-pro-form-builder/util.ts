import { markRaw } from 'vue';
import { DesktopOutlined, MobileOutlined } from '../icons/index';
import type { ProFormItemProps } from '../ele-pro-form/types';
import type {
  TemplateFormProps,
  HeaderRightToolName,
  ScreenItem
} from './types';
export * from './components/component-data';

/**
 * 默认表头工具栏右侧按钮布局
 */
export const defaultHeaderRightTools: HeaderRightToolName[] = [
  'import',
  'export',
  'clear',
  'preview'
];

/**
 * 屏幕尺寸选项
 */
export const screenItems: ScreenItem[] = [
  { value: 'pc', icon: markRaw(DesktopOutlined) },
  {
    value: 'pad',
    icon: markRaw(MobileOutlined),
    iconStyle: { transform: 'rotate(270deg) scale(1.06)' }
  },
  { value: 'phone', icon: markRaw(MobileOutlined) }
];

/**
 * 表单属性设置的表单项配置
 */
export const defaultConfigFormItems: ProFormItemProps[] = [
  {
    label: '组件尺寸',
    prop: 'size',
    type: 'checkCard',
    props: {
      items: [
        { value: 'large', label: '大型' },
        { value: 'default', label: '默认' },
        { value: 'small', label: '小型' }
      ],
      class: 'ele-pro-form-builder-props-options-check-card'
    },
    itemProps: {
      style: { marginTop: '8px' }
    }
  },
  {
    label: '标签宽度',
    prop: 'labelWidth',
    type: 'inputNumber',
    props: { min: 0 }
  },
  {
    label: '标签位置',
    prop: 'labelPosition',
    type: 'checkCard',
    props: {
      items: [
        { value: 'left', label: '左对齐' },
        { value: 'right', label: '右对齐' },
        { value: 'top', label: '顶部' }
      ],
      class: 'ele-pro-form-builder-props-options-check-card'
    }
  },
  {
    label: '标签后缀',
    prop: 'labelSuffix',
    type: 'input'
  },
  {
    label: '隐藏必填星号',
    prop: 'hideRequiredAsterisk',
    type: 'switch',
    props: { activeValue: true, inactiveValue: false }
  },
  {
    label: '必填星号位置',
    prop: 'requireAsteriskPosition',
    type: 'checkCard',
    props: {
      items: [
        { value: 'left', label: '左侧' },
        { value: 'right', label: '右侧' }
      ],
      class: 'ele-pro-form-builder-props-options-check-card'
    }
  },
  {
    label: '显示校验错误信息',
    prop: 'showMessage',
    type: 'switch',
    props: { activeValue: true, inactiveValue: false }
  },
  {
    label: '行内展示校验错误信息',
    prop: 'inlineMessage',
    type: 'switch',
    props: { activeValue: true, inactiveValue: false }
  },
  {
    label: '样式',
    prop: 'style',
    type: 'proFormBuilderStyleEdit'
  },
  {
    label: '类名',
    prop: 'class',
    type: 'proFormBuilderStyleEdit',
    props: { isClass: true }
  },
  {
    label: '底栏配置',
    prop: 'groupFooterLabel',
    type: 'label',
    props: { class: 'ele-pro-form-builder-props-group-label' }
  },
  {
    label: '是否需要底栏',
    prop: 'footer',
    type: 'switch',
    props: { activeValue: true, inactiveValue: false }
  },
  {
    label: '提交按钮文本',
    prop: 'submitText',
    type: 'input'
  },
  {
    label: '重置按钮文本',
    prop: 'resetText',
    type: 'input'
  },
  {
    label: '底栏样式',
    prop: 'footerStyle',
    type: 'proFormBuilderStyleEdit'
  },
  {
    label: '底栏标签宽度',
    prop: 'footerProps.labelWidth',
    type: 'inputNumber',
    props: { min: 0 }
  },
  {
    label: '底栏表单项样式',
    prop: 'footerProps.style',
    type: 'proFormBuilderStyleEdit'
  },
  {
    label: '底栏表单项类名',
    prop: 'footerProps.class',
    type: 'proFormBuilderStyleEdit',
    props: { isClass: true }
  },
  {
    label: '底栏显示展开收起按钮',
    prop: 'showSearchExpand',
    type: 'switch',
    props: { activeValue: true, inactiveValue: false }
  },
  {
    label: '展开按钮的文字',
    prop: 'searchExpandText',
    type: 'input'
  },
  {
    label: '收起按钮的文字',
    prop: 'searchShrinkText',
    type: 'input'
  },
  {
    label: '高级配置',
    prop: 'groupAdvancedLabel',
    type: 'label',
    props: { class: 'ele-pro-form-builder-props-group-label' }
  },
  {
    label: '开发者选项',
    prop: '__sourceCode',
    type: 'proFormBuilderSourceEdit',
    props: { title: '编辑源码' }
  }
];

/**
 * 表单属性设置的组件预设属性值
 */
export const defaultConfigFormPresetProps: TemplateFormProps = {
  size: 'default',
  labelPosition: 'right',
  requireAsteriskPosition: 'left',
  showMessage: true,
  labelWidth: 80,
  footerColProps: { span: 24 },
  submitText: '提交',
  resetText: '重置',
  searchExpandText: '展开',
  searchShrinkText: '收起'
};
