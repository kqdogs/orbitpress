<!-- 表单设计弹窗 -->
<template>
  <EleModal
    :width="1260"
    :maxable="true"
    position="center"
    :title="title"
    :modelValue="modelValue"
    :closeOnClickModal="false"
    :destroyOnClose="true"
    class="ele-crud-builder-form-design-modal"
    @update:modelValue="handleUpdateModelValue"
  >
    <component
      :proFormComponent="proFormComponent"
      :itemTypeData="itemTypeData"
      :httpRequest="httpRequest"
      :headerTools="defaultHeaderRightTools"
      v-bind="proFormBuilderProps || {}"
      :is="proFormBuilderComponent || EleProFormBuilder"
      :modelValue="formConfig"
      @update:modelValue="handleUpdateFormConfig"
    >
      <template #headerTools>
        <ElButton type="primary" :icon="CheckOutlined" @click="handleSave">
          保存
        </ElButton>
      </template>
      <template
        v-for="name in Object.keys($slots).filter((k) => !ownSlots.includes(k))"
        #[name]="slotProps"
      >
        <slot :name="name" v-bind="slotProps || {}"></slot>
      </template>
    </component>
  </EleModal>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref, watch } from 'vue';
  import { ElButton } from 'element-plus';
  import { CheckOutlined } from '../../icons/index';
  import type { UserComponent } from '../../ele-app/types';
  import type {
    EleCrudProps,
    EleProFormBuilderProps,
    EleProFormProps
  } from '../../ele-app/plusx';
  import EleModal from '../../ele-modal/index.vue';
  import EleProFormBuilder from '../../ele-pro-form-builder/index.vue';
  import { defaultHeaderRightTools } from '../../ele-pro-form-builder/util';
  import type { ProFormItemTypeData } from '../../ele-pro-form/types';
  import {
    getDefaultSearchFormProps,
    getFieldsSearchFormItems,
    getFieldsAddFormItems,
    getFieldsEditFormItems
  } from '../../ele-crud/util';
  import type { FormDesignType } from '../types';
  const ownSlots = ['default', 'headerTools'];

  defineOptions({ name: 'FormDesignModal' });

  const props = defineProps({
    /** 弹窗是否打开 */
    modelValue: Boolean,
    /** 弹窗标题 */
    title: String,
    /** 类型 */
    type: String as PropType<FormDesignType>,
    /** 配置数据 */
    config: Object as PropType<EleCrudProps>,
    /** 高级表单组件 */
    proFormComponent: [String, Object, Function] as PropType<UserComponent>,
    /** 表单构建组件 */
    proFormBuilderComponent: [
      String,
      Object,
      Function
    ] as PropType<UserComponent>,
    /** 表单构建组件属性 */
    proFormBuilderProps: Object as PropType<EleProFormBuilderProps>,
    /** JSON 编辑器组件 */
    jsonEditerComponent: [String, Object, Function] as PropType<UserComponent>,
    /** 高级表单组件类型数据 */
    itemTypeData: Array as PropType<ProFormItemTypeData[]>,
    /** 远程数据源请求工具 */
    httpRequest: [Object, Function]
  });

  const emit = defineEmits<{
    /** 更新弹窗打开事件 */
    (e: 'update:modelValue', visible?: boolean): void;
    /** 更新表单配置事件 */
    (
      e: 'updateFormConfig',
      data?: EleProFormProps,
      type?: FormDesignType
    ): void;
  }>();

  /** 表单配置数据 */
  const formConfig = ref<EleProFormProps>();

  /** 更新弹窗打开状态 */
  const handleUpdateModelValue = (visible?: boolean) => {
    emit('update:modelValue', visible);
  };

  /** 保存 */
  const handleSave = () => {
    handleCloseModal();
    emit('updateFormConfig', formConfig.value, props.type);
  };

  /** 关闭弹窗 */
  const handleCloseModal = () => {
    handleUpdateModelValue(false);
  };

  /** 更新表单配置数据 */
  const handleUpdateFormConfig = (config: EleProFormProps) => {
    formConfig.value = config;
  };

  /** 监听弹窗打开 */
  watch(
    () => props.modelValue,
    (visible) => {
      if (!visible) {
        return;
      }
      const config = props.config || {};
      const fields = config.fields;
      if (props.type === 'search') {
        const searchConfig = config.searchConfig;
        const formProps =
          (searchConfig === false || searchConfig === true
            ? void 0
            : searchConfig
          )?.formProps || {};
        const items = formProps.items?.length
          ? formProps.items
          : getFieldsSearchFormItems(fields);
        formConfig.value = {
          ...(getDefaultSearchFormProps() || {}),
          ...formProps,
          items
        };
        return;
      }
      if (props.type === 'add') {
        const addConfig = config.addConfig;
        const formProps =
          (addConfig === false || addConfig === true ? void 0 : addConfig)
            ?.formProps || {};
        const items = formProps.items?.length
          ? formProps.items
          : getFieldsAddFormItems(fields);
        formConfig.value = { ...formProps, items };
        return;
      }
      if (props.type === 'edit') {
        const editConfig = config.editConfig;
        const formProps =
          (editConfig === false || editConfig === true ? void 0 : editConfig)
            ?.formProps || {};
        const items = formProps.items?.length
          ? formProps.items
          : getFieldsEditFormItems(fields);
        formConfig.value = { ...formProps, items };
      }
    }
  );
</script>
