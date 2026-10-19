<!-- 表头单元格 -->
<template>
  <div
    :class="cellClass"
    :style="cellStyle"
    @click="handleClick"
    @contextmenu="handleContextmenu"
    @mouseenter="handleMouseenter"
  >
    <template v-if="originalCol">
      <div class="ele-table-cell">
        <div
          class="ele-cell-title"
          :title="headerEllipsis ? cellTitle : void 0"
        >
          <CellCheckbox
            v-if="originalCol.type === 'selection'"
            :checked="isCheckAll"
            :indeterminate="isIndeterminate"
            :disabled="disabledCheckbox"
            :size="tableSize"
            @change="handleCheckedChange"
          />
          <CellRender v-else v-bind="renderOpt">{{ cellTitle }}</CellRender>
        </div>
        <div v-if="originalCol.sortable" class="ele-table-sorter"></div>
        <CellFilter
          v-if="originalCol.filters && originalCol.filters.length"
          :filtered="filterValue"
          :filterMultiple="originalCol.filterMultiple"
          :filters="originalCol.filters"
          :filterPlacement="originalCol.filterPlacement"
          @change="handleFilterChange"
        />
      </div>
      <div
        v-if="
          originalCol.resizable !== false &&
          !(column && column.colspan && column.colspan > 1)
        "
        class="ele-table-resize-handle"
        @click.stop=""
        @mousedown="handleMousedown"
        @touchstart.passive="handleTouchstart"
      ></div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { computed, useSlots } from 'vue';
  import type { StyleValues } from '../../ele-app/types';
  import type {
    Column,
    FilterValue,
    TableSize,
    HeaderCellClass,
    HeaderCellStyle
  } from '../../ele-data-table/types';
  import { useMoveEvent } from '../../utils/hook';
  import type {
    HeaderColumn,
    SortBy,
    CellFilterChangeParams,
    CustomRenderProps,
    ColSize
  } from '../types';
  import { CellRender, getColKey, getOrderValue, getNumberSize } from '../util';
  import CellCheckbox from './cell-checkbox.vue';
  import CellFilter from './cell-filter.vue';

  defineOptions({ name: 'HeaderCell' });

  const props = defineProps({
    /** 当前列配置 */
    column: Object as PropType<HeaderColumn>,
    /** 当前列索引 */
    columnIndex: Number,
    /** 当前行索引 */
    headerIndex: Number,
    /** 当前列宽 */
    colSize: Object as PropType<ColSize>,
    /** 表格排序状态 */
    sortBy: Object as PropType<SortBy>,
    /** 表格当前筛选值 */
    filterValue: Object as PropType<FilterValue>,
    /** 表格是否是全选状态 */
    isCheckAll: Boolean,
    /** 表格是否是半选状态 */
    isIndeterminate: Boolean,
    /** 是否禁用表头选择框 */
    disabledCheckbox: Boolean,
    /** 表格尺寸 */
    tableSize: String as PropType<TableSize>,
    /** 单元格类名自定义 */
    headerCellClass: [String, Function] as PropType<HeaderCellClass>,
    /** 单元格样式自定义 */
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
    /** 点击事件 */
    click: (_col: Column, _e: MouseEvent) => true,
    /** 右键事件 */
    contextmenu: (_col: Column, _e: MouseEvent) => true,
    /** 鼠标移入事件 */
    mouseenter: (_col: Column, _e: MouseEvent) => true,
    /** 列宽开始拉伸事件 */
    resizeStart: (
      _headerCol: HeaderColumn,
      _width: number,
      _lineLeft: number,
      _e: MouseEvent | TouchEvent
    ) => true,
    /** 列宽拉伸事件 */
    resize: (
      _headerCol: HeaderColumn,
      _width: number,
      _lineLeft: number,
      _e: MouseEvent | TouchEvent
    ) => true,
    /** 列宽结束拉伸事件 */
    resizeEnd: (
      _headerCol: HeaderColumn,
      _width: number,
      _e: MouseEvent | TouchEvent
    ) => true
  });

  const slots = useSlots();

  /** 原始列数据 */
  const originalCol = computed<Column | undefined>(() => {
    return props.column ? props.column.originalCol : void 0;
  });

  /** 自定义方法参数 */
  const cellParam = computed<any>(() => {
    return {
      column: originalCol.value,
      columnIndex: props.columnIndex,
      rowIndex: props.headerIndex
    };
  });

  /** 类名 */
  const cellClass = computed<string>(() => {
    const classes: string[] = ['el-table-v2__header-cell', 'ele-table-td'];
    if (props.column) {
      // 跨行跨列
      if (!props.column.colspan) {
        classes.push('is-none'); // 被跨列
      } else if (props.column.colspan > 1) {
        classes.push('is-multi-cell'); // 跨列
      }
      if (!props.column.rowspan) {
        classes.push('is-placeholder'); // 被跨行
      } else if (props.column.rowspan > 1) {
        classes.push('is-multi-row'); // 跨行
      }
    }
    const col = originalCol.value;
    if (col) {
      // 对齐方式
      const align = col.headerAlign || col.align;
      if (align) {
        classes.push(`is-align-${align}`);
      }
      // 可排序
      if (col.sortable === true || col.sortable === 'custom') {
        classes.push('is-sortable');
      }
      // 排序状态
      if (props.sortBy != null && getColKey(col) === props.sortBy.key) {
        const sortClass = getOrderValue(props.sortBy.order as any);
        if (sortClass) {
          classes.push(`is-${sortClass}`);
        }
      }
      // 筛选状态
      if (
        col.filters &&
        col.filters.length &&
        props.filterValue &&
        props.filterValue.length
      ) {
        classes.push('is-filtered');
      }
      // 多选列
      if (col.type === 'selection') {
        classes.push('is-selection');
      }
      // 展开列
      if (col.type === 'expand') {
        classes.push('is-expand');
      }
      // 溢出省略
      if (props.headerEllipsis) {
        classes.push('is-ellipsis');
      }
      // 固定列
      if (col.fixed === 'right') {
        classes.push('is-fixed-right');
      } else if (col.fixed === 'left' || col.fixed === true) {
        classes.push('is-fixed-left');
      }
      if (props.column) {
        if (props.column.isFixedLeftLast) {
          classes.push('is-fixed-left-last');
        }
        if (props.column.isFixedRightFirst) {
          classes.push('is-fixed-right-first');
        }
      }
      // 自定义类名
      if (typeof props.headerCellClass === 'function') {
        const temp = props.headerCellClass(cellParam.value);
        if (temp) {
          classes.push(temp);
        }
      } else if (props.headerCellClass) {
        classes.push(props.headerCellClass);
      }
      if (col.labelClassName) {
        classes.push(col.labelClassName);
      }
    }
    return classes.join(' ');
  });

  /** 行高 */
  const cellHeight = computed<string | undefined>(() => {
    if (
      props.rowHeight == null ||
      props.column == null ||
      !props.column.rowspan ||
      props.column.rowspan <= 1
    ) {
      return;
    }
    return props.column.rowspan * props.rowHeight + 'px';
  });

  /** 样式 */
  const cellStyle = computed<StyleValues | undefined>(() => {
    if (!props.colSize) {
      return;
    }
    const { width, fixedLeft, fixedRight } = props.colSize;
    const userStyle = props.headerCellStyle;
    const param = cellParam.value;
    return [
      {
        width: width + 'px',
        height: cellHeight.value,
        left: fixedLeft,
        right: fixedRight
      },
      (typeof userStyle === 'function' ? userStyle(param) : userStyle) || {}
    ];
  });

  /** 标题文本 */
  const cellTitle = computed<string | undefined>(() => {
    return originalCol.value ? originalCol.value.label : void 0;
  });

  /** 自定义渲染方法 */
  const renderOpt = computed<CustomRenderProps>(() => {
    const col = originalCol.value;
    if (col) {
      const param = { column: col, $index: props.columnIndex };
      if (col.headerSlot) {
        const headerSlot = slots[col.headerSlot];
        if (typeof headerSlot === 'function') {
          return { render: headerSlot, params: [param] };
        }
      }
      if (typeof col.renderHeader === 'function') {
        return { render: col.renderHeader, params: [param] };
      }
    }
    return {};
  });

  /** 多选框选中改变事件 */
  const handleCheckedChange = (checked: boolean) => {
    emit('checkedChange', checked);
  };

  /** 列筛选改变事件 */
  const handleFilterChange = (value: FilterValue) => {
    emit('filterChange', { column: originalCol.value as Column, value });
  };

  /** 点击事件 */
  const handleClick = (e: MouseEvent) => {
    emit('click', originalCol.value as Column, e);
  };

  /** 右键事件 */
  const handleContextmenu = (e: MouseEvent) => {
    emit('contextmenu', originalCol.value as Column, e);
  };

  /** 单元格鼠标移入事件 */
  const handleMouseenter = (e: MouseEvent) => {
    emit('mouseenter', originalCol.value as Column, e);
  };

  /** 拉伸 */
  let resizeEventData: { downW: number; width: number; left: number } | null;
  const { handleMousedown, handleTouchstart } = useMoveEvent({
    start: ({ e }) => {
      const el = (e.currentTarget as HTMLElement)?.parentElement;
      if (!el || !props.column) {
        resizeEventData = null;
        return;
      }
      const downW = el.offsetWidth;
      const lineLeft = el.offsetLeft + downW;
      resizeEventData = { downW, width: downW, left: lineLeft };
      emit('resizeStart', props.column, downW, lineLeft, e);
    },
    move: ({ distanceX, e }) => {
      if (!props.column || !resizeEventData) {
        return;
      }
      e.preventDefault();
      const width = (distanceX ?? 0) + resizeEventData.downW;
      resizeEventData.width = width;
      const minWidth = getNumberSize(props.column.originalCol?.minWidth, 30);
      if (width < minWidth) {
        resizeEventData.width = minWidth;
      }
      const lineLeft =
        resizeEventData.width + resizeEventData.left - resizeEventData.downW;
      emit('resize', props.column, resizeEventData.width, lineLeft, e);
    },
    end: ({ e }) => {
      if (!props.column || !resizeEventData) {
        return;
      }
      emit('resizeEnd', props.column, resizeEventData.width, e);
    },
    touchmoveOptions: { passive: false }
  });
</script>
