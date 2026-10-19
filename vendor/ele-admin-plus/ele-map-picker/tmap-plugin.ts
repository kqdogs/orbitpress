import { debounce } from '../utils/common';
import type {
  MapPlugin,
  MapRenderOption,
  SearchNearByOption,
  PoiItem
} from './types';
import { defaultMarkerSrc } from './util';
/** 深色主题 */
const darkStyle = 'black';

/**
 * 天地图插件
 */
export class TMapPlugin implements MapPlugin {
  /** 地图实例 */
  mapIns?: any;
  /** POI检索实例 */
  placeSearchIns?: any;
  /** 地图中心标记点 */
  centerMarker?: any;
  /** 检索附近回调 */
  searchNearByCallback?: (result: any) => void;

  constructor() {}

  /**
   * 处理POI数据
   * @param item 数据
   */
  formatPOI(item: any): PoiItem {
    const name = item.name || '';
    const address = item.address || '';
    const [lng, lat] = (item.lonlat || '').split(',');
    const key = [name, address, lat, lng].join();
    return {
      ...item,
      name,
      address,
      lat,
      lng,
      district: address,
      key
    };
  }

  /**
   * 渲染地图
   * @param mapEl 地图容器节点
   * @param option 地图渲染参数
   */
  renderMap(mapEl: HTMLElement, option: MapRenderOption) {
    /** 销毁地图 */
    this.destroyMap();

    // @ts-ignore
    if (!T) {
      console.error('T is not defined');
      return;
    }

    /** 创建地图实例 */
    // @ts-ignore
    this.mapIns = new T.Map(mapEl);

    /** 地图加载完成事件 */
    this.mapIns.addEventListener('load', () => {
      option.onComplete && option.onComplete();
    });

    /** 设置初始中心点和缩放等级 */
    const defaultZoom = option.zoom ?? 11;
    if (option.center) {
      // @ts-ignore
      const point = new T.LngLat(option.center[0], option.center[1]);
      this.mapIns.centerAndZoom(point, defaultZoom);
    } else {
      // @ts-ignore
      const defaultCenter = new T.LngLat(116.40769, 39.89945);
      this.mapIns.centerAndZoom(defaultCenter, defaultZoom);
    }

    /** 设置初始地图风格 */
    const defaultStyle = option.darkMode ? darkStyle : void 0;
    const mapStyle = option.mapStyle || defaultStyle;
    if (mapStyle) {
      this.mapIns.setStyle(mapStyle);
    }

    /** 创建地图中心标记点 */
    // @ts-ignore
    this.centerMarker = new T.Marker(
      // @ts-ignore
      new T.LngLat(116.404, 39.915),
      {
        // @ts-ignore
        icon: new T.Icon({
          iconUrl: option.markerSrc ?? defaultMarkerSrc,
          // @ts-ignore
          iconSize: new T.Point(26, 36.5),
          // @ts-ignore
          iconAnchor: new T.Point(13, 36.5)
        })
      }
    );

    /** 创建POI检索实例 */
    // @ts-ignore
    this.placeSearchIns = new T.LocalSearch(this.mapIns, {
      pageCapacity: option.poiLimit,
      onSearchComplete: (result: any) => {
        this.searchNearByCallback && this.searchNearByCallback(result);
      }
    });

    /** 地图尺寸改变事件 */
    this.mapIns.addEventListener(
      'resize',
      debounce(() => {
        option.onResizeend && option.onResizeend();
      }, 350)
    );

    /** 地图缩放结束事件 */
    this.mapIns.addEventListener('zoomend', () => {
      option.onZoomend && option.onZoomend();
    });

    /** 地图拖动结束事件 */
    this.mapIns.addEventListener('dragend', () => {
      option.onDragend && option.onDragend();
    });

    /** 地图点击事件 */
    this.mapIns.addEventListener('click', (e: any) => {
      option.onClick && option.onClick(e);
    });

    /** 地图创建完成事件 */
    option.onRendered && option.onRendered(this.mapIns);
  }

  /**
   * 销毁地图
   */
  destroyMap() {
    this.centerMarker = null;
    this.placeSearchIns = null;
    this.mapIns = null;
  }

  /**
   * 获取地图实例
   */
  getMapInstance() {
    return this.mapIns;
  }

