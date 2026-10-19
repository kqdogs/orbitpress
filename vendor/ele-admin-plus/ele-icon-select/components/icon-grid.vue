<template>
  <ElScrollbar class="ele-icon-select-body">
    <div
      class="ele-icon-select-grid"
      :class="{ 'is-loose': tooltip === 'static' }"
      :style="gridStyle"
    >
      <div
        v-for="(d, i) in data"
        :key="`${i}-${d}`"
        class="ele-icon-select-item"
        :class="{ 'is-active': icon && d === icon }"
        :title="!tooltip || tooltip === 'static' ? d : void 0"
        :style="itemStyle"
        @click="handleItemClick(d)"
        @mouseover="(e: MouseEvent) => handleItemHover(d, e)"
      >
        <slot name="icon" :icon="d" :prefix="false"></slot>
        <div v-if="tooltip === 'static'" class="ele-icon-select-item-name">
          {{ d }}
        </div>
      </div>
    </div>
    <div v-if="!data || !data.length" class="ele-icon-select-empty">
      <ElEmpty :imageSize="60" v-bind="emptyProps || {}" />
    </div>
    <EleTooltip
      v-if="tooltip === true"
      placement="top"
      :offset="6"
      :teleported="popperType !== 'popper'"
      v-bind="tooltipProps || {}"
      :visible="tooltipVisible"
      :content="tooltipContent"
      :virtualRef="virtualRef"
      :virtualTriggering="true"
      @update:visible="updateTooltipVisible"
    />
  </ElScrollbar>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref, watch } from 'vue';
  import { ElEmpty, ElScrollbar } from 'element-plus';
  import EleTooltip from '../../ele-tooltip/index.vue';
  import type { StyleValue } from '../../ele-app/types';
  import type { ElEmptyProps } from '../../ele-app/el';
  import type { EleTooltipProps } from '../../ele-app/plus';
  import type { PopperType } from '../../ele-basic-select/types';
  import type { ItemTooltip } from '../types';

  defineOptions({ name: 'IconGrid' });

  const props = defineProps({
    /** 选中的图标 */
    icon: String,
    /** 图标数据 */
    data: {
      type: Array as PropType<string[]>,
      required: true
    },
    /** 空组件属性 */
    emptyProps: Object as PropType<ElEmptyProps>,
    /** 是否显示提示 */
    tooltip: [Boolean, String] as PropType<ItemTooltip>,
    /** 提示属性 */
    tooltipProps: Object as PropType<EleTooltipProps>,
    /** 气泡是否展开 */
    popperVisible: Boolean,
    /** 网格样式 */
    gridStyle: Object as PropType<StyleValue>,
    /** 图标样式 */
    itemStyle: Object as PropType<StyleValue>,
    /** 下拉组件类型 */
    popperType: String as PropType<PopperType>
  });

  const emit = defineEmits({
    select: (_icon: string) => true
  });

  /** 提示组件是否显示 */
  const tooltipVisible = ref<boolean>(false);

  /** 提示文本 */
  const tooltipContent = ref<string>('');

  /** 提示单例目标 */
  const virtualRef = ref<any>();

  /** 更新提示显示状态 */
  const updateTooltipVisible = (visible: boolean) => {
    tooltipVisible.value = visible;
  };

  /** 关闭提示 */
  const hideTooltip = () => {
    updateTooltipVisible(false);
  };

  /** 打开提示 */
  const handleItemHover = (icon: string, e: MouseEvent) => {
    if (
      props.tooltip === true &&
      (props.popperVisible || props.popperType === 'default') &&
      icon
    ) {
      virtualRef.value = e.currentTarget;
      tooltipContent.value = icon;
      tooltipVisible.value = true;
    }
  };

  /** 点击事件 */
  const handleItemClick = (icon: string) => {
    emit('select', icon);
  };

  watch(
    () => props.popperVisible,
    (visible) => {
      if (!visible) {
        hideTooltip();
      }
    }
  );

  defineExpose({
    hideTooltip
  });
</script>
