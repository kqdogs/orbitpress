import type { PropType, ExtractPropTypes } from 'vue';
import type { UserComponent } from '../ele-app/types';
import type { EleMessageOptions } from '../ele-app/plus';
import type { DataItem } from '../ele-data-table/types';
import type { Datasource } from '../ele-pro-table/types';
import type { ProFormItemTypeData, ScreenSize } from '../ele-pro-form/types';
import type {
  CrudField,
  ListConfig,
  SearchConfig,
  EditConfig,
  PageConfig,
  DeleteApi,
  EditApi,
  DetailApi,
  TreeListApi,
  CrudLocale
} from './types';

/**
 * 属性
 */
export const crudProps = {
  /** 字段数据 */
  fields: Array as PropType<CrudField[]>,
  /** 列表配置 */
  listConfig: Object as PropType<ListConfig>,
  /** 搜索栏配置 */
  searchConfig: {
    type: [Object, Boolean] as PropType<SearchConfig | boolean>,
    default: () => {
      return null;
    }
  },
  /** 添加配置 */
  addConfig: {
    type: [Object, Boolean] as PropType<EditConfig | boolean>,
    default: () => {
      return null;
    }
  },
  /** 修改配置 */
  editConfig: {
    type: [Object, Boolean] as PropType<EditConfig | boolean>,
    default: () => {
      return null;
    }
  },
  /** 页面配置 */
  pageConfig: Object as PropType<PageConfig>,
  /** 高级表单组件 */
  proFormComponent: [String, Object, Function] as PropType<UserComponent>,
  /** 表格数据接口 */
  listApi: [Array, Function, String] as PropType<Datasource | string>,
  /** 删除数据接口 */
  deleteApi: [Function, String] as PropType<DeleteApi | string>,
  /** 添加数据接口 */
  addApi: [Function, String] as PropType<EditApi | string>,
  /** 修改数据接口 */
  editApi: [Function, String] as PropType<EditApi | string>,
  /** 详情接口 */
  detailApi: [Function, String] as PropType<DetailApi | string>,
  /** 侧栏树组件数据接口 */
  treeListApi: [Array, Function, String] as PropType<
    Array<Record<string, any>> | TreeListApi | string
  >,
  /** 消息提示组件属性 */
  messageOptions: Object as PropType<EleMessageOptions>,
  /** 高级表单组件类型数据 */
  itemTypeData: Array as PropType<ProFormItemTypeData[]>,
  /** 远程数据源请求工具 */
  httpRequest: [Object, Function],
  /** 屏幕尺寸 */
  screenSize: String as PropType<ScreenSize>,
  /** 国际化 */
  locale: Object as PropType<Partial<CrudLocale>>
};

export type CrudProps = ExtractPropTypes<typeof crudProps>;

/**
 * 事件
 */
export const crudEmits = {
  /** 表格多选数据改变事件 */
  tableSelectionsChange: (_selections: DataItem[]) => true
};
