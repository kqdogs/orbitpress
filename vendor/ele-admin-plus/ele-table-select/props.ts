import type { PropType, ExtractPropTypes } from 'vue';
import { omit } from '../utils/common';
import type { UserComponent } from '../ele-app/types';
import type { EleProTableProps } from '../ele-app/plus';
import type { DataItem } from '../ele-data-table/types';
import type {
  SelectValue,
  SingleValue,
  BeforeConfirm
} from '../ele-basic-select/types';
import { basicSelectProps, basicSelectEmits } from '../ele-basic-select/props';

/**
 * 属性
 */
export const tableSelectProps = {
  ...omit(basicSelectProps, ['value', 'selectedLabel', 'selected']),
  transition: {
    type: String,
    default: 'el-zoom-in-top'
  },
  /** 选中值 */
  modelValue: {
    type: [String, Number, Boolean, Array] as PropType<SelectValue>,
    default: () => {
      return null;
    }
  },
  /** 是否触发表单验证 */
  validateEvent: {
    type: Boolean,
    default: true
  },
  /** 确认事件钩子 */
  beforeConfirm: Function as PropType<BeforeConfirm<DataItem>>,
  /** 数据值的键名 */
  valueKey: {
    type: String,
    default: 'value'
  },
  /** 显示文本的键名 */
  labelKey: {
    type: String,
    default: 'label'
  },
  /** 缓存的数据 */
  cacheData: Array as PropType<DataItem[]>,
  /** 表格配置 */
  tableProps: Object as PropType<EleProTableProps>,
  /** 表格组件插槽对应名称 */
  tableSlots: Object as PropType<Record<string, string>>,
  /** 内容容器组件 */
  wrapperComponent: [String, Object, Function] as PropType<UserComponent>,
  /** 内容容器组件属性 */
  wrapperComponentProps: Object,
  /** 初始选中值(已废弃) */
  initValue: [Object, Array] as PropType<DataItem | DataItem[]>
};

export type TableSelectProps = ExtractPropTypes<typeof tableSelectProps>;

/**
 * 事件
 */
export const tableSelectEmits = {
  ...basicSelectEmits,
  /** 多选标签移除事件 */
  removeTag: (_value: SingleValue) => true,
  /** 更新选中值 */
  'update:modelValue': (_value: SelectValue) => true,
  /** 选中值改变事件 */
  change: (_value: SelectValue) => true,
  /** 下拉框展开状态改变事件 */
  visibleChange: (_visible: boolean) => true,
  /** 表格行选中事件 */
  select: (_item: DataItem | DataItem[]) => true
};
