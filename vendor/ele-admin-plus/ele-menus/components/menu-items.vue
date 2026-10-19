<template>
  <template v-for="item in items">
    <ElMenuItem
      v-if="!item.children || !item.children.length"
      v-bind="pick(item, ['route', 'disabled', 'class', 'style'])"
      :key="`${item.key || item.index || item.path}-${tipDisabled}`"
      :index="item.index || item.path || ''"
      :class="[{ 'ele-menu-overflow': item.overflow }]"
      @click="handleMenuItemClick"
    >
      <ItemTitle
        :item="item"
        :showTitle="!(first && !tipDisabled)"
        :showLink="true"
        @itemClick="handleItemClick"
        @itemMouseenter="handleItemMouseenter"
        @itemMouseleave="handleItemMouseleave"
      >
        <template v-for="name in Object.keys($slots)" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps || {}"></slot>
        </template>
      </ItemTitle>
      <template v-if="first && !tipDisabled" #title>
        <slot name="title" :item="item" :title="item.title">
          <span v-if="item.title" class="ele-menu-title">{{ item.title }}</span>
        </slot>
      </template>
    </ElMenuItem>
    <ElMenuItemGroup
      v-else-if="item.group === true && !horizontal && !parentIsGroup"
      :key="(item.key || item.index || item.path) + '-group'"
      :class="item.class"
      :style="item.style"
    >
      <template #title>
        <ItemTitle
          :item="item"
          @itemClick="handleGroupClick"
          @itemMouseenter="handleParentMouseenter"
          @itemMouseleave="handleParentMouseleave"
        >
          <template v-for="name in Object.keys($slots)" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps || {}"></slot>
          </template>
        </ItemTitle>
      </template>
      <MenuItems
        :items="item.children"
        :first="first"
        :tipDisabled="tipDisabled"
        :parentIsGroup="true"
        :theme="theme"
        :popTheme="popTheme"
        :colorful="colorful"
        :popupColorful="popupColorful"
        :firstPopClass="firstPopClass"
        :webkit="webkit"
        @itemClick="handleItemClick"
        @itemMouseenter="handleItemMouseenter"
        @itemMouseleave="handleItemMouseleave"
        @parentMouseenter="handleParentMouseenter"
        @parentMouseleave="handleParentMouseleave"
      >
        <template v-for="name in Object.keys($slots)" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps || {}"></slot>
        </template>
      </MenuItems>
    </ElMenuItemGroup>
    <ElSubMenu
      v-else
      v-bind="
        pick(item, [
          'showTimeout',
          'hideTimeout',
          'disabled',
          'popperOffset',
          'class',
          'style'
        ])
      "
      :key="(item.key || item.index || item.path) + '-sub'"
      :index="item.index || item.path || ''"
      :popperClass="
        getPopperClass(
          item.popperClass,
          theme,
          popTheme,
          colorful,
          popupColorful,
          firstPopClass,
          first,
          webkit
        )
      "
      :teleported="item.teleported ?? !!first"
      :expandCloseIcon="item.expandCloseIcon ?? ArrowDown"
      :expandOpenIcon="item.expandOpenIcon ?? ArrowDown"
      :collapseCloseIcon="item.collapseCloseIcon ?? ArrowRight"
      :collapseOpenIcon="item.collapseOpenIcon ?? ArrowRight"
      :class="[{ 'ele-menu-overflow': item.overflow }]"
    >
      <template #title>
        <ItemTitle
          :item="item"
          @itemClick="handleParentClick"
          @itemMouseenter="handleParentMouseenter"
          @itemMouseleave="handleParentMouseleave"
        >
          <template v-for="name in Object.keys($slots)" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps || {}"></slot>
          </template>
        </ItemTitle>
      </template>
      <MenuItems
        v-if="!(item.children.length === 1 && item.children[0] == null)"
        :items="item.children"
        :first="false"
        :tipDisabled="tipDisabled"
        :parentIsGroup="false"
        :theme="theme"
        :popTheme="popTheme"
        :colorful="colorful"
        :popupColorful="popupColorful"
        :firstPopClass="firstPopClass"
        :webkit="webkit"
        @itemClick="handleItemClick"
        @itemMouseenter="handleItemMouseenter"
        @itemMouseleave="handleItemMouseleave"
        @parentMouseenter="handleParentMouseenter"
        @parentMouseleave="handleParentMouseleave"
      >
        <template v-for="name in Object.keys($slots)" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps || {}"></slot>
        </template>
      </MenuItems>
    </ElSubMenu>
  </template>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ElMenuItem, ElSubMenu, ElMenuItemGroup } from 'element-plus';
  import { ArrowDown, ArrowRight } from '../../icons/index';
  import { pick } from '../../utils/common';
  import ItemTitle from './item-title.vue';
  import { getPopperClass } from '../util';
  import type {
    MenuItem,
    MenuTheme,
    PopupMenuTheme,
    PopupColorful,
    MenuItemEvent,
    MenuItemClickType
  } from '../types';

  defineOptions({ name: 'MenuItems' });

  defineProps({
    /** 菜单数据 */
    items: Array as PropType<MenuItem[]>,
    /** 是否是第一级菜单 */
    first: Boolean,
    /** 是否禁用折叠的 tooltip */
    tipDisabled: Boolean,
    /** 父级是否是分组菜单 */
    parentIsGroup: Boolean,
    /** 主题 */
    theme: String as PropType<MenuTheme>,
    /** 气泡菜单主题 */
    popTheme: String as PropType<PopupMenuTheme>,
    /** 是否彩色图标 */
    colorful: Boolean,
    /** 气泡菜单是否彩色图标 */
    popupColorful: [Boolean, String] as PropType<PopupColorful>,
    /** 第一级气泡菜单类名 */
    firstPopClass: String,
    /** 是否是水平菜单 */
    horizontal: Boolean,
    /** 是否是 webkit 内核 */
    webkit: Boolean
  });

  const emit = defineEmits({
    itemClick: (_item: MenuItem, _e: MouseEvent, _type?: MenuItemClickType) =>
      true,
    itemMouseenter: (_item: MenuItem, _e: MouseEvent) => true,
    itemMouseleave: (_item: MenuItem, _e: MouseEvent) => true,
    parentMouseenter: (_item: MenuItem, _e: MouseEvent) => true,
    parentMouseleave: (_item: MenuItem, _e: MouseEvent) => true
  });

  /** 菜单项原始点击事件 */
  const handleMenuItemClick = () => {};

  /** 菜单项点击事件 */
  const handleItemClick: MenuItemEvent = (
    item,
    e,
    type?: MenuItemClickType
  ) => {
    emit('itemClick', item, e, type);
  };

  /** 父级标题菜单项点击事件 */
  const handleParentClick: MenuItemEvent = (item, e) => {
    handleItemClick(item, e, 'parent');
  };

  /** 分组标题菜单项点击事件 */
  const handleGroupClick: MenuItemEvent = (item, e) => {
    handleItemClick(item, e, 'group');
  };

  /** 菜单项鼠标进入事件 */
  const handleItemMouseenter: MenuItemEvent = (item, e) => {
    emit('itemMouseenter', item, e);
  };

  /** 菜单项鼠标离开事件 */
  const handleItemMouseleave: MenuItemEvent = (item, e) => {
    emit('itemMouseleave', item, e);
  };

  /** 父菜单项鼠标进入事件 */
  const handleParentMouseenter: MenuItemEvent = (item, e) => {
    emit('parentMouseenter', item, e);
  };

  /** 父菜单项鼠标离开事件 */
  const handleParentMouseleave: MenuItemEvent = (item, e) => {
    emit('parentMouseleave', item, e);
  };
</script>
