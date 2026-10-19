<template>
  <VueDraggable
    itemKey="key"
    :animation="150"
    :modelValue="modelValue"
    :setData="() => void 0"
    :tag="rowProps?.tag ?? 'div'"
    :class="rowClass"
    :style="rowStyle"
    v-bind="draggableProps || {}"
    @update:modelValue="handleUpdateModelValue"
  >
    <template #item="{ element }">
      <ElCol :key="element.key" v-bind="element.colProps || {}">
        <slot name="item" :item="element"></slot>
      </ElCol>
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </VueDraggable>
</template>

<script lang="ts" setup>
  import { computed, provide } from 'vue';
  import { ElCol, rowContextKey, useNamespace } from 'element-plus';
  import VueDraggable from 'vuedraggable';
  import type { StyleValue } from '../ele-app/types';
  import { sortableRowProps, sortableRowEmits } from './props';
  import type { SortableColItem } from './types';

  defineOptions({ name: 'EleSortableRow' });

  const props = defineProps(sortableRowProps);

  const emit = defineEmits(sortableRowEmits);

  /** 更新拖拽排序数据 */
  const handleUpdateModelValue = (data: SortableColItem[]) => {
    emit('update:modelValue', data);
  };

  /** 保持 ElRow 的原始功能 */
  const ns = useNamespace('row');

  const gutter = computed<number>(() => props.rowProps?.gutter ?? 0);

  const rowStyle = computed<StyleValue>(() => {
    const styles: StyleValue = {};
    if (!props.rowProps?.gutter) {
      return styles;
    }
    styles.marginRight = styles.marginLeft = `-${props.rowProps.gutter / 2}px`;
    return styles;
  });

  const rowClass = computed<string[]>(() => [
    ns.b(),
    ns.is(
      `justify-${props.rowProps?.justify ?? 'start'}`,
      (props.rowProps?.justify ?? 'start') !== 'start'
    ),
    ns.is(`align-${props.rowProps?.align}`, !!props.rowProps?.align)
  ]);

  provide(rowContextKey, { gutter });
</script>
