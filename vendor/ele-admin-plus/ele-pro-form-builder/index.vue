<!-- 表单构建器 -->
<template>
  <EleSplitPanel
    :space="0"
    :size="280"
    :allowCollapse="true"
    :collapseBtnOffset="2"
    v-bind="splitPanelProps || {}"
    v-model:collapse="leftSideCollapse"
    class="ele-pro-form-builder-wrapper"
  >
    <EleTabBar
      v-model="leftTabActive"
      :items="[
        { value: 'components', label: '组件库' },
        { value: 'templates', label: '模板库' },
        { value: 'outlines', label: '大纲' }
      ]"
    />
    <div class="ele-pro-form-builder-tab-body">
      <OutlineTree
        v-if="leftTabActive === 'outlines'"
        :formItems="formProps?.items"
        v-model:currentFormItemId="currentFormItemId"
        :componentData="componentData"
        :itemTypeData="itemTypeData"
        @updateItems="handleUpdateItems"
        @updateItemChildren="handleUpdateItemChildren"
        @openTableTool="handleOpenTableTool"
        @openComponentPicker="handleOpenComponentPicker"
      />
      <TemplateList
        v-else-if="leftTabActive === 'templates'"
        :templateData="templateData"
        @importData="handleImport"
      />
      <ComponentList
        v-else
        :formItems="formProps?.items"
        :draggable="!isMobileDevice && !isMobile"
        :componentData="componentData"
        :itemTypeData="itemTypeData"
        @updateItems="handleUpdateItems"
      />
    </div>
    <template #body>
      <EleSplitPanel
        :space="0"
        :size="220"
        :reverse="true"
        :allowCollapse="true"
        :collapseBtnOffset="2"
        v-bind="rightSplitPanelProps || {}"
        v-model:collapse="rightSideCollapse"
        class="ele-pro-form-builder-main-wrapper"
      >
        <template #body>
          <div class="ele-pro-form-builder-body-wrapper">
            <BodyHeader
              v-model:currentScreen="currentScreen"
              :undoDisabled="!historyDataList.length"
              :redoDisabled="!redoDataList.length"
              :formProps="formProps"
              :headerTools="headerTools"
              :proFormComponent="proFormComponent"
              :jsonEditerComponent="jsonEditerComponent"
              :codeViewerComponent="codeViewerComponent"
              :itemTypeData="itemTypeData"
              :componentData="componentData"
              :httpRequest="httpRequest"
              @undo="handleUndo"
              @redo="handleRedo"
              @clear="handleClear"
              @previewFormSubmit="handlePreviewFormSubmit"
              @importData="handleImport"
            >
              <template v-for="name in Object.keys($slots)" #[name]="slotProps">
                <slot :name="name" v-bind="slotProps || {}"></slot>
              </template>
            </BodyHeader>
            <BodyForm
              :formProps="formProps"
              :componentData="componentData"
              v-model:currentFormItemId="currentFormItemId"
              :currentScreen="currentScreen"
              :proFormComponent="proFormComponent"
              :itemTypeData="itemTypeData"
              :httpRequest="httpRequest"
              @updateItems="handleUpdateItems"
              @openTableTool="handleOpenTableTool"
              @updateFormItems="handleUpdateFormItems"
            >
              <template v-for="name in Object.keys($slots)" #[name]="slotProps">
                <slot :name="name" v-bind="slotProps || {}"></slot>
              </template>
            </BodyForm>
          </div>
        </template>
        <EleTabBar
          v-model="rightTabActive"
          :items="[
            { value: 'itemProps', label: '属性设置' },
            { value: 'formProps', label: '表单设置' }
          ]"
        />
        <div class="ele-pro-form-builder-tab-body">
          <PropsForm
            v-if="rightTabActive === 'itemProps'"
            :formProps="formProps"
            v-model:currentFormItemId="currentFormItemId"
            :configFormPresetProps="configFormPresetProps"
            :componentData="componentData"
            :proFormComponent="proFormComponent"
            :codeEditerComponent="codeEditerComponent"
            :jsonEditerComponent="jsonEditerComponent"
            :htmlEditerComponent="htmlEditerComponent"
            :itemTypeData="itemTypeData"
            :httpRequest="httpRequest"
            @updateItem="handleUpdateFormItemProp"
            @updateItems="handleUpdateItems"
            @sortItemChildren="handleSortItemChildren"
            @openComponentPicker="handleOpenComponentPicker"
          >
            <template v-for="name in Object.keys($slots)" #[name]="slotProps">
              <slot :name="name" v-bind="slotProps || {}"></slot>
            </template>
          </PropsForm>
          <ConfigForm
            v-else
            :formProps="formProps"
            :configFormItems="configFormItems"
            :configFormPresetProps="configFormPresetProps"
            :proFormComponent="proFormComponent"
            :jsonEditerComponent="jsonEditerComponent"
            :itemTypeData="itemTypeData"
            :httpRequest="httpRequest"
            @updateFormProp="handleUpdateFormProp"
          >
            <template v-for="name in Object.keys($slots)" #[name]="slotProps">
              <slot :name="name" v-bind="slotProps || {}"></slot>
            </template>
          </ConfigForm>
        </div>
      </EleSplitPanel>
    </template>
    <TableToolMenu
      ref="tableToolMenuRef"
      :formItems="formProps?.items"
      :componentData="componentData"
      @updateItems="handleUpdateItems"
    />
    <ComponentPicker
      v-model="componentPickerOption.visible"
      :addParentFormItemId="componentPickerOption.addParentFormItemId"
      :editFormItemId="componentPickerOption.editFormItemId"
      :editFormItemType="componentPickerOption.editFormItemType"
      :formItems="formProps?.items"
      :componentData="componentData"
      :itemTypeData="itemTypeData"
      @updateItems="handleUpdateItems"
    />
  </EleSplitPanel>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch, useModel, onBeforeUnmount } from 'vue';
  import type { EleProFormProps } from '../ele-app/plusx';
  import { findTree, eachTree, omit } from '../utils/common';
  import { useMobile, useMobileDevice } from '../utils/hook';
  import { setValue } from '../ele-pro-form/util';
  import type {
    ProFormItemKey,
    ProFormItemProps,
    ScreenSize
  } from '../ele-pro-form/types';
  import EleSplitPanel from '../ele-split-panel/index.vue';
  import EleTabBar from '../ele-tab-bar/index.vue';
  import ComponentList from './components/component-list.vue';
  import TemplateList from './components/template-list.vue';
  import OutlineTree from './components/outline-tree.vue';
  import BodyHeader from './components/body-header.vue';
  import BodyForm from './components/body-form.vue';
  import PropsForm from './components/props-form.vue';
  import ConfigForm from './components/config-form.vue';
  import TableToolMenu from './components/table-tool-menu.vue';
  import ComponentPicker from './components/component-picker.vue';
  import { deepCloneObject } from './components/build-core';
  import type { UpdateItemsResult, ComponentPickerOption } from './types';
  import { proFormBuilderProps, proFormBuilderEmits } from './props';

  defineOptions({ name: 'EleProFormBuilder' });

  const props = defineProps(proFormBuilderProps);

  const emit = defineEmits(proFormBuilderEmits);

  /** 表单属性 */
  const formProps = useModel(props, 'modelValue');

  /** 是否折叠左侧边栏 */
  const leftSideCollapse = ref<boolean>(false);

  /** 是否折叠右侧边栏 */
  const rightSideCollapse = ref<boolean>(false);

  /** 是否是移动端小屏幕 */
  const [isMobile] = useMobile((mobile) => {
    leftSideCollapse.value = mobile;
    rightSideCollapse.value = mobile;
  });

  /** 是否是移动端触摸设备 */
  const [isMobileDevice] = useMobileDevice();

  /** 左侧选项卡选中 */
  const leftTabActive = ref<'components' | 'templates' | 'outlines'>(
    'components'
  );

  /** 右侧选项卡选中 */
  const rightTabActive = ref<'itemProps' | 'formProps'>('formProps');

  /** 选中的表单项 key */
  const currentFormItemId = ref<ProFormItemKey>();

  /** 选中的屏幕尺寸 */
  const currentScreen = ref<ScreenSize>('pc');

  /** 历史记录数据 */
  const historyDataList = ref<EleProFormProps[]>([]);

  /** 恢复记录数据 */
  const redoDataList = ref<EleProFormProps[]>([]);

  /** 表格更多操作的下拉菜单组件 */
  const tableToolMenuRef = ref<any>(null);

  /** 组件选择弹窗配置 */
  const componentPickerOption = reactive<ComponentPickerOption>({
    visible: false,
    addParentFormItemId: void 0,
    editFormItemId: void 0,
    editFormItemType: void 0
  });

  /** 延迟存储历史记录定时器 */
  let storeHistoryTimer: number | null = null;

  /** 清除延迟存储历史记录定时器 */
  const stopStoreHistoryTimer = () => {
    if (storeHistoryTimer != null) {
      clearTimeout(storeHistoryTimer);
      storeHistoryTimer = null;
    }
  };

  /** 获取表单项数据 */
  const getFormItems = (): ProFormItemProps[] => {
    return formProps.value?.items || [];
  };

  /** 赋值表单项数据 */
  const setFormItems = (items?: ProFormItemProps[]) => {
    if (!formProps.value) {
      formProps.value = Object.assign({}, props.proFormInitialProps || {}, {
        items: items || []
      });
      return;
    }
    const data = formProps.value;
    if (!data.items && props.proFormInitialProps) {
      const keys: any = Object.keys(data).filter(
        (k) => typeof data[k] !== 'undefined'
      );
      Object.assign(formProps.value, omit(props.proFormInitialProps, keys), {
        items: items || []
      });
      return;
    }
    formProps.value.items = items || [];
  };

  /** 更新表单属性值 */
  const setFormPropValue = (field: string, value: any, store?: boolean) => {
    if (store) {
      storeHistory(!!field);
    }
    if (!formProps.value) {
      formProps.value = { items: [] };
    }
    if (!field) {
      const excludeFields: (keyof EleProFormProps)[] = ['items'];
      const temp = omit(value as EleProFormProps, excludeFields);
      Object.assign(formProps.value, temp);
      const valueKeys = Object.keys(temp);
      Object.keys(formProps.value).forEach((key: keyof EleProFormProps) => {
        if (
          formProps.value &&
          !excludeFields.includes(key) &&
          !valueKeys.includes(key) &&
          typeof formProps.value[key] !== 'undefined'
        ) {
          formProps.value[key] = void 0;
        }
      });
    } else {
      setValue(formProps.value, field, value);
    }
  };

  /** 更新表单项属性值 */
  const updateFormItemProp = (
    formItemId: ProFormItemKey,
    field: string,
    value: any,
    store?: boolean
  ) => {
    const item = findTree(getFormItems(), (item) => item.key === formItemId);
    if (item) {
      if (store) {
        storeHistory(!!field);
      }
      if (!field) {
        const excludeFields: (keyof ProFormItemProps)[] = ['key', 'children'];
        const temp = omit(value as ProFormItemProps, excludeFields);
        Object.assign(item, temp);
        const valueKeys = Object.keys(temp);
        Object.keys(item).forEach((key: keyof ProFormItemProps) => {
          if (
            item &&
            !excludeFields.includes(key) &&
            !valueKeys.includes(key) &&
            typeof item[key] !== 'undefined'
          ) {
            item[key] = void 0;
          }
        });
      } else {
        setValue(item, field, value);
      }
    }
  };

  /** 删除表单项 */
  const deleteFormItem = (formItemId: ProFormItemKey) => {
    if (
      currentFormItemId.value != null &&
      currentFormItemId.value === formItemId
    ) {
      currentFormItemId.value = void 0;
    }
    const formItemsData = getFormItems();
    eachTree(formItemsData, (item, index, parent) => {
      if (item.key === formItemId) {
        if (parent) {
          if (parent.children) {
            parent.children.splice(index, 1);
          }
        } else {
          formItemsData.splice(index, 1);
        }
        return false;
      }
    });
  };

  /** 更新表单属性 */
  const handleUpdateFormProp = (field: string, value: any) => {
    setFormPropValue(field, value, true);
  };

  /** 更新表单项属性 */
  const handleUpdateFormItemProp = (
    formItemId: ProFormItemKey,
    field: string,
    value: any
  ) => {
    updateFormItemProp(formItemId, field, value, true);
  };

  /** 更新表单项数据 */
  const handleUpdateItems = ({
    addItems,
    updateItems,
    deleteItemIds
  }: UpdateItemsResult) => {
    hideTableTool();
    componentPickerOption.visible = false;
    componentPickerOption.addParentFormItemId = void 0;
    componentPickerOption.editFormItemId = void 0;
    componentPickerOption.editFormItemType = void 0;
    if (addItems.length || deleteItemIds.length || updateItems.length) {
      storeHistory();
    }
    updateItems.forEach((effect) => {
      updateFormItemProp(effect.itemId, effect.field, effect.value);
    });
    addItems.forEach(({ item, parentItemId, index }) => {
      if (!item) {
        return;
      }
      if (parentItemId == null) {
        if (index != null) {
          const items = getFormItems();
          setFormItems([...items.slice(0, index), item, ...items.slice(index)]);
        } else {
          setFormItems([...getFormItems(), item]);
        }
        return;
      }
      const parent = findTree(
        getFormItems(),
        (item) => item.key === parentItemId
      );
      if (parent) {
        if (parent.children) {
          if (index != null) {
            parent.children.splice(index, 0, item);
          } else {
            parent.children.push(item);
          }
        } else {
          parent.children = [item];
        }
      }
    });
    deleteItemIds.forEach((formItemId) => {
      deleteFormItem(formItemId);
    });
    if (addItems.length && isMobile.value) {
      leftSideCollapse.value = true;
    }
  };

  /** 更新表单项子级顺序 */
  const handleSortItemChildren = (
    childIds: ProFormItemKey[],
    formItemId: string
  ) => {
    const item = findTree(getFormItems(), (item) => item.key === formItemId);
    if (item && item.children) {
      storeHistory();
      item.children.sort((a, b) => {
        const aIndex = a.key == null ? -1 : childIds.indexOf(a.key);
        const bIndex = b.key == null ? -1 : childIds.indexOf(b.key);
        return aIndex - bIndex;
      });
    }
  };

  /** 更新表单项排序后的数据 */
  const handleUpdateItemChildren = (
    data: ProFormItemProps[],
    parentKey?: ProFormItemKey
  ) => {
    hideTableTool();
    storeHistory(true);
    if (parentKey == null) {
      setFormItems(data);
      return;
    }
    eachTree(getFormItems(), (item) => {
      if (item.key === parentKey) {
        item.children = data;
        return false;
      }
    });
  };

  /** 更新表单项数据 */
  const handleUpdateFormItems = (items: ProFormItemProps[]) => {
    handleUpdateItemChildren(items);
  };

  /** 获取需要缓存的配置数据 */
  const getStoreConfigData = () => {
    return deepCloneObject(formProps.value);
  };

  /** 设置为缓存的配置数据 */
  const setStoreConfigData = (data: EleProFormProps) => {
    formProps.value = data;
  };

  /** 存储历史记录 */
  const storeHistory = (delay?: boolean) => {
    stopStoreHistoryTimer();
    const undoData = getStoreConfigData();
    if (!delay) {
      historyDataList.value.push(undoData);
      redoDataList.value = [];
      return;
    }
    storeHistoryTimer = setTimeout(() => {
      historyDataList.value.push(undoData);
      redoDataList.value = [];
    }, 600) as unknown as number;
  };

  /** 撤销 */
  const handleUndo = () => {
    const data = historyDataList.value.pop();
    if (!data) {
      return;
    }
    const redoData = getStoreConfigData();
    redoDataList.value.unshift(redoData);
    setStoreConfigData(data);
    currentFormItemId.value = void 0;
  };

  /** 恢复 */
  const handleRedo = () => {
    const data = redoDataList.value.shift();
    if (!data) {
      return;
    }
    const undoData = getStoreConfigData();
    historyDataList.value.push(undoData);
    setStoreConfigData(data);
    currentFormItemId.value = void 0;
  };

  /** 清空表单项 */
  const handleClear = () => {
    if (getFormItems().length) {
      storeHistory();
      setFormItems([]);
      currentFormItemId.value = void 0;
    }
  };

  /** 导入 */
  const handleImport = (data: EleProFormProps) => {
    storeHistory();
    formProps.value = { ...data, items: data.items || [] };
    currentFormItemId.value = void 0;
    if (isMobile.value) {
      leftSideCollapse.value = true;
      rightSideCollapse.value = true;
    }
  };

  /** 打开表格更多操作 */
  const handleOpenTableTool = (formItemId: string, el?: HTMLElement) => {
    tableToolMenuRef.value && tableToolMenuRef.value.openMenu(formItemId, el);
  };

  /** 关闭表格更多操作 */
  const hideTableTool = () => {
    tableToolMenuRef.value && tableToolMenuRef.value.hideMenu();
  };

  /** 打开添加子级的组件选择弹窗 */
  const handleOpenComponentPicker = (
    formItemId: string,
    formItemType?: string
  ) => {
    if (formItemType != null) {
      componentPickerOption.addParentFormItemId = void 0;
      componentPickerOption.editFormItemId = formItemId;
      componentPickerOption.editFormItemType = formItemType;
    } else {
      componentPickerOption.addParentFormItemId = formItemId;
      componentPickerOption.editFormItemId = void 0;
      componentPickerOption.editFormItemType = void 0;
    }
    componentPickerOption.visible = true;
  };

  /** 预览表单提交事件 */
  const handlePreviewFormSubmit = (data: Record<string, any>) => {
    emit('previewFormSubmit', data);
  };

  /** 更新右侧选项卡选中 */
  watch(currentFormItemId, (formItemId) => {
    if (formItemId != null) {
      if (rightTabActive.value !== 'itemProps') {
        rightTabActive.value = 'itemProps';
      }
    } else if (!getFormItems().length && rightTabActive.value !== 'formProps') {
      rightTabActive.value = 'formProps';
    }
  });

  onBeforeUnmount(() => {
    stopStoreHistoryTimer();
  });
</script>
