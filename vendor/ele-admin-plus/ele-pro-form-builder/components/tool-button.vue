<!-- 操作按钮 -->
<template>
  <ElButton
    v-bind="buttonProps || {}"
    :title="tooltip"
    class="ele-pro-form-builder-tool-button"
    @click="handleClick"
  >
    <template v-if="$slots.default" #default>
      <slot></slot>
    </template>
  </ElButton>
</template>

<script lang="ts" setup>
  import { ElButton } from 'element-plus';
  import type { ElButtonProps } from '../../ele-app/el';

  defineOptions({ name: 'ToolButton' });

  defineProps<{
    /** 按钮属性 */
    buttonProps?: ElButtonProps;
    /** 提示信息 */
    tooltip?: string;
  }>();

  const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void;
  }>();

  /** 点击事件 */
  const handleClick = (e: MouseEvent) => {
    emit('click', e);
  };
</script>
