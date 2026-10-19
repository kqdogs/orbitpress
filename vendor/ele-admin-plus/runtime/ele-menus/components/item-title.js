import { defineComponent, computed, resolveComponent, openBlock, createElementBlock, Fragment, renderSlot, createBlock, unref, normalizeProps, mergeProps, withCtx, resolveDynamicComponent, normalizeStyle, createCommentVNode, toDisplayString, createElementVNode } from "vue";
import { ElIcon, ElBadge } from "element-plus";
import { isExternalLink } from "../../utils/common";
const _hoisted_1 = {
  key: 0,
  class: "ele-menu-title"
};
const _hoisted_2 = ["href", "target"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ItemTitle" },
  __name: "item-title",
  props: {
    /** 菜单项数据 */
    item: {
      type: Object,
      required: true
    },
    /** 是否需要标题 */
    showTitle: {
      type: Boolean,
      default: true
    },
    /** 是否需要链接 */
    showLink: Boolean
  },
  emits: {
    itemClick: (_item, _e) => true,
    itemMouseenter: (_item, _e) => true,
    itemMouseleave: (_item, _e) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isExternalPath = computed(() => {
      const { path, meta } = props.item;
      if (!path) {
        return false;
      }
      if (isExternalLink(path)) {
        return true;
      }
      if (meta && typeof meta === "object" && meta.openType === "external") {
        return true;
      }
      return false;
    });
    const handleItemClick = (item, e) => {
      if (props.showLink && (isExternalPath.value || item.path && item.pathTarget === "_blank")) {
        e.stopPropagation();
      }
      emit("itemClick", item, e);
    };
    const handleItemMouseenter = (item, e) => {
      emit("itemMouseenter", item, e);
    };
    const handleItemMouseleave = (item, e) => {
      emit("itemMouseleave", item, e);
    };
    return (_ctx, _cache) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      return openBlock(), createElementBlock(Fragment, null, [
        renderSlot(_ctx.$slots, "icon", {
          item: __props.item,
          icon: __props.item.icon
        }, () => [
          __props.item.icon ? (openBlock(), createBlock(unref(ElIcon), normalizeProps(mergeProps({ key: 0 }, __props.item.iconProps || {})), {
            default: withCtx(() => [
              (openBlock(), createBlock(resolveDynamicComponent(__props.item.icon), {
                style: normalizeStyle(__props.item.iconStyle)
              }, null, 8, ["style"]))
            ]),
            _: 1
          }, 16)) : createCommentVNode("", true)
        ]),
        __props.showTitle ? renderSlot(_ctx.$slots, "title", {
          key: 0,
          item: __props.item,
          title: __props.item.title
        }, () => [
          __props.item.title ? (openBlock(), createElementBlock("span", _hoisted_1, toDisplayString(__props.item.title), 1)) : createCommentVNode("", true)
        ]) : createCommentVNode("", true),
        __props.item.badge != null ? (openBlock(), createBlock(unref(ElBadge), normalizeProps(mergeProps({ key: 1 }, __props.item.badge)), null, 16)) : createCommentVNode("", true),
        createElementVNode("div", {
          class: "ele-menu-trigger",
          onClick: _cache[0] || (_cache[0] = (e) => handleItemClick(__props.item, e)),
          onMouseenter: _cache[1] || (_cache[1] = (e) => handleItemMouseenter(__props.item, e)),
          onMouseleave: _cache[2] || (_cache[2] = (e) => handleItemMouseleave(__props.item, e))
        }, [
          __props.showLink ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            isExternalPath.value ? (openBlock(), createElementBlock("a", {
              key: 0,
              href: __props.item.path,
              target: __props.item.pathTarget || "_blank",
              class: "ele-menu-link"
            }, null, 8, _hoisted_2)) : __props.item.path ? (openBlock(), createBlock(_component_RouterLink, {
              key: 1,
              to: __props.item.path,
              target: __props.item.pathTarget,
              class: "ele-menu-link"
            }, null, 8, ["to", "target"])) : createCommentVNode("", true)
          ], 64)) : createCommentVNode("", true)
        ], 32)
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};
