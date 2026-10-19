import { unref, computed } from 'vue';
import type { Emitter } from '../ele-app/types';
import type { ElTableInstance } from '../ele-app/el';
import { getValue, mapTree, eachTree, findTree } from '../utils/common';
import { useComponentEvents } from '../utils/hook';
import { useLayoutState } from '../ele-pro-layout/util';
import { elDataTableEmits } from './props';
import type { DataTableEmitsType } from './props';
import type {
  DataKey,
  DataItem,
  Column,
  Columns,
  Sorter,
  Filter,
  GetInstance,
  TableMethods,
  ShowOverflowTooltip,
  TooltipEffect,
  TooltipOptions,
  RowClass,
  RowKey
} from './types';
export { getValue };

/**
 * 获取行的类名
 * @param rowClass 自定义行类名
 * @param param 方法类型的参数
 */
export function getRowClass(
  rowClass: RowClass | undefined,
  param: Parameters<Exclude<RowClass, string | undefined>>[0]
): string | undefined {
  if (rowClass != null) {
    if (typeof rowClass === 'function') {
      return rowClass(param);
    } else if (typeof rowClass === 'string' && rowClass) {
      return rowClass;
    }
  }
}

/**
 * 获取行的类名
 * @param rowClass 自定义行类名
 * @param param 方法类型的参数
 */
export function getBodyRowClass(
  rowClass: RowClass | undefined,
  param: Parameters<Exclude<RowClass, string | undefined>>[0]
): string {
  const classes: string[] = ['ele-table-tr'];
  const custom = getRowClass(rowClass, param);
  if (custom != null) {
    classes.push(custom);
  }
  return classes.join(' ');
}

/**
 * 获取表头行的类名
 * @param rowClass 自定义行类名
 * @param param 方法类型的参数
 * @param ellipsis 是否单行省略
 */
export function getHeadRowClass(
  rowClass: RowClass | undefined,
  param: Parameters<Exclude<RowClass, string | undefined>>[0],
  ellipsis: boolean
): string {
  const classes: string[] = ['ele-table-head-tr'];
  if (ellipsis) {
    classes.push('is-ellipsis');
  }
  const custom = getRowClass(rowClass, param);
  if (custom != null) {
    classes.push(custom);
  }
  return classes.join(' ');
}

/**
 * 获取全局溢出提示组件属性
 * @param showOverflowTooltip 溢出提示组件属性
 * @param tooltipEffect 溢出提示组件主题
 * @param tooltipOptions 溢出提示组件配置
 */
export function getGlobalTooltipProps(
  showOverflowTooltip?: ShowOverflowTooltip,
  tooltipEffect?: TooltipEffect,
  tooltipOptions?: TooltipOptions
): ShowOverflowTooltip {
  if (!showOverflowTooltip) {
    return false;
  }
  return {
    effect: tooltipEffect,
    ...(tooltipOptions || {}),
    ...(showOverflowTooltip === true ? {} : showOverflowTooltip)
  };
}

/**
 * 合并提示组件相关属性
 * @param props 单元格提示组件属性
 * @param globalProps 表格提示组件属性
 */
export function mergeTooltipProps(
  props?: ShowOverflowTooltip,
  globalProps?: ShowOverflowTooltip
): Exclude<ShowOverflowTooltip, true> {
  if (props === false || (props == null && !globalProps)) {
    return false;
  }
  return {
    ...(!globalProps || globalProps === true ? {} : globalProps),
    ...(!props || props === true ? {} : props)
  };
}

/**
 * 获取单元格提示组件属性
 * @param props 单元格提示组件属性
 * @param globalProps 表格提示组件属性
 */
export function getTooltipProps(
  props?: ShowOverflowTooltip,
  globalProps?: ShowOverflowTooltip
): ShowOverflowTooltip {
  const opt = mergeTooltipProps(props, globalProps);
  if (!opt) {
    return false;
  }
  const classes: string[] = ['ele-popper', 'ele-tooltip', 'ele-table-tooltip'];
  if (opt.popperClass) {
    classes.push(opt.popperClass as string);
  }
  opt.popperClass = classes.join(' ');
  return opt;
}

/**
 * 切换表格指定数据的选中状态
 * @param tableRef 表格实例
 * @param row 数据
 * @param selected 选中状态
 */
