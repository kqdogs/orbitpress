<!-- 对话列表 -->
<template>
  <div class="ele-chat-conversation-list">
    <ChatConversation
      v-for="item in items"
      :key="item.key ?? item.label"
      :item="item"
      :active="active"
      :expandedKeys="expandedItemKeys"
      :dropdownItems="dropdownItems"
      :dropdownOpenKey="itemDropdownOpenKey"
      @itemClick="handleChatItemClick"
      @itemMoreClick="handleItemMoreClick"
      @itemMoreMouseenter="handleItemMoreMouseenter"
      @itemExpandhange="handleItemExpandhange"
    >
      <template v-for="name in Object.keys($slots)" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps || {}"></slot>
      </template>
    </ChatConversation>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref, inject, watch } from 'vue';
  import type {
    EleDropdownProps,
    EleDropdownPropsAndEmits
  } from '../../ele-app/plus';
  import { useDropdown } from '../../ele-dropdown-provider/util';
  import type { DropdownItem } from '../../ele-dropdown/types';
  import ChatConversation from './chat-conversation.vue';
  import { CHAT_KEY, defaultDropdownProps } from '../props';
  import type {
    ConversationItem,
    ConversationDropdownItems,
    ChatConversationSlots
  } from '../types';

  defineSlots<ChatConversationSlots>();

  const props = defineProps({
    /** 对话列表 */
    items: Array as PropType<ConversationItem[]>,
    /** 对话列表选中 */
    active: [String, Number] as PropType<string | number>,
    /** 对话列表展开 */
    expandedKeys: Array as PropType<Array<string | number>>,
    /** 下拉菜单属性 */
    dropdownProps: Object as PropType<EleDropdownProps>,
    /** 下拉菜单数据 */
    dropdownItems: [Array, Function] as PropType<ConversationDropdownItems>
  });

  const emit = defineEmits({
    /**对话列表项点击事件 */
    itemClick: (_item: ConversationItem) => true,
    /** 更新对话列表选中 */
    'update:active': (_active?: string | number) => true,
    /** 更新对话列表展开 */
    'update:expandedKeys': (_keys?: Array<string | number>) => true
  });

  const chatProvider = inject(CHAT_KEY, null);
  const dropdownProvider = useDropdown();

  /** 当前展开的对话列表 */
  const expandedItemKeys = ref<Array<string | number> | undefined>(
    props.expandedKeys
  );

  /** 当前打开下拉菜单的对话值 */
  const itemDropdownOpenKey = ref<string | number>();

  /** 当前打开的下拉菜单对应的数据 */
  let itemDropdownCurrentData: ConversationItem | undefined;

  /** 对话列表项点击事件 */
  const handleChatItemClick = (item: ConversationItem) => {
    emit('itemClick', item);
    if (item.key != null && item.key !== props.active) {
      emit('update:active', item.key);
    }
  };

  /** 打开下拉菜单 */
  const openDropdown = (
    item: ConversationItem,
    triggerEl: any,
    dropdownMenus: DropdownItem[],
    dropdownProps?: EleDropdownProps
  ) => {
    if (!dropdownMenus.length) {
      const f =
        dropdownProvider?.removeDropdown ?? chatProvider?.removeDropdown;
      f && f(triggerEl);
      return;
    }
    itemDropdownCurrentData = item;
    itemDropdownOpenKey.value = item.key;
    const option: EleDropdownPropsAndEmits = {
      ...defaultDropdownProps,
      onVisibleChange: handleDropdownVisibleChange,
      ...(dropdownProps || {})
    };
    const func = dropdownProvider?.openDropdown ?? chatProvider?.openDropdown;
    func && func(triggerEl, dropdownMenus, option);
  };

  /** 对话列表项更多按钮点击事件 */
  const handleItemMoreClick = (
    item: ConversationItem,
    dropdownMenus: DropdownItem[],
    e: MouseEvent
  ) => {
    if (props.dropdownProps?.trigger !== 'hover') {
      openDropdown(item, e.currentTarget, dropdownMenus, props.dropdownProps);
    }
  };

  /** 对话列表项更多按钮鼠标移入事件 */
  const handleItemMoreMouseenter = (
    item: ConversationItem,
    dropdownMenus: DropdownItem[],
    e: MouseEvent
  ) => {
    if (props.dropdownProps?.trigger === 'hover') {
      openDropdown(item, e.currentTarget, dropdownMenus, props.dropdownProps);
    }
  };

  /** 判断对话列表展开数据是否改变 */
  const expandedKeysIsChanged = (
    keys1: Array<string | number> | undefined,
    keys2: Array<string | number> | undefined
  ) => {
    if (keys1 == null && keys2 == null) {
      return false;
    }
    if ((keys1 != null && keys2 == null) || (keys1 == null && keys2 != null)) {
      return true;
    }
    if ((keys1?.length ?? 0) !== (keys2?.length ?? 0)) {
      return true;
    }
    return (keys1 ?? []).some((v) => !(keys2 ?? []).includes(v));
  };

  /** 对话列表项展开折叠事件 */
  const handleItemExpandhange = (item: ConversationItem, expanded: boolean) => {
    if (item.key == null) {
      return;
    }
    const keys = new Set(expandedItemKeys.value || []);
    if (expandedItemKeys.value == null && props.items) {
      props.items.forEach((d) => {
        if (d.key != null) {
          keys.add(d.key);
        }
      });
    }
    if (expanded) {
      keys.add(item.key);
    } else {
      keys.delete(item.key);
    }
    expandedItemKeys.value = [...keys];
    if (expandedKeysIsChanged(props.expandedKeys, expandedItemKeys.value)) {
      emit('update:expandedKeys', expandedItemKeys.value);
    }
  };

  /** 下拉菜单打开状态改变事件 */
  const handleDropdownVisibleChange = (visible: boolean) => {
    if (!visible) {
      itemDropdownOpenKey.value = void 0;
    } else {
      itemDropdownOpenKey.value = itemDropdownCurrentData?.key;
    }
  };

  /** 同步对话列表展开 */
  watch(
    () => props.expandedKeys,
    (keys) => {
      if (expandedKeysIsChanged(keys, expandedItemKeys.value)) {
        expandedItemKeys.value = keys;
      }
    },
    { deep: true }
  );
</script>
