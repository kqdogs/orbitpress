import type { PropType, ExtractPropTypes } from 'vue';
import type { StyleValue } from '../ele-app/types';
import type { ElProgressProps, ElImageProps } from '../ele-app/el';
import type { EleImageViewerProps } from '../ele-app/plus';
import type {
  UploadItem,
  UploadLocale,
  EditUploadResult,
  ListType,
  BeforeUploadClick,
  BeforeItemEdit,
  BeforePreview
} from './types';

/**
 * 属性
 */
export const uploadListProps = {
  /** 已上传列表 */
  modelValue: Array as PropType<UploadItem[]>,
  /** 是否只读 */
  readonly: Boolean,
  /** 是否禁用 */
  disabled: Boolean,
  /** 是否支持点击预览打开图片预览组件 */
  preview: {
    type: Boolean,
    default: true
  },
  /** 最大上传数量 */
  limit: Number,
  /** 是否支持多选文件 */
  multiple: Boolean,
  /** 是否启用拖拽上传 */
  drag: Boolean,
  /** 接受上传的文件类型 */
  accept: {
    type: String,
    default: 'image/png,image/jpeg'
  },
  /** 自定义条目样式 */
  itemStyle: [Object, Boolean] as PropType<StyleValue | false>,
  /** 自定义上传按钮样式 */
  buttonStyle: {
    type: [Object, Boolean] as PropType<StyleValue | false>,
    default: null
  },
  /** 是否开启拖拽排序 */
  sortable: {
    type: [Boolean, Object] as PropType<boolean | Record<keyof any, any>>,
    default: true
  },
  /** 自定义图片属性 */
  imageProps: Object as PropType<ElImageProps>,
  /** 自定义进度条属性 */
  progressProps: Object as PropType<ElProgressProps>,
  /** 自定义图片预览属性 */
  previewProps: Object as PropType<EleImageViewerProps>,
  /** 是否开启底部预览和修改的操作按钮 */
  tools: Boolean,
  /** 列表显示样式 */
  listType: String as PropType<ListType>,
  /** 上传按钮点击前的钩子 */
  beforeUploadClick: Function as PropType<BeforeUploadClick>,
  /** 修改按钮点击前的钩子 */
  beforeItemEdit: Function as PropType<BeforeItemEdit>,
  /** 预览按钮点击前的钩子 */
  beforePreview: Function as PropType<BeforePreview>,
  /** 国际化 */
  locale: Object as PropType<Partial<UploadLocale>>
};

export type UploadListProps = ExtractPropTypes<typeof uploadListProps>;

/**
 * 事件
 */
export const uploadListEmits = {
  /** 更新绑定值 */
  'update:modelValue': (_value: UploadItem[]) => true,
  /** item 点击事件 */
  itemClick: (_item: UploadItem) => true,
  /** 上传事件 */
  upload: (_item: UploadItem) => true,
  /** item 移除事件 */
  remove: (_item: UploadItem) => true,
  /** item 上传失败重试事件 */
  retry: (_item: UploadItem) => true,
  /** item 修改上传事件 */
  editUpload: (_result: EditUploadResult) => true,
  /** item 预览事件 */
  preview: (_item: UploadItem) => true
};
