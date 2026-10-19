<!-- 事件编辑弹窗 -->
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
    <template #header>
      <div class="ele-pro-form-builder-code-edit-header">
        <div>{{ title }}</div>
        <ElIcon
          v-if="codeTips"
          class="ele-pro-form-builder-code-edit-icon"
          @mousedown.stop=""
          @touchstart.stop.passive=""
        >
          <QuestionCircleOutlined />
          <div class="ele-pro-form-builder-code-edit-tip">
            {{ codeTips }}
          </div>
        </ElIcon>
      </div>
    </template>
    <div class="ele-pro-form-builder-code-edit-wrapper">
      <component
        :is="codeEditerComponent || CodeEditer"
        v-model="codeContent"
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
  import { ElButton, ElIcon } from 'element-plus';
  import { QuestionCircleOutlined } from '../../icons/index';
  import type { UserComponent } from '../../ele-app/types';
  import { codeStringPrefix } from '../../ele-pro-form/components/render-core';
  import EleModal from '../../ele-modal/index.vue';
  import CodeEditer from './code-editer.vue';

  defineOptions({ name: 'EventEdit' });

  const props = defineProps<{
    /** 数据 */
    modelValue?: string;
    /** 弹窗标题 */
    title?: string;
    /** 顶部提示内容 */
    codeTips?: string;
    /** 默认提示示例代码 */
    codePlaceholder?: string;
    /** 代码字符串前缀 */
    codePrefix?: string;
    /** 代码编辑器组件 */
    codeEditerComponent?: UserComponent;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', data?: string): void;
  }>();

  /** 弹窗是否打开 */
  const visible = ref(false);

  /** 内容 */
  const codeContent = ref('');

  /** 获取代码字符串前缀 */
  const getCodePrefix = (): string => {
    return props.codePrefix ?? codeStringPrefix;
  };

  /** 获取数据结果 */
  const getResult = (): string | undefined => {
    const code = codeContent.value;
    if (code == null || !code) {
      return;
    }
    return `${getCodePrefix()}${code}`;
  };

  /** 打开弹窗 */
  const openModal = () => {
    const codePrefix = getCodePrefix();
    if (props.modelValue == null || typeof props.modelValue !== 'string') {
      codeContent.value = props.codePlaceholder ?? '';
    } else if (props.modelValue.trim().startsWith(codePrefix)) {
      codeContent.value = props.modelValue.trim().slice(codePrefix.length);
    } else {
      codeContent.value = (props.modelValue || props.codePlaceholder) ?? '';
    }
    visible.value = true;
  };

  /** 关闭弹窗 */
  const handleCancel = () => {
    visible.value = false;
    codeContent.value = '';
  };

  /** 保存编辑 */
  const handleSave = () => {
    const result = getResult();
    handleCancel();
    emit('update:modelValue', result);
  };
</script>