export function toggleRowSelectionPro(
  tableRef: ElTableInstance | undefined,
  row: DataItem,
  selected: boolean
) {
  if (tableRef == null) {
    return;
  }
  const store = unref(tableRef)?.store;
  const selection = unref(store?.states?.selection);
  const index = selection.indexOf(row);
  const included = index !== -1;
  if (selected && !included) {
    selection.push(row);
  } else if (!selected && included) {
    selection.splice(index, 1);
  }
  store.updateAllSelected();
}

/**
 * 获取表格筛选值
 * @param tableRef 表格实例
 */
export function getTableFilter(tableRef?: ElTableInstance): Filter | undefined {
  const states = unref(tableRef)?.store?.states;
  const columns = unref(states?.columns);
  const filters = unref(states?.filters);
  if (!filters || !columns) {
    return;
  }
  const keys = Object.keys(filters);
  const filter: Filter = {};
  columns.forEach((col: any) => {
    if (keys.includes(col.id)) {
      filter[col.columnKey || col.id] = filters[col.id];
    }
  });
  return filter;
}

/**
 * 获取含表格状态的列配置
 * @param cols 表格的列
 * @param sorter 当前排序状态
 * @param filter 当前筛选状态
 */
export function getStateCols(cols: Columns, sorter?: Sorter, filter?: Filter) {
  if (!sorter && !filter) {
    return { cols };
  }
  const filterKeys: string[] = filter == null ? [] : Object.keys(filter);
  const hasSorter = sorter != null && sorter.prop != null && sorter.prop != '';
  let hasSortCol = false;
  const result: Columns = mapTree(cols, (col) => {
    if (hasSorter && col.prop === sorter.prop) {
      hasSortCol = true;
    }
    const filterProp = col.columnKey ?? col.prop;
    const flag = filterProp ? filterKeys.includes(filterProp) : false;
    const filtered = flag && filter ? filter[filterProp as string] : void 0;
    return { ...col, filteredValue: filtered ?? col.filteredValue };
  });
  return { cols: result, sorter: hasSorter && hasSortCol ? sorter : void 0 };
}

/**
 * 获取判断多选是否可选择的方法
 * @param columns 列配置
 */
export function getSelectableFunction(columns?: Columns) {
  const col = findTree(columns, (c) => c.type === 'selection');
  if (col != null) {
    return typeof col.selectable === 'function' ? col.selectable : null;
  }
}

/**
 * 判断行是否禁止多选
 * @param row 行数据
 * @param index 行索引
 * @param columns 列配置
 */
export function isDisableRow(row: DataItem, index: number, columns?: Columns) {
  const selectable = getSelectableFunction(columns);
  if (typeof selectable === 'undefined') {
    return true;
  }
  return !(selectable == null || selectable(row, index) === true);
}

/**
 * 判断是否保存不存在的选中数据
 * @param columns 列配置
 */
export function isReserveChecked(columns?: Columns) {
  let isReserve = false;
  eachTree(columns, (col) => {
    if (col.type === 'selection') {
      isReserve = !!col.reserveSelection;
      return false;
    }
  });
  return isReserve;
}

/**
 * 用于根据列的固定值排序
 * @param fixed 固定值
 */
export function getColFixedNumber(fixed?: boolean | string) {
  if (fixed === true || fixed === 'left') {
    return 0;
  }
  if (fixed === 'right') {
    return 2;
  }
  return 1;
}

/**
 * 获取列类名
 * @param col 列属性
 */
export function getCellClass(col: Column): string | undefined {
  const classes: string[] = [];
  if (col.type === 'index') {
    classes.push('is-index');
  }
  if (col.className) {
    classes.push(col.className);
  }
  return classes.length ? classes.join(' ') : void 0;
}

/**
 * 获取列筛选下拉框类名
 * @param filterClassName 自定义类名
 */
export function getFilterPopperClass(filterClassName?: string) {
  const classes: string[] = ['ele-table-filter-popper'];
  if (filterClassName) {
    classes.push(filterClassName);
  }
  return classes.join(' ');
}

/**
 * 获取数据值
 * @param rows 数据
 * @param rowKey 值键名
 */
export function getRowKeys(
  rows: DataItem[] | undefined,
  rowKey: RowKey
): DataKey[] {
  const keys: DataKey[] = [];
  if (rows) {
    rows.forEach((row) => {
      const key = getValue(row, rowKey);
      if (key != null) {
        keys.push(key);
      }
    });
  }
  return keys;
}

/**
 * 获取值对应的数据
 * @param key 值
 * @param data 全部数据
 * @param rowKey 值键名
 * @param childrenField 子级数据键名
 */
