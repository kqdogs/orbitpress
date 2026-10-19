import { defineComponent, reactive, ref, shallowRef, computed, watch, onBeforeUnmount, openBlock, createElementBlock, createBlock, unref, createSlots, renderList, withCtx, renderSlot, normalizeProps, guardReactiveProps, createElementVNode, normalizeStyle, mergeProps, createCommentVNode, nextTick } from "vue";
import { throttle } from "../utils/common";
import { useLocale } from "../ele-config-provider/receiver";
import EleDropdown from "../ele-dropdown/index";
import FileGrid from "./components/file-grid";
import FileTable from "./components/file-table";
import { fileListEmits, fileListProps } from "./props";
const GRID_ITEM_SEL = ".ele-file-list-body>.ele-file-list-item";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleFileList" },
  __name: "index",
  props: fileListProps,
  emits: fileListEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { lang } = useLocale("fileList", props);
    const selectorStyle = reactive({
      top: "0px",
      left: "0px",
      width: "0px",
      height: "0px",
      display: "none"
    });
    const ctxMenuDropdownRef = ref(null);
    const ctxMenuDropdownItems = shallowRef([]);
    const ctxMenuDropdownVirtualRef = ref();
    const ctxMenuDropdownVisible = ref(false);
    const contextMenuFileItem = ref(null);
    const isCheckAll = computed(() => {
      return !!(props.data && props.data.length && props.selections && props.selections.length && !props.data.some((d) => !props.selections?.some?.((t) => d.key === t.key)));
    });
    const isIndeterminate = computed(() => {
      return !!(!isCheckAll.value && props.selections && props.selections.length);
    });
    const updateSelections = (selection) => {
      emit("update:selections", selection);
    };
    const updateCurrent = (current) => {
      emit("update:current", current);
    };
    const handleCheckAllChange = () => {
      if (props.selectionType !== "checkbox") {
        return;
      }
      if (isCheckAll.value || props.data == null || !props.data.length) {
        if (!props.selections) {
          updateSelections([]);
          return;
        }
        const temp2 = props.selections.filter((d) => {
          return props.data ? !props.data.some((t) => t.key === d.key) : true;
        });
        updateSelections(temp2);
        return;
      }
      if (!props.selections) {
        updateSelections([...props.data]);
        return;
      }
      const temp = props.selections.concat(
        props.data.filter((d) => {
          return props.selections ? !props.selections.some((t) => t.key === d.key) : true;
        })
      );
      updateSelections(temp);
    };
    const handleItemCheckChange = (item) => {
      if (props.selectionType === "radio") {
        updateCurrent(
          props.current && props.current.key === item.key ? null : item
        );
        return;
      }
      if (props.selectionType !== "checkbox") {
        return;
      }
      if (!props.selections || !props.selections.length) {
        updateSelections([item]);
        return;
      }
      if (!props.selections.some((t) => t.key === item.key)) {
        updateSelections(props.selections.concat([item]));
        return;
      }
      updateSelections(props.selections.filter((t) => t.key !== item.key));
    };
    const handleItemClick = (item) => {
      emit("itemClick", item);
    };
    const handleSortChange = (name) => {
      const sorter = { sort: name };
      if (props.order && name === props.sort) {
        sorter.order = props.order === "asc" ? "desc" : null;
      } else {
        sorter.order = "asc";
      }
      emit("sortChange", sorter);
    };
    const handleItemCtxMenuClick = (key) => {
      if (contextMenuFileItem.value != null) {
        const option = {
          key,
          item: contextMenuFileItem.value
        };
        emit("itemContextMenu", option);
      }
    };
    const handleItemCtxMenuVisible = (visible) => {
      ctxMenuDropdownVisible.value = visible;
      if (visible && ctxMenuDropdownRef.value != null && contextMenuFileItem.value != null) {
        emit(
          "itemContextOpen",
          ctxMenuDropdownRef.value,
          contextMenuFileItem.value
        );
      }
    };
    const getContextMenus = (item) => {
      if (typeof props.contextMenus === "function") {
        return props.contextMenus(item);
      }
      return props.contextMenus;
    };
    const hideAllDropdown = () => {
      if (ctxMenuDropdownRef.value) {
        ctxMenuDropdownRef.value.handleClose();
      }
    };
    const showItemContextMenu = (item, triggerEl) => {
      if (contextMenuFileItem.value != null && contextMenuFileItem.value === item) {
        return;
      }
      hideAllDropdown();
      nextTick(() => {
        contextMenuFileItem.value = item;
        ctxMenuDropdownItems.value = getContextMenus(item) || [];
        ctxMenuDropdownVirtualRef.value = triggerEl;
        if (ctxMenuDropdownItems.value.length) {
          nextTick(() => {
            ctxMenuDropdownRef.value && ctxMenuDropdownRef.value.handleOpen();
          });
        }
      });
    };
    const handleItemContextOpen = (option) => {
      if (props.contextMenus == null) {
        return;
      }
      option.e.preventDefault();
      option.e.stopPropagation();
      if (ctxMenuDropdownVirtualRef.value !== option.triggerEl) {
        showItemContextMenu(option.item, option.triggerEl);
        return;
      }
      if (ctxMenuDropdownItems.value.length && ctxMenuDropdownRef.value) {
        ctxMenuDropdownRef.value.handleOpen();
      }
    };
    const handleMousedown = (event) => {
      if (!props.boxChoose || props.selectionType !== "checkbox") {
        return;
      }
      const downX = event.clientX;
      const downY = event.clientY;
      const target = event.currentTarget;
      const position = target.getBoundingClientRect();
      const items = Array.from(target.querySelectorAll(GRID_ITEM_SEL));
      const mousemoveFn = throttle((e) => {
        const moveX = Math.max(e.clientX, position.left);
        const moveY = Math.max(e.clientY, position.top);
        const left = Math.min(moveX, downX) - position.left;
        const top = Math.min(moveY, downY) - position.top;
        const width = Math.min(
          Math.abs(moveX - downX),
          target.clientWidth - left
        );
        const height = Math.min(
          Math.abs(moveY - downY),
          target.clientHeight - top
        );
        selectorStyle.left = left + "px";
        selectorStyle.top = top + "px";
        selectorStyle.width = width + "px";
        selectorStyle.height = height + "px";
        selectorStyle.display = "block";
        if (width < 6 || height < 6) {
          items.forEach((item) => {
            item.classList.remove("is-active");
          });
          return;
        }
        event.stopPropagation();
        event.preventDefault();
        e.stopPropagation();
        e.preventDefault();
        items.forEach((item) => {
          const itemX = item.offsetLeft + item.clientWidth;
          const itemY = item.offsetTop + item.clientHeight;
          if (itemX > left && itemY > top && item.offsetLeft < left + width && item.offsetTop < top + height) {
            item.classList.add("is-active");
          } else {
            item.classList.remove("is-active");
          }
        });
      }, 60);
      const mouseupFn = (e) => {
        selectorStyle.display = "none";
        const moveX = Math.max(e.clientX, position.left);
        const moveY = Math.max(e.clientY, position.top);
        const left = Math.min(moveX, downX) - position.left;
        const top = Math.min(moveY, downY) - position.top;
        const width = Math.min(
          Math.abs(moveX - downX),
          target.clientWidth - left
        );
        const height = Math.min(
          Math.abs(moveY - downY),
          target.clientHeight - top
        );
        if (width > 6 && height > 6) {
          const checked = [];
          items.forEach((item, i) => {
            if (item.classList.contains("is-active")) {
              item.classList.remove("is-active");
              if (props.data && props.data[i]) {
                checked.push(props.data[i]);
              }
            }
          });
          if (checked.length) {
            updateSelections(checked);
          }
        }
        document.removeEventListener("mousemove", mousemoveFn);
        document.removeEventListener("mouseup", mouseupFn);
      };
      document.addEventListener("mousemove", mousemoveFn);
      document.addEventListener("mouseup", mouseupFn);
    };
    watch(
      [() => props.grid, () => props.data],
      () => {
        hideAllDropdown();
        ctxMenuDropdownVirtualRef.value = null;
        contextMenuFileItem.value = null;
      },
      { deep: true }
    );
    onBeforeUnmount(() => {
      contextMenuFileItem.value = null;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "ele-file-list-group",
        onMousedown: handleMousedown
      }, [
        _ctx.grid ? (openBlock(), createBlock(FileGrid, {
          key: 0,
          data: _ctx.data,
          icons: _ctx.icons,
          selectionType: _ctx.selectionType,
          selections: _ctx.selections,
          current: _ctx.current,
          isCheckAll: isCheckAll.value,
          isIndeterminate: isIndeterminate.value,
          checkAllText: unref(lang).selectAll,
          selectedText: unref(lang).selectTips,
          ctxMenuDropdownVisible: ctxMenuDropdownVisible.value,
          contextMenuFileItem: contextMenuFileItem.value,
          onCheckAllChange: handleCheckAllChange,
          onItemClick: handleItemClick,
          onItemCheckChange: handleItemCheckChange,
          onItemContextOpen: handleItemContextOpen
        }, createSlots({ _: 2 }, [
          renderList(Object.keys(_ctx.$slots), (name) => {
            return {
              name,
              fn: withCtx((slotProps) => [
                renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
              ])
            };
          })
        ]), 1032, ["data", "icons", "selectionType", "selections", "current", "isCheckAll", "isIndeterminate", "checkAllText", "selectedText", "ctxMenuDropdownVisible", "contextMenuFileItem"])) : (openBlock(), createBlock(FileTable, {
          key: 1,
          data: _ctx.data,
          icons: _ctx.smallIcons || _ctx.icons,
          selectionType: _ctx.selectionType,
          selections: _ctx.selections,
          current: _ctx.current,
          isCheckAll: isCheckAll.value,
          isIndeterminate: isIndeterminate.value,
          nameText: unref(lang).fileName,
          sizeText: unref(lang).fileSize,
          timeText: unref(lang).fileTimestamp,
          sortable: _ctx.sortable,
          sort: _ctx.sort,
          order: _ctx.order,
          columns: _ctx.columns,
          ctxMenuDropdownVisible: ctxMenuDropdownVisible.value,
          contextMenuFileItem: contextMenuFileItem.value,
          onCheckAllChange: handleCheckAllChange,
          onItemClick: handleItemClick,
          onItemCheckChange: handleItemCheckChange,
          onItemContextOpen: handleItemContextOpen,
          onSortChange: handleSortChange
        }, createSlots({ _: 2 }, [
          renderList(Object.keys(_ctx.$slots), (name) => {
            return {
              name,
              fn: withCtx((slotProps) => [
                renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
              ])
            };
          })
        ]), 1032, ["data", "icons", "selectionType", "selections", "current", "isCheckAll", "isIndeterminate", "nameText", "sizeText", "timeText", "sortable", "sort", "order", "columns", "ctxMenuDropdownVisible", "contextMenuFileItem"])),
        createElementVNode("div", {
          class: "ele-file-list-selector",
          style: normalizeStyle(selectorStyle)
        }, null, 4),
        _ctx.contextMenus ? (openBlock(), createBlock(EleDropdown, mergeProps({
          key: 2,
          persistent: false,
          placement: "bottom-start",
          popperClass: "ele-file-list-item-context",
          validateEvent: false
        }, _ctx.contextMenuProps || {}, {
          ref_key: "ctxMenuDropdownRef",
          ref: ctxMenuDropdownRef,
          componentType: "pro",
          preventContextmenu: true,
          trigger: "click",
          virtualTriggering: true,
          virtualRef: ctxMenuDropdownVirtualRef.value,
          disabled: !ctxMenuDropdownItems.value.length,
          items: ctxMenuDropdownItems.value,
          onCommand: handleItemCtxMenuClick,
          onVisibleChange: handleItemCtxMenuVisible
        }), null, 16, ["virtualRef", "disabled", "items"])) : createCommentVNode("", true)
      ], 32);
    };
  }
});
export {
  _sfc_main as default
};
