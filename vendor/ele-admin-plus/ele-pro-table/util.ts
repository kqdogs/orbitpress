import type { ElePaginationProps } from '../ele-app/plus';
import {
  getValue,
  eachTree,
  mapTree,
  findTree,
  uuid,
  omit
} from '../utils/common';
import type {
  DataItem,
  Column,
  Columns,
  Sorter,
  Filter,
  TableSize,
  TreeProps,
  RowKey,
  SpanMethod,
  SummaryMethod
} from '../ele-data-table/types';
import { getColFixedNumber } from '../ele-data-table/util';
import {
  analyseColumns,
  getCellSpan,
  getIndexValue,
  getSumValue,
  getUserSums
} from '../ele-virtual-table/util';
import type {
  Pages,
  Orders,
  Filters,
  OrderItem,
  RequestOption,
  ResponseOption,
  TablePagination,
  DatasourceResult,
  ResponseResult,
  ReloadDataResult,
  ColItem,
  ProProps,
  ExportBodyNode,
  ExportDataItem,
  ExportDataResult,
  CacheKey,
  TableLocale
} from './types';

/**
 * 合并复合属性
 * @param props 属性
 * @param globalProps 全局属性
 */
export function mergeProps<T extends Record<keyof any, any>>(
  props?: ProProps<T> | null,
  globalProps?: ProProps<T> | null
): ProProps<T> {
  if (props == null) {
    return globalProps ?? true;
  }
  if (!props) {
    return false;
  }
  if (!globalProps || typeof globalProps !== 'object') {
    return props;
  }
  if (typeof props !== 'object') {
    return globalProps;
  }
  return { ...globalProps, ...props };
}

/**
 * 获取分页组件属性
 * @param size 表格尺寸
 * @param pagination 分页组件属性
 * @param globalPagination 全局配置分页组件属性
 * @param pageProps 分页相关的属性
 */
export function getPaginationProps(
  size: TableSize,
  pagination: boolean | TablePagination | undefined,
  globalPagination: boolean | TablePagination | undefined,
  pageProps?: Pick<
    ElePaginationProps,
    'total' | 'pageSize' | 'currentPage' | 'hasNext'
  >
): ElePaginationProps | null {
  const props = mergeProps<TablePagination>(pagination, globalPagination);
  if (props == null || props === false) {
    return null;
  }
  const defaultProps: ElePaginationProps = {
    size: size !== 'large' ? 'small' : 'default',
    pagerCount: 5,
    layout: 'total, prev, pager, next, sizes, jumper',
    pageSizes: [10, 20, 30, 40, 50, 100],
    hideOnSinglePage: false
  };
  if (typeof props !== 'object') {
    return Object.assign(defaultProps, pageProps);
  }
  return Object.assign(defaultProps, omit(props, ['autoAmend']), pageProps);
}

/**
 * 获取默认页码
 * @param pagination 分页组件属性
 * @param globalPagination 全局配置分页组件属性
 */
export function getTablePage(
  pagination: boolean | TablePagination | undefined,
  globalPagination: boolean | TablePagination | undefined
): number {
  const props = getPaginationProps(void 0, pagination, globalPagination);
  return props?.currentPage ?? 1;
}

/**
 * 获取默认每页数量
 * @param pagination 分页组件属性
 * @param globalPagination 全局配置分页组件属性
 */
export function getTableLimit(
  pagination: boolean | TablePagination | undefined,
  globalPagination: boolean | TablePagination | undefined
): number {
  const props = getPaginationProps(void 0, pagination, globalPagination);
  return props?.pageSize ?? 10;
}

/**
 * 判断是否开启自动修正页码
 * @param pagination 分页组件属性
 * @param globalPagination 全局配置分页组件属性
 */
export function isAutoAmend(
  pagination: boolean | TablePagination | undefined,
  globalPagination: boolean | TablePagination | undefined
): boolean {
  const props = mergeProps<TablePagination>(pagination, globalPagination);
  if (!props) {
    return false;
  }
  if (typeof props === 'object') {
    return !!props.autoAmend;
  }
  return props === true;
}

/**
 * 获取表格默认尺寸
 * @param cacheKey 本地缓存的键名
 * @param size 表格尺寸
 * @param globalSize 全局配置尺寸
 */
