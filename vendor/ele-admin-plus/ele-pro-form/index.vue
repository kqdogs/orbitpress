<!-- 高级表单 -->
<template>
  <ElForm
    ref="formRef"
    :model="model"
    :labelPosition="labelPosition"
    :labelWidth="labelWidth"
    :statusIcon="statusIcon"
    :validateOnRuleChange="validateOnRuleChange"
    :size="size"
    :disabled="disabled"
    :scrollToError="scrollToError"
    :scrollIntoViewOptions="scrollIntoViewOptions"
    :inline="inline"
    :labelSuffix="labelSuffix"
    :hideRequiredAsterisk="hideRequiredAsterisk"
    :requireAsteriskPosition="requireAsteriskPosition"
    :showMessage="showMessage"
    :inlineMessage="inlineMessage"
    class="ele-pro-form"
    :class="{ 'is-editable': editable }"
    @validate="handleFormValidate"
    @submit="handleFormSubmit"
  >
    <slot name="topExtra"></slot>
    <ChildrenRender
      ref="childrenRef"
      :model="model"
      :items="formItems"
      :rules="rules"
      :grid="grid"
      :rowProps="rowProps"
      :contentExtraColProps="footerColProps"
      :autoContentExtraCol="autoFooterCol"
      :formItems="formItems"
      :searchExpand="formSearchExpand"
      :editable="editable"
      :screenSize="screenSize"
      :activeItemKey="currentActiveKey"
      :itemTypeData="itemTypeData"
      :httpRequest="httpRequest"
      :getProFormRefs="getProFormRefs"
      :getAndCacheCode="getAndCacheCode"
      :requiredLang="lang.required"
      @updateItemValue="updateValue"
      @updateItemsData="handleUpdateItemsData"
      @update:activeItemKey="handleUpdateActiveItemKey"
    >
      <template
        v-for="name in Object.keys($slots).filter(
          (k) => !slotExcludes.includes(k)
        )"
        #[name]="slotProps"
      >
        <slot :name="name" v-bind="slotProps || {}"></slot>
      </template>
      <template v-if="footer" #contentExtra>
        <ProFormFooter
          :footerProps="footerProps"
          :footerSlots="footerSlots"
          :autoFooterCol="autoFooterCol"
          :footerStyle="footerStyleData"
          :submitText="submitText ?? lang.submit"
          :resetText="resetText ?? lang.reset"
          :submitButtonProps="submitButtonProps"
          :resetButtonProps="resetButtonProps"
          :showSearchExpand="showSearchExpand"
          :searchExpand="formSearchExpand"
          :searchExpandButtonProps="searchExpandButtonProps"
          :searchExpandText="searchExpandText ?? lang.expand"
          :searchShrinkText="searchShrinkText ?? lang.shrink"
          @submit="handleSubmit"
          @reset="handleReset"
          @updateSearchExpand="updateSearchExpand"
        >
          <template
            v-for="name in Object.keys($slots).filter(
              (k) => !footerSlotExcludes.includes(k)
            )"
            #[name]="slotProps"
          >
            <slot :name="name" v-bind="slotProps || {}"></slot>
          </template>
        </ProFormFooter>
      </template>
    </ChildrenRender>
    <slot name="bottomExtra"></slot>
  </ElForm>
</template>

