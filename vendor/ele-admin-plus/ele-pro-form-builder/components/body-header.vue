<!-- 顶栏操作区 -->
<template>
  <div class="ele-pro-form-builder-header">
    <div class="ele-pro-form-builder-screen-radio">
      <ElIcon
        v-for="item in screenItems"
        :key="item.value"
        class="ele-pro-form-builder-header-tool ele-pro-form-builder-screen-icon"
        :class="{ 'is-active': item.value === currentScreen }"
        @click="handleUpdateScreen(item.value)"
      >
        <component :is="item.icon" :style="item.iconStyle" />
      </ElIcon>
    </div>
    <div class="ele-pro-form-builder-header-left">
      <ElIcon
        class="ele-pro-form-builder-header-tool ele-pro-form-builder-header-tool-undo"
        :class="{ 'is-disabled': undoDisabled }"
        title="撤销"
        @click="handleUndo"
      >
        <RollbackOutlined />
      </ElIcon>
      <ElIcon
        class="ele-pro-form-builder-header-tool ele-pro-form-builder-header-tool-redo"
        :class="{ 'is-disabled': redoDisabled }"
        title="恢复"
        @click="handleRedo"
      >
        <RecoverOutlined />
      </ElIcon>
    </div>
    <div class="ele-pro-form-builder-header-tools">
      <template v-for="toolName in headerRightToolNames" :key="toolName">
        <ElButton
          v-if="toolName === 'import'"
          :text="true"
          :icon="UploadOutlined"
          @click="handleOpenImport"
        >
          导入
        </ElButton>
        <ElButton
          v-else-if="toolName === 'export'"
          :text="true"
          :icon="DownloadOutlined"
          @click="handleOpenExport"
        >
          导出
        </ElButton>
        <ElButton
          v-else-if="toolName === 'clear'"
          :text="true"
          type="danger"
          :icon="DeleteOutlined"
          @click="handleClear"
        >
          清空
        </ElButton>
        <ElButton
          v-else-if="toolName === 'preview'"
          :text="true"
          type="primary"
          :icon="EyeOutlined"
          @click="handleOpenPreview"
        >
          预览
        </ElButton>
        <ElButton
          v-else-if="toolName === 'code'"
          :text="true"
          type="primary"
          :icon="CodeOutlined"
          @click="handleOpenCode"
        >
          生成代码
        </ElButton>
      </template>
      <slot name="headerTools"></slot>
    </div>
    <!-- 预览弹窗 -->
    <PreviewModal
      v-if="headerRightToolNames && headerRightToolNames.includes('preview')"
      v-model="previewVisible"
      :formProps="formProps"
      :proFormComponent="proFormComponent"
      :itemTypeData="itemTypeData"
      :httpRequest="httpRequest"
      @previewFormSubmit="handlePreviewFormSubmit"
    >
      <template
        v-for="name in Object.keys($slots).filter((k) => !ownSlots.includes(k))"
        #[name]="slotProps"
      >
        <slot :name="name" v-bind="slotProps || {}"></slot>
      </template>
    </PreviewModal>
    <!-- 导入导出弹窗 -->
    <ImportModal
      v-if="
        headerRightToolNames &&
        (headerRightToolNames.includes('import') ||
          headerRightToolNames.includes('export'))
      "
      v-model="importVisible"
      :config="formProps"
      :isImport="isImport"
      :jsonEditerComponent="jsonEditerComponent"
      @importData="handleImportData"
    />
    <!-- 生成代码弹窗 -->
    <CodePreview
      v-if="headerRightToolNames && headerRightToolNames.includes('code')"
      v-model="codeVisible"
      :config="formProps"
      :componentData="componentData"
      :codeViewerComponent="codeViewerComponent"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { ElIcon, ElButton } from 'element-plus';
  import {
    RollbackOutlined,
    RecoverOutlined,
    DeleteOutlined,
    EyeOutlined,
    UploadOutlined,
    DownloadOutlined,
    CodeOutlined
  } from '../../icons/index';
  import type { UserComponent } from '../../ele-app/types';
  import type { EleProFormProps } from '../../ele-app/plusx';
  import type {
    ProFormItemTypeData,
    ScreenSize
  } from '../../ele-pro-form/types';
  import { defaultHeaderRightTools, screenItems } from '../util';
  import type { HeaderRightToolName, ComponentGroup } from '../types';
  import PreviewModal from './preview-modal.vue';
  import ImportModal from './import-modal.vue';
  import CodePreview from './code-preview.vue';
  const ownSlots = ['headerTools'];

  defineOptions({ name: 'BodyHeader' });

  const props = defineProps<{
    /** 当前选中屏幕尺寸 */
    currentScreen?: ScreenSize;
    /** 是否禁用撤销 */
    undoDisabled?: boolean;
    /** 是否禁用恢复 */
    redoDisabled?: boolean;
    /** 表单属性 */
    formProps?: EleProFormProps;
    /** 顶栏右侧操作按钮顺序 */
    headerTools?: boolean | HeaderRightToolName[];
    /** 高级表单组件 */
    proFormComponent?: UserComponent;
    /** JSON 编辑器组件 */
    jsonEditerComponent?: UserComponent;
    /** 代码查看器组件 */
    codeViewerComponent?: UserComponent;
    /** 组件库数据 */
    componentData?: ComponentGroup[];
    /** 高级表单组件类型数据 */
    itemTypeData?: ProFormItemTypeData[];
    /** 远程数据源请求工具 */
    httpRequest?: any;
  }>();

  const emit = defineEmits<{
    /** 更新屏幕尺寸事件 */
    (e: 'update:currentScreen', size?: string): void;
    /** 撤销按钮点击事件 */
    (e: 'undo'): void;
    /** 恢复按钮点击事件 */
    (e: 'redo'): void;
    /** 清空按钮点击事件 */
    (e: 'clear'): void;
    /** 预览表单提交事件 */
    (e: 'previewFormSubmit', data: Record<string, any>): void;
    /** 导入事件 */
    (e: 'importData', data: EleProFormProps): void;
  }>();

  /** 是否打开预览弹窗 */
  const previewVisible = ref(false);

  /** 是否打开导入导出弹窗 */
  const importVisible = ref(false);

  /** 是否是导入 */
  const isImport = ref(false);

  /** 是否打开生成代码弹窗 */
  const codeVisible = ref(false);

  /** 顶栏右侧操作按钮顺序 */
  const headerRightToolNames = computed<HeaderRightToolName[]>(() => {
    if (
      typeof props.headerTools === 'undefined' ||
      props.headerTools === true
    ) {
      return defaultHeaderRightTools;
    }
    if (!props.headerTools) {
      return [];
    }
    return props.headerTools;
  });

  /** 更新屏幕尺寸 */
  const handleUpdateScreen = (size?: string) => {
    emit('update:currentScreen', size);
  };

  /** 撤销 */
  const handleUndo = () => {
    if (!props.undoDisabled) {
      emit('undo');
    }
  };

  /** 恢复 */
  const handleRedo = () => {
    if (!props.redoDisabled) {
      emit('redo');
    }
  };

  /** 清空 */
  const handleClear = () => {
    emit('clear');
  };

  /** 打开预览弹窗 */
  const handleOpenPreview = () => {
    previewVisible.value = true;
  };

  /** 预览表单提交事件 */
  const handlePreviewFormSubmit = (data: Record<string, any>) => {
    emit('previewFormSubmit', data);
  };

  /** 打开导入弹窗 */
  const handleOpenImport = () => {
    importVisible.value = true;
    isImport.value = true;
  };

  /** 打开导出弹窗 */
  const handleOpenExport = () => {
    importVisible.value = true;
    isImport.value = false;
  };

  /** 导入事件 */
  const handleImportData = (data: EleProFormProps) => {
    emit('importData', data);
  };

  /** 打开生成代码弹窗 */
  const handleOpenCode = () => {
    codeVisible.value = true;
  };
</script>
