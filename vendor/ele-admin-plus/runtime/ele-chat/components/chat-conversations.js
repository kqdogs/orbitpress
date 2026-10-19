import { defineComponent, inject, ref, watch, openBlock, createElementBlock, Fragment, renderList, createBlock, createSlots, withCtx, renderSlot, mergeProps } from "vue";
import { useDropdown } from "../../ele-dropdown-provider/util";
import ChatConversation from "./chat-conversation";
import { CHAT_KEY, defaultDropdownProps } from "../props";
const _hoisted_1 = { class: "ele-chat-conversation-list" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "chat-conversations",
  props: {
    /** 对话列表 */
    items: Array,
    /** 对话列表选中 */
    active: [String, Number],
    /** 对话列表展开 */
    expandedKeys: Array,
    /** 下拉菜单属性 */
    dropdownProps: Object,
    /** 下拉菜单数据 */
    dropdownItems: [Array, Function]
  },
  emits: {
    /**对话列表项点击事件 */
    itemClick: (_item) => true,
    /** 更新对话列表选中 */
    "update:active": (_active) => true,
    /** 更新对话列表展开 */
    "update:expandedKeys": (_keys) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const chatProvider = inject(CHAT_KEY, null);
    const dropdownProvider = useDropdown();
    const expandedItemKeys = ref(
      props.expandedKeys
    );
    const itemDropdownOpenKey = ref();
    let itemDropdownCurrentData;
    const handleChatItemClick = (item) => {
      emit("itemClick", item);
      if (item.key != null && item.key !== props.active) {
        emit("update:active", item.key);
      }
    };
    const openDropdown = (item, triggerEl, dropdownMenus, dropdownProps) => {
      if (!dropdownMenus.length) {
        const f = dropdownProvider?.removeDropdown ?? chatProvider?.removeDropdown;
        f && f(triggerEl);
        return;
      }
      itemDropdownCurrentData = item;
      itemDropdownOpenKey.value = item.key;
      const option = {
        ...defaultDropdownProps,
        onVisibleChange: handleDropdownVisibleChange,
        ...dropdownProps || {}
      };
      const func = dropdownProvider?.openDropdown ?? chatProvider?.openDropdown;
      func && func(triggerEl, dropdownMenus, option);
    };
    const handleItemMoreClick = (item, dropdownMenus, e) => {
      if (props.dropdownProps?.trigger !== "hover") {
        openDropdown(item, e.currentTarget, dropdownMenus, props.dropdownProps);
      }
    };
    const handleItemMoreMouseenter = (item, dropdownMenus, e) => {
      if (props.dropdownProps?.trigger === "hover") {
        openDropdown(item, e.currentTarget, dropdownMenus, props.dropdownProps);
      }
    };
    const expandedKeysIsChanged = (keys1, keys2) => {
      if (keys1 == null && keys2 == null) {
        return false;
      }
      if (keys1 != null && keys2 == null || keys1 == null && keys2 != null) {
        return true;
      }
      if ((keys1?.length ?? 0) !== (keys2?.length ?? 0)) {
        return true;
      }
      return (keys1 ?? []).some((v) => !(keys2 ?? []).includes(v));
    };
    const handleItemExpandhange = (item, expanded) => {
      if (item.key == null) {
        return;
      }
      const keys = new Set(expandedItemKeys.value || []);
      if (expandedItemKeys.value == null && props.items) {
        props.items.forEach((d) => {
          if (d.key != null) {
            keys.add(d.key);
          }
        });
      }
      if (expanded) {
        keys.add(item.key);
      } else {
        keys.delete(item.key);
      }
      expandedItemKeys.value = [...keys];
      if (expandedKeysIsChanged(props.expandedKeys, expandedItemKeys.value)) {
        emit("update:expandedKeys", expandedItemKeys.value);
      }
    };
    const handleDropdownVisibleChange = (visible) => {
      if (!visible) {
        itemDropdownOpenKey.value = void 0;
      } else {
        itemDropdownOpenKey.value = itemDropdownCurrentData?.key;
      }
    };
    watch(
      () => props.expandedKeys,
      (keys) => {
        if (expandedKeysIsChanged(keys, expandedItemKeys.value)) {
          expandedItemKeys.value = keys;
        }
      },
      { deep: true }
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.items, (item) => {
          return openBlock(), createBlock(ChatConversation, {
            key: item.key ?? item.label,
            item,
            active: __props.active,
            expandedKeys: expandedItemKeys.value,
            dropdownItems: __props.dropdownItems,
            dropdownOpenKey: itemDropdownOpenKey.value,
            onItemClick: handleChatItemClick,
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
      ]);
    };
  }
});
export {
  _sfc_main as default
};
