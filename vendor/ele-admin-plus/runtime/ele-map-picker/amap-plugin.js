import AMapLoader from "@amap/amap-jsapi-loader";
import { isNullCity, defaultMarkerSrc } from "./util";
const darkStyle = "amap://styles/dark";
const normalStyle = "amap://styles/normal";
class AMapPlugin {
  /** 地图实例 */
  mapIns;
  /** 输入建议实例 */
  autoCompleteIns;
  /** POI检索实例 */
  placeSearchIns;
  /** 地图中心标记点 */
  centerMarker;
  constructor() {
  }
  /**
   * 处理POI数据
   * @param item 数据
   */
  formatPOI(item) {
    const name = item.name || "";
    const address = (Array.isArray(item.address) ? item.address[0] : item.address) || "";
    const { lat, lng } = item.location;
    const city = isNullCity(item.city) ? void 0 : item.city;
    const key = [name, address, lat, lng].join();
    return { ...item, name, address, lat, lng, city, key };
  }
  /**
   * 渲染地图
   * @param mapEl 地图容器节点
   * @param option 地图渲染参数
   * @param AMap 高德地图对象
   */
  render(mapEl, option, AMap) {
    this.destroyMap();
    const defaultStyle = option.darkMode ? darkStyle : void 0;
    this.mapIns = new AMap.Map(mapEl, {
      zoom: option.zoom,
      center: option.center,
      mapStyle: option.mapStyle || defaultStyle,
      resizeEnable: true
    });
    this.centerMarker = new AMap.Marker({
      icon: new AMap.Icon({
        image: option.markerSrc ?? defaultMarkerSrc,
        size: new AMap.Size(26, 36.5),
        imageSize: new AMap.Size(26, 36.5)
      }),
      offset: new AMap.Pixel(-13, -36.5)
    });
    this.autoCompleteIns = new AMap.AutoComplete({
      city: option.suggestionCity ?? "全国"
    });
    this.placeSearchIns = new AMap.PlaceSearch({
      type: option.poiType,
      pageSize: option.poiLimit,
      pageIndex: 1
    });
    this.mapIns.on("complete", () => {
      option.onComplete && option.onComplete();
    });
    this.mapIns.on("moveend", () => {
      option.onMoveend && option.onMoveend();
    });
    this.mapIns.on("click", (e) => {
      option.onClick && option.onClick(e);
    });
    option.onRendered && option.onRendered(this.mapIns);
  }
  /**
   * 渲染地图
   * @param mapEl 地图容器节点
   * @param option 地图渲染参数
   */
  renderMap(mapEl, option) {
    AMapLoader.load({
      key: option.mapKey ?? "",
      version: option.mapVersion ?? "",
      plugins: ["AMap.PlaceSearch", "AMap.AutoComplete"]
    }).then((AMap) => {
      this.render(mapEl, option, AMap);
    }).catch((e) => {
      console.error(e);
    });
  }
  /**
   * 销毁地图
   */
  destroyMap() {
    this.mapIns && this.mapIns.destroy();
    this.centerMarker = null;
    this.placeSearchIns = null;
    this.autoCompleteIns = null;
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
      this.mapIns.getCity((city) => {
        resolve({ ...centerPoint, city });
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
    if (zoom == null) {
      this.mapIns.setCenter([lng, lat], true);
    } else {
      this.mapIns.setZoomAndCenter(zoom, [lng, lat]);
    }
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
        this.mapIns.setMapStyle(darkStyle);
      } else {
        this.mapIns.setMapStyle(normalStyle);
      }
    } else if (style) {
      this.mapIns.setMapStyle(style);
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
      this.centerMarker.setPosition([lng, lat]);
      this.mapIns.add(this.centerMarker);
    }
  }
  /**
   * 移除地图中心标记点
   */
  removeCenterMarker() {
    if (this.centerMarker && this.mapIns) {
      this.mapIns.remove(this.centerMarker);
    }
  }
  /**
   * 根据关键字检索位置
   * @param keyword 关键字
   */
  searchKeyword(keyword) {
    return new Promise((resolve, reject) => {
      if (!this.autoCompleteIns) {
        reject(new Error("AutoComplete instance is null"));
        return;
      }
      this.autoCompleteIns.search(keyword, (status, result) => {
        if (status === "error") {
          const msg = `${status} ${result ? JSON.stringify(result) : ""}`;
          reject(new Error(msg));
          return;
        }
        if (!result?.tips) {
          resolve([]);
          return;
        }
        const tips = result.tips.filter((d) => !!d.location);
        resolve(tips.map((d) => this.formatPOI(d)));
      });
    });
  }
  /**
   * 检索附近兴趣点
   * @param option 参数
   */
  searchNearBy(option) {
    return new Promise((resolve, reject) => {
      if (!this.placeSearchIns) {
        reject(new Error("PlaceSearch instance is null"));
        return;
      }
      this.placeSearchIns.searchNearBy(
        option.poiKeywords,
        [option.lng, option.lat],
        option.poiRadius,
        (status, result) => {
          if (status === "complete" && result?.poiList?.pois) {
            const data = result.poiList.pois.filter(
              (d) => !!d.location
            );
            resolve(data.map((d) => this.formatPOI(d)));
            return;
          }
          if (status === "no_data") {
            resolve([]);
            return;
          }
          const msg = `${status} ${result ? JSON.stringify(result) : ""}`;
          reject(new Error(msg));
        }
      );
    });
  }
}
export {
  AMapPlugin
};