<script lang="ts" setup>
  import {
    ref,
    computed,
    watch,
    nextTick,
    onBeforeUnmount,
    useModel
  } from 'vue';
  import { ElForm } from 'element-plus';
  import type {
    ElFormInstance,
    ElFormInstanceMethods,
    ElFormItemProp
  } from '../ele-app/el';
  import { useLocale } from '../ele-config-provider/receiver';
  import { eachTree } from '../utils/common';
  import { useContentSlot } from '../ele-viewer/util';
  import { translateJsCode } from './components/render-core';
  import { ChildrenRender } from './components/render-util';
  import type { ChildrenRenderInstance } from './components/render-util';
  import ProFormFooter from './components/pro-form-footer.vue';
  import type { ProFormItemProps, ProFormItemKey } from './types';
  import { proFormProps, proFormEmits } from './props';
  const footerSlotExcludes = [
    'default',
    'topExtra',
    'bottomExtra',
    'contentExtra'
  ];
  const slotExcludes = [...footerSlotExcludes, 'footer', 'footerExtra'];

  defineOptions({ name: 'EleProForm' });

  const props = defineProps(proFormProps);

  const emit = defineEmits(proFormEmits);

  /** 表单项数据 */
  const formItems = useModel(props, 'items');

  /** 国际化语言 */
  const { lang } = useLocale('proForm', props);
  const { slotProps: config } = useContentSlot();

  /** 表单实例 */
  const formRef = ref<ElFormInstance>(null);

  /** 实例方法 */
  const exposeMethods = {} as ElFormInstanceMethods;
  [
    'validate',
    'validateField',
    'resetFields',
    'scrollToField',
    'clearValidate'
  ].forEach((key) => {
    exposeMethods[key] = (...params: any) => {
      if (!formRef.value) {
        throw new Error('formRef is null');
      }
      return formRef.value[key](...params);
    };
  });

  /** 子级实例 */
  const childrenRef = ref<ChildrenRenderInstance>(null);

  /** 搜索表单展开状态 */
  const formSearchExpand = ref(!!props.searchExpand);

  /** 编辑模式选中的表单项 */
  const currentActiveKey = ref<ProFormItemKey | undefined>(props.activeItemKey);

  /** 底栏样式 */
  const footerStyleData = computed(() => {
    return translateJsCode(
      props.footerStyle || {},
      props.model || {},
      formItems.value || [],
      formSearchExpand.value,
      props.httpRequest
    ).result;
  });

  /** 更新搜索表单展开状态 */
  const updateSearchExpand = (expand: boolean) => {
    formSearchExpand.value = expand;
    if (props.searchExpand !== expand) {
      emit('update:searchExpand', expand);
    }
  };

  /** 更新表单数据属性值 */
  const updateValue = (prop: string, value: unknown) => {
    if (prop != null && config?.label && config?.size === 1) {
      emit('updateValue', prop, value);
    }
  };

  /** 更新表单项数据 */
  const handleUpdateItemsData = (
    items: ProFormItemProps[],
    parentItem?: ProFormItemProps
  ) => {
    if (!parentItem) {
      formItems.value = items;
    } else {
      const parentItemKey = parentItem.key;
      eachTree(formItems.value, (item) => {
        if (item.key === parentItemKey) {
          item.children = items;
          return false;
        }
      });
    }
  };

  /** 更新选中的表单项 */
  const handleUpdateActiveItemKey = (key: ProFormItemKey) => {
    currentActiveKey.value = key;
    if (props.activeItemKey !== key) {
      emit('update:activeItemKey', key);
    }
  };

  /** 提交 */
  const handleSubmit = () => {
    if (formRef.value) {
      formRef.value.validate((valid) => {
        if (valid) {
          emit('submit', props.model ?? {});
        }
      });
    }
  };

  /** 重置 */
  const handleReset = () => {
    clearCodeCache();
    emit('reset');
    exposeMethods.clearValidate();
    nextTick(() => {
      exposeMethods.clearValidate();
      nextTick(() => {
        exposeMethods.clearValidate();
      });
    });
  };

  /** 表单原生的表单提交事件 */
  const handleFormSubmit = (e: MouseEvent) => {
    if (props.preventFormSubmit) {
      e.preventDefault();
    }
  };

  /** 表单校验事件 */
  const handleFormValidate = (
    prop: ElFormItemProp,
    isValid: boolean,
    message: string
  ) => {
    emit('validate', prop, isValid, message);
  };

  /** 同步搜索表单展开状态 */
  watch(
    () => props.searchExpand,
    (expand) => {
      if (formSearchExpand.value !== expand) {
        formSearchExpand.value = expand;
      }
    }
  );

  /** 同步编辑模式选中的表单项 */
  watch(
    () => props.activeItemKey,
    (key) => {
      if (currentActiveKey.value !== key) {
        currentActiveKey.value = key;
      }
    }
  );

  /** 获取表单组件的组件引用数据 */
  const getProFormRefs = (): Record<string, any> => {
    return childrenRef.value?.$refs || {};
  };

  /** 代码字符串解析缓存 */
  const codeCache = new Map<string, any>();

  /** 获取并缓存代码解析结果 */
  const getAndCacheCode = (code: string, codeResult: any) => {
    const cacheResult = codeCache.get(code);
    if (cacheResult) {
      return cacheResult;
    }
    codeCache.set(code, codeResult);
    return codeResult;
  };

  /** 清空代码解析结果缓存 */
  const clearCodeCache = () => {
    codeCache.clear();
  };

  onBeforeUnmount(() => {
    clearCodeCache();
  });

  defineExpose({
    ...exposeMethods,
    formRef,
    childrenRef,
    getProFormRefs,
    clearCodeCache
  });
</script>
