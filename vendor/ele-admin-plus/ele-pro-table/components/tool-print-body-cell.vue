<!-- 打印表格主体单元格 -->
<template>
  <td
    :colspan="col.colspan"
    :rowspan="col.rowspan"
    :style="cellStyle"
    :class="cellClass"
  >
    <template v-if="'expand' === col.column?.type">
      <template v-if="col.text != null && col.text !== ''">
        {{ col.text }}
      </template>
      <ElIcon
        v-else
        style="vertical-align: middle"
        class="ele-print-expand-icon"
      >
        <ArrowDown />
      </ElIcon>
    </template>
    <template v-else>
      <template v-if="col.isTreeCell">
        <span
          v-if="col.indent"
          :style="{ paddingLeft: `${col.indent * 16}px` }"
          class="ele-print-tree-indent"
        ></span>
        <ElIcon
          :style="{
            verticalAlign: 'middle',
            marginRight: '2px',
            visibility: col.isTreeLeaf ? 'hidden' : void 0
          }"
          class="ele-print-tree-icon"
        >
          <ArrowDown />
        </ElIcon>
      </template>
      <CellRender v-bind="renderOpt" />
    </template>
  </td>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { computed, useSlots } from 'vue';
  import { ElIcon } from 'element-plus';
  import { ArrowDown } from '../../icons/index';
  import type { StyleValues } from '../../ele-app/types';
  import type { CellStyle, CellClass } from '../../ele-data-table/types';
  import type { CustomRenderProps } from '../../ele-virtual-table/types';
  import { CellRender } from '../../ele-virtual-table/util';
  import type { ExportDataItem } from '../types';

  defineOptions({ name: 'ToolPrintBodyCell' });

  const props = defineProps({
    /** 列数据 */
    col: {
      type: Object as PropType<ExportDataItem>,
      required: true
    },
    /** 列索引 */
    columnIndex: Number,
    /** 单元格样式 */
    bodyCellStyle: [Object, Function] as PropType<CellStyle>,
    /** 单元格类名自定义 */
    bodyCellClass: [String, Function] as PropType<CellClass>
  });

  const slots = useSlots();

  /** 自定义渲染组件属性 */
  const renderOpt = computed<CustomRenderProps>(() => {
    const { text, row, column, index: $index } = props.col;
    const params = [{ row, column, $index }];
    const slotName = column ? column.printSlot || column.slot : void 0;
    if (
      column &&
      'expand' !== column.type &&
      slotName &&
      typeof slots[slotName] === 'function'
    ) {
      return { render: slots[slotName], params };
    }
    return { render: () => text, params };
  });

  /** 自定义方法参数 */
  const cellParam = computed<any>(() => {
    return {
      column: props.col.column,
      columnIndex: props.columnIndex,
      rowIndex: props.col.index,
      row: props.col.row
    };
  });

  /** 样式 */
  const cellStyle = computed<StyleValues | undefined>(() => {
    if (typeof props.bodyCellStyle === 'function') {
      if (cellParam.value.column == null) {
        return;
      }
      return props.bodyCellStyle(cellParam.value);
    }
    return props.bodyCellStyle;
  });

  /** 类名 */
  const cellClass = computed<string>(() => {
    const classes: string[] = [];
    const column = cellParam.value.column;
    if (column) {
      // 对齐方式
      if (column.align) {
        classes.push(`is-align-${column.align}`);
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
      if (column.className) {
        classes.push(column.className);
      }
    }
    return classes.join(' ');
  });
</script>
