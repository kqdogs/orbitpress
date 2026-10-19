<!-- 富文本编辑弹窗 -->
<template>
  <ElButton
    size="small"
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
        :is="htmlEditerComponent || CodeEditer"
        v-model="htmlContent"
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
  import type { UserComponent } from '../../ele-app/types';
  import EleModal from '../../ele-modal/index.vue';
  import CodeEditer from './code-editer.vue';

  defineOptions({ name: 'HtmlEdit' });

  const props = defineProps<{
    /** 数据 */
    modelValue?: string;
    /** 弹窗标题 */
    title?: string;
    /** 富文本编辑器组件 */
    htmlEditerComponent?: UserComponent;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', data?: string): void;
  }>();

  /** 弹窗是否打开 */
  const visible = ref(false);

  /** 内容 */
  const htmlContent = ref('');

  /** 打开弹窗 */
  const openModal = () => {
    htmlContent.value = props.modelValue ?? '';
    visible.value = true;
  };

  /** 关闭弹窗 */
  const handleCancel = () => {
    visible.value = false;
    htmlContent.value = '';
  };

  /** 保存编辑 */
  const handleSave = () => {
    const result = htmlContent.value;
    handleCancel();
    emit('update:modelValue', result === '' ? void 0 : result);
  };
</script>
