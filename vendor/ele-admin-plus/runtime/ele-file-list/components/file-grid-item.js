import { defineComponent, ref, computed, openBlock, createElementBlock, withModifiers, normalizeClass, createElementVNode, renderSlot, createBlock, toDisplayString, createCommentVNode } from "vue";
import FileIcon from "./file-icon";
const _hoisted_1 = { class: "ele-file-list-item-icon" };
const _hoisted_2 = ["src"];
const _hoisted_3 = ["title"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "FileGridItem" },
  __name: "file-grid-item",
  props: {
    /** 数据 */
    item: {
      type: Object,
      required: true
    },
    /** 选择框类型 */
    selectionType: String,
    /** 多选选中数据 */
    selections: Array,
    /** 单选选中数据 */
    current: Object,
    /** 后缀对应的图标 */
    icons: Array,
    /** 右键下拉菜单是否显示 */
    ctxMenuDropdownVisible: Boolean
  },
  emits: {
    click: (_item) => true,
    checkChange: (_item) => true,
    contextOpen: (_option) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const dropdownTriggerRef = ref(null);
    const selectable = computed(() => {
      return props.selectionType === "checkbox" || props.selectionType === "radio";
    });
    const selected = computed(() => {
      if (!selectable.value || !props.item) {
        return false;
      }
      if (props.selectionType === "checkbox") {
        return !!(props.selections && props.selections.some((t) => t.key === props.item.key));
      }
      return !!(props.current && props.current.key === props.item.key);
    });
    const handleClick = () => {
      emit("click", props.item);
    };
    const handleCheckChange = () => {
      emit("checkChange", props.item);
    };
    const handleContextmenu = (e) => {
      if (dropdownTriggerRef.value != null) {
        emit("contextOpen", {
          item: props.item,
          triggerEl: dropdownTriggerRef.value,
          e
        });
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-file-list-item", [
          { "is-checked": selected.value },
          { "is-active": __props.ctxMenuDropdownVisible }
        ]]),
        onClick: withModifiers(handleClick, ["stop"])
      }, [
        createElementVNode("div", {
          class: "ele-file-list-item-body",
          onContextmenu: handleContextmenu
        }, [
          createElementVNode("div", _hoisted_1, [
            renderSlot(_ctx.$slots, "icon", { item: __props.item }, () => [
              __props.item.thumbnail ? (openBlock(), createElementBlock("img", {
                key: 0,
                src: __props.item.thumbnail,
                class: "ele-file-list-item-image"
              }, null, 8, _hoisted_2)) : (openBlock(), createBlock(FileIcon, {
                key: 1,
                icons: __props.icons,
                isDirectory: __props.item.isDirectory,
                fileName: __props.item.name
              }, null, 8, ["icons", "isDirectory", "fileName"]))
            ])
          ]),
          renderSlot(_ctx.$slots, "title", { item: __props.item }, () => [
            createElementVNode("div", {
              title: __props.item.name,
              class: "ele-file-list-item-title"
            }, toDisplayString(__props.item.name), 9, _hoisted_3)
          ])
        ], 32),
        selectable.value ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "ele-file-list-item-checkbox",
          onClick: withModifiers(handleCheckChange, ["stop"])
        }, [..._cache[1] || (_cache[1] = [
          createElementVNode("i", { class: "ele-file-list-checkbox is-checked" }, null, -1)
        ])])) : createCommentVNode("", true),
        createElementVNode("div", {
          ref_key: "dropdownTriggerRef",
          ref: dropdownTriggerRef,
          class: "ele-file-list-item-dropdown",
          onClick: _cache[0] || (_cache[0] = withModifiers(() => {
          }, ["stop"]))
        }, null, 512)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