  /**
   * 获取地图中心点
   */
  getMapCenter(returnRegions?: boolean): Promise<PoiItem> {
    return new Promise<PoiItem>((resolve, reject) => {
      if (!this.mapIns) {
        reject(new Error('map instance is null'));
        return;
      }
      const centerPoint = this.mapIns.getCenter() || {};
      if (!returnRegions) {
        resolve(centerPoint);
        return;
      }
      // 获取行政区
      // @ts-ignore
      const geo = new T.Geocoder();
      geo.getLocation(centerPoint, (result: any) => {
        const status = result.getStatus();
        if (status == 0) {
          const address = result.getAddressComponent() || {};
          const addressComponent = address.addressComponent || {};
          resolve({
            ...centerPoint,
            address: result.getAddress(),
            city: {
              district: addressComponent.county,
              ...addressComponent
            }
          });
        } else {
          reject(new Error(`${status} ${result.getMsg()}`));
        }
      });
    });
  }

  /**
   * 设置地图中心点
   * @param lng 经度
   * @param lat 纬度
   * @param zoom 缩放等级
   */
  setMapCenter(lng?: number, lat?: number, zoom?: number) {
    if (lng == null || lat == null) {
      return;
    }
    if (!this.mapIns) {
      console.error('map instance is null');
      return;
    }
    // @ts-ignore
    const point = new T.LngLat(lng, lat);
    this.mapIns.panTo(point, zoom);
  }

  /**
   * 设置地图风格
   * @param style 风格
   */
  setMapStyle(style?: boolean | string) {
    if (!this.mapIns) {
      console.error('map instance is null');
      return;
    }
    if (typeof style === 'boolean') {
      if (style) {
        this.mapIns.setStyle(darkStyle);
      } else {
        this.mapIns.removeStyle();
      }
    } else if (style) {
      this.mapIns.setStyle(style);
    } else {
      this.mapIns.removeStyle();
    }
  }

  /**
   * 显示地图中心标记点
   * @param lng 经度
   * @param lat 纬度
   */
  showCenterMarker(lng?: number, lat?: number) {
    this.removeCenterMarker();
    if (lng != null && lat != null) {
      if (!this.centerMarker) {
        console.error('centerMarker is null');
        return;
      }
      if (!this.mapIns) {
        console.error('map instance is null');
        return;
      }
      // @ts-ignore
      this.centerMarker.setLngLat(new T.LngLat(lng, lat));
      this.mapIns.addOverLay(this.centerMarker);
    }
  }

  /**
   * 移除地图中心标记点
   */
  removeCenterMarker() {
    if (this.centerMarker && this.mapIns) {
      this.mapIns.removeOverLay(this.centerMarker);
    }
  }

  /**
   * 根据关键字检索位置
   * @param keyword 关键字
   */
  searchKeyword(keyword: string): Promise<PoiItem[]> {
    return new Promise<PoiItem[]>((resolve, reject) => {
      if (!this.placeSearchIns) {
        reject(new Error('LocalSearch instance is null'));
        return;
      }
      this.searchNearByCallback = (result: any) => {
        this.searchNearByCallback = void 0;
        if (!result) {
          reject(new Error(JSON.stringify(result)));
          return;
        }
        const data: PoiItem[] = [];
        (result.getPois() || []).forEach((poi: any) => {
          if (poi) {
            const item = this.formatPOI(poi);
            if (item.lat != null && item.lng != null) {
              data.push(item);
            }
          }
        });
        resolve(data);
      };
      this.placeSearchIns.search(keyword, 7);
    });
  }

  /**
   * 检索附近兴趣点
   * @param option 参数
   */
  searchNearBy(option: SearchNearByOption): Promise<PoiItem[]> {
    return new Promise<PoiItem[]>((resolve, reject) => {
      if (!this.placeSearchIns) {
        reject(new Error('LocalSearch instance is null'));
        return;
      }
      this.searchNearByCallback = (result: any) => {
        this.searchNearByCallback = void 0;
        if (!result) {
          reject(new Error(JSON.stringify(result)));
          return;
        }
        const data: PoiItem[] = [];
        (result.getPois() || []).forEach((poi: any) => {
          if (poi) {
            const item = this.formatPOI(poi);
            if (item.lat != null && item.lng != null) {
              data.push(item);
            }
          }
        });
        resolve(data);
      };
      this.placeSearchIns.searchNearby(
        option.poiKeywords ?? option.poiType ?? '楼栋',
        // @ts-ignore
        new T.LngLat(option.lng, option.lat),
        option.poiRadius
      );
    });
  }

  /**
   * 通知地图更改容器大小
   */
  checkResize() {
    this.mapIns && this.mapIns.checkResize();
  }
}
