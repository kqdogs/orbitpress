<!-- 标签页自定义容器 -->
<template>
  <div
    class="ele-tab-wrap ele-tabs-wrap"
    :class="[
      { 'is-small': size === 'small' },
      { 'is-large': size === 'large' },
      { 'is-simple': type === 'simple' },
      { 'is-indicator': type === 'indicator' },
      { 'is-button': type === 'button' },
      { 'is-tag': type === 'tag' }
    ]"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, provide, watch, onBeforeUnmount } from 'vue';
  import type { TabWrapProvide, TabMethods } from '../ele-tabs/types';
  import { TAB_WRAP_KEY } from '../ele-tabs/props';
  import { tabWrapProps } from './props';

  defineOptions({ name: 'EleTabWrap' });

  const props = defineProps(tabWrapProps);

  const tabMethods: TabMethods = {};

  const data = reactive<TabWrapProvide>({
    size: props.size,
    type: props.type,
    setTabMethods: (methods) => {
      tabMethods.triggerTabItemClick = methods.triggerTabItemClick;
      tabMethods.triggerItemContextMenu = methods.triggerItemContextMenu;
    },
    triggerTabItemClick: (item, tabName, e) => {
      if (tabMethods.triggerTabItemClick) {
        tabMethods.triggerTabItemClick(item, tabName, e);
      }
    },
    triggerItemContextMenu: (item, tabName, e) => {
      if (tabMethods.triggerItemContextMenu) {
        tabMethods.triggerItemContextMenu(item, tabName, e);
      }
    }
  });

  provide(TAB_WRAP_KEY, data);

  watch(
    () => props.size,
    () => {
      data.size = props.size;
    }
  );

  watch(
    () => props.type,
    () => {
      data.type = props.type;
    }
  );

  onBeforeUnmount(() => {
    tabMethods.triggerTabItemClick = void 0;
    tabMethods.triggerItemContextMenu = void 0;
  });
</script>
