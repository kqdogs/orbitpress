<!-- 高级表格 -->
<template>
  <EleLoading
    v-bind="props.loadingProps || {}"
    :loading="tableLoading"
    class="ele-pro-table"
    :class="[
      { 'is-maximized': tableMaximized },
      { 'is-border': tableProps.border },
      {
        'is-default-toolbar':
          tableToolbarProps && tableToolbarProps.theme === 'default'
      }
    ]"
    :style="
      tableMaximized
        ? { zIndex: maximizedIndex ?? globalProps.maximizedIndex }
        : void 0
    "
  >
    <slot name="topExtra"></slot>
    <!-- 工具栏 -->
    <EleToolbar v-if="tableToolbarProps" v-bind="tableToolbarProps">
      <slot name="toolbar"></slot>
      <template #tools>
        <slot name="tools"></slot>
        <TableTools
          v-if="toolNames && toolNames.length"
          :tools="toolNames"
          :size="tableSize"
          :columns="columns"
          :columnSortable="columnSortable"
          :columnFixed="columnFixed"
          :maximized="tableMaximized"
          :cacheKey="cacheKey"
          :lang="lang"
          @reload="handleRefresh"
          @update:size="handleSizeChange"
          @update:columns="handleColumnsChange"
          @update:maximized="handleMaximizedChange"
          @openExportModal="openExportModal"
          @openPrintModal="openPrintModal"
        >
          <template
            v-for="name in Object.keys($slots).filter(
              (k) => !toolsSlotExcludes.includes(k)
            )"
            #[name]="slotProps"
          >
            <slot :name="name" v-bind="slotProps || {}"></slot>
          </template>
        </TableTools>
      </template>
    </EleToolbar>
    <slot></slot>
    <!-- 表格 -->
    <EleVirtualTable v-if="virtual" v-bind="tableProps" ref="tableViewRef">
      <template
        v-for="name in Object.keys($slots).filter(
          (k) => !tableSlotExcludes.includes(k)
        )"
        #[name]="slotProps"
      >
        <slot :name="name" v-bind="slotProps || {}"></slot>
      </template>
    </EleVirtualTable>
    <EleDataTable v-else v-bind="tableProps" ref="tableViewRef">
      <template
        v-for="name in Object.keys($slots).filter(
          (k) => !tableSlotExcludes.includes(k)
        )"
        #[name]="slotProps"
      >
        <slot :name="name" v-bind="slotProps || {}"></slot>
      </template>
    </EleDataTable>
    <!-- 底栏 -->
    <div
      v-if="paginationProps || $slots.footer"
      class="ele-pro-table-footer"
      :style="footerStyle"
    >
      <slot name="footer"></slot>
      <ElePagination
        v-if="paginationProps && paginationProps.total"
        v-bind="paginationProps"
        @update:currentPage="handlePageCurrentChange"
        @update:pageSize="handlePageSizeChange"
      >
        <template
          v-for="name in Object.keys($slots).filter(
            (k) => !pageSlotExcludes.includes(k)
          )"
          #[name]="slotProps"
        >
          <slot :name="name" v-bind="slotProps || {}"></slot>
        </template>
      </ElePagination>
    </div>
    <slot name="bottomExtra"></slot>
    <ToolExport
      ref="toolExportRef"
      :locale="lang"
      :cacheKey="cacheKey"
      :modalProps="toolExportConfig.modalProps"
      :columns="toolExportConfig.columns || columns"
      :selections="selections"
      :pageData="tableData"
      :datasource="toolExportConfig.datasource"
      :spanMethod="toolExportConfig.spanMethod || spanMethod"
      :tableHeader="toolExportConfig.showHeader ?? showHeader"
      :showSummary="showSummary"
      :sumText="sumText"
      :summaryMethod="toolExportConfig.summaryMethod || summaryMethod"
      :pageIndex="tableIndex"
      :treeProps="treeProps"
      :fetch="fetch"
      :defaultFileName="toolExportConfig.fileName"
      :defaultDataType="toolExportConfig.dataType"
      :defaultShowFooter="toolExportConfig.showFooter"
      :defaultShowTreeIndex="toolExportConfig.showTreeIndex"
      :beforeExport="toolExportConfig.beforeExport"
      :exportPlugin="toolExportConfig.exportPlugin"
      :getDatasourceResult="getDatasourceResult"
    />
    <ToolPrint
      ref="toolPrintRef"
      :locale="lang"
      :cacheKey="cacheKey"
      :modalProps="toolPrintConfig.modalProps"
      :printerProps="toolPrintConfig.printerProps"
      :tableProps="toolPrintConfig.tableProps"
      :columns="toolPrintConfig.columns || columns"
      :selections="selections"
      :pageData="tableData"
      :datasource="toolPrintConfig.datasource"
      :spanMethod="toolPrintConfig.spanMethod || spanMethod"
      :tableHeader="toolPrintConfig.showHeader ?? showHeader"
      :showSummary="showSummary"
      :sumText="sumText"
      :summaryMethod="toolPrintConfig.summaryMethod || summaryMethod"
      :tableStyle="tableStyle"
      :cellStyle="cellStyle"
      :cellClassName="cellClassName"
      :headerCellStyle="headerCellStyle"
      :headerCellClassName="headerCellClassName"
      :pageIndex="tableIndex"
      :treeProps="treeProps"
      :fetch="fetch"
      :defaultDataType="toolPrintConfig.dataType"
      :defaultShowFooter="toolPrintConfig.showFooter"
      :defaultShowTreeIndex="toolPrintConfig.showTreeIndex"
      :beforePrint="toolPrintConfig.beforePrint"
      :printPlugin="toolPrintConfig.printPlugin"
      :getDatasourceResult="getDatasourceResult"
    >
      <template
        v-for="name in Object.keys($slots).filter(
          (k) => !toolsSlotExcludes.includes(k)
        )"
        #[name]="slotProps"
      >
        <slot :name="name" v-bind="slotProps || {}"></slot>
      </template>
    </ToolPrint>
  </EleLoading>
