<!-- 增删改查构建器 -->
<template>
  <EleSplitPanel
    :space="0"
    :size="240"
    :allowCollapse="true"
    :collapseBtnOffset="2"
    v-bind="splitPanelProps || {}"
    v-model:collapse="leftSideCollapse"
    class="ele-crud-builder-wrapper"
  >
    <EleTabBar
      v-model="leftTabActive"
      :items="[
        { value: 'fields', label: '字段列表' },
        { value: 'config', label: '页面设置' },
        { value: 'templates', label: '模板库' }
      ]"
    />
    <div class="ele-crud-builder-tab-body">
      <FieldTree
        v-if="leftTabActive === 'fields'"
        :fields="crudConfig?.fields"
        :fieldEditFormItems="fieldEditFormItems"
        :proFormComponent="proFormComponent"
        :jsonEditerComponent="jsonEditerComponent"
        :itemTypeData="itemTypeData"
        :httpRequest="httpRequest"
        @deleteField="handleDeleteField"
        @addField="handleAddField"
        @updateField="handleUpdateField"
        @updateFieldChildren="handleUpdateFieldChildren"
      >
        <template
          v-for="name in Object.keys($slots).filter(
            (k) => !ownSlots.includes(k)
          )"
          #[name]="slotProps"
        >
          <slot :name="name" v-bind="slotProps || {}"></slot>
        </template>
      </FieldTree>
      <PageConfig
        v-else-if="leftTabActive === 'config'"
        :config="crudConfig"
        :pageConfigFormItems="pageConfigFormItems"
        :proFormComponent="proFormComponent"
        :proFormBuilderComponent="proFormBuilderComponent"
        :proFormBuilderProps="proFormBuilderProps"
        :codeEditerComponent="codeEditerComponent"
        :jsonEditerComponent="jsonEditerComponent"
        :itemTypeData="itemTypeData"
        :httpRequest="httpRequest"
        @updateConfigValue="handleUpdateConfigField"
        @updateFormConfig="handleUpdateFormConfig"
      >
        <template
          v-for="name in Object.keys($slots).filter(
            (k) => !ownSlots.includes(k)
          )"
          #[name]="slotProps"
        >
          <slot :name="name" v-bind="slotProps || {}"></slot>
        </template>
      </PageConfig>
      <TemplateList
        v-else-if="leftTabActive === 'templates'"
        :templateData="templateData"
        @importData="handleImportData"
      />
    </div>
    <template #body>
      <div class="ele-crud-builder-body-wrapper">
        <BodyHeader
          v-model:currentScreen="currentScreen"
          :undoDisabled="!historyDataList.length"
          :redoDisabled="!redoDataList.length"
          :config="crudConfig"
          :headerTools="headerTools"
          :proFormComponent="proFormComponent"
          :jsonEditerComponent="jsonEditerComponent"
          :codeViewerComponent="codeViewerComponent"
          :itemTypeData="itemTypeData"
          :httpRequest="httpRequest"
          @undo="handleUndo"
          @redo="handleRedo"
          @clear="handleClear"
          @importData="handleImportData"
        >
          <template v-for="name in Object.keys($slots)" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps || {}"></slot>
          </template>
        </BodyHeader>
        <div
          class="ele-crud-builder-body"
          :class="[
            { 'is-pc': currentScreen === 'pc' },
            { 'is-pad': currentScreen === 'pad' },
            { 'is-phone': currentScreen === 'phone' },
            {
              'is-show-page-card': !!(
                crudConfig?.pageConfig?.pageProps ||
                crudConfig?.pageConfig?.cardProps ||
                crudConfig?.listConfig?.cardProps ||
                (crudConfig?.searchConfig &&
                  crudConfig.searchConfig !== true &&
                  crudConfig.searchConfig.cardProps)
              )
            }
          ]"
        >
          <ElEmpty
            v-if="
              !crudConfig || !crudConfig.fields || !crudConfig.fields.length
            "
            :imageSize="80"
            class="ele-crud-builder-form-empty"
          />
          <component
            v-else
            :proFormComponent="proFormComponent"
            :itemTypeData="itemTypeData"
            :httpRequest="httpRequest"
            :screenSize="currentScreen"
            v-bind="crudConfig || {}"
            :is="crudComponent || EleCrud"
          >
            <template
              v-for="name in Object.keys($slots).filter(
                (k) => !ownSlots.includes(k)
              )"
              #[name]="slotProps"
            >
              <slot :name="name" v-bind="slotProps || {}"></slot>
            </template>
          </component>
        </div>
      </div>
    </template>
  </EleSplitPanel>
</template>

