<!-- 可选卡片 -->
<template>
  <div class="ele-check-card-group">
    <ElRow v-if="row" v-bind="row === true ? {} : row">
      <slot name="prepend"></slot>
      <ElCol
        v-for="(item, index) in optionData"
        :key="`${index}-${item.value}`"
        v-bind="item.col || {}"
      >
        <CardItem
          :item="item"
          :checked="isChecked(item)"
          :disabled="disabled || item.disabled"
          :bordered="bordered || item.bordered"
          :arrow="arrow"
          :arrowStyle="arrowStyle"
          :style="[itemStyle, item.style]"
          :class="[itemClass, item.class]"
          @click="handleItemClick(item)"
        >
          <template #default="slotProps">
            <slot name="item" v-bind="slotProps || {}">
              {{ item.label ?? item.value }}
            </slot>
          </template>
        </CardItem>
      </ElCol>
      <slot name="append"></slot>
    </ElRow>
    <template v-else>
      <slot name="prepend"></slot>
      <CardItem
        v-for="(item, index) in optionData"
        :key="item.key ?? `${index}-${item.value}`"
        :item="item"
        :checked="isChecked(item)"
        :disabled="disabled || item.disabled"
        :bordered="bordered || item.bordered"
        :arrow="arrow"
        :arrowStyle="arrowStyle"
        :style="[itemStyle, item.style]"
        :class="[itemClass, item.class]"
        @click="handleItemClick(item)"
      >
        <template #default="slotProps">
          <slot name="item" v-bind="slotProps || {}">
            {{ item.label ?? item.value }}
          </slot>
        </template>
      </CardItem>
      <slot name="append"></slot>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { ElRow, ElCol } from 'element-plus';
  import { useProOptions } from '../utils/hook';
  import {
    valueIsChanged,
    isEmptyValue,
    useFormValidate
  } from '../ele-basic-select/util';
  import CardItem from './components/card-item.vue';
  import type { CheckCardItem, CheckedValue, MultipleValue } from './types';
  import { checkCardProps, checkCardEmits } from './props';

  defineOptions({ name: 'EleCheckCard' });

  const props = defineProps(checkCardProps);

  const emit = defineEmits(checkCardEmits);

  const { validateChange } = useFormValidate();
  const { optionData, reloadOptions } = useProOptions<CheckCardItem>(
    props,
    'items'
  );

  /** 判断是否选中 */
  const isChecked = (item: CheckCardItem) => {
    if (props.modelValue == null || item.value == null) {
      return false;
    }
    if (!props.multiple) {
      return props.modelValue === item.value;
    }
    if (!Array.isArray(props.modelValue)) {
      return false;
    }
    return props.modelValue.includes(item.value);
  };

  /** 更新选中值 */
  const updateModelValue = (modelValue: CheckedValue) => {
    if (valueIsChanged(modelValue, props.modelValue, props.multiple)) {
      emit('update:modelValue', modelValue);
      validateChange();
      emit('change', modelValue);
    }
  };

  /** item 点击事件 */
  const handleItemClick = (item: CheckCardItem) => {
    // 禁用
    if (props.disabled || item.disabled) {
      return;
    }
    // 单选
    if (!props.multiple) {
      if (
        props.allowUncheck &&
        !isEmptyValue(props.modelValue) &&
        props.modelValue === item.value
      ) {
        updateModelValue(null);
        return;
      }
      updateModelValue(item.value);
      return;
    }
    // 多选选中
    if (!isChecked(item)) {
      if (props.modelValue == null || !Array.isArray(props.modelValue)) {
        updateModelValue(item.value == null ? [] : [item.value]);
        return;
      }
      const temp: MultipleValue = [...props.modelValue];
      if (item.value != null) {
        temp.push(item.value);
      }
      updateModelValue(temp);
      return;
    }
    // 多选取消选中
    if (props.modelValue == null || !Array.isArray(props.modelValue)) {
      updateModelValue([]);
      return;
    }
    updateModelValue(props.modelValue.filter((v) => v !== item.value));
  };

  defineExpose({
    reloadOptions
  });
</script>
