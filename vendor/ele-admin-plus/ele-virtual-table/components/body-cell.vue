<!-- 主体单元格 -->
<template>
  <div
    :class="cellClass"
    :style="cellStyle"
    @click="handleClick"
    @dblclick="handleDblclick"
    @contextmenu="handleContextmenu"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
  >
    <div class="ele-table-cell" @click="handleTextClick">
      <template v-if="isExpandCol">
        <div
          v-if="rowIndent"
          class="ele-table-indent"
          :style="{ width: rowIndent }"
        ></div>
        <div
          v-if="hasChildren"
          class="ele-table-expand"
          :class="{ 'is-collapse': isCollapse }"
          @click.stop="handleExpandChange"
        >
          <ElIcon :class="{ 'is-loading': loading }">
            <LoadingDotOutlined v-if="loading" />
            <ArrowDown v-else />
          </ElIcon>
        </div>
        <div v-else class="ele-table-placeholder"></div>
      </template>
      <CellCheckbox
        v-if="colType === 'selection'"
        :checked="isChecked"
        :disabled="isDisabled"
        :size="tableSize"
        @change="handleCheckedChange"
      />
      <CellRender v-else-if="colType !== 'expand'" v-bind="renderOpt">
        {{ cellText }}
      </CellRender>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { computed, useSlots } from 'vue';
  import { ElIcon } from 'element-plus';
  import type { StyleValues } from '../../ele-app/types';
  import { getValue } from '../../utils/common';
  import type {
    DataItem,
    Column,
    TableSize,
    CellClass,
    CellStyle,
    SpanMethod,
    ShowOverflowTooltip
  } from '../../ele-data-table/types';
  import type {
    BodyColumn,
    CustomRenderProps,
    CellSpan,
    ColSize
  } from '../types';
  import { ArrowDown, LoadingDotOutlined } from '../../icons/index';
  import CellCheckbox from './cell-checkbox.vue';
  import { CellRender, getCellSpan, getIndexValue } from '../util';

  defineOptions({ name: 'BodyCell' });

  const props = defineProps({
    /** 列配置 */
    column: {
      type: Object as PropType<BodyColumn>,
      required: true
    },
    /** 列索引 */
    columnIndex: {
      type: Number,
      required: true
    },
    /** 行索引 */
    rowIndex: {
      type: Number,
      required: true
    },
    /** 行数据 */
    rowData: {
      type: Object as PropType<DataItem>,
      required: true
    },
    /** 所有列的列宽 */
    colSizes: {
      type: Array as PropType<ColSize[]>,
      required: true
    },
    /** 单元格类名自定义 */
    bodyCellClass: [String, Function] as PropType<CellClass>,
    /** 单元格样式自定义 */
    bodyCellStyle: [Object, Function] as PropType<CellStyle>,
    /** 单元格合并行列方法 */
    spanMethod: Function as PropType<SpanMethod>,
    /** 溢出提示组件全局属性 */
    tableTooltipProps: [Boolean, Object] as PropType<ShowOverflowTooltip>,
    /** 序号列起始编号 */
    pageIndex: Number,
    /** 表格行高 */
    rowHeight: Number,
    /** 多选当前行是否选中 */
    isChecked: Boolean,
    /** 多选当前行是否禁用 */
    isDisabled: Boolean,
    /** 表格尺寸 */
    tableSize: String as PropType<TableSize>,
    /** 树表格展开图标的列 */
    expandColumnKey: String,
    /** 树表格当前行是否有子级 */
    hasChildren: Boolean,
    /** 树表格当前行缩进 */
    rowIndent: String,
    /** 树表格当前行是否折叠 */
    isCollapse: Boolean,
    /** 树表格子级加载状态 */
    loading: Boolean,
    /** 是否需要固定单元格高度 */
    fixedCellHeight: Boolean,
    /** 表格是否是自适应行高 */
    autoRowHeight: Boolean
  });

  const emit = defineEmits({
    /** 多选框选中改变事件 */
    checkedChange: (_checked: boolean) => true,
    /** 展开状态改变事件 */
    expandChange: (_expanded: boolean) => true,
    /** 点击事件 */
    click: (_col: Column, _e: MouseEvent) => true,
    /** 双击事件 */
    dblclick: (_col: Column, _e: MouseEvent) => true,
    /** 右键事件 */
    contextmenu: (_col: Column, _e: MouseEvent) => true,
    /** 鼠标移入事件 */
    mouseenter: (_col: Column, _e: MouseEvent) => true,
    /** 鼠标移出事件 */
    mouseleave: (_col: Column, _e: MouseEvent) => true
  });

  const slots = useSlots();

  /** 原始列配置 */
  const originalCol = computed<Column>(() => props.column.originalCol);

  /** 列类型 */
  const colType = computed<string>(() => originalCol.value.type ?? '');

  /** 自定义方法参数 */
  const cellParam = computed(() => {
    return {
      column: originalCol.value as any,
      columnIndex: props.columnIndex,
      rowIndex: props.rowIndex,
      row: props.rowData
    };
  });

  /** 跨行和跨列 */
  const cellSpan = computed<CellSpan>(() => {
    const span = getCellSpan(cellParam.value, props.spanMethod);
    // 特殊列
    if (['index', 'selection', 'expand'].includes(colType.value)) {
      span.rowspan = 1;
    }
    return span;
  });

  /** 是否溢出省略 */
  const isEllipsis = computed<boolean>(() => {
    if (colType.value === 'selection' || colType.value === 'expand') {
      return true;
    }
    const col = originalCol.value;
    if (col && col.showOverflowTooltip != null) {
      return col.showOverflowTooltip !== false;
    }
    return !!props.tableTooltipProps;
  });

  /** 类名 */
  const cellClass = computed<string>(() => {
    const classes: string[] = ['el-table-v2__row-cell', 'ele-table-td'];
    // 跨行跨列
    if (!cellSpan.value.colspan) {
      classes.push('is-none'); // 被跨列
    } else if (cellSpan.value.colspan > 1) {
      classes.push('is-multi-cell'); // 跨列
    }
    if (!cellSpan.value.rowspan) {
      classes.push('is-placeholder'); // 被跨行
    } else if (cellSpan.value.rowspan > 1) {
      classes.push('is-multi-row'); // 跨行
    }
    // 序号列
    if (colType.value === 'index') {
      classes.push('is-index');
    }
    // 多选列
    if (colType.value === 'selection') {
      classes.push('is-selection');
    }
    // 展开列
    if (colType.value === 'expand') {
      classes.push('is-expand');
    }
    const col = originalCol.value;
    if (col) {
      // 对齐方式
      if (col.align) {
        classes.push(`is-align-${col.align}`);
      }
      // 溢出省略
      if (isEllipsis.value) {
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
      if (typeof props.bodyCellClass === 'function') {
        const temp = props.bodyCellClass(cellParam.value);
        if (temp) {
          classes.push(temp);
        }
      } else if (props.bodyCellClass) {
        classes.push(props.bodyCellClass);
      }
      if (col.className) {
        classes.push(col.className);
      }
    }
    return classes.join(' ');
  });

  /** 列宽 */
  const cellWidth = computed<string | undefined>(() => {
    const colspan = cellSpan.value.colspan;
    if (colspan === 0) {
      return '0px';
    }
    let width = props.colSizes[props.columnIndex].width || 0;
    if (colspan && colspan > 1) {
      const end = props.columnIndex + colspan;
      for (let i = props.columnIndex + 1; i < end; i++) {
        if (props.colSizes[i] && props.colSizes[i].width != null) {
          width += props.colSizes[i].width;
        }
      }
    }
    return width + 'px';
  });

  /** 行高 */
  const cellHeight = computed<string | undefined>(() => {
    if (props.fixedCellHeight && props.rowHeight != null) {
      return props.rowHeight + 'px';
    }
    const rowspan = cellSpan.value.rowspan;
    if (props.rowHeight == null || rowspan == null || rowspan <= 1) {
      return;
    }
    return rowspan * props.rowHeight + 'px';
  });

  /** 最小行高 */
  const cellMinHeight = computed<string | undefined>(() => {
    if (!props.autoRowHeight || !props.rowHeight) {
      return;
    }
    return props.rowHeight + 'px';
  });

  /** 列尺寸 */
  const colSize = computed<ColSize | undefined>(() => {
    if (!props.colSizes || props.columnIndex == null) {
      return;
    }
    return props.colSizes[props.columnIndex];
  });

  /** 样式 */
  const cellStyle = computed<StyleValues | undefined>(() => {
    const userStyle = props.bodyCellStyle;
    const param = cellParam.value;
    return [
      {
        width: cellWidth.value,
        height: cellHeight.value,
        minHeight: cellMinHeight.value,
        left: colSize.value ? colSize.value.fixedLeft : void 0,
        right: colSize.value ? colSize.value.fixedRight : void 0
      },
      (typeof userStyle === 'function' ? userStyle(param) : userStyle) || {}
    ];
  });

  /** 显示文本 */
  const cellText = computed<string | number | undefined>(() => {
    const col = originalCol.value;
    if (col && col.type === 'index') {
      if (typeof col.index === 'function') {
        return;
      }
      return getIndexValue(props.rowIndex, col.index, props.pageIndex);
    }
    const prop = props.column ? props.column.dataKey : void 0;
    const { rowspan, colspan } = cellSpan.value;
    if (rowspan === 0 || colspan === 0 || prop == null || !props.rowData) {
      return;
    }
    return getValue<string, DataItem>(props.rowData, prop) as string;
  });

  /** 是否是展开列 */
  const isExpandCol = computed<boolean>(() => {
    return (
      props.column != null &&
      props.expandColumnKey != null &&
      props.expandColumnKey === props.column.key
    );
  });

  /** 自定义渲染组件属性 */
  const renderOpt = computed<CustomRenderProps>(() => {
    const col = originalCol.value;
    const { rowspan, colspan } = cellSpan.value;
    if (col && rowspan !== 0 && colspan !== 0) {
      const { rowIndex, rowData } = props;
      if (col.type === 'index') {
        if (typeof col.index === 'function') {
          return { render: col.index, params: [rowIndex] };
        }
        return {};
      }
      if (col.slot && typeof slots[col.slot] === 'function') {
        return {
          render: slots[col.slot],
          params: [{ row: rowData, column: col, $index: rowIndex }]
        };
      }
      if (typeof col.formatter === 'function') {
        return {
          render: col.formatter,
          params: [rowData, col, cellText.value, rowIndex]
        };
      }
    }
    return {};
  });

  /** 内容点击事件 */
  const handleTextClick = (e: MouseEvent) => {
    if (colType.value === 'selection') {
      e.stopPropagation();
    }
  };

  /** 多选框选中改变事件 */
  const handleCheckedChange = (checked: boolean) => {
    emit('checkedChange', checked);
  };

  /** 展开状态改变事件 */
  const handleExpandChange = () => {
    if (!props.loading) {
      emit('expandChange', props.isCollapse);
    }
  };

  /** 点击事件 */
  const handleClick = (e: MouseEvent) => {
    emit('click', originalCol.value, e);
  };

  /** 单元格双击事件 */
  const handleDblclick = (e: MouseEvent) => {
    emit('dblclick', originalCol.value, e);
  };

  /** 右键事件 */
  const handleContextmenu = (e: MouseEvent) => {
    emit('contextmenu', originalCol.value, e);
  };

  /** 单元格鼠标移入事件 */
  const handleMouseenter = (e: MouseEvent) => {
    emit('mouseenter', originalCol.value, e);
  };

  /** 单元格鼠标移出事件 */
  const handleMouseleave = (e: MouseEvent) => {
    emit('mouseleave', originalCol.value, e);
  };
</script>
