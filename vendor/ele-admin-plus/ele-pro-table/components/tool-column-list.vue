<template>
  <VueDraggable
    itemKey="uid"
    :animation="300"
    :modelValue="data"
    :setData="() => void 0"
    handle=".ele-tool-column-handle"
    :componentData="{ class: 'ele-tool-column-list' }"
    :forceFallback="true"
    @update:modelValue="handleSortChange"
    @start="handleSortStart"
    @end="handleSortEnd"
  >
    <template #item="{ element: d }">
      <div class="ele-tool-column-item">
        <div class="ele-tool-column-item-body">
          <div v-if="sortable" class="ele-tool-column-handle">
            <ElIcon>
              <HolderOutlined />
            </ElIcon>
          </div>
          <div class="ele-tool-column-label">
            <ElCheckbox
              :label="d.label"
              :modelValue="d.checked"
              @update:modelValue="(v: boolean) => handleCheckedChange(d, v)"
            />
          </div>
          <div v-if="allowFixed" class="ele-tool-column-fixed">
            <div
              class="ele-tool-column-fixed-item"
              :class="{ 'is-active': d.fixed === true || d.fixed === 'left' }"
              @click="handleFixedLeft(d)"
              @mouseover="handleFixedLeftTooltip"
            >
              <ElIcon>
                <VerticalRightOutlined />
              </ElIcon>
            </div>
            <div
              class="ele-tool-column-fixed-item"
              :class="{ 'is-active': d.fixed === 'right' }"
              @click="handleFixedRight(d)"
              @mouseover="handleFixedRightTooltip"
            >
              <ElIcon>
                <VerticalLeftOutlined />
              </ElIcon>
            </div>
          </div>
          <div v-if="allowWidth" class="ele-tool-column-input">
            <ElInput
              size="small"
              :maxlength="12"
              :modelValue="d.width"
              :placeholder="columnWidthPlaceholder"
              @update:modelValue="(v: string) => handleColWidthChange(d, v)"
            />
          </div>
        </div>
        <ToolColumnList
          v-if="d.children && d.children.length"
          :data="d.children"
          :parent="d"
          :sortable="sortable"
          :allowWidth="allowWidth"
          :columnWidthPlaceholder="columnWidthPlaceholder"
          @sortChange="handleChildSortChange"
          @checkedChange="handleCheckedChange"
          @fixedLeft="handleFixedLeft"
          @fixedRight="handleFixedRight"
          @fixedLeftTooltip="handleChildFixedLeftTooltip"
          @fixedRightTooltip="handleChildFixedRightTooltip"
          @colWidthChange="handleColWidthChange"
          @sortStart="handleSortStart"
          @sortEnd="handleSortEnd"
        />
      </div>
    </template>
  </VueDraggable>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { inject } from 'vue';
  import VueDraggable from 'vuedraggable';
  import { ElCheckbox, ElIcon, ElInput } from 'element-plus';
  import {
    HolderOutlined,
    VerticalRightOutlined,
    VerticalLeftOutlined
  } from '../../icons/index';
  import { modalItemContextKey } from '../../utils/hook';
  import type { ColItem } from '../types';

  defineOptions({ name: 'ToolColumnList' });

  const props = defineProps({
    /** 列配置数据 */
    data: Array as PropType<ColItem[]>,
    /** 父级数据 */
    parent: Object as PropType<ColItem>,
    /** 是否开启列拖拽排序 */
    sortable: Boolean,
    /** 是否开启开关固定列 */
    allowFixed: Boolean,
    /** 是否开启列宽设置 */
    allowWidth: Boolean,
    /** 列宽输入框提示文本 */
    columnWidthPlaceholder: String
  });

  const emit = defineEmits({
    sortChange: (_colItems: ColItem[], _parent?: ColItem) => true,
    checkedChange: (_item: ColItem, _checked: boolean) => true,
    fixedLeft: (_item: ColItem) => true,
    fixedRight: (_item: ColItem) => true,
    fixedLeftTooltip: (_el: HTMLElement) => true,
    fixedRightTooltip: (_el: HTMLElement) => true,
    colWidthChange: (_item: ColItem, _width?: string | number) => true,
    sortStart: () => true,
    sortEnd: () => true
  });

  const modalItem = inject(modalItemContextKey, null);

  /** 显示固定左侧提示 */
  const handleChildFixedLeftTooltip = (el: HTMLElement) => {
    emit('fixedLeftTooltip', el);
  };

  /** 显示固定右侧提示 */
  const handleChildFixedRightTooltip = (el: HTMLElement) => {
    emit('fixedRightTooltip', el);
  };

  /** 固定左侧按钮 hover 事件 */
  const handleFixedLeftTooltip = (e: MouseEvent) => {
    handleChildFixedLeftTooltip(e.currentTarget as HTMLElement);
  };

  /** 固定右侧按钮 hover 事件 */
  const handleFixedRightTooltip = (e: MouseEvent) => {
    handleChildFixedRightTooltip(e.currentTarget as HTMLElement);
  };

  /** 固定左侧 */
  const handleFixedLeft = (colItem: ColItem) => {
    if (modalItem?.label) {
      emit('fixedLeft', colItem);
    }
  };

  /** 固定右侧 */
  const handleFixedRight = (colItem: ColItem) => {
    if (modalItem?.label) {
      emit('fixedRight', colItem);
    }
  };

  /** 拖动顺序改变 */
  const handleChildSortChange = (colItems: ColItem[], parent?: ColItem) => {
    if (modalItem?.label) {
      emit('sortChange', colItems, parent);
    }
  };

  /** 选中改变 */
  const handleCheckedChange = (colItem: ColItem, checked: boolean) => {
    if (modalItem?.label) {
      emit('checkedChange', colItem, checked);
    }
  };

  /** 列宽输入改变 */
  const handleColWidthChange = (item: ColItem, width?: string) => {
    emit('colWidthChange', item, width);
  };

  /** 拖动顺序改变 */
  const handleSortChange = (colItems: ColItem[]) => {
    handleChildSortChange(colItems, props.parent);
  };

  /** 拖动顺序开始 */
  const handleSortStart = () => {
    emit('sortStart');
  };

  /** 拖动顺序结束 */
  const handleSortEnd = () => {
    emit('sortEnd');
  };
</script>
