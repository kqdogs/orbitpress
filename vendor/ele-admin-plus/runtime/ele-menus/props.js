import { menuProps, menuEmits } from "element-plus";
const menusProps = {
  ...menuProps,
  mode: String,
  /** 菜单数据 */
  items: {
    type: Array,
    required: true
  },
  /** 主题 */
  theme: String,
  /** 弹出菜单主题 */
  popupTheme: {
    type: String,
    default: "auto"
  },
  /** 彩色菜单图标 */
  colorful: Boolean,
  /** 弹出菜单是否彩色图标 */
  popupColorful: {
    type: [Boolean, String],
    default: "auto"
  },
  /** 一级子菜单类名 */
  firstPopperClass: String,
  /** 禁用 tooltip */
  tooltipDisabled: Boolean,
  /** 省略菜单的属性 */
  ellipsisProps: Object,
  /** 是否开启菜单文本溢出提示 */
  textEllipsisTooltip: [Boolean, Object]
};
const menuPropKeys = Object.keys(menuProps);
const menusEmits = {
  ...menuEmits,
  /** 子菜单项点击事件 */
  itemClick: (_item, _e, _type) => true,
  /** 子菜单项鼠标进入事件 */
  itemMouseenter: (_item, _e) => true,
  /** 子菜单项鼠标离开事件 */
  itemMouseleave: (_item, _e) => true,
  /** 父级菜单项鼠标进入事件 */
  parentMouseenter: (_item, _e) => true,
  /** 父级菜单项鼠标离开事件 */
  parentMouseleave: (_item, _e) => true
};
export {
  menuPropKeys,
  menusEmits,
  menusProps
};
