<template>
  <svg viewBox="0 0 48 48" fill="currentColor">
    <rect
      v-for="item in bars"
      :key="item.x"
      :x="item.x"
      y="19"
      width="4"
      height="10"
      rx="2"
    >
      <animate
        attributeName="height"
        values="16;10;14;10;16;20;10;16;10;30;10"
        :dur="item.dur"
        repeatCount="indefinite"
      />
      <animate
        attributeName="y"
        values="16;19;17;19;16;14;19;16;19;9;19"
        :dur="item.dur"
        repeatCount="indefinite"
      />
    </rect>
  </svg>
</template>

<script lang="ts" setup>
  defineOptions({ name: 'VoiceAnimOutlined' });

  const bars = [
    { x: 4, dur: '1.8s' },
    { x: 13, dur: '1.4s' },
    { x: 22, dur: '0.8s' },
    { x: 31, dur: '2.2s' },
    { x: 40, dur: '1.2s' }
  ];
</script>
