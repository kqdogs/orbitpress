import { breadcrumbProps as breadcrumbProps$1 } from "element-plus";
const breadcrumbProps = {
  ...breadcrumbProps$1,
  separator: {
    type: [String, Object, Function],
    default: "/"
  },
  /** 面包屑数据 */
  items: {
    type: Array,
    required: true
  }
};
export {
  breadcrumbProps
};
