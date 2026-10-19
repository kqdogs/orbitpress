import type { PropType, ExtractPropTypes } from 'vue';
import type { StyleValue } from '../ele-app/types';
import type { ElInputProps, ElTagProps } from '../ele-app/el';
import type { EleTooltipProps } from '../ele-app/plus';
import type {
  SelectValue,
  SelectedItem,
  PopperType,
  PopperProps
} from './types';

/**
 * 属性
 */
export const basicSelectProps = {
  /** 选中值 */
  value: {
    type: [String, Number, Boolean, Array] as PropType<SelectValue>,
    default: () => {
      return null;
    }
  },
  /** 单选选中展示文本 */
  selectedLabel: String,
  /** 多选选中数据 */
  selected: Array as PropType<SelectedItem[]>,
  /** 下拉组件是否显示 */
  visible: Boolean,
  /** 是否多选 */
  multiple: Boolean,
  /** 是否禁用 */
  disabled: Boolean,
  /** 尺寸 */
  size: String as PropType<ElInputProps['size']>,
  /** 是否支持清除 */
  clearable: Boolean,
  /** 无选中时提示文本 */
  placeholder: String,
  /** 多选标签最大显示数量 */
  maxTagCount: Number,
  /** 多选标签最大显示文本长度 */
  maxTagTextLength: Number,
  /** 多选标签类型 */
  tagType: {
    type: String as PropType<ElTagProps['type']>,
    default: 'info'
  },
  /** 是否在输入框获得焦点后自动弹出选项菜单 */
  automaticDropdown: Boolean,
  /** 是否可以筛选 */
  filterable: Boolean,
  /** 自定义类名 */
  selectClass: String,
  /** 自定义样式 */
  selectStyle: [Object, String] as PropType<StyleValue | string>,
  /** 自定义输入框样式 */
  inputStyle: Object as PropType<StyleValue>,
  /** 自定义多选标签容器样式 */
  selectTagsStyle: Object as PropType<StyleValue>,
  /** 下拉组件类名 */
  popperClass: String,
  /** 下拉组件宽度 */
  popperWidth: [Number, String],
  /** 下拉组件高度 */
  popperHeight: [Number, String],
  /** 下拉组件类型 */
  popperType: String as PropType<PopperType>,
  /** 下拉组件属性 */
  popperProps: Object as PropType<PopperProps>,
  /** 下拉组件插槽对应名称 */
  popperSlots: Object as PropType<Record<string, string>>,
  /** 下拉组件标题 */
  popperTitle: String,
  /** 是否将下拉组件插入 body */
  teleported: {
    type: Boolean,
    default: true
  },
  /** 始终渲染下拉组件 */
  persistent: {
    type: Boolean,
    default: true
  },
  /** 下拉框位置 */
  placement: {
    type: String as PropType<EleTooltipProps['placement']>,
    default: 'bottom-start'
  },
  /** 下拉框渐变动画 */
  transition: {
    type: String,
    default: 'el-fade-in-linear'
  },
  /** popper.js 参数 */
  popperOptions: Object as PropType<EleTooltipProps['popperOptions']>,
  /** 是否开启响应式 */
  responsive: {
    type: Boolean,
    default: null
  }
};

export type BasicSelectProps = ExtractPropTypes<typeof basicSelectProps>;

/**
 * 事件
 */
export const basicSelectEmits = {
  /** 更新下拉框显示状态 */
  'update:visible': (_visible: boolean) => true,
  /** 多选标签移除事件 */
  removeTag: (_item: SelectedItem) => true,
  /** 清空事件 */
  clear: () => true,
  /** 获取焦点事件 */
  focus: (_e: FocusEvent) => true,
  /** 失去焦点事件 */
  blur: (_e: FocusEvent) => true,
  /** 筛选输入框值改变事件 */
  filterChange: (_value: string) => true
};
