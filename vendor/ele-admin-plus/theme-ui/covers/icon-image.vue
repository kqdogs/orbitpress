<template>
  <div
    class="ele-setting-layout-cover-bg-fill"
    :style="{
      width: '46px',
      height: '34px',
      borderRadius: '4px',
      position: 'relative',
      overflow: 'hidden'
    }"
  >
    <div
      class="ele-setting-layout-cover-bg-fill-dark"
      :style="{
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        position: 'absolute',
        right: '6px',
        top: '6px'
      }"
    ></div>
    <div
      class="ele-setting-layout-cover-bg-fill-dark"
      :style="{
        width: '40px',
        height: '40px',
        borderRadius: '6px',
        transform: 'rotate(45deg)',
        position: 'absolute',
        bottom: '-24px',
        left: '-4px'
      }"
    ></div>
  </div>
</template>
