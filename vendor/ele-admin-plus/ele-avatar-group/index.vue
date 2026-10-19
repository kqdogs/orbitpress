<!-- 头像组 -->
<template>
  <div class="ele-avatar-group" :class="{ 'is-hover-open': hoverOpen }">
    <ElAvatar
      v-for="(item, index) in avatarData"
      :key="item.key ?? `${index}-${item.value || item.label}`"
      :size="size"
      :shape="shape"
      :src="item.value"
      :style="[commonStyle, itemStyle, avatarStyle]"
      @click="handleItemClick(item)"
      @error="(e: Event) => handleError({ item, e })"
      @mouseover="(e: MouseEvent) => handleItemHover(item, e)"
    >
      <slot v-if="$slots.item" name="item" :item="item"></slot>
    </ElAvatar>
    <EleTooltip
      v-if="isOverflow"
      effect="light"
      :isPopover="true"
      :gpuAcceleration="true"
      placement="top"
      popperClass="ele-avatar-popover"
      :offset="6"
      v-bind="overflowPopoverProps || {}"
      :disabled="!overflowPopover"
      v-model:visible="overflowVisible"
    >
      <ElAvatar
        :size="size"
        :shape="shape"
        :style="[commonStyle, itemStyle, moreStyle]"
        class="ele-avatar-more"
        @click="handleMoreClick"
      >
        <span class="ele-avatar-more-inner">
          <slot
            name="more"
            :overflowCount="overflowCount"
            :overflowData="overflowData"
          >
            <span>+{{ overflowCount }}</span>
          </slot>
        </span>
      </ElAvatar>
      <template #body>
        <div v-if="overflowPopover" class="ele-popover-body ele-avatar-group">
          <slot name="overflow" :overflowData="overflowData">
            <ElAvatar
              v-for="(item, index) in overflowData"
              :key="item.key ?? `${index}-${item.value || item.label}`"
              :size="size"
              :shape="shape"
              :src="item.value"
              :style="[commonStyle, itemStyle, avatarStyle]"
              @click="handleItemClick(item)"
              @error="(e: Event) => handleError({ item, e })"
              @mouseover="(e: MouseEvent) => handleItemHover(item, e)"
            >
              <slot v-if="$slots.item" name="item" :item="item"></slot>
            </ElAvatar>
          </slot>
        </div>
      </template>
    </EleTooltip>
    <EleTooltip
      placement="top"
      :offset="6"
      v-bind="tooltipProps || {}"
      :content="tooltipContent"
      :virtualRef="virtualRef"
      :virtualTriggering="true"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { ElAvatar } from 'element-plus';
  import EleTooltip from '../ele-tooltip/index.vue';
  import type { StyleValue } from '../ele-app/types';
  import type { AvatarItem, AvatarErrorOption } from './types';
  import { avatarGroupProps, avatarGroupEmits } from './props';

  defineOptions({ name: 'EleAvatarGroup' });

  const props = defineProps(avatarGroupProps);

  const emit = defineEmits(avatarGroupEmits);

  /** 提示文本 */
  const tooltipContent = ref<string>('');

  /** 提示单例目标 */
  const virtualRef = ref<any>();

  /** 多余气泡是否显示 */
  const overflowVisible = ref<boolean>(false);

  /** 公共样式 */
  const commonStyle = computed<StyleValue>(() => {
    if (props.size == null || typeof props.size === 'string') {
      const obj = { large: '-12px', default: '-10px', small: '-8px' };
      return { marginLeft: props.size ? obj[props.size] : '-10px' };
    }
    if (typeof props.size === 'number' && props.size >= 0) {
      return { marginLeft: `${-Math.round(props.size / 3)}px` };
    }
    return {};
  });

  /** 是否显示更多 */
  const isOverflow = computed<boolean>(() => {
    return (
      props.maxCount != null &&
      props.maxCount > 0 &&
      props.data != null &&
      props.data.length > props.maxCount
    );
  });

  /** 头像数据 */
  const avatarData = computed<AvatarItem[]>(() => {
    if (props.data == null) {
      return [];
    }
    return isOverflow.value ? props.data.slice(0, props.maxCount) : props.data;
  });

  /** 超出数量 */
  const overflowCount = computed<number>(() => {
    if (!isOverflow.value || !props.data || props.maxCount == null) {
      return 0;
    }
    return props.data.length - props.maxCount;
  });

  /** 超出数据 */
  const overflowData = computed<AvatarItem[]>(() => {
    if (props.data == null || !isOverflow.value) {
      return [];
    }
    return props.data.slice(props.maxCount);
  });

  /** 打开提示 */
  const handleItemHover = (item: AvatarItem, e: MouseEvent) => {
    if (props.tooltip && item.label) {
      virtualRef.value = e.currentTarget;
      tooltipContent.value = item.label;
    }
  };

  /** 点击事件 */
  const handleItemClick = (item: AvatarItem) => {
    emit('itemClick', item);
  };

  /** 更多点击事件 */
  const handleMoreClick = () => {
    emit('moreClick');
  };

  /** 图片加载失败回调 */
  const handleError = (option: AvatarErrorOption) => {
    emit('error', option);
  };
</script>
