<!-- 页面设置 -->
<template>
  <div
    v-if="pageConfigGroups.length"
    class="ele-crud-builder-page-config-group-list"
  >
    <div
      v-for="item in pageConfigGroups"
      :key="item.key"
      class="ele-crud-builder-page-config-group-list-item"
      :class="{ 'is-active': item.key === groupActive }"
      @click="handlePageConfigGroupClick(item)"
    >
      {{ item.label }}
    </div>
  </div>
  <component
    :itemTypeData="itemTypeData"
    :httpRequest="httpRequest"
    :is="proFormComponent || EleProForm"
    size="small"
    labelPosition="top"
    :model="configFormData"
    :items="activePageConfigFormItems"
    class="ele-crud-builder-page-config-form"
    @updateValue="handleUpdateConfigField"
  >
    <template
      v-if="!$slots.crudBuilderFormDesign"
      #crudBuilderFormDesign="{ item }"
    >
      <ElButton
        :icon="FormOutlined"
        class="ele-pro-form-builder-props-fluid-btn"
        @click="handleFormDesignBtnClick(item.props?.type, item.label)"
      >
        {{ item.label }}
      </ElButton>
    </template>
    <template
      v-if="!$slots.crudBuilderSwitch"
      #crudBuilderSwitch="{ item, modelValue, updateValue }"
    >
      <ElSwitch
        :modelValue="(modelValue ?? item.props?.defaultValue) !== false"
        @update:modelValue="(val?: any) => updateValue(val ? {} : false)"
      />
    </template>
    <template
      v-if="!$slots.proFormBuilderOptionsEdit"
      #proFormBuilderOptionsEdit="{ item, modelValue, updateValue }"
    >
      <OptionsEdit
        :codeEditerComponent="codeEditerComponent"
        v-bind="item.props || {}"
        :modelValue="modelValue"
        @update:modelValue="updateValue"
      />
    </template>
    <template
      v-if="!$slots.proFormBuilderEventEdit"
      #proFormBuilderEventEdit="{ item, modelValue, updateValue }"
    >
      <EventEdit
        :codeEditerComponent="codeEditerComponent"
        v-bind="item.props || {}"
        :modelValue="modelValue"
        @update:modelValue="updateValue"
      />
    </template>
    <template
      v-if="!$slots.proFormBuilderSourceEdit"
      #proFormBuilderSourceEdit="{ item, model, updatePropValue }"
    >
      <SourceEdit
        :jsonEditerComponent="jsonEditerComponent"
        v-bind="item.props || {}"
        :modelValue="model"
        @update:modelValue="(val) => updatePropValue('', val)"
      />
    </template>
    <template
      v-if="!$slots.proFormBuilderStyleEdit"
      #proFormBuilderStyleEdit="{ item, modelValue, updateValue }"
    >
      <StyleEdit
        v-bind="item.props || {}"
        :modelValue="modelValue"
        @update:modelValue="updateValue"
      />
    </template>
    <template v-for="name in Object.keys($slots)" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </component>
  <!-- 表单设计弹窗 -->
  <FormDesignModal
    v-model="formDesignOption.visible"
    :title="formDesignOption.title"
    :type="formDesignOption.type"
    :config="config"
    :proFormComponent="proFormComponent"
    :proFormBuilderComponent="proFormBuilderComponent"
    :proFormBuilderProps="proFormBuilderProps"
    :jsonEditerComponent="jsonEditerComponent"
    :itemTypeData="itemTypeData"
    :httpRequest="httpRequest"
    @updateFormConfig="handleUpdateFormConfig"
  >
    <template v-for="name in Object.keys($slots)" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </FormDesignModal>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref, reactive, computed } from 'vue';
  import { ElButton, ElSwitch } from 'element-plus';
  import { FormOutlined } from '../../icons/index';
  import type { UserComponent } from '../../ele-app/types';
  import type {
    EleCrudProps,
    EleProFormBuilderProps,
    EleProFormProps
  } from '../../ele-app/plusx';
  import EleProForm from '../../ele-pro-form/index.vue';
  import type {
    ProFormItemTypeData,
    ProFormItemProps
  } from '../../ele-pro-form/types';
  import { mergeValue, getFormInitValue } from '../../ele-pro-form/util';
  import OptionsEdit from '../../ele-pro-form-builder/components/options-edit.vue';
  import EventEdit from '../../ele-pro-form-builder/components/event-edit.vue';
  import SourceEdit from '../../ele-pro-form-builder/components/source-edit.vue';
  import StyleEdit from '../../ele-pro-form-builder/components/style-edit.vue';
  import type {
    PageConfigGroup,
    FormDesignOption,
    FormDesignType
  } from '../types';
  import FormDesignModal from './form-design-modal.vue';

  defineOptions({ name: 'PageConfig' });

  const props = defineProps({
    /** 配置数据 */
    config: Object as PropType<EleCrudProps>,
    /** 页面设置的表单项配置 */
    pageConfigFormItems: Array as PropType<ProFormItemProps[]>,
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
    /** 代码编辑器组件 */
    codeEditerComponent: [String, Object, Function] as PropType<UserComponent>,
    /** JSON 编辑器组件 */
    jsonEditerComponent: [String, Object, Function] as PropType<UserComponent>,
    /** 高级表单组件类型数据 */
    itemTypeData: Array as PropType<ProFormItemTypeData[]>,
    /** 远程数据源请求工具 */
    httpRequest: [Object, Function]
  });

  const emit = defineEmits<{
    /** 更新配置数据事件 */
    (e: 'updateConfigValue', field: string, value: any): void;
    /** 更新表单配置事件 */
    (
      e: 'updateFormConfig',
      data?: EleProFormProps,
      type?: FormDesignType
    ): void;
  }>();

  /** 配置对应的表单数据 */
  const configFormData = computed<Record<string, any>>(() => {
    const data: Record<string, any> = {};
    mergeValue(
      data,
      getFormInitValue(props.pageConfigFormItems, props.itemTypeData, true),
      props.config
    );
    return data;
  });

  /** 表单项数据分组 */
  const pageConfigGroups = computed<PageConfigGroup[]>(() => {
    return (props.pageConfigFormItems || [])
      .filter((item) => !!(item.children && item.label))
      .map((item) => ({
        key: (item.key ?? item.prop) as string,
        label: (item.label ??
          item.children?.[0]?.label ??
          item.prop ??
          item.key) as string
      }));
  });

  /** 分组选中 */
  const groupActive = ref<string>(pageConfigGroups.value?.[0]?.key);

  /** 表单项数据 */
  const activePageConfigFormItems = computed<ProFormItemProps[]>(() => {
    if (!props.pageConfigFormItems) {
      return [];
    }
    if (groupActive.value == null) {
      return props.pageConfigFormItems;
    }
    const items: ProFormItemProps[] = [];
    props.pageConfigFormItems.forEach((item) => {
      if (!item.children || !item.label) {
        items.push(item);
      } else if (groupActive.value === (item.key ?? item.prop)) {
        items.push({ ...item, label: void 0 });
      }
    });
    return items;
  });

  /** 表单设计弹窗配置 */
  const formDesignOption = reactive<FormDesignOption>({});

  /** 表单项数据分组点击事件 */
  const handlePageConfigGroupClick = (item: PageConfigGroup) => {
    groupActive.value = item.key;
  };

  /** 更新配置数据 */
  const handleUpdateConfigField = (field: string, value: any) => {
    emit('updateConfigValue', field, value);
  };

  /** 表单设计按钮点击事件 */
  const handleFormDesignBtnClick = (type?: FormDesignType, title?: string) => {
    formDesignOption.type = type;
    formDesignOption.title = title;
    formDesignOption.visible = true;
  };

  /** 更新表单配置 */
  const handleUpdateFormConfig = (
    data?: EleProFormProps,
    type?: FormDesignType
  ) => {
    emit('updateFormConfig', data, type);
  };
</script>
