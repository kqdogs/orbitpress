<!-- 数据编辑弹窗 -->
<template>
  <ElButton
    size="small"
    class="ele-pro-form-builder-props-fluid-btn"
    @click="openModal"
  >
    {{ title }}
  </ElButton>
  <EleModal
    :width="960"
    :maxable="true"
    position="center"
    :title="title"
    v-model="visible"
    :closeOnClickModal="false"
    :destroyOnClose="true"
    :bodyStyle="{
      height: '568px',
      minHeight: '100%',
      maxHeight: '100%',
      padding: '0 16px 8px 16px',
      display: 'flex',
      flexDirection: 'column'
    }"
  >
    <EleTabBar
      v-if="codeOptions"
      v-model="optionsType"
      :items="[
        { value: 'optionsTable', label: '静态数据' },
        { value: 'optionsCode', label: '远程数据' }
      ]"
      type="plain"
      class="ele-pro-form-builder-options-tabs"
    >
      <template #label="{ label, item }">
        <span>{{ label }}</span>
        <ElIcon
          v-if="
            optionsType === 'optionsCode' &&
            item.value === 'optionsCode' &&
            codeTips
          "
          class="ele-pro-form-builder-code-edit-icon"
        >
          <QuestionCircleOutlined />
          <div class="ele-pro-form-builder-code-edit-tip">
            {{ codeTips }}
          </div>
        </ElIcon>
      </template>
    </EleTabBar>
    <OptionsTable
      v-if="!codeOptions || optionsType === 'optionsTable'"
      ref="editerRef"
      :data="modelValue"
      :isTreeData="isTreeData"
      :columns="columns"
    />
    <OptionsCode
      v-else-if="codeOptions"
      ref="editerRef"
      :data="modelValue"
      :codePlaceholder="codePlaceholder"
      :codePrefix="codePrefixStr"
      :codeEditerComponent="codeEditerComponent"
    />
    <template #footer>
      <ElButton size="default" @click="handleCancel">取消</ElButton>
      <ElButton type="primary" size="default" @click="handleSave">
        保存
      </ElButton>
    </template>
  </EleModal>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { ElButton, ElIcon } from 'element-plus';
  import { QuestionCircleOutlined } from '../../icons/index';
  import type { UserComponent } from '../../ele-app/types';
  import type { TreeTableColumn } from '../../ele-tree-table/types';
  import { codeStringPrefix } from '../../ele-pro-form/components/render-core';
  import EleModal from '../../ele-modal/index.vue';
  import EleTabBar from '../../ele-tab-bar/index.vue';
  import OptionsTable from './options-table.vue';
  import OptionsCode from './options-code.vue';

  defineOptions({ name: 'OptionsEdit' });

  const props = defineProps<{
    /** 选项数据 */
    modelValue?: Array<any> | string;
    /** 弹窗标题 */
    title?: string;
    /** 是否是树形结构数据 */
    isTreeData?: boolean | { maxDepth?: number };
    /** 自定义列 */
    columns?: TreeTableColumn[] | 'tableData' | 'tableColumns' | 'stringArray';
    /** 是否支持远程数据 */
    codeOptions?: boolean;
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
    (e: 'update:modelValue', data: Array<any> | string): void;
  }>();

  /** 弹窗是否打开 */
  const visible = ref(false);

  /** 选项卡选中 */
  const optionsType = ref('optionsTable');

  /** 编辑组件 */
  const editerRef = ref<any>(null);

  /** 代码字符串前缀的标识 */
  const codePrefixStr = computed(() => {
    return props.codePrefix ?? codeStringPrefix;
  });

  /** 打开弹窗 */
  const openModal = () => {
    if (
      props.modelValue != null &&
      typeof props.modelValue === 'string' &&
      props.modelValue.startsWith(codePrefixStr.value)
    ) {
      optionsType.value = 'optionsCode';
    } else {
      optionsType.value = 'optionsTable';
    }
    visible.value = true;
  };

  /** 关闭弹窗 */
  const handleCancel = () => {
    visible.value = false;
  };

  /** 保存编辑 */
  const handleSave = () => {
    const result = editerRef.value?.getResult?.();
    emit('update:modelValue', result ?? []);
    visible.value = false;
  };
</script>
