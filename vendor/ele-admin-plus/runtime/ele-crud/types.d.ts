import type { ComponentProps } from '../ele-app/types';
import type {
  ElButtonProps,
  ElLinkProps,
  ElTreeProps,
  ElInputProps,
  ElEmptyProps
} from '../ele-app/el';
import type {
  ElePageProps,
  EleCardProps,
  EleProTableProps,
  EleSplitPanelProps,
  EleLoadingProps,
  EleModalProps,
  ElePopconfirmProps,
  EleMessageBoxOptions
} from '../ele-app/plus';
import type { EleProFormProps } from '../ele-app/plusx';
import type { ProFormItemProps } from '../ele-pro-form/types';
import type { DataItem, DataKey, Column } from '../ele-data-table/types';

/**
 * 字段
 */
export interface CrudField {
  /** 唯一值 */
  key?: string;
  /** 属性名 */
  prop: string;
  /** 字段名 */
  label?: string;
  /** 不显示在列表中 */
  hideInList?: boolean | 'flat';
  /** 不显示在搜索栏中 */
  hideInSearch?: boolean | 'flat';
  /** 不显示在添加中 */
  hideInAdd?: boolean | 'flat';
  /** 不显示在修改中 */
  hideInEdit?: boolean | 'flat';
  /** 表格列属性 */
  columnProps?: Column;
  /** 搜索表单项属性 */
  searchItemProps?: ProFormItemProps;
  /** 添加表单项属性 */
  addItemProps?: ProFormItemProps;
  /** 修改表单项属性 */
  editItemProps?: ProFormItemProps;
  /** 子级 */
  children?: Array<Partial<CrudField>>;
}

/**
 * 删除确认框属性
 */
export type DelConfirmProps = ElePopconfirmProps | EleMessageBoxOptions;

/**
 * 删除气泡确认框属性
 */
export type DelPopConfirmProps = DelConfirmProps & {
  /** 是否是气泡确认框 */
  isPopConfirm?: boolean;
};

/**
 * 列表配置
 */
export interface ListConfig {
  /** 卡片属性 */
  cardProps?: boolean | EleCardProps;
  /** 卡片插槽 */
  cardSlots?: Record<string, string>;
  /** 表格属性 */
  tableProps?: EleProTableProps;
  /** 表格插槽 */
  tableSlots?: Record<string, any>;
  /** 表格多选列属性 */
  selectionColumnProps?: boolean | Column;
  /** 表格序号列属性 */
  indexColumnProps?: boolean | Column;
  /** 表格操作列属性 */
  actionColumnProps?: boolean | Column;
  /** 添加按钮属性 */
  addBtnProps?: boolean | ElButtonProps;
  /** 批量删除按钮属性 */
  delBtnProps?: boolean | ElButtonProps;
  /** 修改按钮属性 */
  editLinkProps?: boolean | ElLinkProps;
  /** 删除按钮属性 */
  delLinkProps?: boolean | ElLinkProps;
  /** 删除气泡确认框属性 */
  delPopConfirmProps?: boolean | DelPopConfirmProps;
  /** 删除确认框属性 */
  delConfirmProps?: boolean | EleMessageBoxOptions;
}

/**
 * 搜索栏配置
 */
export interface SearchConfig {
  /** 卡片属性 */
  cardProps?: boolean | EleCardProps;
  /** 卡片插槽 */
  cardSlots?: Record<string, string>;
  /** 表单属性 */
  formProps?: EleProFormProps;
  /** 表单插槽 */
  formSlots?: Record<string, string>;
}

/**
 * 修改配置
 */
export interface EditConfig {
  /** 弹窗属性 */
  modalProps?: EleModalProps;
  /** 弹窗插槽 */
  modalSlots?: Record<string, string>;
  /** 表单属性 */
  formProps?: EleProFormProps;
  /** 表单插槽 */
  formSlots?: Record<string, string>;
  /** 取消按钮属性 */
  cancelBtnProps?: boolean | ElButtonProps;
  /** 保存按钮属性 */
  saveBtnProps?: boolean | ElButtonProps;
}

/**
 * 侧栏配置
 */
export interface SideConfig {
  /** 搜索栏属性 */
  searchProps?: boolean | ComponentProps<{}>;
  /** 搜索输入框属性 */
  searchInputProps?: ElInputProps;
  /** 搜索输入框插槽 */
  searchInputSlots?: Record<string, string>;
  /** 树组件属性 */
  treeProps?: ElTreeProps;
  /** 树组件插槽 */
  treeSlots?: Record<string, string>;
  /** 加载组件属性 */
  loadingProps?: EleLoadingProps;
  /** 空组件属性 */
  emptyProps?: ElEmptyProps;
}

/**
 * 页面配置
 */
export interface PageConfig {
  /** 页面容器组件属性 */
  pageProps?: boolean | ElePageProps;
  /** 卡片属性 */
  cardProps?: boolean | EleCardProps;
  /** 卡片插槽 */
  cardSlots?: Record<string, string>;
  /** 分割面板属性 */
  splitPanelProps?: boolean | EleSplitPanelProps;
  /** 分割面板插槽 */
  splitPanelSlots?: Record<string, string>;
  /** 搜索表单是否放在分割面板的主体搜索栏插槽中 */
  splitSearchForm?: boolean;
  /** 侧栏配置 */
  sideConfig?: SideConfig;
  /** 侧栏对表格筛选的字段名 */
  tableFilterField?: string;
}

/**
 * 操作按钮点击动作
 */
export type BtnClickAction =
  | 'add'
  | 'edit'
  | 'del'
  | 'delSelections'
  | 'delConfirm';

/**
 * 删除气泡配置
 */
export interface DeletePopOption {
  /** 删除气泡数据 */
  item?: DataItem;
  /** 删除气泡触发节点 */
  triggerEl?: any;
  /** 删除气泡属性 */
  confirmProps?: DelPopConfirmProps;
}

/**
 * 删除数据接口
 */
export type DeleteApi = (
  dataKeys: DataKey[],
  data: DataItem[]
) => Promise<string | undefined>;

/**
 * 修改数据接口
 */
export type EditApi = (data: DataItem) => Promise<string | undefined>;

/**
 * 详情接口
 */
export type DetailApi = (
  dataKey?: DataKey,
  data?: DataItem
) => Promise<DataItem>;

/**
 * 侧栏树组件数据接口
 */
export type TreeListApi = (
  searchValue?: string
) => Promise<Array<Record<string, any>> | undefined>;

/**
 * 获取并缓存代码解析结果的方法
 */
export type GetFieldsFormItemsFunction = (
  fields?: CrudField[]
) => ProFormItemProps[];

/**
 * 获取并缓存代码解析结果的方法
 */
export type GetAndCacheCodeFunction = (code: string, codeResult?: any) => any;

/**
 * 国际化
 */
export interface CrudLocale {
  action: string;
  add: string;
  edit: string;
  deleteConfirm: string;
  deleteConfirmTitle: string;
  deleteBatchConfirm: string;
  deleteBatchConfirmTitle: string;
  deleteBatchTip: string;
  deleteLoading: string;
  deleteSuccess: string;
  deleteError: string;
  editSuccess: string;
  editError: string;
  addSuccess: string;
  addError: string;
  searchPlaceholder: string;
}
