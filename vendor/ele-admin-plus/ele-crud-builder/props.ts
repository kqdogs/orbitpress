import type { PropType, ExtractPropTypes } from 'vue';
import type { UserComponent } from '../ele-app/types';
import type { EleSplitPanelProps } from '../ele-app/plus';
import type { EleCrudProps, EleProFormBuilderProps } from '../ele-app/plusx';
import type {
  ProFormItemProps,
  ProFormItemTypeData
} from '../ele-pro-form/types';
import type { HeaderRightToolName, TemplateItem } from './types';

/**
 * 属性
 */
export const crudBuilderProps = {
  /** 增删改查配置 */
  modelValue: Object as PropType<EleCrudProps>,
  /** 顶栏右侧操作按钮顺序 */
  headerTools: {
    type: [Boolean, Array] as PropType<boolean | HeaderRightToolName[]>,
    default: () => void 0
  },
  /** 模板库数据 */
  templateData: Array as PropType<TemplateItem[]>,
  /** 页面设置的表单项配置 */
  pageConfigFormItems: Array as PropType<ProFormItemProps[]>,
  /** 字段编辑的表单项配置 */
  fieldEditFormItems: Array as PropType<ProFormItemProps[]>,
  /** 自定义分割面板组件属性 */
  splitPanelProps: Object as PropType<EleSplitPanelProps>,
  /** 增删改查组件 */
  crudComponent: [String, Object, Function] as PropType<UserComponent>,
  /** 高级表单组件 */
  proFormComponent: [String, Object, Function] as PropType<UserComponent>,
  /** 表单构建组件 */
  proFormBuilderComponent: [
    String,
    Object,
    Function
  ] as PropType<UserComponent>,
  /** 表单构建组件属性 */
  proFormBuilderProps: Object as PropType<EleProFormBuilderProps>,
  /** 代码编辑器组件 */
  codeEditerComponent: [String, Object, Function] as PropType<UserComponent>,
  /** JSON 编辑器组件 */
  jsonEditerComponent: [String, Object, Function] as PropType<UserComponent>,
  /** 代码查看器组件 */
  codeViewerComponent: [String, Object, Function] as PropType<UserComponent>,
  /** 高级表单组件类型数据 */
  itemTypeData: Array as PropType<ProFormItemTypeData[]>,
  /** 远程数据源请求工具 */
  httpRequest: [Object, Function]
};

export type CrudBuilderProps = ExtractPropTypes<typeof crudBuilderProps>;

/**
 * 事件
 */
export const crudBuilderEmits = {
  'update:modelValue': (_config?: EleCrudProps) => true
};