export function getTableSize(
  cacheKey?: string,
  size?: TableSize,
  globalSize?: TableSize
): TableSize {
  return getCacheSize(cacheKey) ?? size ?? globalSize ?? 'default';
}

/**
 * 获取默认筛选条件
 * @param columns 表格的列
 */
export function getDefaultFilter(columns?: Columns): Filter {
  const filter: Filter = {};
  eachTree(columns, (d) => {
    const prop = d.columnKey ?? d.prop;
    if (typeof prop === 'string' && prop && d.filteredValue) {
      filter[prop] = d.filteredValue;
    }
  });
  return filter;
}

/**
 * 获取请求参数名称
 * @param globalRequest 全局配置
 * @param request 当前配置
 */
export function getRequestName(
  globalRequest?: RequestOption,
  request?: RequestOption
): RequestOption {
  // 默认配置
  const defaultRequest: RequestOption = {
    pageName: 'page',
    limitName: 'limit',
    sortName: 'sort',
    orderName: 'order',
    ascValue: 'asc',
    descValue: 'desc'
  };
  return Object.assign(defaultRequest, globalRequest, request);
}

/**
 * 获取响应参数名称
 * @param globalResponse 全局响应参数配置
 * @param response 响应参数配置
 */
export function getResponseName(
  globalResponse?: ResponseOption,
  response?: ResponseOption
): ResponseOption {
  // 默认配置
  const defaultResponse: ResponseOption = {
    dataName: 'list',
    countName: 'count'
  };
  return Object.assign(defaultResponse, globalResponse, response);
}

/**
 * 获取排序方式封装
 * @param sorter 排序方式
 */
export function getOrderItems(sorter?: Sorter): OrderItem[] {
  const orders: OrderItem[] = [];
  if (!sorter || !sorter.order) {
    return orders;
  }
  const descend = sorter.order === 'descending';
  const sortMethod = sorter.column?.sortMethod;
  const sortBy = sorter.column?.sortBy;
  if (Array.isArray(sortBy) && sortBy.length) {
    sortBy.forEach((field) => {
      if (typeof field === 'string' && field.length) {
        orders.push({ field, descend, sortMethod });
      }
    });
  } else {
    const field = typeof sortBy === 'string' && sortBy ? sortBy : sorter.prop;
    if (field) {
      orders.push({ field, descend, sortMethod });
    }
  }
  return orders;
}

/**
 * 生成请求的排序参数
 * @param sorter 排序方式
 * @param request 请求参数配置
 * @param globalRequest 全局请求参数配置
 */
export function getRequestOrders(
  sorter?: Sorter,
  request?: RequestOption,
  globalRequest?: RequestOption
): Orders {
  const orders: Orders = {};
  const { sortName, orderName, ascValue, descValue } = getRequestName(
    globalRequest,
    request
  );
  if (!sortName || !orderName) {
    return orders;
  }
  const items = getOrderItems(sorter);
  if (items.length === 1) {
    orders[sortName] = items[0].field;
    orders[orderName] = items[0].descend ? descValue : ascValue;
  } else if (items.length) {
    orders[sortName] = items
      .map((d) => [d.field, d.descend ? descValue : ascValue].join(' '))
      .join(',');
  }
  return orders;
}

/**
 * 生成请求的筛选参数
 * @param filter 筛选条件
 */
export function getRequestFilters(filter?: Filter): Filters {
  const filters: Filters = {};
  if (filter) {
    Object.keys(filter).forEach((key) => {
      const value = filter[key];
      if (value == null) {
        return;
      }
      if (typeof value === 'string') {
        if (value) {
          filters[key] = value;
        }
      } else if (Array.isArray(value)) {
        if (value.length) {
          filters[key] = value.join(',');
        }
      } else {
        filters[key] = value;
      }
    });
  }
  return filters;
}

/**
 * 生成请求的分页参数
 * @param page 页码
 * @param limit 每页数量
 * @param request 请求参数配置
 * @param globalRequest 全局请求参数配置
 */
export function getRequestPages(
  page: number,
  limit: number,
  request?: RequestOption,
  globalRequest?: RequestOption
): Pages {
  const pages: Pages = {};
  const { pageName, limitName } = getRequestName(globalRequest, request);
  if (!pageName || !limitName) {
    return pages;
  }
  pages[pageName] = page;
  pages[limitName] = limit;
  return pages;
}

