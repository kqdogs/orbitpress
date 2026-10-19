<!-- 生成代码弹窗 -->
<template>
  <EleModal
    :width="980"
    :maxable="true"
    position="center"
    title="生成代码"
    :modelValue="modelValue"
    :closeOnClickModal="false"
    :destroyOnClose="true"
    class="ele-pro-form-builder-code-preview"
    @update:modelValue="handleUpdateModelValue"
  >
    <div class="ele-pro-form-builder-code-view">
      <EleTabBar v-model="tabActive" :items="tabItems">
        <template #extra>
          <ElIcon
            class="ele-pro-form-builder-code-icon-tool"
            :class="{ 'is-copied': copied }"
            title="复制"
            @click="handleCopy"
          >
            <CheckOutlined v-if="copied" />
            <CopyOutlined v-else />
          </ElIcon>
          <ElIcon
            class="ele-pro-form-builder-code-icon-tool"
            title="下载"
            @click="handleDownload"
          >
            <DownloadOutlined />
          </ElIcon>
        </template>
      </EleTabBar>
      <div class="ele-pro-form-builder-code-body">
        <component
          :is="codeViewerComponent || CodeViewer"
          :code="codeContent"
        />
      </div>
    </div>
  </EleModal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { ElIcon } from 'element-plus';
  import {
    DownloadOutlined,
    CopyOutlined,
    CheckOutlined
  } from '../../icons/index';
  import { download, copyText } from '../../utils/common';
  import { useTimer } from '../../utils/hook';
  import type { UserComponent } from '../../ele-app/types';
  import type { EleProFormProps } from '../../ele-app/plusx';
  import EleModal from '../../ele-modal/index.vue';
  import EleTabBar from '../../ele-tab-bar/index.vue';
  import type { ComponentGroup } from '../types';
  import { generateProFormCode, generateElFormCode } from './code-generator';
  import CodeViewer from './code-viewer.vue';

  defineOptions({ name: 'CodePreview' });

  const props = defineProps<{
    /** 弹窗是否打开 */
    modelValue?: boolean;
    /** 表单配置数据 */
    config?: EleProFormProps;
    /** 组件库数据 */
    componentData?: ComponentGroup[];
    /** 代码查看器组件 */
    codeViewerComponent?: UserComponent;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', visible?: boolean): void;
  }>();

  /** 复制状态 */
  const [setCopied, resetCopied, copied] = useTimer(1000);

  /** 选项卡数据 */
  const tabItems = [
    { value: 'ProForm', label: 'ProForm' },
    { value: 'ElForm', label: 'ElForm' }
  ];

  /** 选项卡选中 */
  const tabActive = ref<'ProForm' | 'ElForm'>('ProForm');

  /** 代码内容 */
  const codeContent = ref('');

  /** 代码生成的数据 */
  const generateData: string[] = ['', ''];

  /** 更新弹窗打开状态 */
  const handleUpdateModelValue = (visible?: boolean) => {
    emit('update:modelValue', visible);
  };

  /** 更新代码内容 */
  const setCodeContent = () => {
    codeContent.value = generateData[tabActive.value === 'ElForm' ? 1 : 0];
  };

  /** 复制 */
  const handleCopy = () => {
    copyText(codeContent.value)
      .then(() => {
        setCopied();
      })
      .catch((error) => {
        console.error(error);
        resetCopied();
      });
  };

  /** 下载 */
  const handleDownload = () => {
    download(codeContent.value, 'index.vue', 'text/plain;charset=utf-8');
  };

  /** 生成代码 */
  watch(
    () => props.modelValue,
    (visible) => {
      if (visible) {
        const proCode = generateProFormCode(props.config, props.componentData);
        const elCode = generateElFormCode(props.config, props.componentData);
        generateData[0] = proCode;
        generateData[1] = elCode;
        setCodeContent();
      }
    }
  );

  watch(tabActive, () => {
    setCodeContent();
  });
</script>
