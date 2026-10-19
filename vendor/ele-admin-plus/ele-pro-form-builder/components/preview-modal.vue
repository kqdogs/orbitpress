<!-- 预览弹窗 -->
<template>
  <EleModal
    :width="980"
    :maxable="true"
    :draggable="false"
    position="center"
    :closeOnClickModal="false"
    :destroyOnClose="true"
    :modalBodyClass="
      [
        'ele-pro-form-builder-preview',
        previewScreen === 'pad'
          ? 'is-pad'
          : previewScreen === 'phone'
            ? 'is-phone'
            : 'is-pc'
      ].join(' ')
    "
    :modelValue="modelValue"
    @update:modelValue="handleUpdateModelValue"
  >
    <template #header>
      <div class="ele-pro-form-builder-screen-radio">
        <ElIcon
          v-for="item in screenItems"
          :key="item.value"
          class="ele-pro-form-builder-header-tool ele-pro-form-builder-screen-icon"
          :class="{ 'is-active': item.value === previewScreen }"
          @click="handleUpdatePreviewScreen(item.value)"
        >
          <component :is="item.icon" :style="item.iconStyle" />
        </ElIcon>
      </div>
    </template>
    <component
      :validateOnRuleChange="false"
      v-bind="previewFormProps"
      :is="proFormComponent || EleProForm"
      ref="previewFormRef"
      :model="formData"
      :editable="false"
      :screenSize="previewScreen"
      :itemTypeData="itemTypeData"
      :httpRequest="httpRequest"
      class="ele-pro-form-builder-preview-form"
      @updateValue="setPreviewFormDataFieldValue"
      @submit="handlePreviewFormSubmit"
      @reset="handlePreviewFormReset"
    >
      <template v-for="name in Object.keys($slots)" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps || {}"></slot>
      </template>
    </component>
  </EleModal>
</template>

<script lang="ts" setup>
  import { ref, reactive, nextTick, watch } from 'vue';
  import { ElIcon } from 'element-plus';
  import EleModal from '../../ele-modal/index.vue';
  import type {
    ProFormItemTypeData,
    ScreenSize
  } from '../../ele-pro-form/types';
  import {
    setValue,
    mergeValue,
    getFormInitValue
  } from '../../ele-pro-form/util';
  import type { UserComponent } from '../../ele-app/types';
  import type {
    EleProFormInstance,
    EleProFormProps
  } from '../../ele-app/plusx';
  import EleProForm from '../../ele-pro-form/index.vue';
  import { screenItems } from '../util';
  import { deepCloneObject } from './build-core';

  defineOptions({ name: 'PreviewModal' });

  const props = defineProps<{
    /** 弹窗是否打开 */
    modelValue?: boolean;
    /** 表单属性 */
    formProps?: EleProFormProps;
    /** 高级表单组件 */
    proFormComponent?: UserComponent;
    /** 高级表单组件类型数据 */
    itemTypeData?: ProFormItemTypeData[];
    /** 远程数据源请求工具 */
    httpRequest?: any;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', visible?: boolean): void;
    (e: 'previewFormSubmit', data: Record<string, any>): void;
  }>();

  /** 预览表单组件 */
  const previewFormRef = ref<EleProFormInstance>(null);

  /** 预览表单属性 */
  const previewFormProps = ref<EleProFormProps>({ items: [] });

  /** 表单数据 */
  const formData = reactive<Record<string, any>>({});

  /** 预览屏幕尺寸 */
  const previewScreen = ref<ScreenSize>('pc');

  /** 更新弹窗打开状态 */
  const handleUpdateModelValue = (visible?: boolean) => {
    emit('update:modelValue', visible);
  };

  /** 更新预览表单数据 */
  const setPreviewFormDataFieldValue = (field: string, value: unknown) => {
    setValue(formData, field, value);
  };

  /** 预览表单提交 */
  const handlePreviewFormSubmit = () => {
    emit('previewFormSubmit', formData);
  };

  /** 预览表单重置 */
  const handlePreviewFormReset = () => {
    Object.keys(formData).forEach((k) => {
      formData[k] = void 0;
    });
    mergeValue(
      formData,
      getFormInitValue(previewFormProps.value?.items, props.itemTypeData, true)
    );
  };

  /** 更新预览屏幕尺寸 */
  const handleUpdatePreviewScreen = (size: ScreenSize) => {
    previewScreen.value = size;
  };

  /** 监听预览弹窗打开 */
  watch(
    () => props.modelValue,
    (visible) => {
      if (visible) {
        previewFormProps.value = deepCloneObject(
          props.formProps || { items: [] }
        );
        handlePreviewFormReset();
        nextTick(() => {
          previewFormRef.value?.clearValidate?.();
          nextTick(() => {
            previewFormRef.value?.clearValidate?.();
          });
        });
      }
    }
  );
</script>
