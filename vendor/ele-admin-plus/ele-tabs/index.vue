<!-- 标签页 -->
<template>
  <ElTabs
    v-bind="tabProps"
    ref="tabRef"
    :type="tabType === 'card' || tabType === 'border-card' ? tabType : void 0"
    class="ele-tabs"
    :class="[
      { 'ele-tabs-wrap': isOnlyTab },
      { 'is-small': tabSize === 'small' },
      { 'is-large': tabSize === 'large' },
      { 'is-default': !tabType || tabType === 'default' },
      { 'is-plain': tabType === 'plain' },
      { 'is-simple': tabType === 'simple' },
      { 'is-indicator': tabType === 'indicator' },
      { 'is-button': tabType === 'button' },
      { 'is-tag': tabType === 'tag' },
      { 'is-center': center },
      { 'is-sortable': sortable },
      { 'is-flex-table': flexTable && flexTable !== 'auto' },
      { 'is-flex-auto-table': flexTable === 'auto' }
    ]"
    @update:modelValue="updateModelValue"
    @tabClick="handleTabClick"
    @tabChange="handleTabChange"
    @tabRemove="handleTabRemove"
    @tabAdd="handleTabAdd"
    @edit="handleEdit"
    @contextmenu="handleContextmenu"
  >
    <template v-if="$slots['add-icon']" #add-icon>
      <slot name="add-icon"></slot>
    </template>
    <template v-else-if="$slots.addIcon" #addIcon>
      <slot name="addIcon"></slot>
    </template>
    <ElTabPane
      v-for="(item, index) in items"
      :key="
        [
          index,
          item.name,
          item.label,
          !!item.closable,
          !!item.disabled,
          !!item.lazy
        ].join('-')
      "
      v-bind="omit(item, ['slot', 'meta'])"
    >
      <template v-if="item.name && $slots[item.slot || item.name]" #default>
        <slot :name="item.slot || item.name" :item="item"></slot>
      </template>
      <template #label>
        <div
          class="ele-tab-title"
          @click="(e) => handleItemClick(item, void 0, e)"
          @contextmenu="(e) => handleItemContextmenu(item, void 0, e)"
        >
          <slot
            name="label"
            :item="item"
            :label="item.label"
            :active="modelValue"
          >
            {{ item.label }}
          </slot>
        </div>
        <template v-if="tabType === 'simple' || tabType === 'indicator'">
          <div class="ele-tab-corner-left"></div>
          <div class="ele-tab-corner-right"></div>
        </template>
      </template>
    </ElTabPane>
    <EleDropdown
      v-if="contextMenu"
      :triggerKeys="[]"
      :persistent="false"
      :validateEvent="false"
      placement="bottom-start"
      popperClass="ele-tab-popup"
      :popperOptions="{
        modifiers: [{ name: 'offset', options: { offset: [0, 8] } }]
      }"
      v-bind="
        !contextMenu || typeof contextMenu == 'boolean' ? {} : contextMenu
      "
      ref="ctxMenuDropdownRef"
      componentType="pro"
      :preventContextmenu="true"
      trigger="contextmenu"
      :virtualTriggering="true"
      :virtualRef="ctxMenuDropdownVirtualRef"
      :disabled="!ctxMenuDropdownItems.length"
      :items="ctxMenuDropdownItems"
      @command="handleItemCtxMenuClick"
      @visibleChange="handleItemCtxMenuVisible"
    />
  </ElTabs>
</template>

