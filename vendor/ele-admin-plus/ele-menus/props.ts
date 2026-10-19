import type { PropType, ExtractPropTypes } from 'vue';
import { menuProps, menuEmits } from 'element-plus';
import type {
  MenuItem,
  MenuMode,
  MenuTheme,
  PopupMenuTheme,
  PopupColorful,
  EllipsisProps,
  TextEllipsisTooltip,
  MenuItemClickType
} from './types';

/**
 * 属性
 */
export const menusProps = {
  ...menuProps,
  mode: String as PropType<MenuMode>,
  /** 菜单数据 */
  items: {
    type: Array as PropType<MenuItem[]>,
    required: true
  },
  /** 主题 */
  theme: String as PropType<MenuTheme>,
  /** 弹出菜单主题 */
  popupTheme: {
    type: String as PropType<PopupMenuTheme>,
    default: 'auto'
  },
  /** 彩色菜单图标 */
  colorful: Boolean,
  /** 弹出菜单是否彩色图标 */
  popupColorful: {
    type: [Boolean, String] as PropType<PopupColorful>,
    default: 'auto'
  },
  /** 一级子菜单类名 */
  firstPopperClass: String,
  /** 禁用 tooltip */
  tooltipDisabled: Boolean,
  /** 省略菜单的属性 */
  ellipsisProps: Object as PropType<EllipsisProps>,
  /** 是否开启菜单文本溢出提示 */
  textEllipsisTooltip: [Boolean, Object] as PropType<TextEllipsisTooltip>
};

export type MenusProps = ExtractPropTypes<typeof menusProps>;

export type MenuPropKeys = Array<keyof typeof menuProps>;

/**
 * 菜单组件属性名
 */
export const menuPropKeys: MenuPropKeys = Object.keys(menuProps) as any;

/**
 * 事件
 */
export const menusEmits = {
  ...menuEmits,
  /** 子菜单项点击事件 */
  itemClick: (_item: MenuItem, _e: MouseEvent, _type?: MenuItemClickType) =>
    true,
  /** 子菜单项鼠标进入事件 */
  itemMouseenter: (_item: MenuItem, _e: MouseEvent) => true,
  /** 子菜单项鼠标离开事件 */
  itemMouseleave: (_item: MenuItem, _e: MouseEvent) => true,
  /** 父级菜单项鼠标进入事件 */
  parentMouseenter: (_item: MenuItem, _e: MouseEvent) => true,
  /** 父级菜单项鼠标离开事件 */
  parentMouseleave: (_item: MenuItem, _e: MouseEvent) => true
};
