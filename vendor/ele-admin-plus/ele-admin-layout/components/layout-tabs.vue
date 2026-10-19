<!-- 页签栏 -->
<template>
  <EleTabWrap :type="tabStyle" class="ele-admin-tabs">
    <EleTabTool
      v-if="fixedHome"
      :tab="true"
      :active="isHome"
      :tabName="homePath"
    >
      <slot name="tabHome" :active="active">
        <ElIcon class="ele-tab-icon" :style="{ verticalAlign: '-2px' }">
          <HomeOutlined :style="{ transform: 'scale(1.08)' }" />
        </ElIcon>
      </slot>
    </EleTabTool>
    <EleTabs
      v-if="tabs"
      :items="tabs"
      :modelValue="active"
      :sortable="tabSortable"
      :contextMenu="tabContextMenu"
      :contextMenus="tabContextMenus"
      :mousewheel="true"
      :handleClick="true"
      @tabRemove="handleTabRemove"
      @tabItemClick="handleTabItemClick"
      @tabContextMenu="handleTabContextMenu"
      @tabSortChange="handleTabSortChange"
    >
      <template v-if="$slots.tabTitle" #label="slotProps">
        <slot name="tabTitle" v-bind="slotProps || {}"></slot>
      </template>
    </EleTabs>
    <slot name="tabExtra" :active="active"></slot>
  </EleTabWrap>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ElIcon } from 'element-plus';
  import { HomeOutlined } from '../../icons/index';
  import type { EleDropdownProps } from '../../ele-app/plus';
  import type {
    TabPaneItem,
    TabEventOption,
    ContextMenus
  } from '../../ele-tabs/types';
  import EleTabWrap from '../../ele-tab-wrap/index.vue';
  import EleTabTool from '../../ele-tab-tool/index.vue';
  import EleTabs from '../../ele-tabs/index.vue';
  import type { TabStyle } from '../types';

  defineOptions({ name: 'LayoutTabs' });

  defineProps({
    /** 页签数据 */
    tabs: Array as PropType<TabPaneItem[]>,
    /** 页签选中 */
    active: String,
    /** 是否需要固定的主页页签 */
    fixedHome: Boolean,
    /** 主页路由地址 */
    homePath: String,
    /** 当前路由是否是主页 */
    isHome: Boolean,
    /** 页签风格 */
    tabStyle: String as PropType<TabStyle>,
    /** 是否支持右键菜单 */
    tabContextMenu: [Boolean, Object] as PropType<boolean | EleDropdownProps>,
    /** 右键菜单 */
    tabContextMenus: [Array, Function] as PropType<ContextMenus>,
    /** 是否支持拖动排序 */
    tabSortable: Boolean
  });

  const emit = defineEmits({
    tabClick: (_option: TabEventOption) => true,
    tabRemove: (_name: string) => true,
    tabContextMenu: (_option: TabEventOption) => true,
    tabSortChange: (_data: TabPaneItem[]) => true
  });

  /** 页签点击事件 */
  const handleTabItemClick = (option: TabEventOption) => {
    emit('tabClick', option);
  };

  /** 页签删除事件 */
  const handleTabRemove = (name: string) => {
    emit('tabRemove', name);
  };

  /** 页签右键菜单点击事件 */
  const handleTabContextMenu = (option: TabEventOption) => {
    emit('tabContextMenu', option);
  };

  /** 页签拖动排序改变事件 */
  const handleTabSortChange = (data: TabPaneItem[]) => {
    emit('tabSortChange', data);
  };
</script>