/**
 * 获取数据源请求结果
 * @param result 数据源请求的原始数据
 * @param response 响应参数配置
 * @param globalResponse 全局响应参数配置
 * @param lazy 表格是否开启懒加载
 * @param treeOpt 树形表格字段名配置
 */
export function getResponseResult(
  result: DatasourceResult,
  response?: ResponseOption,
  globalResponse?: ResponseOption,
  lazy?: boolean,
  treeOpt?: TreeProps
): ResponseResult {
  if (!result || Array.isArray(result)) {
    return {
      data: getResponseData(result as DataItem[], lazy, treeOpt),
      result
    };
  }
  const { dataName, countName } = getResponseName(globalResponse, response);
  if (!dataName) {
    return { result };
  }
  return {
    data: getResponseData(getValue(result, dataName), lazy, treeOpt),
    total: (countName ? getValue(result, countName) : void 0) ?? 0,
    result
  };
}

/**
 * 树形懒加载时数据增加可展开的字段标识
 * @param data 请求数据
 * @param lazy 表格是否开启懒加载
 * @param treeProps 树形表格字段名配置
 */
export function getResponseData(
  data?: DataItem[] | null,
  lazy?: boolean,
  treeProps?: TreeProps
): DataItem[] | undefined {
  if (!data || !lazy) {
    return data || [];
  }
  const name = treeProps?.hasChildren ?? 'hasChildren';
  return data.map((d) => {
    const temp = { ...d };
    temp[name] = temp[name] ?? true;
    return temp;
  });
}

/**
 * 排序数据
 * @param datasource 数据源
 * @param sorter 排序方式
 */
export function sortData(datasource?: DataItem[], sorter?: Sorter): DataItem[] {
  if (!datasource || !datasource.length) {
    return [];
  }
  const data = [...datasource];
  getOrderItems(sorter).forEach((item) => {
    data.sort((a, b) => {
      if (typeof item.sortMethod === 'function') {
        const r = item.sortMethod(a, b);
        return item.descend ? -r : r;
      }
      const aValue = getValue<any, DataItem>(a, item.field);
      const bValue = getValue<any, DataItem>(b, item.field);
      const r = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return item.descend ? -r : r;
    });
  });
  return data;
}

/**
 * 前端分页排序
 * @param datasource 数据源
 * @param sorter 排序方式
 * @param page 页码
 * @param limit 每页数量
 */
export function reloadData(
  datasource?: DataItem[],
  sorter?: Sorter,
  page?: number,
  limit?: number
): ReloadDataResult {
  const data = sortData(datasource, sorter);
  const total = data.length;
  if (!page || !limit) {
    return { page: 1, data, total };
  }
  const maxPage = Math.ceil(total / limit);
  if (maxPage && page > maxPage) {
    page = maxPage;
  }
  const start = (page - 1) * limit;
  const end = start + limit;
  const list = data.slice(start, end > total ? total : end);
  return { page, data: list, total };
}

/**
 * 获取列配置标识
 * @param column 列数据
 */
export function getColId(column: Column): string | undefined {
  if (column.columnKey == null || column.columnKey === '') {
    return column.prop;
  }
  return column.columnKey;
}

/**
 * 获取初始显示的列数据
 * @param columns 列数据
 * @param cacheColsWidth 缓存的列宽
 */
export function getInitColumns(
  columns: Columns,
  cacheColsWidth?: ColItem[]
): Columns {
  const data: Columns = [];
  columns.forEach((d) => {
    if (!d.hideInTable) {
      const width = getCacheColWidth(cacheColsWidth, d) ?? d.width;
      if (d.children?.length) {
        const children = getInitColumns(d.children);
        if (children.length) {
          data.push({ ...d, width, children });
        }
      } else {
        data.push({ ...d, width });
      }
    }
  });
  return data;
}

/**
 * 获取初始显示的列数据
 * @param columns 列数据
 * @param cacheKey 缓存名称
 * @param sortable 是否可排序
 */
