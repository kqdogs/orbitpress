<!-- 导出弹窗 -->
<template>
  <EleModal
    :form="true"
    width="460px"
    :title="locale.export"
    position="center"
    v-bind="modalProps || {}"
    v-model="visible"
  >
    <ElForm
      ref="formRef"
      :model="form"
      labelWidth="80px"
      @submit.prevent=""
      class="ele-tool-export-form"
    >
      <ElFormItem
        :label="locale.exportFileName"
        prop="fileName"
        :rules="fileNameRules"
      >
        <ElInput
          :maxlength="200"
          :clearable="true"
          v-model="form.fileName"
          :placeholder="locale.exportFileNamePlaceholder"
        />
      </ElFormItem>
      <ElFormItem :label="locale.exportSelectData">
        <ElSelect v-model="dataType" :placeholder="locale.exportSelectData">
          <ElOption
            v-if="pageData != null"
            value="pageData"
            :label="locale.exportDataTypePage"
          />
          <ElOption
            v-if="selections != null"
            value="selections"
            :label="locale.exportDataTypeSelected"
          />
          <ElOption
            v-if="datasource != null"
            value="data"
            :label="locale.exportDataTypeAll"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="locale.exportSelectColumn">
        <div
          class="ele-tool-column is-sortable"
          :class="{ 'is-dragging': isDragging }"
        >
          <div class="ele-tool-column-header">
            <div class="ele-tool-column-label">
              <ElCheckbox
                :label="locale.columnTitle"
                :modelValue="isCheckAll"
                :indeterminate="isIndeterminate"
                @update:modelValue="handleCheckAllChange"
              />
            </div>
            <div class="ele-tool-column-link" @click="handleReset">
              {{ locale.columnReset }}
            </div>
          </div>
          <ToolColumnList
            :data="colItems"
            :sortable="true"
            :allowWidth="true"
            :columnWidthPlaceholder="locale.columnWidth"
            @sortChange="handleSortChange"
            @checkedChange="handleCheckedChange"
            @colWidthChange="handleColWidthChange"
            @sortStart="handleSortStart"
            @sortEnd="handleSortEnd"
          />
        </div>
      </ElFormItem>
      <ElFormItem :label="locale.exportOther">
        <div class="ele-tool-form-options">
          <ElCheckbox :label="locale.exportOtherHeader" v-model="showHeader" />
          <ElCheckbox
            :label="locale.exportOtherFooter"
            v-model="showFooter"
            :disabled="!showSummary"
          />
          <ElCheckbox
            :label="locale.exportOtherTreeIndex"
            v-model="showTreeIndex"
            :disabled="treeIndexDisabled"
            @change="handleTreeIndexChange"
          />
        </div>
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="closeModal">{{ locale.exportCancel }}</ElButton>
      <ElButton :loading="loading" type="primary" @click="handleExport">
        {{ locale.exportOk }}
      </ElButton>
    </template>
  </EleModal>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref, reactive, watch } from 'vue';
  import {
    ElForm,
    ElFormItem,
    ElInput,
    ElSelect,
    ElOption,
    ElCheckbox,
    ElButton
  } from 'element-plus';
  import { eachTree, findTree } from '../../utils/common';
  import EleModal from '../../ele-modal/index.vue';
  import type { ElFormInstance, ElFormItemRule } from '../../ele-app/el';
  import type { EleModalProps } from '../../ele-app/plus';
  import type {
    Columns,
    DataItem,
    SpanMethod,
    SummaryMethod,
    TreeProps
  } from '../../ele-data-table/types';
  import type {
    TableLocale,
    ExportDataType,
    BeforeExport,
    ExportPlugin,
    Datasource,
    DatasourceFunction,
    FetchFunction,
    ColItem,
    TableExportParams,
    GetDatasourceResultFunction
  } from '../types';
  import {
    getExportData,
    getColItems,
    getCheckedColumns,
    getCacheColsWidth,
    //getExportColsCacheKey,
    //getCacheCols,
    columnsExportFilter,
    exportCSV
  } from '../util';
  import ToolColumnList from './tool-column-list.vue';

  const props = defineProps({
    /** 表格国际化 */
    locale: {
      type: Object as PropType<TableLocale>,
      required: true
    },
    /** 缓存本地的名称 */
    cacheKey: String,
    /** 弹窗参数 */
    modalProps: Object as PropType<EleModalProps>,
    /** 列数据 */
    columns: Array as PropType<Columns>,
    /** 表格选中数据 */
    selections: Array as PropType<DataItem[]>,
    /** 表格当前页数据 */
    pageData: Array as PropType<DataItem[]>,
    /** 表格全部数据 */
    datasource: [Array, Function] as PropType<Datasource>,
    /** 单元格合并行列方法 */
    spanMethod: Function as PropType<SpanMethod>,
    /** 表格是否有表头 */
    tableHeader: Boolean,
    /** 是否显示合计行 */
    showSummary: Boolean,
    /** 合计行文本 */
    sumText: String,
    /** 合计行自定义方法 */
    summaryMethod: Function as PropType<SummaryMethod>,
    /** 序号列起始索引 */
    pageIndex: Number,
    /** 树表字段名 */
    treeProps: Object as PropType<TreeProps>,
    /** 表格请求数据方法 */
    fetch: Function as PropType<FetchFunction>,
    /** 默认文件名 */
    defaultFileName: {
      type: String,
      default: 'list'
    },
    /** 默认数据类型 */
    defaultDataType: {
      type: String as PropType<ExportDataType>,
      default: 'pageData'
    },
    /** 默认是否勾选表尾 */
    defaultShowFooter: {
      type: Boolean,
      default: true
    },
    /** 默认是否勾选层级序号 */
    defaultShowTreeIndex: Boolean,
    /** 导出前的钩子函数 */
    beforeExport: Function as PropType<BeforeExport>,
    /** 导出插件 */
    exportPlugin: Function as PropType<ExportPlugin>,
    /** 获取数据源返回结果方法 */
    getDatasourceResult: {
      type: Function as PropType<GetDatasourceResultFunction>,
      required: true
    }
  });

  /** 弹窗是否显示 */
  const visible = ref<boolean>(false);

  /** 确定按钮加载状态 */
  const loading = ref<boolean>(false);

  /** 表单实例 */
  const formRef = ref<ElFormInstance>(null);

  /** 表单数据 */
  const form = reactive({
    /** 文件名 */
    fileName: props.defaultFileName
  });

  /** 文件名验证规则 */
  const fileNameRules: ElFormItemRule = reactive<ElFormItemRule>({
    required: true,
    message: props.locale.exportFileNamePlaceholder,
    type: 'string',
    trigger: 'blur'
  });

  /** 数据来源 */
  const dataType = ref<ExportDataType>(props.defaultDataType);

  /** 列展示数据 */
  const colItems = ref<ColItem[]>([]);

  /** 列展示是否全选 */
  const isCheckAll = ref<boolean>(false);

  /** 列展示是否半选 */
  const isIndeterminate = ref<boolean>(false);

  /** 是否显示表头 */
  const showHeader = ref<boolean>(true);

  /** 是否显示表尾 */
  const showFooter = ref<boolean>(false);

  /** 是否显示层级序号 */
  const showTreeIndex = ref<boolean>(false);

  /** 是否禁用层级序号 */
  const treeIndexDisabled = ref<boolean>(true);

  /** 是否是拖拽排序中 */
  const isDragging = ref(false);

  /** 开启确定按钮加载 */
  const showLoading = () => {
    loading.value = true;
  };

  /** 取消确定按钮加载 */
  const hideLoading = () => {
    loading.value = false;
  };

  /** 打开弹窗 */
  const openModal = () => {
    visible.value = true;
  };

  /** 关闭弹窗 */
  const closeModal = () => {
    hideLoading();
    visible.value = false;
  };

  /** 导出数据 */
  const exportData = (params?: TableExportParams) => {
    showLoading();
    const exportFileName = params?.fileName ?? form.fileName;
    const exportDataValue = params?.data || [];
    const isShowHeader = params?.showHeader ?? showHeader.value;
    const isShowFooter = params?.showFooter ?? showFooter.value;
    const isShowTreeIndex = params?.showTreeIndex ?? showTreeIndex.value;
    const exportDataType = params?.dataType ?? dataType.value;
    const exportColumns =
      params?.columns ||
      getCheckedColumns(
        props.columns,
        colItems.value,
        true,
        void 0,
        columnsExportFilter,
        false,
        colItems.value
      );
    const tableColumns =
      params?.tableColumns ||
      params?.columns ||
      getCheckedColumns(
        props.columns,
        colItems.value,
        true,
        void 0,
        columnsExportFilter,
        true,
        colItems.value
      );
    const { headerData, bodyData, footerData, bodyCols } = getExportData(
      exportDataValue,
      exportColumns,
      props.spanMethod,
      exportDataType === 'pageData' ? props.pageIndex : void 0,
      isShowFooter,
      props.sumText,
      props.summaryMethod,
      props.treeProps?.children,
      isShowTreeIndex,
      isShowHeader
    );
    const exportParams = {
      data: exportDataValue,
      columns: exportColumns,
      headerData,
      bodyData,
      footerData,
      bodyCols,
      fileName: exportFileName,
      dataType: exportDataType,
      hideLoading,
      closeModal,
      showHeader: isShowHeader,
      showFooter: isShowFooter,
      showTreeIndex: isShowTreeIndex,
      tableColumns
    };
    if (typeof props.beforeExport === 'function') {
      const flag = props.beforeExport(exportParams);
      if (flag === false) {
        return;
      }
    }
    if (props.exportPlugin == null) {
      exportCSV(exportFileName, headerData, bodyData, footerData);
      hideLoading();
      closeModal();
      return;
    }
    props
      .exportPlugin(exportParams)
      .then(() => {
        hideLoading();
        closeModal();
      })
      .catch(() => {
        hideLoading();
      });
  };

  /** 处理导出 */
  const handleExport = () => {
    formRef.value?.validate?.((valid) => {
      if (!valid) {
        return;
      }
      if (dataType.value === 'selections') {
        exportData({ data: [...(props.selections || [])] });
        return;
      }
      if (dataType.value !== 'data') {
        exportData({ data: [...(props.pageData || [])] });
        return;
      }
      if (
        props.datasource == null ||
        typeof props.datasource !== 'function' ||
        typeof props.fetch !== 'function'
      ) {
        return;
      }
      const columns = getCheckedColumns(
        props.columns,
        colItems.value,
        true,
        void 0,
        columnsExportFilter,
        false,
        colItems.value
      );
      const tableColumns = getCheckedColumns(
        props.columns,
        colItems.value,
        true,
        void 0,
        columnsExportFilter,
        true,
        colItems.value
      );
      showLoading();
      props.fetch((params) => {
        (props.datasource as DatasourceFunction)({
          ...params,
          columns,
          tableColumns
        })
          .then((result) => {
            if (result == null) {
              hideLoading();
              closeModal();
              return;
            }
            if (Array.isArray(result)) {
              exportData({ data: result as DataItem[] });
              return;
            }
            const { data } = props.getDatasourceResult(result);
            if (data == null) {
              hideLoading();
              closeModal();
              return;
            }
            exportData({ data });
          })
          .catch((e) => {
            console.error(e);
            hideLoading();
          });
      });
    });
  };

  /** 缓存配置 */
  /* const cacheSettingCols = () => {
    if (props.cacheKey) {
      localStorage.setItem(
        getExportColsCacheKey(props.cacheKey),
        JSON.stringify(colItems.value)
      );
    }
  }; */

  /** 清除缓存配置 */
  /* const cleanSettingCols = () => {
    if (props.cacheKey) {
      localStorage.removeItem(getExportColsCacheKey(props.cacheKey));
    }
  }; */

  /** 初始化列数据 */
  const initColItems = () => {
    const colsWidth = getCacheColsWidth(props.cacheKey);
    const { cols, checkAll, indeterminate } = getColItems(
      props.columns,
      props.locale,
      columnsExportFilter,
      void 0 /* getCacheCols(getExportColsCacheKey(props.cacheKey)) */,
      true,
      true,
      colsWidth
    );
    colItems.value = cols;
    isCheckAll.value = checkAll;
    isIndeterminate.value = indeterminate;
  };

  /** 列展示选中改变 */
  const handleCheckedChange = (
    item?: ColItem,
    checked?: boolean,
    type?: string
  ) => {
    let checkAll = true;
    let indeterminate = false;
    eachTree(colItems.value, (d) => {
      const flag = item == null ? type === d.type : d.uid === item.uid;
      if (flag) {
        d.checked = checked;
      }
      if (!d.checked && checkAll) {
        checkAll = false;
      }
      if (d.checked && !indeterminate) {
        indeterminate = true;
      }
      if (flag && !checkAll && indeterminate) {
        return false;
      }
    });
    isCheckAll.value = colItems.value.length > 0 && checkAll;
    isIndeterminate.value = !checkAll && indeterminate;
    //cacheSettingCols();
  };

  /** 全选或取消全选 */
  const handleCheckAllChange = (checked: boolean) => {
    isCheckAll.value = checked;
    isIndeterminate.value = false;
    eachTree(colItems.value, (d) => {
      if (d.checked !== checked) {
        d.checked = checked;
      }
    });
    //cacheSettingCols();
  };

  /** 列展示拖动顺序改变 */
  const handleSortChange = (items: ColItem[], parent?: ColItem) => {
    if (!parent) {
      colItems.value = items;
    } else {
      eachTree(colItems.value, (d) => {
        if (d.uid === parent.uid) {
          d.children = items;
          return false;
        }
      });
    }
    //cacheSettingCols();
  };

  /** 列宽输入改变 */
  const handleColWidthChange = (item: ColItem, width?: string) => {
    eachTree(colItems.value, (d) => {
      if (d.uid === item.uid) {
        d.width = width;
        return false;
      }
    });
  };

  /** 重置 */
  const handleReset = () => {
    //cleanSettingCols();
    initColItems();
  };

  /** 层级序号选择改变 */
  const handleTreeIndexChange = (checked?: boolean | string | number) => {
    if (checked) {
      handleCheckedChange(void 0, false, 'index');
    }
  };

  /** 拖拽排序开始事件 */
  const handleSortStart = () => {
    isDragging.value = true;
  };

  /** 拖拽排序结束事件 */
  const handleSortEnd = () => {
    isDragging.value = false;
  };

  /** 初始化数据 */
  watch(visible, (visible) => {
    if (visible) {
      form.fileName = props.defaultFileName;
      dataType.value = props.defaultDataType;
      initColItems();
      showHeader.value = !!props.tableHeader;
      showFooter.value = props.showSummary ? !!props.defaultShowFooter : false;
      treeIndexDisabled.value =
        !(
          props.pageData &&
          props.pageData.some(
            (d) =>
              d[props.treeProps?.children || 'children']?.length ||
              d[props.treeProps?.hasChildren || 'hasChildren']
          )
        ) && findTree(colItems.value, (c) => c.type === 'expand') == null;
      showTreeIndex.value = treeIndexDisabled.value
        ? false
        : !!props.defaultShowTreeIndex;
      //handleTreeIndexChange(showTreeIndex.value);
      return;
    }
    hideLoading();
    formRef.value?.clearValidate?.();
  });

  watch(
    () => props.locale.exportFileNamePlaceholder,
    (placeholder) => {
      fileNameRules.message = placeholder;
    }
  );

  defineExpose({
    openModal,
    closeModal,
    exportData
  });
</script>
