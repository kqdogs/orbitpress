import { popoverProps as popoverProps$1, popoverEmits as popoverEmits$1 } from "element-plus";
import { omit } from "../utils/common";
import { tooltipProps } from "../ele-tooltip/props";
const normalizeProps = omit(popoverProps$1, ["onUpdate:visible"]);
const normalizeTooltipProps = omit(tooltipProps, ["rawContent", "isPopover"]);
const popoverProps = {
  ...normalizeTooltipProps,
  ...normalizeProps,
  transition: {
    type: String,
    default: "el-fade-in-linear"
  },
  /** 自定义主体类名 */
  bodyClass: String,
  /** 自定义标题样式 */
  titleStyle: Object,
  /** 自定义内容样式 */
  contentStyle: Object
};
const popoverEmits = popoverEmits$1;
export {
  popoverEmits,
  popoverProps
};
