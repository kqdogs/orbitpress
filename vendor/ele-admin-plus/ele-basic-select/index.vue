<!-- 通用下拉选择 -->
<template>
  <SelectView
    v-if="popperType === 'modal' || popperType === 'drawer'"
    v-bind="$props"
    ref="selectViewRef"
    @update:visible="updateVisible"
    @removeTag="handleRemoveTag"
    @clear="handleClear"
    @focus="handleFocus"
    @blur="handleBlur"
    @filterChange="handleFilterChange"
    @inputClick="handleInputClick"
    @wrapClick="handleWrapClick"
  >
    <template
      v-for="name in Object.keys($slots).filter((k) => k !== 'default')"
      #[name]="slotProps"
    >
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
    <EleDrawer
      v-if="popperType === 'drawer'"
      :title="popperTitle"
      :size="popperWidth"
      :destroyOnClose="!persistent"
      :appendToBody="teleported"
      :responsive="responsive"
      :class="popperClass"
      v-bind="(popperProps as any) || {}"
      ref="drawerRef"
      :modelValue="visible"
      @update:modelValue="handleUpdatePopoverVisible"
    >
      <slot></slot>
      <template
        v-for="(slotName, compSlotName) in getSlotsMap(
          $slots,
          popperSlots,
          ['default'],
          ['default']
        )"
        #[compSlotName]="slotProps"
      >
        <slot :name="slotName" v-bind="slotProps || {}"></slot>
      </template>
    </EleDrawer>
    <EleModal
      v-else
      position="center"
      :title="popperTitle"
      :width="popperWidth"
      :height="popperHeight"
      :destroyOnClose="!persistent"
      :appendToBody="teleported"
      :responsive="responsive"
      :class="popperClass"
      v-bind="(popperProps as any) || {}"
      ref="modalRef"
      :modelValue="visible"
      @update:modelValue="handleUpdatePopoverVisible"
    >
      <slot></slot>
      <template
        v-for="(slotName, compSlotName) in getSlotsMap(
          $slots,
          popperSlots,
          ['default'],
          ['default']
        )"
        #[compSlotName]="slotProps"
      >
        <slot :name="slotName" v-bind="slotProps || {}"></slot>
      </template>
    </EleModal>
  </SelectView>
  <MainContent
    v-else-if="popperType === 'default'"
    :wrapHeight="popperHeight"
    :class="popperClass"
  >
    <slot></slot>
  </MainContent>
  <EleTooltip
    v-else
    ref="tooltipRef"
    trigger="click"
    :disabled="disabled"
    :placement="placement"
    :teleported="teleported"
    :width="popperWidth"
    :popperClass="popperClass"
    :popperOptions="popperOptions"
    :transition="transition"
    :gpuAcceleration="transition === 'el-fade-in-linear'"
    effect="light"
    :persistent="true"
    :isPopover="true"
    :triggerKeys="[]"
    v-bind="(popperProps as any) || {}"
    :visible="visible"
    @update:visible="handleUpdatePopoverVisible"
  >
    <div v-if="selectStyle === 'none'" :class="selectClass"></div>
    <SelectView
      v-else
      v-bind="$props"
      ref="selectViewRef"
      @update:visible="updateVisible"
      @removeTag="handleRemoveTag"
      @clear="handleClear"
      @focus="handleFocus"
      @blur="handleBlur"
      @filterChange="handleFilterChange"
      @inputClick="handleInputClick"
      @wrapClick="handleWrapClick"
    >
      <template
        v-for="name in Object.keys($slots).filter((k) => k !== 'default')"
        #[name]="slotProps"
      >
        <slot :name="name" v-bind="slotProps || {}"></slot>
      </template>
    </SelectView>
    <template #body>
      <MainContent
        v-if="persistent || visible"
        :wrapHeight="popperHeight"
        class="ele-popover-body"
        @click="focusSearchInput"
        @mouseup="focusSearchInput"
      >
        <slot></slot>
      </MainContent>
    </template>
  </EleTooltip>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import type {
    EleBasicSelectViewInstance,
    EleTooltipInstance,
    EleModalInstance,
    EleDrawerInstance
  } from '../ele-app/plus';
  import { getSlotsMap } from '../utils/common';
  import EleTooltip from '../ele-tooltip/index.vue';
  import EleModal from '../ele-modal/index.vue';
  import EleDrawer from '../ele-drawer/index.vue';
  import MainContent from '../ele-loading/components/main-content.vue';
  import SelectView from './components/select-view.vue';
  import type { SelectedItem } from './types';
  import { basicSelectProps, basicSelectEmits } from './props';

  defineOptions({ name: 'EleBasicSelect' });

  const props = defineProps(basicSelectProps);

  const emit = defineEmits(basicSelectEmits);

  /** 选择框容器组件 */
  const selectViewRef = ref<EleBasicSelectViewInstance>(null);

  /** 气泡组件 */
  const tooltipRef = ref<EleTooltipInstance>(null);

  /** 弹窗组件 */
  const modalRef = ref<EleModalInstance>(null);

  /** 抽屉组件 */
  const drawerRef = ref<EleDrawerInstance>(null);

  /** 是否是下拉框点击 */
  const isSelectInputClick = ref(false);

  /** 更新下拉框显示状态 */
  const updateVisible = (visible: boolean) => {
    isSelectInputClick.value = false;
    if (!props.disabled || !visible) {
      emit('update:visible', visible);
    }
  };

  /** 更新下拉框位置 */
  const updatePopper = () => {
    tooltipRef.value && tooltipRef.value.updatePopper();
  };

  /** 让多选搜索框获取焦点 */
  const focusSearchInput = (e?: MouseEvent) => {
    if (props.filterable && props.visible) {
      if (e != null && e.target != null) {
        const target = e.target as HTMLElement;
        if (target.nodeName && target.nodeName.toLowerCase() === 'input') {
          return;
        }
      }
      selectViewRef.value && selectViewRef.value.focusSearchInput();
    }
  };

  /** 气泡下拉框显示状态更新事件 */
  const handleUpdatePopoverVisible = (visible: boolean) => {
    if (!visible && props.filterable && isSelectInputClick.value) {
      isSelectInputClick.value = false;
      return;
    }
    updateVisible(visible);
  };

  /** 选择框容器点击事件 */
  const handleWrapClick = (isCustom?: boolean) => {
    isSelectInputClick.value = true;
    if (
      !isCustom &&
      (props.popperType === 'modal' || props.popperType === 'drawer')
    ) {
      updateVisible(true);
    }
  };

  /** 输入框点击事件 */
  const handleInputClick = (e: MouseEvent) => {
    if (props.automaticDropdown && props.visible) {
      isSelectInputClick.value = true;
      e.stopPropagation();
    }
  };

  /** 多选标签移除事件 */
  const handleRemoveTag = (item: SelectedItem) => {
    emit('removeTag', item);
  };

  /** 清空事件 */
  const handleClear = () => {
    isSelectInputClick.value = false;
    emit('clear');
  };

  /** 获取焦点事件 */
  const handleFocus = (e: FocusEvent) => {
    if (props.automaticDropdown && !props.visible) {
      updateVisible(true);
    }
    emit('focus', e);
  };

  /** 失去焦点事件 */
  const handleBlur = (e: FocusEvent) => {
    emit('blur', e);
  };

  /** 搜索内容改变事件 */
  const handleFilterChange = (value: string) => {
    emit('filterChange', value);
  };

  defineExpose({
    selectViewRef,
    tooltipRef,
    modalRef,
    drawerRef,
    updatePopper,
    focusSearchInput,
    updateVisible
  });
</script>
