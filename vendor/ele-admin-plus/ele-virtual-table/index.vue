<!-- 虚拟滚动表格 -->
<template>
  <div
    ref="rootRef"
    class="ele-virtual-table"
    :class="[
      { 'is-border': border || headerRows.length > 1 },
      { 'is-stripe': stripe },
      { 'is-sticky': sticky },
      { 'is-layout-fixed-head': sticky && isLayoutFixedHead },
      { 'is-layout-maximized': sticky && isLayoutMaximized },
      { 'has-footer': hasFooter },
      { 'hide-header': !showHeader },
      { 'hide-bottom-line': !bottomLine },
      { 'is-ping-left': isPingLeft },
      { 'is-ping-right': isPingRight },
      { 'is-auto-width': wrapWidth === tableWidth },
      { 'is-column-resizing': isColumnResizing },
      { 'is-small': size === 'small' },
      { 'is-large': size === 'large' }
    ]"
    @mouseleave="handleTableMouseleave"
  >
    <ElTableV2
      v-if="tableProps.width"
      v-bind="tableProps"
      :key="tableKey"
      ref="tableRef"
      @scroll="handleTableScroll"
      @endEeached="handleEndEeached"
      @rowsRendered="handleRowsRendered"
    >
      <template #header="headerProps">
        <HeaderRow
          v-if="headerProps && headerRows[headerProps.headerIndex]"
          :headerCols="headerRows[headerProps.headerIndex]"
          :headerColSizes="headerRowSizes[headerProps.headerIndex]"
          :headerIndex="headerProps.headerIndex"
          :sortBy="sortBy"
          :filtered="filtered"
          :isCheckAll="isCheckAll"
          :isIndeterminate="isIndeterminate"
          :disabledCheckbox="!tableData.length"
          :tableSize="size"
          :headerCellClass="headerCellClassName"
          :headerCellStyle="headerCellStyle"
          :headerEllipsis="true"
          :rowHeight="tableRowHeight"
          @checkedChange="toggleAllSelection()"
          @filterChange="handleTableFilterChange"
          @cellClick="handleHeaderCellClick"
          @cellContextmenu="handleHeaderCellContextmenu"
          @cellMouseenter="handleHeaderCellMouseenter"
          @cellResizeStart="handleHeaderCellResizeStart"
          @cellResize="handleHeaderCellResize"
          @cellResizeEnd="handleHeaderCellResizeEnd"
        >
          <template
            v-for="name in Object.keys($slots).filter(
              (k) => !ownSlots.includes(k)
            )"
            #[name]="slotProps"
          >
            <slot :name="name" v-bind="slotProps || {}"></slot>
          </template>
        </HeaderRow>
      </template>
      <template #row="rowProps">
        <ExpandRow
          v-if="rowProps && rowProps.rowData && rowProps.rowData.isExpandRow"
          :column="tableExpandCol?.originalCol"
          :rowIndex="rowProps.rowData.rowIndex"
          :rowData="rowProps.rowData.rowData"
          @mouseenter="handleExpandCellMouseenter"
        >
          <template
            v-for="name in Object.keys($slots).filter(
              (k) => !ownSlots.includes(k)
            )"
            #[name]="slotProps"
          >
            <slot :name="name" v-bind="slotProps || {}"></slot>
          </template>
        </ExpandRow>
        <BodyRow
          v-else-if="rowProps && rowProps.rowData && rowProps.rowData.rowData"
          :bodyCols="bodyCols"
          :colSizes="bodyColSizes"
          :rowIndex="rowProps.rowData.rowIndex"
          :rowItem="rowProps.rowData"
          :rowId="rowProps.rowData.rowId"
          :checkedRowKeys="checkedRowKeys"
          :bodyCellClass="cellClassName"
          :bodyCellStyle="cellStyle"
          :spanMethod="spanMethod"
          :tableTooltipProps="showOverflowTooltip"
          :pageIndex="pageIndex"
          :rowHeight="tableRowHeight"
          :tableSize="size"
          :expandColumnKey="tableExpandColumnKey"
          :expandedRowKeys="expandedRowKeys"
          :lazy="lazy"
          :load="load"
          :level="rowProps.depth"
          :indent="indent"
          :fixedCellHeight="hasExpandCol"
          :autoRowHeight="autoRowHeight"
          @cellCheckedChange="handleCellCheckedChange"
          @cellExpandChange="handleCellExpandChange"
          @cellClick="handleCellClick"
          @cellDblclick="handleCellDblclick"
          @cellContextmenu="handleCellContextmenu"
          @cellMouseenter="handleCellMouseenter"
          @cellMouseleave="handleCellMouseleave"
        >
          <template
            v-for="name in Object.keys($slots).filter(
              (k) => !ownSlots.includes(k)
            )"
            #[name]="slotProps"
          >
            <slot :name="name" v-bind="slotProps || {}"></slot>
          </template>
        </BodyRow>
      </template>
      <template v-if="hasFooter" #footer>
        <FooterRow
          :bodyCols="bodyCols"
          :colSizes="bodyColSizes"
          :sumWidth="colsSumWidth"
          :tableData="tableCurrentData"
          :rowHeight="tableRowHeight"
          :sumText="tableSumText"
          :summaryMethod="summaryMethod"
          @mouseenter="handleFooterCellMouseenter"
        />
      </template>
      <template #empty>
        <slot name="empty" :text="emptyText" :error="errorText">
          <div v-if="emptyProps === false" class="ele-table-empty-text">
            {{ tableEmptyText }}
          </div>
          <ElEmpty
            v-else
            :imageSize="68"
            v-bind="!emptyProps || emptyProps === true ? {} : emptyProps"
            :description="tableEmptyText"
            class="ele-table-empty"
          />
        </slot>
      </template>
    </ElTableV2>
    <div
      class="ele-table-resize-line"
      :style="{ left: columnResizeLineLeft }"
    ></div>
    <EleTooltip v-bind="tableTooltipProps" />
  </div>
