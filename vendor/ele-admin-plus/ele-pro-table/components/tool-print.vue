<!-- 打印弹窗 -->
<template>
  <EleModal
    :form="true"
    width="460px"
    :title="locale.print"
    position="center"
    v-bind="modalProps || {}"
    v-model="visible"
  >
    <ElForm labelWidth="80px" @submit.prevent="" class="ele-tool-print-form">
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
      <ElButton :loading="loading" type="primary" @click="handlePrint">
        {{ locale.exportOk }}
      </ElButton>
    </template>
  </EleModal>
  <ElePrinter
    target="_iframe"
    v-bind="printerProps || {}"
    v-model="printOptions.printing"
    @done="handlePrintDone"
  >
    <slot name="printTop" :data="printOptions.data"></slot>
    <EleTable
      :border="true"
      :printSkin="true"
      :hasHeader="printOptions.hasHeader"
      :hasFooter="printOptions.hasFooter"
      :style="tableStyle"
      v-bind="tableProps || {}"
    >
      <colgroup>
        <col
          v-for="col in printOptions.bodyCols"
          :key="col.key"
          :width="col.width"
        />
      </colgroup>
      <thead v-if="printOptions.hasHeader">
        <tr v-for="(item, index) in printOptions.headerData" :key="index">
          <template v-for="(col, columnIndex) in item" :key="col.key">
            <template v-if="col.isTreeIndex">
              <th
                v-if="col.rowspan !== 0 && col.colspan !== 0"
                :colspan="col.colspan"
                :rowspan="col.rowspan"
                class="ele-print-tree-index"
              ></th>
            </template>
            <ToolPrintHeaderCell
              v-else-if="col.rowspan !== 0 && col.colspan !== 0"
              :col="col"
              :columnIndex="columnIndex"
              :headerCellStyle="headerCellStyle"
              :headerCellClass="headerCellClassName"
            >
              <template
                v-for="name in Object.keys($slots).filter(
                  (k) => !ownSlots.includes(k)
                )"
                #[name]="slotProps"
              >
                <slot :name="name" v-bind="slotProps || {}"></slot>
              </template>
            </ToolPrintHeaderCell>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in printOptions.bodyData" :key="index">
          <template v-for="(col, columnIndex) in item" :key="col.key">
            <template v-if="col.isExpandCell">
              <td
                v-if="col.rowspan !== 0 && col.colspan !== 0"
                :rowspan="col.rowspan"
                :colspan="col.colspan"
                :style="{ paddingLeft: 0, paddingRight: 0 }"
                class="ele-print-expand-td"
              >
                <slot
                  v-if="
                    col.column &&
                    (col.column.printSlot || col.column.slot) &&
                    !ownSlots.includes(
                      (col.column.printSlot || col.column.slot) as string
                    )
                  "
                  :name="col.column.printSlot || col.column.slot"
                  v-bind="{
                    row: col.row,
                    column: col.column,
                    $index: col.index
                  }"
                ></slot>
              </td>
            </template>
            <template v-else-if="col.isTreeIndex">
              <td
                v-if="col.rowspan !== 0 && col.colspan !== 0"
                :colspan="col.colspan"
                :rowspan="col.rowspan"
                :style="{
                  paddingLeft: 0,
                  paddingRight: 0,
                  textAlign: 'center',
                  verticalAlign: 'top',
                  borderLeftColor: col.hideLeftBorder ? 'transparent' : void 0
                }"
                class="ele-print-tree-index"
                :class="{
                  'is-placeholder': col.text == null || col.text === ''
                }"
              >
                {{ col.text }}
              </td>
            </template>
            <ToolPrintBodyCell
              v-else-if="col.rowspan !== 0 && col.colspan !== 0"
              :col="col"
              :columnIndex="columnIndex"
              :bodyCellStyle="cellStyle"
              :bodyCellClass="cellClassName"
            >
              <template
                v-for="name in Object.keys($slots).filter(
                  (k) => !ownSlots.includes(k)
                )"
                #[name]="slotProps"
              >
                <slot :name="name" v-bind="slotProps || {}"></slot>
              </template>
            </ToolPrintBodyCell>
          </template>
        </tr>
      </tbody>
      <tfoot v-if="printOptions.hasFooter">
        <tr v-for="(item, index) in printOptions.footerData" :key="index">
          <template v-for="col in item">
            <td
              v-if="col.rowspan !== 0 && col.colspan !== 0"
              :key="col.key"
              :colspan="col.colspan"
              :rowspan="col.rowspan"
            >
              <CellRender
                v-if="!col.isExpandCell"
                :render="() => col.text"
                :params="[]"
              />
            </td>
          </template>
        </tr>
      </tfoot>
    </EleTable>
    <slot name="printBottom" :data="printOptions.data"></slot>
  </ElePrinter>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref, reactive, watch, nextTick } from 'vue';
  import {
    ElForm,
    ElFormItem,
    ElSelect,
    ElOption,
    ElCheckbox,
    ElButton
  } from 'element-plus';
  import { eachTree, findTree } from '../../utils/common';
  import EleModal from '../../ele-modal/index.vue';
  import ElePrinter from '../../ele-printer/index.vue';
  import EleTable from '../../ele-table/index.vue';
  import { CellRender } from '../../ele-virtual-table/util';
  import type { StyleValue } from '../../ele-app/types';
  import type {
    EleModalProps,
    ElePrinterProps,
    EleTableProps
  } from '../../ele-app/plus';
  import type {
    Columns,
    DataItem,
    SpanMethod,
    SummaryMethod,
    CellStyle,
    CellClass,
    HeaderCellStyle,
    HeaderCellClass,
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
    TablePrintOptions,
    TableExportParams,
    GetDatasourceResultFunction
  } from '../types';
  import {
    getExportData,
    getColItems,
    getCheckedColumns,
    getCacheColsWidth,
    columnsPrintFilter
  } from '../util';
  import ToolColumnList from './tool-column-list.vue';
  import ToolPrintBodyCell from './tool-print-body-cell.vue';
  import ToolPrintHeaderCell from './tool-print-header-cell.vue';
  const ownSlots = ['printTop', 'printBottom'];

  defineOptions({ name: 'ToolPrint' });

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
    /** 打印组件参数 */
    printerProps: Object as PropType<ElePrinterProps>,
    /** 打印表格参数 */
    tableProps: Object as PropType<EleTableProps>,
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
    /** 自定义表格样式 */
    tableStyle: Object as PropType<StyleValue>,
    /** 单元格样式 */
    cellStyle: [Object, Function] as PropType<CellStyle>,
    /** 单元格类名自定义 */
    cellClassName: [String, Function] as PropType<CellClass>,
    /** 单元格样式 */
    headerCellStyle: [Object, Function] as PropType<HeaderCellStyle>,
    /** 单元格类名自定义 */
    headerCellClassName: [String, Function] as PropType<HeaderCellClass>,
    /** 序号列起始索引 */
    pageIndex: Number,
    /** 树表字段名 */
    treeProps: Object as PropType<TreeProps>,
    /** 表格请求数据方法 */
    fetch: Function as PropType<FetchFunction>,
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
    /** 打印前的钩子函数 */
    beforePrint: Function as PropType<BeforeExport>,
    /** 打印插件 */
    printPlugin: Function as PropType<ExportPlugin>,
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

  /** 打印参数 */
  const printOptions: TablePrintOptions = reactive<TablePrintOptions>({
    printing: false,
    headerData: [],
    bodyData: [],
    footerData: [],
    hasHeader: false,
    hasFooter: false,
    bodyCols: [],
    data: []
  });

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

  /** 打印结束事件 */
  const handlePrintDone = () => {
    hideLoading();
  };

  /** 打印数据 */
  const printData = (params?: TableExportParams) => {
    showLoading();
    const printDataValue = params?.data || [];
    const isShowHeader = params?.showHeader ?? showHeader.value;
    const isShowFooter = params?.showFooter ?? showFooter.value;
    const isShowTreeIndex = params?.showTreeIndex ?? showTreeIndex.value;
    const printDataType = params?.dataType ?? dataType.value;
    const printColumns =
      params?.columns ||
      getCheckedColumns(
        props.columns,
        colItems.value,
        true,
        void 0,
        columnsPrintFilter,
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
        columnsPrintFilter,
        true,
        colItems.value
      );
    const { headerData, bodyData, footerData, bodyCols } = getExportData(
      printDataValue,
      printColumns,
      props.spanMethod,
      printDataType === 'pageData' ? props.pageIndex : void 0,
      isShowFooter,
      props.sumText,
      props.summaryMethod,
      props.treeProps?.children,
      isShowTreeIndex,
      isShowHeader
    );
    const printParams = {
      data: printDataValue,
      columns: printColumns,
      headerData,
      bodyData,
      footerData,
      bodyCols,
      dataType: printDataType,
      hideLoading,
      closeModal,
      showHeader: isShowHeader,
      showFooter: isShowFooter,
      showTreeIndex: isShowTreeIndex,
      tableColumns
    };
    if (typeof props.beforePrint === 'function') {
      const flag = props.beforePrint(printParams);
      if (flag === false) {
        return;
      }
    }
    if (props.printPlugin == null) {
      printOptions.data = printDataValue;
      printOptions.headerData = headerData;
      printOptions.bodyData = bodyData;
      printOptions.footerData = footerData;
      printOptions.hasHeader = !!printOptions.headerData.length;
      printOptions.hasFooter = !!printOptions.footerData.length;
      printOptions.bodyCols = bodyCols;
      nextTick(() => {
        printOptions.printing = true;
      });
      return;
    }
    props
      .printPlugin(printParams)
      .then(() => {
        hideLoading();
        closeModal();
      })
      .catch(() => {
        hideLoading();
      });
  };

  /** 处理打印 */
  const handlePrint = () => {
    if (dataType.value === 'selections') {
      printData({ data: [...(props.selections || [])] });
      return;
    }
    if (dataType.value !== 'data') {
      printData({ data: [...(props.pageData || [])] });
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
      columnsPrintFilter,
      false,
      colItems.value
    );
    const tableColumns = getCheckedColumns(
      props.columns,
      colItems.value,
      true,
      void 0,
      columnsPrintFilter,
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
            printData({ data: result as DataItem[] });
            return;
          }
          const { data } = props.getDatasourceResult(result);
          if (data == null) {
            hideLoading();
            closeModal();
            return;
          }
          printData({ data });
        })
        .catch((e) => {
          console.error(e);
          hideLoading();
        });
    });
  };

  /** 初始化列数据 */
  const initColItems = () => {
    const colsWidth = getCacheColsWidth(props.cacheKey);
    const { cols, checkAll, indeterminate } = getColItems(
      props.columns,
      props.locale,
      columnsPrintFilter,
      void 0,
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
    printOptions.data = [];
    printOptions.headerData = [];
    printOptions.bodyData = [];
    printOptions.footerData = [];
    printOptions.bodyCols = [];
    printOptions.hasHeader = false;
    printOptions.hasFooter = false;
    printOptions.printing = false;
    hideLoading();
  });

  defineExpose({
    openModal,
    closeModal,
    printData
  });
</script>
