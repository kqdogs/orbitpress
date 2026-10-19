import { paginationProps as paginationProps$1 } from "element-plus";
const paginationProps = {
  ...paginationProps$1,
  /** 总条目数 */
  total: [String, Number],
  /** 是否还有下一页 */
  hasNext: {
    type: Boolean,
    default: true
  },
  /** 风格 */
  type: {
    type: String,
    default: "circle"
  },
  /** 每页数量选择下拉是否使用固定定位 */
  isFixedPopper: {
    type: Boolean,
    default: true
  }
};
const paginationEmits = {
  /** 更新页码 */
  "update:currentPage": (_currentPage) => true,
  /** 更新每页数量 */
  "update:pageSize": (_pageSize) => true
};
export {
  paginationEmits,
  paginationProps
};
