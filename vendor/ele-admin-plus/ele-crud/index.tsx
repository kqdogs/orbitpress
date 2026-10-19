/** 配置式增删改查 */
import type { VNode } from 'vue';
import {
  defineComponent,
  ref,
  reactive,
  computed,
  watch,
  h,
  onBeforeUnmount
} from 'vue';
import { ElInput } from 'element-plus';
import { SearchOutlined } from '../icons/index';
import type { EleProTableInstance, ElePopconfirmProps } from '../ele-app/plus';
import type { EleProFormProps } from '../ele-app/plusx';
import { useLocale } from '../ele-config-provider/receiver';
import { omit, mapTree, getMappedSlots } from '../utils/common';
import { useMobile } from '../utils/hook';
import { useMessage } from '../utils/message';
import { useMessageBox } from '../utils/message-box';
import ElePage from '../ele-page/index.vue';
import EleCard from '../ele-card/index.vue';
import EleProTable from '../ele-pro-table/index.vue';
import EleProForm from '../ele-pro-form/index.vue';
import {
  setValue,
  mergeValue,
  cloneDeep,
  getFormInitValue
} from '../ele-pro-form/util';
import type { ProFormItemProps } from '../ele-pro-form/types';
import EleSplitPanel from '../ele-split-panel/index.vue';
import { getValue as getRowValue } from '../ele-data-table/util';
import type { DataItem, Columns, Column } from '../ele-data-table/types';
import type { DatasourceFunction } from '../ele-pro-table/types';
import type { ButtonItem } from '../ele-buttons/types';
import EleButtons from '../ele-buttons/index';
import TableExtra from './components/table-extra.vue';
import PageSide from './components/page-side.vue';
import {
  getDefaultSearchFormProps,
  getFieldsSearchFormItems,
  getTreeValueField,
  codeStringPrefix,
  getCodeResult
} from './util';
import type {
  BtnClickAction,
  CrudField,
  DeleteApi,
  TreeListApi
} from './types';
import { crudProps, crudEmits } from './props';

