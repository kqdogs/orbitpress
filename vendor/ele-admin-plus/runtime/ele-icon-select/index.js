import { defineComponent, ref, computed, watch, openBlock, createBlock, unref, createSlots, withCtx, createElementBlock, normalizeStyle, renderSlot, Fragment, renderList, normalizeClass, toDisplayString, createCommentVNode, createVNode, createElementVNode, normalizeProps, guardReactiveProps } from "vue";
import { ElInput } from "element-plus";
import { useLocale } from "../ele-config-provider/receiver";
import { useResponsive } from "../ele-pro-layout/util";
import EleBasicSelect from "../ele-basic-select/index";
import { useFormValidate, valueIsChanged } from "../ele-basic-select/util";
import { SearchOutlined } from "../icons/index";
import IconGrid from "./components/icon-grid";
import { iconSelectEmits, iconSelectProps } from "./props";
const _hoisted_1 = ["onClick"];
const _hoisted_2 = { class: "ele-icon-select-main" };
const _hoisted_3 = ["onClick"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleIconSelect" },
  __name: "index",
  props: iconSelectProps,
  emits: iconSelectEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const ownSlots = ["default", "icon", "tabLeftExtra", "tabRightExtra"];
    const props = __props;
    const emit = __emit;
    const { lang } = useLocale("iconSelect", props);
    const { validateChange } = useFormValidate();
    const isResponsive = useResponsive(props);
    const selectRef = ref(null);
    const selectVisible = ref(false);
    const tabs = ref([]);
    const tabActive = ref();
    const menus = ref([]);
    const menuActive = ref();
    const icons = ref([]);
    const keywords = ref("");
    const tabBar = computed(() => {
      if (!tabs.value || !tabs.value.length) {
        return false;
      }
      if (props.hideOnSingleTab && tabs.value.length === 1) {
        return false;
      }
      return true;
    });
    const showFilterInput = computed(() => {
      if (props.filterable === true && props.popperType !== "popper") {
        return true;
      }
      return props.filterable === "popper";
    });
    const selectPopperClass = computed(() => {
      const classes = ["ele-icon-select-popper"];
      if (props.popperType === "default") {
        classes.push("is-icon-select-default");
      }
      if (props.popperType === "modal" && (tabBar.value || showFilterInput.value || menus.value?.length)) {
        classes.push("ele-modal-show-header-border");
      }
      if (isResponsive.value && props.popperType === "popper") {
        classes.push("is-icon-select-responsive");
      }
      if (props.popperClass) {
        classes.push(props.popperClass);
      }
      return classes.join(" ");
    });
    const updatePopover = () => {
      selectRef.value && selectRef.value.updatePopper();
    };
    const initData = () => {
      if (props.data == null || !props.data.length || typeof props.data[0] === "string") {
        tabs.value = [];
        menus.value = [];
        tabActive.value = void 0;
        menuActive.value = void 0;
        icons.value = filterData(props.data);
        return;
      }
      tabs.value = props.data.map(
        (d) => d.title
      );
      if (tabActive.value == null || tabActive.value >= tabs.value.length) {
        tabActive.value = 0;
      }
      const data = props.data[tabActive.value];
      if (typeof data !== "string" && data.children != null && data.children.length) {
        menus.value = data.children.map((d) => d.title);
        if (menuActive.value == null || menuActive.value >= menus.value.length) {
          menuActive.value = 0;
        }
        icons.value = filterData(data.children[menuActive.value].icons);
        return;
      }
      menus.value = [];
      menuActive.value = void 0;
      icons.value = typeof data !== "string" ? filterData(data.icons) : [];
    };
    const filterData = (data) => {
      if (!data) {
        return [];
      }
      if (!keywords.value) {
        return data;
      }
      const keyword = keywords.value.toLowerCase();
      return data.filter((t) => t.toLowerCase().includes(keyword));
    };
    const updateVisible = (visible) => {
      if (visible) {
        handleSelectFilter("");
      }
      if (selectVisible.value !== visible) {
        selectVisible.value = visible;
        emit("visibleChange", visible);
      }
    };
    const updateModelValue = (modelValue) => {
      if (valueIsChanged(modelValue, props.modelValue)) {
        emit("update:modelValue", modelValue);
        validateChange();
        emit("change", modelValue);
      }
    };
    const handleSelectClear = () => {
      updateModelValue(null);
      updateVisible(false);
      emit("clear");
    };
    const handleSelectFocus = (e) => {
      emit("focus", e);
    };
    const handleSelectBlur = (e) => {
      emit("blur", e);
    };
    const handleSelectFilter = (value) => {
      if (keywords.value !== value) {
        keywords.value = value;
      }
      initData();
      if (!props.data?.length || icons.value.length) {
        return;
      }
      for (let i = 0; i < props.data.length; i++) {
        const d = props.data[i];
        if (typeof d === "string") {
          return;
        }
        const keyword = keywords.value.toLowerCase();
        if (d.children != null && d.children.length) {
          for (let j = 0; j < d.children.length; j++) {
            const icons2 = d.children[j].icons;
            if (icons2 && icons2.some((t) => t.toLowerCase().includes(keyword))) {
              menuActive.value = j;
              tabActive.value = i;
              initData();
              return;
            }
          }
        } else if (d.icons != null && d.icons.some((t) => t.toLowerCase().includes(keyword))) {
          tabActive.value = i;
          initData();
          return;
        }
      }
    };
    const handleTabClick = (index) => {
      tabActive.value = index;
      initData();
    };
    const handleMenuClick = (index) => {
      menuActive.value = index;
      initData();
    };
    const handleIconSelect = (icon) => {
      updateModelValue(icon);
      updateVisible(false);
    };
    watch(
      () => props.data,
      () => {
        initData();
      },
      {
        immediate: true,
        deep: true
      }
    );
    __expose({
      selectRef,
      updatePopover
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleBasicSelect, {
        ref_key: "selectRef",
        ref: selectRef,
        value: _ctx.modelValue,
        multiple: false,
        disabled: _ctx.disabled,
        size: _ctx.size,
        clearable: _ctx.clearable,
        placeholder: _ctx.placeholder,
        automaticDropdown: _ctx.automaticDropdown,
        filterable: typeof _ctx.filterable === "boolean" ? _ctx.filterable : false,
        teleported: _ctx.teleported,
        persistent: _ctx.persistent,
        placement: _ctx.placement,
        transition: _ctx.transition,
        popperOptions: _ctx.popperOptions,
        selectClass: "is-icon-select",
        selectStyle: _ctx.selectStyle,
        inputStyle: _ctx.inputStyle,
        selectTagsStyle: _ctx.selectTagsStyle,
        popperClass: selectPopperClass.value,
        popperWidth: _ctx.popperWidth,
        popperHeight: _ctx.popperHeight,
        popperType: _ctx.popperType,
        popperProps: _ctx.popperProps,
        popperSlots: _ctx.popperSlots,
        popperTitle: unref(lang).title,
        responsive: unref(isResponsive),
        selectedLabel: _ctx.modelValue,
        visible: selectVisible.value,
        "onUpdate:visible": updateVisible,
        onFilterChange: handleSelectFilter,
        onClear: handleSelectClear,
        onFocus: handleSelectFocus,
        onBlur: handleSelectBlur
      }, createSlots({
        default: withCtx(() => [
          tabBar.value || showFilterInput.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: "ele-icon-select-header",
            style: normalizeStyle(_ctx.headerStyle)
          }, [
            renderSlot(_ctx.$slots, "tabLeftExtra"),
            tabBar.value ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "ele-icon-select-tabs",
              style: normalizeStyle(_ctx.tabsStyle)
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(tabs.value, (t, i) => {
                return openBlock(), createElementBlock("div", {
                  key: `${i}-${t}`,
                  class: normalizeClass(["ele-icon-select-tab", { "is-active": i === tabActive.value }]),
                  onClick: ($event) => handleTabClick(i)
                }, toDisplayString(t), 11, _hoisted_1);
              }), 128))
            ], 4)) : createCommentVNode("", true),
            showFilterInput.value ? (openBlock(), createElementBlock("div", {
              key: 1,
              class: "ele-icon-select-search",
              style: normalizeStyle(_ctx.searchStyle)
            }, [
              createVNode(unref(ElInput), {
                size: "small",
                clearable: true,
                modelValue: keywords.value,
                validateEvent: false,
                prefixIcon: unref(SearchOutlined),
                placeholder: _ctx.filterPlaceholder ?? unref(lang).searchPlaceholder,
                "onUpdate:modelValue": handleSelectFilter
              }, null, 8, ["modelValue", "prefixIcon", "placeholder"])
            ], 4)) : createCommentVNode("", true),
            renderSlot(_ctx.$slots, "tabRightExtra")
          ], 4)) : createCommentVNode("", true),
          createElementVNode("div", _hoisted_2, [
            menus.value && menus.value.length ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "ele-icon-select-menus",
              style: normalizeStyle(_ctx.menusStyle)
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(menus.value, (m, i) => {
                return openBlock(), createElementBlock("div", {
                  key: `${i}-${m}`,
                  class: normalizeClass(["ele-icon-select-menu", { "is-active": i === menuActive.value }]),
                  onClick: ($event) => handleMenuClick(i)
                }, toDisplayString(m), 11, _hoisted_3);
              }), 128))
            ], 4)) : createCommentVNode("", true),
            createVNode(IconGrid, {
              data: icons.value,
              icon: _ctx.modelValue,
              emptyProps: _ctx.emptyProps,
              tooltip: _ctx.tooltip,
              tooltipProps: _ctx.tooltipProps,
              popperVisible: selectVisible.value,
              gridStyle: _ctx.gridStyle,
              itemStyle: _ctx.itemStyle,
              popperType: _ctx.popperType,
              style: normalizeStyle(_ctx.bodyStyle),
              onSelect: handleIconSelect
            }, createSlots({ _: 2 }, [
              _ctx.$slots.icon ? {
                name: "icon",
                fn: withCtx((slotProps) => [
                  renderSlot(_ctx.$slots, "icon", normalizeProps(guardReactiveProps(slotProps || {})))
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["data", "icon", "emptyProps", "tooltip", "tooltipProps", "popperVisible", "gridStyle", "itemStyle", "popperType", "style"])
          ])
        ]),
        _: 2
      }, [
        renderList(Object.keys(_ctx.$slots).filter((k) => !ownSlots.includes(k)), (name) => {
          return {
            name,
            fn: withCtx((slotProps) => [
              renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
            ])
          };
        }),
        _ctx.modelValue && _ctx.$slots.icon ? {
          name: "prefix",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "icon", {
              icon: _ctx.modelValue,
              prefix: true
            })
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["value", "disabled", "size", "clearable", "placeholder", "automaticDropdown", "filterable", "teleported", "persistent", "placement", "transition", "popperOptions", "selectStyle", "inputStyle", "selectTagsStyle", "popperClass", "popperWidth", "popperHeight", "popperType", "popperProps", "popperSlots", "popperTitle", "responsive", "selectedLabel", "visible"]);
    };
  }
});
export {
  _sfc_main as default
};
