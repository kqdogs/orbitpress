import { openBlock, createElementBlock, createElementVNode } from "vue";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main = {};
const _hoisted_1 = { class: "ele-chat-bubble-loading" };
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("div", _hoisted_1, [..._cache[0] || (_cache[0] = [
    createElementVNode("i", null, null, -1),
    createElementVNode("i", null, null, -1),
    createElementVNode("i", null, null, -1)
  ])]);
}
const bubbleLoading = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  bubbleLoading as default
};
