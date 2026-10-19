<!-- 表头行 -->
<template>
  <HeaderCell
    v-for="(column, index) in headerCols"
    :key="getKey(column, index)"
    :column="column"
    :columnIndex="index"
    :headerIndex="headerIndex"
    :colSize="headerColSizes ? headerColSizes[index] : void 0"
    :sortBy="sortBy"
    :filterValue="getFiltered(column)"
    :isCheckAll="isCheckAll"
    :isIndeterminate="isIndeterminate"
    :disabledCheckbox="disabledCheckbox"
    :tableSize="tableSize"
    :headerCellClass="headerCellClass"
    :headerCellStyle="headerCellStyle"
    :headerEllipsis="headerEllipsis"
    :rowHeight="rowHeight"
    @checkedChange="handleCellCheckedChange"
    @filterChange="handleCellFilterChange"
    @click="handleCellClick"
    @contextmenu="handleCellContextmenu"
    @mouseenter="handleCellMouseenter"
    @resizeStart="handleCellResizeStart"
    @resize="handleCellResize"
    @resizeEnd="handleCellResizeEnd"
  >
    <template v-for="name in Object.keys($slots)" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </HeaderCell>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import type {
    Column,
    Filter,
    TableSize,
    HeaderCellClass,
    HeaderCellStyle
  } from '../../ele-data-table/types';
  import type {
    VirtualColumn,
    HeaderColumns,
    HeaderColumn,
    SortBy,
    CellFilterChangeParams,
    ColSize
  } from '../types';
  import { getColFiltered } from '../util';
  import HeaderCell from './header-cell.vue';

  defineOptions({ name: 'HeaderRow' });

  const props = defineProps({
    /** 表头行配置 */
    headerCols: Array as PropType<HeaderColumns>,
    /** 表头所有行列宽 */
    headerColSizes: Array as PropType<ColSize[]>,
    /** 当前行索引 */
    headerIndex: Number,
    /** 表格排序状态 */
    sortBy: Object as PropType<SortBy>,
    /** 表格筛选值 */
    filtered: Object as PropType<Filter>,
    /** 表格是否是全选状态 */
    isCheckAll: Boolean,
    /** 表格是否是半选状态 */
    isIndeterminate: Boolean,
    /** 是否禁用表头选择框 */
    disabledCheckbox: Boolean,
    /** 表格尺寸 */
    tableSize: String as PropType<TableSize>,
    /** 表头单元格类名自定义 */
    headerCellClass: [String, Function] as PropType<HeaderCellClass>,
    /** 表头单元样式自定义 */
    headerCellStyle: [Object, Function] as PropType<HeaderCellStyle>,
    /** 表头单元格是否溢出省略 */
    headerEllipsis: Boolean,
    /** 表格行高 */
    rowHeight: Number
  });

  const emit = defineEmits({
    /** 多选框选中改变事件 */
    checkedChange: (_checked: boolean) => true,
    /** 列筛选改变事件 */
    filterChange: (_params: CellFilterChangeParams) => true,
    /** 单元格点击事件 */
    cellClick: (_col: Column, _e: MouseEvent) => true,
    /** 单元格右键事件 */
    cellContextmenu: (_col: Column, _e: MouseEvent) => true,
    /** 单元格鼠标移入事件 */
    cellMouseenter: (_col: Column, _e: MouseEvent) => true,
    /** 列宽开始拉伸事件 */
    cellResizeStart: (
      _headerCol: HeaderColumn,
      _width: number,
      _lineLeft: number,
      _e: MouseEvent | TouchEvent
    ) => true,
    /** 列宽拉伸事件 */
    cellResize: (
      _headerCol: HeaderColumn,
      _width: number,
      _lineLeft: number,
      _e: MouseEvent | TouchEvent
    ) => true,
    /** 列宽结束拉伸事件 */
    cellResizeEnd: (
      _headerCol: HeaderColumn,
      _width: number,
      _e: MouseEvent | TouchEvent
    ) => true
  });

  /** 获取列唯一值 */
  const getKey = (column: VirtualColumn, columnIndex: number) => {
    return `${props.headerIndex}-${String(column.key ?? columnIndex)}`;
  };

  /** 获取列筛选值 */
  const getFiltered = (column: VirtualColumn) => {
    return getColFiltered(column.originalCol, props.filtered);
  };

  /** 多选框选中改变事件 */
  const handleCellCheckedChange = (checked: boolean) => {
    emit('checkedChange', checked);
  };

  /** 列筛选改变事件 */
  const handleCellFilterChange = (params: CellFilterChangeParams) => {
    emit('filterChange', params);
  };

  /** 单元格点击事件 */
  const handleCellClick = (col: Column, e: MouseEvent) => {
    emit('cellClick', col, e);
  };

  /** 单元格右键事件 */
  const handleCellContextmenu = (col: Column, e: MouseEvent) => {
    emit('cellContextmenu', col, e);
  };

  /** 单元格鼠标移入事件 */
  const handleCellMouseenter = (col: Column, e: MouseEvent) => {
    emit('cellMouseenter', col, e);
  };

  /** 列宽开始拉伸事件 */
  const handleCellResizeStart = (
    headerCol: HeaderColumn,
    width: number,
    lineLeft: number,
    e: MouseEvent | TouchEvent
  ) => {
    emit('cellResizeStart', headerCol, width, lineLeft, e);
  };

  /** 列宽拉伸事件 */
  const handleCellResize = (
    headerCol: HeaderColumn,
    width: number,
    lineLeft: number,
    e: MouseEvent | TouchEvent
  ) => {
    emit('cellResize', headerCol, width, lineLeft, e);
  };

  /** 列宽结束拉伸事件 */
  const handleCellResizeEnd = (
    headerCol: HeaderColumn,
    width: number,
    e: MouseEvent | TouchEvent
  ) => {
    emit('cellResizeEnd', headerCol, width, e);
  };
</script>