</template>

<script lang="ts" setup>
  import type { Ref } from 'vue';
  import { ref, shallowRef, computed, watch, onMounted, nextTick } from 'vue';
  import { pick, getValue, uuid } from '../utils/common';
  import type { ElEmptyProps, ElTableInstance } from '../ele-app/el';
  import type {
    ElePaginationProps,
    EleDataTableProps,
    EleToolbarProps
  } from '../ele-app/plus';
  import type { TableGlobalConfig } from '../ele-config-provider/types';
  import { useLocale, useGlobalProps } from '../ele-config-provider/receiver';
  import EleLoading from '../ele-loading/index.vue';
  import ElePagination from '../ele-pagination/index.vue';
  import type { PaginationTotal } from '../ele-pagination/types';
  import { dataTablePropKeys } from '../ele-data-table/props';
  import type {
    DataItem,
    Column,
    Columns,
    Sorter,
    Filter,
    TableSize,
    TableLoad,
    ResolveFunction,
    RowKey
  } from '../ele-data-table/types';
  import {
    useEmits,
    useMethods,
    getRowKeys,
    arrayIsChanged
  } from '../ele-data-table/util';
  import EleDataTable from '../ele-data-table/index';
  import EleVirtualTable from '../ele-virtual-table/index.vue';
  import EleToolbar from '../ele-toolbar/index.vue';
  import TableTools from './components/table-tools.vue';
  import ToolExport from './components/tool-export.vue';
  import ToolPrint from './components/tool-print.vue';
  import type {
    DatasourceParams,
    DatasourceFunction,
    DatasourceResult,
    ReloadFunction,
    DoneParams,
    DoneFunction,
    TableTool,
    FetchFunction,
    TableState,
    TableViewInstance,
    ExportConfig,
    PrintConfig,
    TableExportParams,
    GetDatasourceResultFunction
  } from './types';
  import {
    getTablePage,
    getTableLimit,
    getPaginationProps,
    getTableSize,
    getDefaultFilter,
    getResponseName,
    getRequestOrders,
    getRequestFilters,
    getRequestPages,
    getResponseResult,
    reloadData,
    sortData,
    isAutoAmend,
    getInitCacheColumns,
    cacheColWidth,
    mergeProps,
    getRowKey
  } from './util';
  import { proTableProps, proTableEmits } from './props';
  import type { ToolExportInstance, ToolPrintInstance } from './props';
  const ownSlots = [
    'default',
    'toolbar',
    'tools',
    'footer',
    'topExtra',
    'bottomExtra'
  ];
  const toolsSlotExcludes = [...ownSlots, 'empty', 'append'];
  const tableSlotExcludes = [...ownSlots, 'printTop', 'printBottom'];
  const pageSlotExcludes = [...toolsSlotExcludes, 'printTop', 'printBottom'];

  defineOptions({ name: 'EleProTable' });

  const props = defineProps(proTableProps);

  const emit = defineEmits(proTableEmits);

  defineSlots<any>();

  /** 表格当前的排序筛选搜索参数 */
  const tableState: TableState = {
    sorter: props.defaultSort ?? {},
    filter: getDefaultFilter(props.columns),
    where: props.where ?? {},
    reloadId: null
  };

  /** 全局配置 */
  const globalProps = useGlobalProps<TableGlobalConfig>('table');
  const { lang } = useLocale('table', props);

  /** 表格组件 */
  const tableViewRef = ref<TableViewInstance>(null);

  /** 获取表格组件引用 */
  const getTableRef = (): TableViewInstance | undefined => {
    return tableViewRef.value;
  };

  /** 表格组件原本的事件和实例方法 */
  const events = useEmits(emit);
  const methods = useMethods(() => getTableRef() as ElTableInstance);

  /** 虚拟表格原本的事件 */
  const virtualTableEvents = {
    onEndEeached: (params: any) => {
      emit('endEeached', params);
    },
    onScroll: (params: any) => {
      emit('scroll', params);
    },
    onRowsRendered: (params: any) => {
      emit('rowsRendered', params);
    }
  };

  /** 导出组件 */
  const toolExportRef = ref<ToolExportInstance>(null);

  /** 打印组件 */
  const toolPrintRef = ref<ToolPrintInstance>(null);

  /** 当前页数据 */
  const tableData = ref<DataItem[]>([]);

  /** 当前页码 */
  const tablePage = ref<number>(
    getTablePage(props.pagination, globalProps.value.pagination)
  );

  /** 每页显示数量 */
  const tableLimit = ref<number>(
    getTableLimit(props.pagination, globalProps.value.pagination)
  );

  /** 数据总数量 */
  const tableTotal = ref<PaginationTotal>(0);

  /** 数据请求状态 */
  const tableLoading = ref<boolean>(props.loading);

  /** 表格列配置 */
  const tableCols: Ref<Columns> = ref<Columns>([]);

  /** 表格尺寸 */
  const tableSize = ref<TableSize>(
    getTableSize(props.cacheKey, props.size, globalProps.value.size)
  );

  /** 是否最大化 */
  const tableMaximized = ref<boolean>(props.maximized);

  /** 错误信息 */
  const errorText = ref<string>('');

  /** 缓存数据 */
  const cacheData = ref<DataItem[] | undefined>();

  /** 表格的rowKey */
  const tableRowKey = shallowRef<RowKey>(getRowKey(props.rowKey));

  /** 表格索引开始序号 */
  const tableIndex = computed<number>(() => {
    return ((tablePage.value ?? 1) - 1) * (tableLimit.value ?? 0) + 1;
  });

  /** 表格当前索引开始序号 */
  const tableCurrentIndex = ref(tableIndex.value);

  /** 分页组件属性 */
  const paginationProps = computed<ElePaginationProps | null>(() => {
    return getPaginationProps(
      tableSize.value,
      props.pagination,
      globalProps.value.pagination,
      {
        total: tableTotal.value,
        pageSize: tableLimit.value,
        currentPage: tablePage.value,
        hasNext: tableData.value.length >= tableLimit.value
      }
    );
  });

  /** 空组件属性 */
  const tableEmptyProps = computed<boolean | ElEmptyProps>(() => {
    return mergeProps<ElEmptyProps>(
      props.emptyProps,
      globalProps.value.emptyProps
    );
  });

  /** 是否是方法数据源 */
  const isFunctionSource = computed<boolean>(() => {
    return typeof props.datasource === 'function';
  });

  /** 表格组件属性 */
  const tableProps = computed<EleDataTableProps>(() => {
    const isMaximized = tableMaximized.value && props.maximizedHeight;
    const options: any = {
      ...pick(props, dataTablePropKeys as any),
      height: isMaximized ? props.maximizedHeight : props.height,
      border: props.border ?? globalProps.value.border ?? false,
      stripe: props.stripe ?? globalProps.value.stripe ?? false,
      load: tableLoad,
      size: tableSize.value,
      data: tableData.value,
      columns: tableCols.value,
      cacheData: cacheData.value,
      errorText: errorText.value,
      pageIndex: tableCurrentIndex.value,
      emptyProps: tableEmptyProps.value,
      rowHeight: props.virtual ? props.rowHeight : void 0,
      rowKey: tableRowKey.value,
      style: props.tableStyle,
      class: 'ele-pro-table-view',
      ...events,
      onSelectionChange: handleSelectionChange,
      onSortChange: handleSortChange,
      onFilterChange: handleFilterChange,
      onCurrentChange: handleCurrentChange,
      onHeaderDragend: handleHeaderDragend
    };
    if (props.virtual) {
      Object.assign(options, virtualTableEvents);
    }
    return options;
  });

  /** 表格工具按钮布局 */
  const toolNames = computed<TableTool[]>(() => {
    const tools = props.tools ?? globalProps.value.tools ?? true;
    if (tools === true) {
      return ['reload', 'size', 'columns', 'maximized'];
    }
    return tools || [];
  });

  /** 表头工具栏属性 */
  const tableToolbarProps = computed<false | EleToolbarProps>(() => {
    const result = mergeProps<EleToolbarProps>(
      props.toolbar,
      globalProps.value.toolbar
    );
    return result === true ? {} : result;
  });

  /** 表格导出配置 */
  const toolExportConfig = computed<ExportConfig>(() => {
    const globalExportConfig = globalProps.value.exportConfig || {};
    const userExportConfig = props.exportConfig || {};
    return {
      ...globalExportConfig,
      ...userExportConfig,
      modalProps: {
        ...(globalExportConfig.modalProps || {}),
        ...(userExportConfig.modalProps || {})
      }
    };
  });

  /** 表格打印配置 */
  const toolPrintConfig = computed<PrintConfig>(() => {
    const globalPrintConfig = globalProps.value.printConfig || {};
    const userPrintConfig = props.printConfig || {};
    return {
      ...globalPrintConfig,
      ...userPrintConfig,
      modalProps: {
        ...(globalPrintConfig.modalProps || {}),
        ...(userPrintConfig.modalProps || {})
      },
      printerProps: {
        ...(globalPrintConfig.printerProps || {}),
        ...(userPrintConfig.printerProps || {})
      },
      tableProps: {
        ...(globalPrintConfig.tableProps || {}),
        ...(userPrintConfig.tableProps || {})
      }
    };
  });

  /** 获取数据源请求参数 */
  const getRequestParams = (parent?: DataItem): DatasourceParams => {
    const { sorter, filter } = tableState;
    const orders = getRequestOrders(
      sorter,
      props.request,
      globalProps.value.request
    );
    return {
      page: tablePage.value,
      limit: tableLimit.value,
      pages: getRequestPages(
        tablePage.value,
        tableLimit.value,
        props.request,
        globalProps.value.request
      ),
      where: Object.assign({}, tableState.where),
      orders,
      filters: getRequestFilters(filter),
      sorter,
      filter,
      parent,
      columns: tableCols.value
    };
  };

  /** 获取数据源返回结果 */
  const getDatasourceResult: GetDatasourceResultFunction = (response) => {
    const parseData = props.parseData ?? globalProps.value.parseData;
    const result = parseData ? parseData(response) : response;
    return getResponseResult(
      result,
      props.response,
      globalProps.value.response,
      props.lazy,
      props.treeProps
    );
  };

  /** 加载数据 */
  const reload: ReloadFunction = (option, parent, resolve, backTop) => {
    if (option) {
      if (option.page) {
        tablePage.value = option.page;
      }
      if (option.limit) {
        tableLimit.value = option.limit;
      }
      if (option.where) {
        tableState.where = option.where;
      }
      if (option.sorter) {
        tableState.sorter = option.sorter;
      }
      if (option.filter) {
        tableState.filter = option.filter;
      }
    }
    errorText.value = '';
    const sorter = tableState.sorter;
    // 直接指定数据
    if (!isFunctionSource.value) {
      const { data, page, total } = reloadData(
        props.datasource as DataItem[],
        sorter,
        paginationProps.value ? tablePage.value : void 0,
        tableLimit.value
      );
      cacheData.value = props.datasource as DataItem[];
      tableData.value = data;
      tablePage.value = page;
      tableTotal.value = total;
      handleDone(
        { data, page, total, response: props.datasource },
        void 0,
        backTop
      );
      return;
    }
    // 自定义请求方法
    const tempId = uuid(8);
    tableState.reloadId = tempId;
    if (!parent) {
      tableLoading.value = true;
    }
    const params = getRequestParams(parent);
    (props.datasource as DatasourceFunction)(params)
      .then((response) => {
        if (tableState.reloadId !== tempId) {
          return;
        }
        const { data, total, result } = getDatasourceResult(response);
        requestCallback(data, total, parent, result, resolve, backTop);
      })
      .catch((e?: Error) => {
        if (tableState.reloadId !== tempId) {
          return;
        }
        const errorMsg = e?.message;
        requestCallback(
          errorMsg == null ? errorMsg : String(errorMsg),
          void 0,
          parent,
          e as any,
          resolve,
          backTop
        );
        resolve && console.error(e);
      });
  };

  /** 请求数据回调 */
  const requestCallback = (
    data?: DataItem[] | string,
    total?: PaginationTotal,
    parent?: DataItem,
    response?: DatasourceResult,
    resolve?: ResolveFunction,
    backTop?: boolean
  ): void => {
    if (data == null || !Array.isArray(data)) {
      if (resolve) {
        if (parent != null) {
          parent[props.treeProps?.children || 'children'] = [];
        }
        resolve([]);
      } else {
        tableData.value = [];
      }
      tableLoading.value = false;
      if (typeof data === 'string' && data) {
        errorText.value = data;
        return;
      }
      errorText.value = '获取数据失败';
      console.error(
        '返回的数据格式与配置的不一致, 返回的数据:',
        response,
        '需要的格式:',
        getResponseName(globalProps.value.response, props.response)
      );
      return;
    }
    if (resolve) {
      if (parent != null) {
        parent[props.treeProps?.children || 'children'] = data;
      }
      resolve(data);
    } else {
      // 自动修正页码
      if (
        isAutoAmend(props.pagination, globalProps.value.pagination) &&
        !data.length &&
        total &&
        '*' !== total &&
        tablePage.value &&
        tableLimit.value
      ) {
        const maxPage = Math.ceil(total / tableLimit.value);
        if (maxPage && tablePage.value > maxPage) {
          tablePage.value = maxPage;
          reload(void 0, void 0, void 0, true);
          return;
        }
      }
      // 获取返回的数据
      tableData.value = data;
      tableTotal.value = total || data.length;
    }
    tableLoading.value = false;
    const result: DoneParams<DataItem> = {
      data: tableData.value,
      page: tablePage.value,
      total: tableTotal.value,
      response
    };
    handleDone(result, parent, backTop);
  };

  /** 树形表格懒加载 */
  const tableLoad: TableLoad = (row, treeNode, resolve) => {
    if (props.load) {
      props.load(row, treeNode, resolve);
      return;
    }
    reload(void 0, row, resolve);
  };

  /** 表格数据渲染完成 */
  const handleDone: DoneFunction<DataItem> = (result, parent, backTop) => {
    checkTableCurrentIndex();
    nextTick(() => {
      if (props.current != null) {
        methods.setCurrentRowKey(getValue(props.current, tableRowKey.value));
      }
      if (props.selections != null && props.selections.length) {
        methods.setSelectedRowKeys(
          getRowKeys(props.selections, tableRowKey.value)
        );
      }
      if (backTop && getTableRef()) {
        methods.setScrollTop(0);
      }
    });
    emit('done', result, parent);
  };

  /** 刷新按钮事件 */
  const handleRefresh = () => {
    if (isFunctionSource.value) {
      reload();
      return;
    }
    emit('refresh');
  };

  /** 尺寸改变事件 */
  const handleSizeChange = (size: TableSize) => {
    tableSize.value = size;
    emit('sizeChange', size);
  };

  /** 列配置改变事件 */
  const handleColumnsChange = (
    columns: Columns,
    tableColumns: Columns,
    isReset: boolean
  ) => {
    tableCols.value = columns;
    emit('columnsChange', columns, tableColumns, isReset);
  };

  /** 全屏切换事件 */
  const handleMaximizedChange = (maximized: boolean) => {
    tableMaximized.value = maximized;
    if (props.maximized !== maximized) {
      emit('update:maximized', maximized);
    }
    emit('maximizedChange', maximized);
  };

  /** 分页数量改变事件 */
  const handlePageSizeChange = (limit: number) => {
    if (tableLimit.value !== limit) {
      tableLimit.value = limit;
      if (tableTotal.value !== '*') {
        const maxPage = Math.ceil(tableTotal.value / limit);
        if (maxPage && tablePage.value > maxPage) {
          tablePage.value = maxPage;
        }
      }
      reload();
    }
  };

  /** 分页页码改变事件 */
  const handlePageCurrentChange = (page: number) => {
    if (tablePage.value !== page) {
      tablePage.value = page;
      reload(void 0, void 0, void 0, true);
    }
  };

  /** 排序方式改变事件 */
  const handleSortChange = (sorter: Sorter) => {
    if (props.loadOnChanged) {
      tableState.sorter = sorter;
      reload();
    }
    events.onSortChange(sorter);
  };

  /** 筛选条件改变事件 */
  const handleFilterChange = (filter: Filter) => {
    if (props.loadOnChanged) {
      tableState.filter = filter;
      reload();
    }
    events.onFilterChange(filter);
  };

  /** 表头列宽拉伸改变事件 */
  const handleHeaderDragend = (
    newWidth: number,
    oldWidth: number,
    column: Column,
    event: MouseEvent
  ) => {
    cacheColWidth(newWidth, column, props.cacheKey);
    events.onHeaderDragend(newWidth, oldWidth, column, event);
  };

  /** 单选当前行改变事件 */
  const handleCurrentChange = (
    currentRow?: DataItem,
    oldCurrentRow?: DataItem
  ) => {
    updateCurrent(currentRow);
    events.onCurrentChange(currentRow, oldCurrentRow);
  };

  /** 选择项改变事件 */
  const handleSelectionChange = (selection: DataItem[]) => {
    updateSelections(selection);
    events.onSelectionChange(selection);
  };

  /** 更新单选选中数据 */
  const updateCurrent = (currentRow?: DataItem | null) => {
    if (currentRow !== props.current) {
      emit('update:current', currentRow);
    }
  };

  /** 更新多选选中数据 */
  const updateSelections = (selection: DataItem[]) => {
    if (arrayIsChanged(selection, props.selections)) {
      emit('update:selections', selection);
    }
  };

  /** 检查表格当前索引开始序号 */
  const checkTableCurrentIndex = () => {
    if (tableCurrentIndex.value !== tableIndex.value) {
      tableCurrentIndex.value = tableIndex.value;
    }
  };

  /** 重置表格 */
  const reloadTable = (): void => {
    methods.doLayout();
  };

  /** 获取当前页数据 */
  const getData = (): DataItem[] => {
    return tableData.value;
  };

  /** 修改当前页数据 */
  const setData = (data: DataItem[]): void => {
    tableData.value = data;
    checkTableCurrentIndex();
  };

  /** 前端分页时跳转页码到对应数据 */
  const goPageByRowKey = (key: unknown): void => {
    if (
      !paginationProps.value ||
      tableLimit.value == null ||
      isFunctionSource.value
    ) {
      return;
    }
    const rowKey = tableRowKey.value;
    const data = sortData(props.datasource as any, tableState.sorter);
    const index = data.findIndex((d) => getValue(d, rowKey) === key);
    const page = Math.floor(index / tableLimit.value) + 1;
    if (tablePage.value !== page) {
      reload({ page });
    }
  };

  /** 获取请求参数 */
  const fetch: FetchFunction = (callback) => {
    callback(getRequestParams());
  };

  /** 打开打印弹窗 */
  const openPrintModal = () => {
    if (toolPrintRef.value) {
      toolPrintRef.value.openModal();
    }
  };

  /** 直接打印数据 */
  const printData = (params?: TableExportParams) => {
    if (toolPrintRef.value) {
      toolPrintRef.value.printData(params);
    }
  };

  /** 打开导出弹窗 */
  const openExportModal = () => {
    if (toolExportRef.value) {
      toolExportRef.value.openModal();
    }
  };

  /** 直接导出数据 */
  const exportData = (params?: TableExportParams) => {
    if (toolExportRef.value) {
      toolExportRef.value.exportData(params);
    }
  };

  watch(
    () => props.columns,
    (columns) => {
      if (columns) {
        tableCols.value = getInitCacheColumns(
          columns,
          props.cacheKey,
          props.columnSortable
        );
      } else if (tableCols.value.length) {
        tableCols.value = [];
      }
    },
    { immediate: true, deep: true }
  );

  watch(
    () => props.datasource,
    () => {
      reload();
    },
    { deep: true }
  );

  watch(
    () => props.loading,
    (loading) => {
      tableLoading.value = loading;
    }
  );

  watch(
    () => props.size,
    (size) => {
      tableSize.value = getTableSize(void 0, size, globalProps.value.size);
    }
  );

  watch(
    () => props.current,
    (current) => {
      methods.setCurrentRowKey(getValue(current, tableRowKey.value));
    }
  );

  watch(
    () => props.selections,
    (selections) => {
      methods.setSelectedRowKeys(getRowKeys(selections, tableRowKey.value));
    }
  );

  watch(
    () => props.rowKey,
    () => {
      tableRowKey.value = getRowKey(props.rowKey);
    }
  );

  watch(
    globalProps,
    (config) => {
      tableSize.value = getTableSize(props.cacheKey, props.size, config.size);
    },
    { deep: true }
  );

  watch(
    () => props.maximized,
    (maximized) => {
      if (tableMaximized.value !== maximized) {
        handleMaximizedChange(maximized);
      }
    }
  );

  onMounted(() => {
    if (props.current != null) {
      methods.setCurrentRowKey(getValue(props.current, tableRowKey.value));
    }
    if (props.selections?.length) {
      methods.setSelectedRowKeys(
        getRowKeys(props.selections, tableRowKey.value)
      );
    }
    if (props.loadOnCreated) {
      reload();
    }
  });

  defineExpose({
    ...methods,
    tableViewRef,
    reload,
    getData,
    setData,
    fetch,
    openPrintModal,
    printData,
    openExportModal,
    exportData,
    getTableRef,
    // 兼容旧版导出
    tableData,
    tableLoading,
    tableProps,
    reloadTable,
    goPageByRowKey
  });
</script>
