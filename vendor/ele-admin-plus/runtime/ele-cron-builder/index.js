import { defineComponent, ref, watch, openBlock, createBlock, mergeProps, unref, createSlots, withCtx, renderSlot, createVNode, createTextVNode, toDisplayString, renderList, normalizeProps, guardReactiveProps } from "vue";
import { ElButton } from "element-plus";
import { useLocale } from "../ele-config-provider/receiver";
import EleModal from "../ele-modal/index";
import EleCronPanel from "../ele-cron-panel/index";
import { cronBuilderEmits, cronBuilderProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleCronBuilder" },
  __name: "index",
  props: cronBuilderProps,
  emits: cronBuilderEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { lang } = useLocale("cronBuilder", props);
    const cronPanelRef = ref(null);
    const cronModel = ref("");
    const updateModelValue = (value) => {
      emit("update:modelValue", value);
    };
    const updateCronModel = (value) => {
      if (cronModel.value !== value) {
        cronModel.value = value;
        if (props.cron !== cronModel.value) {
          emit("update:cron", cronModel.value);
        }
      }
    };
    const hideCronList = () => {
      cronPanelRef.value?.hideCronList?.();
    };
    const handleCancel = () => {
      hideCronList();
      updateModelValue(false);
    };
    const handleConfirm = () => {
      hideCronList();
      emit("done", cronModel.value);
    };
    const handleClosed = () => {
      hideCronList();
    };
    watch(
      () => props.cron,
      (value) => {
        updateCronModel(value);
      },
      { immediate: true }
    );
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleModal, mergeProps({
        width: 832,
        title: _ctx.title ?? unref(lang).title,
        position: "center",
        class: "ele-cron-builder"
      }, _ctx.modalProps || {}, {
        modelValue: _ctx.modelValue,
        "onUpdate:modelValue": updateModelValue,
        onClosed: handleClosed
      }), createSlots({
        footer: withCtx(() => [
          renderSlot(_ctx.$slots, "footer"),
          createVNode(unref(ElButton), { onClick: handleCancel }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(unref(lang).cancel), 1)
            ]),
            _: 1
          }),
          createVNode(unref(ElButton), {
            type: "primary",
            onClick: handleConfirm
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(unref(lang).confirm), 1)
            ]),
            _: 1
          })
        ]),
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default"),
          createVNode(EleCronPanel, {
            ref_key: "cronPanelRef",
            ref: cronPanelRef,
            modelValue: cronModel.value,
            "onUpdate:modelValue": updateCronModel
          }, null, 8, ["modelValue"])
        ]),
        _: 2
      }, [
        renderList(Object.keys(_ctx.$slots).filter(
          (k) => ["default", "footer"].includes(k)
        ), (name) => {
          return {
            name,
            fn: withCtx((slotProps) => [
              renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
            ])
          };
        })
      ]), 1040, ["title", "modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};
