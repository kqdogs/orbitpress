import { defineComponent, ref, openBlock, createBlock, unref, mergeProps, withCtx, createElementBlock, Fragment, renderList, createSlots, renderSlot } from "vue";
import { ElSteps, ElStep } from "element-plus";
import { omit } from "../utils/common";
import { useProOptions } from "../utils/hook";
import { stepsProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleSteps" },
  __name: "index",
  props: stepsProps,
  setup(__props, { expose: __expose }) {
    const props = __props;
    const { optionData, reloadOptions } = useProOptions(props, "items");
    const stepsRef = ref(null);
    __expose({
      reloadOptions,
      stepsRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ElSteps), mergeProps(unref(omit)(_ctx.$props, ["items", "type"]), {
        ref_key: "stepsRef",
        ref: stepsRef,
        class: ["ele-steps", { "is-inline": _ctx.direction === "horizontal" && _ctx.type === "inline" }]
      }), {
        default: withCtx(() => [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(optionData), (item, index) => {
            return openBlock(), createBlock(unref(ElStep), mergeProps({ key: index }, { ref_for: true }, item), createSlots({ _: 2 }, [
              renderList(Object.keys(_ctx.$slots).filter((k) => "default" !== k), (name) => {
                return {
                  name,
                  fn: withCtx(() => [
                    renderSlot(_ctx.$slots, name, {
                      index,
                      item
                    })
                  ])
                };
              })
            ]), 1040);
          }), 128))
        ]),
        _: 3
      }, 16, ["class"]);
    };
  }
});
export {
  _sfc_main as default
};
