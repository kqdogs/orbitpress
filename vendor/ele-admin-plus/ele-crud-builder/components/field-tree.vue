<!-- 字段树列表 -->
<template>
  <div class="ele-crud-builder-field-header">
    <ElButton :icon="PlusOutlined" type="primary" @click="handleOpenEdit()">
      添加
    </ElButton>
  </div>
  <FieldList
    v-if="fields && fields.length"
    :items="fields"
    :collapseItemIds="collapseItemIds"
    @toggleItemCollapse="handleToggleItemCollapse"
    @deleteItem="handleDeleteItem"
    @copyItem="handleCopyItem"
    @editItem="handleEditItem"
    @addChildren="handleAddChildren"
    @updateItemChildren="handleUpdateItemChildren"
  />
  <ElEmpty v-else :imageSize="58" class="ele-crud-builder-form-empty" />
  <!-- 添加和修改表单 -->
  <Transition name="anim">
    <div
      v-if="fieldEditOption.visible"
      class="ele-crud-builder-field-edit-wrapper"
    >
      <div class="ele-crud-builder-field-edit-card">
        <div class="ele-crud-builder-field-edit-header">
          <div class="ele-crud-builder-field-edit-title">
            {{ fieldEditOption.isEdit ? '修改' : '添加' }}
          </div>
          <ElButton
            :text="true"
            :icon="CloseOutlined"
            @click="handleCancelEdit"
          >
            取消
          </ElButton>
          <ElButton
            :icon="CheckOutlined"
            type="primary"
            @click="handleSaveEdit"
          >
            保存
          </ElButton>
        </div>
        <component
          :itemTypeData="itemTypeData"
          :httpRequest="httpRequest"
          :is="proFormComponent || EleProForm"
          size="small"
          labelPosition="top"
          :model="fieldEditData"
          :items="fieldEditFormItems"
          class="ele-crud-builder-field-edit-form"
          @updateValue="handleUpdateEditFieldData"
        >
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
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref, reactive, watch } from 'vue';
  import { ElEmpty, ElButton, ElSwitch } from 'element-plus';
  import {
    PlusOutlined,
    CloseOutlined,
    CheckOutlined
  } from '../../icons/index';
  import type { UserComponent } from '../../ele-app/types';
  import { findTree, eachTree, omit } from '../../utils/common';
  import EleProForm from '../../ele-pro-form/index.vue';
  import type {
    ProFormItemProps,
    ProFormItemTypeData
  } from '../../ele-pro-form/types';
  import {
    setValue,
    mergeValue,
    getFormInitValue
  } from '../../ele-pro-form/util';
  import { deepCloneObject } from '../../ele-pro-form-builder/components/build-core';
  import SourceEdit from '../../ele-pro-form-builder/components/source-edit.vue';
  import StyleEdit from '../../ele-pro-form-builder/components/style-edit.vue';
  import type { CrudField } from '../../ele-crud/types';
  import type { FieldEditOption } from '../types';
  import { itemsGenerateNewKey } from '../util';
  import FieldList from './field-list.vue';

  defineOptions({ name: 'FieldTree' });

  const props = defineProps({
    /** 全部字段 */
    fields: Array as PropType<CrudField[]>,
    /** 字段编辑的表单项配置 */
    fieldEditFormItems: Array as PropType<ProFormItemProps[]>,
    /** 高级表单组件 */
    proFormComponent: [String, Object, Function] as PropType<UserComponent>,
    /** JSON 编辑器组件 */
    jsonEditerComponent: [String, Object, Function] as PropType<UserComponent>,
    /** 高级表单组件类型数据 */
    itemTypeData: Array as PropType<ProFormItemTypeData[]>,
    /** 远程数据源请求工具 */
    httpRequest: [Object, Function]
  });

  const emit = defineEmits<{
    /** 删除字段事件 */
    (e: 'deleteField', key: string): void;
    /** 添加字段事件 */
    (e: 'addField', field: CrudField, parentKey?: string, index?: number): void;
    /** 修改字段事件 */
    (e: 'updateField', field: CrudField): void;
    /** 更新字段排序事件 */
    (e: 'updateFieldChildren', data: CrudField[], parentKey?: string): void;
  }>();

  /** 折叠的字段 */
  const collapseItemIds = ref<string[]>([]);

  /** 编辑表单数据 */
  const fieldEditData = reactive<Record<string, any>>({});

  /** 字段编辑抽屉配置 */
  const fieldEditOption = reactive<FieldEditOption>({});

  /** 删除字段 */
  const handleDeleteItem = (key: string) => {
    emit('deleteField', key);
  };

  /** 复制字段 */
  const handleCopyItem = (key: string) => {
    if (key == null) {
      return;
    }
    eachTree(props.fields, (item, index, parent) => {
      if (item.key === key) {
        const newItem = deepCloneObject(item);
        itemsGenerateNewKey(newItem, props.fields, true);
        emit('addField', newItem, parent?.key, index + 1);
        return false;
      }
    });
  };

  /** 编辑字段 */
  const handleEditItem = (item: CrudField) => {
    handleOpenEdit(item);
  };

  /** 添加子级字段 */
  const handleAddChildren = (parentKey: string) => {
    handleOpenEdit(void 0, parentKey);
  };

  /** 更新字段排序 */
  const handleUpdateItemChildren = (data: CrudField[], parentKey?: string) => {
    emit('updateFieldChildren', data, parentKey);
  };

  /** 字段折叠切换 */
  const handleToggleItemCollapse = (key: string) => {
    if (key == null) {
      return;
    }
    const index = collapseItemIds.value.indexOf(key);
    if (index !== -1) {
      collapseItemIds.value.splice(index, 1);
    } else {
      collapseItemIds.value.push(key);
    }
  };

  /** 更新编辑表单数据 */
  const handleUpdateEditFieldData = (field: string, value: any) => {
    if (!field) {
      const excludeFields: string[] = ['key', 'children'];
      const temp = omit(value, excludeFields);
      Object.assign(fieldEditData, temp);
      const valueKeys = Object.keys(temp);
      Object.keys(fieldEditData).forEach((key: string) => {
        if (
          fieldEditData &&
          !excludeFields.includes(key) &&
          !valueKeys.includes(key) &&
          typeof fieldEditData[key] !== 'undefined'
        ) {
          fieldEditData[key] = void 0;
        }
      });
    } else {
      setValue(fieldEditData, field, value);
    }
  };

  /** 重置编辑表单数据 */
  const resetFieldEditData = (item?: CrudField) => {
    Object.keys(fieldEditData).forEach((key) => {
      fieldEditData[key] = void 0;
    });
    mergeValue(
      fieldEditData,
      getFormInitValue(props.fieldEditFormItems, props.itemTypeData, true),
      item
    );
  };

  /** 打开字段编辑 */
  const handleOpenEdit = (item?: CrudField, parentKey?: string) => {
    resetFieldEditData(item);
    if (item == null) {
      fieldEditOption.isEdit = false;
      fieldEditOption.parentKey = parentKey;
    } else {
      fieldEditOption.isEdit = true;
      fieldEditOption.parentKey = void 0;
    }
    fieldEditOption.index = void 0;
    fieldEditOption.visible = true;
  };

  /** 取消字段编辑 */
  const handleCancelEdit = () => {
    fieldEditOption.visible = false;
  };

  /** 保存字段编辑 */
  const handleSaveEdit = () => {
    handleCancelEdit();
    const field = deepCloneObject(fieldEditData as CrudField);
    if (fieldEditOption.isEdit) {
      emit('updateField', field);
    } else {
      itemsGenerateNewKey(field, props.fields);
      emit('addField', field, fieldEditOption.parentKey, fieldEditOption.index);
    }
  };

  /** 字段数据更新后移除不存在的折叠数据 */
  watch(
    () => props.fields,
    (items) => {
      for (let i = collapseItemIds.value.length - 1; i >= 0; i--) {
        if (!findTree(items, (item) => collapseItemIds.value[i] === item.key)) {
          collapseItemIds.value.splice(i, 1);
        }
      }
    },
    { deep: true }
  );
</script>