export default defineComponent({
  name: 'EleCrud',
  props: crudProps,
  emits: crudEmits,
  setup(props, { emit, slots, expose }) {
    const { lang } = useLocale('crud', props);
    const message = useMessage({ plain: true });
    const messageBox = useMessageBox();
    const defaultSearchFormProps = getDefaultSearchFormProps();

    /** 表格组件 */
    const tableRef = ref<EleProTableInstance>(null);

    /** 表格选中数据 */
    const selections = ref<DataItem[]>([]);

    /** 添加弹窗是否打开 */
    const addVisible = ref<boolean | undefined>(false);

    /** 添加弹窗数据 */
    const addData = ref<DataItem>();

    /** 修改弹窗是否打开 */
    const editVisible = ref<boolean | undefined>(false);

    /** 修改弹窗数据 */
    const editData = ref<DataItem>();

    /** 表头操作按钮 */
    const toolbarBtnItems = computed<ButtonItem[]>(() => {
      const listConfig = props.listConfig || {};
      const addBtnProps = listConfig.addBtnProps;
      const delBtnProps = listConfig.delBtnProps;
      const items: ButtonItem[] = [];
      if (addBtnProps !== false) {
        items.push({
          preset: 'add',
          props: addBtnProps === true ? void 0 : addBtnProps,
          onClick: () => handleBtnClick('add')
        });
      }
      if (delBtnProps !== false) {
        items.push({
          preset: 'delBatch',
          props: delBtnProps === true ? void 0 : delBtnProps,
          onClick: () => handleBtnClick('delSelections')
        });
      }
      return items;
    });

    /** 表格操作列操作按钮 */
    const actionBtnItems = computed<ButtonItem[]>(() => {
      const listConfig = props.listConfig || {};
      const editLinkProps = listConfig.editLinkProps;
      const delLinkProps = listConfig.delLinkProps;
      const delPopConfirmProps = listConfig.delPopConfirmProps;
      const items: ButtonItem[] = [];
      if (editLinkProps !== false) {
        items.push({
          preset: 'edit',
          props: editLinkProps === true ? void 0 : editLinkProps,
          command: 'edit'
        });
      }
      if (delLinkProps !== false) {
        const item: ButtonItem = {
          preset: 'del',
          props: delLinkProps === true ? void 0 : delLinkProps,
          command: 'del'
        };
        if (
          delPopConfirmProps != null &&
          typeof delPopConfirmProps === 'object' &&
          delPopConfirmProps.isPopConfirm
        ) {
          item.popconfirmProps = {
            content: lang.value.deleteConfirm,
            popperOptions: {
              strategy: 'fixed',
              modifiers: [{ name: 'offset', options: { offset: [12, 6] } }]
            },
            ...(omit(delPopConfirmProps, [
              'isPopConfirm'
            ]) as ElePopconfirmProps)
          };
          item.command = 'delConfirm';
        }
        items.push(item);
      }
      return items;
    });

    /** 表格列配置 */
    const tableColumns = computed<Columns>(() => {
      const listConfig = props.listConfig || {};
      const userColumns = listConfig.tableProps?.columns;
      if (userColumns?.length) {
        return userColumns;
      }
      const fields = props.fields;
      const { selectionColumnProps, indexColumnProps, actionColumnProps } =
        listConfig;
      const columns: Columns = [];
      if (selectionColumnProps !== false) {
        columns.push({
          type: 'selection',
          columnKey: 'selection',
          width: 50,
          align: 'center',
          fixed: 'left',
          ...((selectionColumnProps === true ? void 0 : selectionColumnProps) ||
            {})
        });
      }
      if (indexColumnProps !== false) {
        columns.push({
          type: 'index',
          columnKey: 'index',
          width: 50,
          align: 'center',
          fixed: 'left',
          ...((indexColumnProps === true ? void 0 : indexColumnProps) || {})
        });
      }
      mapTree<CrudField, Column>(fields || [], (field) => {
        if (field.hideInList === 'flat') {
          return 'flatChildren';
        } else if (!field.hideInList) {
          return {
            columnKey: field.key,
            prop: field.prop,
            label: field.label,
            ...(field.columnProps || {})
          };
        }
      }).forEach((column) => {
        columns.push(column);
      });
      if (actionColumnProps !== false) {
        columns.push({
          columnKey: 'action',
          label: lang.value.action,
          width: 156,
          align: 'center',
          fixed: 'right',
          slot: 'action',
          hideInPrint: true,
          hideInExport: true,
          ...((actionColumnProps === true ? void 0 : actionColumnProps) || {})
        });
      }
      return columns;
    });

    /** 搜索栏配置 */
    const searchFormProps = computed<EleProFormProps>(() => {
      const searchConfig =
        (props.searchConfig === true ? void 0 : props.searchConfig) || {};
      return searchConfig.formProps || {};
    });

    /** 搜索表单项配置数据 */
    const searchFormItems = computed<ProFormItemProps[]>(() => {
      const items = searchFormProps.value.items;
      return items?.length ? items : getFieldsSearchFormItems(props.fields);
    });

    /** 搜索表单数据 */
    const searchFormData = reactive<Record<string, any>>(
      getFormInitValue(
        searchFormItems.value,
        searchFormProps.value.itemTypeData || props.itemTypeData,
        true
      )
    );

    /** 表格搜索条件数据 */
    const searchWhere = ref<Record<string, any>>(cloneDeep(searchFormData));

    /** 侧栏树选中值 */
    const treeSelectedValue = ref<any>();

    /** 侧栏树数据 */
    const treeData = ref<Record<string, any>[]>([]);

    /** 侧栏树加载状态 */
    const treeLoading = ref(false);

    /** 侧栏树加载错误信息 */
    const treeErrorMessage = ref<string>();

    /** 侧栏树搜索关键字 */
    const treeSearchkeywords = ref('');

    /** 分割面板折叠状态 */
    const splitPanelCollapse = ref<boolean | undefined>(false);

    const [isMobile] = useMobile((mobile) => {
      splitPanelCollapse.value = mobile;
    });

    /** 代码字符串解析缓存 */
    const codeCache = new Map<string, any>();

    /** 获取并缓存代码解析结果 */
    const getAndCacheCode = (code: string, codeResult?: any) => {
      const cacheResult = codeCache.get(code);
      if (cacheResult) {
        return cacheResult;
      }
      const result = codeResult ?? getCodeResult(code, props.httpRequest);
      codeCache.set(code, result);
      return result;
    };

    /** 表格数据源 */
    const tableDatasource: DatasourceFunction = (params) => {
      const datasource =
        props.listConfig?.tableProps?.datasource || props.listApi;
      if (datasource && Array.isArray(datasource)) {
        return Promise.resolve(datasource);
      }
      const func: DatasourceFunction | undefined =
        typeof datasource === 'function'
          ? datasource
          : typeof datasource === 'string' &&
              datasource.startsWith(codeStringPrefix)
            ? getAndCacheCode(datasource)
            : void 0;
      const showSide = !!props.pageConfig?.splitPanelProps;
      if (!func || (showSide && treeSelectedValue.value == null)) {
        return Promise.resolve([]);
      }
      const where: Record<string, any> = {};
      if (showSide && treeSelectedValue.value != null) {
        const filterField = props.pageConfig?.tableFilterField;
        if (filterField) {
          setValue(where, filterField, treeSelectedValue.value);
        }
      }
      mergeValue(where, searchWhere.value, params.where);
      return func({ ...params, where });
    };

    /** 获取表格选中数据 */
    const getTableSelections = () => {
      return selections.value;
    };

    /** 更新表格选中数据 */
    const handleUpdateSelections = (data: DataItem[]) => {
      selections.value = data;
      emit('tableSelectionsChange', data);
    };

    /** 刷新表格 */
    const reloadTable = (page?: number) => {
      tableRef.value?.reload?.({ page });
    };

    /** 更新搜索表单数据 */
    const handleUpdateSearchForm = (field: string, value: unknown) => {
      setValue(searchFormData, field, value);
    };

    /** 搜索表单提交 */
    const handleSubmitSearchForm = () => {
      selections.value = [];
      searchWhere.value = cloneDeep(searchFormData);
      reloadTable(1);
    };

    /** 搜索表单重置 */
    const handleResetSearchForm = () => {
      Object.keys(searchFormData).forEach((key) => {
        searchFormData[key] = void 0;
      });
      mergeValue(
        searchFormData,
        getFormInitValue(
          searchFormItems.value,
          searchFormProps.value.itemTypeData || props.itemTypeData,
          true
        )
      );
      handleSubmitSearchForm();
    };

    /** 按钮点击事件 */
    const handleBtnClick = (action: BtnClickAction, item?: DataItem) => {
      if (action === 'delConfirm') {
        // 气泡删除确认
        handleDelete(item ? [item] : void 0);
      } else if (action === 'del') {
        // 删除单个
        const delPopConfirmProps = props.listConfig?.delPopConfirmProps;
        if (delPopConfirmProps === false) {
          handleDelete(item ? [item] : void 0);
        } else {
          messageBox
            .confirm(lang.value.deleteConfirm, lang.value.deleteConfirmTitle, {
              type: 'warning',
              draggable: true,
              ...omit(
                delPopConfirmProps === true ? void 0 : delPopConfirmProps,
                ['isPopConfirm']
              )
            })
            .then(() => {
              handleDelete(item ? [item] : void 0);
            })
            .catch(() => {});
        }
      } else if (action === 'edit') {
        // 修改
        editData.value = item;
        editVisible.value = true;
      } else if (action === 'add') {
        // 添加
        const filterField = props.pageConfig?.tableFilterField;
        if (
          props.pageConfig?.splitPanelProps &&
          treeSelectedValue.value != null &&
          filterField
        ) {
          const data = {};
          setValue(data, filterField, treeSelectedValue.value);
          addData.value = data;
        } else {
          addData.value = void 0;
        }
        addVisible.value = true;
      } else if (action === 'delSelections') {
        // 删除选中
        const data = selections.value;
        if (!data.length) {
          message.error({
            ...(props.messageOptions || {}),
            message: lang.value.deleteBatchTip
          });
          return;
        }
        const delConfirmProps = props.listConfig?.delConfirmProps;
        if (delConfirmProps === false) {
          handleDelete(data);
        } else {
          messageBox
            .confirm(
              lang.value.deleteBatchConfirm,
              lang.value.deleteBatchConfirmTitle,
              {
                type: 'warning',
                draggable: true,
                ...((delConfirmProps === true ? void 0 : delConfirmProps) || {})
              }
            )
            .then(() => {
              handleDelete(data);
            })
            .catch(() => {});
        }
      }
    };

    /** 删除事件 */
    const handleDelete = (data?: DataItem[]) => {
      if (!data || !props.deleteApi) {
        return;
      }
      const deleteApiFunc: DeleteApi | undefined =
        typeof props.deleteApi === 'function'
          ? props.deleteApi
          : props.deleteApi.startsWith(codeStringPrefix)
            ? getAndCacheCode(props.deleteApi)
            : void 0;
      if (!deleteApiFunc) {
        return;
      }
      const loading = message.loading({
        ...(props.messageOptions || {}),
        message: lang.value.deleteLoading
      });
      const rowKey = props.listConfig?.tableProps?.rowKey;
      const dataKeys = rowKey
        ? data.map((row) => getRowValue(row, rowKey))
        : [];
      deleteApiFunc(dataKeys as string[], data)
        .then((msg) => {
          loading.close();
          message.success({
            ...(props.messageOptions || {}),
            message: msg ?? lang.value.deleteSuccess
          });
          reloadTable(1);
        })
        .catch((e) => {
          loading.close();
          if (e != null && typeof e === 'string') {
            message.error({
              ...(props.messageOptions || {}),
              message: e
            });
          } else {
            message.error({
              ...(props.messageOptions || {}),
              message: e?.message ?? lang.value.deleteError
            });
          }
        });
    };

    /** 添加失败事件 */
    const handleAddError = (e?: Error | string) => {
      if (e != null && typeof e === 'string') {
        message.error({
          ...(props.messageOptions || {}),
          message: e
        });
      } else {
        message.error({
          ...(props.messageOptions || {}),
          message: e?.message ?? lang.value.addError
        });
      }
    };

    /** 编辑失败事件 */
    const handleEditError = (e?: Error | string) => {
      if (e != null && typeof e === 'string') {
        message.error({
          ...(props.messageOptions || {}),
          message: e
        });
      } else {
        message.error({
          ...(props.messageOptions || {}),
          message: e?.message ?? lang.value.editError
        });
      }
    };

    /** 添加成功事件 */
    const handleAddDone = (msg?: string) => {
      message.success({
        ...(props.messageOptions || {}),
        message: msg ?? lang.value.editSuccess
      });
      reloadTable(1);
    };

    /** 修改成功事件 */
    const handleEditDone = (msg?: string) => {
      message.success({
        ...(props.messageOptions || {}),
        message: msg ?? lang.value.addSuccess
      });
      reloadTable();
    };

    /** 详情查询失败事件 */
    const handleDetailError = (e: Error) => {
      const msg = e?.message;
      if (!msg) {
        console.error(e);
      } else {
        message.error({ ...(props.messageOptions || {}), message: msg });
      }
    };

    /** 更新添加弹窗打开状态 */
    const handleUpdateAddVisible = (visible?: boolean) => {
      addVisible.value = visible;
    };

    /** 更新修改弹窗打开状态 */
    const handleUpdateEditVisible = (visible?: boolean) => {
      editVisible.value = visible;
    };

    /** 侧栏树点击事件 */
    const handleTreeNodeClick = (nodeValue?: any) => {
      if (isMobile.value) {
        splitPanelCollapse.value = true;
      }
      if (treeSelectedValue.value !== nodeValue) {
        treeSelectedValue.value = nodeValue;
        reloadTable();
      }
    };

    /** 设置树数据 */
    const setTreeData = (data?: Record<string, any>[]) => {
      treeLoading.value = false;
      treeData.value = data || [];
      if (treeData.value.length) {
        const field = getTreeValueField(props.pageConfig?.sideConfig);
        treeSelectedValue.value = treeData.value[0][field];
        reloadTable();
      } else {
        treeSelectedValue.value = void 0;
      }
    };

    /** 刷新树 */
    const reloadTree = () => {
      if (!props.treeListApi || !props.pageConfig?.splitPanelProps) {
        setTreeData([]);
        return;
      }
      if (Array.isArray(props.treeListApi)) {
        setTreeData(props.treeListApi);
        return;
      }
      const treeListApiFunc: TreeListApi | undefined =
        typeof props.treeListApi === 'function'
          ? props.treeListApi
          : props.treeListApi.startsWith(codeStringPrefix)
            ? getAndCacheCode(props.treeListApi)
            : void 0;
      if (!treeListApiFunc) {
        return;
      }
      treeLoading.value = true;
      treeListApiFunc()
        .then((data) => {
          setTreeData(data);
        })
        .catch((e) => {
          treeLoading.value = false;
          if (e != null && typeof e === 'string') {
            treeErrorMessage.value = e;
          } else {
            treeErrorMessage.value = e?.message;
          }
        });
    };

    /** 更新侧栏树搜索关键字 */
    const handleUpdateTreeSearchKeywords = (value: string) => {
      treeSearchkeywords.value = value;
    };

    /** 更新分割面板折叠状态 */
    const handleUpdateSplitPanelCollapse = (collapse?: boolean) => {
      splitPanelCollapse.value = collapse;
    };

    /** 清空代码解析结果缓存 */
    const clearCodeCache = () => {
      codeCache.clear();
    };

    /** 渲染搜索栏 */
    const renderSearch = (): VNode | VNode[] | undefined => {
      if (props.searchConfig === false) {
        return;
      }
      const searchConfig =
        (props.searchConfig === true ? void 0 : props.searchConfig) || {};
      const cardProps = searchConfig.cardProps;

      const renderForm = (): VNode => {
        return h(
          props.proFormComponent || EleProForm,
          {
            ...defaultSearchFormProps,
            itemTypeData: props.itemTypeData,
            httpRequest: props.httpRequest,
            screenSize: props.screenSize,
            ...searchFormProps.value,
            model: searchFormData,
            items: searchFormItems.value,
            onUpdateValue: handleUpdateSearchForm,
            onSubmit: handleSubmitSearchForm,
            onReset: handleResetSearchForm
          },
          {
            footer: ({ submitForm, resetForm }) => (
              <EleButtons
                items={[
                  {
                    preset: 'search',
                    props: searchFormProps.value.submitButtonProps,
                    onClick: () => submitForm()
                  },
                  {
                    preset: 'reset',
                    props: searchFormProps.value.resetButtonProps,
                    onClick: () => resetForm()
                  }
                ]}
              />
            ),
            ...getMappedSlots(slots, searchConfig.formSlots, [], [], true)
          }
        );
      };
      if (!cardProps) {
        return renderForm();
      }
      return (
        <EleCard
          searchForm={true}
          {...((cardProps === true ? void 0 : cardProps) || {})}
        >
          {{
            ...getMappedSlots(slots, searchConfig.cardSlots),
            default: renderForm
          }}
        </EleCard>
      );
    };

    /** 渲染表格 */
    const renderTable = (): VNode | VNode[] | undefined => {
      const listConfig = props.listConfig || {};
      const cardProps = listConfig.cardProps;
      const tableProps = listConfig.tableProps || {};
      const renderTb = (): VNode => {
        const tSlots = getMappedSlots(
          slots,
          listConfig.tableSlots,
          [],
          ['default'],
          true
        );
        const toolbarSlot = tSlots.toolbar;
        tSlots.toolbar = (slotProps?: Record<string, any>) => (
          <EleButtons items={toolbarBtnItems.value}>
            {{ default: toolbarSlot ? toolbarSlot(slotProps) : void 0 }}
          </EleButtons>
        );
        const actionSlot = tSlots.action;
        tSlots.action = (slotProps?: Record<string, any>) => (
          <EleButtons
            type="link"
            divider={true}
            items={actionBtnItems.value}
            onItemClick={(command: any) =>
              handleBtnClick(command, slotProps?.row)
            }
          >
            {{ default: actionSlot ? actionSlot(slotProps) : void 0 }}
          </EleButtons>
        );
        const bottomExtraSlot = tSlots.bottomExtra;
        tSlots.bottomExtra = (slotProps?: Record<string, any>) => (
          <TableExtra
            addVisible={addVisible.value}
            addData={addData.value}
            editVisible={editVisible.value}
            editData={editData.value}
            addConfig={props.addConfig}
            editConfig={props.editConfig}
            listConfig={props.listConfig}
            fields={props.fields}
            getAndCacheCode={getAndCacheCode}
            proFormComponent={props.proFormComponent}
            addApi={props.addApi}
            editApi={props.editApi}
            detailApi={props.detailApi}
            itemTypeData={props.itemTypeData}
            httpRequest={props.httpRequest}
            screenSize={props.screenSize}
            lang={lang.value}
            onBtnClick={handleBtnClick}
            onAddError={handleAddError}
            onAddDone={handleAddDone}
            onEditError={handleEditError}
            onEditDone={handleEditDone}
            onDetailError={handleDetailError}
            onUpdate:addVisible={handleUpdateAddVisible}
            onUpdate:editVisible={handleUpdateEditVisible}
          >
            {{
              ...omit(slots, ['default']),
              default: bottomExtraSlot ? bottomExtraSlot(slotProps) : void 0
            }}
          </TableExtra>
        );
        const arrayDatasource =
          tableProps?.datasource == null
            ? props.listApi && Array.isArray(props.listApi)
              ? props.listApi
              : void 0
            : Array.isArray(tableProps.datasource)
              ? tableProps.datasource
              : void 0;
        return (
          <EleProTable
            {...tableProps}
            ref={tableRef}
            columns={tableColumns.value}
            datasource={arrayDatasource || tableDatasource}
            selections={selections.value}
            onUpdate:selections={handleUpdateSelections}
          >
            {tSlots}
          </EleProTable>
        );
      };
      if (!cardProps) {
        return renderTb();
      }
      return (
        <EleCard {...((cardProps === true ? void 0 : cardProps) || {})}>
          {{
            ...getMappedSlots(slots, listConfig.cardSlots),
            default: renderTb
          }}
        </EleCard>
      );
    };

    /** 渲染内容 */
    const renderContent = (): VNode | VNode[] | undefined => {
      const nodes: VNode[] = [];
      const sNodes = renderSearch();
      const tbNodes = renderTable();
      const pageConfig = props.pageConfig || {};
      const splitPanelProps = pageConfig.splitPanelProps;
      if (!splitPanelProps) {
        if (sNodes) {
          (Array.isArray(sNodes) ? sNodes : [sNodes]).forEach((node) => {
            nodes.push(node);
          });
        }
        if (tbNodes) {
          (Array.isArray(tbNodes) ? tbNodes : [tbNodes]).forEach((node) => {
            nodes.push(node);
          });
        }
      } else {
        const bodyNodes: VNode[] = [];
        if (!pageConfig.splitSearchForm && sNodes) {
          (Array.isArray(sNodes) ? sNodes : [sNodes]).forEach((node) => {
            bodyNodes.push(node);
          });
        }
        if (tbNodes) {
          (Array.isArray(tbNodes) ? tbNodes : [tbNodes]).forEach((node) => {
            bodyNodes.push(node);
          });
        }
        nodes.push(
          <EleSplitPanel
            size={258}
            space={0}
            allowCollapse={true}
            collapseBtnOffset={2}
            collapse={splitPanelCollapse.value}
            class="ele-crud-split-panel"
            onUpdate:collapse={handleUpdateSplitPanelCollapse}
            {...((splitPanelProps === true ? void 0 : splitPanelProps) || {})}
          >
            {{
              ...getMappedSlots(slots, pageConfig.splitPanelSlots),
              default: () => (
                <PageSide
                  sideConfig={pageConfig.sideConfig}
                  data={treeData.value}
                  loading={treeLoading.value}
                  selectedValue={treeSelectedValue.value}
                  errorMessage={treeErrorMessage.value}
                  keywords={treeSearchkeywords.value}
                  lang={lang.value}
                  onTreeNodeClick={handleTreeNodeClick}
                >
                  {{ ...slots }}
                </PageSide>
              ),
              sideHeader:
                pageConfig.sideConfig?.searchProps !== false
                  ? () => (
                      <ElInput
                        placeholder={lang.value.searchPlaceholder}
                        clearable={true}
                        prefixIcon={SearchOutlined}
                        modelValue={treeSearchkeywords.value}
                        onUpdate:modelValue={handleUpdateTreeSearchKeywords}
                        class="ele-crud-tree-search"
                        {...(pageConfig.sideConfig?.searchInputProps || {})}
                      >
                        {getMappedSlots(
                          slots,
                          pageConfig.sideConfig?.searchInputSlots
                        )}
                      </ElInput>
                    )
                  : void 0,
              bodyHeader:
                pageConfig.splitSearchForm && sNodes ? () => sNodes : void 0,
              body: () => bodyNodes
            }}
          </EleSplitPanel>
        );
      }
      const cardProps = pageConfig.cardProps;
      if (!cardProps) {
        return nodes;
      }
      return (
        <EleCard {...((cardProps === true ? void 0 : cardProps) || {})}>
          {{
            ...getMappedSlots(slots, pageConfig.cardSlots),
            default: () => nodes
          }}
        </EleCard>
      );
    };

    /** 同步更新查询接口 */
    watch(
      () => props.listApi,
      () => {
        tableRef.value?.setData?.([]);
        handleSubmitSearchForm();
      },
      { deep: true }
    );

    watch(
      () => props.treeListApi,
      () => {
        reloadTree();
      },
      { deep: true, immediate: true }
    );

    /** 卸载时清空代码解析结果缓存 */
    onBeforeUnmount(() => {
      clearCodeCache();
    });

    /** 实例方法 */
    const exposeValue = { tableRef, getTableSelections, reloadTree };
    expose(exposeValue);

    return (() => {
      const pageProps = props.pageConfig?.pageProps;
      if (!pageProps) {
        return renderContent();
      }
      return (
        <ElePage {...((pageProps === true ? void 0 : pageProps) || {})}>
          {() => renderContent()}
        </ElePage>
      );
    }) as unknown as typeof exposeValue;
  }
});
