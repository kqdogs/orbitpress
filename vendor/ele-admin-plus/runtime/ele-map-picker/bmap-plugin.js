import { debounce } from "../utils/common";
import { defaultMarkerSrc } from "./util";
import { bMapDarkStyle } from "./bmap-dark-style";
class BMapPlugin {
  /** 地图实例 */
  mapIns;
  /** POI检索实例 */
  placeSearchIns;
  /** 地图中心标记点 */
  centerMarker;
  /** 检索附近回调 */
  searchNearByCallback;
  /** 地图是否初始加载完成 */
  isCompleted;
  constructor() {
  }
  /**
   * 处理POI数据
   * @param item 数据
   */
  formatPOI(item) {
    const name = item.title || "";
    const address = item.address || "";
    const { lat, lng } = item.point || {};
    const city = {
      province: item.province,
      city: item.city,
      district: item.areaname
    };
    const district = [
      item.province ?? "",
      item.city ?? "",
      item.areaname ?? ""
    ].join("");
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
  renderMap(mapEl, option) {
    this.destroyMap();
    if (!BMapGL) {
      console.error("BMapGL is not defined");
      return;
    }
    this.mapIns = new BMapGL.Map(mapEl);
    this.mapIns.enableScrollWheelZoom();
    const defaultZoom = option.zoom ?? 11;
    if (option.center) {
      const point = new BMapGL.Point(option.center[0], option.center[1]);
      this.mapIns.centerAndZoom(point, defaultZoom);
    } else {
      this.mapIns.centerAndZoom("北京", defaultZoom);
    }
    const defaultStyle = option.darkMode ? bMapDarkStyle : void 0;
    const mapStyle = option.mapStyle || defaultStyle;
    if (mapStyle) {
      this.mapIns.setMapStyleV2(mapStyle);
    }
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
    this.placeSearchIns = new BMapGL.LocalSearch(this.mapIns, {
      pageCapacity: option.poiLimit,
      pageNum: 0,
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
    this.mapIns.addEventListener("tilesloaded", () => {
      if (!this.isCompleted) {
        this.isCompleted = true;
        option.onComplete && option.onComplete();
      }
    });
    this.mapIns.addEventListener("dragend", () => {
      option.onDragend && option.onDragend();
    });
    this.mapIns.addEventListener("click", (e) => {
      if (option.onClick) {
        const lnglat = e.latlng;
        option.onClick({ ...e, lnglat });
      }
    });
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
      const geo = new BMapGL.Geocoder();
      geo.getLocation(centerPoint, (result) => {
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
  setMapCenter(lng, lat, zoom) {
    if (lng == null || lat == null) {
      return;
    }
    if (!this.mapIns) {
      console.error("map instance is null");
      return;
    }
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
  setMapStyle(style) {
    if (!this.mapIns) {
      console.error("map instance is null");
      return;
    }
    if (typeof style === "boolean") {
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
        option.poiKeywords ?? option.poiType ?? "房地产",
        // @ts-ignore
        new BMapGL.Point(option.lng, option.lat),
        option.poiRadius
      );
    });
  }
}
export {
  BMapPlugin
};
