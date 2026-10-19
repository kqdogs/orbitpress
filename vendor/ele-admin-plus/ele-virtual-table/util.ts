import type { SetupContext, VNode } from 'vue';
import { TableV2SortOrder } from 'element-plus';
import {
  getValue,
  eachTree,
  findTree,
  mapTree,
  omit,
  contentIsEllipsis
} from '../utils/common';
import { getColFixedNumber } from '../ele-data-table/util';
import type {
  DataKey,
  DataItem,
  Column,
  Columns,
  Sorter,
  Filter,
  FilterValue,
  OrderValue,
  TableSize,
  RowKey,
  RowSelectable,
  TreeProps,
  ShowOverflowTooltip,
  SpanMethod,
  ColumnIndex,
  SummaryMethod
} from '../ele-data-table/types';
import type {
  VirtualColumn,
  VirtualColumns,
  BodyColumn,
  BodyColumns,
  HeaderColumn,
  HeaderRows,
  ColSize,
  CustomRenderProps,
  SortBy,
  TreeTableProps,
  CellSpan,
  CellParams,
  VirtualRow
} from './types';

/**
 * 获取行高
 * @param size 表格尺寸
 * @param rowHeight 自定义行高
 */
export function getRowHeight(size?: TableSize, rowHeight?: number) {
  if (rowHeight != null && rowHeight > 0) {
    return rowHeight;
  }
  if (size === 'small') {
    return 34;
  }
  if (size === 'large') {
    return 50;
  }
  return 42;
}

/**
 * 获取列的唯一值
 * @param column 列配置
 */
export function getColKey(column?: Column): string {
  if (!column) {
    return '';
  }
  return column.columnKey ?? column.property ?? column.prop ?? '';
}

/**
 * 获取数字类型的尺寸
 * @param size 字符或数字类型的尺寸
 * @param defaultValue 默认值
 */
export function getNumberSize<T extends number | undefined>(
  size?: string | number,
  defaultValue?: T
): number | T {
  if (typeof size === 'number') {
    if (size < 0) {
      return defaultValue as T;
    }
    return size;
  }
  if (size == null || size === '' || size === 'auto' || size.endsWith('%')) {
    return defaultValue as T;
  }
  const num = Number.parseInt(size);
  return (isNaN(num) ? defaultValue : num) as T;
}

/**
 * 获取表格高度
 * @param height 自定义高度
 * @param maxHeight 最大高度
 * @param minHeight 最小高度
 * @param wrapHeight 容器高度
 */
export function getTableHeight(
  height: string | number | undefined,
  maxHeight: string | number | undefined,
  minHeight: number,
  wrapHeight: number
): number {
  const max = getNumberSize(maxHeight);
  const h = getNumberSize(height);
  if (h != null) {
    return max == null || h <= max ? h : max;
  }
  return Math.max(wrapHeight, minHeight);
}

/**
 * 计算固定列需要显示阴影的位置
 * @param cols 列配置
 */
export function computeFixedCols(cols: VirtualColumns) {
  let lastFixedLeftIndex: number | undefined;
  let firstFixedRightIndex: number | undefined;
  cols.forEach((col, i) => {
    const c = col.originalCol;
    if (c) {
      if (c.fixed === 'left' || c.fixed === true) {
        lastFixedLeftIndex = i;
      } else if (firstFixedRightIndex == null && c.fixed === 'right') {
        firstFixedRightIndex = i;
      }
    }
  });
  if (lastFixedLeftIndex != null) {
    cols[lastFixedLeftIndex].isFixedLeftLast = true;
  }
  if (firstFixedRightIndex != null) {
    cols[firstFixedRightIndex].isFixedRightFirst = true;
  }
}

/**
 * 生成表头和主体列配置
 * @param columns 列配置
 * @param cols 用于存放主体列
 * @param rows 用于存放表头列
 * @param level 多级表头时当前级别
 * @param parentRowCol 多级表头时父表头列
 */
