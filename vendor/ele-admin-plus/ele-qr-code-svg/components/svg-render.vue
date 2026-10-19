<template>
  <svg :style="svgStyle">
    <defs>
      <pattern
        v-if="image"
        :id="`imgPattern-${svgId}`"
        patternUnits="userSpaceOnUse"
        :width="(width + gapX) * MARK_SIZE"
        :height="(height + gapY) * MARK_SIZE"
      >
        <g
          :transform="`rotate(${rotate}, ${(width + gapX) / 2}, ${(height + gapY) / 2})`"
        >
          <image
            :href="image"
            :width="width"
            :height="height"
            :x="gapX / 2"
            :y="gapY / 2"
          />
        </g>
        <g
          v-if="MARK_SIZE > 1"
          :transform="`rotate(${rotate}, ${(width + gapX) / 2 + width + gapX}, ${(height + gapY) / 2 + height + gapY})`"
        >
          <image
            :href="image"
            :width="width"
            :height="height"
            :x="gapX / 2 + width + gapX"
            :y="gapY / 2 + height + gapY"
          />
        </g>
      </pattern>
      <pattern
        v-else
        :id="`textPattern-${svgId}`"
        patternUnits="userSpaceOnUse"
        :width="(width + gapX) * MARK_SIZE"
        :height="(height + gapY) * MARK_SIZE"
      >
        <g
          :transform="`rotate(${rotate}, ${(width + gapX) / 2}, ${(height + gapY) / 2})`"
        >
          <text
            v-for="(text, index) in contents"
            :key="index"
            :x="(width + gapX) / 2"
            :y="gapY / 2 + index * (font.fontSize + lineGap)"
            :fill="font.color"
            :font-size="font.fontSize"
            :font-weight="font.fontWeight"
            :font-family="font.fontFamily"
            :font-style="font.fontStyle"
            text-anchor="middle"
            alignment-baseline="hanging"
            vector-effect="non-scaling-stroke"
          >
            {{ text }}
          </text>
        </g>
        <g
          v-if="MARK_SIZE > 1"
          :transform="`rotate(${rotate}, ${(width + gapX) / 2 + width + gapX}, ${(height + gapY) / 2 + height + gapY})`"
        >
          <text
            v-for="(text, index) in contents"
            :key="index"
            :x="(width + gapX) / 2 + width + gapX"
            :y="gapY / 2 + index * (font.fontSize + lineGap) + height + gapY"
            :fill="font.color"
            :font-size="font.fontSize"
            :font-weight="font.fontWeight"
            :font-family="font.fontFamily"
            :font-style="font.fontStyle"
            text-anchor="middle"
            alignment-baseline="hanging"
            vector-effect="non-scaling-stroke"
          >
            {{ text }}
          </text>
        </g>
      </pattern>
    </defs>
    <rect
      width="100%"
      height="100%"
      :fill="`url(#${image ? 'img' : 'text'}Pattern-${svgId})`"
      :transform="`translate(${offsetX - gapX / 2}, ${offsetY - gapY / 2})`"
    />
  </svg>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { useId, computed } from 'vue';
  import { joinStyle } from '../../utils/common';
  import type { StyleValue } from '../../ele-app/types';
  import type { WatermarkFont } from '../../ele-watermark/types';
  import { MARK_SIZE } from '../util';

  defineOptions({ name: 'MarkSvg' });

  const props = defineProps({
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
      type: Object as PropType<Required<WatermarkFont>>,
      required: true
    },
    /** 文字内容 */
    contents: {
      type: Array as PropType<string[]>,
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
    commonStyle: Object as PropType<StyleValue>
  });

  /** svg模式生成唯一id */
  const svgId = useId();

  /** 容器样式 */
  const svgStyle = computed<string>(() => joinStyle(props.commonStyle));
</script>
