<!-- 自定义异步弹窗组件时加载提示 -->
<template>
  <Teleport to="body">
    <LoadingSpinner
      :plain="true"
      :loading="true"
      class="ele-modal-render-loading"
    />
  </Teleport>
</template>

<script lang="ts" setup>
  import LoadingSpinner from '../../ele-loading/components/loading-spinner.vue';

  defineOptions({ name: 'ModalLoading', inheritAttrs: false });
</script>
