<!-- 布局 -->
<template>
  <LayoutSkeleton
    :isHeaderLogo="isHeaderLogo"
    :class="[
      { 'is-fixed-body': fixedBody },
      { 'is-top-layout': isTopLayout },
      { 'is-transition-disabled': isDisableTransition },
      { 'is-maximized': maximized },
      { 'is-expanded': maximized === 'expanded' },
      { 'is-mobile': isMobile },
      { 'is-collapse': isCollapseMobile }
    ]"
    :style="{
      minHeight: layoutHeight,
      height: fixedBody ? layoutHeight : void 0
    }"
  >
    <!-- 顶栏 -->
    <template #head>
      <div
        v-if="!isSideLayout"
        class="ele-admin-header"
        :class="[
          { 'is-dark': isDarkHeader },
          { 'is-primary': isPrimaryHeader },
          { 'is-ghost': isGhostHeader },
          { 'show-divider': tabBar && !showHeaderTabs && !isButtonTab },
          { 'is-fixed': isFixedHeader }
        ]"
        :style="headerCustomStyle"
        @mouseenter="handleHeadMouseenter"
        @mouseleave="handleHeadMouseleave"
      >
        <!-- logo -->
        <div
          v-if="
            isHeaderLogo &&
            (logoSrc || logoTitle || $slots.logo || $slots.logoTitle)
          "
          class="ele-admin-logo"
          :style="logoStyle"
          @click="handleLogoClick"
        >
          <slot v-if="logoSrc || $slots.logo" name="logo">
            <img :src="logoSrc" />
          </slot>
          <slot v-if="logoTitle || $slots.logoTitle" name="logoTitle">
            <h1>{{ logoTitle }}</h1>
          </slot>
        </div>
        <!-- 顶栏左侧操作按钮 -->
        <div v-if="$slots.left" class="ele-admin-tools">
          <slot name="left"></slot>
        </div>
        <!-- 顶栏面包屑导航 -->
        <div
          v-if="breadcrumb"
          class="ele-admin-breadcrumb"
          :style="breadcrumbStyle"
        >
          <slot name="breadcrumb">
            <EleBreadcrumb
              v-if="levels && levels.length"
              v-bind="breadcrumb === true ? {} : breadcrumb"
              :items="levels"
            />
          </slot>
        </div>
        <slot name="center"></slot>
        <!-- 顶栏菜单 -->
        <div
          v-if="!showHeaderTabs || showHeaderMenus"
          class="ele-admin-menus"
          :style="headerMenusStyle"
        >
          <EleMenus
            v-if="showHeaderMenus && headerMenus"
            mode="horizontal"
            :theme="isDarkHeader || isPrimaryHeader ? 'dark' : 'light'"
            :popupTheme="isDarkHeader ? 'dark' : 'light'"
            :defaultActive="headerActive"
            v-bind="headerMenuProps || {}"
            :items="headerMenus"
            @open="handleHeadMenuOpen"
            @close="handleHeadMenuClose"
            @itemClick="handleHeadMenuItemClick"
            @itemMouseenter="handleHeadMenuItemMouseenter"
            @itemMouseleave="handleHeadMenuItemMouseleave"
          >
            <template
              v-if="
                headerIconSlot &&
                !ownSlots.includes(headerIconSlot) &&
                $slots[headerIconSlot]
              "
              #icon="slotProps"
            >
              <slot :name="headerIconSlot" v-bind="slotProps || {}"></slot>
            </template>
            <template
              v-if="
                headerTitleSlot &&
                !ownSlots.includes(headerTitleSlot) &&
                $slots[headerTitleSlot]
              "
              #title="slotProps"
            >
              <slot :name="headerTitleSlot" v-bind="slotProps || {}"></slot>
            </template>
          </EleMenus>
        </div>
        <!-- 顶栏页签栏 -->
        <LayoutTabs
          v-if="showHeaderTabs"
          :tabs="tabs"
          :active="tabActive"
          :fixedHome="fixedHome"
          :homePath="homePath"
          :isHome="isHome"
          :tabStyle="tabStyle"
          :tabContextMenu="tabContextMenu"
          :tabContextMenus="tabContextMenus"
          :tabSortable="tabSortable"
          :class="[{ 'is-fixed-home': fixedHome }]"
          :style="tabsCustomStyle"
          @tabClick="handleTabClick"
          @tabRemove="handleTabRemove"
          @tabContextMenu="handleTabContextMenu"
          @tabSortChange="handleTabSortChange"
        >
          <template
            v-for="name in Object.keys($slots).filter((k) =>
              tabSlots.includes(k)
            )"
            #[name]="slotProps"
          >
            <slot :name="name" v-bind="slotProps || {}"></slot>
          </template>
        </LayoutTabs>
        <!-- 顶栏右侧操作按钮 -->
        <div v-if="$slots.right" class="ele-admin-tools">
          <slot name="right"></slot>
        </div>
      </div>
    </template>
    <template #side>
      <div
        v-if="!isTopLayout"
        class="ele-admin-side"
        :class="[
          { 'is-fixed': isFixedSidebar },
          { 'show-placeholder': isFixedSidebar && isHeaderLogo },
          { 'is-collapse': !isMobile && !isBoxSidebar && isCollapseSidebar },
          { 'is-mix': !isMobile && !isBoxSidebar && isMixSidebar },
          { 'is-compact': !isMobile && compact },
          { 'is-box': !isMobile && isBoxSidebar }
        ]"
        :style="[
          { height: isFixedSidebar ? layoutHeight : void 0 },
          sideCustomStyle
        ]"
      >
        <!-- 双侧栏一级 -->
        <div
          v-if="isMixSidebar"
          class="ele-admin-sidebox"
          :class="[
            { 'is-dark': isDarkSidebar },
            { 'is-ghost': isGhostSidebar },
            { 'show-divider': !isCollapseSidebar && !isBoxSidebar },
            { 'is-compact': compact }
          ]"
          :style="sideboxCustomStyle"
          @mouseenter="handleBoxMouseEnter"
          @mouseleave="handleBoxMouseLeave"
        >
          <div
            v-if="!isHeaderLogo && (logoSrc || $slots.logo)"
            class="ele-admin-logo"
            :style="logoStyle"
            @click="handleLogoClick"
          >
            <slot name="logo">
              <img :src="logoSrc" />
            </slot>
          </div>
          <slot name="boxTop"></slot>
          <ElScrollbar class="ele-admin-menus" :style="sideboxMenusStyle">
            <EleMenus
              v-if="sideboxMenus"
              ref="sideboxMenuRef"
              mode="compact"
              :uniqueOpened="true"
              :collapseTransition="false"
              :theme="sidebarStyle"
              :defaultActive="sideboxActive"
              :collapse="compact"
              v-bind="sideboxMenuProps || {}"
              :items="sideboxMenus"
              @itemClick="handleBoxMenuItemClick"
              @itemMouseenter="handleBoxMenuItemMouseenter"
              @itemMouseleave="handleBoxMenuItemMouseleave"
            >
              <template
                v-if="
                  sideboxIconSlot &&
                  !ownSlots.includes(sideboxIconSlot) &&
                  $slots[sideboxIconSlot]
                "
                #icon="slotProps"
              >
                <slot :name="sideboxIconSlot" v-bind="slotProps || {}"></slot>
              </template>
              <template
                v-if="
                  sideboxTitleSlot &&
                  !ownSlots.includes(sideboxTitleSlot) &&
                  $slots[sideboxTitleSlot]
                "
                #title="slotProps"
              >
                <slot :name="sideboxTitleSlot" v-bind="slotProps || {}"></slot>
              </template>
            </EleMenus>
          </ElScrollbar>
          <slot name="boxBottom"></slot>
        </div>
        <!-- 侧栏 -->
        <div
          v-if="!isBoxSidebar"
          class="ele-admin-sidebar"
          :class="[
            { 'is-dark': isMixSidebar ? isDarkMixSidebar : isDarkSidebar },
            { 'is-ghost': isGhostSidebar },
            { 'is-mix': isMixSidebar },
            { 'is-collapse': isCollapseSidebar }
          ]"
          :style="sidebarCustomStyle"
          @mouseenter="handleSideMouseEnter"
          @mouseleave="handleSideMouseLeave"
        >
          <template v-if="isMixSidebar">
            <div
              v-if="!isHeaderLogo && (logoTitle || $slots.logoTitle)"
              class="ele-admin-logo-title"
              :style="logoTitleStyle"
            >
              <slot name="logoTitle">
                <h1>{{ logoTitle }}</h1>
              </slot>
            </div>
          </template>
          <div
            v-else-if="
              !isHeaderLogo &&
              (logoSrc || logoTitle || $slots.logo || $slots.logoTitle)
            "
            class="ele-admin-logo"
            :style="logoStyle"
            @click="handleLogoClick"
          >
            <slot v-if="logoSrc || $slots.logo" name="logo">
              <img :src="logoSrc" />
            </slot>
            <slot v-if="logoTitle || $slots.logoTitle" name="logoTitle">
              <h1>{{ logoTitle }}</h1>
            </slot>
          </div>
          <slot name="top"></slot>
          <ElScrollbar class="ele-admin-menus" :style="sidebarMenusStyle">
            <EleMenus
              v-if="sidebarMenus"
              ref="sidebarMenuRef"
              :uniqueOpened="true"
              :collapseTransition="false"
              :theme="
                isMixSidebar
                  ? isDarkMixSidebar
                    ? 'dark'
                    : void 0
                  : sidebarStyle
              "
              :defaultActive="sidebarActive"
              :collapse="isMixSidebar ? false : isCollapseSidebar"
              v-bind="sidebarMenuProps || {}"
              :items="sidebarMenus"
              @open="handleSideMenuOpen"
              @close="handleSideMenuClose"
              @itemClick="handleSideMenuItemClick"
            >
              <template
                v-if="
                  sidebarIconSlot &&
                  !ownSlots.includes(sidebarIconSlot) &&
                  $slots[sidebarIconSlot]
                "
                #icon="slotProps"
              >
                <slot :name="sidebarIconSlot" v-bind="slotProps || {}"></slot>
              </template>
              <template
                v-if="
                  sidebarTitleSlot &&
                  !ownSlots.includes(sidebarTitleSlot) &&
                  $slots[sidebarTitleSlot]
                "
                #title="slotProps"
              >
                <slot :name="sidebarTitleSlot" v-bind="slotProps || {}"></slot>
              </template>
            </EleMenus>
          </ElScrollbar>
          <slot name="bottom"></slot>
        </div>
      </div>
    </template>
    <!-- 页签栏 -->
    <template #tabs="{ param }">
      <LayoutTabs
        v-if="tabBar && !showHeaderTabs"
        :tabs="tabs"
        :active="tabActive"
        :fixedHome="fixedHome"
        :homePath="homePath"
        :isHome="isHome"
        :tabStyle="tabStyle"
        :tabContextMenu="tabContextMenu"
        :tabContextMenus="tabContextMenus"
        :tabSortable="tabSortable"
        :class="[
          { 'is-fixed-home': fixedHome },
          { 'is-fixed': isFixedHeader },
          { 'is-fixed-top': isFixedHeader && (isSideLayout || maximized) }
        ]"
        :style="tabsCustomStyle"
        @tabClick="handleTabClick"
        @tabRemove="(name) => handleTabRemove(name, !!param?.label)"
        @tabContextMenu="handleTabContextMenu"
        @tabSortChange="handleTabSortChange"
      >
        <template
          v-for="name in Object.keys($slots).filter((k) =>
            tabSlots.includes(k)
          )"
          #[name]="slotProps"
        >
          <slot :name="name" v-bind="slotProps || {}"></slot>
        </template>
      </LayoutTabs>
    </template>
    <!-- 内容区域 -->
    <template #body="{ param }">
      <div
        ref="contentRef"
        class="ele-admin-content"
        :class="contentCustomClass"
        :style="contentCustomStyle"
      >
        <slot></slot>
      </div>
      <slot name="body"></slot>
      <!-- 返回顶部 -->
      <EleBacktop
        v-if="backTop"
        :target="fixedBody && contentRef ? contentRef : void 0"
        :style="fixedBody ? { position: 'absolute' } : void 0"
        v-bind="backTop === true ? {} : backTop"
      />
      <!-- 模态框容器 -->
      <div ref="modalsRef" class="ele-admin-modals" :data-id="param?.key"></div>
    </template>
    <!-- 移动端风格遮罩层 -->
    <div class="ele-admin-mask" @click="updateCollapse()"></div>
  </LayoutSkeleton>
