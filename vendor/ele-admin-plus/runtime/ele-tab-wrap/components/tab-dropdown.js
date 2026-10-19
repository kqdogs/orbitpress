import { defineComponent, ref, openBlock, createBlock, withCtx, createVNode, mergeProps, createElementVNode, renderSlot, unref } from "vue";
import { ElIcon } from "element-plus";
import { ArrowDown } from "../../icons/index";
import { useTimer } from "../../utils/hook";
import EleDropdown from "../../ele-dropdown/index";
import EleTabTool from "../../ele-tab-tool/index";
const _hoisted_1 = { style: { textAlign: "center", outline: "none" } };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "TabDropdown" },
  __name: "tab-dropdown",
  props: {
    /** 右键菜单 */
    items: Array,
    /** 右键菜单属性 */
    dropdownProps: Object,
    /** 是否点击后自动关闭菜单 */
    autoClose: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    menuClick: (_command) => true
  },
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const [startAutoCloseTimer] = useTimer(150);
    const dropdownRef = ref(null);
    const handleCommand = (command) => {
      emit("menuClick", command);
      if (props.autoClose) {
        startAutoCloseTimer(() => {
          if (dropdownRef.value) {
            dropdownRef.value.handleClose();
          }
        });
      }
    };
    __expose({
      dropdownRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleTabTool, null, {
        default: withCtx(() => [
          createVNode(EleDropdown, mergeProps({
            placement: "bottom-end",
            popperClass: "ele-tab-popup",
            popperOptions: {
              modifiers: [{ name: "offset", options: { offset: [12, 8] } }]
            },
            validateEvent: false
          }, __props.dropdownProps || {}, {
            ref_key: "dropdownRef",
            ref: dropdownRef,
            items: __props.items,
            componentType: "pro",
            onCommand: handleCommand
          }), {
            default: withCtx(() => [
              createElementVNode("div", _hoisted_1, [
                renderSlot(_ctx.$slots, "icon", {}, () => [
                  createVNode(unref(ElIcon), {
                    class: "ele-tab-icon",
                    style: { verticalAlign: "-3px" }
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(ArrowDown))
                    ]),
                    _: 1
                  })
                ])
              ])
            ]),
            _: 3
          }, 16, ["items"])
        ]),
        _: 3
      });
    };
  }
});
export {
  _sfc_main as default
};