<script lang="ts" setup>
  import { ref, useModel, onBeforeUnmount } from 'vue';
  import { ElEmpty } from 'element-plus';
  import type { EleCrudProps, EleProFormProps } from '../ele-app/plusx';
  import { useMobile } from '../utils/hook';
  import { eachTree, findTree, omit } from '../utils/common';
  import EleSplitPanel from '../ele-split-panel/index.vue';
  import EleTabBar from '../ele-tab-bar/index.vue';
  import { setValue, getValue } from '../ele-pro-form/util';
  import type { ScreenSize } from '../ele-pro-form/types';
  import { deepCloneObject } from '../ele-pro-form-builder/components/build-core';
  import EleCrud from '../ele-crud/index';
  import type { CrudField } from '../ele-crud/types';
  import {
    getFieldsSearchFormItems,
    getFieldsAddFormItems,
    getFieldsEditFormItems
  } from '../ele-crud/util';
  import FieldTree from './components/field-tree.vue';
  import PageConfig from './components/page-config.vue';
  import TemplateList from './components/template-list.vue';
  import BodyHeader from './components/body-header.vue';
  import type { FormDesignType } from './types';
  import { crudBuilderProps, crudBuilderEmits } from './props';
  const ownSlots = ['default', 'headerTools'];

  defineOptions({ name: 'EleCrudBuilder' });

  const props = defineProps(crudBuilderProps);

  defineEmits(crudBuilderEmits);

  /** 增删改查配置 */
  const crudConfig = useModel(props, 'modelValue');

  /** 是否折叠左侧边栏 */
  const leftSideCollapse = ref<boolean>(false);

  /** 是否是移动端小屏幕 */
  const [isMobile] = useMobile((mobile) => {
    leftSideCollapse.value = mobile;
  });

  /** 左侧选项卡选中 */
  const leftTabActive = ref<'fields' | 'config' | 'templates'>('fields');

  /** 选中的屏幕尺寸 */
  const currentScreen = ref<ScreenSize>('pc');

  /** 历史记录数据 */
  const historyDataList = ref<Array<EleCrudProps>>([]);

  /** 恢复记录数据 */
  const redoDataList = ref<Array<EleCrudProps>>([]);

  /** 延迟存储历史记录定时器 */
  let storeHistoryTimer: number | null = null;

  /** 清除延迟存储历史记录定时器 */
  const stopStoreHistoryTimer = () => {
    if (storeHistoryTimer != null) {
      clearTimeout(storeHistoryTimer);
      storeHistoryTimer = null;
    }
  };

  /** 获取字段数据 */
  const getCrudFields = (): CrudField[] => {
    return crudConfig.value?.fields || [];
  };

  /** 赋值字段数据 */
  const setCrudFields = (fields?: CrudField[]) => {
    if (!crudConfig.value) {
      crudConfig.value = { fields: fields || [] };
      return;
    }
    crudConfig.value.fields = fields || [];
  };

  /** 获取需要缓存的配置数据 */
  const getStoreConfigData = (): EleCrudProps => {
    return deepCloneObject(crudConfig.value);
  };

  /** 设置为缓存的配置数据 */
  const setStoreConfigData = (data: EleCrudProps) => {
    crudConfig.value = data;
  };

  /** 存储历史记录 */
  const storeHistory = (delay?: boolean) => {
    stopStoreHistoryTimer();
    const undoData: EleCrudProps = getStoreConfigData();
    if (!delay) {
      historyDataList.value.push(undoData as any);
      redoDataList.value = [];
      return;
    }
    storeHistoryTimer = setTimeout(() => {
      historyDataList.value.push(undoData as any);
      redoDataList.value = [];
    }, 600) as unknown as number;
  };

  /** 删除字段 */
  const handleDeleteField = (key: string) => {
    if (key == null) {
      return;
    }
    storeHistory();
    const fieldsData = getCrudFields();
    eachTree(fieldsData, (item, index, parent) => {
      if (item.key === key) {
        if (parent) {
          if (parent.children) {
            parent.children.splice(index, 1);
          }
        } else {
          fieldsData.splice(index, 1);
        }
        return false;
      }
    });
  };

  /** 添加字段 */
  const handleAddField = (
    field: CrudField,
    parentKey?: string,
    index?: number
  ) => {
    if (!field) {
      return;
    }
    storeHistory();
    if (parentKey == null) {
      if (index != null) {
        const items = getCrudFields();
        setCrudFields([...items.slice(0, index), field, ...items.slice(index)]);
      } else {
        setCrudFields([...getCrudFields(), field]);
        if (crudConfig.value != null) {
          if (field.hideInSearch !== true) {
            const items = getValue(
              crudConfig.value,
              'searchConfig.formProps.items'
            );
            if (items != null && Array.isArray(items) && items.length) {
              setValue(crudConfig.value, 'searchConfig.formProps.items', [
                ...items,
                ...getFieldsSearchFormItems([field])
              ]);
            }
          }
          if (field.hideInAdd !== true) {
            const items = getValue(
              crudConfig.value,
              'addConfig.formProps.items'
            );
            if (items != null && Array.isArray(items) && items.length) {
              setValue(crudConfig.value, 'addConfig.formProps.items', [
                ...items,
                ...getFieldsAddFormItems([field])
              ]);
            }
          }
          if (field.hideInEdit !== true) {
            const items = getValue(
              crudConfig.value,
              'editConfig.formProps.items'
            );
            if (items != null && Array.isArray(items) && items.length) {
              setValue(crudConfig.value, 'editConfig.formProps.items', [
                ...items,
                ...getFieldsEditFormItems([field])
              ]);
            }
          }
        }
      }
      return;
    }
    const parent = findTree(getCrudFields(), (item) => item.key === parentKey);
    if (parent) {
      if (parent.children) {
        if (index != null) {
          parent.children.splice(index, 0, field);
        } else {
          parent.children.push(field);
        }
      } else {
        parent.children = [field];
      }
    }
  };

  /** 修改字段 */
  const handleUpdateField = (field: CrudField) => {
    if (field == null || field.key == null) {
      return;
    }
    storeHistory();
    eachTree(getCrudFields(), (item) => {
      if (item.key === field.key) {
        Object.assign(item, field);
        return false;
      }
    });
  };

  /** 更新字段数据排序 */
  const handleUpdateFieldChildren = (data: CrudField[], parentKey?: string) => {
    storeHistory(true);
    if (parentKey == null) {
      setCrudFields(data);
      return;
    }
    eachTree(getCrudFields(), (item) => {
      if (item.key === parentKey) {
        item.children = data;
        return false;
      }
    });
  };

  /** 更新配置数据 */
  const handleUpdateConfigField = (
    field: string,
    value: any,
    delayStoreHistory?: boolean
  ) => {
    storeHistory(delayStoreHistory ?? !!field);
    if (!field) {
      const excludeFields: string[] = ['fields'];
      const temp = omit(value, excludeFields);
      if (!crudConfig.value) {
        const config: EleCrudProps = {};
        Object.assign(config, temp);
        crudConfig.value = config;
      } else {
        Object.assign(crudConfig.value, temp);
        const valueKeys = Object.keys(temp);
        Object.keys(crudConfig.value).forEach((key: string) => {
          if (
            crudConfig.value &&
            !excludeFields.includes(key) &&
            !valueKeys.includes(key) &&
            typeof crudConfig.value[key] !== 'undefined'
          ) {
            crudConfig.value[key] = void 0;
          }
        });
      }
    } else if (!crudConfig.value) {
      const config: EleCrudProps = {};
      setValue(config, field, value);
      crudConfig.value = config;
    } else {
      setValue(crudConfig.value, field, value);
    }
  };

  /** 更新表单配置 */
  const handleUpdateFormConfig = (
    data?: EleProFormProps,
    type?: FormDesignType
  ) => {
    if (type === 'search') {
      handleUpdateConfigField('searchConfig.formProps', data, false);
    } else if (type === 'add') {
      handleUpdateConfigField('addConfig.formProps', data, false);
    } else if (type === 'edit') {
      handleUpdateConfigField('editConfig.formProps', data, false);
    }
  };

  /** 撤销 */
  const handleUndo = () => {
    const data: EleCrudProps | undefined = historyDataList.value.pop() as any;
    if (!data) {
      return;
    }
    const redoData: EleCrudProps = getStoreConfigData();
    redoDataList.value.unshift(redoData as any);
    setStoreConfigData(data);
  };

  /** 恢复 */
  const handleRedo = () => {
    const data: EleCrudProps | undefined = redoDataList.value.shift() as any;
    if (!data) {
      return;
    }
    const undoData: EleCrudProps = getStoreConfigData();
    historyDataList.value.push(undoData as any);
    setStoreConfigData(data);
  };

  /** 清空 */
  const handleClear = () => {
    if (getCrudFields().length) {
      storeHistory();
      setCrudFields([]);
    }
  };

  /** 导入 */
  const handleImportData = (data: EleCrudProps) => {
    storeHistory();
    crudConfig.value = { ...data, fields: data.fields || [] };
    if (isMobile.value) {
      leftSideCollapse.value = true;
    }
  };

  onBeforeUnmount(() => {
    stopStoreHistoryTimer();
  });
</script>
