import type { PropType, ExtractPropTypes } from 'vue';
import type { StyleValue } from '../ele-app/types';
import type { ElEmptyProps } from '../ele-app/el';
import type { EleModalProps } from '../ele-app/plus';
import type {
  SelectMode,
  PoiItem,
  MapPluginConstructor,
  MapLocale
} from './types';

/**
 * 属性
 */
export const mapProps = {
  /** 地图的高度 */
  height: {
    type: String,
    default: '460px'
  },
  /** 地图默认中心点 */
  center: Array as unknown as PropType<[number, number]>,
  /** 地图初始缩放级别 */
  zoom: {
    type: Number,
    default: 11
  },
  /** 地图选中后缩放级别 */
  selectedZoom: {
    type: Number,
    default: 17
  },
  /** POI检索最大数量 */
  poiLimit: {
    type: Number,
    default: 30
  },
  /** POI检索兴趣点类别 */
  poiType: String,
  /** POI检索关键字 */
  poiKeywords: String,
  /** POI检索半径 */
  poiRadius: {
    type: Number,
    default: 1000
  },
  /** 是否返回行政区 */
  returnRegions: Boolean,
  /** 是否强制选择 */
  required: {
    type: Boolean,
    default: true
  },
  /** 强制选择提示文本 */
  message: String,
  /** 输入建议的城市范围 */
  suggestionCity: String,
  /** 搜索框提示文本 */
  searchPlaceholder: String,
  /** 地图中心图标地址 */
  markerSrc: String,
  /** 高德地图密钥 */
  mapKey: String,
  /** 高德地图版本号 */
  mapVersion: {
    type: String,
    default: '2.0'
  },
  /** 地图风格 */
  mapStyle: [String, Object] as PropType<string | Record<string, any>>,
  /** 是否暗黑主题 */
  darkMode: Boolean,
  /** 完成按钮文字 */
  okText: String,
  /** 空组件属性 */
  emptyProps: Object as PropType<ElEmptyProps>,
  /** 自定义搜索栏样式 */
  searchStyle: Object as PropType<StyleValue>,
  /** 位置选择模式 */
  mode: {
    type: String as PropType<SelectMode>,
    default: 'poi'
  },
  /** 非关键字模式是否显示搜索框 */
  filterable: {
    type: Boolean,
    default: true
  },
  /** 强制选择点击地图提示文本 */
  clickMessage: String,
  /** 回显选中的位置 */
  selected: Object as PropType<PoiItem>,
  /** 侧栏容器样式 */
  sideStyle: Object as PropType<StyleValue>,
  /** 地图插件 */
  mapPlugin: [Function, Object] as PropType<MapPluginConstructor>
};

export const mapPickerProps = {
  ...mapProps,
  /** 弹窗是否显示 */
  modelValue: Boolean,
  /** 弹窗参数 */
  modalProps: Object as PropType<Omit<EleModalProps, 'modelValue'>>,
  /** 是否开启响应式 */
  responsive: {
    type: Boolean,
    default: null
  },
  /** 国际化 */
  locale: Object as PropType<Partial<MapLocale>>,
  /** 是否使用关键字检索模式, 默认POI检索模式 */
  keywordMode: Boolean,
  /** 自定义header样式 */
  headerStyle: Object as PropType<StyleValue>
};

export type MapPickerProps = ExtractPropTypes<typeof mapPickerProps>;

export type MapProps = ExtractPropTypes<typeof mapProps>;

/**
 * 事件
 */
export const mapPickerEmits = {
  /** 选择完成事件 */
  done: (_result: PoiItem) => true,
  /** 地图渲染完成事件 */
  mapDone: (_ins: any) => true,
  /** 弹窗打开事件 */
  open: () => true,
  /** 弹窗关闭事件 */
  closed: () => true,
  /** 更新弹窗打开状态 */
  'update:modelValue': (_value: boolean) => true
};

export type MapPropKeys = Array<keyof typeof mapProps>;

/**
 * 地图组件属性名
 */
export const mapPropKeys: MapPropKeys = Object.keys(mapProps) as any;
