import { textProps } from "../ele-text/props";
const ellipsisProps = {
  ...textProps,
  /** 最大行数 */
  maxLine: Number,
  /** 行高 */
  lineHeight: [Number, String],
  /** 文字提示属性 */
  tooltip: {
    type: [Boolean, Object],
    default: () => {
      return { original: true };
    }
  }
};
export {
  ellipsisProps
};
