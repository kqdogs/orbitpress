<template>
  <ElFormItem
    class="ele-pro-form-footer"
    :class="{ 'is-search-expand': autoFooterCol && searchExpand }"
    v-bind="footerProps || {}"
    :labelWidth="
      typeof footerProps?.labelWidth === 'number'
        ? `${footerProps.labelWidth}px`
        : footerProps?.labelWidth
    "
  >
    <template
      v-for="(slotName, compSlotName) in getSlotsMap(
        $slots,
        footerSlots,
        ['default'],
        ownSlots
      )"
      #[compSlotName]="slotProps"
    >
      <slot :name="slotName" v-bind="slotProps || {}"></slot>
    </template>
    <div class="ele-pro-form-footer-body" :style="footerStyle">
      <slot name="footer" :submitForm="handleSubmit" :resetForm="handleReset">
        <ElButton
          type="primary"
          v-bind="submitButtonProps || {}"
          @click="handleSubmit"
        >
          {{ submitText }}
        </ElButton>
        <ElButton v-bind="resetButtonProps || {}" @click="handleReset">
          {{ resetText }}
        </ElButton>
      </slot>
      <ElLink
        v-if="showSearchExpand"
        type="primary"
        underline="never"
        :style="{ marginLeft: '12px' }"
        v-bind="searchExpandButtonProps || {}"
        @click="toggleSearchExpand"
      >
        <template v-if="searchExpand">
          <span>{{ searchShrinkText }}</span>
          <ElIcon :style="{ verticalAlign: '-1px' }">
            <ArrowUp />
          </ElIcon>
        </template>
        <template v-else>
          <span>{{ searchExpandText }}</span>
          <ElIcon :style="{ verticalAlign: '-2px' }">
            <ArrowDown />
          </ElIcon>
        </template>
      </ElLink>
      <slot
        name="footerExtra"
        :submitForm="handleSubmit"
        :resetForm="handleReset"
      ></slot>
    </div>
  </ElFormItem>
</template>

<script lang="ts" setup>
  import type { CSSProperties, PropType } from 'vue';
  import { ElFormItem, ElButton, ElLink, ElIcon } from 'element-plus';
  import { ArrowDown, ArrowUp } from '../../icons/index';
  import type {
    ElFormItemProps,
    ElButtonProps,
    ElLinkProps
  } from '../../ele-app/el';
  import { getSlotsMap } from '../../utils/common';
  const ownSlots = ['footer', 'footerExtra'];

  defineOptions({ name: 'ProFormFooter' });

  const props = defineProps({
    /** 底栏 ElFormItem 属性 */
    footerProps: Object as PropType<ElFormItemProps>,
    /** 底栏 ElFormItem 插槽 */
    footerSlots: Object as PropType<Record<string, string>>,
    /** 自动计算底栏栅格份数 */
    autoFooterCol: Boolean,
    /** 底栏样式 */
    footerStyle: Object as PropType<CSSProperties>,
    /** 提交按钮文本 */
    submitText: String,
    /** 重置按钮文本 */
    resetText: String,
    /** 提交按钮属性 */
    submitButtonProps: Object as PropType<ElButtonProps>,
    /** 重置按钮属性 */
    resetButtonProps: Object as PropType<ElButtonProps>,
    /** 是否在底栏显示表单展开收起按钮 */
    showSearchExpand: Boolean,
    /** 搜索表单展开状态 */
    searchExpand: Boolean,
    /** 展开和收起按钮属性 */
    searchExpandButtonProps: Object as PropType<ElLinkProps>,
    /** 展开按钮的文字 */
    searchExpandText: String,
    /** 收起按钮的文字 */
    searchShrinkText: String
  });

  const emit = defineEmits({
    updateSearchExpand: (_expand: boolean) => true,
    submit: () => true,
    reset: () => true
  });

  /** 切换搜索表单展开状态 */
  const toggleSearchExpand = () => {
    emit('updateSearchExpand', !props.searchExpand);
  };

  /** 提交 */
  const handleSubmit = () => {
    emit('submit');
  };

  /** 重置 */
  const handleReset = () => {
    emit('reset');
  };
</script>
