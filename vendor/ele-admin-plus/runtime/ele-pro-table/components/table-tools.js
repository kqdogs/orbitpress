import { defineComponent, computed, markRaw, openBlock, createElementBlock, Fragment, renderList, createBlock, withCtx, createVNode, unref, renderSlot, createCommentVNode } from "vue";
import { ElIcon } from "element-plus";
import { SizeSlackOutlined, SizeMiddleOutlined, SizeCompactOutlined, ReloadOutlined, DownloadOutlined, PrinterOutlined, ColumnHeightOutlined, FullscreenExitOutlined, FullscreenOutlined } from "../../icons/index";
import EleDropdown from "../../ele-dropdown/index";
import { getSizeCacheKey } from "../util";
import EleTool from "../../ele-tool/index";
import ToolColumn from "./tool-column";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "table-tools",
  props: {
    /** 工具按钮布局 */
    tools: {
      type: Array,
      required: true
    },
    /** 表格尺寸 */
    size: String,
    /** 表格列数据 */
    columns: Array,
    /** 是否开启列拖拽排序 */
    columnSortable: Boolean,
    /** 是否开启开关固定列 */
    columnFixed: Boolean,
    /** 是否最大化 */
    maximized: Boolean,
    /** 本地缓存的名称 */
    cacheKey: String,
    /** 国际化 */
    lang: {
      type: Object,
      required: true
    }
  },
  emits: {
    reload: () => true,
    "update:size": (_size) => true,
    "update:columns": (_columns, _tableColumns, _isReset) => true,
    "update:maximized": (_maximized) => true,
    openExportModal: () => true,
    openPrintModal: () => true
  },
  setup(__props, { emit: __emit }) {
    const ownSlots = ["default", "printTop", "printBottom"];
    const props = __props;
    const emit = __emit;
    const placement = computed(() => props.maximized ? "bottom" : "top");
    const sizeDropdownItems = computed(() => {
      return [
        {
          title: props.lang.sizeLarge,
          command: "large",
          icon: markRaw(SizeSlackOutlined)
        },
        {
          title: props.lang.sizeDefault,
          command: "default",
          icon: markRaw(SizeMiddleOutlined)
        },
        {
          title: props.lang.sizeSmall,
          command: "small",
          icon: markRaw(SizeCompactOutlined)
        }
      ];
    });
    const reload = () => {
      emit("reload");
    };
    const updateSize = (size) => {
      if (props.cacheKey) {
        localStorage.setItem(getSizeCacheKey(props.cacheKey), size);
      }
      emit("update:size", size);
    };
    const updateColumns = (columns, tableColumns, isReset) => {
      emit("update:columns", columns, tableColumns, isReset);
    };
    const toggleMaximized = () => {
      emit("update:maximized", !props.maximized);
    };
    const openExportModal = () => {
      emit("openExportModal");
    };
    const openPrintModal = () => {
      emit("openPrintModal");
    };
    return (_ctx, _cache) => {
      return openBlock(true), createElementBlock(Fragment, null, renderList(__props.tools, (tool, index) => {
        return openBlock(), createElementBlock(Fragment, null, [
          tool === "reload" ? (openBlock(), createBlock(EleTool, {
            key: index + "-reload",
            placement: placement.value,
            title: __props.lang.refresh,
            onClick: reload
          }, {
            default: withCtx(() => [
              createVNode(unref(ElIcon), null, {
                default: withCtx(() => [
                  createVNode(unref(ReloadOutlined))
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["placement", "title"])) : tool === "export" ? (openBlock(), createBlock(EleTool, {
            key: index + "-export",
            title: __props.lang.export,
            placement: placement.value,
            clickHideTooltip: true,
            onClick: openExportModal
          }, {
            default: withCtx(() => [
              createVNode(unref(ElIcon), { style: { transform: "scale(1.1)", transformOrigin: "bottom" } }, {
                default: withCtx(() => [
                  createVNode(unref(DownloadOutlined))
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["title", "placement"])) : tool === "print" ? (openBlock(), createBlock(EleTool, {
            key: index + "-print",
            title: __props.lang.print,
            placement: placement.value,
            clickHideTooltip: true,
            onClick: openPrintModal
          }, {
            default: withCtx(() => [
              createVNode(unref(ElIcon), null, {
                default: withCtx(() => [
                  createVNode(unref(PrinterOutlined))
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["title", "placement"])) : tool === "size" ? (openBlock(), createBlock(EleTool, {
            key: index + "-size",
            placement: placement.value,
            title: __props.lang.sizes
          }, {
            default: withCtx(() => [
              createVNode(EleDropdown, {
                trigger: "click",
                placement: "bottom",
                validateEvent: false,
                popperClass: "ele-tool-size-popper",
                modelValue: __props.size,
                items: sizeDropdownItems.value,
                popperOptions: {
                  modifiers: [{ name: "offset", options: { offset: [0, 10] } }]
                },
                onCommand: updateSize
              }, {
                default: withCtx(() => [
                  createVNode(unref(ElIcon), null, {
                    default: withCtx(() => [
                      createVNode(unref(ColumnHeightOutlined))
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["modelValue", "items"])
            ]),
            _: 1
          }, 8, ["placement", "title"])) : tool === "columns" ? (openBlock(), createBlock(ToolColumn, {
            key: index + "-columns",
            placement: placement.value,
            locale: __props.lang,
            columns: __props.columns,
            sortable: __props.columnSortable,
            allowFixed: __props.columnFixed,
            cacheKey: __props.cacheKey,
            "onUpdate:columns": updateColumns
          }, null, 8, ["placement", "locale", "columns", "sortable", "allowFixed", "cacheKey"])) : tool === "maximized" ? (openBlock(), createBlock(EleTool, {
            key: index + "-maximized",
            placement: placement.value,
            title: __props.lang.maximized,
            clickHideTooltip: true,
            onClick: toggleMaximized
          }, {
            default: withCtx(() => [
              createVNode(unref(ElIcon), null, {
                default: withCtx(() => [
                  __props.maximized ? (openBlock(), createBlock(unref(FullscreenExitOutlined), { key: 0 })) : (openBlock(), createBlock(unref(FullscreenOutlined), { key: 1 }))
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["placement", "title"])) : tool && !ownSlots.includes(tool) && _ctx.$slots[tool] ? renderSlot(_ctx.$slots, tool, { key: 6 }) : createCommentVNode("", true)
        ], 64);
      }), 256);
    };
  }
});
export {
  _sfc_main as default
};