export function getInitCacheColumns(
  columns: Columns,
  cacheKey?: string,
  sortable?: boolean
): Columns {
  const cacheCols = getCacheCols(getColsCacheKey(cacheKey));
  if (!cacheCols) {
    return getInitColumns(columns, getCacheColsWidth(cacheKey));
  }
  return getCheckedColumns(
    columns,
    cacheCols,
    sortable,
    (item) => item.hideInSetting,
    void 0,
    false,
    getCacheColsWidth(cacheKey)
  );
}

/**
 * 获取显示的列配置
 * @param columns 原始列数据
 * @param cols 列配置数据
 * @param sortable 是否进行排序
 * @param isHideInCol 用于排序时计算不显示在配置中的列
 * @param filter 强制过滤的列
 * @param reserveUnchecked 是否保留未选中的列
 * @param cacheColsWidth 缓存的列宽
 */
export function getCheckedColumns(
  columns: Columns | undefined,
  cols: ColItem[],
  sortable: boolean | undefined,
  isHideInCol?: (item: Column) => boolean | undefined,
  filter?: (item: Column) => boolean,
  reserveUnchecked?: boolean,
  cacheColsWidth?: ColItem[]
): Columns {
  const data: Columns = [];
  if (!columns || !columns.length) {
    return data;
  }
  columns.forEach((d) => {
    const colId = getColId(d);
    if (filter && !filter(d)) {
      return;
    }
    const temp = colId == null ? null : findTree(cols, (t) => t.uid === colId);
    const hideInTable = temp ? !temp.checked : d.hideInTable;
    if (!reserveUnchecked && hideInTable) {
      return;
    }
    const width = getCacheColWidth(cacheColsWidth, d) ?? d.width;
    const fixed = temp?.fixed ?? d.fixed;
    const uid = uuid(8);
    if (d.children && d.children.length) {
      const children = getCheckedColumns(
        d.children,
        cols,
        sortable,
        isHideInCol,
        filter,
        reserveUnchecked,
        cacheColsWidth
      );
      if (children.length) {
        data.push({ ...d, width, fixed, hideInTable, children, uid });
      }
      return;
    }
    data.push({ ...d, width, fixed, hideInTable, uid });
  });
  // 排序
  if (!sortable || !data.length) {
    return data;
  }
  data.sort((a, b) => {
    const aColId = getColId(a);
    const bColId = getColId(b);
    let i = 0;
    let ai: number | undefined;
    let bi: number | undefined;
    eachTree(cols, (c) => {
      if (c.uid === aColId) {
        ai = i;
      }
      if (c.uid === bColId) {
        bi = i;
      }
      i++;
    });
    // 固定列处理
    if (ai == null && isHideInCol?.(a) && a.fixed === 'right') {
      ai = i;
    }
    if (ai == null) {
      ai = -1;
    }
    if (a.fixed === true || a.fixed === 'left') {
      ai -= i;
    } else if (a.fixed === 'right' || (isHideInCol?.(a) && !a.fixed)) {
      ai += i;
    }
    if (bi == null && isHideInCol?.(b) && b.fixed === 'right') {
      bi = i;
    }
    if (bi == null) {
      bi = -1;
    }
    if (b.fixed === true || b.fixed === 'left') {
      bi -= i;
    } else if (b.fixed === 'right' || (isHideInCol?.(b) && !b.fixed)) {
      bi += i;
    }
    return ai - bi;
  });
  return data;
}

/**
 * 获取列展示列表数据
 * @param columns 列配置
 * @param locale 国际化
 * @param filter 过滤列的方法
 * @param cacheCols 缓存的列展示列表数据
 * @param sortFixed 是否对固定列排序
 * @param cancelFixed 是否取消固定列
 * @param cacheColsWidth 缓存的列宽
 */
