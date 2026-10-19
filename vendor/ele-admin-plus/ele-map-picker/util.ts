import type { City } from './types';

/**
 * 默认地图中心图标地址
 */
export const defaultMarkerSrc =
  'https://3gimg.qq.com/lightmap/components/locationPicker2/image/marker.png';

/**
 * 判断行政区数据是否为空
 * @param city 行政区数据
 */
export function isNullCity(city?: City) {
  if (
    city == null ||
    typeof city !== 'object' ||
    (city.province == null &&
      city.city == null &&
      city.district == null &&
      city.citycode == null)
  ) {
    return true;
  }
  return false;
}
