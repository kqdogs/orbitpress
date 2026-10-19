<!-- 代码查看器 -->
<template>
  <div class="ele-pro-form-builder-code-line-numbers">
    <div v-for="n in codeLines" :key="n">{{ n }}</div>
  </div>
  <pre class="ele-pro-form-builder-code-pre">{{ code }}</pre>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';

  defineOptions({ name: 'CodeViewer' });

  const props = defineProps<{
    /** 代码 */
    code?: string;
  }>();

  /** 代码行数 */
  const codeLines = ref(1);

  watch(
    () => props.code,
    (code) => {
      codeLines.value = code ? code.split('\n').length : 1;
    },
    { immediate: true }
  );
</script>