export function getColItems(
  columns: Columns | undefined,
  locale: TableLocale,
  filter?: (item: Column) => boolean,
  cacheCols?: ColItem[],
  sortFixed?: boolean,
  cancelFixed?: boolean,
  cacheColsWidth?: ColItem[]
) {
  const temp = columns == null ? [] : [...columns];
  if (sortFixed) {
    temp.sort(
      (a, b) => getColFixedNumber(a.fixed) - getColFixedNumber(b.fixed)
    );
  }
  //
  const cols = mapTree<Column, ColItem>(temp, (d, _i, parent) => {
    const colId = getColId(d);
    if (colId == null || (filter && !filter(d))) {
      return;
    }
    const old = findTree(cacheCols, (t) => t.uid === colId);
    const item: ColItem = {
      uid: colId,
      type: d.type,
      label:
        d.label ||
        (d.type === 'index'
          ? locale.columnIndex
          : d.type === 'selection'
            ? locale.columnSelection
            : d.type === 'expand'
              ? locale.columnExpand
              : locale.columnUntitled),
      checked: old?.checked ?? !d.hideInTable,
      fixed: cancelFixed || parent != null ? false : (old?.fixed ?? d.fixed),
      width: getCacheColWidth(cacheColsWidth, d) ?? d.width
    };
    return item;
  });
  //
  if (cacheCols && cacheCols.length) {
    cols.sort((a, b) => {
      const oldAI = cacheCols.findIndex((t) => t.uid === a.uid);
      const oldBI = cacheCols.findIndex((t) => t.uid === b.uid);
      const ai = oldAI === -1 ? cols.indexOf(a) : oldAI;
      const bi = oldBI === -1 ? cols.indexOf(b) : oldBI;
      return ai - bi;
    });
    eachTree(cols, (item) => {
      if (item.children && item.children.length) {
        const oldC = findTree(cacheCols, (t) => t.uid === item.uid)?.children;
        if (oldC && oldC.length) {
          item.children.sort((a, b) => {
            const oldAI = oldC.findIndex((t) => t.uid === a.uid);
            const oldBI = oldC.findIndex((t) => t.uid === b.uid);
            const ai = oldAI === -1 ? cols.indexOf(a) : oldAI;
            const bi = oldBI === -1 ? cols.indexOf(b) : oldBI;
            return ai - bi;
          });
        }
      }
    });
  }
  //
  let checkAll = true;
  let indeterminate = false;
  eachTree(cols, (d) => {
    if (!d.checked && checkAll) {
      checkAll = false;
    }
    if (d.checked && !indeterminate) {
      indeterminate = true;
    }
    if (!checkAll && indeterminate) {
      return false;
    }
  });
  return {
    cols,
    checkAll: cols.length > 0 && checkAll,
    indeterminate: !checkAll && indeterminate
  };
}

/**
 * 获取表格密度缓存的名称
 * @param cacheKey 缓存的名称
 */
export function getSizeCacheKey(cacheKey: string): string {
  return `${cacheKey}Size`;
}

/**
 * 获取列配置缓存的名称
 * @param cacheKey 缓存的名称
 */
export function getColsCacheKey<T extends CacheKey>(cacheKey: T): T {
  return (cacheKey ? `${cacheKey}Cols` : void 0) as T;
}

/**
 * 获取表格列宽缓存的名称
 * @param cacheKey 缓存的名称
 */
export function getColsWidthCacheKey(cacheKey: string): string {
  return `${cacheKey}ColsWidth`;
}

/**
 * 获取导出的列配置缓存的名称
 * @param cacheKey 缓存的名称
 */
/* export function getExportColsCacheKey<T extends CacheKey>(cacheKey: T): T {
  return (cacheKey ? `${cacheKey}ExportCols` : void 0) as T;
} */

/**
 * 获取导出的列宽缓存的名称
 * @param cacheKey 缓存的名称
 */
/* export function getExportColsWidthCacheKey(cacheKey: string): string {
  return `${cacheKey}ExportColsWidth`;
} */

/**
 * 获取打印的列配置缓存的名称
 * @param cacheKey 缓存的名称
 */
/* export function getPrintColsCacheKey<T extends CacheKey>(cacheKey: T): T {
  return (cacheKey ? `${cacheKey}PrintCols` : void 0) as T;
} */

/**
 * 获取打印的列宽缓存的名称
 * @param cacheKey 缓存的名称
 */
/* export function getPrintColsWidthCacheKey(cacheKey: string): string {
  return `${cacheKey}PrintColsWidth`;
} */

/**
 * 获取缓存的列配置下拉列表数据
 * @param cacheKey 缓存的名称
 */
export function getCacheCols(cacheKey?: string): ColItem[] | undefined {
  if (cacheKey) {
    const oldJSON = localStorage.getItem(cacheKey);
    if (oldJSON) {
      try {
        const old: ColItem[] | undefined = JSON.parse(oldJSON);
        return old && Array.isArray(old) ? old : void 0;
      } catch (e) {
        console.error(e);
      }
    }
  }
}