export function generateRowCols(
  columns: Columns,
  cols: BodyColumns,
  rows: HeaderRows,
  level: number,
  parentRowCol?: HeaderColumn
) {
  if (rows[level] == null) {
    rows[level] = [];
  }
  columns.forEach((col) => {
    const colKey = getColKey(col);
    const originalCol: Column = omit(col, ['children']);
    if (parentRowCol != null && parentRowCol.originalCol != null) {
      originalCol.fixed = parentRowCol.originalCol.fixed;
    }
    const rowCol: HeaderColumn = { key: colKey, originalCol };
    if (col.children && col.children.length) {
      rowCol.rowspan = 1;
      rowCol.colspan = col.children.length;
      generateRowCols(col.children, cols, rows, level + 1, rowCol);
      if (parentRowCol && parentRowCol.colspan != null) {
        parentRowCol.colspan += rowCol.colspan - 1;
      }
    } else {
      rowCol.colspan = 1;
      const bodyCol: BodyColumn = {
        width: getNumberSize(col.width),
        minWidth: getNumberSize(col.minWidth, 80),
        key: colKey,
        dataKey: col.property ?? col.prop,
        originalCol
      };
      cols.push(bodyCol);
    }
    rows[level].push(rowCol);
  });
}

/**
 * 分析列配置
 * @param columns 列配置
 */
export function analyseColumns(columns: Columns | undefined) {
  const cols: BodyColumns = [];
  const rows: HeaderRows = [];
  if (!columns || !columns.length) {
    return { cols, rows };
  }
  // 生成多级表头和主体列
  const sortedCols = [...columns];
  sortedCols.sort(
    (a, b) => getColFixedNumber(a.fixed) - getColFixedNumber(b.fixed)
  );
  generateRowCols(sortedCols, cols, rows, 0);
  // 固定列相关计算
  computeFixedCols(cols);
  // 表头计算跨行数
  rows.forEach((row, i) => {
    row.forEach((col) => {
      if (col != null && col.rowspan == null) {
        col.rowspan = rows.length - i;
      }
    });
  });
  // 表头填充多级占位列
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      const row = rows[i][j];
      if (row.colspan != null && row.colspan > 1) {
        for (let n = 1; n < row.colspan; n++) {
          rows[i].splice(j + n, 0, { colspan: 0, rowspan: 1 });
        }
      }
      if (row.rowspan != null && row.rowspan > 1) {
        for (let n = 1; n < row.rowspan; n++) {
          rows[i + n].splice(j, 0, {
            colspan: 1,
            rowspan: 0,
            originalCol: row.originalCol
          });
        }
      }
    }
  }
  // 表头固定列相关计算
  rows.forEach((row) => {
    computeFixedCols(row);
  });
  return { cols, rows };
}

/**
 * 分配列宽
 * @param col 列属性
 * @param tableWidth 表格宽度
 * @param colsWidth 已知的列总计宽度
 * @param colsMinWidth 剩余列总计最小宽度
 */
export function getColWidth(
  col: VirtualColumn,
  tableWidth: number,
  colsWidth: number,
  colsMinWidth: number
) {
  if (col.width != null) {
    return col.width;
  }
  if (col.minWidth == null) {
    return 0;
  }
  const surplusWidth = tableWidth - colsWidth;
  if (surplusWidth <= colsMinWidth) {
    return col.minWidth;
  }
  return Math.floor((col.minWidth / colsMinWidth) * surplusWidth);
}

/**
 * 计算左右固定列浮动位置
 * @param cols 列配置
 * @param colSizes 全部列宽
 */
export function computeFixedPositions(
  cols: VirtualColumns,
  colSizes: ColSize[]
) {
  let left = 0;
  cols.forEach((col, i) => {
    const c = col.originalCol;
    if (c && (c.fixed === 'left' || c.fixed === true)) {
      colSizes[i].fixedLeft = left + 'px';
      if (colSizes[i].width) {
        left += colSizes[i].width;
      }
    }
  });
  let right = 0;
  for (let i = cols.length - 1; i >= 0; i--) {
    const c = cols[i].originalCol;
    if (c && c.fixed === 'right') {
      colSizes[i].fixedRight = right + 'px';
      if (colSizes[i].width) {
        right += colSizes[i].width as number;
      }
    }
  }
}

