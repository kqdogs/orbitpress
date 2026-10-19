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
    <div v-for="i in 4" :key="i" :style="{ display: 'flex' }">
      <div
        v-for="j in 4"
        :key="`${i}-${j}`"
        class="ele-icon-border-color-base"
        :style="{
          flex: 1,
          height: '12px',
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
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