</template>

<script lang="ts" setup>
  import {
    shallowRef,
    shallowReactive,
    computed,
    watch,
    nextTick,
    onMounted,
    provide
  } from 'vue';
  import { ElScrollbar } from 'element-plus';
  import { useTimer } from '../utils/hook';
  import type { EleMenusInstance } from '../ele-app/plus';
  import type { MenuItem, MenuItemClickType } from '../ele-menus/types';
  import type { TabPaneItem, TabEventOption } from '../ele-tabs/types';
  import EleMenus from '../ele-menus/index.vue';
  import EleBreadcrumb from '../ele-breadcrumb/index.vue';
  import EleBacktop from '../ele-backtop/index.vue';
  import LayoutSkeleton from './components/layout-skeleton.vue';
  import LayoutTabs from './components/layout-tabs.vue';
  import type { LayoutProvide } from './types';
  import { adminLayoutProps, adminLayoutEmits, LAYOUT_KEY } from './props';
  /** 页签相关插槽名称 */
  const tabSlots = ['tabTitle', 'tabExtra', 'tabHome'];
  /** 自己的插槽名称 */
  const ownSlots = [
    'logo',
    'logoTitle',
    'left',
    'right',
    'center',
    'breadcrumb',
    'top',
    'bottom',
    'boxTop',
    'boxBottom',
    'body',
    ...tabSlots
  ];

  defineOptions({ name: 'EleAdminLayout' });

  const props = defineProps(adminLayoutProps);

  const emit = defineEmits(adminLayoutEmits);

  const [startDisableTransitionTimer] = useTimer(100);
  const [startSidebarMenuTimer, stopSidebarMenuTimer] = useTimer(420);
  const [startSideboxMenuTimer, stopSideboxMenuTimer] = useTimer(420);
  const [startHeaderHoverTimer, stopHeaderHoverTimer] = useTimer(300);
  let isHeaderhover: boolean = false;

  /** 侧栏菜单容器 */
  const sidebarMenuRef = shallowRef<EleMenusInstance>(null);

  /** 双侧栏一级菜单容器 */
  const sideboxMenuRef = shallowRef<EleMenusInstance>(null);

  /** 内容区域 */
  const contentRef = shallowRef<HTMLElement | null>(null);

  /** 模态框容器 */
  const modalsRef = shallowRef<HTMLElement | null>(null);

  /** 是否禁用过渡动画 */
  const isDisableTransition = shallowRef<boolean>(false);

  /** 布局高度 */
  const layoutHeight = computed<string | undefined>(() =>
    typeof props.height === 'number' ? `${props.height}px` : props.height
  );

  /** 是否固定顶栏 */
  const isFixedHeader = computed<boolean>(
    () => !props.fixedBody && props.fixedHeader
  );

  /** 是否固定侧栏 */
  const isFixedSidebar = computed<boolean>(
    () => !props.fixedBody && props.fixedSidebar
  );

  /** 是否顶栏导航布局 */
  const isTopLayout = computed<boolean>(() => props.layout === 'top');

  /** 是否仅侧栏导航布局 */
  const isSideLayout = computed<boolean>(() => props.layout === 'side');

  /** 是否仅双侧栏一级布局 */
  const isBoxSidebar = computed<boolean>(() => props.sidebarLayout === 'box');

  /** 是否双侧栏布局 */
  const isMixSidebar = computed<boolean>(
    () =>
      !isTopLayout.value &&
      (props.sidebarLayout === 'mix' || isBoxSidebar.value)
  );

  /** 是否是移动端风格 */
  const isMobile = computed(() => props.mobile && !isTopLayout.value);

  /** logo是否位于顶栏 */
  const isHeaderLogo = computed<boolean>(
    () =>
      (props.logoInHeader || isTopLayout.value) &&
      !isSideLayout.value &&
      !isMobile.value
  );

  /** 是否显示顶栏菜单 */
  const showHeaderMenus = computed<boolean>(
    () => isTopLayout.value || props.layout === 'mix'
  );

  /** 是否显示顶栏页签栏 */
  const showHeaderTabs = computed<boolean>(() => props.tabBar === 'header');

  /** 是否是暗色顶栏 */
  const isDarkHeader = computed<boolean>(() => props.headerStyle === 'dark');

  /** 是否是主色顶栏 */
  const isPrimaryHeader = computed<boolean>(
    () => props.headerStyle === 'primary'
  );

  /** 是否是卡片风格页签 */
  const isButtonTab = computed<boolean>(() => props.tabStyle === 'button');

  /** 是否是暗色侧栏 */
  const isDarkSidebar = computed<boolean>(() => props.sidebarStyle === 'dark');

  /** 双侧栏时是否是暗色侧栏 */
  const isDarkMixSidebar = computed<boolean>(() =>
    props.mixSidebarStyle == null
      ? isMixSidebar.value &&
        !isHeaderLogo.value &&
        isDarkSidebar.value &&
        (isDarkHeader.value || isPrimaryHeader.value)
      : props.mixSidebarStyle === 'dark'
  );

  /** 是否透明模糊顶栏背景 */
  const isGhostHeader = computed<boolean>(
    () =>
      !isDarkHeader.value &&
      !isPrimaryHeader.value &&
      showHeaderTabs.value &&
      isButtonTab.value
  );

  /** 是否透明模糊侧栏背景 */
  const isGhostSidebar = computed<boolean>(
    () => isGhostHeader.value && !isDarkSidebar.value
  );

  /** 是否折叠侧栏 */
  const isCollapseSidebar = computed<boolean>(
    () => !isMobile.value && props.collapse
  );

  /** 是否是移动端风格折叠状态 */
  const isCollapseMobile = computed<boolean>(
    () => isMobile.value && props.collapse
  );

  /** 获取内容区域节点 */
  const getContentEl = (): HTMLElement | null => {
    return contentRef.value;
  };

  /** 获取模态框容器节点 */
  const getModalsEl = (): HTMLElement | null => {
    return modalsRef.value;
  };

  /** 获取内容容器节点 */
  const getBodyWrapperEl = (): HTMLElement | null | undefined => {
    const contentEl = getContentEl();
    return contentEl?.parentElement;
  };

  /** 侧栏菜单滚动到选中节点 */
  const sidebarScrollToActive = () => {
    stopSidebarMenuTimer();
    if (
      !(props.fixedBody || props.fixedSidebar) ||
      !props.menuScrollToActive ||
      sidebarMenuRef.value == null ||
      isCollapseMobile.value ||
      (isMixSidebar.value && isCollapseSidebar.value)
    ) {
      return;
    }
    startSidebarMenuTimer(() => {
      sidebarMenuRef.value && sidebarMenuRef.value.scrollToActive();
    });
  };

  /** 双侧栏一级菜单滚动到选中节点 */
  const sideboxScrollToActive = () => {
    stopSideboxMenuTimer();
    if (
      !(props.fixedBody || props.fixedSidebar) ||
      !props.menuScrollToActive ||
      sideboxMenuRef.value == null ||
      isCollapseMobile.value
    ) {
      return;
    }
    startSideboxMenuTimer(() => {
      sideboxMenuRef.value && sideboxMenuRef.value.scrollToActive();
    });
  };

  /** 更新侧栏折叠状态 */
  const updateCollapse = (value?: boolean) => {
    const collapse = typeof value === 'boolean' ? value : !props.collapse;
    if (collapse !== props.collapse) {
      emit('update:collapse', collapse);
    }
  };

  /** logo点击事件 */
  const handleLogoClick = (e: MouseEvent) => {
    emit('logoClick', e);
  };

  /** 顶栏父级菜单展开事件 */
  const handleHeadMenuOpen = (index: string, indexPath: string[]) => {
    emit('headMenuOpen', index, indexPath);
  };

  /** 顶栏父级菜单收起事件 */
  const handleHeadMenuClose = (index: string, indexPath: string[]) => {
    emit('headMenuClose', index, indexPath);
  };

  /** 顶栏子菜单项点击事件 */
  const handleHeadMenuItemClick = (
    item: MenuItem,
    e: MouseEvent,
    type?: MenuItemClickType
  ) => {
    emit('headMenuItemClick', item, e, type);
  };

  /** 顶栏子菜单项鼠标进入事件 */
  const handleHeadMenuItemMouseenter = (item: MenuItem, e: MouseEvent) => {
    emit('headMenuItemMouseenter', item, e);
    handleHeadMouseenter(e);
  };

  /** 顶栏子菜单项鼠标离开事件 */
  const handleHeadMenuItemMouseleave = (item: MenuItem, e: MouseEvent) => {
    emit('headMenuItemMouseleave', item, e);
    handleHeadMouseleave(e);
  };

  /** 顶栏鼠标进入事件 */
  const handleHeadMouseenter = (e: MouseEvent) => {
    stopHeaderHoverTimer();
    if (!isHeaderhover) {
      isHeaderhover = true;
      emit('headMouseenter', e);
    }
  };

  /** 顶栏鼠标离开事件 */
  const handleHeadMouseleave = (e: MouseEvent) => {
    startHeaderHoverTimer(() => {
      isHeaderhover = false;
      emit('headMouseleave', e);
    });
  };

  /** 双侧栏一级子菜单项点击事件 */
  const handleBoxMenuItemClick = (
    item: MenuItem,
    e: MouseEvent,
    type?: MenuItemClickType
  ) => {
    emit('boxMenuItemClick', item, e, type);
  };

  /** 双侧栏一级子菜单项鼠标进入事件 */
  const handleBoxMenuItemMouseenter = (item: MenuItem, e: MouseEvent) => {
    emit('boxMenuItemMouseenter', item, e);
  };

  /** 双侧栏一级子菜单项鼠标离开事件 */
  const handleBoxMenuItemMouseleave = (item: MenuItem, e: MouseEvent) => {
    emit('boxMenuItemMouseleave', item, e);
  };

  /** 双侧栏一级鼠标进入事件 */
  const handleBoxMouseEnter = (e: MouseEvent) => {
    emit('boxMouseenter', e);
  };

  /** 双侧栏一级鼠标离开事件 */
  const handleBoxMouseLeave = (e: MouseEvent) => {
    emit('boxMouseleave', e);
  };

  /** 侧栏父级菜单展开事件 */
  const handleSideMenuOpen = (index: string, indexPath: string[]) => {
    emit('sideMenuOpen', index, indexPath);
  };

  /** 侧栏父级菜单收起事件 */
  const handleSideMenuClose = (index: string, indexPath: string[]) => {
    emit('sideMenuClose', index, indexPath);
  };

  /** 侧栏子菜单项点击事件件 */
  const handleSideMenuItemClick = (
    item: MenuItem,
    e: MouseEvent,
    type?: MenuItemClickType
  ) => {
    emit('sideMenuItemClick', item, e, type);
  };

  /** 侧栏鼠标进入事件 */
  const handleSideMouseEnter = (e: MouseEvent) => {
    emit('sideMouseenter', e);
  };

  /** 侧栏鼠标离开事件 */
  const handleSideMouseLeave = (e: MouseEvent) => {
    emit('sideMouseleave', e);
  };

  /** 页签点击事件 */
  const handleTabClick = (option: TabEventOption) => {
    emit('tabClick', option);
  };

  /** 页签移除事件 */
  const handleTabRemove = (name: string, closeable?: boolean) => {
    if (closeable == null || closeable) {
      emit('tabRemove', name);
    }
  };

  /** 页签右键菜单点击事件 */
  const handleTabContextMenu = (option: TabEventOption) => {
    emit('tabContextMenu', option);
  };

  /** 页签拖动顺序改变事件 */
  const handleTabSortChange = (data: TabPaneItem[]) => {
    emit('tabSortChange', data);
  };

  /** 共享布局状态 */
  const layoutProvide = shallowReactive<LayoutProvide>({
    layout: props.layout,
    maximized: props.maximized,
    fixedHeader: isFixedHeader.value,
    fixedBody: props.fixedBody,
    modalsEl: null,
    getModalsEl,
    getBodyWrapperEl
  });
  provide<LayoutProvide>(LAYOUT_KEY, layoutProvide);

  /** 禁用过渡动画 */
  watch(
    [
      () => props.layout,
      () => props.sidebarLayout,
      () => props.fixedSidebar,
      () => props.fixedBody,
      () => props.logoInHeader,
      () => props.maximized,
      isFixedHeader,
      isMobile
    ],
    () => {
      isDisableTransition.value = true;
      startDisableTransitionTimer(() => {
        isDisableTransition.value = false;
      });
      // 更新布局共享数据
      if (layoutProvide.layout !== props.layout) {
        layoutProvide.layout = props.layout;
      }
      if (layoutProvide.maximized !== props.maximized) {
        layoutProvide.maximized = props.maximized;
      }
      if (layoutProvide.fixedHeader !== isFixedHeader.value) {
        layoutProvide.fixedHeader = isFixedHeader.value;
      }
      if (layoutProvide.fixedBody !== props.fixedBody) {
        layoutProvide.fixedBody = props.fixedBody;
      }
    }
  );

  /** 侧栏菜单滚动到选中位置 */
  watch([() => props.sidebarActive, () => props.collapse], () => {
    nextTick(() => {
      sidebarScrollToActive();
    });
  });

  /** 双侧栏一级菜单滚动到选中位置 */
  watch([() => props.sideboxActive, () => props.compact], () => {
    nextTick(() => {
      sideboxScrollToActive();
    });
  });

  onMounted(() => {
    sideboxScrollToActive();
    sidebarScrollToActive();
    const modalsEl = getModalsEl();
    layoutProvide.modalsEl = modalsEl;
    const contentEl = getContentEl();
    if (contentEl != null && modalsEl != null) {
      emit('contentMounted', contentEl, modalsEl);
    }
  });

  defineExpose({
    sidebarMenuRef,
    sideboxMenuRef,
    getContentEl
  });
</script>
