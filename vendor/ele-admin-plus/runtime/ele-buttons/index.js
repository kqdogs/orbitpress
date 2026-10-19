import { defineComponent, createVNode, isVNode } from "vue";
import { useLocale } from "../ele-config-provider/receiver";
import ItemRender from "./components/item-render";
import { buttonsEmits, buttonsProps } from "./props";
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !isVNode(s);
}
const index = /* @__PURE__ */ defineComponent({
  name: "EleButtons",
  props: buttonsProps,
  emits: buttonsEmits,
  setup(props, {
    emit,
    slots
  }) {
    const {
      lang
    } = useLocale("buttons", props);
    const handleItemClick = (command, e) => {
      emit("itemClick", command, e);
    };
    const getItemSlots = (itemSlots) => {
      const slotObj = {};
      if (!itemSlots) {
        return slotObj;
      }
      Object.keys(itemSlots).forEach((key) => {
        const slot = itemSlots[key];
        if (slot) {
          if (typeof slot === "function") {
            slotObj[key] = slot;
          } else if (typeof slot === "string") {
            slotObj[key] = slots[slot];
          }
        }
      });
      return slotObj;
    };
    const renderItems = (wrapClass) => {
      return (props.items || []).map((item, index2) => {
        let _slot;
        return createVNode(ItemRender, {
          "key": item.key ?? item.command ?? item.title ?? item.preset,
          "item": item,
          "divider": index2 === 0 ? false : props.divider,
          "type": props.type,
          "wrapClass": wrapClass,
          "lang": lang.value,
          "onItemClick": handleItemClick
        }, _isSlot(_slot = getItemSlots(item.slots)) ? _slot : {
          default: () => [_slot]
        });
      });
    };
    return () => props.gap != null || props.wrap != null || props.modalFooter ? createVNode("div", {
      "class": ["ele-buttons-wrap ele-buttons", {
        "is-nowrap": props.wrap === false,
        "is-gap": props.gap != null,
        "is-modal-footer": props.modalFooter
      }],
      "style": props.gap == null || props.gap === true ? {} : {
        gap: `${props.gap || 0}px`
      }
    }, [renderItems(false), slots.default?.()]) : [renderItems(true), slots.default?.()];
  }
});
export {
  index as default
};
