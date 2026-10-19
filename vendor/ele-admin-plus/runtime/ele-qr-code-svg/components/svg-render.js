import { defineComponent, useId, computed, openBlock, createElementBlock, normalizeStyle, createElementVNode, unref, createCommentVNode, Fragment, renderList, toDisplayString } from "vue";
import { joinStyle } from "../../utils/common";
import { MARK_SIZE } from "../util";
const _hoisted_1 = ["id", "width", "height"];
const _hoisted_2 = ["transform"];
const _hoisted_3 = ["href", "width", "height", "x", "y"];
const _hoisted_4 = ["transform"];
const _hoisted_5 = ["href", "width", "height", "x", "y"];
const _hoisted_6 = ["id", "width", "height"];
const _hoisted_7 = ["transform"];
const _hoisted_8 = ["x", "y", "fill", "font-size", "font-weight", "font-family", "font-style"];
const _hoisted_9 = ["transform"];
const _hoisted_10 = ["x", "y", "fill", "font-size", "font-weight", "font-family", "font-style"];
const _hoisted_11 = ["fill", "transform"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "MarkSvg" },
  __name: "svg-render",
  props: {
    /** 宽度 */
    width: {
      type: Number,
      default: 236
    },
    /** 高度 */
    height: {
      type: Number,
      default: 74
    },
    /** 旋转角度 */
    rotate: {
      type: Number,
      default: -22
    },
    /** 水平间距 */
    gapX: {
      type: Number,
      default: 100
    },
    /** 垂直间距 */
    gapY: {
      type: Number,
      default: 100
    },
    /** 多行文字的行间距 */
    lineGap: {
      type: Number,
      default: 3
    },
    /** 文字样式 */
    font: {
      type: Object,
      required: true
    },
    /** 文字内容 */
    contents: {
      type: Array,
      required: true
    },
    /** 图片源 */
    image: String,
    /** 水平偏移量 */
    offsetX: {
      type: Number,
      default: 50
    },
    /** 垂直偏移量 */
    offsetY: {
      type: Number,
      default: 50
    },
    /** 公共样式 */
    commonStyle: Object
  },
  setup(__props) {
    const props = __props;
    const svgId = useId();
    const svgStyle = computed(() => joinStyle(props.commonStyle));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", {
        style: normalizeStyle(svgStyle.value)
      }, [
        createElementVNode("defs", null, [
          __props.image ? (openBlock(), createElementBlock("pattern", {
            key: 0,
            id: `imgPattern-${unref(svgId)}`,
            patternUnits: "userSpaceOnUse",
            width: (__props.width + __props.gapX) * unref(MARK_SIZE),
            height: (__props.height + __props.gapY) * unref(MARK_SIZE)
          }, [
            createElementVNode("g", {
              transform: `rotate(${__props.rotate}, ${(__props.width + __props.gapX) / 2}, ${(__props.height + __props.gapY) / 2})`
            }, [
              createElementVNode("image", {
                href: __props.image,
                width: __props.width,
                height: __props.height,
                x: __props.gapX / 2,
                y: __props.gapY / 2
              }, null, 8, _hoisted_3)
            ], 8, _hoisted_2),
            unref(MARK_SIZE) > 1 ? (openBlock(), createElementBlock("g", {
              key: 0,
              transform: `rotate(${__props.rotate}, ${(__props.width + __props.gapX) / 2 + __props.width + __props.gapX}, ${(__props.height + __props.gapY) / 2 + __props.height + __props.gapY})`
            }, [
              createElementVNode("image", {
                href: __props.image,
                width: __props.width,
                height: __props.height,
                x: __props.gapX / 2 + __props.width + __props.gapX,
                y: __props.gapY / 2 + __props.height + __props.gapY
              }, null, 8, _hoisted_5)
            ], 8, _hoisted_4)) : createCommentVNode("", true)
          ], 8, _hoisted_1)) : (openBlock(), createElementBlock("pattern", {
            key: 1,
            id: `textPattern-${unref(svgId)}`,
            patternUnits: "userSpaceOnUse",
            width: (__props.width + __props.gapX) * unref(MARK_SIZE),
            height: (__props.height + __props.gapY) * unref(MARK_SIZE)
          }, [
            createElementVNode("g", {
              transform: `rotate(${__props.rotate}, ${(__props.width + __props.gapX) / 2}, ${(__props.height + __props.gapY) / 2})`
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(__props.contents, (text, index) => {
                return openBlock(), createElementBlock("text", {
                  key: index,
                  x: (__props.width + __props.gapX) / 2,
                  y: __props.gapY / 2 + index * (__props.font.fontSize + __props.lineGap),
                  fill: __props.font.color,
                  "font-size": __props.font.fontSize,
                  "font-weight": __props.font.fontWeight,
                  "font-family": __props.font.fontFamily,
                  "font-style": __props.font.fontStyle,
                  "text-anchor": "middle",
                  "alignment-baseline": "hanging",
                  "vector-effect": "non-scaling-stroke"
                }, toDisplayString(text), 9, _hoisted_8);
              }), 128))
            ], 8, _hoisted_7),
            unref(MARK_SIZE) > 1 ? (openBlock(), createElementBlock("g", {
              key: 0,
              transform: `rotate(${__props.rotate}, ${(__props.width + __props.gapX) / 2 + __props.width + __props.gapX}, ${(__props.height + __props.gapY) / 2 + __props.height + __props.gapY})`
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(__props.contents, (text, index) => {
                return openBlock(), createElementBlock("text", {
                  key: index,
                  x: (__props.width + __props.gapX) / 2 + __props.width + __props.gapX,
                  y: __props.gapY / 2 + index * (__props.font.fontSize + __props.lineGap) + __props.height + __props.gapY,
                  fill: __props.font.color,
                  "font-size": __props.font.fontSize,
                  "font-weight": __props.font.fontWeight,
                  "font-family": __props.font.fontFamily,
                  "font-style": __props.font.fontStyle,
                  "text-anchor": "middle",
                  "alignment-baseline": "hanging",
                  "vector-effect": "non-scaling-stroke"
                }, toDisplayString(text), 9, _hoisted_10);
              }), 128))
            ], 8, _hoisted_9)) : createCommentVNode("", true)
          ], 8, _hoisted_6))
        ]),
        createElementVNode("rect", {
          width: "100%",
          height: "100%",
          fill: `url(#${__props.image ? "img" : "text"}Pattern-${unref(svgId)})`,
          transform: `translate(${__props.offsetX - __props.gapX / 2}, ${__props.offsetY - __props.gapY / 2})`
        }, null, 8, _hoisted_11)
      ], 4);
    };
  }
});
export {
  _sfc_main as default
};
