import { defineComponent, openBlock, createBlock, unref, withCtx, createVNode } from "vue";
import { ElButton, ElIcon } from "element-plus";
import { ArrowDown } from "../../icons/index";
import ComponentName from "./component-name";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "TypeEdit" },
  __name: "type-edit",
  props: {
    formItem: {},
    componentData: {}
  },
  emits: ["openComponentPicker"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const handleClick = () => {
      if (props.formItem) {
        emit("openComponentPicker", props.formItem);
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ElButton), {
        size: "small",
        class: "ele-pro-form-builder-props-fluid-btn is-small-icon ele-pro-form-builder-type-select-btn",
        onClick: handleClick
      }, {
        default: withCtx(() => [
          createVNode(ComponentName, {
            itemType: __props.formItem?.type,
            componentData: __props.componentData
          }, null, 8, ["itemType", "componentData"]),
          createVNode(unref(ElIcon), null, {
            default: withCtx(() => [
              createVNode(unref(ArrowDown))
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
});
export {
  _sfc_main as default
};
