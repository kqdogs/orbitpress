import { defineComponent, openBlock, createElementBlock, createVNode, unref, withCtx } from "vue";
import { IconInput, IconRangeSkeleton, SvgIcon, IconPanel, IconCalendar } from "../icons/index";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-datetimerange",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", null, [
        createVNode(unref(IconInput), { size: "sm" }, {
          default: withCtx(() => [
            createVNode(unref(IconRangeSkeleton), { size: "sm" }),
            createVNode(unref(SvgIcon), {
              name: "ClockCircleOutlined",
              size: "sm",
              style: { margin: "0 0 0 8px" }
            })
          ]),
          _: 1
        }),
        createVNode(unref(IconPanel), { style: { padding: "1px 0" } }, {
          default: withCtx(() => [
            createVNode(unref(IconCalendar), { size: "sm" })
          ]),
          _: 1
        })
      ]);
    };
  }
});
export {
  _sfc_main as default
};
