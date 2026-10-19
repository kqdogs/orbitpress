import { defineComponent, ref, computed, openBlock, createBlock, mergeProps, withCtx, renderSlot, normalizeProps, createCommentVNode } from "vue";
import { omit, pick, contentIsEllipsis } from "../utils/common";
import EleTooltip from "../ele-tooltip/index";
import EleText from "../ele-text/index";
import { textPropKeys } from "../ele-text/props";
import { ellipsisProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleEllipsis" },
  __name: "index",
  props: ellipsisProps,
  setup(__props, { expose: __expose }) {
    const props = __props;
    const textRef = ref(null);
    const virtualRef = ref();
    const text = ref("");
    const title = computed(() => {
      if (!props.tooltip || typeof props.tooltip !== "object" || props.tooltip.original !== true) {
        return;
      }
      return text.value;
    });
    const tooltipProps = computed(() => {
      const isObj = props.tooltip && props.tooltip !== true;
      const opt = isObj ? { ...props.tooltip } : {};
      opt.content = text.value;
      opt.virtualRef = virtualRef.value;
      opt.virtualTriggering = true;
      return omit(opt, ["original"]);
    });
    const multiLine = computed(() => {
      return !!(props.maxLine && props.maxLine > 1);
    });
    const textProps = computed(() => {
      return Object.assign({ title: title.value }, pick(props, textPropKeys));
    });
    const rootStyle = computed(() => {
      const style = {};
      const { lineHeight, maxLine } = props;
      if (lineHeight != null) {
        const h = typeof lineHeight === "number" ? `${lineHeight}px` : lineHeight;
        style.lineHeight = h;
        if (multiLine.value) {
          style.height = `calc(${h} * ${maxLine})`;
        }
      }
      if (multiLine.value) {
        style["-webkit-line-clamp"] = maxLine;
      }
      return style;
    });
    const handleHover = (e) => {
      if (!props.tooltip) {
        virtualRef.value = void 0;
        return;
      }
      const target = e.currentTarget;
      if (typeof props.tooltip === "object" && props.tooltip.content) {
        if (text.value !== props.tooltip.content) {
          text.value = props.tooltip.content;
        }
      } else {
        if (target) {
          const temp = contentIsEllipsis(target) ? target.innerText : "";
          if (text.value !== temp) {
            text.value = temp;
          }
        }
      }
      if (text.value && (props.tooltip === true || !props.tooltip.original)) {
        if (virtualRef.value !== target) {
          virtualRef.value = target;
        }
      } else {
        virtualRef.value = void 0;
      }
    };
    __expose({
      textRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleText, mergeProps(textProps.value, {
        ref_key: "textRef",
        ref: textRef,
        style: rootStyle.value,
        class: ["ele-ellipsis", { "is-multi-line": multiLine.value }],
        onMouseover: handleHover
      }), {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default"),
          virtualRef.value ? (openBlock(), createBlock(EleTooltip, normalizeProps(mergeProps({ key: 0 }, tooltipProps.value)), null, 16)) : createCommentVNode("", true)
        ]),
        _: 3
      }, 16, ["style", "class"]);
    };
  }
});
export {
  _sfc_main as default
};
