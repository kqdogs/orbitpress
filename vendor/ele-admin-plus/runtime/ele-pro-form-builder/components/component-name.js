import { defineComponent, computed, openBlock, createElementBlock, toDisplayString } from "vue";
import { getComponentItemByType } from "./build-core";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ComponentName" },
  __name: "component-name",
  props: {
    itemType: {},
    componentData: {}
  },
  setup(__props) {
    const props = __props;
    const typeName = computed(() => {
      const type = props.itemType;
      return getComponentItemByType(type, props.componentData)?.name ?? type;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", null, toDisplayString(typeName.value), 1);
    };
  }
});
export {
  _sfc_main as default
};
