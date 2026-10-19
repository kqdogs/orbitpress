/**
 * 位置选择模式
 */
export type SelectMode = 'lnglat' | 'poi' | 'keyword';

/**
 * 行政区数据
 */
export interface City {
  /** 省 */
  province: string;
  /** 市 */
  city: string;
  /** 区 */
  district: string;
  /** 区号 */
  citycode: number;
}

/**
 * 检索结果
 */
export interface PoiItem extends Record<string, any> {
  /** 唯一标识 */
  key?: string;
  /** 地点名称 */
  name?: string;
  /** 详细地址 */
  address?: string;
  /** 纬度 */
  lat?: number;
  /** 经度 */
  lng?: number;
  /** 输入建议的街道 */
  district?: string;
  /** 行政区 */
  city?: City;
}

/**
 * 地图点击事件数据
 */
export interface MapClickData {
  /** 点击的坐标点 */
  lnglat: Required<Pick<PoiItem, 'lat' | 'lng'>>;
}

/**
 * 地图渲染参数
 */
export interface MapRenderOption {
  /** 高德地图密钥 */
  mapKey?: string;
  /** 高德地图版本号 */
  mapVersion?: string;
  /** 缩放级别 */
  zoom?: number;
  /** 中心点 */
  center?: [number, number];
  /** 地图风格 */
  mapStyle?: string | Record<string, any>;
  /** 是否是深色模式 */
  darkMode?: boolean;
  /** 输入建议的城市范围 */
  suggestionCity?: string;
  /** POI检索兴趣点类别 */
  poiType?: string;
  /** POI检索最大数量 */
  poiLimit?: number;
  /** 地图中心图标地址 */
  markerSrc?: string;
  /** 地图加载完成事件 */
  onComplete?: () => void;
  /** 地图移动结束事件 */
  onMoveend?: () => void;
  /** 地图点击事件 */
  onClick?: (data: MapClickData) => void;
  /** 地图创建完成事件 */
  onRendered?: (mapIns: any) => void;
  /** 地图尺寸改变事件 */
  onResizeend?: () => void;
  /** 地图缩放结束事件 */
  onZoomend?: () => void;
  /** 地图拖动结束事件, 和 onMoveend 二选一 */
  onDragend?: () => void;
}

/**
 * 检索附近兴趣点参数
 */
export interface SearchNearByOption {
  /** 经度 */
  lng: number;
  /** 纬度 */
  lat: number;
  /** POI检索半径 */
  poiRadius: number;
  /** POI检索关键字 */
  poiKeywords?: string;
  /** POI检索兴趣点类别 */
  poiType?: string;
}

/**
 * 地图插件
 */
export interface MapPlugin {
  /**
   * 渲染地图
   * @param mapEl 地图容器节点
   * @param option 地图渲染参数
   */
  renderMap: (mapEl: HTMLElement, option: MapRenderOption) => void;
  /**
   * 销毁地图
   */
  destroyMap: () => void;
  /**
   * 获取地图实例
   */
  getMapInstance: () => any;
  /**
   * 获取地图中心点
   */
  getMapCenter: (returnRegions?: boolean) => Promise<PoiItem>;
  /**
   * 设置地图中心点
   * @param lng 经度
   * @param lat 纬度
   * @param zoom 缩放等级
   */
  setMapCenter: (lng?: number, lat?: number, zoom?: number) => void;
  /**
   * 设置地图风格
   * @param style 风格
   */
  setMapStyle: (style?: boolean | string | Record<string, any>) => void;
  /**
   * 显示地图中心标记点
   * @param lng 经度
   * @param lat 纬度
   */
  showCenterMarker: (lng?: number, lat?: number) => void;
  /**
   * 移除地图中心标记点
   */
  removeCenterMarker: () => void;
  /**
   * 根据关键字检索位置
   * @param keyword 关键字
   */
  searchKeyword: (keyword: string) => Promise<PoiItem[]>;
  /**
   * 检索附近兴趣点
   * @param option 参数
   */
  searchNearBy: (option: SearchNearByOption) => Promise<PoiItem[]>;
  /**
   * 通知地图更改容器大小
   */
  checkResize?: () => void;
}

/**
 * 地图插件构造函数
 */
export type MapPluginConstructor = new () => MapPlugin;

/**
 * 实例
 */
export interface MapState {
  /** 上次搜索建议 */
  lastSuggestion?: string;
  /** 选中的搜索建议 */
  selectedSuggestion?: PoiItem | null;
  /** 是否是选中条目移动地图 */
  isItemClickMove?: boolean;
  /** 地图插件实例 */
  mapPluginIns?: MapPlugin | null;
  /** 地图位置 */
  context?: any;
}

/**
 * 国际化
 */
export interface MapLocale {
  title: string;
  placeholder: string;
  message: string;
  ok: string;
  clickMessage: string;
}

export type CenterPoint = PoiItem;
