<!-- 编辑弹窗 -->
<template>
  <EleModal
    :width="460"
    :form="true"
    :title="title"
    :destroyOnClose="true"
    :loading="loading"
    v-bind="editConfig?.modalProps || {}"
    :modelValue="modelValue"
    @update:modelValue="handleUpdateVisible"
  >
    <component
      :itemTypeData="itemTypeData"
      :httpRequest="httpRequest"
      :screenSize="screenSize"
      v-bind="editFormProps"
      :is="proFormComponent || EleProForm"
      ref="editFormRef"
      :model="editForm"
      @updateValue="handleUpdateEditForm"
      @submit="handleSubmitEditForm"
      @reset="handleResetEditForm()"
    >
      <template
        v-for="(slotName, compSlotName) in getSlotsMap(
          $slots,
          editConfig?.formSlots,
          [],
          [],
          true
        )"
        #[compSlotName]="slotProps"
      >
        <slot :name="slotName" v-bind="slotProps || {}"></slot>
      </template>
    </component>
    <template v-if="btnItems.length" #footer>
      <EleButtons :items="btnItems" />
    </template>
    <template
      v-for="(slotName, compSlotName) in getSlotsMap(
        $slots,
        editConfig?.modalSlots,
        ['default', 'footer']
      )"
      #[compSlotName]="slotProps"
    >
      <slot :name="slotName" v-bind="slotProps || {}"></slot>
    </template>
  </EleModal>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref, reactive, computed, watch } from 'vue';
  import { getSlotsMap } from '../../utils/common';
  import type { UserComponent } from '../../ele-app/types';
  import type {
    EleProFormInstance,
    EleProFormProps
  } from '../../ele-app/plusx';
  import type { DataItem } from '../../ele-data-table/types';
  import { getValue as getRowValue } from '../../ele-data-table/util';
  import EleModal from '../../ele-modal/index.vue';
  import EleProForm from '../../ele-pro-form/index.vue';
  import {
    setValue,
    mergeValue,
    getFormInitValue
  } from '../../ele-pro-form/util';
  import type {
    ProFormItemTypeData,
    ScreenSize
  } from '../../ele-pro-form/types';
  import EleButtons from '../../ele-buttons/index';
  import type { ButtonItem } from '../../ele-buttons/types';
  import { codeStringPrefix } from '../util';
  import type {
    EditConfig,
    ListConfig,
    CrudField,
    EditApi,
    DetailApi,
    GetFieldsFormItemsFunction,
    GetAndCacheCodeFunction
  } from '../types';

  defineOptions({ name: 'EditModal' });

  const props = defineProps({
    /** 弹窗是否打开 */
    modelValue: Boolean as PropType<boolean>,
    /** 编辑弹窗数据 */
    data: Object as PropType<DataItem>,
    /** 弹窗标题 */
    title: String,
    /** 编辑配置 */
    editConfig: Object as PropType<EditConfig>,
    /** 列表配置 */
    listConfig: Object as PropType<ListConfig>,
    /** 字段数据 */
    fields: Array as PropType<CrudField[]>,
    /** 获取字段数据对应的表单项的方法 */
    getFieldsEditFormItems: Function as PropType<GetFieldsFormItemsFunction>,
    /** 获取字段数据对应的表单项的方法 */
    getAndCacheCode: {
      type: Function as PropType<GetAndCacheCodeFunction>,
      required: true
    },
    /** 高级表单组件 */
    proFormComponent: [String, Object, Function] as PropType<UserComponent>,
    /** 修改数据接口 */
    editApi: [Function, String] as PropType<EditApi | string>,
    /** 详情接口 */
    detailApi: [Function, String] as PropType<DetailApi | string>,
    /** 高级表单组件类型数据 */
    itemTypeData: Array as PropType<ProFormItemTypeData[]>,
    /** 远程数据源请求工具 */
    httpRequest: [Object, Function],
    /** 屏幕尺寸 */
    screenSize: String as PropType<ScreenSize>
  });

  const emit = defineEmits({
    /** 更新弹窗打开状态事件 */
    'update:modelValue': (_visible?: boolean) => true,
    /** 编辑保存失败事件 */
    editError: (_e: Error) => true,
    /** 编辑保存成功事件 */
    editDone: (_msg?: string) => true,
    /** 详情查询失败事件 */
    detailError: (_e: Error) => true,
    /** 详情查询成功事件 */
    detailDone: (_data?: DataItem) => true
  });

  /** 弹窗保存按钮加载状态 */
  const loading = ref(false);

  /** 编辑表单组件 */
  const editFormRef = ref<EleProFormInstance>(null);

  /** 编辑表单数据 */
  const editForm = reactive<Record<string, any>>({});

  /** 编辑表单属性 */
  const editFormProps = computed<EleProFormProps>(() => {
    const formProps = props.editConfig?.formProps || {};
    return {
      ...formProps,
      items: formProps.items?.length
        ? formProps.items
        : props.getFieldsEditFormItems?.(props.fields)
    };
  });

  /** 更新弹窗打开状态 */
  const handleUpdateVisible = (visible?: boolean) => {
    emit('update:modelValue', visible);
  };

  /** 保存编辑 */
  const handleSave = () => {
    editFormRef.value?.validate?.((valid) => {
      if (valid) {
        handleSubmitEditForm(editForm);
      }
    });
  };

  /** 关闭弹窗 */
  const handleCancel = () => {
    handleUpdateVisible(false);
    loading.value = false;
  };

  /** 更新编辑表单数据 */
  const handleUpdateEditForm = (field: string, value: unknown) => {
    setValue(editForm, field, value);
  };

  /** 重置编辑表单数据 */
  const handleResetEditForm = (item?: DataItem) => {
    Object.keys(editForm).forEach((key) => {
      editForm[key] = void 0;
    });
    mergeValue(
      editForm,
      getFormInitValue(
        editFormProps.value.items,
        editFormProps.value.itemTypeData || props.itemTypeData,
        true
      ),
      item
    );
  };

  /** 提交编辑表单 */
  const handleSubmitEditForm = (form: Record<string, any>) => {
    if (!props.editApi) {
      return;
    }
    const editApiFunc: EditApi | undefined =
      typeof props.editApi === 'function'
        ? props.editApi
        : props.editApi.startsWith(codeStringPrefix)
          ? props.getAndCacheCode(props.editApi)
          : void 0;
    if (!editApiFunc) {
      return;
    }
    loading.value = true;
    editApiFunc(form)
      .then((msg) => {
        handleCancel();
        emit('editDone', msg);
      })
      .catch((e) => {
        loading.value = false;
        emit('editError', e);
      });
  };

  /** 操作按钮 */
  const btnItems = computed<ButtonItem[]>(() => {
    const items: ButtonItem[] = [];
    if (props.editConfig?.cancelBtnProps !== false) {
      items.push({
        preset: 'cancel',
        props:
          props.editConfig?.cancelBtnProps === true
            ? void 0
            : props.editConfig?.cancelBtnProps,
        onClick: handleCancel
      });
    }
    if (props.editConfig?.saveBtnProps !== false) {
      items.push({
        preset: 'save',
        props: {
          loading: loading.value,
          ...((props.editConfig?.saveBtnProps === true
            ? void 0
            : props.editConfig?.saveBtnProps) || {})
        },
        onClick: handleSave
      });
    }
    return items;
  });

  /** 请求详情数据 */
  const queryDetailData = () => {
    if (!props.detailApi) {
      return;
    }
    const detailApiFunc: DetailApi | undefined =
      typeof props.detailApi === 'function'
        ? props.detailApi
        : props.detailApi.startsWith(codeStringPrefix)
          ? props.getAndCacheCode(props.detailApi)
          : void 0;
    if (!detailApiFunc) {
      return;
    }
    loading.value = true;
    const rowKey = props.listConfig?.tableProps?.rowKey;
    const dataKey = rowKey ? getRowValue(props.data, rowKey) : void 0;
    detailApiFunc(dataKey, props.data)
      .then((data) => {
        loading.value = false;
        handleResetEditForm(data);
        emit('detailDone', data);
      })
      .catch((e) => {
        loading.value = false;
        emit('detailError', e);
      });
  };

  /** 监听弹窗打开 */
  watch(
    () => props.modelValue,
    (visible) => {
      if (visible) {
        if (!props.detailApi) {
          handleResetEditForm(props.data);
        } else {
          handleResetEditForm();
          queryDetailData();
        }
      }
    }
  );
</script>