/**
 * 计算列宽和固定列浮动位置
 * @param cols 主体列
 * @param rows 表头行
 * @param wrapWidth 容器宽度
 */
export function computeColSizes(
  cols: VirtualColumns,
  rows: HeaderRows,
  wrapWidth: number
) {
  // 计算表格宽度
  let isFixed = true; // 是否全部指定列宽
  let colsSumWidth = 0;
  let colsSumMinWidth = 0;
  cols.forEach((col) => {
    if (col.width == null) {
      isFixed = false;
      if (col.minWidth != null) {
        colsSumMinWidth += col.minWidth;
      }
      return;
    }
    colsSumWidth += col.width;
  });
  const tableWidth = isFixed ? Math.min(wrapWidth, colsSumWidth) : wrapWidth;
  // 分配主体列宽
  const colSizes: ColSize[] = [];
  let sumWidth = 0;
  cols.forEach((col, i) => {
    const width = getColWidth(col, tableWidth, colsSumWidth, colsSumMinWidth);
    sumWidth += width;
    colSizes[i] = { width };
    // 多余的宽度补充给最后一列
    if (i === cols.length - 1 && tableWidth > sumWidth) {
      colSizes[i].width = width + tableWidth - sumWidth;
      sumWidth = tableWidth;
    }
  });
  // 计算主体固定列左右位置
  computeFixedPositions(cols, colSizes);
  // 计算表头列宽
  const rowSizes: Array<ColSize[]> = [];
  rows.forEach((row) => {
    const sizes: ColSize[] = [];
    row.forEach((col, colIndex) => {
      if (!cols[colIndex] || !col.colspan) {
        sizes[colIndex] = { width: 0 };
        return;
      }
      let width = colSizes[colIndex].width || 0;
      if (col.colspan > 1) {
        const end = colIndex + col.colspan;
        for (let i = colIndex + 1; i < end; i++) {
          if (colSizes[i] && colSizes[i].width) {
            width += colSizes[i].width as number;
          }
        }
      }
      sizes[colIndex] = { width };
    });
    rowSizes.push(sizes);
    // 计算表头固定列左右位置
    computeFixedPositions(row, sizes);
  });
  return { width: tableWidth, colSizes, rowSizes, sumWidth };
}

/**
 * 判断表格列尺寸是否改变
 * @param colSizes 当前所有列尺寸
 * @param newSizes 新的所有列尺寸
 */
export function colSizesIsChanged(colSizes: ColSize[], newSizes: ColSize[]) {
  if (colSizes.length !== newSizes.length) {
    return true;
  }
  for (let i = 0; i < colSizes.length; i++) {
    if (colSizes[i].width !== newSizes[i].width) {
      return true;
    }
  }
  return false;
}

/**
 * 生成 ElTableV2 格式的列配置
 * @param bodyCols 主体列配置
 * @param colSizes 列尺寸数据
 */
export function getTableColumns(bodyCols: BodyColumns, colSizes: ColSize[]) {
  const columns: VirtualColumns = bodyCols.map<VirtualColumn>((col, i) => {
    return {
      title: col.originalCol ? col.originalCol.label : void 0,
      width: colSizes[i].width,
      key: col.key,
      dataKey: col.dataKey
    };
  });
  return columns.filter((col) => !!col.width);
}

/**
 * 处理表格数据
 * @param data 数据
 * @param hasExpandCol 是否有展开列
 * @param childrenName 树表格子级数据字段名
 * @param hasChildrenName 树表格是否有子级字段名
 * @param rowKey 数据唯一值字段名
 * @param selectable 控制行是否可选中的方法
 */
