<!-- 数据编辑代码模式 -->
<template>
  <div class="ele-pro-form-builder-code-edit-wrapper">
    <component :is="codeEditerComponent || CodeEditer" v-model="codeContent" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import type { UserComponent } from '../../ele-app/types';
  import CodeEditer from './code-editer.vue';

  defineOptions({ name: 'OptionsCode' });

  const props = defineProps<{
    /** 选项数据代码 */
    data?: Array<any> | string;
    /** 默认提示示例代码 */
    codePlaceholder?: string;
    /** 代码字符串前缀 */
    codePrefix: string;
    /** 代码编辑器组件 */
    codeEditerComponent?: UserComponent;
  }>();

  /** 代码内容 */
  const codeContent = ref('');

  /** 获取数据结果 */
  const getResult = (): string | undefined => {
    const code = codeContent.value;
    if (code == null || !code) {
      return;
    }
    return `${props.codePrefix}${code}`;
  };

  /** 解析数据 */
  onMounted(() => {
    if (props.data == null || typeof props.data !== 'string') {
      codeContent.value = props.codePlaceholder ?? '';
      return;
    }
    const data = props.data.trim();
    const codePrefix = props.codePrefix;
    if (data.startsWith(codePrefix)) {
      codeContent.value = data.slice(codePrefix.length);
      return;
    }
    codeContent.value = (data || props.codePlaceholder) ?? '';
  });

  defineExpose({
    getResult
  });
</script>
