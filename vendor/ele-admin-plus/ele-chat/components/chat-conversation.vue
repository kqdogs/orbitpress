<!-- 对话历史 -->
<template>
  <div
    class="ele-chat-conversation"
    :class="[
      { 'is-group': item.group },
      { 'is-parent': !item.group && item.children != null },
      { 'is-shrink': isShrink },
      { 'is-active': item.key != null && item.key === active },
      { 'is-dropdown-opened': item.key != null && item.key === dropdownOpenKey }
    ]"
  >
    <div
      class="ele-chat-conversation-body"
      @click="(e: MouseEvent) => handleItemClick(item, e)"
    >
      <div
        v-if="!item.group && item.children != null"
        class="ele-chat-conversation-shrink"
      >
        <ElIcon>
          <ArrowDown />
        </ElIcon>
      </div>
      <div class="ele-chat-conversation-label" :title="item.label">
        <slot name="conversationItem" :item="item">{{ item.label }}</slot>
      </div>
      <div
        v-if="dropdownData.length"
        class="ele-chat-conversation-more"
        :class="{
          'is-opened': item.key != null && item.key === dropdownOpenKey
        }"
        @click.stop="
          (e: MouseEvent) => handleItemMoreClick(item, dropdownData, e)
        "
        @mouseenter="
          (e: MouseEvent) => handleItemMoreMouseenter(item, dropdownData, e)
        "
      >
        <ElIcon>
          <EllipsisOutlined />
        </ElIcon>
      </div>
    </div>
    <div v-if="item.children != null" class="ele-chat-conversations">
      <ChatConversation
        v-for="child in item.children"
        :key="child.key ?? child.label"
        :item="child"
        :active="active"
        :expandedKeys="expandedKeys"
        :dropdownItems="dropdownItems"
        :dropdownOpenKey="dropdownOpenKey"
        @itemClick="handleItemClick"
        @itemMoreClick="handleItemMoreClick"
        @itemMoreMouseenter="handleItemMoreMouseenter"
        @itemExpandhange="handleItemExpandhange"
      >
        <template v-for="name in Object.keys($slots)" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps || {}"></slot>
        </template>
      </ChatConversation>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { computed } from 'vue';
  import { ElIcon } from 'element-plus';
  import { EllipsisOutlined, ArrowDown } from '../../icons/index';
  import type { DropdownItem } from '../../ele-dropdown/types';
  import type {
    ConversationItem,
    ConversationDropdownItems,
    ChatConversationSlots
  } from '../types';

  defineOptions({ name: 'ChatConversation' });

  defineSlots<ChatConversationSlots>();

  const props = defineProps({
    /** 对话 */
    item: {
      type: Object as PropType<ConversationItem>,
      required: true
    },
    /** 对话列表选中 */
    active: [String, Number] as PropType<string | number>,
    /** 对话列表展开 */
    expandedKeys: Array as PropType<Array<string | number>>,
    /** 下拉菜单数据 */
    dropdownItems: [Array, Function] as PropType<ConversationDropdownItems>,
    /** 当前打开下拉菜单的对话值 */
    dropdownOpenKey: [String, Number] as PropType<string | number>
  });

  const emit = defineEmits({
    /**列表项点击事件 */
    itemClick: (_item: ConversationItem, _e: MouseEvent) => true,
    /**列表项更多按钮点击事件 */
    itemMoreClick: (
      _item: ConversationItem,
      _dropdownMenus: DropdownItem[],
      _e: MouseEvent
    ) => true,
    /**列表项更多按钮鼠标移入事件 */
    itemMoreMouseenter: (
      _item: ConversationItem,
      _dropdownMenus: DropdownItem[],
      _e: MouseEvent
    ) => true,
    /** 对话列表展开折叠事件 */
    itemExpandhange: (_item: ConversationItem, _expanded: boolean) => true
  });

  /** 是否收起状态 */
  const isShrink = computed<boolean>(() => {
    if (props.expandedKeys == null) {
      return false;
    }
    return !(
      props.item.key != null && props.expandedKeys.includes(props.item.key)
    );
  });

  /** 下拉菜单数据 */
  const dropdownData = computed<DropdownItem[]>(() => {
    if (typeof props.dropdownItems === 'function') {
      return props.dropdownItems(props.item) || [];
    }
    return props.dropdownItems || [];
  });

  /** 列表项展开折叠事件 */
  const handleItemExpandhange = (item: ConversationItem, expanded: boolean) => {
    emit('itemExpandhange', item, expanded);
  };

  /** 列表项点击事件 */
  const handleItemClick = (item: ConversationItem, e: MouseEvent) => {
    if (!item.group && item.children != null) {
      handleItemExpandhange(item, isShrink.value);
    }
    // TODO 父级点击也触发 itemClick 事件
    if (item.children != null) {
      return;
    }
    emit('itemClick', item, e);
  };

  /** 列表项更多按钮点击事件 */
  const handleItemMoreClick = (
    item: ConversationItem,
    dropdownMenus: DropdownItem[],
    e: MouseEvent
  ) => {
    emit('itemMoreClick', item, dropdownMenus, e);
  };

  /** 列表项更多按钮鼠标移入事件 */
  const handleItemMoreMouseenter = (
    item: ConversationItem,
    dropdownMenus: DropdownItem[],
    e: MouseEvent
  ) => {
    emit('itemMoreMouseenter', item, dropdownMenus, e);
  };
</script>
