const proTemplate = `<template>
  <pro-crud v-bind="config" />
</template>

<script setup>
  import { reactive } from 'vue';
  import ProCrud from '@/components/ProCrud/index.vue';

  /** crud 配置 */
  const config = reactive(<% d.proCrudConfigCode %>);
<\/script>
`;
export {
  proTemplate
};
