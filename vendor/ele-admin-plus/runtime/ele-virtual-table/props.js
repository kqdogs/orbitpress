import { dataTableProps, dataTableEmits } from "../ele-data-table/props";
const virtualTableProps = {
  ...dataTableProps,
  /** 行高 */
  rowHeight: Number
};
const virtualTableEmits = {
  ...dataTableEmits,
  endEeached: (_params) => true,
  scroll: (_params) => true,
  rowsRendered: (_params) => true
};
export {
  virtualTableEmits,
  virtualTableProps
};
