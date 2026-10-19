import { defineComponent, openBlock, createElementBlock, normalizeClass } from "vue";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "FileSort" },
  __name: "file-sort",
  props: {
    /** 当前排序字段 */
    sort: String,
    /** 当前排序方式 */
    order: String,
    /** 排序字段名称 */
    name: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("i", {
        class: normalizeClass(["ele-file-list-item-sort", [
          { "is-asc": __props.name === __props.sort && "asc" === __props.order },
          { "is-desc": __props.name === __props.sort && "desc" === __props.order }
        ]])
      }, null, 2);
    };
  }
});
export {
  _sfc_main as default
};
