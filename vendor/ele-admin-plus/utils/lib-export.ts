import type { PropType } from 'vue';
import type { TableProps } from 'element-plus';
import { debugWarn } from 'element-plus/es/utils/error';
import tableProps from 'element-plus/es/components/table/src/table/defaults';

/** 解决 table/defaults.mjs 导出了 default 而 table/defaults.d.ts 没有导出 default 导致类型无法识别的问题 */
export const tablePropsType = {
  /**
   * @description table data
   */
  data: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  /**
   * @description size of Table
   */
  size: {
    type: String as PropType<TableProps<Record<string, any>>['size']>
  },
  width: [String, Number],
  /**
   * @description table's height. By default it has an `auto` height. If its value is a number, the height is measured in pixels; if its value is a string, the value will be assigned to element's style.height, the height is affected by external styles
   */
  height: [String, Number],
  /**
   * @description table's max-height. The legal value is a number or the height in px
   */
  maxHeight: [String, Number],
  /**
   * @description whether width of column automatically fits its container
   */
  fit: {
    type: Boolean,
    default: true
  },
  /**
   * @description whether Table is striped
   */
  stripe: Boolean,
  /**
   * @description whether Table has vertical border
   */
  border: Boolean,
  /**
   * @description key of row data, used for optimizing rendering. Required if `reserve-selection` is on or display tree data. When its type is String, multi-level access is supported, e.g. `user.info.id`, but `user.info[0].id` is not supported, in which case `Function` should be used
   */
  rowKey: [String, Function] as PropType<TableProps<any>['rowKey']>,
  /**
   * @description whether Table header is visible
   */
  showHeader: {
    type: Boolean,
    default: true
  },
  /**
   * @description whether to display a summary row
   */
  showSummary: Boolean,
  /**
   * @description displayed text for the first column of summary row
   */
  sumText: String,
  /**
   * @description custom summary method
   */
  summaryMethod: Function as PropType<TableProps<any>['summaryMethod']>,
  /**
   * @description function that returns custom class names for a row, or a string assigning class names for every row
   */
  rowClassName: [String, Function] as PropType<TableProps<any>['rowClassName']>,
  /**
   * @description function that returns custom style for a row, or an object assigning custom style for every row
   */
  rowStyle: [Object, Function] as PropType<TableProps<any>['rowStyle']>,
  /**
   * @description function that returns custom class names for a cell, or a string assigning class names for every cell
   */
  cellClassName: [String, Function] as PropType<
    TableProps<any>['cellClassName']
  >,
  /**
   * @description function that returns custom style for a cell, or an object assigning custom style for every cell
   */
  cellStyle: [Object, Function] as PropType<TableProps<any>['cellStyle']>,
  /**
   * @description function that returns custom class names for a row in table header, or a string assigning class names for every row in table header
   */
  headerRowClassName: [String, Function] as PropType<
    TableProps<any>['headerRowClassName']
  >,
  /**
   * @description function that returns custom style for a row in table header, or an object assigning custom style for every row in table header
   */
  headerRowStyle: [Object, Function] as PropType<
    TableProps<any>['headerRowStyle']
  >,
  /**
   * @description function that returns custom class names for a cell in table header, or a string assigning class names for every cell in table header
   */
  headerCellClassName: [String, Function] as PropType<
    TableProps<any>['headerCellClassName']
  >,
  /**
   * @description function that returns custom style for a cell in table header, or an object assigning custom style for every cell in table header
   */
  headerCellStyle: [Object, Function] as PropType<
    TableProps<any>['headerCellStyle']
  >,
  /**
   * @description whether current row is highlighted
   */
  highlightCurrentRow: Boolean,
  /**
   * @description key of current row, a set only prop
   */
  currentRowKey: [String, Number],
  /**
   * @description displayed text when data is empty. You can customize this area with `#empty`
   */
  emptyText: String,
  /**
   * @description set expanded rows by this prop, prop's value is the keys of expand rows, you should set row-key before using this prop
   */
  expandRowKeys: Array as PropType<TableProps<any>['expandRowKeys']>,
  /**
   * @description whether expand all rows by default, works when the table has a column type="expand" or contains tree structure data
   */
  defaultExpandAll: Boolean,
  /**
   * @description enable expandable rows, works when the table has a column type="expand"
   */
  rowExpandable: {
    type: Function as PropType<TableProps<any>['rowExpandable']>
  },
  /**
   * @description set the default sort column and order. property `prop` is used to set default sort column, property `order` is used to set default sort order
   */
  defaultSort: Object as PropType<TableProps<any>['defaultSort']>,
  /**
   * @description the `effect` of the overflow tooltip
   */
  tooltipEffect: String,
  /**
   * @description the options for the overflow tooltip, [see the following tooltip component](tooltip.html#attributes)
   */
  tooltipOptions: Object as PropType<TableProps<any>['tooltipOptions']>,
  /**
   * @description method that returns rowspan and colspan
   */
  spanMethod: Function as PropType<TableProps<any>['spanMethod']>,
  /**
   * @description controls the behavior of master checkbox in multi-select tables when only some rows are selected (but not all). If true, all rows will be selected, else deselected
   */
  selectOnIndeterminate: {
    type: Boolean,
    default: true
  },
  /**
   * @description horizontal indentation of tree data
   */
  indent: {
    type: Number,
    default: 16
  },
  /**
   * @description configuration for rendering nested data
   */
  treeProps: {
    type: Object as PropType<TableProps<any>['treeProps']>,
    default: () => {
      return {
        hasChildren: 'hasChildren',
        children: 'children',
        checkStrictly: false
      };
    }
  },
  /**
   * @description whether to lazy loading data
   */
  lazy: Boolean,
  /**
   * @description method for loading child row data, only works when `lazy` is true
   */
  load: Function as PropType<TableProps<any>['load']>,
  style: {
    type: [String, Object, Array, Boolean] as PropType<
      TableProps<any>['style']
    >,
    default: () => ({})
  },
  className: {
    type: String,
    default: ''
  },
  /**
   * @description sets the algorithm used to lay out table cells, rows, and columns
   */
  tableLayout: {
    type: String as PropType<TableProps<Record<string, any>>['tableLayout']>,
    default: 'fixed'
  },
  /**
   * @description always show scrollbar
   */
  scrollbarAlwaysOn: Boolean,
  /**
   * @description ensure main axis minimum-size doesn't follow the content
   */
  flexible: Boolean,
  /**
   * @description whether to hide extra content and show them in a tooltip when hovering on the cell.It will affect all the table columns
   */
  showOverflowTooltip: {
    type: [Boolean, Object] as PropType<TableProps<any>['showOverflowTooltip']>,
    default: undefined
  },
  /**
   * @description function that formats cell tooltip content, works when `show-overflow-tooltip` is `true`
   */
  tooltipFormatter: Function as PropType<TableProps<any>['tooltipFormatter']>,
  appendFilterPanelTo: String,
  scrollbarTabindex: {
    type: [Number, String],
    default: undefined
  },
  /**
   * @description whether to allow drag the last column
   */
  allowDragLastColumn: {
    type: Boolean,
    default: true
  },
  /**
   * @description whether to preserve expanded row content in DOM when collapsed
   */
  preserveExpandedContent: Boolean,
  /**
   * @description whether to use native scrollbars
   */
  nativeScrollbar: Boolean
};

export const elTableProps: typeof tablePropsType = tableProps as any;

export { debugWarn };
