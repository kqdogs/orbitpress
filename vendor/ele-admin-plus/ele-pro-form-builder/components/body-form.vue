<!-- 主体表单区 -->
<template>
  <div
    class="ele-pro-form-builder-body"
    :class="[
      { 'is-pc': currentScreen === 'pc' },
      { 'is-pad': currentScreen === 'pad' },
      { 'is-phone': currentScreen === 'phone' }
    ]"
  >
    <component
      v-bind="formProps || {}"
      :is="proFormComponent || EleProForm"
      ref="proFormRef"
      :model="formData"
      :activeItemKey="currentFormItemId"
      :editable="true"
      :screenSize="currentScreen"
      :footer="false"
      :validateOnRuleChange="false"
      :scrollToError="false"
      :showMessage="false"
      :itemTypeData="itemTypeData"
      :httpRequest="httpRequest"
      class="ele-pro-form-builder-body-form"
      @updateValue="setBuilderFormDataFieldValue"
      @update:items="handleUpdateFormItems"
      @update:activeItemKey="handleUpdateCurrentFormItemId"
    >
      <template #builderItemHandleContent="{ item }">
        <ComponentName :itemType="item.type" :componentData="componentData" />
      </template>
      <template #builderItemTools="{ item }">
        <BuilderTools
          :itemType="item.type"
          @delete="handleDeleteItem(item)"
          @copy="handleCopyItem(item)"
          @add="handleAddChildrenItem(item)"
          @addTableRow="handleAddChildrenItem(item, 'addTableRow')"
          @addTableCol="handleAddChildrenItem(item, 'addTableCol')"
          @openTableTool="(e) => handleOpenTableTool(item, e)"
        />
      </template>
      <template
        v-for="name in Object.keys($slots).filter((k) => !ownSlots.includes(k))"
        #[name]="slotProps"
      >
        <slot :name="name" v-bind="slotProps || {}"></slot>
      </template>
    </component>
    <ElEmpty
      v-if="!formProps || !formProps.items || !formProps.items.length"
      :imageSize="80"
      description="拖拽左侧组件到此"
      class="ele-pro-form-builder-form-empty"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { ElEmpty } from 'element-plus';
  import type { UserComponent } from '../../ele-app/types';
  import type {
    EleProFormInstance,
    EleProFormProps
  } from '../../ele-app/plusx';
  import { eachTree } from '../../utils/common';
  import type {
    ProFormItemKey,
    ProFormItemProps,
    ProFormItemTypeData,
    ScreenSize
  } from '../../ele-pro-form/types';
  import {
    setValue,
    mergeValue,
    getFormInitValue
  } from '../../ele-pro-form/util';
  import EleProForm from '../../ele-pro-form/index.vue';
  import type {
    ComponentGroup,
    UpdateItemsResult,
    AddChildrenItemAction
  } from '../types';
  import { generateAddChildData, generateCopyItemData } from './build-util';
  import ComponentName from './component-name.vue';
  import BuilderTools from './builder-tools.vue';
  const ownSlots = ['builderItemHandleContent', 'builderItemTools'];

  defineOptions({ name: 'BodyForm' });

  const props = defineProps<{
    /** 表单属性 */
    formProps?: EleProFormProps;
    /** 选中的表单项 id */
    currentFormItemId?: ProFormItemKey;
    /** 当前选中屏幕尺寸 */
    currentScreen?: ScreenSize;
    /** 组件库数据 */
    componentData?: ComponentGroup[];
    /** 高级表单组件 */
    proFormComponent?: UserComponent;
    /** 高级表单组件类型数据 */
    itemTypeData?: ProFormItemTypeData[];
    /** 远程数据源请求工具 */
    httpRequest?: any;
  }>();

  const emit = defineEmits<{
    (e: 'update:currentFormItemId', formItemId?: ProFormItemKey): void;
    (e: 'updateItems', result: UpdateItemsResult): void;
    (e: 'openTableTool', formItemId: string, el: HTMLElement): void;
    (e: 'updateFormItems', items: ProFormItemProps[]): void;
  }>();

  /** 表单组件 */
  const proFormRef = ref<EleProFormInstance>(null);

  /** 表单数据 */
  const formData = reactive<Record<string, any>>({});

  /** 缓存的表单数据 */
  const cachebuilderFormData = reactive<Record<string, any>>({});

  /** 更新表单项数据 */
  const handleUpdateItems = (result: UpdateItemsResult) => {
    emit('updateItems', result);
  };

  /** 更新选中的表单项 */
  const handleUpdateCurrentFormItemId = (formItemId: ProFormItemKey) => {
    emit('update:currentFormItemId', formItemId);
  };

  /** 删除表单项 */
  const handleDeleteItem = (item: ProFormItemProps) => {
    if (item.key != null) {
      handleUpdateItems({
        deleteItemIds: [item.key as string],
        addItems: [],
        updateItems: []
      });
    }
  };

  /** 表单项添加子级 */
  const handleAddChildrenItem = (
    formItem: ProFormItemProps,
    action?: AddChildrenItemAction
  ) => {
    if (formItem.key != null) {
      eachTree(props.formProps?.items, (item, cIndex, parent) => {
        if (item.key === formItem.key) {
          const result = generateAddChildData(
            item,
            parent,
            cIndex,
            action,
            props.formProps?.items,
            void 0,
            props.componentData
          );
          handleUpdateItems(result);
          return false;
        }
      });
    }
  };

  /** 复制表单项 */
  const handleCopyItem = (item: ProFormItemProps) => {
    if (item.key != null) {
      handleUpdateItems(
        generateCopyItemData(item.key as string, props.formProps?.items)
      );
    }
  };

  /** 打开表格更多操作 */
  const handleOpenTableTool = (item: ProFormItemProps, e: MouseEvent) => {
    if (item.key != null) {
      emit('openTableTool', item.key as string, e.currentTarget as HTMLElement);
    }
  };

  /** 更新表单数据 */
  const setBuilderFormDataFieldValue = (field: string, value: unknown) => {
    setValue(formData, field, value);
    setValue(cachebuilderFormData, field, value);
  };

  /** 拖拽排序更新 */
  const handleUpdateFormItems = (items: ProFormItemProps[]) => {
    emit('updateFormItems', items);
  };

  /** 选项卡和折叠面板组件自动切换到选中的选项卡子级表单项 */
  watch(
    () => props.currentFormItemId,
    (currentFormItemId) => {
      eachTree(props.formProps?.items, (item, _cIndex, parent) => {
        if (item.key === currentFormItemId) {
          if (
            item.type &&
            ['tabPane', 'collapseItem'].includes(item.type) &&
            parent &&
            parent.prop
          ) {
            setBuilderFormDataFieldValue(parent.prop, item.prop);
          }
          return false;
        }
      });
    }
  );

  /** 同步更新表单项数据 */
  watch(
    () => props.formProps,
    () => {
      Object.keys(formData).forEach((k) => {
        formData[k] = void 0;
      });
      mergeValue(
        formData,
        getFormInitValue(props.formProps?.items, props.itemTypeData, true),
        cachebuilderFormData
      );
    },
    {
      deep: true,
      immediate: true
    }
  );

  defineExpose({ proFormRef });
</script>
