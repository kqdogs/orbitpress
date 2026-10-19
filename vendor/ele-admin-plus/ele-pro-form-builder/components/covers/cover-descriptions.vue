<template>
  <div
    class="ele-icon-border-color-base"
    :style="{
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      borderLeftStyle: 'solid',
      borderLeftWidth: '1px'
    }"
  >
    <div v-for="i in 3" :key="i" :style="{ display: 'flex' }">
      <div
        v-for="j in 4"
        :key="`${i}-${j}`"
        class="ele-icon-border-color-base"
        :class="{
          'ele-icon-bg-fill': ['1-1', '1-3', '2-1', '2-3', '3-1'].includes(
            `${i}-${j}`
          )
        }"
        :style="{
          flex: 1,
          height: '12px',
          borderRightStyle: ['3-2', '3-3'].includes(`${i}-${j}`)
            ? void 0
            : 'solid',
          borderRightWidth: ['3-2', '3-3'].includes(`${i}-${j}`)
            ? void 0
            : '1px',
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px'
        }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  //
</script>