/**
 * 获取缓存的表格密度
 * @param cacheKey 缓存的名称
 */
export function getCacheSize(cacheKey?: string): TableSize {
  if (cacheKey) {
    const size = localStorage.getItem(getSizeCacheKey(cacheKey));
    if (size) {
      return size as TableSize;
    }
  }
}

/**
 * 获取缓存的列宽
 * @param cacheKey 缓存的名称
 */
export function getCacheColsWidth(cacheKey?: string): ColItem[] | undefined {
  if (cacheKey) {
    const oldJSON = localStorage.getItem(getColsWidthCacheKey(cacheKey));
    if (oldJSON) {
      try {
        const old: ColItem[] | undefined = JSON.parse(oldJSON);
        return old && Array.isArray(old) ? old : void 0;
      } catch (e) {
        console.error(e);
      }
    }
  }
}

/**
 * 获取列对应的缓存的列宽
 * @param cacheColsWidth 缓存的列宽
 * @param column 列配置
 */
export function getCacheColWidth(
  cacheColsWidth?: ColItem[],
  column?: Column
): number | string | undefined {
  if (cacheColsWidth == null || column == null) {
    return;
  }
  const colId = getColId(column);
  const c = findTree(cacheColsWidth, (d) => d.uid === colId);
  if (!c || c.width == null) {
    return;
  }
  if (c.width === '' || (typeof c.width === 'string' && !c.width.trim())) {
    return '';
  }
  const width = Number(c.width);
  return isNaN(width) ? c.width : width;
}

/**
 * 缓存列宽
 * @param width 列宽
 * @param column 列配置
 * @param cacheKey 缓存的名称
 */
export function cacheColWidth(
  width: number,
  column?: Column,
  cacheKey?: string
) {
  if (cacheKey && column) {
    const colId = getColId(column);
    if (colId) {
      const colsWidth = getCacheColsWidth(cacheKey) || [];
      const old = colsWidth.find((d) => d.uid === colId);
      if (!old) {
        colsWidth.push({ uid: colId, width });
      } else {
        old.width = width;
      }
      localStorage.setItem(
        getColsWidthCacheKey(cacheKey),
        JSON.stringify(colsWidth)
      );
    }
  }
}

/**
 * 获取 rowKey
 * @param rowKey 自定义 rowKey
 */
export function getRowKey(rowKey?: RowKey) {
  if (rowKey != null) {
    return rowKey;
  }
  return (row: DataItem) => {
    return JSON.stringify(row);
  };
}

/**
 * 导出获取单元格文本
 * @param column 列配置
 * @param row 行数据
 * @param index 行索引
 * @param pageIndex 序号列起始索引
 */
export function getCellText(
  column: Column | undefined,
  row: DataItem,
  index: number,
  pageIndex?: number
): string | number | boolean | Record<string, any> | Array<any> {
  if (!column) {
    return '';
  }
  if (column.type === 'index') {
    return getIndexValue(index, column.index, pageIndex);
  }
  const propValue = column.prop == null ? void 0 : getValue(row, column.prop);
  if (typeof column.formatter === 'function') {
    return column.formatter(row, column as any, propValue, index) as any;
  }
  return propValue == null ? '' : propValue;
}

/**
 * 导出获取表头单元格文本
 * @param column 列配置
 * @param index 行索引
 */
export function getHeaderCellText(
  column: Column | undefined,
  index: number
): string {
  if (!column) {
    return '';
  }
  if (typeof column.renderHeader === 'function') {
    return column.renderHeader({ column, $index: index } as any) as any;
  }
  return column.label == null ? '' : String(column.label);
}

/**
 * 获取主体数据封装节点
 * @param data 数据
 * @param childrenField 子级字段名
 * @param level 树形所处深度
 * @param parents 父级节点
 */
