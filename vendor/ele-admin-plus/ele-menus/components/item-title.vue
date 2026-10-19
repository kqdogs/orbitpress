<template>
  <slot name="icon" :item="item" :icon="item.icon">
    <ElIcon v-if="item.icon" v-bind="item.iconProps || {}">
      <component :is="item.icon" :style="item.iconStyle" />
    </ElIcon>
  </slot>
  <slot v-if="showTitle" name="title" :item="item" :title="item.title">
    <span v-if="item.title" class="ele-menu-title">{{ item.title }}</span>
  </slot>
  <ElBadge v-if="item.badge != null" v-bind="item.badge" />
  <div
    class="ele-menu-trigger"
    @click="(e) => handleItemClick(item, e)"
    @mouseenter="(e) => handleItemMouseenter(item, e)"
    @mouseleave="(e) => handleItemMouseleave(item, e)"
  >
    <template v-if="showLink">
      <a
        v-if="isExternalPath"
        :href="item.path"
        :target="item.pathTarget || '_blank'"
        class="ele-menu-link"
      ></a>
      <RouterLink
        v-else-if="item.path"
        :to="item.path"
        :target="item.pathTarget"
        class="ele-menu-link"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { computed } from 'vue';
  import { ElIcon, ElBadge } from 'element-plus';
  import { isExternalLink } from '../../utils/common';
  import type { MenuItem, MenuItemEvent } from '../types';

  defineOptions({ name: 'ItemTitle' });

  const props = defineProps({
    /** 菜单项数据 */
    item: {
      type: Object as PropType<MenuItem>,
      required: true
    },
    /** 是否需要标题 */
    showTitle: {
      type: Boolean,
      default: true
    },
    /** 是否需要链接 */
    showLink: Boolean
  });

  const emit = defineEmits({
    itemClick: (_item: MenuItem, _e: MouseEvent) => true,
    itemMouseenter: (_item: MenuItem, _e: MouseEvent) => true,
    itemMouseleave: (_item: MenuItem, _e: MouseEvent) => true
  });

  /** 菜单地址是否是外链 */
  const isExternalPath = computed<boolean>(() => {
    const { path, meta } = props.item;
    if (!path) {
      return false;
    }
    if (isExternalLink(path)) {
      return true;
    }
    // 兼容布局组件菜单数据的外链格式
    if (meta && typeof meta === 'object' && meta.openType === 'external') {
      return true;
    }
    return false;
  });

  /** 菜单项点击事件 */
  const handleItemClick: MenuItemEvent = (item, e) => {
    if (
      props.showLink &&
      (isExternalPath.value || (item.path && item.pathTarget === '_blank'))
    ) {
      e.stopPropagation();
    }
    emit('itemClick', item, e);
  };

  /** 菜单项鼠标进入事件 */
  const handleItemMouseenter: MenuItemEvent = (item, e) => {
    emit('itemMouseenter', item, e);
  };

  /** 菜单项鼠标离开事件 */
  const handleItemMouseleave: MenuItemEvent = (item, e) => {
    emit('itemMouseleave', item, e);
  };
</script>
