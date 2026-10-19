<!-- 数据编辑表格模式 -->
<template>
  <EleTreeTable
    :data="tableData"
    :columns="tableColumns"
    :tableStyle="{ minWidth: tableMinWidth }"
    class="ele-pro-form-builder-options-editer"
    :class="{ 'is-table-data': columns === 'tableData' }"
  >
    <template #bodyCell="{ row, column, treeLevel }">
      <EleSelect
        v-if="columns === 'tableColumns' && column.prop === 'align'"
        size="default"
        placeholder=""
        :clearable="true"
        v-model="row[column.prop]"
        :options="[
          { label: '左对齐', value: 'left' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'right' }
        ]"
        :popperOptions="{ strategy: 'fixed' }"
        class="ele-fluid"
      />
      <EleSelect
        v-else-if="columns === 'tableColumns' && column.prop === 'fixed'"
        size="default"
        placeholder=""
        :clearable="true"
        v-model="row[column.prop]"
        :options="[
          { label: '不固定', value: false },
          { label: '左侧', value: 'left' },
          { label: '右侧', value: 'right' }
        ]"
        :popperOptions="{ strategy: 'fixed' }"
        class="ele-fluid"
      />
      <EleSelect
        v-else-if="columns === 'tableColumns' && column.prop === 'type'"
        size="default"
        placeholder=""
        :clearable="true"
        v-model="row[column.prop]"
        :options="[
          { label: '默认', value: 'default' },
          { label: '选择列', value: 'selection' },
          { label: '序号列', value: 'index' },
          { label: '展开列', value: 'expand' }
        ]"
        :popperOptions="{ strategy: 'fixed' }"
        class="ele-fluid"
      />
      <EleSelect
        v-else-if="columns === 'tableColumns' && column.prop === 'sortable'"
        size="default"
        placeholder=""
        :clearable="true"
        v-model="row[column.prop]"
        :options="[
          { label: 'true', value: true },
          { label: 'false', value: false },
          { label: 'custom', value: 'custom' }
        ]"
        :popperOptions="{ strategy: 'fixed' }"
        class="ele-fluid"
      />
      <div
        v-else-if="column.prop && column.editType === 'switch'"
        class="ele-pro-form-builder-options-edit-cell"
      >
        <ElSwitch size="small" v-model="row[column.prop]" />
      </div>
      <ElInput
        v-else-if="column.prop"
        size="default"
        placeholder=""
        :clearable="true"
        v-model="row[column.prop]"
      />
      <div
        v-else-if="column.key === actionColKey"
        class="ele-pro-form-builder-options-edit-cell"
      >
        <ToolButton
          :buttonProps="{
            type: 'danger',
            plain: true,
            icon: DeleteOutlined
          }"
          tooltip="删除数据"
          @click="handleDelete(row)"
        />
        <ToolButton
          v-if="
            isTreeData &&
            !(
              typeof isTreeData === 'object' &&
              isTreeData.maxDepth &&
              (treeLevel || 1) >= isTreeData.maxDepth
            )
          "
          :buttonProps="{
            type: 'primary',
            plain: true,
            icon: PlusOutlined
          }"
          tooltip="新增子级"
          @click="handleAdd(row)"
        />
      </div>
    </template>
    <template #headerCell="{ column }">
      <div
        v-if="columns === 'tableData' && column.prop"
        class="ele-pro-form-builder-options-edit-th"
      >
        <ElInput size="default" :clearable="true" v-model="column.userProp" />
        <ToolButton
          :buttonProps="{
            type: 'danger',
            plain: true,
            icon: DeleteOutlined
          }"
          tooltip="删除属性"
          @click="handleDeleteCol(column)"
        />
      </div>
      <div
        v-else-if="column.key === actionColKey"
        class="ele-pro-form-builder-options-edit-cell"
      >
        <ToolButton
          v-if="columns === 'tableData'"
          :buttonProps="{
            type: 'primary',
            plain: true,
            icon: AppstoreAddOutlined
          }"
          tooltip="新增属性"
          @click="handleAddCol()"
        />
        <ToolButton
          :buttonProps="{
            type: 'primary',
            plain: true,
            icon: PlusOutlined
          }"
          tooltip="新增数据"
          @click="handleAdd()"
        />
      </div>
    </template>
  </EleTreeTable>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { ElInput, ElSwitch } from 'element-plus';
  import { eachTree, mapTree } from '../../utils/common';
  import type {
    TreeTableColumn,
    TreeTableDataItem
  } from '../../ele-tree-table/types';
  import EleTreeTable from '../../ele-tree-table/index.vue';
  import EleSelect from '../../ele-select/index.vue';
  import {
    PlusOutlined,
    DeleteOutlined,
    AppstoreAddOutlined
  } from '../../icons/index';
  import { getValue, setValue } from '../../ele-pro-form/util';
  import {
    generateItemKey,
    getPropertyPath,
    deepCloneObject
  } from './build-core';
  import ToolButton from './tool-button.vue';
  const actionColKey = 'optionsEditTreeTableAction';

  defineOptions({ name: 'OptionsTable' });

  const props = defineProps<{
    /** 选项数据 */
    data?: Array<any> | string;
    /** 是否是树形结构数据 */
    isTreeData?: boolean | { maxDepth?: number };
    /** 自定义列 */
    columns?: TreeTableColumn[] | 'tableData' | 'tableColumns' | 'stringArray';
  }>();

  /** 表格列配置 */
  const tableColumns = ref<TreeTableColumn[]>([]);

  /** 表格数据 */
  const tableData = ref<TreeTableDataItem[]>([]);

  /** 表格最小宽度 */
  const tableMinWidth = computed<string>(() => {
    let width: number = 0;
    tableColumns.value.forEach((col) => {
      const w: string | number | undefined = col.style?.width;
      const wn = w == null || typeof w === 'number' ? w : Number.parseInt(w);
      width += (wn == null || isNaN(wn) ? void 0 : wn) ?? 120;
    });
    return `${width}px`;
  });

  /** 生成表格数据属性名开始编号 */
  let tablePropStart = 0;

  /** 生成唯一属性名 */
  const generateCellKey = () => {
    const key = generateItemKey();
    tablePropStart++;
    return `${key}c${tablePropStart}`;
  };

  /** 删除行 */
  const handleDelete = (row: TreeTableDataItem, parent?: TreeTableDataItem) => {
    const children = parent ? parent.children : tableData.value;
    if (children && children.length) {
      for (let i = 0; i < children.length; i++) {
        const temp = children[i];
        if (temp === row) {
          children.splice(i, 1);
          return true;
        }
        if (handleDelete(row, temp)) {
          return;
        }
      }
    }
  };

  /** 添加行 */
  const handleAdd = (parent?: TreeTableDataItem) => {
    const item: any = {};
    if (!parent) {
      tableData.value.push(item);
    } else if (parent.children) {
      parent.children.push(item);
    } else {
      parent.children = [item];
    }
  };

  /** 添加列 */
  const handleAddCol = () => {
    const index = tableColumns.value.findIndex((c) => c.key === actionColKey);
    if (index !== -1) {
      const col: TreeTableColumn = {
        userProp: '',
        prop: generateCellKey(),
        label: '',
        style: { textAlign: 'center' }
      };
      if (index <= 0) {
        tableColumns.value.unshift(col);
      } else {
        tableColumns.value.splice(index, 0, col);
      }
    }
  };

  /** 删除列 */
  const handleDeleteCol = (column: TreeTableColumn) => {
    if (column.prop != null) {
      const index = tableColumns.value.findIndex((c) => c.prop === column.prop);
      if (index !== -1) {
        tableColumns.value.splice(index, 1);
      }
    }
  };

  /** 获取数据结果 */
  const getResult = (): Array<any> => {
    let result: TreeTableDataItem[] = deepCloneObject(tableData.value);
    if (props.columns === 'tableData') {
      // 表格数据模式处理
      result = mapTree(result, (row: any) => {
        const temp: Record<string, any> = {};
        tableColumns.value.forEach((col) => {
          if (col.prop) {
            setValue(temp, col.userProp || col.prop, row[col.prop]);
          }
        });
        return temp as any;
      });
    } else if (props.columns === 'stringArray') {
      // 字符数组模式处理
      result = result.map((d) => d.value);
    }
    return result;
  };

  /** 解析数据 */
  onMounted(() => {
    tableData.value = [];
    const userData =
      props.data == null || typeof props.data === 'string'
        ? []
        : deepCloneObject(props.data);
    const actionCol: TreeTableColumn = {
      key: actionColKey,
      label: '',
      style: {
        textAlign: 'center',
        width: props.isTreeData ? '78px' : '48px',
        flex: 'none'
      },
      class: 'is-fixed-right is-fixed-right-first'
    };
    if (props.columns === 'tableData') {
      // 表格数据模式
      const keys: string[] = [];
      eachTree(userData, (row: any) => {
        getPropertyPath(row, ['children']).forEach((k) => {
          if (!keys.includes(k)) {
            keys.push(k);
          }
        });
      });
      tableColumns.value = [
        ...keys.map<TreeTableColumn>((k) => ({
          userProp: k,
          prop: generateCellKey(),
          label: '',
          style: { textAlign: 'center' }
        })),
        actionCol
      ];
      tableData.value = mapTree(userData, (row: any) => {
        const temp = { ...row };
        tableColumns.value.forEach((col) => {
          if (col.prop && col.userProp) {
            temp[col.prop] = getValue(temp, col.userProp);
          }
        });
        return temp;
      });
    } else if (props.columns === 'tableColumns') {
      // 表格列配置模式
      tableColumns.value = [
        {
          prop: 'label',
          label: '标题',
          style: { textAlign: 'center' }
        },
        {
          prop: 'prop',
          label: '属性名',
          style: { textAlign: 'center' }
        },
        {
          prop: 'columnKey',
          label: 'ColumnKey',
          style: { textAlign: 'center' }
        },
        {
          prop: 'align',
          label: '对齐方式',
          style: { textAlign: 'center', width: '110px', flex: 'none' }
        },
        {
          prop: 'width',
          label: '列宽',
          style: { textAlign: 'center', width: '110px', flex: 'none' }
        },
        {
          prop: 'minWidth',
          label: '最小列宽',
          style: { textAlign: 'center', width: '110px', flex: 'none' }
        },
        {
          prop: 'sortable',
          label: '支持排序',
          style: { textAlign: 'center', width: '110px', flex: 'none' },
          editType: 'switch'
        },
        {
          prop: 'fixed',
          label: '固定',
          style: { textAlign: 'center' }
        },
        {
          prop: 'type',
          label: '类型',
          style: { textAlign: 'center', width: '110px', flex: 'none' }
        },
        actionCol
      ];
      tableData.value = userData;
    } else if (props.columns === 'stringArray') {
      // 字符数组模式
      tableColumns.value = [
        { prop: 'value', label: '值', style: { textAlign: 'center' } },
        actionCol
      ];
      tableData.value = userData.map((d: any) => ({ value: d }));
    } else if (props.columns) {
      // 自定义列模式
      tableColumns.value = [...props.columns, actionCol];
      tableData.value = userData;
    } else {
      // 通用模式
      tableColumns.value = [
        { prop: 'label', label: '文本', style: { textAlign: 'center' } },
        { prop: 'value', label: '值', style: { textAlign: 'center' } },
        actionCol
      ];
      tableData.value = userData;
    }
  });

  defineExpose({
    getResult
  });
</script>
