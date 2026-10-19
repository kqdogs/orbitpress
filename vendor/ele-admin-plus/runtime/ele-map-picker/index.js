import { defineComponent, ref, computed, nextTick, openBlock, createBlock, mergeProps, unref, createSlots, withCtx, createCommentVNode, renderList, renderSlot, normalizeProps, guardReactiveProps } from "vue";
import { debounce, pick } from "../utils/common";
import { useLocale } from "../ele-config-provider/receiver";
import { useResponsive } from "../ele-pro-layout/util";
import EleModal from "../ele-modal/index";
import MapView from "./components/map-view";
import { AMapPlugin } from "./amap-plugin";
import { mapPickerEmits, mapPickerProps, mapPropKeys } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleMapPicker" },
  __name: "index",
  props: mapPickerProps,
  emits: mapPickerEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { lang, globalConfig } = useLocale("map", props);
    const isResponsive = useResponsive(props);
    const isOpened = ref(false);
    const mapRef = ref(null);
    const mapPluginImpl = computed(() => {
      return props.mapPlugin || globalConfig.mapPlugin || AMapPlugin;
    });
    const aMapKey = computed(() => {
      return props.mapKey || globalConfig.mapKey;
    });
    const updateModelValue = (visible) => {
      emit("update:modelValue", visible);
    };
    const handleMapDone = (ins) => {
      emit("mapDone", ins);
    };
    const handleDone = (result) => {
      emit("done", result);
    };
    const handleOpened = () => {
      isOpened.value = true;
      if (mapRef.value) {
        mapRef.value.checkResize();
        mapRef.value.showInitSelected();
      }
    };
    const handleClosed = () => {
      if (props.modalProps?.destroyOnClose) {
        isOpened.value = false;
      }
    };
    const handleResized = debounce(() => {
      nextTick(() => {
        mapRef.value && mapRef.value.checkResize();
      });
    }, 350);
    const handleFullscreenChange = () => {
      nextTick(() => {
        mapRef.value && mapRef.value.checkResize();
      });
    };
    __expose({
      mapRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleModal, mergeProps({
        width: "740px",
        title: unref(lang).title
      }, _ctx.modalProps || {}, {
        modelValue: _ctx.modelValue,
        class: ["ele-map-picker", { "is-responsive": unref(isResponsive) }],
        "onUpdate:modelValue": updateModelValue,
        onOpened: handleOpened,
        onClosed: handleClosed,
        onResized: unref(handleResized),
        "onUpdate:fullscreen": handleFullscreenChange
      }), createSlots({
        default: withCtx(() => [
          isOpened.value ? (openBlock(), createBlock(MapView, mergeProps({ key: 0 }, unref(pick)(_ctx.$props, unref(mapPropKeys)), {
            ref_key: "mapRef",
            ref: mapRef,
            message: unref(lang).message,
            clickMessage: unref(lang).clickMessage,
            searchPlaceholder: unref(lang).placeholder,
            okText: unref(lang).ok,
            mapKey: aMapKey.value,
            mode: _ctx.keywordMode ? "keyword" : _ctx.mode,
            mapPlugin: mapPluginImpl.value,
            onMapDone: handleMapDone,
            onDone: handleDone
          }), null, 16, ["message", "clickMessage", "searchPlaceholder", "okText", "mapKey", "mode", "mapPlugin"])) : createCommentVNode("", true)
        ]),
        _: 2
      }, [
        renderList(Object.keys(_ctx.$slots).filter((k) => "default" !== k), (name) => {
          return {
            name,
            fn: withCtx((slotProps) => [
              renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
            ])
          };
        })
      ]), 1040, ["title", "modelValue", "class", "onResized"]);
    };
  }
});
export {
  _sfc_main as default
};