export function getRowByKey(
  key: DataKey,
  data?: DataItem[],
  rowKey?: RowKey,
  childrenField?: string
) {
  return findTree(data, (d) => getValue(d, rowKey) === key, childrenField);
}

/**
 * 获取平铺后的数据值和数据
 * @param data 表格数据
 * @param rowKey 数据值字段名
 * @param childrenField 子级字段名
 */
export function getKeysAndList(
  data?: DataItem[],
  rowKey?: RowKey,
  childrenField?: string
): [DataKey[], DataItem[]] {
  const keys: DataKey[] = [];
  const list: DataItem[] = [];
  eachTree(
    data,
    (d) => {
      keys.push(getValue(d, rowKey) as DataKey);
      list.push(d);
    },
    childrenField
  );
  return [keys, list];
}

/**
 * 判断值是否改变
 * @param value1 值
 * @param value2 新值
 */
export function valueIsChanged<T>(value1?: T | null, value2?: T | null) {
  return !((value1 == null && value2 == null) || value1 === value2);
}

/**
 * 判断数组数据是否改变
 * @param list1 数组
 * @param list2 新数组
 */
export function arrayIsChanged<T>(list1?: T[] | null, list2?: T[] | null) {
  const isEmpty1 = list1 == null || !list1.length;
  const isEmpty2 = list2 == null || !list2.length;
  if (isEmpty1 && isEmpty2) {
    return false;
  }
  if (isEmpty1 !== isEmpty2) {
    return true;
  }
  if ((list1 as T[]).length !== (list2 as T[]).length) {
    return true;
  }
  return (list1 as T[]).some((k) => !(list2 as T[]).includes(k));
}

/**
 * 使用粘性表头
 */
export function useStickyHeader() {
  const layoutState = useLayoutState();

  /** 布局是否是固定表头 */
  const isLayoutFixedHead = computed(() => layoutState.fixedHeader);

  /** 布局是否是内容全屏 */
  const isLayoutMaximized = computed(
    () => layoutState.maximized && layoutState.maximized !== 'expanded'
  );

  return { isLayoutFixedHead, isLayoutMaximized };
}

/**
 * 表格实例方法统一处理
 * @param getInstance 获取表格实例方法
 */
export function useMethods(getInstance: GetInstance): TableMethods {
  /** 新增的实例方法 */
  const methods: TableMethods = {
    setCurrentRowKey: (key?: DataKey | null) => {
      const ins = getInstance() as any;
      ins && ins.setCurrentRowKey(key);
    },
    getCurrentRow: () => {
      const ins = getInstance() as any;
      if (ins) {
        return ins.getCurrentRow();
      }
    },
    setSelectedRows: (rows?: DataItem[]): void => {
      const ins = getInstance() as any;
      ins && ins.setSelectedRows(rows);
    },
    setSelectedRowKeys: (keys?: DataKey[], rows?: DataItem[]): void => {
      const ins = getInstance() as any;
      ins && ins.setSelectedRowKeys(keys, rows);
    },
    toggleRowExpansionAll: (expanded?: boolean): void => {
      const ins = getInstance() as any;
      ins && ins.toggleRowExpansionAll(expanded);
    },
    updateSelectedAndChecked: (): void => {
      const ins = getInstance() as any;
      ins && ins.updateSelectedAndChecked();
    }
  } as any;
  /** 表格原来的的实例方法 */
  [
    'clearSelection',
    'getSelectionRows',
    'toggleRowSelection',
    'toggleAllSelection',
    'toggleRowExpansion',
    'setCurrentRow',
    'clearSort',
    'clearFilter',
    'doLayout',
    'sort',
    'scrollTo',
    'setScrollTop',
    'setScrollLeft',
    'updateKeyChildren'
  ].forEach((key) => {
    methods[key] = (...params: any) => {
      const ins = getInstance();
      if (!ins) {
        throw new Error('Table instance is null');
      }
      return ins[key](...params);
    };
  });
  return methods;
}

/**
 * 表格事件统一处理
 * @param emit 事件触发器
 */
export function useEmits(emit: Emitter<DataTableEmitsType>) {
  const { emitProps } = useComponentEvents(elDataTableEmits, emit);
  return {
    ...emitProps,
    /** 新增的事件 */
    'onUpdate:currentRowKey': (currentRowKey?: DataKey) => {
      emit('update:currentRowKey', currentRowKey);
    },
    'onUpdate:selectedRowKeys': (selectedRowKeys: DataKey[]) => {
      emit('update:selectedRowKeys', selectedRowKeys);
    }
  };
}
