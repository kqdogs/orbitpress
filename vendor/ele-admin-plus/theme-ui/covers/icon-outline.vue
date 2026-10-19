<template>
  <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`">
    <defs>
      <linearGradient
        :id="`outline-gradient-${svgId}`"
        x1="0%"
        y1="100%"
        x2="100%"
        y2="0%"
      >
        <stop offset="0%" stop-color="#00c3ff" />
        <stop offset="33.3%" stop-color="#ab00ff" />
        <stop offset="50%" stop-color="#ffba00" />
        <stop offset="81%" stop-color="#4ceb1b" />
        <stop offset="100%" stop-color="#00c3ff" />
      </linearGradient>
    </defs>
    <rect
      x="0.5"
      y="0.5"
      :width="width - 1"
      :height="height - 1"
      rx="6"
      ry="6"
      fill="none"
      :stroke="`url(#outline-gradient-${svgId})`"
      stroke-width="1"
    />
  </svg>
</template>

<script lang="ts" setup>
  import { useId } from 'vue';

  defineProps({
    width: {
      type: Number,
      default: 26
    },
    height: {
      type: Number,
      default: 26
    }
  });

  const svgId = useId();
</script>
