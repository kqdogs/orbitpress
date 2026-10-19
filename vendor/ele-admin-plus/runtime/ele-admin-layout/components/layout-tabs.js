import { defineComponent, openBlock, createBlock, withCtx, renderSlot, createVNode, unref, createCommentVNode, createSlots, normalizeProps, guardReactiveProps } from "vue";
import { ElIcon } from "element-plus";
import { HomeOutlined } from "../../icons/index";
import EleTabWrap from "../../ele-tab-wrap/index";
import EleTabTool from "../../ele-tab-tool/index";
import EleTabs from "../../ele-tabs/index";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "LayoutTabs" },
  __name: "layout-tabs",
  props: {
    /** 页签数据 */
    tabs: Array,
    /** 页签选中 */
    active: String,
    /** 是否需要固定的主页页签 */
    fixedHome: Boolean,
    /** 主页路由地址 */
    homePath: String,
    /** 当前路由是否是主页 */
    isHome: Boolean,
    /** 页签风格 */
    tabStyle: String,
    /** 是否支持右键菜单 */
    tabContextMenu: [Boolean, Object],
    /** 右键菜单 */
    tabContextMenus: [Array, Function],
    /** 是否支持拖动排序 */
    tabSortable: Boolean
  },
  emits: {
    tabClick: (_option) => true,
    tabRemove: (_name) => true,
    tabContextMenu: (_option) => true,
    tabSortChange: (_data) => true
  },
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const handleTabItemClick = (option) => {
      emit("tabClick", option);
    };
    const handleTabRemove = (name) => {
      emit("tabRemove", name);
    };
    const handleTabContextMenu = (option) => {
      emit("tabContextMenu", option);
    };
    const handleTabSortChange = (data) => {
      emit("tabSortChange", data);
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleTabWrap, {
        type: __props.tabStyle,
        class: "ele-admin-tabs"
      }, {
        default: withCtx(() => [
          __props.fixedHome ? (openBlock(), createBlock(EleTabTool, {
            key: 0,
            tab: true,
            active: __props.isHome,
            tabName: __props.homePath
          }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "tabHome", { active: __props.active }, () => [
                createVNode(unref(ElIcon), {
                  class: "ele-tab-icon",
                  style: { verticalAlign: "-2px" }
                }, {
                  default: withCtx(() => [
                    createVNode(unref(HomeOutlined), { style: { transform: "scale(1.08)" } })
                  ]),
                  _: 1
                })
              ])
            ]),
            _: 3
          }, 8, ["active", "tabName"])) : createCommentVNode("", true),
          __props.tabs ? (openBlock(), createBlock(EleTabs, {
            key: 1,
            items: __props.tabs,
            modelValue: __props.active,
            sortable: __props.tabSortable,
            contextMenu: __props.tabContextMenu,
            contextMenus: __props.tabContextMenus,
            mousewheel: true,
            handleClick: true,
            onTabRemove: handleTabRemove,
            onTabItemClick: handleTabItemClick,
            onTabContextMenu: handleTabContextMenu,
            onTabSortChange: handleTabSortChange
          }, createSlots({ _: 2 }, [
            _ctx.$slots.tabTitle ? {
              name: "label",
              fn: withCtx((slotProps) => [
                renderSlot(_ctx.$slots, "tabTitle", normalizeProps(guardReactiveProps(slotProps || {})))
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["items", "modelValue", "sortable", "contextMenu", "contextMenus"])) : createCommentVNode("", true),
          renderSlot(_ctx.$slots, "tabExtra", { active: __props.active })
        ]),
        _: 3
      }, 8, ["type"]);
    };
  }
});
export {
  _sfc_main as default
};
