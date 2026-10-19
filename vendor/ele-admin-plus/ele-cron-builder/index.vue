<!-- Cron 表达式生成器 -->
<template>
  <EleModal
    :width="832"
    :title="title ?? lang.title"
    position="center"
    class="ele-cron-builder"
    v-bind="modalProps || {}"
    :modelValue="modelValue"
    @update:modelValue="updateModelValue"
    @closed="handleClosed"
  >
    <slot></slot>
    <EleCronPanel
      ref="cronPanelRef"
      :modelValue="cronModel"
      @update:modelValue="updateCronModel"
    />
    <template #footer>
      <slot name="footer"></slot>
      <ElButton @click="handleCancel">{{ lang.cancel }}</ElButton>
      <ElButton type="primary" @click="handleConfirm">
        {{ lang.confirm }}
      </ElButton>
    </template>
    <template
      v-for="name in Object.keys($slots).filter((k) =>
        ['default', 'footer'].includes(k)
      )"
      #[name]="slotProps"
    >
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </EleModal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { ElButton } from 'element-plus';
  import type { EleCronPanelInstance } from '../ele-app/plus';
  import { useLocale } from '../ele-config-provider/receiver';
  import EleModal from '../ele-modal/index.vue';
  import EleCronPanel from '../ele-cron-panel/index.vue';
  import { cronBuilderProps, cronBuilderEmits } from './props';

  defineOptions({ name: 'EleCronBuilder' });

  const props = defineProps(cronBuilderProps);

  const emit = defineEmits(cronBuilderEmits);

  const { lang } = useLocale('cronBuilder', props);

  /** 表达式面板组件 */
  const cronPanelRef = ref<EleCronPanelInstance>(null);

  /** 表达式 */
  const cronModel = ref<string | undefined>('');

  /** 更新弹窗显示状态 */
  const updateModelValue = (value?: boolean) => {
    emit('update:modelValue', value);
  };

  /** 更新绑定值 */
  const updateCronModel = (value?: string) => {
    if (cronModel.value !== value) {
      cronModel.value = value;
      if (props.cron !== cronModel.value) {
        emit('update:cron', cronModel.value);
      }
    }
  };

  /** 关闭常用列表 */
  const hideCronList = () => {
    cronPanelRef.value?.hideCronList?.();
  };

  /** 取消按钮点击事件 */
  const handleCancel = () => {
    hideCronList();
    updateModelValue(false);
  };

  /** 确定按钮点击事件 */
  const handleConfirm = () => {
    hideCronList();
    emit('done', cronModel.value);
  };

  /** 弹窗关闭事件 */
  const handleClosed = () => {
    hideCronList();
  };

  /** 同步表达式值 */
  watch(
    () => props.cron,
    (value) => {
      updateCronModel(value);
    },
    { immediate: true }
  );
</script>
