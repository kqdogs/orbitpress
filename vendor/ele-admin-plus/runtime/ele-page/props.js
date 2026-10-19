const pageProps = {
  /** 是否是单纯的容器 */
  plain: Boolean,
  /** 内容是否为多个卡片 */
  multiCard: {
    type: Boolean,
    default: true
  },
  /** 内部表格是否弹性布局 */
  flexTable: [Boolean, String],
  /** 是否关闭页脚 */
  hideFooter: Boolean
};
export {
  pageProps
};
