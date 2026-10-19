<template>
  <EleTooltip
    :tabindex="tabindex"
    v-bind="tooltipProps"
    ref="tooltipRef"
    @update:visible="handleUpdateVisible"
    @before-show="handlePopBeforeEnter"
    @before-hide="handlePopBeforeLeave"
    @show="handlePopAfterEnter"
    @hide="handlePopAfterLeave"
  >
    <ElButton
      v-if="splitButton"
      :type="type"
      :size="size"
      :disabled="disabled"
      :icon="ArrowDown"
      class="ele-dropdown-caret-button"
      v-bind="caretButtonProps || {}"
    />
    <slot v-else :active="modelValue" :selected="selected"></slot>
    <template #body>
      <div
        v-if="hasSubMenu"
        class="ele-dropdown-wrapper"
        @contextmenu="handleWrapperContext"
      >
        <DropdownMenus
          v-if="items && items.length"
          :role="role"
          :items="items"
          :selected="modelValue"
          :menuStyle="menuStyle"
          :iconProps="iconProps"
          :iconSize="iconSize"
          :size="size"
          @itemClick="handleItemClick"
          @wrapperContext="handleWrapperContext"
        >
          <template
            v-for="name in Object.keys($slots).filter((k) => 'default' !== k)"
            #[name]="slotProps"
          >
            <slot :name="name" v-bind="slotProps || {}"></slot>
          </template>
        </DropdownMenus>
      </div>
      <ElScrollbar
        v-else
        :maxHeight="maxHeight"
        class="ele-dropdown-wrapper"
        @contextmenu="handleWrapperContext"
      >
        <DropdownMenus
          v-if="items && items.length"
          :role="role"
          :items="items"
          :selected="modelValue"
          :menuStyle="menuStyle"
          :iconProps="iconProps"
          :iconSize="iconSize"
          :size="size"
          @itemClick="handleItemClick"
          @wrapperContext="handleWrapperContext"
        >
          <template
            v-for="name in Object.keys($slots).filter((k) => 'default' !== k)"
            #[name]="slotProps"
          >
            <slot :name="name" v-bind="slotProps || {}"></slot>
          </template>
        </DropdownMenus>
      </ElScrollbar>
    </template>
  </EleTooltip>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref, computed } from 'vue';
  import { ElButton, ElScrollbar } from 'element-plus';
  import { ArrowDown } from '../../icons/index';
  import type { EleTooltipInstance, EleTooltipProps } from '../../ele-app/plus';
  import { pick } from '../../utils/common';
  import EleTooltip from '../../ele-tooltip/index.vue';
  import { tooltipPropKeys } from '../../ele-tooltip/props';
  import DropdownMenus from './dropdown-menus.vue';
  import type { DropdownItem } from '../types';
  import { dropdownProps, dropdownEmits } from '../props';

  defineOptions({ name: 'ProDropdown' });

  const props = defineProps({
    ...dropdownProps,
    /** 当前选中菜单项 */
    selected: Object as PropType<DropdownItem | null>
  });

  const emit = defineEmits(dropdownEmits);

  /** 气泡组件 */
  const tooltipRef = ref<EleTooltipInstance>(null);

  /** 气泡组件属性 */
  const tooltipProps = computed<EleTooltipProps>(() => {
    const options: EleTooltipProps = pick<any, any>(props, tooltipPropKeys);
    options.showAfter = props.trigger === 'hover' ? props.showTimeout : 0;
    options.hideAfter = props.trigger === 'hover' ? props.hideTimeout : 0;
    options.gpuAcceleration = props.transition === 'el-fade-in-linear';
    const classes: string[] = ['ele-dropdown'];
    if (props.preventContextmenu) {
      classes.push('is-prevent-event');
    }
    if (typeof props.popperClass === 'string' && props.popperClass) {
      classes.push(props.popperClass as unknown as string);
    }
    options.popperClass = classes.join(' ');
    options.isPopover = true;
    return options;
  });

  /** 是否有子菜单 */
  const hasSubMenu = computed<boolean>(
    () => !!(props.items && props.items.some((d) => !!d.children?.length))
  );

  /** 关闭气泡 */
  const hidePopper = () => {
    tooltipRef.value && tooltipRef.value.hide();
  };

  /** 更新气泡 */
  const updatePopper = () => {
    tooltipRef.value && tooltipRef.value.updatePopper();
  };

  /** 更新气泡打开状态 */
  const handleUpdateVisible = (visible: boolean) => {
    emit('update:visible', visible);
    emit('visibleChange', visible);
  };

  /** 气泡开始打开事件 */
  const handlePopBeforeEnter = () => {
    emit('before-enter');
  };

  /** 气泡开始关闭事件 */
  const handlePopBeforeLeave = () => {
    emit('before-leave');
  };

  /** 气泡打开结束事件 */
  const handlePopAfterEnter = () => {
    emit('after-enter');
  };

  /** 气泡关闭结束事件 */
  const handlePopAfterLeave = () => {
    emit('after-leave');
  };

  /** 菜单项点击事件 */
  const handleItemClick = (item: DropdownItem, e: MouseEvent) => {
    if (props.hideOnClick && !item.children?.length) {
      hidePopper();
    }
    if (item.onClick) {
      item.onClick(e);
    }
    emit('command', item.command);
  };

  /** 打开下拉菜单 */
  const handleOpen = () => {
    if (props.disabled) {
      return;
    }
    tooltipRef.value && tooltipRef.value.handleOpen();
  };

  /** 关闭下拉菜单 */
  const handleClose = () => {
    hidePopper();
  };

  /** 下拉容器右键事件 */
  const handleWrapperContext = (e: MouseEvent) => {
    if (props.preventContextmenu) {
      e.preventDefault();
    }
  };

  defineExpose({
    tooltipRef,
    hidePopper,
    updatePopper,
    handleOpen,
    handleClose
  });
</script>
