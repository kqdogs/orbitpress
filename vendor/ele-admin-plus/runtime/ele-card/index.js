import { defineComponent, ref, watch, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, renderSlot, createTextVNode, toDisplayString, createCommentVNode, withModifiers, createVNode, unref, withCtx, Transition, withDirectives, vShow } from "vue";
import { ElIcon } from "element-plus";
import { ArrowUp } from "../icons/index";
import { useCollapseAnim } from "../utils/hook";
import { cardEmits, cardProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleCard" },
  __name: "index",
  props: cardProps,
  emits: cardEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const {
      handleBeforeEnter,
      handleEnter,
      handleAfterEnter,
      handleBeforeLeave,
      handleLeave,
      handleAfterLeave
    } = useCollapseAnim();
    const isCollapse = ref(!!props.collapse);
    const handleCollapseClick = () => {
      isCollapse.value = !isCollapse.value;
      emit("collapseChange", isCollapse.value);
    };
    const handleHeaderClick = () => {
      if (props.collapsable === "header") {
        handleCollapseClick();
      }
    };
    watch(
      () => props.collapse,
      (collapse) => {
        if (isCollapse.value !== !!collapse) {
          isCollapse.value = !!collapse;
        }
      }
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-card", [
          { "is-border": _ctx.bordered },
          { "is-shadow": _ctx.shadow === "always" },
          { "is-hover-shadow": _ctx.shadow === "hover" },
          { "is-collapse": isCollapse.value },
          { "is-flex-table": _ctx.flexTable && _ctx.flexTable !== "auto" },
          { "is-flex-auto-table": _ctx.flexTable === "auto" },
          { "is-search-form": _ctx.searchForm }
        ]])
      }, [
        _ctx.header || _ctx.$slots.header || _ctx.$slots.extra ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(["ele-card-header", _ctx.headerClass]),
          style: normalizeStyle(_ctx.headerStyle),
          onClick: handleHeaderClick
        }, [
          createElementVNode("div", {
            class: "ele-card-title",
            style: normalizeStyle(_ctx.titleStyle)
          }, [
            renderSlot(_ctx.$slots, "header", {}, () => [
              createTextVNode(toDisplayString(_ctx.header), 1)
            ])
          ], 4),
          _ctx.$slots.extra ? renderSlot(_ctx.$slots, "extra", { key: 0 }) : createCommentVNode("", true),
          _ctx.collapsable ? (openBlock(), createElementBlock("div", {
            key: 1,
            style: normalizeStyle(_ctx.collapseIconStyle),
            class: "ele-card-collapse-icon",
            onClick: withModifiers(handleCollapseClick, ["stop"])
          }, [
            renderSlot(_ctx.$slots, "collapseIcon", { collapse: isCollapse.value }, () => [
              createVNode(unref(ElIcon), null, {
                default: withCtx(() => [
                  createVNode(unref(ArrowUp))
                ]),
                _: 1
              })
            ])
          ], 4)) : createCommentVNode("", true)
        ], 6)) : createCommentVNode("", true),
        createVNode(Transition, {
          name: "ele-card-slide",
          onBeforeLeave: unref(handleBeforeLeave),
          onLeave: unref(handleLeave),
          onAfterLeave: unref(handleAfterLeave),
          onBeforeEnter: unref(handleBeforeEnter),
          onEnter: unref(handleEnter),
          onAfterEnter: unref(handleAfterEnter)
        }, {
          default: withCtx(() => [
            withDirectives(createElementVNode("div", {
              class: normalizeClass(["ele-card-body", _ctx.bodyClass]),
              style: normalizeStyle(_ctx.bodyStyle)
            }, [
              renderSlot(_ctx.$slots, "default")
            ], 6), [
              [vShow, !isCollapse.value]
            ])
          ]),
          _: 3
        }, 8, ["onBeforeLeave", "onLeave", "onAfterLeave", "onBeforeEnter", "onEnter", "onAfterEnter"]),
        _ctx.footer || _ctx.$slots.footer ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: normalizeClass(["ele-card-footer", _ctx.footerClass]),
          style: normalizeStyle(_ctx.footerStyle)
        }, [
          renderSlot(_ctx.$slots, "footer", {}, () => [
            createTextVNode(toDisplayString(_ctx.footer), 1)
          ])
        ], 6)) : createCommentVNode("", true)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
