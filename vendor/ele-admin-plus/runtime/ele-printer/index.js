import { defineComponent, shallowRef, ref, computed, watch, onMounted, openBlock, createBlock, Teleport, createElementVNode, mergeProps, createElementBlock, normalizeStyle, renderSlot, createCommentVNode, nextTick } from "vue";
import { usePrinter, getPrintContainer, mergeOptions } from "./util";
import { printerEmits, printerProps } from "./props";
const _hoisted_1 = { key: 0 };
const _hoisted_2 = { key: 1 };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ElePrinter", inheritAttrs: false },
  __name: "index",
  props: printerProps,
  emits: printerEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const doPrint = usePrinter(() => {
      visible.value = false;
      updateModelValue(false);
      handleDone();
    });
    const container = shallowRef(getPrintContainer());
    const visible = ref(false);
    const isStatic = computed(() => props.static);
    const print = (options) => {
      if (visible.value) {
        return;
      }
      visible.value = true;
      nextTick(() => {
        const option = {
          title: props.title,
          margin: props.margin,
          direction: props.direction,
          orientation: props.orientation,
          options: mergeOptions(props.options, options)
        };
        doPrint(option, props.target);
      });
    };
    const handleDone = () => {
      emit("done");
    };
    const updateModelValue = (value) => {
      emit("update:modelValue", value);
    };
    watch(
      () => props.modelValue,
      (modelValue) => {
        if (modelValue) {
          print();
        }
      }
    );
    onMounted(() => {
      if (props.modelValue) {
        print();
      }
    });
    __expose({
      print
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Teleport, {
        to: container.value,
        disabled: isStatic.value && !visible.value
      }, [
        createElementVNode("table", mergeProps(_ctx.$attrs, {
          class: ["ele-printer", [{ "is-open": visible.value }, { "is-static": isStatic.value }]]
        }), [
          _ctx.$slots.header ? (openBlock(), createElementBlock("thead", _hoisted_1, [
            createElementVNode("tr", null, [
              createElementVNode("td", null, [
                createElementVNode("div", {
                  class: "ele-printer-header",
                  style: normalizeStyle(_ctx.headerStyle)
                }, [
                  renderSlot(_ctx.$slots, "header")
                ], 4)
              ])
            ])
          ])) : createCommentVNode("", true),
          createElementVNode("tbody", null, [
            createElementVNode("tr", null, [
              createElementVNode("td", null, [
                createElementVNode("div", {
                  class: "ele-printer-body",
                  style: normalizeStyle(_ctx.bodyStyle)
                }, [
                  renderSlot(_ctx.$slots, "default")
                ], 4)
              ])
            ])
          ]),
          _ctx.$slots.footer ? (openBlock(), createElementBlock("tfoot", _hoisted_2, [
            createElementVNode("tr", null, [
              createElementVNode("td", null, [
                createElementVNode("div", {
                  class: "ele-printer-footer",
                  style: normalizeStyle(_ctx.footerStyle)
                }, [
                  renderSlot(_ctx.$slots, "footer")
                ], 4)
              ])
            ])
          ])) : createCommentVNode("", true)
        ], 16)
      ], 8, ["to", "disabled"]);
    };
  }
});
export {
  _sfc_main as default
};
