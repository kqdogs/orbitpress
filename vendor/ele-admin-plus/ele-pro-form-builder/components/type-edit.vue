<!-- 表单项组件类型修改 -->
<template>
  <ElButton
    size="small"
    class="ele-pro-form-builder-props-fluid-btn is-small-icon ele-pro-form-builder-type-select-btn"
    @click="handleClick"
  >
    <ComponentName :itemType="formItem?.type" :componentData="componentData" />
    <ElIcon>
      <ArrowDown />
    </ElIcon>
  </ElButton>
</template>

<script lang="ts" setup>
  import { ElIcon, ElButton } from 'element-plus';
  import { ArrowDown } from '../../icons/index';
  import type { ProFormItemProps } from '../../ele-pro-form/types';
  import type { ComponentGroup } from '../types';
  import ComponentName from './component-name.vue';

  defineOptions({ name: 'TypeEdit' });

  const props = defineProps<{
    /** 表单项数据 */
    formItem?: ProFormItemProps;
    /** 组件库数据 */
    componentData?: ComponentGroup[];
  }>();

  const emit = defineEmits<{
    (e: 'openComponentPicker', item: ProFormItemProps): void;
  }>();

  /** 点击事件 */
  const handleClick = () => {
    if (props.formItem) {
      emit('openComponentPicker', props.formItem);
    }
  };
</script>
