<!-- 卡片 -->
<template>
  <div
    class="ele-card"
    :class="[
      { 'is-border': bordered },
      { 'is-shadow': shadow === 'always' },
      { 'is-hover-shadow': shadow === 'hover' },
      { 'is-collapse': isCollapse },
      { 'is-flex-table': flexTable && flexTable !== 'auto' },
      { 'is-flex-auto-table': flexTable === 'auto' },
      { 'is-search-form': searchForm }
    ]"
  >
    <div
      v-if="header || $slots.header || $slots.extra"
      class="ele-card-header"
      :class="headerClass"
      :style="headerStyle"
      @click="handleHeaderClick"
    >
      <div class="ele-card-title" :style="titleStyle">
        <slot name="header">{{ header }}</slot>
      </div>
      <slot v-if="$slots.extra" name="extra"></slot>
      <div
        v-if="collapsable"
        :style="collapseIconStyle"
        class="ele-card-collapse-icon"
        @click.stop="handleCollapseClick"
      >
        <slot name="collapseIcon" :collapse="isCollapse">
          <ElIcon>
            <ArrowUp />
          </ElIcon>
        </slot>
      </div>
    </div>
    <Transition
      name="ele-card-slide"
      @before-leave="handleBeforeLeave"
      @leave="handleLeave"
      @after-leave="handleAfterLeave"
      @before-enter="handleBeforeEnter"
      @enter="handleEnter"
      @after-enter="handleAfterEnter"
    >
      <div
        v-show="!isCollapse"
        class="ele-card-body"
        :class="bodyClass"
        :style="bodyStyle"
      >
        <slot></slot>
      </div>
    </Transition>
    <div
      v-if="footer || $slots.footer"
      class="ele-card-footer"
      :class="footerClass"
      :style="footerStyle"
    >
      <slot name="footer">{{ footer }}</slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { ElIcon } from 'element-plus';
  import { ArrowUp } from '../icons/index';
  import { useCollapseAnim } from '../utils/hook';
  import { cardProps, cardEmits } from './props';

  defineOptions({ name: 'EleCard' });

  const props = defineProps(cardProps);

  const emit = defineEmits(cardEmits);

  const {
    handleBeforeEnter,
    handleEnter,
    handleAfterEnter,
    handleBeforeLeave,
    handleLeave,
    handleAfterLeave
  } = useCollapseAnim();

  /** 是否折叠 */
  const isCollapse = ref<boolean>(!!props.collapse);

  /** 折叠按钮点击 */
  const handleCollapseClick = () => {
    isCollapse.value = !isCollapse.value;
    emit('collapseChange', isCollapse.value);
  };

  /** 顶栏点击 */
  const handleHeaderClick = () => {
    if (props.collapsable === 'header') {
      handleCollapseClick();
    }
  };

  watch(
    () => props.collapse,
    (collapse) => {
      if (isCollapse.value !== !!collapse) {
        isCollapse.value = !!collapse;
      }
    }
  );
</script>
