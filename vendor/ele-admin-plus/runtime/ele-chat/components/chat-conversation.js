import { defineComponent, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, createVNode, unref, withCtx, createCommentVNode, renderSlot, createTextVNode, toDisplayString, withModifiers, Fragment, renderList, createBlock, createSlots, mergeProps } from "vue";
import { ElIcon } from "element-plus";
import { ArrowDown, EllipsisOutlined } from "../../icons/index";
const _hoisted_1 = {
  key: 0,
  class: "ele-chat-conversation-shrink"
};
const _hoisted_2 = ["title"];
const _hoisted_3 = {
  key: 0,
  class: "ele-chat-conversations"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ChatConversation" },
  __name: "chat-conversation",
  props: {
    /** 对话 */
    item: {
      type: Object,
      required: true
    },
    /** 对话列表选中 */
    active: [String, Number],
    /** 对话列表展开 */
    expandedKeys: Array,
    /** 下拉菜单数据 */
    dropdownItems: [Array, Function],
    /** 当前打开下拉菜单的对话值 */
    dropdownOpenKey: [String, Number]
  },
  emits: {
    /**列表项点击事件 */
    itemClick: (_item, _e) => true,
    /**列表项更多按钮点击事件 */
    itemMoreClick: (_item, _dropdownMenus, _e) => true,
    /**列表项更多按钮鼠标移入事件 */
    itemMoreMouseenter: (_item, _dropdownMenus, _e) => true,
    /** 对话列表展开折叠事件 */
    itemExpandhange: (_item, _expanded) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isShrink = computed(() => {
      if (props.expandedKeys == null) {
        return false;
      }
      return !(props.item.key != null && props.expandedKeys.includes(props.item.key));
    });
    const dropdownData = computed(() => {
      if (typeof props.dropdownItems === "function") {
        return props.dropdownItems(props.item) || [];
      }
      return props.dropdownItems || [];
    });
    const handleItemExpandhange = (item, expanded) => {
      emit("itemExpandhange", item, expanded);
    };
    const handleItemClick = (item, e) => {
      if (!item.group && item.children != null) {
        handleItemExpandhange(item, isShrink.value);
      }
      if (item.children != null) {
        return;
      }
      emit("itemClick", item, e);
    };
    const handleItemMoreClick = (item, dropdownMenus, e) => {
      emit("itemMoreClick", item, dropdownMenus, e);
    };
    const handleItemMoreMouseenter = (item, dropdownMenus, e) => {
      emit("itemMoreMouseenter", item, dropdownMenus, e);
    };
    return (_ctx, _cache) => {
      const _component_ChatConversation = resolveComponent("ChatConversation", true);
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-chat-conversation", [
          { "is-group": __props.item.group },
          { "is-parent": !__props.item.group && __props.item.children != null },
          { "is-shrink": isShrink.value },
          { "is-active": __props.item.key != null && __props.item.key === __props.active },
          { "is-dropdown-opened": __props.item.key != null && __props.item.key === __props.dropdownOpenKey }
        ]])
      }, [
        createElementVNode("div", {
          class: "ele-chat-conversation-body",
          onClick: _cache[2] || (_cache[2] = (e) => handleItemClick(__props.item, e))
        }, [
          !__props.item.group && __props.item.children != null ? (openBlock(), createElementBlock("div", _hoisted_1, [
            createVNode(unref(ElIcon), null, {
              default: withCtx(() => [
                createVNode(unref(ArrowDown))
              ]),
              _: 1
            })
          ])) : createCommentVNode("", true),
          createElementVNode("div", {
            class: "ele-chat-conversation-label",
            title: __props.item.label
          }, [
            renderSlot(_ctx.$slots, "conversationItem", { item: __props.item }, () => [
              createTextVNode(toDisplayString(__props.item.label), 1)
            ])
          ], 8, _hoisted_2),
          dropdownData.value.length ? (openBlock(), createElementBlock("div", {
            key: 1,
            class: normalizeClass(["ele-chat-conversation-more", {
              "is-opened": __props.item.key != null && __props.item.key === __props.dropdownOpenKey
            }]),
            onClick: _cache[0] || (_cache[0] = withModifiers(
              (e) => handleItemMoreClick(__props.item, dropdownData.value, e),
              ["stop"]
            )),
            onMouseenter: _cache[1] || (_cache[1] = (e) => handleItemMoreMouseenter(__props.item, dropdownData.value, e))
          }, [
            createVNode(unref(ElIcon), null, {
              default: withCtx(() => [
                createVNode(unref(EllipsisOutlined))
              ]),
              _: 1
            })
          ], 34)) : createCommentVNode("", true)
        ]),
        __props.item.children != null ? (openBlock(), createElementBlock("div", _hoisted_3, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.item.children, (child) => {
            return openBlock(), createBlock(_component_ChatConversation, {
              key: child.key ?? child.label,
              item: child,
              active: __props.active,
              expandedKeys: __props.expandedKeys,
              dropdownItems: __props.dropdownItems,
              dropdownOpenKey: __props.dropdownOpenKey,
              onItemClick: handleItemClick,
              onItemMoreClick: handleItemMoreClick,
              onItemMoreMouseenter: handleItemMoreMouseenter,
              onItemExpandhange: handleItemExpandhange
            }, createSlots({ _: 2 }, [
              renderList(Object.keys(_ctx.$slots), (name) => {
                return {
                  name,
                  fn: withCtx((slotProps) => [
                    renderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotProps || {}))
                  ])
                };
              })
            ]), 1032, ["item", "active", "expandedKeys", "dropdownItems", "dropdownOpenKey"]);
          }), 128))
        ])) : createCommentVNode("", true)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
