<!-- 样式和类名编辑 -->
<template>
  <div v-if="data && data.length" class="ele-pro-form-builder-style-edit-list">
    <div
      v-for="(item, index) in data"
      :key="item.id"
      class="ele-pro-form-builder-style-edit-item"
    >
      <div v-if="!isClass" class="ele-pro-form-builder-style-edit-item-body">
        <ElInput
          size="small"
          v-model="item.name"
          @change="handleDataListChange"
        />
      </div>
      <div class="ele-pro-form-builder-style-edit-item-body">
        <ElInput
          size="small"
          v-model="item.value"
          @change="handleDataListChange"
        />
      </div>
      <ElIcon
        class="ele-pro-form-builder-style-edit-item-del-btn"
        title="删除"
        @click="handleDelete(index)"
      >
        <DeleteOutlined />
      </ElIcon>
    </div>
  </div>
  <ElButton
    size="small"
    :icon="PlusOutlined"
    class="ele-pro-form-builder-props-fluid-btn is-small-icon"
    @click="handleAdd"
  >
    <template #default>
      {{ isClass ? '添加类名' : '添加样式' }}
    </template>
  </ElButton>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { ElInput, ElIcon, ElButton } from 'element-plus';
  import { DeleteOutlined, PlusOutlined } from '../../icons/index';
  import type { ComponentStyleItem } from '../types';
  let itemStartId = 0;

  defineOptions({ name: 'StyleEdit' });

  const props = defineProps<{
    /** 样式数据或类名 */
    modelValue?: Record<string, string> | string;
    /** 是否是类名编辑 */
    isClass?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: Record<string, string> | string): void;
  }>();

  /** 数据 */
  const data = ref<ComponentStyleItem[]>([]);

  /** 更新绑定值 */
  const updateModelValue = (value: Record<string, string> | string) => {
    if (props.modelValue !== value) {
      emit('update:modelValue', value);
    }
  };

  /** 更新数据 */
  const updateDataValue = (dataList: ComponentStyleItem[]) => {
    let isChanged = false;
    const temp = [...data.value];
    if (props.isClass) {
      dataList.forEach((d) => {
        const index = temp.findIndex((t) => d.value === t.value);
        if (index === -1) {
          itemStartId++;
          temp.push({ ...d, id: itemStartId });
          isChanged = true;
        }
      });
      temp.forEach((t, i) => {
        if (t.value != null && t.value.trim().length) {
          if (!dataList.some((d) => d.value === t.value)) {
            temp.splice(i, 1);
            isChanged = true;
          }
        }
      });
    } else {
      dataList.forEach((d) => {
        const index = temp.findIndex(
          (t) => d.name === t.name && d.value === t.value
        );
        if (index === -1) {
          itemStartId++;
          temp.push({ ...d, id: itemStartId });
          isChanged = true;
        }
      });
      temp.forEach((t, i) => {
        if (
          t.name != null &&
          t.name.trim().length &&
          t.value != null &&
          t.value.trim().length
        ) {
          if (!dataList.some((d) => d.name === t.name && d.value === t.value)) {
            temp.splice(i, 1);
            isChanged = true;
          }
        }
      });
    }
    if (isChanged) {
      data.value = temp;
    }
  };

  /** 获取数据对应的绑定值 */
  const getDataValue = (
    dataList: ComponentStyleItem[],
    isClass?: boolean
  ): Record<string, string> | string => {
    if (isClass) {
      const result: string[] = [];
      dataList.forEach((d) => {
        if (d.value != null && d.value.trim().length) {
          result.push(d.value);
        }
      });
      return result.join(' ');
    }
    const result: Record<string, string> = {};
    dataList.forEach((d) => {
      if (
        d.name != null &&
        d.name.trim().length &&
        d.value != null &&
        d.value.trim().length
      ) {
        result[d.name] = d.value;
      }
    });
    return result;
  };

  /** 获取绑定值对应的数据 */
  const getValueData = (
    value?: Record<string, string> | string,
    isClass?: boolean
  ): ComponentStyleItem[] => {
    const result: ComponentStyleItem[] = [];
    if (isClass) {
      const classValue = (value || '') as string;
      classValue.split(' ').forEach((d) => {
        if (d != null && d.trim().length) {
          result.push({ value: d });
        }
      });
      return result;
    }
    const styleValue = (value || {}) as Record<string, string>;
    Object.keys(styleValue).forEach((k) => {
      const v = styleValue[k];
      if (v != null && !(typeof v === 'string' && !v.trim().length)) {
        result.push({ name: k, value: String(v) });
      }
    });
    return result;
  };

  /** 数据改变事件 */
  const handleDataListChange = () => {
    updateModelValue(getDataValue(data.value, props.isClass));
  };

  /** 删除 */
  const handleDelete = (index: number) => {
    data.value.splice(index, 1);
    handleDataListChange();
  };

  /** 添加 */
  const handleAdd = () => {
    itemStartId++;
    data.value.push({ name: '', value: '', id: itemStartId });
    handleDataListChange();
  };

  /** 同步数据 */
  watch(
    () => props.modelValue,
    (value) => {
      updateDataValue(getValueData(value, props.isClass));
    },
    {
      deep: true,
      immediate: true
    }
  );
</script>
