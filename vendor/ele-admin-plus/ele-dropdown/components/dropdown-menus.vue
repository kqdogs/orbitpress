<template>
  <div
    class="ele-dropdown-menu"
    :class="[
      { 'ele-dropdown-icon-small': iconSize === 'small' },
      { 'is-small': size === 'small' },
      { 'is-large': size === 'large' }
    ]"
    :style="menuStyle"
  >
    <template
      v-for="item in items"
      :key="JSON.stringify(item.key ?? item.command ?? item.title)"
    >
      <DropdownMenuItem
        :item="item"
        :selected="selected"
        :iconProps="iconProps"
        @itemClick="handleItemClick"
        @wrapperContext="handleWrapperContext"
      >
        <template
          v-for="name in Object.keys($slots).filter(
            (k) => 'default' !== k && 'subMenus' !== k
          )"
          #[name]="slotProps"
        >
          <slot :name="name" v-bind="slotProps || {}"></slot>
        </template>
        <template v-if="item.children && item.children.length" #subMenus>
          <DropdownMenus
            :items="item.children"
            :selected="selected"
            :menuStyle="menuStyle"
            :iconProps="iconProps"
            :size="size"
            @itemClick="handleItemClick"
            @wrapperContext="handleWrapperContext"
          >
            <template
              v-for="name in Object.keys($slots).filter(
                (k) => 'default' !== k && 'subMenus' !== k
              )"
              #[name]="slotProps"
            >
              <slot :name="name" v-bind="slotProps || {}"></slot>
            </template>
          </DropdownMenus>
        </template>
      </DropdownMenuItem>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import type { ElIconProps, ElButtonProps } from '../../ele-app/el';
  import type { StyleValue } from '../../ele-app/types';
  import DropdownMenuItem from './dropdown-menu-item.vue';
  import type { DropdownItem } from '../types';

  defineOptions({ name: 'DropdownMenus' });

  defineProps({
    /** 下拉菜单数据 */
    items: {
      type: Array as PropType<DropdownItem[]>,
      required: true
    },
    /** 选中的菜单 */
    selected: [String, Number, Object] as PropType<DropdownItem['command']>,
    /** 自定义下拉菜单样式 */
    menuStyle: Object as PropType<StyleValue>,
    /** 自定义图标属性 */
    iconProps: Object as PropType<ElIconProps>,
    /** 图标尺寸 */
    iconSize: String as PropType<'small' | 'default'>,
    /** 尺寸 */
    size: String as PropType<ElButtonProps['size']>
  });

  const emit = defineEmits({
    itemClick: (_item: DropdownItem, _e: MouseEvent) => true,
    wrapperContext: (_e: MouseEvent) => true
  });

  /** 菜单项点击事件 */
  const handleItemClick = (item: DropdownItem, e: MouseEvent) => {
    if (item.disabled) {
      return;
    }
    emit('itemClick', item, e);
  };

  /** 菜单容器右键事件 */
  const handleWrapperContext = (e: MouseEvent) => {
    emit('wrapperContext', e);
  };
</script>
