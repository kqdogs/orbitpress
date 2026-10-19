<template>
  <template v-if="selectStyle === 'none'">
    <slot></slot>
  </template>
  <div
    v-else-if="$slots.select"
    :class="selectClass"
    :style="selectStyle"
    @click="handleWrapClick(true)"
  >
    <slot
      name="select"
      :visible="visible"
      :value="value"
      :selectedLabel="selectedLabel"
      :selected="selected"
      :currentTags="currentTags"
      :omittedTags="omittedTags"
      :omittedSize="omittedSize"
      :openPopper="openPopper"
      :closePopper="closePopper"
      :removeItem="handleTagClose"
      :clear="handleClear"
    ></slot>
    <slot></slot>
  </div>
  <div
    v-else
    class="ele-select"
    :class="[
      selectClass,
      { 'is-empty': isEmpty },
      { 'is-multiple': multiple },
      { 'is-disabled': disabled },
      { 'is-filterable': isFilterable },
      { 'is-small': size === 'small' },
      { 'is-large': size === 'large' },
      { 'is-opened': visible }
    ]"
    :style="selectStyle"
    @click="handleWrapClick(false)"
  >
    <ElInput
      ref="inputRef"
      :size="size"
      :disabled="disabled"
      :validateEvent="false"
      :modelValue="inputValue"
      :placeholder="isFilterable && multiple && visible ? '' : inputPlaceholder"
      :readonly="!(isFilterable && !multiple)"
      :style="inputStyle"
      @update:modelValue="updateInputValue"
      @click="handleInputClick"
      @focus="handleInputFocus"
      @blur="handleInputBlur"
      @keydown.esc="handleInputEsc"
    >
      <template v-if="$slots.prefix" #prefix>
        <slot name="prefix"></slot>
      </template>
      <template #suffix>
        <ElIcon
          v-if="clearable && !disabled && !isEmpty"
          class="ele-select-clear el-input__icon"
          @click.stop="handleClear"
        >
          <slot name="clearIcon">
            <CloseCircleFilled />
          </slot>
        </ElIcon>
        <ElIcon class="ele-select-arrow el-input__icon">
          <slot name="suffixIcon" :visible="visible">
            <ArrowDown />
          </slot>
        </ElIcon>
      </template>
    </ElInput>
    <div v-if="multiple" class="ele-select-tags" :style="selectTagsStyle">
      <ElTag
        v-for="(item, index) in currentTags"
        :key="`${index}-${item.value}`"
        :size="size"
        :type="tagType"
        :closable="!disabled"
        :disableTransitions="true"
        :title="item.label"
        @close="handleTagClose(item)"
      >
        <template
          v-if="
            item.label &&
            maxTagTextLength &&
            item.label.length > maxTagTextLength
          "
        >
          {{ item.label.slice(0, maxTagTextLength) }}...
        </template>
        <template v-else>{{ item.label }}</template>
      </ElTag>
      <ElTag
        v-if="isCollapse"
        :size="size"
        :type="tagType"
        :disableTransitions="true"
      >
        <slot
          name="maxTagPlaceholder"
          :omittedValues="omittedTags"
          :omittedSize="omittedSize"
        >
          +{{ omittedSize }}
        </slot>
      </ElTag>
      <ElTag
        v-if="!disabled && isFilterable"
        :size="size"
        :disableTransitions="true"
        class="ele-select-search"
      >
        <ElInput
          ref="searchRef"
          :size="size"
          :validateEvent="false"
          :modelValue="searchValue"
          :placeholder="inputPlaceholder"
          @update:modelValue="updateSearchValue"
          @keydown.esc="handleInputEsc"
        />
      </ElTag>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, nextTick } from 'vue';
  import { ElInput, ElIcon, ElTag } from 'element-plus';
  import { ArrowDown, CloseCircleFilled } from '../../icons/index';
  import type { ElInputInstance } from '../../ele-app/el';
  import type { SelectedItem, MultipleValue } from '../types';
  import { basicSelectProps, basicSelectEmits } from '../props';

  defineOptions({ name: 'SelectView' });

  const props = defineProps(basicSelectProps);

  const emit = defineEmits({
    ...basicSelectEmits,
    /** 输入框点击事件 */
    inputClick: (_e: MouseEvent) => true,
    /** 容器点击事件 */
    wrapClick: (_isCustom?: boolean) => true
  });

  /** 输入框组件 */
  const inputRef = ref<ElInputInstance>(null);

  /** 多选搜索框组件 */
  const searchRef = ref<ElInputInstance>(null);

  /** 输入框值 */
  const inputValue = ref<string>(
    props.multiple || !props.selectedLabel ? '' : props.selectedLabel
  );

  /** 多选时搜索框值 */
  const searchValue = ref<string>('');

  /** 是否未选中 */
  const isEmpty = computed<boolean>(() => {
    if (!props.multiple) {
      return props.value == null || props.value === '';
    }
    return !Array.isArray(props.value) || !props.value.length;
  });

  /** 输入框是否支持输入搜索 */
  const isFilterable = computed<boolean>(() => {
    if (
      props.popperType &&
      ['modal', 'drawer', 'default'].includes(props.popperType)
    ) {
      return false;
    }
    return props.filterable;
  });

  /** 输入框提示文本 */
  const inputPlaceholder = computed<string>(() => {
    const str = isEmpty.value && props.placeholder ? props.placeholder : '';
    if (!isFilterable.value || !props.visible || props.multiple) {
      return str;
    }
    return props.selectedLabel || str;
  });

  /** 多选时是否折叠标签 */
  const isCollapse = computed<boolean>(() => {
    return (
      typeof props.maxTagCount === 'number' &&
      props.selected != null &&
      props.selected.length > props.maxTagCount
    );
  });

  /** 多选折叠的标签数量 */
  const omittedSize = computed<number>(() => {
    if (isEmpty.value || props.maxTagCount == null || props.maxTagCount < 0) {
      return 0;
    }
    return (props.value as MultipleValue).length - props.maxTagCount;
  });

  /** 多选显示的标签数据 */
  const currentTags = computed<SelectedItem[]>(() => {
    if (!isCollapse.value || isEmpty.value || props.selected == null) {
      return props.selected || [];
    }
    return props.selected.slice(0, props.maxTagCount);
  });

  /** 多选折叠的标签数据 */
  const omittedTags = computed<SelectedItem[]>(() => {
    if (!isCollapse.value || isEmpty.value || props.selected == null) {
      return [];
    }
    return props.selected.slice(props.maxTagCount);
  });

  /** 让多选搜索框获取焦点 */
  const focusSearchInput = () => {
    if (!isFilterable.value) {
      return;
    }
    const input = props.multiple ? searchRef.value : inputRef.value;
    input && input.focus();
    nextTick(() => {
      input && input.focus();
    });
  };

  /** 更新多选搜索输入框值 */
  const updateSearchValue = (modelValue: string) => {
    if (isFilterable.value && props.visible && props.multiple) {
      searchValue.value = modelValue;
      emit('filterChange', modelValue);
    }
  };

  /** 更新输入框值 */
  const updateInputValue = (modelValue: string) => {
    if (isFilterable.value && props.visible && !props.multiple) {
      inputValue.value = modelValue;
      emit('filterChange', modelValue);
    }
  };

  /** 更新下拉框显示状态 */
  const updateVisible = (visible: boolean) => {
    emit('update:visible', visible);
  };

  /** 多选标签删除事件 */
  const handleTagClose = (item: SelectedItem) => {
    if (!props.disabled) {
      emit('removeTag', item);
    }
  };

  /** 清空事件 */
  const handleClear = () => {
    emit('clear');
  };

  /** 输入框点击事件 */
  const handleInputClick = (e: MouseEvent) => {
    emit('inputClick', e);
  };

  /** 获取焦点事件 */
  const handleInputFocus = (e: FocusEvent) => {
    if (props.automaticDropdown && !props.visible) {
      updateVisible(true);
    }
    emit('focus', e);
  };

  /** 失去焦点事件 */
  const handleInputBlur = (e: FocusEvent) => {
    emit('blur', e);
  };

  /** 按下返回键事件 */
  const handleInputEsc = (e: FocusEvent) => {
    if (!props.disabled && props.visible) {
      e.stopPropagation();
      e.preventDefault();
      updateVisible(false);
    }
  };

  /** 容器点击事件 */
  const handleWrapClick = (isCustom?: boolean) => {
    emit('wrapClick', isCustom);
  };

  /** 打开下拉框 */
  const openPopper = () => {
    updateVisible(true);
  };

  /** 关闭下拉框 */
  const closePopper = () => {
    updateVisible(false);
  };

  /** 更新输入框显示文本 */
  watch(
    () => props.selectedLabel,
    (label) => {
      if (!isFilterable.value || !props.visible) {
        inputValue.value = props.multiple || !label ? '' : label;
      }
    }
  );

  watch(
    () => props.visible,
    (visible) => {
      if (isFilterable.value) {
        if (props.multiple) {
          searchValue.value = '';
          if (visible) {
            focusSearchInput();
          }
        } else {
          const label = props.selectedLabel;
          inputValue.value = visible || !label ? '' : label;
        }
      }
    }
  );

  defineExpose({
    inputRef,
    searchRef,
    focusSearchInput,
    updateSearchValue,
    updateInputValue
  });
</script>
