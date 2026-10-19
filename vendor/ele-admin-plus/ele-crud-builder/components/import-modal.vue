<!-- 导入导出弹窗 -->
<template>
  <EleModal
    :width="800"
    :maxable="true"
    position="center"
    title="配置JSON"
    :modelValue="modelValue"
    :closeOnClickModal="false"
    :destroyOnClose="true"
    :bodyStyle="{
      height: '520px',
      minHeight: '100%',
      maxHeight: '100%',
      padding: isImport ? '8px 16px 8px 16px' : '8px 16px 12px 16px'
    }"
    @update:modelValue="handleUpdateModelValue"
  >
    <component :is="jsonEditerComponent || CodeEditer" v-model="jsonContent" />
    <template v-if="isImport" #footer>
      <ElButton size="default" @click="handleCloseModal">取消</ElButton>
      <ElButton type="primary" size="default" @click="handleImport">
        导入
      </ElButton>
    </template>
  </EleModal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { ElButton } from 'element-plus';
  import type { UserComponent } from '../../ele-app/types';
  import type { EleCrudProps } from '../../ele-app/plusx';
  import EleModal from '../../ele-modal/index.vue';
  import { deepCloneObject } from '../../ele-pro-form-builder/components/build-core';
  import CodeEditer from '../../ele-pro-form-builder/components/code-editer.vue';
  import type { CrudField } from '../../ele-crud/types';
  import { itemsGenerateNewKey } from '../util';

  defineOptions({ name: 'ImportModal' });

  const props = defineProps<{
    /** 弹窗是否打开 */
    modelValue?: boolean;
    /** 配置数据 */
    config?: EleCrudProps;
    /** 是否是导入 */
    isImport?: boolean;
    /** JSON 编辑器组件 */
    jsonEditerComponent?: UserComponent;
  }>();

  const emit = defineEmits<{
    /** 更新弹窗打开事件 */
    (e: 'update:modelValue', visible?: boolean): void;
    /** 导入事件 */
    (e: 'importData', data: EleCrudProps): void;
  }>();

  /** JSON 内容 */
  const jsonContent = ref('');

  /** 更新弹窗打开状态 */
  const handleUpdateModelValue = (visible?: boolean) => {
    emit('update:modelValue', visible);
  };

  /** 导入 */
  const handleImportData = (data: EleCrudProps) => {
    emit('importData', data);
  };

  /** 关闭弹窗 */
  const handleCloseModal = () => {
    handleUpdateModelValue(false);
  };

  /** 导入按钮点击事件 */
  const handleImport = () => {
    if (!jsonContent.value) {
      return;
    }
    handleCloseModal();
    try {
      const result: EleCrudProps = JSON.parse(jsonContent.value);
      // 兼容单个导入
      if (result && Array.isArray(result)) {
        const config = deepCloneObject(props.config);
        itemsGenerateNewKey(result as any, config.fields, false);
        if (config.fields) {
          (result as any).forEach((item: CrudField) => {
            (config.fields as any).push(item);
          });
        } else {
          config.fields = result as any;
        }
        handleImportData(config);
        return;
      }
      if (
        result &&
        typeof result === 'object' &&
        (result as any).prop &&
        result.fields == null
      ) {
        const config = deepCloneObject(props.config);
        itemsGenerateNewKey(result as any, config.fields, false);
        if (config.fields) {
          config.fields.push(result as any);
        } else {
          config.fields = [result as any];
        }
        handleImportData(config);
        return;
      }
      if (result) {
        itemsGenerateNewKey(result.fields, [], false);
        handleImportData(result);
      }
    } catch (e) {
      console.error(e);
    }
  };

  /** 监听弹窗打开 */
  watch(
    () => props.modelValue,
    (visible) => {
      if (visible && !props.isImport) {
        jsonContent.value = JSON.stringify(props.config || {}, void 0, 2);
      } else {
        jsonContent.value = '';
      }
    }
  );
</script>
