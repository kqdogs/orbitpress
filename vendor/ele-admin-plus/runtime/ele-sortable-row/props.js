const sortableRowProps = {
  /** 数据 */
  modelValue: Array,
  /** ElRow 属性 */
  rowProps: Object,
  /** VueDraggable 属性 */
  draggableProps: Object
};
const sortableRowEmits = {
  /** 更新拖拽排序数据 */
  "update:modelValue": (_data) => true
};
export {
  sortableRowEmits,
  sortableRowProps
};
