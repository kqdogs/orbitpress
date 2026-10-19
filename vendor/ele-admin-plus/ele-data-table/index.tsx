import type { Ref } from 'vue';
import {
  defineComponent,
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  h
} from 'vue';
import { ElTable, ElTableColumn, ElEmpty } from 'element-plus';
import { FilterFilled } from '../icons/index';
import type { ElTableInstance, ElTableProps } from '../ele-app/el';
import { pick, omit, getValue, eachTree } from '../utils/common';
import {
  useMethods,
  useEmits,
  useStickyHeader,
  getBodyRowClass,
  getHeadRowClass,
  toggleRowSelectionPro,
  getTableFilter,
  getStateCols,
  isDisableRow,
  isReserveChecked,
  getGlobalTooltipProps,
  getRowKeys,
  getRowByKey,
  getKeysAndList,
  valueIsChanged,
  arrayIsChanged,
  getCellClass,
  getFilterPopperClass,
  getTooltipProps
} from './util';
import type {
  DataKey,
  DataItem,
  Column,
  Columns,
  Sorter,
  Filter,
  TableState,
  ShowOverflowTooltip
} from './types';
import { dataTableProps, dataTableEmits, tablePropKeys } from './props';
const ownSlots = ['default', 'append', 'empty'];

export default defineComponent({
  name: 'EleDataTable',
  props: dataTableProps,
  emits: dataTableEmits,
  setup(props, { emit, slots, expose }) {
    const events = useEmits(emit);

    const methods = useMethods(() => tableRef.value);

    const { isLayoutFixedHead, isLayoutMaximized } = useStickyHeader();

    const tableState: TableState = {
      sorter: props.defaultSort,
      key: null,
      checkedKeys: [],
      checked: [],
      reserveChecked: isReserveChecked(props.columns)
    };

    /** 表格组件实例 */
    const tableRef = ref<ElTableInstance>(null);

    /** 表格列配置 */
    const tableCols: Ref<Columns> = ref<Columns>(props.columns ?? []);

    /** 溢出提示组件全局属性 */
    const tableOverflowTooltip = computed<ShowOverflowTooltip>(() => {
      return getGlobalTooltipProps(
        props.showOverflowTooltip,
        props.tooltipEffect,
        props.tooltipOptions
      );
    });

    /** 树表格子级数据字段名 */
    const childKey = computed<string>(() => {
      return props.treeProps?.children || 'children';
    });

    /** 表格边框类型 */
    const borderKey = computed<number>(() => {
      if (tableCols.value.some((col) => col.children?.length)) {
        return 1;
      }
      return props.border ? 1 : 0;
    });

    /** 表格属性 */
    const tableProps = computed<ElTableProps<DataItem>>(() => {
      const propKeys = tablePropKeys.filter(
        (k) =>
          ![
            'currentRowKey',
            'showOverflowTooltip',
            'tooltipOptions',
            'tooltipEffect'
          ].includes(k)
      );
      return {
        ...pick(props, propKeys),
        ...omit(events, [
          'onUpdate:currentRowKey',
          'onUpdate:selectedRowKeys',
          'onRowClick',
          'onHeaderClick',
          'onSortChange',
          'onFilterChange',
          'onCurrentChange',
          'onSelect',
          'onSelectAll',
          'onSelectionChange'
        ])
      };
    });

    /** 多选支持行点击选中 */
    const handleRowClick = (
      row: DataItem,
      column: Column,
      event: MouseEvent
    ) => {
      const disabled = isDisableRow(
        row,
        props.data.indexOf(row),
        props.columns
      );
      if (props.rowClickChecked && !disabled) {
        const selections = methods.getSelectionRows();
        if (
          props.rowClickChecked === 'smart' &&
          (!selections || !selections.length || selections.length === 1)
        ) {
          const key = getValue(row, props.rowKey);
          updateCheckedState(key == null ? [] : [key]);
        } else {
          toggleRowSelection(row);
        }
      }
      events.onRowClick(
        row,
        column,
        event,
        disabled,
        methods.getSelectionRows()
      );
    };

    /** 支持始终点击表头排序 */
    const handleHeaderClick = (column: Column, e: MouseEvent) => {
      if (column.sortable && column.filters) {
        const targetEl = e.target as Element;
        const el = e.currentTarget as Element;
        if (
          el &&
          targetEl &&
          !targetEl.classList.contains('el-table__column-filter-trigger')
        ) {
          const caretEl = el.querySelector('.caret-wrapper') as Element;
          caretEl && caretEl.dispatchEvent(new MouseEvent('click'));
        }
      }
      events.onHeaderClick(column, e);
    };

    /** 保存排序状态 */
    const handleSortChange = (sorter: Sorter) => {
      const currentSorter = tableState.sorter;
      if (
        currentSorter &&
        sorter.prop === currentSorter.prop &&
        sorter.order === currentSorter.order
      ) {
        return;
      }
      tableState.sorter = sorter;
      events.onSortChange(sorter);
    };

    /** 保存筛选状态 */
    const handleFilterChange = (filter: Filter) => {
      tableState.filter = getTableFilter(tableRef.value) ?? filter;
      events.onFilterChange(tableState.filter);
    };

    /** 单选改变事件 */
    const handleCurrentChange = (
      row?: DataItem | null,
      old?: DataItem | null
    ) => {
      if (row != null && row !== old) {
        updateSelectedState(getValue(row, props.rowKey), row);
      }
    };

    /** 多选复选框点击事件 */
    const handleSelect = (selection: DataItem[], row: DataItem) => {
      events.onSelect(selection, row);
      updateCheckedState(getRowKeys(selection, props.rowKey), selection);
    };

    /** 表头全选框点击事件 */
    const handleSelectAll = (selection: DataItem[]) => {
      updateCheckedState(getRowKeys(selection, props.rowKey), selection);
      events.onSelectAll(selection);
    };

    /** 更新滚动条 */
    const updateScrollBar = () => {
      const scrollBarRef = tableRef.value?.scrollBarRef;
      if (scrollBarRef && typeof scrollBarRef.update === 'function') {
        scrollBarRef.update();
      }
    };

    /** 清空排序条件(重写) */
    const clearSort = () => {
      methods.clearSort();
      tableState.sorter = {};
    };

    /** 清空多选选中(重写) */
    const clearSelection = () => {
      updateCheckedState([]);
    };

    /** 多选切换行选中状态(重写) */
    const toggleRowSelection = (
      row: DataItem,
      selected?: boolean,
      ignoreSelectable?: boolean
    ) => {
      methods.toggleRowSelection(row, selected, ignoreSelectable);
      const selection = methods.getSelectionRows() || [];
      updateCheckedState(getRowKeys(selection, props.rowKey), selection);
    };

    /** 设置单选选中行(重写) */
    const setCurrentRow = (row?: DataItem | null) => {
      updateSelectedState(getValue(row, props.rowKey), row);
    };

    /** 设置单选选中值 */
    const setCurrentRowKey = (key?: DataKey | null) => {
      updateSelectedState(key);
    };

    /** 获取单选选中行 */
    const getCurrentRow = () => {
      return tableState.row;
    };

    /** 设置多选选中数据 */
    const setSelectedRows = (rows?: DataItem[]): void => {
      if (rows) {
        updateCheckedState(getRowKeys(rows, props.rowKey), rows, !!rows.length);
      }
    };

    /** 设置多选选中值 */
    const setSelectedRowKeys = (keys?: DataKey[]): void => {
      if (keys) {
        updateCheckedState(keys);
      }
    };

    /** 切换所有行的展开状态 */
    const toggleRowExpansionAll = (expanded?: boolean): void => {
      eachTree(
        props.data,
        (row) => {
          if (row[childKey.value]?.length) {
            methods.toggleRowExpansion(row, expanded);
          }
        },
        childKey.value
      );
    };

    /** 更新单选选中状态 */
    const updateSelectedState = (
      key?: DataKey | null,
      item?: DataItem | null
    ) => {
      if (!valueIsChanged(tableState.key, key)) {
        // 更新选中数据
        if (key != null && item != null) {
          if (tableState.row !== item) {
            tableState.row = item;
            events.onCurrentChange(item, tableState.oldRow);
          }
          methods.setCurrentRow(item);
        }
        return;
      }
      // 更新选中值和数据
      if (key != null) {
        const row = getRowByKey(key, props.data, props.rowKey, childKey.value);
        if (row != null || props.reserveCurrent) {
          tableState.oldRow = tableState.row;
          tableState.row = row || item || void 0;
          if (tableState.row == null && props.cacheData != null) {
            tableState.row = getRowByKey(
              key,
              props.cacheData,
              props.rowKey,
              childKey.value
            );
          }
          tableState.key = key;
          methods.setCurrentRow(row);
          updateCurrentRowKey(key);
          events.onCurrentChange(tableState.row, tableState.oldRow);
          return;
        }
      }
      // 清空选中
      if (tableState.key != null) {
        tableState.oldRow = tableState.row;
        tableState.row = void 0;
        tableState.key = null;
        methods.setCurrentRow(null);
        updateCurrentRowKey();
        events.onCurrentChange(void 0, tableState.oldRow);
      }
    };

    /** 更新多选选中状态 */
    const updateCheckedState = (
      keys: DataKey[],
      items?: DataItem[],
      force?: boolean
    ) => {
      if (!force && !arrayIsChanged(tableState.checkedKeys, keys)) {
        return;
      }
      const [dataKeys, list] = getKeysAndList(
        props.data,
        props.rowKey,
        childKey.value
      );
      const [cacheKeys, cacheList] = getKeysAndList(
        props.cacheData,
        props.rowKey,
        childKey.value
      );
      const itemKeys = items ? items.map((d) => getValue(d, props.rowKey)) : [];
      const oldKeys = tableState.checked.map((d) => getValue(d, props.rowKey));
      const checkedKeys: DataKey[] = [];
      const checked: DataItem[] = [];
      keys.forEach((key) => {
        const index = dataKeys.indexOf(key);
        if (index !== -1) {
          checkedKeys.push(key);
          checked.push(list[index]);
        } else if (tableState.reserveChecked) {
          // 保留不存在的数据
          checkedKeys.push(key);
          if (items != null) {
            const tIndex = itemKeys.indexOf(key as string);
            if (tIndex !== -1 && !items[tIndex]._isMock) {
              checked.push(items[tIndex]);
              return;
            }
          }
          if (props.cacheData != null) {
            const i = cacheKeys.indexOf(key);
            if (i !== -1) {
              checked.push(cacheList[i]);
              return;
            }
          }
          const oIndex = oldKeys.indexOf(key as string);
          if (oIndex !== -1) {
            checked.push(tableState.checked[oIndex]);
            return;
          }
          if (typeof props.rowKey === 'string') {
            checked.push({ [props.rowKey]: key, _isMock: true });
          }
        }
      });
      const isChanged = arrayIsChanged(tableState.checked, checked);
      tableState.checked = checked;
      tableState.checkedKeys = checkedKeys;
      if (
        isChanged ||
        (force && arrayIsChanged(methods.getSelectionRows(), checked))
      ) {
        methods.clearSelection();
        checked.forEach((row) => {
          toggleRowSelectionPro(tableRef.value, row, true);
        });
      }
      updateSelectedRowKeys(checkedKeys);
      if (isChanged) {
        events.onSelectionChange(checked);
      }
    };

    /** 更新单选和多选选中 */
    const updateSelectedAndChecked = () => {
      // 更新单选选中
      const key = tableState.key;
      if (key != null) {
        const row = getRowByKey(key, props.data, props.rowKey, childKey.value);
        if (row != null) {
          updateSelectedState(key, row);
        } else if (!props.reserveCurrent) {
          updateSelectedState(null);
        } else if (props.cacheData != null) {
          const temp = getRowByKey(
            key,
            props.cacheData,
            props.rowKey,
            childKey.value
          );
          if (temp != null) {
            updateSelectedState(key, temp);
          }
        }
      }
      // 更新多选选中
      if (tableState.checkedKeys.length) {
        updateCheckedState(tableState.checkedKeys, void 0, true);
      }
    };

    /** 更新单选选中值 */
    const updateCurrentRowKey = (key?: DataKey) => {
      if (valueIsChanged(props.currentRowKey, key)) {
        events['onUpdate:currentRowKey'](key);
      }
    };

    /** 更新多选选中值 */
    const updateSelectedRowKeys = (keys: DataKey[]) => {
      const selected = props.selectedRowKeys || [];
      if (arrayIsChanged(selected, keys)) {
        events['onUpdate:selectedRowKeys'](keys);
      }
    };

    /** 更新列配置 */
    watch(
      () => props.columns,
      (columns) => {
        tableState.reserveChecked = isReserveChecked(columns);
        // 更新列(保持筛选状态)
        if (!columns) {
          tableCols.value = [];
        } else {
          const { cols, sorter } = getStateCols(
            columns,
            tableState.sorter,
            tableState.filter
          );
          tableCols.value = cols;
          nextTick(() => {
            methods.doLayout();
            updateScrollBar();
            // 保持排序状态
            if (sorter) {
              methods.sort(sorter.prop as string, sorter.order || 'ascending');
            }
          });
        }
      },
      { deep: true }
    );

    /** 更新选中数据 */
    watch([() => props.data, () => props.cacheData], () => {
      nextTick(() => {
        updateSelectedAndChecked();
        if (props.defaultExpandAll) {
          toggleRowExpansionAll(true);
        }
      });
    });

    /** 同步单选选中 */
    watch(
      () => props.currentRowKey,
      (key) => {
        updateSelectedState(key);
      }
    );

    /** 同步多选选中 */
    watch(
      () => props.selectedRowKeys,
      (selectedRowKeys) => {
        updateCheckedState(selectedRowKeys || []);
      },
      { deep: true }
    );

    /** 初始选中 */
    onMounted(() => {
      if (props.currentRowKey != null) {
        updateSelectedState(props.currentRowKey);
      }
      if (props.selectedRowKeys != null && props.selectedRowKeys.length) {
        updateCheckedState(props.selectedRowKeys);
      }
    });

    /** 实例方法 */
    const exposeValue = {
      ...methods,
      clearSort,
      clearSelection,
      toggleRowSelection,
      setCurrentRow,
      setCurrentRowKey,
      getCurrentRow,
      setSelectedRows,
      setSelectedRowKeys,
      toggleRowExpansionAll,
      updateSelectedAndChecked,
      tableRef
    };
    expose(exposeValue);

    /** 渲染表格列 */
    const renderTableColumn = (col: Column) => {
      return (
        <ElTableColumn
          {...omit(col, [
            'showOverflowTooltip',
            'filterClassName',
            'columnKey',
            'className',
            'uid',
            'slot',
            'headerSlot',
            'hideInTable',
            'hideInSetting',
            'hideInExport',
            'hideInPrint',
            'printSlot',
            'children'
          ])}
          key={col.uid ?? col.columnKey ?? col.prop}
          index={col.index ?? props.pageIndex}
          className={getCellClass(col)}
          columnKey={col.columnKey ?? col.prop}
          filterClassName={getFilterPopperClass(col.filterClassName)}
          showOverflowTooltip={getTooltipProps(
            col.showOverflowTooltip,
            tableOverflowTooltip.value
          )}
        >
          {{
            header: (slotProps: any) => (
              <div class="ele-cell-title" title={slotProps?.column?.label}>
                {col.headerSlot &&
                !ownSlots.includes(col.headerSlot) &&
                slots[col.headerSlot]
                  ? slots[col.headerSlot]?.(slotProps)
                  : slotProps?.column?.label}
              </div>
            ),
            ['filter-icon']: (slotProps: any) =>
              !col.filterIcon ? (
                <FilterFilled />
              ) : typeof col.filterIcon === 'string' &&
                !ownSlots.includes(col.filterIcon) &&
                slots[col.filterIcon] ? (
                slots[col.filterIcon]?.(slotProps)
              ) : (
                h(col.filterIcon)
              ),
            default:
              col.children && col.children.length
                ? () => col?.children?.map?.(renderTableColumn)
                : col.slot && !ownSlots.includes(col.slot) && slots[col.slot]
                  ? (slotProps: any) =>
                      (!props.slotNormalize || slotProps?.$index != -1) &&
                      col.slot
                        ? slots[col.slot]?.(slotProps)
                        : void 0
                  : void 0
          }}
        </ElTableColumn>
      );
    };

    return (() => (
      <ElTable
        key={borderKey.value}
        {...tableProps.value}
        ref={tableRef}
        emptyText={props.errorText || props.emptyText}
        rowClassName={(param: any) =>
          getBodyRowClass(props.rowClassName, param)
        }
        headerRowClassName={(param: any) =>
          getHeadRowClass(props.headerRowClassName, param, props.headerEllipsis)
        }
        class={[
          'ele-data-table',
          { 'is-sticky': props.sticky },
          { 'is-layout-fixed-head': props.sticky && isLayoutFixedHead.value },
          { 'is-layout-maximized': props.sticky && isLayoutMaximized.value },
          { 'is-sticky': props.sticky },
          { 'hide-header': !props.showHeader },
          { 'hide-bottom-line': !props.bottomLine }
        ]}
        onRowClick={handleRowClick}
        onHeaderClick={handleHeaderClick}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        onCurrentChange={handleCurrentChange}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
      >
        {{
          append: slots.append
            ? (slotProps: any) => slots.append?.(slotProps)
            : void 0,
          empty: slots.empty
            ? () =>
                slots.empty?.({ text: props.emptyText, error: props.errorText })
            : props.emptyProps
              ? () => (
                  <ElEmpty
                    imageSize={68}
                    {...(!props.emptyProps || props.emptyProps === true
                      ? {}
                      : props.emptyProps)}
                    description={props.errorText || props.emptyText}
                    class="ele-table-empty"
                  />
                )
              : void 0,
          default: () => tableCols.value.map(renderTableColumn)
        }}
      </ElTable>
    )) as unknown as typeof exposeValue;
  }
});
