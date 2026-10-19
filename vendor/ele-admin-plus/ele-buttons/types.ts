import type { UserComponent, UserComponentSlots } from '../ele-app/types';
import type { ElLinkProps, ElButtonProps, ElIconProps } from '../ele-app/el';
import type {
  EleDropdownPropsAndEmits,
  ElePopconfirmPropsAndEmits,
  EleTooltipPropsAndEmits
} from '../ele-app/plus';
import type { DropdownItem } from '../ele-dropdown/types';

/**
 * 预设类型
 */
export type ButtonItemPreset =
  | 'search'
  | 'reset'
  | 'searchExpand'
  | 'searchFold'
  | 'add'
  | 'delBatch'
  | 'edit'
  | 'del'
  | 'import'
  | 'export'
  | 'upload'
  | 'download'
  | 'expand'
  | 'fold'
  | 'detail'
  | 'more'
  | 'save'
  | 'cancel'
  | 'confirm';

/**
 * 权限过滤方式
 */
export type ButtonItemPermissionFilter = '' | 'disabled';

/**
 * 权限控制字段
 */
export interface ButtonItemPermission {
  /** 有某些权限才展示 */
  permission?: string | string[];
  /** 有任意权限才展示 */
  anyPermission?: string | string[];
  /** 有某些角色才展示 */
  role?: string | string[];
  /** 有任意角色才展示 */
  anyRole?: string | string[];
  /** 权限过滤方式 */
  permissionFilter?: ButtonItemPermissionFilter;
  /** 显示条件 */
  vIf?: () => boolean;
}

/**
 * 下拉菜单项
 */
export interface ButtonDropdownItem
  extends Omit<DropdownItem, 'children'>, ButtonItemPermission {
  /** 预设类型 */
  preset?: ButtonItemPreset;
  /** 子级 */
  children?: ButtonDropdownItem[];
}

/**
 * 按钮项
 */
export interface ButtonItem<
  T extends UserComponent = UserComponent<any>,
  P extends Record<string, any> = Record<string, any>
> extends ButtonItemPermission {
  /** 文本 */
  title?: string;
  /** 图标 */
  icon?: UserComponent;
  /** 是否禁用 */
  disabled?: boolean;
  /** 组件类型 */
  type?: T | UserComponent<P>;
  /** 组件属性 */
  props?: T extends 'link'
    ? ElLinkProps
    : T extends 'button'
      ? ElButtonProps
      : Record<string, any> & Partial<P>;
  /** 组件插槽 */
  slots?: UserComponentSlots;
  /** 预设类型 */
  preset?: ButtonItemPreset;
  /** 点击事件 */
  onClick?: (e: MouseEvent) => void;
  /** 下拉菜单项 */
  dropdownItems?: ButtonDropdownItem[];
  /** 下拉菜单属性 */
  dropdownProps?: EleDropdownPropsAndEmits;
  /** 下拉右侧箭头图标属性 */
  dropdownArrowProps?: ElIconProps | boolean;
  /** 气泡确认框属性 */
  popconfirmProps?: ElePopconfirmPropsAndEmits;
  /** 文本提示属性 */
  tooltipProps?: EleTooltipPropsAndEmits;
  /** command */
  command?: any;
  /** key */
  key?: string;
}

/**
 * 按钮数据类型推导辅助函数
 * @param item 按钮数据
 */
export type CreateItemHelper = <
  T extends UserComponent,
  P extends Record<string, any>
>(
  item: ButtonItem<T, P>
) => ButtonItem<T, P>;

/**
 * 国际化
 */
export interface ButtonsLocale {
  search: string;
  reset: string;
  searchExpand: string;
  searchFold: string;
  add: string;
  delBatch: string;
  edit: string;
  del: string;
  import: string;
  export: string;
  upload: string;
  download: string;
  expand: string;
  fold: string;
  detail: string;
  more: string;
  save: string;
  cancel: string;
  confirm: string;
}
