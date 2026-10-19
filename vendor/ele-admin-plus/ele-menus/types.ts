import type { StyleValue, UserComponent } from '../ele-app/types';
import type {
  ElIconProps,
  ElMenuItemProps,
  ElSubMenuProps,
  ElMenuItemGroupProps,
  ElBadgeProps
} from '../ele-app/el';
import type { EleTooltipProps } from '../ele-app/plus';

/**
 * 菜单数据
 */
export interface MenuItem
  extends
    Omit<ElMenuItemProps, 'style' | 'class'>,
    Omit<ElSubMenuProps, 'index' | 'style' | 'class'>,
    ElMenuItemGroupProps {
  /** 唯一标识 */
  key?: string | number;
  /** 标题 */
  title?: string;
  /** 图标 */
  icon?: UserComponent;
  /** 图标属性 */
  iconProps?: ElIconProps;
  /** 图标样式 */
  iconStyle?: StyleValue;
  /** 菜单链接地址 */
  path?: string;
  /** 菜单的打开位置 */
  pathTarget?: string;
  /** 是否展示为分组菜单 */
  group?: boolean;
  /** 徽章 */
  badge?: ElBadgeProps;
  /** 子级数据 */
  children?: MenuItem[];
  /** 附加数据 */
  meta?: Record<keyof any, any>;
  /** 是否是溢出的菜单(内部属性) */
  overflow?: boolean;
}

/**
 * 菜单展示模式
 */
export type MenuMode = 'horizontal' | 'vertical' | 'compact';

/**
 * 主题
 */
export type MenuTheme = 'light' | 'dark';

/**
 * 弹出菜单主题
 */
export type PopupMenuTheme = 'auto' | MenuTheme;

/**
 * 弹出菜单是否彩色图标
 */
export type PopupColorful = 'auto' | boolean;

/**
 * 菜单项点击事件的菜单项类型
 */
export type MenuItemClickType = 'parent' | 'group' | undefined;

/**
 * 子菜单项点击事件
 */
export type MenuItemEvent = (
  item: MenuItem,
  e: MouseEvent,
  type?: MenuItemClickType
) => void;

/**
 * 省略菜单的属性
 */
export interface EllipsisProps extends ElSubMenuProps {
  /** 唯一标识 */
  key?: string | number;
  /** 图标 */
  icon?: UserComponent;
  /** 图标属性 */
  iconProps?: ElIconProps;
  /** 图标样式 */
  iconStyle?: StyleValue;
}

/**
 * 菜单文本溢出提示
 */
export type TextEllipsisTooltip = boolean | EleTooltipProps;

/**
 * 生成菜单数据返回结果
 */
export interface MenuResult {
  /** 菜单数据 */
  items?: MenuItem[];
  /** 省略的菜单数据 */
  moreItems?: MenuItem[];
  /** 选中的菜单路径 */
  activeIndex?: string;
}

/**
 * 菜单省略计算参数
 */
export interface MenuEllipsisOption {
  /** 获取菜单节点的方法 */
  getMenuEl: () => HTMLElement | null;
  /** 获取菜单省略项节点的方法 */
  getMoreEl: () => HTMLElement | null;
  /** 计算结果回调 */
  onEllipsis: (index: number) => void;
}
