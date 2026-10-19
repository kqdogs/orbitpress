import { defineComponent, ref, computed, onMounted, onBeforeUnmount, openBlock, createElementBlock, createElementVNode, normalizeStyle, unref, normalizeClass, renderSlot, Fragment, renderList } from "vue";
import { useMoveEvent, useMousewheel } from "../utils/hook";
import { useContentRatio, getRotatedBounds } from "./util";
import { viewerEmits, viewerProps } from "./props";
const _hoisted_1 = ["src"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleViewer" },
  __name: "index",
  props: viewerProps,
  emits: viewerEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const viewerRef = ref(null);
    const bodyRef = ref(null);
    const viewerMoving = ref(false);
    const viewerTranslateX = ref(0);
    const viewerTranslateY = ref(0);
    const viewerScale = ref(100);
    const viewerFlipX = ref(false);
    const viewerFlipY = ref(false);
    const viewerRotate = ref(0);
    const imageTransform = computed(() => {
      const sx = viewerFlipX.value ? -1 : 1;
      const sy = viewerFlipY.value ? -1 : 1;
      return `scaleX(${sx}) scaleY(${sy}) rotate(${viewerRotate.value}deg)`;
    });
    const scaleReverse = computed(() => {
      return (100 / viewerScale.value).toFixed(6);
    });
    const imageTransformReverse = computed(() => {
      const sx = viewerFlipX.value ? -1 : 1;
      const sy = viewerFlipY.value ? -1 : 1;
      return `scaleX(${sx}) scaleY(${sy}) rotate(${360 - viewerRotate.value}deg)`;
    });
    const handleClick = (e) => {
      emit("contentClick", e);
    };
    const handleContextmenu = (e) => {
      emit("contentContextmenu", e);
    };
    const handleImgLoad = () => {
      autoIntoView();
    };
    const getZoomStep = () => {
      return props.zoomStep;
    };
    const zoomIn = () => {
      if (viewerScale.value >= props.zoomMax) {
        return;
      }
      viewerScale.value += getZoomStep();
    };
    const zoomOut = () => {
      if (viewerScale.value <= props.zoomMin) {
        return;
      }
      viewerScale.value -= getZoomStep();
    };
    const flipX = () => {
      viewerFlipX.value = !viewerFlipX.value;
    };
    const flipY = () => {
      viewerFlipY.value = !viewerFlipY.value;
    };
    const rotateLeft = () => {
      if (viewerRotate.value === 0) {
        viewerRotate.value = 360 - props.rotateStep;
        return;
      }
      if (viewerRotate.value <= props.rotateStep) {
        viewerRotate.value = 0;
        return;
      }
      viewerRotate.value -= props.rotateStep;
    };
    const rotateRight = () => {
      if (viewerRotate.value >= 360 - props.rotateStep) {
        viewerRotate.value = 0;
        return;
      }
      viewerRotate.value += props.rotateStep;
    };
    const setTranslateX = (xValue) => {
      viewerTranslateX.value = xValue;
    };
    const setTranslateY = (yValue) => {
      viewerTranslateY.value = yValue;
    };
    const autoIntoView = () => {
      const pEl = viewerRef.value;
      const pw = pEl?.offsetWidth || 0;
      const ph = pEl?.offsetHeight || 0;
      const el = bodyRef.value;
      const w = el?.offsetWidth || 0;
      const h = el?.offsetHeight || 0;
      viewerTranslateX.value = Math.floor((pw - w) / 2);
      viewerTranslateY.value = Math.floor((ph - h) / 2);
      const { width, height } = getRotatedBounds(w, h, viewerRotate.value);
      viewerScale.value = Math.min(pw / width * 100, ph / height * 100);
    };
    const autoIntoViewWidth = () => {
      const pEl = viewerRef.value;
      const pw = pEl?.offsetWidth || 0;
      const ph = pEl?.offsetHeight || 0;
      const el = bodyRef.value;
      const w = el?.offsetWidth || 0;
      const h = el?.offsetHeight || 0;
      viewerScale.value = pw / w * 100;
      const sh = h * (viewerScale.value / 100);
      viewerTranslateX.value = Math.floor((pw - w) / 2);
      if (sh < ph) {
        viewerTranslateY.value = Math.floor((ph - h) / 2);
      } else {
        viewerTranslateY.value = Math.floor((sh - h) / 2);
      }
    };
    const autoIntoViewHeight = () => {
      const pEl = viewerRef.value;
      const pw = pEl?.offsetWidth || 0;
      const ph = pEl?.offsetHeight || 0;
      const el = bodyRef.value;
      const w = el?.offsetWidth || 0;
      const h = el?.offsetHeight || 0;
      viewerScale.value = ph / h * 100;
      const sw = w * (viewerScale.value / 100);
      if (sw < pw) {
        viewerTranslateX.value = Math.floor((pw - w) / 2);
      } else {
        viewerTranslateX.value = Math.floor((sw - w) / 2);
      }
      viewerTranslateY.value = Math.floor((ph - h) / 2);
    };
    const reset = () => {
      viewerFlipX.value = false;
      viewerFlipY.value = false;
      viewerRotate.value = 0;
      autoIntoView();
    };
    let startX = null;
    let startY = null;
    const { handleMousedown, handleTouchstart } = useMoveEvent({
      start: () => {
        viewerMoving.value = true;
        startX = viewerTranslateX.value;
        startY = viewerTranslateY.value;
      },
      move: ({ distanceX, distanceY, e }) => {
        if (startX == null || startY == null || distanceX == null || distanceY == null || !contentStyle.show.value) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        viewerTranslateX.value = Math.floor(distanceX + startX);
        viewerTranslateY.value = Math.floor(distanceY + startY);
      },
      end: () => {
        startX = null;
        startY = null;
        viewerMoving.value = false;
      },
      touchmoveOptions: { passive: false }
    });
    const { bindMousewheel, unbindMousewheel } = useMousewheel(
      ({ e, direction }) => {
        e.preventDefault();
        e.stopPropagation();
        if (direction === "up") {
          zoomIn();
          return;
        }
        zoomOut();
      }
    );
    const contentStyle = useContentRatio();
    onMounted(() => {
      viewerRef.value && bindMousewheel(viewerRef.value);
      autoIntoView();
    });
    onBeforeUnmount(() => {
      viewerRef.value && unbindMousewheel(viewerRef.value);
    });
    __expose({
      viewerMoving,
      viewerTranslateX,
      viewerTranslateY,
      viewerScale,
      viewerFlipX,
      viewerFlipY,
      viewerRotate,
      zoomIn,
      zoomOut,
      flipX,
      flipY,
      rotateLeft,
      rotateRight,
      setTranslateX,
      setTranslateY,
      autoIntoView,
      autoIntoViewWidth,
      autoIntoViewHeight,
      reset
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "viewerRef",
        ref: viewerRef,
        class: "ele-viewer"
      }, [
        createElementVNode("div", {
          ref_key: "bodyRef",
          ref: bodyRef,
          class: "ele-viewer-body",
          style: normalizeStyle({
            transform: `translate(${viewerTranslateX.value}px, ${viewerTranslateY.value}px)`
          })
        }, [
          createElementVNode("div", {
            class: "ele-viewer-main",
            style: normalizeStyle({ transform: `scale(${(viewerScale.value / 100).toFixed(6)})` })
          }, [
            createElementVNode("div", {
              class: normalizeClass(["ele-viewer-content", { "is-moving": viewerMoving.value }]),
              style: normalizeStyle([unref(contentStyle) || {}, { transform: imageTransform.value }]),
              onMousedown: _cache[0] || (_cache[0] = //@ts-ignore
              (...args) => unref(handleMousedown) && unref(handleMousedown)(...args)),
              onTouchstartPassive: _cache[1] || (_cache[1] = //@ts-ignore
              (...args) => unref(handleTouchstart) && unref(handleTouchstart)(...args)),
              onClick: handleClick,
              onContextmenu: handleContextmenu
            }, [
              _ctx.src ? (openBlock(), createElementBlock("img", {
                key: 0,
                src: _ctx.src,
                class: "ele-viewer-image",
                style: normalizeStyle(_ctx.imageStyle),
                onLoad: handleImgLoad
              }, null, 44, _hoisted_1)) : (openBlock(), createElementBlock("div", {
                key: 1,
                class: "ele-viewer-image",
                style: normalizeStyle(_ctx.imageStyle)
              }, [
                renderSlot(_ctx.$slots, "default")
              ], 4)),
              (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.markers, (marker) => {
                return openBlock(), createElementBlock("div", {
                  key: marker.key,
                  style: normalizeStyle({
                    left: (marker.x || 0) + "px",
                    top: (marker.y || 0) + "px",
                    transform: marker.fixed ? `scale(${scaleReverse.value})` : void 0
                  }),
                  class: "ele-viewer-marker"
                }, [
                  createElementVNode("div", {
                    class: "ele-viewer-marker-content",
                    style: normalizeStyle({
                      transform: marker.fixed ? imageTransformReverse.value : void 0
                    })
                  }, [
                    renderSlot(_ctx.$slots, "markerItem", { item: marker })
                  ], 4)
                ], 4);
              }), 128))
            ], 38)
          ], 4)
        ], 4)
      ], 512);
    };
  }
});
export {
  _sfc_main as default
};
