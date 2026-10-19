import { defineComponent, computed, openBlock, createElementBlock, Fragment, createBlock, unref, withCtx, resolveDynamicComponent, createCommentVNode } from "vue";
import { ElIcon } from "element-plus";
const _hoisted_1 = ["src"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "file-icon",
  props: {
    /** 文件名称 */
    fileName: String,
    /** 是否是目录 */
    isDirectory: Boolean,
    /** 后缀对应的图标 */
    icons: Array
  },
  setup(__props) {
    const props = __props;
    const icon = computed(() => {
      const { icons, fileName, isDirectory } = props;
      if (!icons) {
        return;
      }
      if (isDirectory) {
        return icons.find((d) => d.type === "dir")?.icon;
      }
      if (fileName) {
        const icon2 = icons.find(
          (d) => d.suffixes && d.suffixes.some((t) => fileName.endsWith(t))
        )?.icon;
        if (icon2) {
          return icon2;
        }
      }
      return icons.find((d) => d.type === "file")?.icon;
    });
    return (_ctx, _cache) => {
      return icon.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
        typeof icon.value === "string" ? (openBlock(), createElementBlock("img", {
          key: 0,
          src: icon.value
        }, null, 8, _hoisted_1)) : (openBlock(), createBlock(unref(ElIcon), { key: 1 }, {
          default: withCtx(() => [
            (openBlock(), createBlock(resolveDynamicComponent(icon.value)))
          ]),
          _: 1
        }))
      ], 64)) : createCommentVNode("", true);
    };
  }
});
export {
  _sfc_main as default
};