export function getExportBodyNode(
  data: DataItem[],
  childrenField = 'children',
  level = 0,
  parents = [] as ExportBodyNode[]
) {
  const bodyDodes: ExportBodyNode[] = [];
  let maxDepth = 0;
  data.forEach((row, index) => {
    const node: ExportBodyNode = { row, index, level, childSize: 0 };
    bodyDodes.push(node);
    parents.forEach((parent) => {
      parent.childSize++;
    });
    const children: DataItem[] | undefined = row[childrenField];
    if (children && children.length) {
      const { depth, nodes } = getExportBodyNode(
        children,
        childrenField,
        level + 1,
        [...parents, node]
      );
      maxDepth = Math.max(maxDepth, depth);
      nodes.forEach((n) => {
        bodyDodes.push(n);
      });
    }
  });
  return { depth: maxDepth + 1, nodes: bodyDodes };
}

/**
 * 获取导出的数据
 * @param data 数据
 * @param columns 列配置
 * @param spanMethod 单元格合并方法
 * @param pageIndex 序号列起始索引
 * @param showSummary 是否显示合计行
 * @param sumText 合计行文本
 * @param summaryMethod 合计行自定义方法
 * @param childrenField 子级字段名
 * @param showTreeIndex 是否显示层级序号
 * @param showHeader 是否显示表头
 */
export function getExportData(
  data: DataItem[],
  columns: Columns,
  spanMethod?: SpanMethod,
  pageIndex?: number,
  showSummary?: boolean,
  sumText?: string,
  summaryMethod?: SummaryMethod,
  childrenField?: string,
  showTreeIndex?: boolean,
  showHeader?: boolean
): ExportDataResult {
  const { nodes, depth } = getExportBodyNode(data, childrenField);
  const { rows: headerRows, cols: bodyCols } = analyseColumns(columns);
  // 是否显示展开行合并序号
  const showExpandIndex = bodyCols.some((c) => c.originalCol?.type === 'expand')
    ? showTreeIndex
    : false;
  if (depth <= 1 || showExpandIndex) {
    showTreeIndex = false;
  }
  // 树展开图标列索引
  const treeIconIndex = showTreeIndex
    ? void 0
    : bodyCols.findIndex(
        (c) =>
          !c.originalCol?.type ||
          !['index', 'expand', 'selection'].includes(c.originalCol.type)
      );

  // 主体
  const bodyData: ExportDataItem[][] = [];
  nodes.forEach((node, index) => {
    const row = node.row;
    const bodyRowData: ExportDataItem[] = [];
    const expandRowData: ExportDataItem[] = [];
    bodyCols.forEach((col, columnIndex) => {
      const { key: colKey, originalCol: column } = col;
      const key = `${index}-${columnIndex}-${colKey}`;
      const { colspan, rowspan } = getCellSpan(
        { column, columnIndex, row, rowIndex: index, data, columns },
        spanMethod
      );
      const isNone = colspan == 0 || rowspan == 0;
      const text = isNone ? '' : getCellText(column, row, index, pageIndex);
      const dataItem: ExportDataItem = {
        key,
        row,
        index,
        column,
        text,
        colspan,
        rowspan,
        isTreeCell: depth > 1 ? columnIndex === treeIconIndex : false,
        isTreeLeaf: !node.childSize,
        indent: node.level
      };
      if (column.type === 'expand') {
        dataItem.text = showExpandIndex ? node.index + 1 : '';
        if (showExpandIndex && !expandRowData.length) {
          dataItem.rowspan = 2;
        }
        const expandDataItem: ExportDataItem = {
          key: `_expand_${key}`,
          row,
          index,
          column,
          text,
          colspan: showExpandIndex ? bodyCols.length - 1 : bodyCols.length,
          isExpandCell: true
        };
        if (showExpandIndex) {
          expandRowData[0] = {
            key: `_expand_0-${key}`,
            row,
            index,
            rowspan: 0,
            colspan: 0,
            isExpandCell: true
          };
          expandRowData[1] = expandDataItem;
        } else {
          expandRowData[0] = expandDataItem;
        }
      }
      bodyRowData.push(dataItem);
    });
    bodyData.push(bodyRowData);
    // 添加展开行
    if (expandRowData.length) {
      bodyData.push(expandRowData);
    }
    // 添加层级序号
    if (showTreeIndex) {
      for (let i = depth - 1; i >= 0; i--) {
        const colspan = i < node.level ? 0 : 1;
        bodyRowData.unshift({
          key: `_index_${index}-${i}`,
          index,
          text: i === node.level ? node.index + 1 : void 0,
          colspan: colspan,
          rowspan: i === node.level ? node.childSize + 1 : colspan,
          isTreeIndex: true,
          hideLeftBorder: i === node.level ? false : true,
          hideRightBorder: bodyCols.length ? true : false
        });
      }
    }
  });

  // 表头
  const headerData: ExportDataItem[][] = [];
  if (showHeader) {
    headerRows.forEach((headerCols, index) => {
      const headerRowData: ExportDataItem[] = [];
      headerCols.forEach((col) => {
        const { key, colspan, rowspan, originalCol: column } = col;
        const isNone = colspan == 0 || rowspan == 0;
        const text = isNone ? '' : getHeaderCellText(column, index);
        headerRowData.push({ key, index, column, text, colspan, rowspan });
      });
      headerData.push(headerRowData);
      // 添加层级序号占位
      if (showTreeIndex) {
        for (let i = depth - 1; i >= 0; i--) {
          headerRowData.unshift({
            key: `_index_th_${index}-${i}`,
            index,
            colspan: i === 0 ? (index === 0 ? depth : 0) : 0,
            rowspan: i === 0 ? (index === 0 ? headerRows.length : 0) : 0,
            isTreeIndex: true
          });
        }
      }
    });
  }

  // 表尾
  const footerData: ExportDataItem[][] = [];
  if (showSummary && data.length) {
    const footerRowData: ExportDataItem[] = [];
    const uSum = getUserSums(summaryMethod, bodyCols, data);
    bodyCols.forEach((col, i) => {
      const { key, dataKey: dKey, originalCol: column } = col;
      const text = uSum == null ? getSumValue(data, dKey, i, sumText) : uSum[i];
      footerRowData.push({ key, column, text, index: 0 });
    });
    footerData.push(footerRowData);
    // 添加层级序号占位
    if (showTreeIndex) {
      for (let i = depth - 1; i >= 0; i--) {
        footerRowData.unshift({
          key: `_index_tf-${i}`,
          index: 0,
          colspan: i === 0 ? depth : 0,
          rowspan: i === 0 ? headerRows.length : 0,
          isTreeIndex: true
        });
      }
    }
  }

  // 添加层级序号列宽
  if (showTreeIndex) {
    for (let i = depth - 1; i >= 0; i--) {
      bodyCols.unshift({ key: `_index_${i}`, width: 26 } as any);
    }
  }

  return { headerData, bodyData, footerData, bodyCols };
}

