<template>
  <div v-if="item.divided" class="ele-dropdown-menu-divider"></div>
  <div
    ref="itemRef"
    class="ele-dropdown-menu-item"
    :class="[
      { 'is-disabled': !!item.disabled },
      { 'is-active': item.command != null && selected === item.command },
      { 'is-danger': !!item.danger }
    ]"
    @click.stop="handleItemClick"
    @mouseenter="handleItemMouseenter"
  >
    <template
      v-if="
        item.slot &&
        item.slot !== 'default' &&
        item.slot !== 'subMenus' &&
        $slots[item.slot]
      "
    >
      <slot :name="item.slot" :item="item"></slot>
    </template>
    <template v-else>
      <ElIcon
        v-if="item.icon"
        v-bind="{ ...(iconProps || {}), ...(item.iconProps || {}) }"
      >
        <component :is="item.icon" :style="item.iconStyle" />
      </ElIcon>
      <span v-if="item.title">{{ item.title }}</span>
    </template>
    <template v-if="item.children && item.children.length">
      <ElIcon class="ele-dropdown-menu-item-arrow">
        <ArrowRight />
      </ElIcon>
      <div
        ref="subMenuRef"
        class="ele-dropdown-wrapper is-sub-menu"
        :class="[
          { 'is-right-end': placement === 'rightEnd' },
          { 'is-left-start': placement === 'leftStart' },
          { 'is-left-end': placement === 'leftEnd' }
        ]"
        @contextmenu="handleWrapperContext"
        @click.stop=""
      >
        <slot name="subMenus"></slot>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref } from 'vue';
  import { ElIcon } from 'element-plus';
  import { ArrowRight } from '../../icons/index';
  import type { ElIconProps } from '../../ele-app/el';
  import type { DropdownItem } from '../types';

  defineOptions({ name: 'DropdownMenuItem' });

  const props = defineProps({
    /** 菜单项数据 */
    item: {
      type: Object as PropType<DropdownItem>,
      required: true
    },
    /** 选中的菜单 */
    selected: [String, Number, Object] as PropType<DropdownItem['command']>,
    /** 自定义图标属性 */
    iconProps: Object as PropType<ElIconProps>
  });

  const emit = defineEmits({
    itemClick: (_item: DropdownItem, _e: MouseEvent) => true,
    wrapperContext: (_e: MouseEvent) => true
  });

  /** 菜单项容器 */
  const itemRef = ref<HTMLDivElement | null>(null);

  /** 子菜单容器 */
  const subMenuRef = ref<HTMLDivElement | null>(null);

  /** 子菜单弹出位置 */
  const placement = ref<'rightEnd' | 'leftStart' | 'leftEnd'>();

  /** 菜单项点击事件 */
  const handleItemClick = (e: MouseEvent) => {
    if (props.item.disabled) {
      return;
    }
    emit('itemClick', props.item, e);
  };

  /** 菜单项鼠标进入事件 */
  const handleItemMouseenter = () => {
    const subMenuEl = subMenuRef.value;
    if (!subMenuEl || !itemRef.value) {
      return;
    }
    const rect = itemRef.value.getBoundingClientRect();
    const rightOver = rect.right + subMenuEl.offsetWidth > window.innerWidth;
    const bottomOver = rect.top + subMenuEl.offsetHeight > window.innerHeight;
    if (rightOver && bottomOver) {
      placement.value = 'leftEnd';
    } else if (rightOver) {
      placement.value = 'leftStart';
    } else if (bottomOver) {
      placement.value = 'rightEnd';
    } else {
      placement.value = void 0;
    }
  };

  /** 菜单容器右键事件 */
  const handleWrapperContext = (e: MouseEvent) => {
    emit('wrapperContext', e);
  };
</script>
