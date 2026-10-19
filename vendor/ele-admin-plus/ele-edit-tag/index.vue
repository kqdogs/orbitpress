<!-- 标签输入 -->
<template>
  <div
    class="ele-edit-tag"
    :class="[
      { 'is-large': size === 'large' },
      { 'is-small': size === 'small' },
      { 'is-disabled': disabled },
      { 'is-readonly': readonly }
    ]"
  >
    <template v-if="modelValue">
      <ElTag
        v-for="(item, index) in modelValue"
        :key="`${index}-${item}`"
        :hit="hit"
        :type="type"
        :color="color"
        :size="size"
        :effect="effect"
        :round="round"
        :closable="readonly || disabled ? false : true"
        :disableTransitions="true"
        :style="itemStyle"
        @close="handleTagClose(index, item)"
        @click="handleTagClick(index, item)"
      >
        {{ item }}
      </ElTag>
    </template>
    <ElTag
      v-if="!readonly"
      :hit="hit"
      v-show="!isEdit"
      type="info"
      :size="size"
      :round="round"
      :disableTransitions="true"
      class="ele-edit-tag-add"
      :style="buttonStyle"
      @click="handleAddClick"
    >
      <slot name="placeholder">
        <span v-if="placeholder">{{ placeholder }}</span>
        <ElIcon v-else class="ele-edit-tag-add-icon">
          <PlusOutlined />
        </ElIcon>
      </slot>
    </ElTag>
    <ElTag
      v-if="!readonly"
      ref="inputTagRef"
      v-show="isEdit"
      :size="size"
      :round="round"
      :disableTransitions="true"
      class="ele-edit-tag-input"
      :class="{ 'is-error': !!errorMessage }"
      :style="inputTagStyle"
    >
      <ElInput
        ref="inputRef"
        :disabled="loading"
        v-model="inputValue"
        :validateEvent="false"
        :style="inputStyle"
        @change="handleInputChange"
        @blur="handleInputBlur"
        @focus="handleInputFocus"
      >
        <template #suffix>
          <ElIcon v-if="loading" class="is-loading">
            <LoadingOutlined />
          </ElIcon>
        </template>
      </ElInput>
    </ElTag>
    <EleTooltip
      :offset="7"
      :hideAfter="0"
      trigger="click"
      :triggerKeys="[]"
      :disabled="!tooltipVisible"
      v-bind="tooltipProps || {}"
      :virtualTriggering="true"
      :virtualRef="inputTagRef ? inputTagRef.$el : void 0"
      :content="errorMessage"
      :visible="tooltipVisible"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, nextTick, onDeactivated, onActivated } from 'vue';
  import { ElTag, ElInput, ElIcon } from 'element-plus';
  import EleTooltip from '../ele-tooltip/index.vue';
  import type { ElTagInstance, ElInputInstance } from '../ele-app/el';
  import { PlusOutlined, LoadingOutlined } from '../icons/index';
  import { useFormValidate } from '../ele-basic-select/util';
  import { editTagProps, editTagEmits } from './props';

  defineOptions({ name: 'EleEditTag' });

  const props = defineProps(editTagProps);

  const emit = defineEmits(editTagEmits);

  const { validateChange } = useFormValidate();

  /** 输入框外层标签 */
  const inputTagRef = ref<ElTagInstance>(null);

  /** 输入框 */
  const inputRef = ref<ElInputInstance>(null);

  /** 输入框是否显示 */
  const isEdit = ref<boolean>(false);

  /** 输入框的值 */
  const inputValue = ref<string>('');

  /** 提示信息 */
  const errorMessage = ref<string>('');

  /** 添加状态 */
  const loading = ref<boolean>(false);

  /** 气泡是否打开 */
  const tooltipVisible = ref<boolean>(false);

  /** 页面是否失活 */
  const isDeactivated = ref<boolean>(false);

  /** 更新选中值 */
  const updateModelValue = (modelValue: string[]) => {
    emit('update:modelValue', modelValue);
    validateChange();
    emit('change', modelValue);
  };

  /** 添加 */
  const addTag = (value: string) => {
    tooltipVisible.value = false;
    isEdit.value = false;
    updateInputValue('');
    errorMessage.value = '';
    loading.value = false;
    if (value) {
      const temp = props.modelValue ? [...props.modelValue] : [];
      temp.push(value);
      updateModelValue(temp);
    }
  };

  /** 移除 */
  const removeTag = (index: number) => {
    if (!props.modelValue) {
      return;
    }
    const temp = [...props.modelValue];
    temp.splice(index, 1);
    updateModelValue(temp);
  };

  /** 修改输入框值 */
  const updateInputValue = (value: string) => {
    inputValue.value = value;
  };

  /** 让输入框获取焦点 */
  const focusInput = () => {
    setTimeout(() => {
      inputRef.value && inputRef.value.focus();
    }, 0);
  };

  /** 添加按钮点击事件 */
  const handleAddClick = () => {
    if (props.disabled) {
      return;
    }
    tooltipVisible.value = false;
    errorMessage.value = '';
    isEdit.value = true;
    nextTick(() => {
      focusInput();
    });
  };

  /** 标签移除事件 */
  const handleTagClose = (index: number, item: string) => {
    if (typeof props.beforeRemove !== 'function') {
      removeTag(index);
      return;
    }
    props
      .beforeRemove(index, item)
      .then(() => {
        removeTag(index);
      })
      .catch(() => {});
  };

  /** 标签点击事件 */
  const handleTagClick = (index: number, item: string) => {
    emit('itemClick', index, item);
  };

  /** 输入框改变事件 */
  const handleInputChange = () => {
    if (!inputValue.value) {
      return;
    }
    if (typeof props.validator !== 'function') {
      addTag(inputValue.value);
      return;
    }
    loading.value = true;
    props
      .validator(inputValue.value)
      .then(() => {
        addTag(inputValue.value);
      })
      .catch((e: Error) => {
        loading.value = false;
        if (e && e.message != null && e.message !== '') {
          errorMessage.value = e.message;
          if (isEdit.value && !isDeactivated.value) {
            tooltipVisible.value = true;
          }
        }
        nextTick(() => {
          focusInput();
        });
      });
  };

  /** 输入框失去焦点事件 */
  const handleInputBlur = () => {
    tooltipVisible.value = false;
    if (!inputValue.value) {
      isEdit.value = false;
      errorMessage.value = '';
    }
  };

  /** 输入框获取焦点事件 */
  const handleInputFocus = () => {
    if (
      errorMessage.value &&
      !tooltipVisible.value &&
      isEdit.value &&
      !isDeactivated.value
    ) {
      tooltipVisible.value = true;
    }
  };

  onDeactivated(() => {
    isDeactivated.value = true;
    tooltipVisible.value = false;
  });

  onActivated(() => {
    isDeactivated.value = false;
  });

  defineExpose({
    inputTagRef,
    inputRef
  });
</script>
