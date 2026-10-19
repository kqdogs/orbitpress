<!-- 表头筛选 -->
<template>
  <div class="ele-table-filter" @click.stop="">
    <EleTooltip
      ref="popperRef"
      trigger="click"
      :showArrow="false"
      :placement="filterPlacement"
      popperClass="ele-table-filter-popper"
      :gpuAcceleration="true"
      effect="light"
      :isPopover="true"
      :popperOptions="{
        strategy: 'fixed',
        modifiers: [{ name: 'offset', options: { offset: [0, 4] } }]
      }"
      @before-show="handleBeforeEnter"
    >
      <ElIcon>
        <FilterFilled />
      </ElIcon>
      <template #body>
        <template v-if="filterMultiple">
          <ElScrollbar class="ele-table-filter-body">
            <ElCheckboxGroup v-model="checkedValue">
              <ElCheckbox
                v-for="item in filters"
                :key="item.value"
                :value="item.value"
                :label="item.text"
              />
            </ElCheckboxGroup>
          </ElScrollbar>
          <div class="ele-table-filter-footer">
            <ElButton size="small" :text="true" @click="handleReset">
              {{ resetText }}
            </ElButton>
            <ElButton
              size="small"
              type="primary"
              :disabled="!checkedValue.length"
              @click="handleConfirm"
            >
              {{ confirmText }}
            </ElButton>
          </div>
        </template>
        <div v-else class="ele-table-filter-list">
          <div
            class="ele-table-filter-item"
            :class="{ 'is-active': filteredValue == null }"
            @click="handleItemClick()"
          >
            {{ clearFilterText }}
          </div>
          <div
            v-for="d in filters"
            :key="d.value"
            class="ele-table-filter-item"
            :class="{ 'is-active': filteredValue === d.value }"
            @click="handleItemClick(d.value)"
          >
            {{ d.text }}
          </div>
        </div>
      </template>
    </EleTooltip>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref, computed } from 'vue';
  import {
    useLocale,
    ElIcon,
    ElButton,
    ElScrollbar,
    ElCheckboxGroup,
    ElCheckbox
  } from 'element-plus';
  import type { Column, FilterValue } from '../../ele-data-table/types';
  import type { EleTooltipProps, EleTooltipInstance } from '../../ele-app/plus';
  import EleTooltip from '../../ele-tooltip/index.vue';
  import { FilterFilled } from '../../icons/index';

  defineOptions({ name: 'CellFilter' });

  const props = defineProps({
    /** 选中项 */
    filtered: Array as PropType<FilterValue>,
    /** 是否多选 */
    filterMultiple: Boolean,
    /** 数据项 */
    filters: Array as PropType<Column['filters']>,
    /** 弹出框定位 */
    filterPlacement: {
      type: String as PropType<EleTooltipProps['placement']>,
      default: 'bottom-start'
    }
  });

  const emit = defineEmits({
    /** 选中改变事件 */
    change: (_filtered: FilterValue) => true
  });

  const { t } = useLocale();

  /** 气泡组件 */
  const popperRef = ref<EleTooltipInstance>(null);

  /** 多选选中数据 */
  const checkedValue = ref<string[]>([]);

  /** 清空项文本 */
  const clearFilterText = computed<string>(() => {
    return t('el.table.clearFilter');
  });

  /** 单选选中 */
  const filteredValue = computed<string | undefined>(() => {
    if (!props.filtered || !props.filtered.length) {
      return;
    }
    return props.filtered[0];
  });

  /** 确认按钮文字 */
  const confirmText = computed(() => {
    return t('el.table.confirmFilter');
  });

  /** 重置按钮文字 */
  const resetText = computed(() => {
    return t('el.table.resetFilter');
  });

  /** 关闭下拉气泡 */
  const hidePopper = () => {
    popperRef.value && popperRef.value.hide();
  };

  /** 多选下拉展开事件 */
  const handleBeforeEnter = () => {
    checkedValue.value = props.filtered ?? [];
  };

  /** 单选选中改变 */
  const handleItemClick = (value?: string) => {
    handleFilterChange(value == null ? [] : [value]);
    hidePopper();
  };

  /** 多选选中改变 */
  const handleFilterChange = (filtered: FilterValue) => {
    emit('change', filtered);
  };

  /** 多选确认 */
  const handleConfirm = () => {
    handleFilterChange(checkedValue.value);
    hidePopper();
  };

  /** 多选重置 */
  const handleReset = () => {
    checkedValue.value = [];
    handleFilterChange([]);
    hidePopper();
  };

  defineExpose({
    popperRef
  });
</script>
