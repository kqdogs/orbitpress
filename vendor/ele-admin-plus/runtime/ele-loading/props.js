const loadingProps = {
  /** 是否显示动画 */
  loading: Boolean,
  /** 显示在加载图标下方的加载文案 */
  text: String,
  /** 背景模糊效果 */
  blur: Boolean,
  /** 加载器尺寸 */
  size: String,
  /** 自定义加载器样式 */
  spinnerStyle: Object,
  /** 自定义文本样式 */
  textStyle: Object,
  /** 是否是纯加载器模式 */
  plain: Boolean,
  /** 加载器类型 */
  type: {
    type: String,
    default: "dot"
  },
  /** 背景遮罩的颜色 */
  background: String,
  /** 自定义加载图标 */
  spinner: String,
  /** 自定义加载图标svg的view-box */
  svgViewBox: String
};
export {
  loadingProps
};
