<!-- 打印表格表头单元格 -->
<template>
  <th
    :colspan="col.colspan"
    :rowspan="col.rowspan"
    :style="cellStyle"
    :class="cellClass"
  >
    <CellRender v-bind="renderOpt" />
  </th>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { computed, useSlots } from 'vue';
  import type { StyleValues } from '../../ele-app/types';
  import type {
    HeaderCellStyle,
    HeaderCellClass
  } from '../../ele-data-table/types';
  import type { CustomRenderProps } from '../../ele-virtual-table/types';
  import { CellRender } from '../../ele-virtual-table/util';
  import type { ExportDataItem } from '../types';

  defineOptions({ name: 'ToolPrintHeaderCell' });

  const props = defineProps({
    /** 列数据 */
    col: {
      type: Object as PropType<ExportDataItem>,
      required: true
    },
    /** 列索引 */
    columnIndex: Number,
    /** 单元格样式 */
    headerCellStyle: [Object, Function] as PropType<HeaderCellStyle>,
    /** 单元格类名自定义 */
    headerCellClass: [String, Function] as PropType<HeaderCellClass>
  });

  const slots = useSlots();

  /** 自定义渲染组件属性 */
  const renderOpt = computed<CustomRenderProps>(() => {
    const { text, column } = props.col;
    const params = [{ column, $index: props.columnIndex }];
    const slotName = column
      ? column.printHeaderSlot || column.headerSlot
      : void 0;
    if (column && slotName && typeof slots[slotName] === 'function') {
      return { render: slots[slotName], params };
    }
    return { render: () => text, params };
  });

  /** 自定义方法参数 */
  const cellParam = computed<any>(() => {
    return {
      column: props.col.column,
      columnIndex: props.columnIndex,
      rowIndex: props.col.index
    };
  });

  /** 样式 */
  const cellStyle = computed<StyleValues | undefined>(() => {
    if (typeof props.headerCellStyle === 'function') {
      if (cellParam.value.column == null) {
        return;
      }
      return props.headerCellStyle(cellParam.value);
    }
    return props.headerCellStyle;
  });

  /** 类名 */
  const cellClass = computed<string>(() => {
    const classes: string[] = [];
    const column = cellParam.value.column;
    if (column) {
      // 对齐方式
      const align = column.headerAlign || column.align;
      if (align) {
        classes.push(`is-align-${align}`);
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
      if (column.labelClassName) {
        classes.push(column.labelClassName);
      }
    }
    return classes.join(' ');
  });
</script>