export function transformTableData(
  data: DataItem[] | undefined,
  hasExpandCol: boolean,
  childrenName: string,
  hasChildrenName: string,
  rowKey: RowKey,
  selectable?: RowSelectable | null
): VirtualRow[] {
  if (!data || !data.length) {
    return [];
  }
  if (hasExpandCol) {
    return data.map<VirtualRow>((d, i) => {
      const key = getValue<string, DataItem>(d, rowKey) ?? i;
      const temp: VirtualRow = {
        rowId: `_expand_${key}`,
        rowIndex: i,
        rowData: d,
        isExpandRow: true
      };
      return {
        rowId: key,
        rowIndex: i,
        rowData: d,
        isDisabled: !(selectable == null || selectable(d, index) === true),
        children: [temp]
      };
    });
  }
  let index = -1;
  return mapTree<DataItem, VirtualRow>(
    data,
    (d) => {
      index++;
      return {
        rowId: getValue<string, DataItem>(d, rowKey) ?? index,
        rowIndex: index,
        rowData: d,
        isDisabled: !(selectable == null || selectable(d, index) === true),
        hasChildren: d[hasChildrenName] === true
      };
    },
    childrenName
  );
}

/**
 * 获取值对应的数据
 * @param key 值
 * @param data 表格数据
 * @param rowKey 数据值字段名
 * @param childrenField 子级字段名
 */
export function getRowByKey<T extends DataItem | VirtualRow>(
  key: DataKey,
  data: T[],
  rowKey?: RowKey,
  childrenField?: keyof T
): T | undefined {
  if (rowKey == null) {
    // 内部组装的数据
    return findTree(data, (d) => d.rowId === key && !d.isExpandRow);
  }
  return findTree(data, (d) => getValue(d, rowKey) === key, childrenField);
}

/**
 * 获取平铺后的数据值和数据
 * @param data 表格数据
 * @param rowKey 数据值字段名
 * @param childrenField 子级字段名
 */
export function getKeysAndList<T extends DataItem | VirtualRow>(
  data?: T[],
  rowKey?: RowKey,
  childrenField?: keyof T
): [DataKey[], T[]] {
  const keys: DataKey[] = [];
  const list: T[] = [];
  eachTree(
    data,
    (d) => {
      const flag = rowKey == null; // 是否是内部组装的数据
      if (!flag || !d.isExpandRow) {
        keys.push(flag ? d.rowId : (getValue(d, rowKey) as DataKey));
        list.push(d);
      }
    },
    childrenField
  );
  return [keys, list];
}

/**
 * 判断是否自适应行高
 * @param hasExpandCol 是否有展开行
 * @param bodyCols 主体列配置
 * @param showOverflowTooltip 全局溢出提示属性
 */
export function isAutoRowHeight(
  hasExpandCol: boolean,
  bodyCols: BodyColumns,
  showOverflowTooltip: ShowOverflowTooltip
) {
  if (hasExpandCol) {
    return true;
  }
  let isAllEllipsis = true;
  for (const bodyCol of bodyCols) {
    const col = bodyCol.originalCol;
    if (col && col.type !== 'selection' && col.type !== 'expand') {
      if (col.showOverflowTooltip == null) {
        isAllEllipsis = false;
      } else if (col.showOverflowTooltip === false) {
        return true;
      }
    }
  }
  if (isAllEllipsis) {
    return false;
  }
  return showOverflowTooltip == null || showOverflowTooltip === false;
}

/**
 * 单元格渲染组件(用于同时支持插槽和返回 VNode 的自定义渲染函数)
 * @param props 属性
 * @param ctx SetupContext
 */
export function CellRender(
  props: CustomRenderProps,
  ctx: SetupContext
): VNode[] | undefined {
  if (typeof props.render === 'function' && props.params != null) {
    const node = props.render(...props.params);
    if (node != null) {
      return Array.isArray(node) ? node : [node as any];
    }
  }
  return ctx.slots.default?.();
}

/**
 * 获取表头点击后的排序值
 * @param current 当前排序值
 * @param col 点击的列
 */
