import { defineComponent, ref, computed, watch, openBlock, createElementBlock, normalizeClass, unref, createElementVNode, normalizeStyle, renderSlot, createCommentVNode, createVNode, withCtx, createBlock } from "vue";
import { ElIcon } from "element-plus";
import { ArrowUp, ArrowLeft } from "../icons/index";
import { useMoveEvent } from "../utils/hook";
import MainContent from "../ele-loading/components/main-content";
import { useResponsive } from "../ele-pro-layout/util";
import { splitPanelEmits, splitPanelProps } from "./props";
const _hoisted_1 = { class: "ele-split-panel-tools" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleSplitPanel" },
  __name: "index",
  props: splitPanelProps,
  emits: splitPanelEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isResponsive = useResponsive(props);
    const wrapperRef = ref(null);
    const sideWrapperRef = ref(null);
    const isCollapse = ref(false);
    const resizedSize = ref(null);
    const resizing = ref(false);
    const sideSize = computed(() => {
      const size = resizedSize.value ?? props.size ?? "20%";
      if (typeof size === "number") {
        return `${size}px`;
      }
      return size;
    });
    const spaceSize = computed(() => {
      const size = props.space ?? "16px";
      if (typeof size === "number") {
        return `${size}px`;
      }
      return size;
    });
    const sideWrapStyle = computed(() => {
      const style = {};
      if (props.vertical) {
        style.height = sideSize.value;
      } else {
        style.width = sideSize.value;
      }
      if (isCollapse.value === true) {
        const m = `calc(${sideSize.value} * -1)`;
        if (props.vertical) {
          if (sideSize.value.endsWith("px")) {
            if (props.reverse) {
              style.margin = `0 0 ${m} 0`;
            } else {
              style.margin = `${m} 0 0 0`;
            }
          } else {
            style.height = 0;
          }
        } else {
          if (sideSize.value.endsWith("px") || sideSize.value.endsWith("%")) {
            if (props.reverse) {
              style.margin = `0 ${m} 0 0`;
            } else {
              style.margin = `0 0 0 ${m}`;
            }
          } else {
            style.width = 0;
          }
        }
      } else {
        if (props.vertical) {
          if (props.reverse) {
            style.marginTop = spaceSize.value;
          } else {
            style.marginBottom = spaceSize.value;
          }
        } else {
          if (props.reverse) {
            style.marginLeft = spaceSize.value;
          } else {
            style.marginRight = spaceSize.value;
          }
        }
      }
      return style;
    });
    const btnOffsetStyle = computed(() => {
      const offset = props.collapseBtnOffset;
      if (isCollapse.value !== true || offset == null || offset === "") {
        return {};
      }
      const p = typeof offset === "number" ? `${offset}px` : offset;
      return props.vertical ? props.reverse ? { marginBottom: p } : { marginTop: p } : props.reverse ? { marginRight: p } : { marginLeft: p };
    });
    const btnGroupStyle = computed(() => {
      const offset = props.collapseBtnOffset;
      if (offset == null || offset === "") {
        return {};
      }
      const p = typeof offset === "number" ? `${offset}px` : offset;
      return { gap: `calc(${p} * 2)` };
    });
    const toggleCollapse = (collapse) => {
      const c = collapse === "body" || typeof collapse === "boolean" ? collapse : !isCollapse.value;
      if (isCollapse.value !== c) {
        isCollapse.value = c;
      }
      if (props.collapse !== isCollapse.value) {
        emit("update:collapse", isCollapse.value);
      }
    };
    const resetSize = () => {
      resizedSize.value = null;
    };
    const getResizedSize = (size) => {
      const el = wrapperRef.value;
      if (!props.percentage || !el) {
        return `${size}px`;
      }
      const sideSize2 = props.vertical ? el.offsetHeight : el.offsetWidth;
      return `${size / sideSize2 * 100}%`;
    };
    const getMinSize = () => {
      return !props.minSize || props.minSize < 0 ? 0 : props.minSize;
    };
    const getMaxSize = () => {
      const el = wrapperRef.value;
      if (!el) {
        if (props.maxSize && props.maxSize > 1) {
          return props.maxSize;
        }
        return;
      }
      const size = props.vertical ? el.offsetHeight : el.offsetWidth;
      if (!props.maxSize) {
        return size;
      }
      if (props.maxSize < 0) {
        return size + props.maxSize;
      } else if (props.maxSize < 1) {
        return Math.floor(size * props.maxSize);
      }
      return Math.min(props.maxSize, size);
    };
    let resizeEventData = null;
    const { handleMousedown, handleTouchstart } = useMoveEvent({
      start: () => {
        const el = sideWrapperRef.value;
        if (!el) {
          resizeEventData = null;
          return;
        }
        resizing.value = true;
        resizeEventData = {
          downW: el.offsetWidth,
          downH: el.offsetHeight,
          min: getMinSize(),
          max: getMaxSize()
        };
        emit(
          "resizeStart",
          props.vertical ? resizeEventData.downH : resizeEventData.downW
        );
      },
      move: ({ distanceX, distanceY, e }) => {
        if (!resizeEventData) {
          return;
        }
        const dx = distanceX ?? 0;
        const dy = distanceY ?? 0;
        const { downW, downH, min, max } = resizeEventData;
        e.preventDefault();
        const size = props.vertical ? (props.reverse ? -dy : dy) + downH : (props.reverse ? -dx : dx) + downW;
        const rSize = Math.max(size, min);
        resizeEventData.size = max == null ? rSize : Math.min(rSize, max);
        resizedSize.value = getResizedSize(resizeEventData.size);
        emit("resize", resizeEventData.size, resizedSize.value);
      },
      end: () => {
        resizing.value = false;
        const size = resizeEventData?.size;
        resizeEventData = null;
        emit("resizeEnd", size, resizedSize.value);
      },
      touchmoveOptions: { passive: false }
    });
    watch(
      () => props.size,
      () => {
        resetSize();
      }
    );
    watch(
      () => props.minSize,
      () => {
        if (resizedSize.value) {
          const min = getMinSize();
          if (resizedSize.value.endsWith("px")) {
            if (Number.parseInt(resizedSize.value) < min) {
              resizedSize.value = getResizedSize(min);
            }
          } else if (resizedSize.value.endsWith("%")) {
            const el = wrapperRef.value;
            if (el) {
              const sideSize2 = props.vertical ? el.offsetHeight : el.offsetWidth;
              if (Number.parseInt(resizedSize.value) / 100 * sideSize2 < min) {
                resizedSize.value = getResizedSize(min);
              }
            }
          }
        }
      }
    );
    watch([() => props.maxSize, () => props.vertical], () => {
      if (resizedSize.value) {
        const max = getMaxSize();
        if (max != null) {
          if (resizedSize.value.endsWith("px")) {
            if (Number.parseInt(resizedSize.value) > max) {
              resizedSize.value = getResizedSize(max);
            }
          } else if (resizedSize.value.endsWith("%")) {
            const el = wrapperRef.value;
            if (el) {
              const sideSize2 = props.vertical ? el.offsetHeight : el.offsetWidth;
              if (Number.parseInt(resizedSize.value) / 100 * sideSize2 > max) {
                resizedSize.value = getResizedSize(max);
              }
            }
          }
        }
      }
    });
    watch(
      [() => props.collapse, () => props.allowCollapse],
      () => {
        if (props.allowCollapse !== true && props.allowCollapse !== "both") {
          toggleCollapse(false);
        } else if (props.allowCollapse !== "both" && props.collapse === "body") {
          toggleCollapse(false);
        } else {
          toggleCollapse(
            props.collapse === "body" || props.collapse === true ? props.collapse : false
          );
        }
      },
      { immediate: true }
    );
    __expose({
      toggleCollapse,
      resetSize
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "wrapperRef",
        ref: wrapperRef,
        class: normalizeClass(["ele-split-panel", [
          { "is-reverse": _ctx.reverse },
          { "is-vertical": _ctx.vertical },
          { "is-collapse": isCollapse.value === true },
          { "is-maximized": isCollapse.value === "body" },
          { "is-resizing": resizing.value },
          { "is-responsive": unref(isResponsive) },
          { "is-flex-table": _ctx.flexTable && _ctx.flexTable !== "auto" },
          { "is-flex-auto-table": _ctx.flexTable === "auto" }
        ]])
      }, [
        createElementVNode("div", {
          ref_key: "sideWrapperRef",
          ref: sideWrapperRef,
          class: "ele-split-panel-wrap",
          style: normalizeStyle([_ctx.customWrapStyle, sideWrapStyle.value])
        }, [
          createElementVNode("div", {
            class: "ele-split-panel-side",
            style: normalizeStyle(_ctx.customStyle)
          }, [
            _ctx.$slots.sideHeader ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "ele-split-panel-side-header",
              style: normalizeStyle(_ctx.sideHeaderStyle)
            }, [
              renderSlot(_ctx.$slots, "sideHeader")
            ], 4)) : createCommentVNode("", true),
            renderSlot(_ctx.$slots, "default")
          ], 4),
          createElementVNode("div", _hoisted_1, [
            _ctx.resizable ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "ele-split-panel-resize",
              onMousedown: _cache[0] || (_cache[0] = //@ts-ignore
              (...args) => unref(handleMousedown) && unref(handleMousedown)(...args)),
              onTouchstartPassive: _cache[1] || (_cache[1] = //@ts-ignore
              (...args) => unref(handleTouchstart) && unref(handleTouchstart)(...args))
            }, null, 32)) : createCommentVNode("", true),
            _ctx.allowCollapse === "both" ? (openBlock(), createElementBlock("div", {
              key: 1,
              class: "ele-split-panel-collapse-btn-group",
              style: normalizeStyle(btnGroupStyle.value)
            }, [
              createElementVNode("div", {
                style: normalizeStyle(_ctx.collapseStyle),
                class: "ele-split-panel-collapse-btn is-collapse-btn",
                onClick: _cache[2] || (_cache[2] = ($event) => toggleCollapse(isCollapse.value === "body" ? false : true))
              }, [
                renderSlot(_ctx.$slots, "collapse", { collapse: isCollapse.value }, () => [
                  createVNode(unref(ElIcon), { class: "ele-split-panel-collapse-icon" }, {
                    default: withCtx(() => [
                      _ctx.vertical ? (openBlock(), createBlock(unref(ArrowUp), {
                        key: 0,
                        style: { strokeWidth: 5, marginTop: "-1.25px" }
                      })) : (openBlock(), createBlock(unref(ArrowLeft), {
                        key: 1,
                        style: { strokeWidth: 5, marginLeft: "-1.25px" }
                      }))
                    ]),
                    _: 1
                  })
                ])
              ], 4),
              createElementVNode("div", {
                style: normalizeStyle(_ctx.collapseStyle),
                class: "ele-split-panel-collapse-btn is-maximized-btn",
                onClick: _cache[3] || (_cache[3] = ($event) => toggleCollapse(isCollapse.value === true ? false : "body"))
              }, [
                renderSlot(_ctx.$slots, "maximized", { collapse: isCollapse.value }, () => [
                  createVNode(unref(ElIcon), { class: "ele-split-panel-collapse-icon" }, {
                    default: withCtx(() => [
                      _ctx.vertical ? (openBlock(), createBlock(unref(ArrowUp), {
                        key: 0,
                        style: { strokeWidth: 5, marginTop: "-1.25px" }
                      })) : (openBlock(), createBlock(unref(ArrowLeft), {
                        key: 1,
                        style: { strokeWidth: 5, marginLeft: "-1.25px" }
                      }))
                    ]),
                    _: 1
                  })
                ])
              ], 4)
            ], 4)) : _ctx.allowCollapse === true ? (openBlock(), createElementBlock("div", {
              key: 2,
              style: normalizeStyle([_ctx.collapseStyle, btnOffsetStyle.value]),
              class: "ele-split-panel-collapse-btn",
              onClick: _cache[4] || (_cache[4] = ($event) => toggleCollapse())
            }, [
              renderSlot(_ctx.$slots, "collapse", { collapse: isCollapse.value }, () => [
                createVNode(unref(ElIcon), { class: "ele-split-panel-collapse-icon" }, {
                  default: withCtx(() => [
                    _ctx.vertical ? (openBlock(), createBlock(unref(ArrowUp), {
                      key: 0,
                      style: { strokeWidth: 5, marginTop: "-1.25px" }
                    })) : (openBlock(), createBlock(unref(ArrowLeft), {
                      key: 1,
                      style: { strokeWidth: 5, marginLeft: "-1.25px" }
                    }))
                  ]),
                  _: 1
                })
              ])
            ], 4)) : createCommentVNode("", true)
          ])
        ], 4),
        createVNode(MainContent, {
          class: "ele-split-panel-body",
          style: normalizeStyle(_ctx.bodyStyle)
        }, {
          default: withCtx(() => [
            _ctx.$slots.bodyHeader ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "ele-split-panel-body-header",
              style: normalizeStyle(_ctx.bodyHeaderStyle)
            }, [
              renderSlot(_ctx.$slots, "bodyHeader")
            ], 4)) : createCommentVNode("", true),
            renderSlot(_ctx.$slots, "body", { collapse: isCollapse.value })
          ]),
          _: 3
        }, 8, ["style"]),
        createElementVNode("div", {
          class: "ele-split-panel-mask",
          onClick: _cache[5] || (_cache[5] = ($event) => toggleCollapse())
        })
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
