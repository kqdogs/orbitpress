import { defineComponent, computed, provide, openBlock, createBlock, unref, mergeProps, createSlots, withCtx, renderSlot } from "vue";
import { useNamespace, rowContextKey, ElCol } from "element-plus";
import VueDraggable from "vuedraggable";
import { sortableRowEmits, sortableRowProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleSortableRow" },
  __name: "index",
  props: sortableRowProps,
  emits: sortableRowEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const handleUpdateModelValue = (data) => {
      emit("update:modelValue", data);
    };
    const ns = useNamespace("row");
    const gutter = computed(() => props.rowProps?.gutter ?? 0);
    const rowStyle = computed(() => {
      const styles = {};
      if (!props.rowProps?.gutter) {
        return styles;
      }
      styles.marginRight = styles.marginLeft = `-${props.rowProps.gutter / 2}px`;
      return styles;
    });
    const rowClass = computed(() => [
      ns.b(),
      ns.is(
        `justify-${props.rowProps?.justify ?? "start"}`,
        (props.rowProps?.justify ?? "start") !== "start"
      ),
      ns.is(`align-${props.rowProps?.align}`, !!props.rowProps?.align)
    ]);
    provide(rowContextKey, { gutter });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(VueDraggable), mergeProps({
        itemKey: "key",
        animation: 150,
        modelValue: _ctx.modelValue,
        setData: () => void 0,
        tag: _ctx.rowProps?.tag ?? "div",
        class: rowClass.value,
        style: rowStyle.value
      }, _ctx.draggableProps || {}, { "onUpdate:modelValue": handleUpdateModelValue }), createSlots({
        item: withCtx(({ element }) => [
          (openBlock(), createBlock(unref(ElCol), mergeProps({
            key: element.key
          }, element.colProps || {}), {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "item", { item: element })
            ]),
            _: 2
          }, 1040))
        ]),
        _: 2
      }, [
        _ctx.$slots.footer ? {
          name: "footer",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "footer")
          ]),
          key: "0"
        } : void 0
      ]), 1040, ["modelValue", "tag", "class", "style"]);
    };
  }
});
export {
  _sfc_main as default
};
