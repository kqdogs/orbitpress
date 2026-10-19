import { debounce } from "../utils/common";
import { defaultMarkerSrc } from "./util";
const darkStyle = "black";
class TMapPlugin {
  /** 地图实例 */
  mapIns;
  /** POI检索实例 */
  placeSearchIns;
  /** 地图中心标记点 */
  centerMarker;
  /** 检索附近回调 */
  searchNearByCallback;
  constructor() {
  }
  /**
   * 处理POI数据
   * @param item 数据
   */
  formatPOI(item) {
    const name = item.name || "";
    const address = item.address || "";
    const [lng, lat] = (item.lonlat || "").split(",");
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
  renderMap(mapEl, option) {
    this.destroyMap();
    if (!T) {
      console.error("T is not defined");
      return;
    }
    this.mapIns = new T.Map(mapEl);
    this.mapIns.addEventListener("load", () => {
      option.onComplete && option.onComplete();
    });
    const defaultZoom = option.zoom ?? 11;
    if (option.center) {
      const point = new T.LngLat(option.center[0], option.center[1]);
      this.mapIns.centerAndZoom(point, defaultZoom);
    } else {
      const defaultCenter = new T.LngLat(116.40769, 39.89945);
      this.mapIns.centerAndZoom(defaultCenter, defaultZoom);
    }
    const defaultStyle = option.darkMode ? darkStyle : void 0;
    const mapStyle = option.mapStyle || defaultStyle;
    if (mapStyle) {
      this.mapIns.setStyle(mapStyle);
    }
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
    this.placeSearchIns = new T.LocalSearch(this.mapIns, {
      pageCapacity: option.poiLimit,
      onSearchComplete: (result) => {
        this.searchNearByCallback && this.searchNearByCallback(result);
      }
    });
    this.mapIns.addEventListener(
      "resize",
      debounce(() => {
        option.onResizeend && option.onResizeend();
      }, 350)
    );
    this.mapIns.addEventListener("zoomend", () => {
      option.onZoomend && option.onZoomend();
    });
    this.mapIns.addEventListener("dragend", () => {
      option.onDragend && option.onDragend();
    });
    this.mapIns.addEventListener("click", (e) => {
      option.onClick && option.onClick(e);
    });
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
  getMapCenter(returnRegions) {
    return new Promise((resolve, reject) => {
      if (!this.mapIns) {
        reject(new Error("map instance is null"));
        return;
      }
      const centerPoint = this.mapIns.getCenter() || {};
      if (!returnRegions) {
        resolve(centerPoint);
        return;
      }
      const geo = new T.Geocoder();
      geo.getLocation(centerPoint, (result) => {
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
  setMapCenter(lng, lat, zoom) {
    if (lng == null || lat == null) {
      return;
    }
    if (!this.mapIns) {
      console.error("map instance is null");
      return;
    }
    const point = new T.LngLat(lng, lat);
    this.mapIns.panTo(point, zoom);
  }
  /**
   * 设置地图风格
   * @param style 风格
   */
  setMapStyle(style) {
    if (!this.mapIns) {
      console.error("map instance is null");
      return;
    }
    if (typeof style === "boolean") {
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
  showCenterMarker(lng, lat) {
    this.removeCenterMarker();
    if (lng != null && lat != null) {
      if (!this.centerMarker) {
        console.error("centerMarker is null");
        return;
      }
      if (!this.mapIns) {
        console.error("map instance is null");
        return;
      }
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
  searchKeyword(keyword) {
    return new Promise((resolve, reject) => {
      if (!this.placeSearchIns) {
        reject(new Error("LocalSearch instance is null"));
        return;
      }
      this.searchNearByCallback = (result) => {
        this.searchNearByCallback = void 0;
        if (!result) {
          reject(new Error(JSON.stringify(result)));
          return;
        }
        const data = [];
        (result.getPois() || []).forEach((poi) => {
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
  searchNearBy(option) {
    return new Promise((resolve, reject) => {
      if (!this.placeSearchIns) {
        reject(new Error("LocalSearch instance is null"));
        return;
      }
      this.searchNearByCallback = (result) => {
        this.searchNearByCallback = void 0;
        if (!result) {
          reject(new Error(JSON.stringify(result)));
          return;
        }
        const data = [];
        (result.getPois() || []).forEach((poi) => {
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
        option.poiKeywords ?? option.poiType ?? "楼栋",
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
export {
  TMapPlugin
};