<script lang="ts" setup>
  import {
    ref,
    shallowRef,
    computed,
    watch,
    onMounted,
    onBeforeUnmount,
    inject,
    nextTick
  } from 'vue';
  import SortableJs from 'sortablejs';
  import { ElTabs, ElTabPane } from 'element-plus';
  import type { TabPaneName, TabsPaneContext } from 'element-plus';
  import { omit, pick } from '../utils/common';
  import { useTimer, useMousewheel, useTouchEvent } from '../utils/hook';
  import type { ElTabsProps, ElTabsInstance } from '../ele-app/el';
  import type { EleDropdownInstance } from '../ele-app/plus';
  import type { DropdownItem } from '../ele-dropdown/types';
  import EleDropdown from '../ele-dropdown/index.vue';
  import type {
    TabPaneItem,
    TabSize,
    TabType,
    ContextMenusFunc
  } from './types';
  import { tabsProps, tabsEmits, tabPropKeys, TAB_WRAP_KEY } from './props';

  defineOptions({ name: 'EleTabs' });

  const props = defineProps(tabsProps);

  const emit = defineEmits(tabsEmits);

  /** 拖拽排序实例 */
  let sortableIns: SortableJs | null = null;

  /** 当前拖拽排序页签项标识 */
  let currentSortItemId: string | null = null;

  /** 当前打开的右键菜单对应的页签项数据 */
  let contextMenuTabItem: TabPaneItem | undefined | null = null;

  /** 当前打开的右键菜单对应的页签项标识 */
  let contextMenuTabName: string | number | undefined | null = null;

  /** 页签容器注入 */
  const wrapProps = inject(TAB_WRAP_KEY, null);

  /** 页签滚动节流 */
  const [startScrollTimer, _stopScrollTimer, scrollWaiting] = useTimer(320);

  /** 鼠标滚动事件 */
  const { bindMousewheel, unbindMousewheel } = useMousewheel((param) => {
    const { e, direction } = param;
    scrollTabs(direction === 'up' ? 'prev' : 'next', () => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  /** 触摸事件 */
  const { bindTouchEvent, unbindTouchEvent } = useTouchEvent({
    end: (param) => {
      if (param.distanceX && param.distanceX > 80) {
        scrollTabs('prev');
      } else if (param.distanceX && param.distanceX < 80) {
        scrollTabs('next');
      }
    },
    touchstartOptions: { passive: true },
    touchmoveOptions: { passive: true }
  });

  /** 页签拖动检查定时器 */
  const [startGhostTimer] = useTimer(100);

  /** 页签组件 */
  const tabRef = ref<ElTabsInstance>(null);

  /** 是否无父容器 */
  const isOnlyTab = computed<boolean>(() => wrapProps == null);

  /** 尺寸 */
  const tabSize = computed<TabSize | undefined>(() =>
    wrapProps == null ? props.size : wrapProps.size
  );

  /** 风格类型 */
  const tabType = computed<TabType | undefined>(() =>
    wrapProps == null ? props.type : wrapProps.type
  );

  /** 页签组件属性 */
  const tabProps = computed<Omit<ElTabsProps, 'type'>>(() => {
    return pick(props, tabPropKeys);
  });

  /** 页签项右键菜单组件 */
  const ctxMenuDropdownRef = ref<EleDropdownInstance>(null);

  /** 页签项右键菜单数据 */
  const ctxMenuDropdownItems = shallowRef<DropdownItem[]>([]);

  /** 页签项右键菜单虚拟触发节点 */
  const ctxMenuDropdownVirtualRef = ref<any>();

  /** 更新页签项选中 */
  const updateModelValue = (name: TabPaneName) => {
    emit('update:modelValue', name);
  };

  /** 右键事件 */
  const handleContextmenu = (e: MouseEvent) => {
    if (!props.contextMenu) {
      return;
    }
    const el = e.target as HTMLElement;
    if (
      el &&
      (el.classList.contains('is-icon-close') ||
        el.classList.contains('el-tabs__nav') ||
        el.classList.contains('el-tabs__item'))
    ) {
      e.preventDefault();
    }
  };

  /** 页签项点击事件 */
  const handleTabClick = (pane: TabsPaneContext, e: Event) => {
    emit('tabClick', pane, e);
  };

  /** 页签项切换事件 */
  const handleTabChange = (name: TabPaneName) => {
    emit('tabChange', name);
  };

  /** 页签项移除事件 */
  const handleTabRemove = (name: TabPaneName) => {
    emit('tabRemove', name);
  };

  /** 页签项新增事件 */
  const handleTabAdd = () => {
    emit('tabAdd');
  };

  /** 页签项移除或新增事件 */
  const handleEdit = (
    name: TabPaneName | undefined,
    action: 'remove' | 'add'
  ) => {
    emit('edit', name, action);
  };

  /** 页签项标题点击事件 */
  const handleItemClick = (
    item: TabPaneItem | undefined,
    tabName: string | number | undefined,
    e: MouseEvent
  ) => {
    if (props.handleClick) {
      e.stopPropagation();
    }
    emit('tabItemClick', {
      item,
      name: item ? item.name : tabName,
      active: props.modelValue
    });
  };

  /** 页签项右键菜单打开事件 */
  const handleItemCtxMenuVisible = (visible: boolean) => {
    if (visible) {
      emit(
        'tabContextOpen',
        ctxMenuDropdownRef.value,
        contextMenuTabItem,
        contextMenuTabName
      );
    }
  };

  /** 页签项右键菜单点击事件 */
  const handleItemCtxMenuClick = (command: string) => {
    if (contextMenuTabItem != null || contextMenuTabName != null) {
      emit('tabContextMenu', {
        command,
        item: contextMenuTabItem,
        name: contextMenuTabItem ? contextMenuTabItem.name : contextMenuTabName,
        active: props.modelValue
      });
    }
  };

  /** 获取页签项右键菜单数据 */
  const getContextMenus: ContextMenusFunc = (
    item?: TabPaneItem,
    tabName?: string | number
  ) => {
    if (typeof props.contextMenus === 'function') {
      return props.contextMenus(item, tabName);
    }
    return props.contextMenus;
  };

  /** 关闭页签项右键菜单 */
  const hideAllDropdown = () => {
    if (ctxMenuDropdownRef.value) {
      ctxMenuDropdownRef.value.handleClose();
    }
  };

  /** 显示页签项右键菜单 */
  const showItemContextMenu = (
    item: TabPaneItem | undefined,
    tabName: string | number | undefined,
    itemEl: HTMLElement
  ) => {
    /* if (
      (contextMenuTabItem != null && contextMenuTabItem === item) ||
      (contextMenuTabName != null && contextMenuTabName === tabName)
    ) {
      return;
    } */
    hideAllDropdown();
    nextTick(() => {
      contextMenuTabItem = item;
      contextMenuTabName = tabName;
      ctxMenuDropdownItems.value = getContextMenus(item, tabName) || [];
      const rect = itemEl.getBoundingClientRect();
      ctxMenuDropdownVirtualRef.value = {
        getBoundingClientRect: () => rect
      };
      if (props.contextMenu && ctxMenuDropdownItems.value.length) {
        nextTick(() => {
          ctxMenuDropdownRef.value && ctxMenuDropdownRef.value.handleOpen();
        });
      }
    });
  };

  /** 页签项右键菜单事件 */
  const handleItemContextmenu = (
    item: TabPaneItem | undefined,
    tabName: string | number | undefined,
    e: MouseEvent
  ) => {
    const itemEl = e.currentTarget as HTMLElement;
    if (!props.contextMenu) {
      return;
    }
    if (ctxMenuDropdownVirtualRef.value === itemEl) {
      ctxMenuDropdownItems.value = getContextMenus(item, tabName) || [];
      return;
    }
    e.preventDefault();
    showItemContextMenu(item, tabName, itemEl);
  };

  /** 获取页签项容器节点 */
  const getHeaderEl = (): HTMLElement | null | undefined => {
    const tabEl = tabRef.value ? tabRef.value.$el : void 0;
    return tabEl ? tabEl.querySelector('.el-tabs__header') : void 0;
  };

  /** 获取页签节点 */
  const getNavEl = (): Element | null | undefined => {
    const headerEl = getHeaderEl();
    return headerEl ? headerEl.querySelector('.el-tabs__nav') : void 0;
  };

  /** 更新选中指示线位置 */
  const updateActiveBar = () => {
    const el = getNavEl();
    if (el) {
      const bar = el.querySelector('.el-tabs__active-bar') as HTMLElement;
      if (bar) {
        bar.style.width = '0px';
      }
    }
  };

  /** 滚动页签 */
  const scrollTabs = (direction: 'prev' | 'next', done?: () => void) => {
    const tabEl = getHeaderEl();
    if (tabEl && !scrollWaiting.value) {
      const el = tabEl.querySelector(`.el-tabs__nav-${direction}`);
      if (el && !el.classList.contains('is-disabled')) {
        startScrollTimer();
        done && done();
        (el as HTMLDivElement).click();
      }
    }
  };

  /** 页签拖动时检查状态 */
  const checkSortGhostTab = () => {
    const navEl = getNavEl();
    if (navEl == null) {
      return;
    }
    if (currentSortItemId == null) {
      const el = navEl.querySelector('.el-tabs__item.sortable-ghost');
      if (el != null) {
        el.classList.remove('sortable-ghost');
      }
      return;
    }
    const el = navEl.querySelector(`.el-tabs__item[id="${currentSortItemId}"]`);
    if (el != null) {
      el.classList.add('sortable-ghost');
    }
  };

  /** 绑定页签拖动排序事件 */
  const bindDragSort = () => {
    unbindDragSort();
    const navEl = getNavEl();
    if (!props.sortable || !navEl) {
      return;
    }
    sortableIns = new SortableJs(navEl as HTMLElement, {
      draggable: '.el-tabs__item',
      delay: 20,
      onUpdate: ({ oldDraggableIndex, newDraggableIndex }) => {
        if (
          typeof oldDraggableIndex === 'number' &&
          typeof newDraggableIndex === 'number'
        ) {
          const data = [...(props.items as TabPaneItem[])];
          data.splice(
            newDraggableIndex,
            0,
            data.splice(oldDraggableIndex, 1)[0]
          );
          emit('tabSortChange', data);
        }
      },
      onStart: (e) => {
        currentSortItemId = e.item.getAttribute('id');
        checkSortGhostTab();
        startGhostTimer(() => {
          checkSortGhostTab();
        });
      },
      onEnd: () => {
        currentSortItemId = null;
        checkSortGhostTab();
      },
      onChange: () => {
        checkSortGhostTab();
        startGhostTimer(() => {
          checkSortGhostTab();
        });
      },
      onMove: () => {
        checkSortGhostTab();
        startGhostTimer(() => {
          checkSortGhostTab();
        });
      },
      setData: () => {}
    });
  };

  /** 销毁页签拖动排序事件 */
  const unbindDragSort = () => {
    sortableIns && sortableIns.destroy();
    sortableIns = null;
    currentSortItemId = null;
  };

  /** 绑定鼠标滚轮滑动页签事件 */
  const initMousewheelEvent = () => {
    const el = getHeaderEl();
    if (el != null) {
      unbindMousewheel(el);
      if (props.mousewheel) {
        bindMousewheel(el);
      }
    }
  };

  /** 绑定触摸滚轮滑动页签事件 */
  const initTouchEvent = () => {
    const el = getHeaderEl();
    if (el != null) {
      unbindTouchEvent(el);
      if (!props.sortable) {
        bindTouchEvent(el);
      }
    }
  };

  /** 为容器提供页签操作方法 */
  if (wrapProps && wrapProps.setTabMethods) {
    wrapProps.setTabMethods({
      triggerTabItemClick: handleItemClick,
      triggerItemContextMenu: handleItemContextmenu
    });
  }

  /** 绑定事件 */
  onMounted(() => {
    initMousewheelEvent();
    initTouchEvent();
    bindDragSort();
  });

  onBeforeUnmount(() => {
    if (wrapProps && wrapProps.setTabMethods) {
      wrapProps.setTabMethods({
        triggerTabItemClick: void 0,
        triggerItemContextMenu: void 0
      });
    }
    contextMenuTabItem = null;
    contextMenuTabName = null;
    const el = getHeaderEl();
    if (el != null) {
      unbindMousewheel(el);
      unbindTouchEvent(el);
    }
    unbindDragSort();
  });

  watch(
    () => props.items,
    () => {
      if (props.items?.length && props.sortable && !sortableIns) {
        bindDragSort();
        nextTick(() => {
          if (props.items?.length && props.sortable && !sortableIns) {
            bindDragSort();
          }
        });
      }
    },
    { deep: true }
  );

  watch(
    () => props.sortable,
    () => {
      bindDragSort();
      initTouchEvent();
    }
  );

  watch(
    () => props.mousewheel,
    () => {
      initMousewheelEvent();
    }
  );

  watch(
    () => props.contextMenus,
    (ctxMenus) => {
      if (Array.isArray(ctxMenus) && ctxMenuDropdownItems.value !== ctxMenus) {
        ctxMenuDropdownItems.value = ctxMenus;
      }
    },
    { deep: true }
  );

  defineExpose({
    tabRef,
    ctxMenuDropdownRef,
    hideAllDropdown,
    updateActiveBar,
    scrollTabs
  });
</script>