export function getSortBy(current?: SortBy, col?: Column): SortBy | undefined {
  const key = getColKey(col);
  if (current == null || current.order == null || current.key !== key) {
    return { key, order: TableV2SortOrder.ASC as any };
  }
  if ((current.order as any) === TableV2SortOrder.DESC) {
    return;
  }
  return { key, order: TableV2SortOrder.DESC as any };
}

/**
 * 获取排序值对应的枚举
 * @param order 排序值
 */
export function getSortOrder(order?: OrderValue): TableV2SortOrder | undefined {
  if (order === 'ascending') {
    return TableV2SortOrder.ASC;
  }
  if (order === 'descending') {
    return TableV2SortOrder.DESC;
  }
}

/**
 * 获取排序枚举对应的值
 * @param sort 排序枚举
 */
export function getOrderValue(sort?: TableV2SortOrder): OrderValue | undefined {
  if (sort != null) {
    if (sort === TableV2SortOrder.ASC) {
      return 'ascending';
    }
    if (sort === TableV2SortOrder.DESC) {
      return 'descending';
    }
  }
}

/**
 * 获取默认排序
 * @param defaultSort 默认排序值
 */
export function getDefaultSort(defaultSort?: Sorter): SortBy | undefined {
  if (!defaultSort) {
    return;
  }
  const { prop, order } = defaultSort;
  if (!prop || !order || !['ascending', 'descending'].includes(order)) {
    return;
  }
  return {
    key: prop,
    order: (order === 'ascending'
      ? TableV2SortOrder.ASC
      : TableV2SortOrder.DESC) as any
  };
}

/**
 * 获取默认排序状态
 * @param defaultSort 默认排序值
 * @param columns 列配置
 */
export function getDefaultSorter(
  defaultSort?: Sorter,
  columns?: Columns
): Sorter | undefined {
  if (!defaultSort) {
    return;
  }
  const { prop, order } = defaultSort;
  const col = findTree(columns, (c) => c.prop === prop);
  return { prop, order, column: col };
}

/**
 * 获取默认筛选
 * @param columns 列配置
 */
export function getDefaultFiltered(columns?: Columns) {
  const filtered: Filter = {};
  eachTree(columns, (col: Column) => {
    const key = getColKey(col);
    if (key && col.filteredValue != null && col.filteredValue.length) {
      filtered[key] = col.filteredValue;
    }
  });
  return filtered;
}

/**
 * 获取列筛选值
 * @param col 列配置
 * @param filtered 当前筛选值
 */
export function getColFiltered(col?: Column, filtered?: Filter): FilterValue {
  if (!col) {
    return;
  }
  if (!filtered) {
    return col.filteredValue;
  }
  const key = getColKey(col);
  if (!key) {
    return col.filteredValue;
  }
  return filtered[key] ?? col.filteredValue;
}

/**
 * 获取判断多选是否可选择的方法
 * @param cols 列配置
 */
export function getSelectableFunction(cols: BodyColumns) {
  for (const bodyCol of cols) {
    const c = bodyCol.originalCol;
    if (c && c.type === 'selection') {
      return typeof c.selectable === 'function' ? c.selectable : null;
    }
  }
}

/**
 * 获取嵌套数据配置项
 * @param treeProps 嵌套数据配置项
 */
export function getTreeProps(treeProps?: TreeProps): TreeTableProps {
  const { children, hasChildren } = treeProps || {};
  return {
    childrenName: children || 'children',
    hasChildrenName: hasChildren || 'hasChildren'
  };
}

/**
 * 获取序号列值
 * @param rowIndex 行索引
 * @param index 自定义起始索引
 * @param pageIndex 表格分页起始索引
 */
export function getIndexValue(
  rowIndex: number,
  index?: ColumnIndex,
  pageIndex?: number
): number {
  if (index == null) {
    return (pageIndex ?? 1) + rowIndex;
  }
  if (typeof index === 'function') {
    return index(rowIndex);
  }
  return index + rowIndex;
}

/**
 * 获取单元格的跨行和跨列
 * @param column 列配置
 * @param columnIndex 列索引
 * @param row 行数据
 * @param rowIndex 行索引
 * @param spanMethod 跨行跨列方法
 */
