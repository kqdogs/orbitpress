import { defineComponent, openBlock, createBlock, unref } from "vue";
import { ElCheckbox } from "element-plus";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "CellCheckbox" },
  __name: "cell-checkbox",
  props: {
    /** 是否是选中状态 */
    checked: Boolean,
    /** 是否是半选状态 */
    indeterminate: Boolean,
    /** 是否是禁用状态 */
    disabled: Boolean,
    /** 尺寸 */
    size: String
  },
  emits: {
    /** 选中改变事件 */
    change: (_checked) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const handleUpdateModelValue = (modelValue) => {
      if (props.checked !== modelValue) {
        emit("change", modelValue);
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ElCheckbox), {
        modelValue: __props.checked,
        indeterminate: __props.indeterminate,
        disabled: __props.disabled,
        size: __props.size,
        "onUpdate:modelValue": handleUpdateModelValue
      }, null, 8, ["modelValue", "indeterminate", "disabled", "size"]);
    };
  }
});
export {
  _sfc_main as default
};
