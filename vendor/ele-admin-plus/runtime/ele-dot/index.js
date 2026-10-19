import { defineComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, normalizeStyle, toDisplayString, createCommentVNode } from "vue";
import { dotProps } from "./props";
const _hoisted_1 = {
  key: 0,
  class: "ele-dot-text"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleDot" },
  __name: "index",
  props: dotProps,
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(["ele-dot", [
          { "is-success": "success" === _ctx.type },
          { "is-warning": "warning" === _ctx.type },
          { "is-danger": "danger" === _ctx.type },
          { "is-info": "info" === _ctx.type },
          { "is-ripple": _ctx.ripple }
        ]])
      }, [
        createElementVNode("span", {
          class: "ele-dot-status",
          style: normalizeStyle({ width: _ctx.size, height: _ctx.size, background: _ctx.color })
        }, [
          createElementVNode("span", {
            class: "ele-dot-ripple",
            style: normalizeStyle({ width: _ctx.size, height: _ctx.size, background: _ctx.color })
          }, null, 4)
        ], 4),
        _ctx.text ? (openBlock(), createElementBlock("span", _hoisted_1, toDisplayString(_ctx.text), 1)) : createCommentVNode("", true)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
