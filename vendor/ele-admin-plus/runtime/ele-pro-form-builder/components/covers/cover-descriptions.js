import { defineComponent, openBlock, createElementBlock, Fragment, renderList, createElementVNode, normalizeStyle, normalizeClass } from "vue";
const _hoisted_1 = {
  class: "ele-icon-border-color-base",
  style: {
    borderTopStyle: "solid",
    borderTopWidth: "1px",
    borderLeftStyle: "solid",
    borderLeftWidth: "1px"
  }
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-descriptions",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        (openBlock(), createElementBlock(Fragment, null, renderList(3, (i) => {
          return createElementVNode("div", {
            key: i,
            style: { display: "flex" }
          }, [
            (openBlock(), createElementBlock(Fragment, null, renderList(4, (j) => {
              return createElementVNode("div", {
                key: `${i}-${j}`,
                class: normalizeClass(["ele-icon-border-color-base", {
                  "ele-icon-bg-fill": ["1-1", "1-3", "2-1", "2-3", "3-1"].includes(
                    `${i}-${j}`
                  )
                }]),
                style: normalizeStyle({
                  flex: 1,
                  height: "12px",
                  borderRightStyle: ["3-2", "3-3"].includes(`${i}-${j}`) ? void 0 : "solid",
                  borderRightWidth: ["3-2", "3-3"].includes(`${i}-${j}`) ? void 0 : "1px",
                  borderBottomStyle: "solid",
                  borderBottomWidth: "1px"
                })
              }, null, 6);
            }), 64))
          ]);
        }), 64))
      ]);
    };
  }
});
export {
  _sfc_main as default
};
