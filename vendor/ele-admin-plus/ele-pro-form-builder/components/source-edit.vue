<!-- 源码编辑弹窗 -->
<template>
  <ElButton
    size="small"
    :icon="CodeOutlined"
    class="ele-pro-form-builder-props-fluid-btn"
    @click="openModal"
  >
    {{ title }}
  </ElButton>
  <EleModal
    :width="800"
    :maxable="true"
    position="center"
    :title="title"
    v-model="visible"
    :closeOnClickModal="false"
    :destroyOnClose="true"
    :bodyStyle="{
      height: '520px',
      minHeight: '100%',
      maxHeight: '100%',
      padding: '8px 16px'
    }"
  >
    <div class="ele-pro-form-builder-code-edit-wrapper">
      <component
        :is="jsonEditerComponent || CodeEditer"
        v-model="jsonContent"
      />
    </div>
    <template #footer>
      <ElButton size="default" @click="handleCancel">取消</ElButton>
      <ElButton type="primary" size="default" @click="handleSave">
        保存
      </ElButton>
    </template>
  </EleModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { ElButton } from 'element-plus';
  import { CodeOutlined } from '../../icons/index';
  import { omit } from '../../utils/common';
  import type { UserComponent } from '../../ele-app/types';
  import EleModal from '../../ele-modal/index.vue';
  import CodeEditer from './code-editer.vue';

  defineOptions({ name: 'SourceEdit' });

  const props = defineProps<{
    /** 数据 */
    modelValue?: Record<string, any>;
    /** 弹窗标题 */
    title?: string;
    /** 需要排除编辑的字段 */
    excludeFields?: string[];
    /** JSON 编辑器组件 */
    jsonEditerComponent?: UserComponent;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', data?: Record<string, any>): void;
  }>();

  /** 弹窗是否打开 */
  const visible = ref(false);

  /** JSON 内容 */
  const jsonContent = ref('');

  /** 打开弹窗 */
  const openModal = () => {
    jsonContent.value = JSON.stringify(
      omit(props.modelValue || {}, props.excludeFields || ['key', 'children']),
      void 0,
      2
    );
    visible.value = true;
  };

  /** 关闭弹窗 */
  const handleCancel = () => {
    visible.value = false;
    jsonContent.value = '';
  };

  /** 保存编辑 */
  const handleSave = () => {
    if (jsonContent.value) {
      let result: Record<string, any> | undefined;
      try {
        result = JSON.parse(jsonContent.value);
      } catch (e) {
        console.error(e);
      }
      if (result) {
        handleCancel();
        emit('update:modelValue', result);
      }
    }
  };
</script>