</template>

<script lang="ts" setup>
  import type { Ref } from 'vue';
  import {
    ref,
    reactive,
    computed,
    watch,
    onActivated,
    onDeactivated,
    nextTick
  } from 'vue';
  import { useLocale, ElTableV2, ElEmpty } from 'element-plus';
  import type { ElTableV2Instance, ElTableV2Props } from '../ele-app/el';
  import type { EleTooltipProps } from '../ele-app/plus';
  import type {
    DataKey,
    DataItem,
    Column,
    Filter,
    OrderValue,
    Sorter
  } from '../ele-data-table/types';
  import { getValue, eachTree, findTree, queryChild } from '../utils/common';
  import { useResizeObserver } from '../utils/hook';
  import EleTooltip from '../ele-tooltip/index.vue';
  import {
    useEmits,
    useStickyHeader,
    mergeTooltipProps,
    getGlobalTooltipProps,
    isReserveChecked,
    valueIsChanged,
    arrayIsChanged,
    getRowKeys
  } from '../ele-data-table/util';
  import {
    getRowHeight,
    getColKey,
    analyseColumns,
    computeColSizes,
    colSizesIsChanged,
    getTableColumns,
    getTableHeight,
    transformTableData,
    isAutoRowHeight,
    getSortBy,
    getSortOrder,
    getOrderValue,
    getDefaultSort,
    getDefaultFiltered,
    getSelectableFunction,
    getTreeProps,
    cellIsOverflow,
    getColumnByKey,
    getRowByKey,
    getKeysAndList,
    getSortCompareValue,
    getDefaultSorter
  } from './util';
  import HeaderRow from './components/header-row.vue';
  import BodyRow from './components/body-row.vue';
  import ExpandRow from './components/expand-row.vue';
  import FooterRow from './components/footer-row.vue';
  import type {
    VirtualColumns,
    BodyColumn,
    BodyColumns,
    HeaderRows,
    HeaderColumn,
    RowClassFunction,
    RowPropsFunction,
    HeaderRowClassFunction,
    HeaderRowPropsFunction,
    CellFilterChangeParams,
    SortBy,
    TableState,
    TableV2Props,
    ScrollStrategy,
    ScrollPos,
    TreeTableProps,
    ColSize,
    VirtualRow
  } from './types';
  import { virtualTableProps, virtualTableEmits } from './props';
  /** 自己的插槽名称 */
  const ownSlots = ['default', 'empty', 'append'];

  defineOptions({ name: 'EleVirtualTable' });

  const props = defineProps(virtualTableProps);

  const emit = defineEmits(virtualTableEmits);

  const { t } = useLocale();
  const events = useEmits(emit);
  const [wrapWidth, wrapHeight, updateWrapSize] = useResizeObserver({
    getEl: () => rootRef.value
  });
  const { isLayoutFixedHead, isLayoutMaximized } = useStickyHeader();
  const tableState: TableState = {
    checked: new Map(),
    reserveChecked: false,
    scrollTop: 0,
    sorter: getDefaultSorter(props.defaultSort, props.columns)
  };

  /** 根节点 */
  const rootRef = ref<HTMLElement | null>(null);

  /** 表格组件 */
  const tableRef = ref<ElTableV2Instance>(null);

  /** 更新表格渲染 */
  const tableKey = ref<number>(0);

  /** 表头行 */
  const headerRows: Ref<HeaderRows> = ref<HeaderRows>([]);

  /** 主体区域列 */
  const bodyCols: Ref<BodyColumns> = ref<BodyColumns>([]);

  /** 表头所有行列宽 */
  const headerRowSizes: Ref<Array<ColSize[]>> = ref<Array<ColSize[]>>([]);

  /** 主体所有列宽 */
  const bodyColSizes: Ref<ColSize[]> = ref<ColSize[]>([]);

  /** 主体所有列合计宽度 */
  const colsSumWidth = ref<number>(0);

  /** 表格宽度 */
  const tableWidth = ref<number>(0);

  /** 表格高度 */
  const tableHeight = ref<number>(0);

  /** 表格数据 */
  const tableData: Ref<VirtualRow[]> = ref<VirtualRow[]>([]);

  /** 表格当前排序筛选后的数据 */
  const tableCurrentData: Ref<VirtualRow[]> = ref<VirtualRow[]>([]);

  /** 表格列配置 */
  const tableColumns: Ref<VirtualColumns> = ref<VirtualColumns>([]);

  /** 表格横向滚动位置 */
  const tableScrollLeft = ref<number>(0);

  /** 列宽拉伸线位置 */
  const columnResizeLineLeft = ref<string>('0px');

  /** 是否是列宽拉伸状态 */
  const isColumnResizing = ref<boolean>(false);

  /** 单选选中行的值 */
  const selectedRowKey = ref<DataKey | null>(props.currentRowKey ?? null);

  /** 多选选中行的值 */
  const checkedRowKeys: Ref<Set<DataKey>> = ref<Set<DataKey>>(
    new Set(props.selectedRowKeys || [])
  );

  /** 是否是全选状态 */
  const isCheckAll = ref<boolean>(false);

  /** 展开行的值 */
  const expandedRowKeys = ref<DataKey[]>([]);

  /** 排序值 */
  const sortBy: Ref<SortBy | undefined> = ref<SortBy | undefined>(
    getDefaultSort(props.defaultSort)
  );

  /** 筛选值 */
  const filtered: Filter = reactive<Filter>(getDefaultFiltered(props.columns));

  /** 提示组件属性 */
  const tableTooltipProps: EleTooltipProps = reactive<EleTooltipProps>({
    placement: 'top',
    trigger: 'click',
    offset: 0,
    hideAfter: 0,
    content: '',
    virtualRef: void 0,
    virtualTriggering: true,
    disabled: true,
    visible: false,
    teleported: false,
    transition: 'ele-transition-none'
  });

  /** 嵌套数据配置项 */
  const treeTableProps = computed<TreeTableProps>(() => {
    return getTreeProps(props.treeProps);
  });

  /** 嵌套数据子级字段名称 */
  const treeChildrenName = computed<string>(() => {
    return treeTableProps.value.childrenName;
  });

  /** 嵌套数据是否有子级字段名称 */
  const treeHasChildrenName = computed<string>(() => {
    return treeTableProps.value.hasChildrenName;
  });

  /** 是否是树形数据 */
  const isTreeData = computed<boolean>(() => {
    return tableData.value.some(
      (d) => d.children?.length || (props.lazy && d.hasChildren)
    );
  });

  /** 表格展开行的列配置 */
  const tableExpandCol = computed<BodyColumn | undefined>(() => {
    return bodyCols.value.find((d) => {
      return !!(d && d.originalCol && d.originalCol.type === 'expand');
    });
  });

  /** 表格是否有展开列 */
  const hasExpandCol = computed<boolean>(() => {
    return !!tableExpandCol.value;
  });

  /** 展开图标所在的列 */
  const tableExpandColumnKey = computed<string | undefined>(() => {
    if (tableExpandCol.value) {
      return tableExpandCol.value.key;
    }
    if (!isTreeData.value) {
      return;
    }
    const treeCol = bodyCols.value.find((d) => {
      if (!d || !d.key || !d.originalCol) {
        return false;
      }
      const colType = d.originalCol.type;
      return !colType || !['selection', 'index'].includes(colType);
    });
    return treeCol ? treeCol.key : void 0;
  });

  /** 表格行高 */
  const tableRowHeight = computed<number>(() => {
    return getRowHeight(props.size, props.rowHeight);
  });

  /** 是否自适应行高 */
  const autoRowHeight = computed<boolean>(() => {
    return isAutoRowHeight(
      hasExpandCol.value,
      bodyCols.value,
      props.showOverflowTooltip
    );
  });

  /** 表头行数 */
  const headerNums = computed<number>(() => {
    return props.showHeader ? headerRows.value.length : 0;
  });

  /** 是否显示表尾 */
  const hasFooter = computed<boolean>(() => {
    return !!(props.showSummary && tableCurrentData.value.length);
  });

  /** 表格属性 */
  const tableProps = computed<TableV2Props>(() => {
    const rowHeight = tableRowHeight.value;
    const headerHeight = new Array(headerNums.value).fill(rowHeight);
    const opt: ElTableV2Props = {
      cache: 2,
      estimatedRowHeight: autoRowHeight.value ? rowHeight : void 0,
      headerClass: ((params: Parameters<HeaderRowClassFunction>[0]) => {
        const rowClass = props.headerRowClassName;
        const classes: string[] = ['ele-table-head-tr'];
        if (typeof rowClass === 'function') {
          const custom = rowClass({ rowIndex: params.headerIndex } as any);
          if (custom) {
            classes.push(custom);
          }
        } else if (typeof rowClass === 'string' && rowClass) {
          classes.push(rowClass);
        }
        return classes.join(' ');
      }) as any,
      headerProps: (params: Parameters<HeaderRowPropsFunction>[0]) => {
        const opt: any = { rowIndex: params.headerIndex };
        const style = props.headerRowStyle;
        return { style: typeof style === 'function' ? style(opt) : style };
      },
      //headerCellProps: void 0,
      headerHeight: headerNums.value ? headerHeight : 0,
      footerHeight: hasFooter.value ? rowHeight : void 0,
      rowClass: ((params: Parameters<RowClassFunction>[0]) => {
        const classes: string[] = ['ele-table-tr'];
        const row = params.rowData as VirtualRow;
        const rowIndex = row.rowIndex;
        if (row && row.isExpandRow === true) {
          classes.push('is-expand-row'); // 展开行
        } else if (row) {
          if (props.stripe && (rowIndex + 1) % 2 === 0) {
            classes.push('is-even'); // 偶数行
          }
          if (
            props.highlightCurrentRow &&
            selectedRowKey.value != null &&
            selectedRowKey.value === row.rowId
          ) {
            classes.push('is-current'); // 单选选中状态
          }
          const rowClass = props.rowClassName;
          if (typeof rowClass === 'function') {
            const custom = rowClass({ row: row.rowData, rowIndex });
            if (custom) {
              classes.push(custom);
            }
          } else if (typeof rowClass === 'string' && rowClass) {
            classes.push(rowClass);
          }
        }
        return classes.join(' ');
      }) as any,
      rowKey: 'rowId',
      rowProps: (params: Parameters<RowPropsFunction>[0]) => {
        const row = params.rowData as VirtualRow;
        const opt = { row: row.rowData, rowIndex: row.rowIndex };
        const style = props.rowStyle;
        return { style: typeof style === 'function' ? style(opt) : style };
      },
      rowHeight: autoRowHeight.value ? void 0 : rowHeight,
      //cellProps: void 0,
      columns: tableColumns.value as any,
      data: tableCurrentData.value,
      //dataGetter: void 0,
      //fixedData: void 0,
      expandColumnKey: tableExpandColumnKey.value,
      expandedRowKeys: expandedRowKeys.value,
      defaultExpandedRowKeys: expandedRowKeys.value,
      //class: void 0,
      fixed: true,
      width: tableWidth.value,
      height: tableHeight.value,
      //maxHeight: void 0,
      hScrollbarSize: 0,
      vScrollbarSize: 0,
      scrollbarAlwaysOn: props.scrollbarAlwaysOn,
      sortBy: sortBy.value as any
      //sortState: void 0
    };
    return opt as TableV2Props;
  });

  /** 是否是半选状态 */
  const isIndeterminate = computed<boolean>(() => {
    return !!(checkedRowKeys.value.size && !isCheckAll.value);
  });

  /** 是否钉住左侧固定列 */
  const isPingLeft = computed<boolean>(() => {
    return tableScrollLeft.value > 1;
  });

  /** 是否钉住右侧固定列 */
  const isPingRight = computed<boolean>(() => {
    const scrollWidth = colsSumWidth.value - tableWidth.value - 1;
    return scrollWidth > 1 && tableScrollLeft.value < scrollWidth;
  });

  /** 合计行文本 */
  const tableSumText = computed<string>(() => {
    return props.sumText ?? t('el.table.sumText');
  });

  /** 空状态文本 */
  const tableEmptyText = computed<string>(() => {
    return props.errorText || props.emptyText || t('el.table.emptyText');
  });

  /** 关闭省略提示 */
  const hideTooltip = () => {
    tableTooltipProps.visible = false;
    tableTooltipProps.disabled = true;
  };

  /** 触发省略提示 */
  const triggerTooltip = (cell: HTMLElement, col?: Column) => {
    const cellText = cell.innerText;
    const tooltip = mergeTooltipProps(
      col ? col.showOverflowTooltip : void 0,
      getGlobalTooltipProps(
        props.showOverflowTooltip,
        props.tooltipEffect,
        props.tooltipOptions
      )
    );
    if (cellText && !!tooltip && cellIsOverflow(cell)) {
      tableTooltipProps.content = cellText;
      const excludes: string[] = [
        'virtualRef',
        'virtualTriggering',
        'disabled',
        'visible',
        'teleported'
      ];
      Object.keys(tooltip).forEach((key) => {
        const value = tooltip[key];
        if (!excludes.includes(key) && tableTooltipProps[key] !== value) {
          tableTooltipProps[key] = value;
        }
      });
      tableTooltipProps.virtualRef = cell;
      tableTooltipProps.disabled = false;
      tableTooltipProps.visible = true;
    } else {
      hideTooltip();
    }
  };

  /** 排序并筛选表格数据 */
  const sortAndFilterTableData = (sorter?: Sorter) => {
    if (sorter && tableState.sorter !== sorter) {
      tableState.sorter = sorter;
    }
    let data = [...tableData.value];
    // 排序
    if (tableState.sorter) {
      const { prop, order, column: col } = tableState.sorter;
      if (col?.sortable === true) {
        const reverse = order === 'descending' ? -1 : 1;
        data.sort((a, b) => {
          if (!order) {
            return a.rowIndex - b.rowIndex;
          }
          const v = getSortCompareValue(col.sortMethod, a, b, prop);
          return v * reverse;
        });
      }
    }
    // 筛选
    Object.keys(filtered).forEach((key) => {
      const col = getColumnByKey(props.columns, key);
      const filterMethod = col?.filterMethod;
      const values = filtered[key];
      if (!values?.length || !filterMethod) {
        return;
      }
      data = data.filter((d) => {
        const row = d.rowData;
        return values.some((value) => filterMethod(value, row, col as any));
      });
    });
    tableCurrentData.value = data;
  };

  /** 表头筛选改变事件 */
  const handleTableFilterChange = (params: CellFilterChangeParams) => {
    const key = getColKey(params.column);
    if (key) {
      filtered[key] = params.value;
      sortAndFilterTableData();
      events.onFilterChange(filtered);
    }
  };

  /** 多选选中改变事件 */
  const handleCellCheckedChange = (row: VirtualRow, checked: boolean) => {
    toggleSelected(row.rowData, row.rowId, checked);
    const selection = getSelectionRows();
    events.onSelect(selection, row.rowData);
    events.onSelectionChange(selection);
  };

  /** 展开状态改变事件 */
  const handleCellExpandChange = (
    row: VirtualRow,
    expanded: boolean,
    children?: DataItem[]
  ) => {
    if (expanded && children != null) {
      const childs = transformTableData(
        children,
        hasExpandCol.value,
        treeChildrenName.value,
        treeHasChildrenName.value,
        props.rowKey,
        getSelectableFunction(bodyCols.value)
      );
      let index = -1;
      eachTree(tableData.value, (d) => {
        index++;
        if (d.rowId === row.rowId) {
          d.children = childs;
          if (!childs.length) {
            d.hasChildren = false;
          }
        }
        d.rowIndex = index;
      });
      if (!childs.length) {
        return;
      }
    }
    toggleRowExpansion(row, expanded);
  };

  /** 单元格点击事件事件 */
  const handleCellClick = (row: VirtualRow, col: Column, e: MouseEvent) => {
    const cell = e.currentTarget as any;
    const rowData = row.rowData;
    const rowDataKey = row.rowId;
    events.onCellClick(rowData, col, cell, e);
    // 单选选中
    if (props.highlightCurrentRow) {
      setCurrentRow(rowData);
    }
    // 多选选中
    if (props.rowClickChecked && !row.isDisabled) {
      if (
        props.rowClickChecked === 'smart' &&
        (!checkedRowKeys.value.size || checkedRowKeys.value.size === 1)
      ) {
        if (rowDataKey != null && !checkedRowKeys.value.has(rowDataKey)) {
          checkedRowKeys.value = new Set([rowDataKey]);
          tableState.checked.clear();
          tableState.checked.set(rowDataKey, rowData);
          updateIsCheckAll();
          updateSelectedRowKeys([rowDataKey]);
          events.onSelectionChange([rowData]);
        }
      } else {
        toggleSelected(rowData, rowDataKey);
        events.onSelectionChange(getSelectionRows());
      }
    }
    events.onRowClick(rowData, col, e, row.isDisabled, getSelectionRows());
  };

  /** 单元格双击事件 */
  const handleCellDblclick = (row: VirtualRow, col: Column, e: MouseEvent) => {
    const cell = e.currentTarget as any;
    events.onCellDblclick(row.rowData, col, cell, e);
    events.onRowDblclick(row.rowData, col, e);
  };

  /** 单元格右键事件 */
  const handleCellContextmenu = (
    row: VirtualRow,
    col: Column,
    e: MouseEvent
  ) => {
    const cell = e.currentTarget as any;
    events.onCellContextmenu(row.rowData, col, cell, e);
    events.onRowContextmenu(row.rowData, col, e);
  };

  /** 单元格鼠标移入事件 */
  const handleCellMouseenter = (
    row: VirtualRow,
    col: Column,
    e: MouseEvent
  ) => {
    const cell = e.currentTarget as any;
    triggerTooltip(cell, col);
    events.onCellMouseEnter(row.rowData, col, cell, e);
  };

  /** 单元格鼠标移出事件 */
  const handleCellMouseleave = (
    row: VirtualRow,
    col: Column,
    e: MouseEvent
  ) => {
    const cell = e.currentTarget as any;
    events.onCellMouseLeave(row.rowData, col, cell, e);
  };

  /** 表头单元格点击事件 */
  const handleHeaderCellClick = (col: Column | undefined, e: MouseEvent) => {
    // 排序
    if (col && (col.sortable === true || col.sortable === 'custom')) {
      sortBy.value = getSortBy(sortBy.value, col);
      const prop = col.property || col.prop;
      const order = getOrderValue(
        (sortBy.value ? sortBy.value.order : void 0) as any
      );
      const sorter = { prop, order, column: col };
      sortAndFilterTableData(sorter);
      events.onSortChange(sorter);
    }
    events.onHeaderClick(col as Column, e);
  };

  /** 表头列宽开始拉伸事件 */
  const handleHeaderCellResizeStart = (
    _headerCol: HeaderColumn,
    _width: number,
    lineLeft: number
  ) => {
    isColumnResizing.value = true;
    columnResizeLineLeft.value = `${lineLeft - tableScrollLeft.value}px`;
  };

  /** 表头列宽拉伸事件 */
  const handleHeaderCellResize = (
    _headerCol: HeaderColumn,
    _width: number,
    lineLeft: number
  ) => {
    columnResizeLineLeft.value = `${lineLeft - tableScrollLeft.value}px`;
  };

  /** 表头列宽结束拉伸事件 */
  const handleHeaderCellResizeEnd = (
    headerCol: HeaderColumn,
    width: number,
    e: MouseEvent
  ) => {
    isColumnResizing.value = false;
    const col = bodyCols.value.find((col) => col.key === headerCol.key);
    if (col) {
      const oldWidth = col.width as number;
      col.width = width;
      doLayout(false, false);
      events.onHeaderDragend(width, oldWidth, col.originalCol, e);
    }
  };

  /** 表头单元格右键事件 */
  const handleHeaderCellContextmenu = (col: Column, e: MouseEvent) => {
    events.onHeaderContextmenu(col, e);
  };

  /** 表头单元格鼠标移入事件 */
  const handleHeaderCellMouseenter = () => {
    hideTooltip();
  };

  /** 表尾单元格鼠标移入事件 */
  const handleFooterCellMouseenter = (e: MouseEvent) => {
    triggerTooltip(e.currentTarget as any, { showOverflowTooltip: true });
  };

  /** 展开行单元格鼠标移入事件 */
  const handleExpandCellMouseenter = () => {
    hideTooltip();
  };

  /** 鼠标移出表格事件 */
  const handleTableMouseleave = () => {
    hideTooltip();
  };

  /** 表格滚动事件 */
  const handleTableScroll = (option: ScrollPos) => {
    tableState.scrollTop = option.scrollTop;
    const scrollLeft = option.scrollLeft;
    if (tableScrollLeft.value !== scrollLeft) {
      tableScrollLeft.value = scrollLeft;
    }
    // 同步滚动表尾
    if (hasFooter.value && tableRef.value && tableRef.value.$el) {
      const el = queryChild(tableRef.value.$el, 'el-table-v2__footer');
      if (el && el.scrollLeft != scrollLeft) {
        el.scrollLeft = scrollLeft;
      }
    }
    emit('scroll', option);
  };

  /** 表格滚动到末尾事件 */
  const handleEndEeached = (params: any) => {
    emit('endEeached', params);
  };

  /** 表格行渲染事件 */
  const handleRowsRendered = (params: any) => {
    emit('rowsRendered', params);
  };

  /** 更新表格数据 */
  const updateTableData = () => {
    // 处理表格数据
    tableData.value = transformTableData(
      props.data,
      hasExpandCol.value,
      treeChildrenName.value,
      treeHasChildrenName.value,
      props.rowKey,
      getSelectableFunction(bodyCols.value)
    );
    sortAndFilterTableData();
    // 默认展开行
    if (props.defaultExpandAll) {
      toggleRowExpansionAll(true);
    } else if (props.expandRowKeys && props.expandRowKeys.length) {
      expandedRowKeys.value = [...props.expandRowKeys];
    } else {
      toggleRowExpansionAll(false);
    }
  };

  /** 更新单选选中状态 */
  const updateSelectedState = (
    key?: DataKey | null,
    item?: DataItem | null
  ) => {
    if (!valueIsChanged(selectedRowKey.value, key)) {
      // 更新选中数据
      if (key != null && item != null && tableState.row !== item) {
        tableState.row = item;
        events.onCurrentChange(item, tableState.oldRow);
      }
      return;
    }
    // 更新选中值和数据
    if (key != null) {
      const row = getRowByKey(key, tableData.value);
      if (row != null || props.reserveCurrent) {
        tableState.oldRow = tableState.row;
        tableState.row = row?.rowData || item || void 0;
        if (tableState.row == null && props.cacheData != null) {
          tableState.row = getRowByKey(
            key,
            props.cacheData,
            props.rowKey,
            treeChildrenName.value
          );
        }
        selectedRowKey.value = key;
        updateCurrentRowKey(key);
        events.onCurrentChange(tableState.row, tableState.oldRow);
        return;
      }
    }
    // 清空选中
    if (selectedRowKey.value != null) {
      tableState.oldRow = tableState.row;
      tableState.row = void 0;
      selectedRowKey.value = null;
      updateCurrentRowKey();
      events.onCurrentChange(void 0, tableState.oldRow);
    }
  };

  /** 更新单选和多选选中 */
  const updateSelectedAndChecked = () => {
    // 更新单选选中
    const key = selectedRowKey.value;
    if (key != null) {
      const row = getRowByKey(key, tableData.value);
      if (row != null) {
        updateSelectedState(key, row.rowData);
      } else if (!props.reserveCurrent) {
        updateSelectedState(null);
      } else if (props.cacheData != null) {
        const temp = getRowByKey(
          key,
          props.cacheData,
          props.rowKey,
          treeChildrenName.value
        );
        if (temp != null) {
          updateSelectedState(key, temp);
        }
      }
    }
    // 更新多选选中
    if (checkedRowKeys.value.size) {
      const oldSelection = getSelectionRows();
      const deletedKeys: DataKey[] = [];
      const [dataKeys, list] = getKeysAndList(tableData.value);
      const [cacheKeys, cacheList] = getKeysAndList(
        props.cacheData,
        props.rowKey,
        treeChildrenName.value
      );
      checkedRowKeys.value.forEach((key) => {
        const index = dataKeys.indexOf(key);
        if (index !== -1) {
          const row = list[index].rowData;
          if (tableState.checked.get(key) !== row) {
            tableState.checked.set(key, row);
          }
        } else if (!tableState.reserveChecked) {
          deletedKeys.push(key);
        } else if (props.cacheData != null) {
          const i = cacheKeys.indexOf(key);
          const temp = i !== -1 ? cacheList[i] : void 0;
          if (i !== -1 && tableState.checked.get(key) !== temp) {
            tableState.checked.set(key, temp as DataItem);
          }
        }
      });
      // 删除不存在的数据
      deletedKeys.forEach((key) => {
        checkedRowKeys.value.delete(key);
        tableState.checked.delete(key);
      });
      updateIsCheckAll();
      if (deletedKeys.length) {
        updateSelectedRowKeys(Array.from(checkedRowKeys.value));
      }
      const selection = getSelectionRows();
      if (arrayIsChanged(oldSelection, selection)) {
        events.onSelectionChange(selection);
      }
    }
  };

  /** 更新全选状态 */
  const updateIsCheckAll = () => {
    if (!tableData.value.length || !checkedRowKeys.value.size) {
      isCheckAll.value = false;
      return;
    }
    const unchecked = findTree(
      tableData.value,
      (d) =>
        !d.isExpandRow &&
        !d.isDisabled &&
        d.rowId != null &&
        !checkedRowKeys.value.has(d.rowId)
    );
    isCheckAll.value = unchecked == null;
  };

  /** 多选时切换行选中状态 */
  const toggleSelected = (
    row: DataItem,
    rowDataKey: DataKey,
    selected?: boolean
  ) => {
    const isChecked = checkedRowKeys.value.has(rowDataKey);
    const checked = selected == null ? !isChecked : selected;
    if (checked === isChecked) {
      return;
    }
    if (checked) {
      checkedRowKeys.value.add(rowDataKey);
      tableState.checked.set(rowDataKey, row);
    } else {
      checkedRowKeys.value.delete(rowDataKey);
      tableState.checked.delete(rowDataKey);
    }
    updateIsCheckAll();
    updateSelectedRowKeys(Array.from(checkedRowKeys.value));
  };

  /** 设置选中数据 */
  const setSelectedRows = (rows?: DataItem[]): void => {
    if (!rows || !arrayIsChanged(getSelectionRows(), rows)) {
      return;
    }
    if (tableState.reserveChecked) {
      // 保留不存在的数据
      const oldSelection = getSelectionRows();
      checkedRowKeys.value.clear();
      tableState.checked.clear();
      rows.forEach((r) => {
        const k = getValue(r, props.rowKey);
        if (k != null) {
          checkedRowKeys.value.add(k);
          tableState.checked.set(k, r);
        }
      });
      updateIsCheckAll();
      updateSelectedRowKeys(Array.from(checkedRowKeys.value));
      const selection = getSelectionRows();
      if (arrayIsChanged(oldSelection, selection)) {
        events.onSelectionChange(selection);
      }
      return;
    }
    setSelectedRowKeys(getRowKeys(rows, props.rowKey));
  };

  /** 设置选中数据 */
  const setSelectedRowKeys = (keys?: DataKey[]): void => {
    if (!keys || !arrayIsChanged(Array.from(checkedRowKeys.value), keys)) {
      return;
    }
    const oldSelection = getSelectionRows();
    if (tableState.reserveChecked) {
      // 保留不存在的数据
      const [dataKeys, list] = getKeysAndList(tableData.value);
      const [cacheKeys, cacheList] = getKeysAndList(
        props.cacheData,
        props.rowKey,
        treeChildrenName.value
      );
      checkedRowKeys.value = new Set(keys);
      tableState.checked.clear();
      keys.forEach((key) => {
        const index = dataKeys.indexOf(key);
        if (index !== -1) {
          tableState.checked.set(key, list[index].rowData);
        } else if (props.cacheData != null) {
          const i = cacheKeys.indexOf(key);
          if (i !== -1) {
            tableState.checked.set(key, cacheList[i]);
          }
        }
      });
    } else {
      // 只选中存在的数据
      checkedRowKeys.value.clear();
      tableState.checked.clear();
      if (keys.length) {
        eachTree(tableData.value, (d) => {
          if (!d.isExpandRow && d.rowId != null && keys.includes(d.rowId)) {
            checkedRowKeys.value.add(d.rowId);
            tableState.checked.set(d.rowId, d.rowData);
          }
        });
      }
    }
    updateIsCheckAll();
    updateSelectedRowKeys(Array.from(checkedRowKeys.value));
    const selection = getSelectionRows();
    if (arrayIsChanged(oldSelection, selection)) {
      events.onSelectionChange(selection);
    }
  };

  /** 切换所有行展开状态 */
  const toggleRowExpansionAll = (expanded?: boolean): void => {
    if (!expanded) {
      if (expandedRowKeys.value.length) {
        expandedRowKeys.value = [];
        events.onExpandChange(void 0 as any, [] as any);
      }
      return;
    }
    const keys: DataKey[] = [];
    const rows: DataItem[] = [];
    eachTree(tableData.value, (row) => {
      if (row.children && row.children.length && row.rowId != null) {
        keys.push(row.rowId);
        rows.push(row.rowData);
      }
    });
    expandedRowKeys.value = keys;
    events.onExpandChange(void 0 as any, rows as any);
  };

  /** 多选清空选择 */
  const clearSelection = () => {
    if (checkedRowKeys.value.size) {
      const isChanged = !!tableState.checked.size;
      checkedRowKeys.value.clear();
      tableState.checked.clear();
      isCheckAll.value = false;
      updateSelectedRowKeys([]);
      if (isChanged) {
        events.onSelectionChange([]);
      }
    }
  };

  /** 获取多选选中行数据 */
  const getSelectionRows = (): DataItem[] => {
    return Array.from(tableState.checked.values());
  };

  /** 多选时切换某一行选中状态 */
  const toggleRowSelection = (row: DataItem, selected?: boolean) => {
    const key = getValue<DataKey, DataItem>(row, props.rowKey);
    if (
      key == null ||
      (!tableState.reserveChecked && !getRowByKey(key, tableData.value))
    ) {
      return;
    }
    const oldSelection = getSelectionRows();
    toggleSelected(row, key, selected);
    const selection = getSelectionRows();
    if (arrayIsChanged(oldSelection, selection)) {
      events.onSelectionChange(selection);
    }
  };

  /** 多选时切换所有行选中状态 */
  const toggleAllSelection = () => {
    if (!tableData.value.length) {
      return;
    }
    if (
      isCheckAll.value ||
      (isIndeterminate.value && !props.selectOnIndeterminate)
    ) {
      // 取消全选
      if (checkedRowKeys.value.size) {
        if (tableState.reserveChecked) {
          eachTree(tableData.value, (d) => {
            if (!d.isExpandRow && d.rowId != null) {
              checkedRowKeys.value.delete(d.rowId);
              tableState.checked.delete(d.rowId);
            }
          });
          isCheckAll.value = false;
          updateSelectedRowKeys(Array.from(checkedRowKeys.value));
          const selection = getSelectionRows();
          events.onSelectionChange(selection);
          events.onSelectAll(selection);
        } else {
          clearSelection();
          events.onSelectAll([]);
        }
      }
      return;
    }
    // 全选
    eachTree(tableData.value, (d) => {
      if (!d.isExpandRow && !d.isDisabled && d.rowId != null) {
        checkedRowKeys.value.add(d.rowId);
        tableState.checked.set(d.rowId, d.rowData);
      }
    });
    isCheckAll.value = true;
    updateSelectedRowKeys(Array.from(checkedRowKeys.value));
    const selection = getSelectionRows();
    events.onSelectionChange(selection);
    events.onSelectAll(selection);
  };

  /** 切换行展开状态 */
  const toggleRowExpansion = (row: VirtualRow, expanded?: boolean) => {
    const dataKey = row.rowId;
    const isSpread = expandedRowKeys.value.includes(dataKey);
    const spread = expanded == null ? !isSpread : expanded;
    if (spread === isSpread) {
      return;
    }
    if (spread) {
      expandedRowKeys.value.push(dataKey);
    } else {
      const index = expandedRowKeys.value.findIndex((t) => t === dataKey);
      expandedRowKeys.value.splice(index, 1);
    }
    events.onExpandChange(row.rowData, spread);
  };

  /** 单选时设置选中行 */
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

  /** 清空排序状态 */
  const clearSort = () => {
    if (sortBy.value != null) {
      //const key = sortBy.value.key as string;
      sortBy.value = void 0;
      tableState.sorter = void 0;
      sortAndFilterTableData();
      //const col = getColumnByKey(props.columns, key);
      //const prop = col ? col.property || col.prop : void 0;
      //events.onSortChange({ prop: prop ?? key, column: col });
    }
  };

  /** 清空筛选状态 */
  const clearFilter = (columnKeys?: string[]) => {
    const keys = columnKeys == null ? Object.keys(filtered) : columnKeys;
    //let num = 0;
    keys.forEach((key) => {
      const v = filtered[key];
      if (v == null || v.length) {
        filtered[key] = [];
        //num++;
      }
    });
    sortAndFilterTableData();
    /* if (num > 0) {
      events.onFilterChange(filtered);
    } */
  };

  /** 重新布局 */
  const doLayout = (force?: boolean, updateTable?: boolean) => {
    const { width, sumWidth, rowSizes, colSizes } = computeColSizes(
      bodyCols.value,
      headerRows.value,
      wrapWidth.value
    );
    if (!width) {
      return;
    }
    const isUpdate = colsSumWidth.value && colsSumWidth.value !== sumWidth;
    const isSizesChanged = colSizesIsChanged(bodyColSizes.value, colSizes);
    tableWidth.value = width;
    colsSumWidth.value = sumWidth;
    headerRowSizes.value = rowSizes;
    if (force || isSizesChanged) {
      bodyColSizes.value = colSizes;
      tableColumns.value = getTableColumns(bodyCols.value, bodyColSizes.value);
    }
    if (isUpdate && updateTable !== false) {
      tableKey.value++;
    }
  };

  /** 手动排序 */
  const sort = (prop: string, order: OrderValue) => {
    const col: any = getColumnByKey(props.columns, void 0, prop);
    sortBy.value = {
      key: getColKey(col) as any,
      order: getSortOrder(order) as any
    };
    const sorter = { prop, order, column: col };
    sortAndFilterTableData(sorter);
    events.onSortChange(sorter);
  };

  /** 修改滚动位置 */
  const scrollTo = (options: number | ScrollToOptions, yCoord?: number) => {
    if (!tableRef.value) {
      return;
    }
    const isNumber = typeof options === 'number';
    const left = isNumber ? options : options.left;
    const top = isNumber ? yCoord : options.top;
    (tableRef.value as any).scrollTo({
      scrollTop: top,
      scrollLeft: left
    });
  };

  /** 修改垂直滚动位置 */
  const setScrollTop = (top?: number) => {
    if (!tableRef.value) {
      return;
    }
    (tableRef.value as any).scrollToTop(top);
  };

  /** 修改水平滚动位置 */
  const setScrollLeft = (left?: number) => {
    if (!tableRef.value) {
      return;
    }
    (tableRef.value as any).scrollToLeft(left);
  };

  /** 滚动到指定行 */
  const scrollToRow = (row: number, strategy: ScrollStrategy) => {
    if (!tableRef.value) {
      return;
    }
    (tableRef.value as any).scrollToRow(row, strategy);
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

  /** 恢复滚动位置 */
  onActivated(() => {
    const top = tableState.scrollTop;
    const left = tableScrollLeft.value;
    if (top || left) {
      scrollTo(left ? left - 1 : 0, top ? top - 1 : 0);
    }
  });

  onDeactivated(() => {
    hideTooltip();
  });

  /** 更新表格高度 */
  watch(
    [
      () => props.height,
      () => props.maxHeight,
      tableRowHeight,
      headerNums,
      hasFooter,
      wrapHeight
    ],
    () => {
      const minRows = headerNums.value + (hasFooter.value ? 2 : 1);
      const height = getTableHeight(
        props.height,
        props.maxHeight,
        minRows * tableRowHeight.value,
        wrapHeight.value
      );
      if (height !== tableHeight.value) {
        tableHeight.value = height;
      }
    },
    { immediate: true }
  );

  /** 同步更新表格列 */
  watch(
    () => props.columns,
    (columns) => {
      tableState.reserveChecked = isReserveChecked(columns);
      // 解析列
      const { cols, rows } = analyseColumns(columns);
      bodyCols.value = cols;
      headerRows.value = rows;
      // 分配列宽
      doLayout(true);
    },
    {
      deep: true,
      immediate: true
    }
  );

  /** 更新列宽 */
  watch(wrapWidth, () => {
    doLayout();
  });

  /** 同步更新表格数据 */
  watch(
    [() => props.data, hasExpandCol, treeChildrenName],
    () => {
      updateTableData();
    },
    { immediate: true }
  );

  /** 更新数据并清空选中和展开 */
  watch(
    () => props.rowKey,
    () => {
      setCurrentRow(); // 清空单选
      clearSelection(); // 清空多选
      toggleRowExpansionAll(false); // 清空展开
      updateTableData(); // 更新数据
    }
  );

  /** 更新单选和多选选中 */
  watch([tableData, () => props.cacheData], () => {
    updateSelectedAndChecked();
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
      setSelectedRowKeys(selectedRowKeys || []);
    },
    { deep: true }
  );

  /** 同步展开行 */
  watch(
    () => props.expandRowKeys,
    (expandKeys) => {
      if (expandKeys != null) {
        expandedRowKeys.value = [...expandKeys];
      }
    },
    { deep: true }
  );

  /** 表头显示状态改变后同步表头滚动位置 */
  watch(
    () => props.showHeader,
    (showHeader) => {
      if (showHeader) {
        nextTick(() => {
          const left = tableScrollLeft.value;
          if (left) {
            setScrollLeft(left - 1);
          }
        });
      }
    }
  );

  defineExpose({
    tableRef,
    updateWrapSize,
    updateTableData,
    updateSelectedAndChecked,
    setSelectedRows,
    setSelectedRowKeys,
    toggleRowExpansionAll,
    clearSelection,
    getSelectionRows,
    toggleRowSelection,
    toggleAllSelection,
    toggleRowExpansion,
    setCurrentRow,
    setCurrentRowKey,
    getCurrentRow,
    clearSort,
    clearFilter,
    doLayout,
    sort,
    scrollTo,
    setScrollTop,
    setScrollLeft,
    scrollToRow,
    hideTooltip
  });
</script>
