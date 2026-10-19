import { defineComponent, computed, watch, onBeforeUnmount, openBlock, createElementBlock, Fragment, createBlock, unref, mergeProps, createCommentVNode, createSlots, withCtx, renderSlot, createElementVNode, toDisplayString, createVNode, renderList, normalizeProps, guardReactiveProps, resolveDynamicComponent } from "vue";
import { ElDivider, ElLink, ElIcon, ElButton } from "element-plus";
import { ArrowDown, EyeOutlined, ArrowUp, VerticalAlignMiddleOutlined, ColumnHeightOutlined, DownloadOutlined, UploadOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SyncOutlined, SearchOutlined } from "../../icons/index";
import { mapTree } from "../../utils/common";
import { useDropdown } from "../../ele-dropdown-provider/util";
import { usePopconfirm } from "../../ele-popconfirm-provider/util";
import { useTooltip } from "../../ele-tooltip-provider/util";
const dropdownDefaultTrigger = "hover";
const popconfirmDefaultTrigger = "click";
const tooltipDefaultTrigger = "hover";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ItemRender" },
  __name: "item-render",
  props: {
    /** 按钮数据 */
    item: {
      type: Object,
      required: true
    },
    /** 是否显示分割线 */
    divider: [Boolean, Object],
    /** 组件类型 */
    type: [String, Object, Function],
    /** 是否增加包裹类名 */
    wrapClass: Boolean,
    /** 文案 */
    lang: {
      type: Object,
      required: true
    }
  },
  emits: {
    itemClick: (_command, _e) => true
  },
  setup(__props, { emit: __emit }) {
    const presetIcon = {
      search: SearchOutlined,
      reset: SyncOutlined,
      add: PlusOutlined,
      delBatch: DeleteOutlined,
      edit: EditOutlined,
      del: DeleteOutlined,
      import: UploadOutlined,
      export: DownloadOutlined,
      upload: UploadOutlined,
      download: DownloadOutlined,
      expand: ColumnHeightOutlined,
      fold: VerticalAlignMiddleOutlined,
      searchExpand: ArrowDown,
      searchFold: ArrowUp,
      detail: EyeOutlined
    };
    const dangerLinkPreset = ["del", "delBatch"];
    const dangerBtnPreset = ["del", "delBatch"];
    const warningBtnPreset = ["edit"];
    const defaultBtnPreset = [
      "reset",
      "import",
      "export",
      "expand",
      "fold",
      "detail",
      "more",
      "cancel"
    ];
    const props = __props;
    const emit = __emit;
    const dropdownProvider = useDropdown();
    const popconfirmProvider = usePopconfirm();
    const tooltipProvider = useTooltip();
    let virtualTriggerEl;
    const getItemTitle = (item, lang) => {
      if (item.title != null) {
        return item.title;
      }
      if (!item.preset) {
        return;
      }
      return lang[item.preset];
    };
    const getItemIcon = (item) => {
      if (item.icon != null) {
        return item.icon;
      }
      if (!item.preset) {
        return;
      }
      return presetIcon[item.preset];
    };
    const componentType = computed(() => {
      return props.item.type ?? props.type;
    });
    const title = computed(() => {
      return getItemTitle(props.item, props.lang);
    });
    const icon = computed(() => {
      return getItemIcon(props.item);
    });
    const linkType = computed(() => {
      const preset = props.item.preset;
      if (preset && dangerLinkPreset.includes(preset)) {
        return "danger";
      }
      return "primary";
    });
    const btnType = computed(() => {
      const preset = props.item.preset;
      if (preset) {
        if (dangerBtnPreset.includes(preset)) {
          return "danger";
        }
        if (warningBtnPreset.includes(preset)) {
          return "warning";
        }
        if (defaultBtnPreset.includes(preset)) {
          return "default";
        }
      }
      return "primary";
    });
    const triggerItemClick = (command, e) => {
      emit("itemClick", command, e);
    };
    const handleDropdownCommand = (command) => {
      triggerItemClick(command);
    };
    const handleOpenDropdown = (e, item) => {
      if (!item.dropdownItems?.length || !dropdownProvider || !dropdownProvider.openDropdown) {
        return;
      }
      virtualTriggerEl = e.currentTarget;
      dropdownProvider.openDropdown(
        virtualTriggerEl,
        mapTree(item.dropdownItems, (d) => {
          return {
            ...d,
            title: getItemTitle(d, props.lang),
            icon: getItemIcon(d),
            preset: void 0,
            permission: void 0,
            anyPermission: void 0,
            role: void 0,
            anyRole: void 0,
            permissionFilter: void 0,
            vIf: void 0
          };
        }),
        {
          iconSize: "small",
          onCommand: handleDropdownCommand,
          popperOptions: { strategy: "fixed" },
          trigger: dropdownDefaultTrigger,
          ...item.dropdownProps || {}
        }
      );
    };
    const handleCloseDropdown = (e, el) => {
      if (dropdownProvider && dropdownProvider.removeDropdown) {
        const triggerEl = el ?? e?.currentTarget;
        triggerEl && dropdownProvider.removeDropdown(triggerEl);
      }
    };
    const handleOpenPopconfirm = (e, item) => {
      if (!item.popconfirmProps) {
        return;
      }
      if (!popconfirmProvider || !popconfirmProvider.openPopconfirm) {
        const onConfirm = item.popconfirmProps.onConfirm;
        onConfirm && onConfirm(e);
        return;
      }
      virtualTriggerEl = e.currentTarget;
      popconfirmProvider.openPopconfirm(virtualTriggerEl, {
        popperOptions: { strategy: "fixed" },
        trigger: popconfirmDefaultTrigger,
        ...item.popconfirmProps || {}
      });
    };
    const handleClosePopconfirm = (e, el) => {
      if (popconfirmProvider && popconfirmProvider.removePopconfirm) {
        const triggerEl = el ?? e?.currentTarget;
        triggerEl && popconfirmProvider.removePopconfirm(triggerEl);
      }
    };
    const handleOpenTooltip = (e, item) => {
      if (!item.tooltipProps || !tooltipProvider || !tooltipProvider.showTooltip) {
        return;
      }
      virtualTriggerEl = e.currentTarget;
      tooltipProvider.showTooltip(virtualTriggerEl, {
        popperOptions: { strategy: "fixed" },
        placement: "top",
        trigger: tooltipDefaultTrigger,
        ...item.tooltipProps || {}
      });
    };
    const handleCloseTooltip = (e, el) => {
      if (tooltipProvider && tooltipProvider.removeTooltip) {
        const triggerEl = el ?? e?.currentTarget;
        triggerEl && tooltipProvider.removeTooltip(triggerEl);
      }
    };
    const handleItemClick = (e, item) => {
      if (item.disabled) {
        handleCloseDropdown(e);
        handleClosePopconfirm(e);
        handleCloseTooltip(e);
        return;
      }
      if ((item.dropdownProps?.trigger || dropdownDefaultTrigger) === "click") {
        handleOpenDropdown(e, item);
      }
      if (item.popconfirmProps && (item.popconfirmProps.trigger ?? popconfirmDefaultTrigger) === "click") {
        handleOpenPopconfirm(e, item);
      }
      if (item.tooltipProps && (item.tooltipProps.trigger ?? tooltipDefaultTrigger) === "click") {
        handleOpenTooltip(e, item);
      }
      item.onClick && item.onClick(e);
      triggerItemClick(item.command, e);
    };
    const handleItemMouseenter = (e, item) => {
      if (item.disabled) {
        handleCloseDropdown(e);
        handleClosePopconfirm(e);
        handleCloseTooltip(e);
        return;
      }
      if ((item.dropdownProps?.trigger ?? dropdownDefaultTrigger) === "hover") {
        handleOpenDropdown(e, item);
      }
      if (item.popconfirmProps && (item.popconfirmProps.trigger ?? popconfirmDefaultTrigger) === "hover") {
        handleOpenPopconfirm(e, item);
      }
      if (item.tooltipProps && (item.tooltipProps.trigger ?? tooltipDefaultTrigger) === "hover") {
        handleOpenTooltip(e, item);
      }
    };
    const handleItemContextmenu = (e, item) => {
      if (item.disabled) {
        handleCloseDropdown(e);
        handleClosePopconfirm(e);
        return;
      }
      if ((item.dropdownProps?.trigger ?? dropdownDefaultTrigger) === "contextmenu") {
        e.preventDefault();
        handleOpenDropdown(e, item);
      }
      if (item.popconfirmProps && (item.popconfirmProps.trigger ?? popconfirmDefaultTrigger) === "contextmenu") {
        e.preventDefault();
        handleOpenPopconfirm(e, item);
      }
      if (item.tooltipProps && (item.tooltipProps.trigger ?? tooltipDefaultTrigger) === "contextmenu") {
        e.preventDefault();
        handleOpenTooltip(e, item);
      }
    };
    watch(
      () => props.item.disabled,
      (disabled) => {
        if (disabled && virtualTriggerEl) {
          handleCloseDropdown(void 0, virtualTriggerEl);
          handleClosePopconfirm(void 0, virtualTriggerEl);
          handleCloseTooltip(void 0, virtualTriggerEl);
        }
      }
    );
    onBeforeUnmount(() => {
      if (virtualTriggerEl) {
        handleCloseDropdown(void 0, virtualTriggerEl);
        handleClosePopconfirm(void 0, virtualTriggerEl);
        handleCloseTooltip(void 0, virtualTriggerEl);
        virtualTriggerEl = void 0;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        __props.divider ? (openBlock(), createBlock(unref(ElDivider), mergeProps({
          key: 0,
          direction: "vertical",
          class: "ele-buttons-divider"
        }, typeof __props.divider === "object" ? __props.divider : {}), null, 16)) : createCommentVNode("", true),
        componentType.value === "link" ? (openBlock(), createBlock(unref(ElLink), mergeProps({
          key: 1,
          underline: "never",
          type: linkType.value,
          icon: icon.value,
          disabled: __props.item.disabled,
          class: ["ele-buttons-item ele-buttons-link", {
            "ele-buttons-icon-link": !!icon.value,
            "ele-buttons-wrap": __props.wrapClass
          }]
        }, __props.item.props || {}, {
          onClick: _cache[0] || (_cache[0] = (e) => handleItemClick(e, __props.item)),
          onMouseenter: _cache[1] || (_cache[1] = (e) => handleItemMouseenter(e, __props.item)),
          onContextmenu: _cache[2] || (_cache[2] = (e) => handleItemContextmenu(e, __props.item))
        }), createSlots({
          default: withCtx(() => [
            renderSlot(_ctx.$slots, "default", {}, () => [
              createElementVNode("span", null, toDisplayString(title.value), 1)
            ]),
            __props.item.dropdownItems && __props.item.dropdownItems.length && __props.item.dropdownArrowProps !== false ? (openBlock(), createBlock(unref(ElIcon), mergeProps(
              { key: 0 },
              (__props.item.dropdownArrowProps === true ? void 0 : __props.item.dropdownArrowProps) || {},
              { class: "ele-buttons-arrow" }
            ), {
              default: withCtx(() => [
                createVNode(unref(ArrowDown))
              ]),
              _: 1
            }, 16)) : createCommentVNode("", true)
          ]),
          _: 2
        }, [
          renderList(Object.keys(_ctx.$slots).filter((k) => k !== "default"), (name) => {
            return {
              name,
              fn: withCtx((slotProps) => [
                renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
              ])
            };
          })
        ]), 1040, ["type", "icon", "disabled", "class"])) : componentType.value && componentType.value !== "button" ? (openBlock(), createBlock(resolveDynamicComponent(componentType.value), mergeProps({ key: 2 }, __props.item.props || {}, {
          onClick: _cache[3] || (_cache[3] = (e) => handleItemClick(e, __props.item)),
          onMouseenter: _cache[4] || (_cache[4] = (e) => handleItemMouseenter(e, __props.item)),
          onContextmenu: _cache[5] || (_cache[5] = (e) => handleItemContextmenu(e, __props.item))
        }), createSlots({
          default: withCtx(() => [
            __props.item.dropdownItems && __props.item.dropdownItems.length && __props.item.dropdownArrowProps !== false ? (openBlock(), createBlock(unref(ElIcon), mergeProps(
              { key: 0 },
              (__props.item.dropdownArrowProps === true ? void 0 : __props.item.dropdownArrowProps) || {},
              { class: "ele-buttons-arrow" }
            ), {
              default: withCtx(() => [
                createVNode(unref(ArrowDown))
              ]),
              _: 1
            }, 16)) : createCommentVNode("", true)
          ]),
          _: 2
        }, [
          renderList(Object.keys(_ctx.$slots), (name) => {
            return {
              name,
              fn: withCtx((slotProps) => [
                renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
              ])
            };
          })
        ]), 1040)) : (openBlock(), createBlock(unref(ElButton), mergeProps({
          key: 3,
          type: btnType.value,
          icon: icon.value,
          disabled: __props.item.disabled,
          class: ["ele-buttons-item ele-buttons-btn", {
            "ele-buttons-icon-btn": !!icon.value,
            "ele-buttons-wrap": __props.wrapClass
          }]
        }, __props.item.props || {}, {
          onClick: _cache[6] || (_cache[6] = (e) => handleItemClick(e, __props.item)),
          onMouseenter: _cache[7] || (_cache[7] = (e) => handleItemMouseenter(e, __props.item)),
          onContextmenu: _cache[8] || (_cache[8] = (e) => handleItemContextmenu(e, __props.item))
        }), createSlots({
          default: withCtx(() => [
            renderSlot(_ctx.$slots, "default", {}, () => [
              createElementVNode("span", null, toDisplayString(title.value), 1)
            ]),
            __props.item.dropdownItems && __props.item.dropdownItems.length && __props.item.dropdownArrowProps !== false ? (openBlock(), createBlock(unref(ElIcon), mergeProps(
              { key: 0 },
              (__props.item.dropdownArrowProps === true ? void 0 : __props.item.dropdownArrowProps) || {},
              { class: "ele-buttons-arrow" }
            ), {
              default: withCtx(() => [
                createVNode(unref(ArrowDown))
              ]),
              _: 1
            }, 16)) : createCommentVNode("", true)
          ]),
          _: 2
        }, [
          renderList(Object.keys(_ctx.$slots).filter((k) => k !== "default"), (name) => {
            return {
              name,
              fn: withCtx((slotProps) => [
                renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
              ])
            };
          })
        ]), 1040, ["type", "icon", "disabled", "class"]))
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};
