const treeTableProps = {
  /** 数据 */
  data: Array,
  /** 列配置 */
  columns: Array,
  /** 表格高度 */
  height: String,
  /** 表格样式 */
  tableStyle: [Object, Array, String],
  /** 表头样式 */
  headerStyle: [Object, Array, String],
  /** 序号列宽度 */
  indexColWidth: {
    type: Number,
    default: 24
  }
};
export {
  treeTableProps
};
