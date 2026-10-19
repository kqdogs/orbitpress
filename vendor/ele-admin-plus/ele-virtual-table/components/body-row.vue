<!-- 主体行 -->
<template>
  <BodyCell
    v-for="(column, columnIndex) in bodyCols"
    :key="`${rowId ?? rowIndex}-${column.key ?? columnIndex}`"
    :column="column"
    :columnIndex="columnIndex"
    :rowIndex="rowIndex"
    :rowData="rowItem.rowData"
    :colSizes="colSizes"
    :bodyCellClass="bodyCellClass"
    :bodyCellStyle="bodyCellStyle"
    :spanMethod="spanMethod"
    :tableTooltipProps="tableTooltipProps"
    :pageIndex="pageIndex"
    :rowHeight="rowHeight"
    :isChecked="isChecked"
    :isDisabled="rowItem.isDisabled"
    :tableSize="tableSize"
    :expandColumnKey="expandColumnKey"
    :hasChildren="hasChildren"
    :rowIndent="rowIndent"
    :isCollapse="isCollapse"
    :loading="loading"
    :fixedCellHeight="fixedCellHeight"
    :autoRowHeight="autoRowHeight"
    @checkedChange="handleCellCheckedChange"
    @expandChange="handleCellExpandChange"
    @click="handleCellClick"
    @dblclick="handleCellDblclick"
    @contextmenu="handleCellContextmenu"
    @mouseenter="handleCellMouseenter"
    @mouseleave="handleCellMouseleave"
  >
    <template v-for="name in Object.keys($slots)" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </BodyCell>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref, computed } from 'vue';
  import type {
    DataKey,
    DataItem,
    Column,
    TableSize,
    CellClass,
    CellStyle,
    SpanMethod,
    ShowOverflowTooltip,
    TableLoad
  } from '../../ele-data-table/types';
  import type { BodyColumns, ColSize, VirtualRow } from '../types';
  import BodyCell from './body-cell.vue';

  defineOptions({ name: 'BodyRow' });

  const props = defineProps({
    /** 主体列配置 */
    bodyCols: {
      type: Array as PropType<BodyColumns>,
      required: true
    },
    /** 表格主体列宽 */
    colSizes: {
      type: Array as PropType<ColSize[]>,
      required: true
    },
    /** 当前行索引 */
    rowIndex: {
      type: Number,
      required: true
    },
    /** 当前行对象 */
    rowItem: {
      type: Object as PropType<VirtualRow>,
      required: true
    },
    /** 当前行数据唯一值 */
    rowId: [String, Number] as PropType<DataKey>,
    /** 表格多选选中的值 */
    checkedRowKeys: Set as PropType<Set<DataKey>>,
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
    /** 表格尺寸 */
    tableSize: String as PropType<TableSize>,
    /** 树表格展开图标的列 */
    expandColumnKey: String,
    /** 表格展开行的值 */
    expandedRowKeys: Array as PropType<DataKey[]>,
    /** 树表格是否懒加载子级 */
    lazy: Boolean,
    /** 树表格懒加载方法 */
    load: Function as PropType<TableLoad>,
    /** 树表格行数据缩进级别 */
    level: Number,
    /** 树表格每一级行缩进大小 */
    indent: Number,
    /** 是否需要固定单元格高度 */
    fixedCellHeight: Boolean,
    /** 表格是否是自适应行高 */
    autoRowHeight: Boolean
  });

  const emit = defineEmits({
    /** 多选框选中改变事件 */
    cellCheckedChange: (_row: VirtualRow, _checked: boolean) => true,
    /** 展开状态改变事件 */
    cellExpandChange: (
      _row: VirtualRow,
      _expanded: boolean,
      _children?: DataItem[]
    ) => true,
    /** 单元格点击事件 */
    cellClick: (_row: VirtualRow, _col: Column, _e: MouseEvent) => true,
    /** 单元格双击事件 */
    cellDblclick: (_row: VirtualRow, _col: Column, _e: MouseEvent) => true,
    /** 单元格右键事件 */
    cellContextmenu: (_row: VirtualRow, _col: Column, _e: MouseEvent) => true,
    /** 单元格鼠标移入事件 */
    cellMouseenter: (_row: VirtualRow, _col: Column, _e: MouseEvent) => true,
    /** 单元格鼠标移出事件 */
    cellMouseleave: (_row: VirtualRow, _col: Column, _e: MouseEvent) => true
  });

  /** 树表格子级加载状态 */
  const loading = ref<boolean>(false);

  /** 多选当前行是否选中 */
  const isChecked = computed<boolean>(() => {
    if (!props.checkedRowKeys || props.rowId == null) {
      return false;
    }
    return props.checkedRowKeys.has(props.rowId);
  });

  /** 树表格当前行是否有子级 */
  const hasChildren = computed<boolean>(() => {
    if (props.rowItem) {
      if (props.rowItem.children) {
        return !!props.rowItem.children.length;
      }
      if (props.lazy && props.rowItem.hasChildren) {
        return true;
      }
    }
    return false;
  });

  /** 树表格当前行缩进 */
  const rowIndent = computed<string | undefined>(() => {
    if (!props.level || !props.indent) {
      return;
    }
    return props.level * props.indent + 'px';
  });

  /** 树表格当前行是否折叠 */
  const isCollapse = computed<boolean>(() => {
    if (!props.expandedRowKeys || props.rowId == null) {
      return true;
    }
    return !props.expandedRowKeys.includes(props.rowId);
  });

  /** 多选框选中改变事件 */
  const handleCellCheckedChange = (checked: boolean) => {
    emit('cellCheckedChange', props.rowItem, checked);
  };

  /** 展开状态改变事件 */
  const handleCellExpandChange = (expanded: boolean) => {
    if (expanded && props.lazy && !props.rowItem.children) {
      if (props.load) {
        loading.value = true;
        props.load(props.rowItem.rowData, null as any, (data) => {
          loading.value = false;
          emit('cellExpandChange', props.rowItem, expanded, data);
        });
      }
      return;
    }
    emit('cellExpandChange', props.rowItem, expanded);
  };

  /** 单元格点击事件 */
  const handleCellClick = (col: Column, e: MouseEvent) => {
    emit('cellClick', props.rowItem, col, e);
  };

  /** 单元格双击事件 */
  const handleCellDblclick = (col: Column, e: MouseEvent) => {
    emit('cellDblclick', props.rowItem, col, e);
  };

  /** 单元格右键事件 */
  const handleCellContextmenu = (col: Column, e: MouseEvent) => {
    emit('cellContextmenu', props.rowItem, col, e);
  };

  /** 单元格鼠标移入事件 */
  const handleCellMouseenter = (col: Column, e: MouseEvent) => {
    emit('cellMouseenter', props.rowItem, col, e);
  };

  /** 单元格鼠标移出事件 */
  const handleCellMouseleave = (col: Column, e: MouseEvent) => {
    emit('cellMouseleave', props.rowItem, col, e);
  };
</script>
