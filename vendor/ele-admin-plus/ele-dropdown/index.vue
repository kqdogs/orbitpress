<!-- 下拉菜单 -->
<template>
  <template v-if="componentType === 'pro'">
    <ProDropdown
      v-if="virtualTriggering"
      v-bind="$props"
      ref="dropdownRef"
      :splitButton="false"
      :selected="selected"
      @command="handleMenuClick"
      @visibleChange="handlePopVisibleChange"
    >
      <template v-for="name in Object.keys($slots)" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps || {}"></slot>
      </template>
    </ProDropdown>
    <div v-else class="ele-dropdown-trigger">
      <ElButtonGroup v-if="splitButton">
        <ElButton
          :type="type"
          :size="size"
          :disabled="disabled"
          v-bind="splitButtonProps || {}"
          @click="handleBtnClick"
        >
          <slot :active="modelValue" :selected="selected"></slot>
        </ElButton>
        <ProDropdown
          v-bind="$props"
          ref="dropdownRef"
          :selected="selected"
          @command="handleMenuClick"
          @visibleChange="handlePopVisibleChange"
        >
          <template v-for="name in Object.keys($slots)" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps || {}"></slot>
          </template>
        </ProDropdown>
      </ElButtonGroup>
      <ProDropdown
        v-else
        v-bind="$props"
        ref="dropdownRef"
        :selected="selected"
        @command="handleMenuClick"
        @visibleChange="handlePopVisibleChange"
      >
        <template v-for="name in Object.keys($slots)" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps || {}"></slot>
        </template>
      </ProDropdown>
    </div>
  </template>
  <ElDropdown
    v-else
    class="ele-dropdown-trigger"
    v-bind="dropdownPropsData"
    ref="dropdownRef"
    @click="handleBtnClick"
    @command="handleMenuClick"
    @visibleChange="handlePopVisibleChange"
  >
    <slot :active="modelValue" :selected="selected"></slot>
    <template #dropdown>
      <slot v-if="!items && $slots.dropdown" name="dropdown"></slot>
      <ElDropdownMenu
        v-else
        :style="menuStyle"
        :class="{ 'ele-dropdown-icon-small': iconSize === 'small' }"
      >
        <template v-if="items">
          <ElDropdownItem
            v-for="item in items"
            :key="item.key == null ? JSON.stringify(item.command) : item.key"
            :class="[
              { 'is-active': modelValue === item.command },
              { 'is-danger': !!item.danger }
            ]"
            v-bind="
              omit(item, [
                'key',
                'icon',
                'title',
                'iconProps',
                'iconStyle',
                'slot',
                'danger',
                'onClick',
                'children'
              ])
            "
          >
            <template
              v-if="item.slot && item.slot !== 'default' && $slots[item.slot]"
            >
              <slot :name="item.slot" :item="item"></slot>
            </template>
            <template v-else>
              <ElIcon
                v-if="item.icon"
                v-bind="{ ...(iconProps || {}), ...(item.iconProps || {}) }"
              >
                <component :is="item.icon" :style="item.iconStyle" />
              </ElIcon>
              <span v-if="item.title">{{ item.title }}</span>
            </template>
          </ElDropdownItem>
        </template>
        <slot v-else-if="$slots.dropdownMenu" name="dropdownMenu"></slot>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<script lang="ts" setup>
  import type { Ref } from 'vue';
  import { ref, computed } from 'vue';
  import {
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem,
    ElButtonGroup,
    ElButton,
    ElIcon
  } from 'element-plus';
  import type { ElDropdownProps } from '../ele-app/el';
  import { omit, pick } from '../utils/common';
  import { useFormValidate } from '../ele-basic-select/util';
  import ProDropdown from './components/pro-dropdown.vue';
  import type { DropdownItem } from './types';
  import { dropdownProps, dropdownEmits, elDropdownPropKeys } from './props';
  import type { DropdownInstance } from './props';

  defineOptions({ name: 'EleDropdown' });

  const props = defineProps(dropdownProps);

  const emit = defineEmits(dropdownEmits);

  const { validateChange } = useFormValidate();

  /** 下拉菜单组件 */
  const dropdownRef: Ref<DropdownInstance> = ref<DropdownInstance>(null);

  /** 下拉菜单属性 */
  const dropdownPropsData = computed<ElDropdownProps>(() => {
    const options = pick(props as Record<any, any>, elDropdownPropKeys);
    const classes: string[] = ['ele-popper', 'ele-dropdown'];
    if (props.popperClass) {
      classes.push(props.popperClass as unknown as string);
    }
    (options as any).popperClass = classes.join(' ');
    return options;
  });

  /** 当前选中菜单项 */
  const selected = computed<DropdownItem | null | undefined>(() => {
    if (props.modelValue == null || props.modelValue === '' || !props.items) {
      return;
    }
    return props.items.find((d) => d.command === props.modelValue);
  });

  /** 更新选中值 */
  const updateModelValue = (value: DropdownItem['command']) => {
    if (value !== props.modelValue) {
      emit('update:modelValue', value);
      if (props.validateEvent) {
        validateChange();
      }
      emit('change', value);
    }
  };

  /** 菜单项点击事件 */
  const handleMenuClick = (command: DropdownItem['command']) => {
    updateModelValue(command);
    emit('command', command);
  };

  /** 内容按钮点击事件 */
  const handleBtnClick = (e: MouseEvent) => {
    emit('click', e);
  };

  /** 下拉框显示状态改变事件 */
  const handlePopVisibleChange = (visible: boolean) => {
    emit('visibleChange', visible);
  };

  /** 打开下拉菜单 */
  const handleOpen = () => {
    if (dropdownRef.value) {
      dropdownRef.value.handleOpen();
    }
  };

  /** 关闭下拉菜单 */
  const handleClose = () => {
    if (dropdownRef.value) {
      dropdownRef.value.handleClose();
    }
  };

  /** 更新气泡 */
  const updatePopper = () => {
    // @ts-ignore
    if (dropdownRef.value && dropdownRef.value.updatePopper) {
      // @ts-ignore
      dropdownRef.value.updatePopper();
    }
  };

  defineExpose({
    dropdownRef,
    handleOpen,
    handleClose,
    updatePopper
  });
</script>
