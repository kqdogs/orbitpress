const viewerProps = {
  /** 图片地址 */
  src: String,
  /** 标记数据 */
  markers: Array,
  /** 自定义内容样式 */
  contentStyle: Object,
  /** 自定义内容图片样式 */
  imageStyle: Object,
  /** 缩放速率 */
  zoomStep: {
    type: Number,
    default: 10
  },
  /** 缩放最小百分比 */
  zoomMin: {
    type: Number,
    default: 20
  },
  /** 缩放最大百分比 */
  zoomMax: {
    type: Number,
    default: 400
  },
  /** 每次旋转角度 */
  rotateStep: {
    type: Number,
    default: 90
  }
};
const viewerEmits = {
  contentClick: (_e) => true,
  contentContextmenu: (_e) => true
};
export {
  viewerEmits,
  viewerProps
};