export function getCellSpan(
  params: CellParams,
  spanMethod?: SpanMethod
): CellSpan {
  const span: CellSpan = { rowspan: 1, colspan: 1 };
  const type = params.column?.type;
  if (
    (!type || !['index', 'selection', 'expand'].includes(type)) &&
    typeof spanMethod === 'function'
  ) {
    const result = spanMethod(params as any);
    if (result != null) {
      if (Array.isArray(result)) {
        const [rowspan, colspan] = result;
        if (rowspan != null) {
          span.rowspan = rowspan;
        }
        if (colspan != null) {
          span.colspan = colspan;
        }
      } else {
        if (result.rowspan != null) {
          span.rowspan = result.rowspan;
        }
        if (result.colspan != null) {
          span.colspan = result.colspan;
        }
      }
    }
  }
  return span;
}

/**
 * 获取自定义的合计列
 * @param summaryMethod 自定义方法
 * @param bodyCols 表格主体列配置
 * @param data 表格数据
 */
export function getUserSums(
  summaryMethod?: SummaryMethod,
  bodyCols?: BodyColumns,
  data?: DataItem[]
): (string | VNode)[] | undefined {
  if (typeof summaryMethod !== 'function' || bodyCols == null || data == null) {
    return;
  }
  const columns: any = bodyCols.map((col) => {
    return { ...(col.originalCol || {}), property: col.dataKey };
  });
  return summaryMethod({ columns, data });
}

/**
 * 计算列合计值
 * @param data 表格数据
 * @param prop 列字段名称
 * @param index 列索引
 * @param sumText 第一列文本
 */
export function getSumValue(
  data?: DataItem[],
  prop?: string,
  index?: number,
  sumText?: string
): string {
  if (index === 0) {
    return sumText ?? 'Sum';
  }
  if (!data || !prop) {
    return '';
  }
  let sum = 0;
  for (const item of data) {
    const val = Number(getValue(item, prop));
    if (Number.isNaN(val)) {
      return '';
    }
    sum += val;
  }
  return String(sum);
}

/**
 * 获取原始列配置
 * @param columns 列配置
 * @param key 列的 key
 * @param dataKey 列的 dataKey
 */
export function getColumnByKey(
  columns?: Columns,
  key?: string,
  dataKey?: string
): Column | undefined {
  let column: Column | undefined = void 0;
  if (columns != null && key != null) {
    eachTree(columns, (col) => {
      if (dataKey != null) {
        if (col.property === dataKey || col.prop === dataKey) {
          column = col;
          return false;
        }
      } else if (getColKey(col) === key) {
        column = col;
        return false;
      }
    });
  }
  return column;
}

/**
 * 尺寸取整
 * @param size 尺寸
 */
export function floorSize(size: number) {
  const floor = Math.floor(size);
  if (size - floor < 0.001) {
    return floor;
  }
  return size;
}

/**
 * 判断单元格是否溢出
 * @param cell 单元格节点
 */
export function cellIsOverflow(cell: HTMLElement): boolean {
  const cellChild = cell.querySelector('.ele-table-cell') as HTMLElement;
  return contentIsEllipsis(cellChild, 'horizontal');
}

/**
 * 获取排序对比值
 * @param sortMethod 自定义的排序方法
 * @param a 排序数据
 * @param b 排序比较数据
 * @param prop 排序字段名
 */
export function getSortCompareValue(
  sortMethod: Column['sortMethod'],
  a: DataItem,
  b: DataItem,
  prop?: string
) {
  if (sortMethod) {
    return sortMethod(a.rowData, b.rowData);
  }
  if (!prop) {
    return a.rowIndex - b.rowIndex;
  }
  const aValue = getValue<any, DataItem>(a.rowData, prop);
  const bValue = getValue<any, DataItem>(b.rowData, prop);
  if (aValue < bValue) {
    return -1;
  }
  if (aValue > bValue) {
    return 1;
  }
  return 0;
}
