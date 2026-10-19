import type { UserComponent, StyleValue } from '../ele-app/types';
import type { EleProFormProps } from '../ele-app/plusx';
import type {
  ProFormItemKey,
  ProFormItemProps,
  ScreenSize
} from '../ele-pro-form/types';
import type { TreeTableColumn } from '../ele-tree-table/types';
export type TemplateFormConfig = EleProFormProps;

/**
 * 表单除表单项外的配置数据
 */
export type TemplateFormProps = Omit<EleProFormProps, 'items'>;

/**
 * 表单模板库模板
 */
export interface TemplateItem {
  /** 模板名称 */
  name: string;
  /** 模板缩略图 */
  cover?: UserComponent;
  /** 模板数据 */
  config: EleProFormProps;
}

/**
 * 表单组件库组件
 */
export interface ComponentItem {
  /** 组件类型 */
  type: string;
  /** 组件类型名称 */
  name: string;
  /** 组件类型缩略图 */
  cover?: UserComponent;
  /** 是否不显示在组件库列表中 */
  hide?: boolean;
  /** 组件原本的预设属性 */
  presetProps: Record<string, any>;
  /** 组件在 EleProForm 中的默认属性 */
  defaultProps: Record<string, any>;
  /** 组件添加时的初始属性 */
  initialProps: Record<string, any>;
  /** 组件的强制保留属性 */
  reservedProps: Record<string, any>;
  /** 添加时的初始表单项配置 */
  initialData?: Omit<ProFormItemProps, 'props'>;
  /** 组件属性配置的表单配置数据 */
  configForm?: ProFormItemProps[];
  /** 生成 ElForm 代码时组件名称 */
  componentName: string;
  /** 生成代码时组件引入语句 */
  componentImport?: string;
}

/**
 * 表单组件库组件分组
 */
export interface ComponentGroup {
  /** 分组名称 */
  name: string;
  /** 组件数据 */
  items: ComponentItem[];
}

/**
 * 顶栏右侧操作按钮名称
 */
export type HeaderRightToolName =
  | 'import'
  | 'export'
  | 'clear'
  | 'preview'
  | 'code';

/**
 * 添加表单项需要的数据
 */
export interface AddItemResult {
  /** 表单项 */
  item?: ProFormItemProps;
  /** 父级表单项 key */
  parentItemId?: ProFormItemKey;
  /** 添加位置 */
  index?: number;
}

/**
 * 修改表单项属性需要的数据
 */
export interface UpdateItemResult {
  /** 表单项 key */
  itemId: ProFormItemKey;
  /** 需要修改的字段名 */
  field: string;
  /** 新的值 */
  value: any;
}

/**
 * 修改表单项需要的数据
 */
export interface UpdateItemsResult {
  /** 需要删除的数据 */
  deleteItemIds: ProFormItemKey[];
  /** 需要添加的数据 */
  addItems: AddItemResult[];
  /** 需要修改的数据 */
  updateItems: UpdateItemResult[];
}

/**
 * 样式编辑数据
 */
export interface ComponentStyleItem {
  /** id */
  id?: number;
  /** 属性名 */
  name?: string;
  /** 值 */
  value?: string;
}

/**
 * 树表格列配置
 */
export interface OptionsTableColumn extends TreeTableColumn {
  /** 列宽 */
  width?: string;
  /** 编辑组件类型 */
  editType?: 'input' | 'switch';
}

/**
 * 添加子级时操作类型
 */
export type AddChildrenItemAction = 'addTableRow' | 'addTableCol';

/**
 * 表格跨行跨列处理时单元格数据
 */
export interface TableGridItem {
  /** 表单项 key */
  itemId?: ProFormItemKey;
  /** 跨行 */
  colspan: number;
  /** 跨列 */
  rowspan: number;
  /** 数据处理后的跨行 */
  newColspan?: number;
  /** 数据处理后的跨列 */
  newRowspan?: number;
  /** 数据处理前的跨行 */
  oldColspan?: number;
  /** 数据处理前的跨列 */
  oldRowspan?: number;
}

/**
 * 表格跨行跨列处理时行数据
 */
export interface TableGridRow {
  /** 表单项 key */
  itemId: ProFormItemKey;
  /** 单元格数据 */
  children: TableGridItem[];
}

/**
 * 表格跨行跨列处理时数据
 */
export type TableGridData = TableGridRow[];

/**
 * 组件选择弹窗配置
 */
export interface ComponentPickerOption {
  visible?: boolean;
  addParentFormItemId?: ProFormItemKey;
  editFormItemId?: ProFormItemKey;
  editFormItemType?: string;
}

/**
 * 屏幕尺寸数据
 */
export interface ScreenItem {
  value: ScreenSize;
  icon: UserComponent;
  iconStyle?: StyleValue;
}
