import type { PropType, ExtractPropTypes } from 'vue';
import { omit } from '../utils/common';
import type { UserComponent } from '../ele-app/types';
import type {
  SelectValue,
  SingleValue,
  BeforeConfirm
} from '../ele-basic-select/types';
import type {
  ShowCheckedStrategy,
  TreeData,
  TreeProps,
  DataItem
} from './types';
import { basicSelectProps, basicSelectEmits } from '../ele-basic-select/props';

/**
 * 属性
 */
export const treeSelectProps = {
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
  /** 缓存的数据 */
  cacheData: Array as PropType<TreeData>,
  /** 树配置 */
  treeProps: Object as PropType<TreeProps>,
  /** 多选标签显示策略 */
  showCheckedStrategy: String as PropType<ShowCheckedStrategy>,
  /** 多选值绑定策略 */
  checkedValueStrategy: Boolean,
  /** 内容容器组件 */
  wrapperComponent: [String, Object, Function] as PropType<UserComponent>,
  /** 内容容器组件属性 */
  wrapperComponentProps: Object
};

export type TreeSelectProps = ExtractPropTypes<typeof treeSelectProps>;

/**
 * 事件
 */
export const treeSelectEmits = {
  ...basicSelectEmits,
  /** 多选标签移除事件 */
  removeTag: (_value: SingleValue) => true,
  /** 更新选中值 */
  'update:modelValue': (_value: SelectValue) => true,
  /** 选中值改变事件 */
  change: (_value: SelectValue) => true,
  /** 下拉框展开状态改变事件 */
  visibleChange: (_visible: boolean) => true,
  /** 选择完成事件 */
  select: (_item: DataItem | DataItem[]) => true
};
