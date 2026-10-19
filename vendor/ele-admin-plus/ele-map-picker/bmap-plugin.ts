import { debounce } from '../utils/common';
import type {
  MapPlugin,
  MapRenderOption,
  SearchNearByOption,
  PoiItem
} from './types';
import { defaultMarkerSrc } from './util';
import { bMapDarkStyle } from './bmap-dark-style';

/**
 * 百度地图插件
 */
export class BMapPlugin implements MapPlugin {
  /** 地图实例 */
  mapIns?: any;
  /** POI检索实例 */
  placeSearchIns?: any;
  /** 地图中心标记点 */
  centerMarker?: any;
  /** 检索附近回调 */
  searchNearByCallback?: (result: any) => void;
  /** 地图是否初始加载完成 */
  isCompleted?: boolean;

  constructor() {}

  /**
   * 处理POI数据
   * @param item 数据
   */
  formatPOI(item: any): PoiItem {
    const name = item.title || '';
    const address = item.address || '';
    const { lat, lng } = item.point || {};
    const city = {
      province: item.province,
      city: item.city,
      district: item.areaname
    };
    const district = [
      item.province ?? '',
      item.city ?? '',
      item.areaname ?? ''
    ].join('');
    const key = [name, address, lat, lng].join();
    return {
      ...item,
      name,
      address,
      lat,
      lng,
      district,
      city,
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
    if (!BMapGL) {
      console.error('BMapGL is not defined');
      return;
    }

    /** 创建地图实例 */
    // @ts-ignore
    this.mapIns = new BMapGL.Map(mapEl);
    // 开启鼠标滚轮缩放
    this.mapIns.enableScrollWheelZoom();

    /** 设置初始中心点和缩放等级 */
    const defaultZoom = option.zoom ?? 11;
    if (option.center) {
      // @ts-ignore
      const point = new BMapGL.Point(option.center[0], option.center[1]);
      this.mapIns.centerAndZoom(point, defaultZoom);
    } else {
      this.mapIns.centerAndZoom('北京', defaultZoom);
    }

    /** 设置初始地图风格 */
    const defaultStyle = option.darkMode ? bMapDarkStyle : void 0;
    const mapStyle = option.mapStyle || defaultStyle;
    if (mapStyle) {
      this.mapIns.setMapStyleV2(mapStyle);
    }

    /** 创建地图中心标记点 */
    // @ts-ignore
    this.centerMarker = new BMapGL.Marker(
      // @ts-ignore
      new BMapGL.Point(116.404, 39.915),
      {
        // @ts-ignore
        icon: new BMapGL.Icon(
          option.markerSrc ?? defaultMarkerSrc,
          // @ts-ignore
          new BMapGL.Size(26, 36.5),
          {
            // @ts-ignore
            anchor: new BMapGL.Size(13, 36.5)
          }
        )
      }
    );

    /** 创建POI检索实例 */
    // @ts-ignore
    this.placeSearchIns = new BMapGL.LocalSearch(this.mapIns, {
      pageCapacity: option.poiLimit,
      pageNum: 0,
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

    /** 地图加载完成事件 */
    this.mapIns.addEventListener('tilesloaded', () => {
      if (!this.isCompleted) {
        this.isCompleted = true;
        option.onComplete && option.onComplete();
      }
    });

    /** 地图拖动结束事件 */
    this.mapIns.addEventListener('dragend', () => {
      option.onDragend && option.onDragend();
    });

    /** 地图点击事件 */
    this.mapIns.addEventListener('click', (e: any) => {
      if (option.onClick) {
        const lnglat = e.latlng;
        option.onClick({ ...e, lnglat });
      }
    });

    /** 地图创建完成事件 */
    option.onRendered && option.onRendered(this.mapIns);
  }

  /**
   * 销毁地图
   */
  destroyMap() {
    this.mapIns && this.mapIns.destroy();
    this.centerMarker = null;
    this.placeSearchIns = null;
    this.mapIns = null;
    this.isCompleted = false;
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
      const geo = new BMapGL.Geocoder();
      geo.getLocation(centerPoint, (result: any) => {
        resolve({
          ...centerPoint,
          address: result?.address,
          city: result?.addressComponents
        });
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
    const point = new BMapGL.Point(lng, lat);
    this.mapIns.setCenter(point, {
      noAnimation: true,
      callback: () => {
        if (zoom != null) {
          this.mapIns.setZoom(zoom, { noAnimation: true });
        }
      }
    });
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
        this.mapIns.setMapStyleV2(bMapDarkStyle);
      } else {
        this.mapIns.setMapStyleV2({});
      }
    } else if (style) {
      this.mapIns.setMapStyleV2(style);
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
      this.centerMarker.setPosition(new BMapGL.Point(lng, lat));
      this.mapIns.addOverlay(this.centerMarker);
    }
  }

  /**
   * 移除地图中心标记点
   */
  removeCenterMarker() {
    if (this.centerMarker && this.mapIns) {
      this.mapIns.removeOverlay(this.centerMarker);
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
        for (let i = 0; i < result.getCurrentNumPois(); i++) {
          const poi = result.getPoi(i);
          if (poi) {
            const item = this.formatPOI(poi);
            if (item.lat != null && item.lng != null) {
              data.push(item);
            }
          }
        }
        resolve(data);
      };
      this.placeSearchIns.search(keyword, { forceLocal: false });
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
        for (let i = 0; i < result.getCurrentNumPois(); i++) {
          const poi = result.getPoi(i);
          if (poi) {
            const item = this.formatPOI(result.getPoi(i));
            if (item.lat != null && item.lng != null) {
              data.push(item);
            }
          }
        }
        resolve(data);
      };
      this.placeSearchIns.searchNearby(
        option.poiKeywords ?? option.poiType ?? '房地产',
        // @ts-ignore
        new BMapGL.Point(option.lng, option.lat),
        option.poiRadius
      );
    });
  }
}
