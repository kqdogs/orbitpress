import type { PropType, ExtractPropTypes } from 'vue';
import type { UserComponent } from '../ele-app/types';
import type { EleSplitPanelProps } from '../ele-app/plus';
import type { EleProFormProps } from '../ele-app/plusx';
import type {
  ProFormItemProps,
  ProFormItemTypeData
} from '../ele-pro-form/types';
import type {
  TemplateFormProps,
  ComponentGroup,
  TemplateItem,
  HeaderRightToolName
} from './types';

/**
 * 属性
 */
export const proFormBuilderProps = {
  /** 配置数据 */
  modelValue: Object as PropType<EleProFormProps>,
  /** 顶栏右侧操作按钮顺序 */
  headerTools: {
    type: [Boolean, Array] as PropType<boolean | HeaderRightToolName[]>,
    default: () => void 0
  },
  /** 组件库数据 */
  componentData: Array as PropType<ComponentGroup[]>,
  /** 模板库数据 */
  templateData: Array as PropType<TemplateItem[]>,
  /** 表单属性设置的表单项配置 */
  configFormItems: Array as PropType<ProFormItemProps[]>,
  /** 表单属性设置的组件预设属性值 */
  configFormPresetProps: Object as PropType<TemplateFormProps>,
  /** 初始添加时的表单属性 */
  proFormInitialProps: Object as PropType<TemplateFormProps>,
  /** 自定义分割面板组件属性 */
  splitPanelProps: Object as PropType<EleSplitPanelProps>,
  /** 自定义右侧分割面板组件属性 */
  rightSplitPanelProps: Object as PropType<EleSplitPanelProps>,
  /** 高级表单组件 */
  proFormComponent: [String, Object, Function] as PropType<UserComponent>,
  /** 代码编辑器组件 */
  codeEditerComponent: [String, Object, Function] as PropType<UserComponent>,
  /** JSON 编辑器组件 */
  jsonEditerComponent: [String, Object, Function] as PropType<UserComponent>,
  /** 富文本编辑器组件 */
  htmlEditerComponent: [String, Object, Function] as PropType<UserComponent>,
  /** 代码查看器组件 */
  codeViewerComponent: [String, Object, Function] as PropType<UserComponent>,
  /** 高级表单组件类型数据 */
  itemTypeData: Array as PropType<ProFormItemTypeData[]>,
  /** 远程数据源请求工具 */
  httpRequest: [Object, Function]
};

export type ProFormBuilderProps = ExtractPropTypes<typeof proFormBuilderProps>;

/**
 * 事件
 */
export const proFormBuilderEmits = {
  'update:modelValue': (_config: EleProFormProps) => true,
  previewFormSubmit: (_data: Record<string, any>) => true
};
