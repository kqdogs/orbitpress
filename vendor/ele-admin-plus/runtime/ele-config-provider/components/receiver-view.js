import { defineComponent as u, ref as l, computed as h, watch as w, createVNode as x } from "vue";
import { svgText as e, getProps as P, svgContents as a, svgProp as n, getOption as C } from "../../ele-watermark/util";
const k = /* @__PURE__ */ u({
  name: "ReceiverView",
  props: {
    wrapHeight: [String, Number]
  },
  setup(g, {
    slots: d
  }) {
    const o = l(), r = e[e.length - 2], {
      svgKey: i,
      svgProps: s,
      svgConfig: p,
      imageId: m
    } = P(a), v = h(() => p.key), c = n[e.findIndex((t) => t === e[e.length - 1])];
    return w(v, (t) => {
      o.value = C(t, c, s, 2, 13, r, i, a, n, n[e.findIndex((f) => f === r)]);
    }, {
      immediate: !0
    }), () => x("div", {
      style: g.wrapHeight == null ? void 0 : { height: typeof g.wrapHeight === "number" ? `${g.wrapHeight}px` : g.wrapHeight }
    }, d.default?.(s));
  }
});
export {
  k as default
};
