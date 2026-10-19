import { defineComponent, computed, h } from "vue";
import { useSvgOption } from "../../ele-qr-code-svg/util";
// 与源码同步：只渲染内容，不创建品牌水印或 Teleport。
export default defineComponent({
  name: "MainContent",
  props: { wrapHeight: [String, Number] },
  setup(props, { slots }) {
    const contentHeight = computed(() => typeof props.wrapHeight === "number" ? `${props.wrapHeight}px` : props.wrapHeight);
    const { svgProps } = useSvgOption();
    return () => h("div", { style: { height: contentHeight.value } }, slots.default?.(svgProps));
  }
});