/**
 * 导出 csv 文件
 * @param fileName 文件名
 * @param headerData 表头数据
 * @param bodyData 主体数据
 * @param footerData 表尾数据
 */
export function exportCSV(
  fileName: string,
  headerData: ExportDataItem[][],
  bodyData: ExportDataItem[][],
  footerData: ExportDataItem[][]
) {
  const csvRows: string[] = [];
  [...headerData, ...bodyData, ...footerData].forEach((item) => {
    const cells = item.map((d) => {
      const str = d.text ?? '';
      const text =
        typeof str === 'string'
          ? str.replace(/,/g, '，').replace(/\n/g, '    ')
          : str;
      if (!d.isTreeCell || !d.indent) {
        return text;
      }
      const indent = Array.from({ length: d.indent }).fill('  ').join('');
      return indent + text;
    });
    csvRows.push(cells.join(','));
  });
  const content = encodeURIComponent(csvRows.join('\n'));
  const a = document.createElement('a');
  a.href = `data:text/csv;charset=utf-8,${content}`;
  a.download = fileName + '.csv';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * 导出判断列是否显示
 * @param item 列配置
 */
export function columnsExportFilter(item: Column): boolean {
  if (item.hideInExport) {
    return false;
  }
  return !item.type || !['selection'].includes(item.type);
}

/**
 * 打印判断列是否显示
 * @param item 列配置
 */
export function columnsPrintFilter(item: Column): boolean {
  if (item.hideInPrint) {
    return false;
  }
  return !item.type || !['selection'].includes(item.type);
}

/**
 * 列配置判断列是否显示
 * @param item 列配置
 */
export function columnsSettingFilter(item: Column): boolean {
  if (item.hideInSetting) {
    return false;
  }
  return true;
  //return !item.type || !['selection', 'index', 'expand'].includes(item.type);
}
