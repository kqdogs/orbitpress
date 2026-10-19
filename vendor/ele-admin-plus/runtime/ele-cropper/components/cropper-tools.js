import { defineComponent, ref, shallowRef, watch, markRaw, openBlock, createElementBlock, Fragment, renderList, createBlock, unref, withCtx, createVNode, normalizeClass, createTextVNode, toDisplayString, createCommentVNode, mergeProps } from "vue";
import { ElButtonGroup, ElUpload, ElButton } from "element-plus";
import { CheckOutlined, UploadOutlined, SyncOutlined, SortOutlined, SwapOutlined, ReloadOutlined, UndoOutlined, ArrowDownOutlined, ArrowUpOutlined, ArrowRightOutlined, ArrowLeftOutlined, ZoomOutOutlined, ZoomInOutlined } from "../../icons/index";
import { useTimer } from "../../utils/hook";
import { useLocale } from "../../ele-config-provider/receiver";
import EleTooltip from "../../ele-tooltip/index";
const _hoisted_1 = { class: "ele-cropper-tools" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cropper-tools",
  props: {
    /** 操作按钮布局 */
    tools: String,
    /** 允许上传的图片类型 */
    accept: String,
    /** 是否需要提示组件 */
    tooltip: Boolean,
    /** 提示组件属性 */
    tooltipProps: Object,
    /** 上传按钮点击前的钩子 */
    beforeUploadClick: Function,
    /** 国际化 */
    locale: Object
  },
  emits: {
    action: (_action) => true,
    upload: (_option) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const TOOL_ICONS = {
      zoomIn: ZoomInOutlined,
      zoomOut: ZoomOutOutlined,
      moveLeft: ArrowLeftOutlined,
      moveRight: ArrowRightOutlined,
      moveUp: ArrowUpOutlined,
      moveDown: ArrowDownOutlined,
      rotateLeft: UndoOutlined,
      rotateRight: ReloadOutlined,
      flipX: SwapOutlined,
      flipY: SortOutlined,
      reset: SyncOutlined,
      upload: UploadOutlined,
      ok: CheckOutlined
    };
    const { lang } = useLocale("cropper", props);
    const [startHideTipTimer, stopHideTipTimer] = useTimer(200);
    const tooltipRef = ref(null);
    const groups = shallowRef([]);
    const tooltipContent = ref("");
    const virtualRef = ref();
    const emitUpload = (data, type) => {
      emit("upload", { data, type });
    };
    const handleUpload = (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result;
        if (url != null) {
          emitUpload(url, file.type);
        }
      };
      reader.readAsDataURL(file);
      return false;
    };
    const hideTooltip = () => {
      tooltipRef.value && tooltipRef.value.hide();
    };
    const handleItemHover = (item, e) => {
      const title = lang.value[item.name];
      if (props.tooltip && item.name !== "ok" && title) {
        stopHideTipTimer();
        virtualRef.value = e.currentTarget;
        tooltipContent.value = title;
      }
    };
    const handleClick = (name) => {
      startHideTipTimer(() => {
        hideTooltip();
      });
      emit("action", name);
    };
    const handleUploadButtonClick = (e) => {
      startHideTipTimer(() => {
        hideTooltip();
      });
      if (props.beforeUploadClick && props.beforeUploadClick(e, emitUpload) === false) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    watch(
      () => props.tools,
      (tools) => {
        if (!tools) {
          groups.value = [];
          return;
        }
        const names = Object.keys(TOOL_ICONS);
        groups.value = tools.split("|").filter((g) => !!g.trim()).map((g, i) => {
          const items = g.split(",").filter((t) => {
            const name = t.trim();
            return name && names.includes(name);
          }).map((t, j) => {
            const name = t.trim();
            return {
              key: `${i}-${j}-${name}`,
              name,
              icon: markRaw(TOOL_ICONS[name]),
              className: `ele-cropper-${name}`
            };
          });
          return { key: i + g, items };
        });
      },
      { immediate: true }
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(groups.value, (group) => {
          return openBlock(), createBlock(unref(ElButtonGroup), {
            key: group.key,
            class: "ele-cropper-tool-item"
          }, {
            default: withCtx(() => [
              (openBlock(true), createElementBlock(Fragment, null, renderList(group.items, (item) => {
                return openBlock(), createElementBlock(Fragment, {
                  key: item.key
                }, [
                  item.name === "upload" ? (openBlock(), createBlock(unref(ElUpload), {
                    key: 0,
                    action: "",
                    accept: __props.accept,
                    showFileList: false,
                    beforeUpload: handleUpload,
                    class: "ele-cropper-tool-upload"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(ElButton), {
                        type: "primary",
                        icon: item.icon,
                        class: normalizeClass(["ele-cropper-tool", item.className]),
                        onMouseover: (e) => handleItemHover(item, e),
                        onClick: handleUploadButtonClick
                      }, null, 8, ["icon", "class", "onMouseover"])
                    ]),
                    _: 2
                  }, 1032, ["accept"])) : (openBlock(), createBlock(unref(ElButton), {
                    key: 1,
                    type: "primary",
                    icon: item.icon,
                    class: normalizeClass(["ele-cropper-tool", item.className]),
                    onMouseover: (e) => handleItemHover(item, e),
                    onClick: ($event) => handleClick(item.name)
                  }, {
                    default: withCtx(() => [
                      item.name === "ok" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                        createTextVNode(toDisplayString(unref(lang).ok), 1)
                      ], 64)) : createCommentVNode("", true)
                    ]),
                    _: 2
                  }, 1032, ["icon", "class", "onMouseover", "onClick"]))
                ], 64);
              }), 128))
            ]),
            _: 2
          }, 1024);
        }), 128)),
        createVNode(EleTooltip, mergeProps({
          placement: "top",
          offset: 6
        }, __props.tooltipProps || {}, {
          content: tooltipContent.value,
          virtualRef: virtualRef.value,
          virtualTriggering: true,
          ref_key: "tooltipRef",
          ref: tooltipRef
        }), null, 16, ["content", "virtualRef"])
      ]);
    };
  }
});
export {
  _sfc_main as default
};
