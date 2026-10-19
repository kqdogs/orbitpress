const tableProps = {
  /** 是否为斑马纹 */
  stripe: Boolean,
  /** 是否带有纵向边框 */
  border: Boolean,
  /** 尺寸 */
  size: String,
  /** 是否有表头 */
  hasHeader: {
    type: Boolean,
    default: true
  },
  /** 是否有表尾 */
  hasFooter: Boolean,
  /** 是否使用打印皮肤 */
  printSkin: Boolean
};
export {
  tableProps
};
