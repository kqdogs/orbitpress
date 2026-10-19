<!-- 代码编辑器 -->
<template>
  <ElInput
    size="default"
    type="textarea"
    :modelValue="modelValue"
    @update:modelValue="updateModelValue"
    class="ele-pro-form-builder-code-editer"
  />
</template>

<script lang="ts" setup>
  import { ElInput } from 'element-plus';

  defineOptions({ name: 'CodeEditer' });

  defineProps<{
    /** 绑定值 */
    modelValue?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value?: string): void;
  }>();

  /** 更新绑定值 */
  const updateModelValue = (value?: string) => {
    emit('update:modelValue', value);
  };
</script>
