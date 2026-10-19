<!-- 列表额外功能 -->
<template>
  <EditModal
    v-if="addConfig !== false"
    :data="addData"
    :modelValue="addVisible"
    :title="lang.add"
    :editConfig="addConfig === true ? {} : addConfig"
    :listConfig="listConfig"
    :fields="fields"
    :getFieldsEditFormItems="getFieldsAddFormItems"
    :getAndCacheCode="getAndCacheCode"
    :proFormComponent="proFormComponent"
    :editApi="addApi"
    :itemTypeData="itemTypeData"
    :httpRequest="httpRequest"
    :screenSize="screenSize"
    @editError="handleAddError"
    @editDone="handleAddDone"
    @update:modelValue="handleUpdateAddVisible"
  >
    <template
      v-for="name in Object.keys($slots).filter(
        (k) => !slotExcludes.includes(k)
      )"
      #[name]="slotProps"
    >
      <slot :name="name" v-bind="slotProps || void 0"></slot>
    </template>
  </EditModal>
  <EditModal
    v-if="editConfig !== false"
    :data="editData"
    :modelValue="editVisible"
    :title="lang.edit"
    :editConfig="editConfig === true ? {} : editConfig"
    :listConfig="listConfig"
    :fields="fields"
    :getFieldsEditFormItems="getFieldsEditFormItems"
    :getAndCacheCode="getAndCacheCode"
    :proFormComponent="proFormComponent"
    :editApi="editApi"
    :detailApi="detailApi"
    :itemTypeData="itemTypeData"
    :httpRequest="httpRequest"
    :screenSize="screenSize"
    @editError="handleEditError"
    @editDone="handleEditDone"
    @detailError="handleDetailError"
    @detailDone="handleDetailDone"
    @update:modelValue="handleUpdateEditVisible"
  >
    <template
      v-for="name in Object.keys($slots).filter(
        (k) => !slotExcludes.includes(k)
      )"
      #[name]="slotProps"
    >
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </EditModal>
  <slot></slot>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import type { UserComponent } from '../../ele-app/types';
  import type { DataItem } from '../../ele-data-table/types';
  import type {
    ProFormItemTypeData,
    ScreenSize
  } from '../../ele-pro-form/types';
  import { getFieldsAddFormItems, getFieldsEditFormItems } from '../util';
  import type {
    EditConfig,
    ListConfig,
    BtnClickAction,
    CrudField,
    EditApi,
    DetailApi,
    GetAndCacheCodeFunction,
    CrudLocale
  } from '../types';
  import EditModal from './edit-modal.vue';
  const slotExcludes = ['default'];

  defineOptions({ name: 'TableExtra' });

  defineProps({
    /** 添加弹窗是否打开 */
    addVisible: Boolean as PropType<boolean>,
    /** 添加弹窗数据 */
    addData: Object as PropType<DataItem>,
    /** 修改弹窗是否打开 */
    editVisible: Boolean as PropType<boolean>,
    /** 修改弹窗数据 */
    editData: Object as PropType<DataItem>,
    /** 添加配置 */
    addConfig: [Object, Boolean] as PropType<EditConfig | boolean>,
    /** 修改配置 */
    editConfig: [Object, Boolean] as PropType<EditConfig | boolean>,
    /** 列表配置 */
    listConfig: Object as PropType<ListConfig>,
    /** 字段数据 */
    fields: Array as PropType<CrudField[]>,
    /** 获取字段数据对应的表单项的方法 */
    getAndCacheCode: {
      type: Function as PropType<GetAndCacheCodeFunction>,
      required: true
    },
    /** 高级表单组件 */
    proFormComponent: [String, Object, Function] as PropType<UserComponent>,
    /** 添加数据接口 */
    addApi: [Function, String] as PropType<EditApi | string>,
    /** 修改数据接口 */
    editApi: [Function, String] as PropType<EditApi | string>,
    /** 详情接口 */
    detailApi: [Function, String] as PropType<DetailApi | string>,
    /** 高级表单组件类型数据 */
    itemTypeData: Array as PropType<ProFormItemTypeData[]>,
    /** 远程数据源请求工具 */
    httpRequest: [Object, Function],
    /** 屏幕尺寸 */
    screenSize: String as PropType<ScreenSize>,
    /** 国际化 */
    lang: {
      type: Object as PropType<Partial<CrudLocale>>,
      required: true
    }
  });

  const emit = defineEmits({
    /** 更新添加弹窗打开状态事件 */
    'update:addVisible': (_visible?: boolean) => true,
    /** 更新修改弹窗打开状态事件 */
    'update:editVisible': (_visible?: boolean) => true,
    /** 操作按钮点击事件 */
    btnClick: (_action: BtnClickAction, _e: MouseEvent, _item?: DataItem) =>
      true,
    /** 添加保存失败事件 */
    addError: (_e: Error) => true,
    /** 添加保存成功事件 */
    addDone: (_msg?: string) => true,
    /** 修改保存失败事件 */
    editError: (_e: Error) => true,
    /** 修改保存成功事件 */
    editDone: (_msg?: string) => true,
    /** 详情查询失败事件 */
    detailError: (_e: Error) => true,
    /** 详情查询成功事件 */
    detailDone: (_data?: DataItem) => true
  });

  /** 添加保存失败事件 */
  const handleAddError = (e: Error) => {
    emit('addError', e);
  };

  /** 添加保存成功事件 */
  const handleAddDone = (msg?: string) => {
    emit('addDone', msg);
  };

  /** 修改保存失败事件 */
  const handleEditError = (e: Error) => {
    emit('editError', e);
  };

  /** 修改保存成功事件 */
  const handleEditDone = (msg?: string) => {
    emit('editDone', msg);
  };

  /** 详情查询失败事件 */
  const handleDetailError = (e: Error) => {
    emit('detailError', e);
  };

  /** 详情查询成功事件 */
  const handleDetailDone = (data?: DataItem) => {
    emit('detailDone', data);
  };

  /** 更新添加弹窗打开状态 */
  const handleUpdateAddVisible = (visible?: boolean) => {
    emit('update:addVisible', visible);
  };

  /** 更新修改弹窗打开状态 */
  const handleUpdateEditVisible = (visible?: boolean) => {
    emit('update:editVisible', visible);
  };
</script>
