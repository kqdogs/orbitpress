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
    class="ele-crud-builder-code-preview"
    @update:modelValue="handleUpdateModelValue"
  >
    <div class="ele-crud-builder-code-view">
      <EleTabBar v-model="tabActive" :items="tabItems">
        <template #extra>
          <ElIcon
            class="ele-crud-builder-code-icon-tool"
            :class="{ 'is-copied': copied }"
            title="复制"
            @click="handleCopy"
          >
            <CheckOutlined v-if="copied" />
            <CopyOutlined v-else />
          </ElIcon>
          <ElIcon
            class="ele-crud-builder-code-icon-tool"
            title="下载"
            @click="handleDownload"
          >
            <DownloadOutlined />
          </ElIcon>
        </template>
      </EleTabBar>
      <div class="ele-crud-builder-code-body">
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
  import type { EleCrudProps } from '../../ele-app/plusx';
  import EleModal from '../../ele-modal/index.vue';
  import EleTabBar from '../../ele-tab-bar/index.vue';
  import CodeViewer from '../../ele-pro-form-builder/components/code-viewer.vue';
  import { generateProCode, generateElCode } from './code-generator';

  defineOptions({ name: 'CodePreview' });

  const props = defineProps<{
    /** 弹窗是否打开 */
    modelValue?: boolean;
    /** 表单配置数据 */
    config?: EleCrudProps;
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
    { value: 'pro', label: 'ProCrud' } /* ,
    { value: 'el', label: '' } */
  ];

  /** 选项卡选中 */
  const tabActive = ref<'pro' | 'el'>('pro');

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
    codeContent.value = generateData[tabActive.value === 'el' ? 1 : 0];
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
        const proCode = generateProCode(props.config);
        const elCode = generateElCode(props.config);
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
