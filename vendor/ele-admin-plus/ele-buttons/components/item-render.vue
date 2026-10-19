<template>
  <ElDivider
    v-if="divider"
    direction="vertical"
    class="ele-buttons-divider"
    v-bind="typeof divider === 'object' ? divider : {}"
  />
  <ElLink
    v-if="componentType === 'link'"
    underline="never"
    :type="linkType"
    :icon="icon"
    :disabled="item.disabled"
    class="ele-buttons-item ele-buttons-link"
    :class="{
      'ele-buttons-icon-link': !!icon,
      'ele-buttons-wrap': wrapClass
    }"
    v-bind="item.props || {}"
    @click="(e: MouseEvent) => handleItemClick(e, item)"
    @mouseenter="(e: MouseEvent) => handleItemMouseenter(e, item)"
    @contextmenu="(e: MouseEvent) => handleItemContextmenu(e, item)"
  >
    <template
      v-for="name in Object.keys($slots).filter((k) => k !== 'default')"
      #[name]="slotProps"
    >
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
    <slot>
      <span>{{ title }}</span>
    </slot>
    <ElIcon
      v-if="
        item.dropdownItems &&
        item.dropdownItems.length &&
        item.dropdownArrowProps !== false
      "
      v-bind="
        (item.dropdownArrowProps === true ? void 0 : item.dropdownArrowProps) ||
        {}
      "
      class="ele-buttons-arrow"
    >
      <ArrowDown />
    </ElIcon>
  </ElLink>
  <component
    v-else-if="componentType && componentType !== 'button'"
    :is="componentType"
    v-bind="item.props || {}"
    @click="(e: MouseEvent) => handleItemClick(e, item)"
    @mouseenter="(e: MouseEvent) => handleItemMouseenter(e, item)"
    @contextmenu="(e: MouseEvent) => handleItemContextmenu(e, item)"
  >
    <template v-for="name in Object.keys($slots)" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
    <ElIcon
      v-if="
        item.dropdownItems &&
        item.dropdownItems.length &&
        item.dropdownArrowProps !== false
      "
      v-bind="
        (item.dropdownArrowProps === true ? void 0 : item.dropdownArrowProps) ||
        {}
      "
      class="ele-buttons-arrow"
    >
      <ArrowDown />
    </ElIcon>
  </component>
  <ElButton
    v-else
    :type="btnType"
    :icon="icon"
    :disabled="item.disabled"
    class="ele-buttons-item ele-buttons-btn"
    :class="{
      'ele-buttons-icon-btn': !!icon,
      'ele-buttons-wrap': wrapClass
    }"
    v-bind="item.props || {}"
    @click="(e: MouseEvent) => handleItemClick(e, item)"
    @mouseenter="(e: MouseEvent) => handleItemMouseenter(e, item)"
    @contextmenu="(e: MouseEvent) => handleItemContextmenu(e, item)"
  >
    <template
      v-for="name in Object.keys($slots).filter((k) => k !== 'default')"
      #[name]="slotProps"
    >
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
    <slot>
      <span>{{ title }}</span>
    </slot>
    <ElIcon
      v-if="
        item.dropdownItems &&
        item.dropdownItems.length &&
        item.dropdownArrowProps !== false
      "
      v-bind="
        (item.dropdownArrowProps === true ? void 0 : item.dropdownArrowProps) ||
        {}
      "
      class="ele-buttons-arrow"
    >
      <ArrowDown />
    </ElIcon>
  </ElButton>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { computed, watch, onBeforeUnmount } from 'vue';
  import { ElDivider, ElLink, ElIcon, ElButton } from 'element-plus';
  import {
    ArrowDown,
    ArrowUp,
    SearchOutlined,
    SyncOutlined,
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    UploadOutlined,
    DownloadOutlined,
    ColumnHeightOutlined,
    VerticalAlignMiddleOutlined,
    EyeOutlined
  } from '../../icons/index';
  import { mapTree } from '../../utils/common';
  import type { UserComponent } from '../../ele-app/types';
  import type { ElDividerProps } from '../../ele-app/el';
  import { useDropdown } from '../../ele-dropdown-provider/util';
  import { usePopconfirm } from '../../ele-popconfirm-provider/util';
  import { useTooltip } from '../../ele-tooltip-provider/util';
  import type { ButtonItem, ButtonsLocale, ButtonDropdownItem } from '../types';
  const presetIcon = {
    search: SearchOutlined,
    reset: SyncOutlined,
    add: PlusOutlined,
    delBatch: DeleteOutlined,
    edit: EditOutlined,
    del: DeleteOutlined,
    import: UploadOutlined,
    export: DownloadOutlined,
    upload: UploadOutlined,
    download: DownloadOutlined,
    expand: ColumnHeightOutlined,
    fold: VerticalAlignMiddleOutlined,
    searchExpand: ArrowDown,
    searchFold: ArrowUp,
    detail: EyeOutlined
  };
  const dangerLinkPreset = ['del', 'delBatch'];
  const dangerBtnPreset = ['del', 'delBatch'];
  const warningBtnPreset = ['edit'];
  const defaultBtnPreset = [
    'reset',
    'import',
    'export',
    'expand',
    'fold',
    'detail',
    'more',
    'cancel'
  ];
  /** 下拉菜单默认触发方式 */
  const dropdownDefaultTrigger = 'hover';
  /** 气泡确认框默认触发方式 */
  const popconfirmDefaultTrigger = 'click';
  /** 文本提示默认触发方式 */
  const tooltipDefaultTrigger = 'hover';

  defineOptions({ name: 'ItemRender' });

  const props = defineProps({
    /** 按钮数据 */
    item: {
      type: Object as PropType<ButtonItem>,
      required: true
    },
    /** 是否显示分割线 */
    divider: [Boolean, Object] as PropType<boolean | ElDividerProps>,
    /** 组件类型 */
    type: [String, Object, Function] as PropType<UserComponent>,
    /** 是否增加包裹类名 */
    wrapClass: Boolean,
    /** 文案 */
    lang: {
      type: Object as PropType<ButtonsLocale>,
      required: true
    }
  });

  const emit = defineEmits({
    itemClick: (_command: any, _e?: MouseEvent) => true
  });

  /** 下拉菜单操作 */
  const dropdownProvider = useDropdown();

  /** 气泡确认框操作 */
  const popconfirmProvider = usePopconfirm();

  /** 文本提示操作 */
  const tooltipProvider = useTooltip();

  /** 虚拟触发节点 */
  let virtualTriggerEl: any;

  /** 获取文本 */
  const getItemTitle = (
    item: ButtonItem | ButtonDropdownItem,
    lang: ButtonsLocale
  ) => {
    if (item.title != null) {
      return item.title;
    }
    if (!item.preset) {
      return;
    }
    return lang[item.preset];
  };

  /** 获取图标 */
  const getItemIcon = (item: ButtonItem | ButtonDropdownItem) => {
    if (item.icon != null) {
      return item.icon;
    }
    if (!item.preset) {
      return;
    }
    return presetIcon[item.preset];
  };

  /** 类型 */
  const componentType = computed<UserComponent | undefined>(() => {
    return props.item.type ?? props.type;
  });

  /** 文本 */
  const title = computed<string | undefined>(() => {
    return getItemTitle(props.item, props.lang);
  });

  /** 图标 */
  const icon = computed(() => {
    return getItemIcon(props.item);
  });

  /** 链接颜色类型 */
  const linkType = computed<'primary' | 'danger'>(() => {
    const preset = props.item.preset;
    if (preset && dangerLinkPreset.includes(preset)) {
      return 'danger';
    }
    return 'primary';
  });

  /** 按钮颜色类型 */
  const btnType = computed(() => {
    const preset = props.item.preset;
    if (preset) {
      if (dangerBtnPreset.includes(preset)) {
        return 'danger';
      }
      if (warningBtnPreset.includes(preset)) {
        return 'warning';
      }
      if (defaultBtnPreset.includes(preset)) {
        return 'default';
      }
    }
    return 'primary';
  });

  /** 触发操作项点击事件 */
  const triggerItemClick = (command: any, e?: MouseEvent) => {
    emit('itemClick', command, e);
  };

  /** 下拉菜单点击事件 */
  const handleDropdownCommand = (command: any) => {
    triggerItemClick(command);
  };

  /** 打开下拉菜单 */
  const handleOpenDropdown = (e: MouseEvent, item: ButtonItem) => {
    if (
      !item.dropdownItems?.length ||
      !dropdownProvider ||
      !dropdownProvider.openDropdown
    ) {
      return;
    }
    virtualTriggerEl = e.currentTarget;
    dropdownProvider.openDropdown(
      virtualTriggerEl,
      mapTree(item.dropdownItems, (d) => {
        return {
          ...d,
          title: getItemTitle(d, props.lang),
          icon: getItemIcon(d),
          preset: void 0,
          permission: void 0,
          anyPermission: void 0,
          role: void 0,
          anyRole: void 0,
          permissionFilter: void 0,
          vIf: void 0
        };
      }),
      {
        iconSize: 'small',
        onCommand: handleDropdownCommand,
        popperOptions: { strategy: 'fixed' },
        trigger: dropdownDefaultTrigger,
        ...(item.dropdownProps || {})
      }
    );
  };
  /** 关闭下拉菜单 */
  const handleCloseDropdown = (e?: MouseEvent, el?: HTMLElement) => {
    if (dropdownProvider && dropdownProvider.removeDropdown) {
      const triggerEl = el ?? e?.currentTarget;
      triggerEl && dropdownProvider.removeDropdown(triggerEl);
    }
  };

  /** 打开气泡确认框 */
  const handleOpenPopconfirm = (e: MouseEvent, item: ButtonItem) => {
    if (!item.popconfirmProps) {
      return;
    }
    if (!popconfirmProvider || !popconfirmProvider.openPopconfirm) {
      // 降级为直接触发确认事件
      const onConfirm = item.popconfirmProps.onConfirm;
      onConfirm && onConfirm(e);
      return;
    }
    virtualTriggerEl = e.currentTarget;
    popconfirmProvider.openPopconfirm(virtualTriggerEl, {
      popperOptions: { strategy: 'fixed' },
      trigger: popconfirmDefaultTrigger,
      ...(item.popconfirmProps || {})
    });
  };

  /** 关闭气泡确认框 */
  const handleClosePopconfirm = (e?: MouseEvent, el?: HTMLElement) => {
    if (popconfirmProvider && popconfirmProvider.removePopconfirm) {
      const triggerEl = el ?? e?.currentTarget;
      triggerEl && popconfirmProvider.removePopconfirm(triggerEl);
    }
  };

  /** 打开文本提示 */
  const handleOpenTooltip = (e: MouseEvent, item: ButtonItem) => {
    if (
      !item.tooltipProps ||
      !tooltipProvider ||
      !tooltipProvider.showTooltip
    ) {
      return;
    }
    virtualTriggerEl = e.currentTarget;
    tooltipProvider.showTooltip(virtualTriggerEl, {
      popperOptions: { strategy: 'fixed' },
      placement: 'top',
      trigger: tooltipDefaultTrigger,
      ...(item.tooltipProps || {})
    });
  };

  /** 关闭文本提示 */
  const handleCloseTooltip = (e?: MouseEvent, el?: HTMLElement) => {
    if (tooltipProvider && tooltipProvider.removeTooltip) {
      const triggerEl = el ?? e?.currentTarget;
      triggerEl && tooltipProvider.removeTooltip(triggerEl);
    }
  };

  /** 点击事件 */
  const handleItemClick = (e: MouseEvent, item: ButtonItem) => {
    if (item.disabled) {
      handleCloseDropdown(e);
      handleClosePopconfirm(e);
      handleCloseTooltip(e);
      return;
    }
    // 打开下拉菜单
    if ((item.dropdownProps?.trigger || dropdownDefaultTrigger) === 'click') {
      handleOpenDropdown(e, item);
    }
    // 打开气泡确认框
    if (
      item.popconfirmProps &&
      (item.popconfirmProps.trigger ?? popconfirmDefaultTrigger) === 'click'
    ) {
      handleOpenPopconfirm(e, item);
    }
    // 打开文本提示
    if (
      item.tooltipProps &&
      (item.tooltipProps.trigger ?? tooltipDefaultTrigger) === 'click'
    ) {
      handleOpenTooltip(e, item);
    }
    // 触发操作项点击事件
    item.onClick && item.onClick(e);
    triggerItemClick(item.command, e);
  };

  /** 鼠标移入事件 */
  const handleItemMouseenter = (e: MouseEvent, item: ButtonItem) => {
    if (item.disabled) {
      handleCloseDropdown(e);
      handleClosePopconfirm(e);
      handleCloseTooltip(e);
      return;
    }
    // 打开下拉菜单
    if ((item.dropdownProps?.trigger ?? dropdownDefaultTrigger) === 'hover') {
      handleOpenDropdown(e, item);
    }
    // 打开气泡确认框
    if (
      item.popconfirmProps &&
      (item.popconfirmProps.trigger ?? popconfirmDefaultTrigger) === 'hover'
    ) {
      handleOpenPopconfirm(e, item);
    }
    // 打开文本提示
    if (
      item.tooltipProps &&
      (item.tooltipProps.trigger ?? tooltipDefaultTrigger) === 'hover'
    ) {
      handleOpenTooltip(e, item);
    }
  };

  /** 鼠标右键事件 */
  const handleItemContextmenu = (e: MouseEvent, item: ButtonItem) => {
    if (item.disabled) {
      handleCloseDropdown(e);
      handleClosePopconfirm(e);
      return;
    }
    // 打开下拉菜单
    if (
      (item.dropdownProps?.trigger ?? dropdownDefaultTrigger) === 'contextmenu'
    ) {
      e.preventDefault();
      handleOpenDropdown(e, item);
    }
    // 打开气泡确认框
    if (
      item.popconfirmProps &&
      (item.popconfirmProps.trigger ?? popconfirmDefaultTrigger) ===
        'contextmenu'
    ) {
      e.preventDefault();
      handleOpenPopconfirm(e, item);
    }
    // 打开文本提示
    if (
      item.tooltipProps &&
      (item.tooltipProps.trigger ?? tooltipDefaultTrigger) === 'contextmenu'
    ) {
      e.preventDefault();
      handleOpenTooltip(e, item);
    }
  };

  /** 移除下拉菜单或气泡确认框或文本提示 */
  watch(
    () => props.item.disabled,
    (disabled) => {
      if (disabled && virtualTriggerEl) {
        handleCloseDropdown(void 0, virtualTriggerEl);
        handleClosePopconfirm(void 0, virtualTriggerEl);
        handleCloseTooltip(void 0, virtualTriggerEl);
      }
    }
  );

  onBeforeUnmount(() => {
    if (virtualTriggerEl) {
      handleCloseDropdown(void 0, virtualTriggerEl);
      handleClosePopconfirm(void 0, virtualTriggerEl);
      handleCloseTooltip(void 0, virtualTriggerEl);
      virtualTriggerEl = void 0;
    }
  });
</script>
