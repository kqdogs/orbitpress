<!-- 时间线 -->
<template>
  <div ref="listRef" class="ele-time-line-list">
    <div
      v-for="row in lineRows"
      :key="row.key"
      class="ele-time-line-row"
      :class="{ 'is-even-row': row.isEvenRow }"
    >
      <div
        v-for="col in row.items"
        :key="col.key"
        class="ele-time-line-item"
        :class="[
          { 'is-first': col.isFirst },
          { 'is-last': col.isLast },
          { 'is-primary': col.data && col.data.type === 'primary' },
          { 'is-danger': col.data && col.data.type === 'danger' },
          { 'is-placeholder': !col.data }
        ]"
        @click="(e) => handleItemClick(col.data, e)"
      >
        <template v-if="col.data">
          <div class="ele-time-line-item-icon">
            <div
              class="ele-time-line-item-line is-start"
              :class="[
                { 'is-primary-line': col.data.type === 'primary' },
                { 'is-danger-line': col.data.type === 'danger' }
              ]"
            ></div>
            <ElIcon
              class="ele-time-line-item-icon-status"
              v-bind="col.data.iconProps || {}"
            >
              <slot name="itemIcon" :item="col.data">
                <component
                  v-if="col.data.icon"
                  :is="col.data.icon"
                  :style="col.data.iconStyle"
                />
                <CloseCircleFilled
                  v-else-if="col.data.type === 'danger'"
                  :style="col.data.iconStyle"
                />
                <CheckCircleFilled v-else :style="col.data.iconStyle" />
              </slot>
            </ElIcon>
            <div
              class="ele-time-line-item-line is-end"
              :class="[
                { 'is-primary-line': col.nextDataType === 'primary' },
                { 'is-danger-line': col.nextDataType === 'danger' }
              ]"
            ></div>
          </div>
          <div
            v-if="!col.isLast"
            class="ele-time-line-item-line-turn"
            :class="[
              { 'is-primary-line': col.nextDataType === 'primary' },
              { 'is-danger-line': col.nextDataType === 'danger' }
            ]"
          ></div>
          <div class="ele-time-line-item-body">
            <slot name="itemTitle" :item="col.data">
              <div class="ele-time-line-item-title">{{ col.data.title }}</div>
            </slot>
            <slot name="itemDescription" :item="col.data">
              <div class="ele-time-line-item-description">
                {{ col.data.description }}
              </div>
            </slot>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  import { ElIcon } from 'element-plus';
  import { CheckCircleFilled, CloseCircleFilled } from '../icons/index';
  import type { TimelineItem, TimelineRow, TimelineCell } from './types';
  import { timelineProps, timelineEmits } from './props';

  defineOptions({ name: 'EleTimeline' });

  const props = defineProps(timelineProps);

  const emit = defineEmits(timelineEmits);

  /** 列表容器 */
  const listRef = ref<HTMLElement | null>(null);

  /** 列表容器宽度 */
  const listWidth = ref<number>(0);

  /** 列表显示列数 */
  const listColNum = computed<number>(() => {
    return Math.floor(listWidth.value / props.itemWidth) || 1;
  });

  /** 列表数据 */
  const lineRows = computed<TimelineRow[]>(() => {
    const rows: TimelineRow[] = [];
    const data: TimelineItem[] = props.data || [];
    const colNum = listColNum.value;
    const rowNum = colNum ? Math.ceil(data.length / colNum) : 1;
    for (let i = 0; i < rowNum; i++) {
      const cells: TimelineCell[] = [];
      for (let j = 0; j < colNum; j++) {
        const index = i * colNum + j;
        const itemData = data[index];
        cells.push({
          key: itemData?.key ?? `${i}_${j}`,
          data: itemData,
          dataIndex: index,
          nextDataType: data[index + 1]?.type,
          isFirst: itemData && index === 0,
          isLast: itemData && index === data.length - 1
        });
      }
      const key = `${i}_${cells.map((d) => d?.key ?? '').join()}`;
      rows.push({
        key,
        items: cells,
        isEvenRow: (i + 1) % 2 === 0
      });
    }
    return rows;
  });

  /** item 点击事件 */
  const handleItemClick = (item?: TimelineItem, e?: MouseEvent) => {
    if (item) {
      emit('itemClick', item, e);
    }
  };

  /** 容器尺寸改变监听器 */
  const observer =
    typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => {
          requestAnimationFrame(() => {
            const listEl = listRef.value;
            listWidth.value = listEl?.clientWidth || 0;
          });
        })
      : void 0;

  onMounted(() => {
    const listEl = listRef.value;
    if (listEl && observer) {
      observer.observe(listEl);
    }
  });

  onBeforeUnmount(() => {
    const listEl = listRef.value;
    if (listEl && observer) {
      observer.unobserve(listEl);
    }
  });
</script>
