const defaultMarkerSrc = "https://3gimg.qq.com/lightmap/components/locationPicker2/image/marker.png";
function isNullCity(city) {
  if (city == null || typeof city !== "object" || city.province == null && city.city == null && city.district == null && city.citycode == null) {
    return true;
  }
  return false;
}
export {
  defaultMarkerSrc,
  isNullCity
};
