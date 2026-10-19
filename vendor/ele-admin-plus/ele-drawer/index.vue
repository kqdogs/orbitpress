<!-- 抽屉 -->
<template>
  <Teleport :to="teleportTo" :disabled="teleportDisabled">
    <ElDrawer
      v-bind="{ ...$attrs, ...pick($props, elDrawerPropKeys) }"
      ref="drawerRef"
      :modelValue="modelValue"
      :appendToBody="false"
      :lockScroll="inner ? false : lockScroll"
      :beforeClose="beforeClose"
      :closeOnClickModal="closeOnClickModal"
      :closeOnPressEscape="closeOnPressEscape"
      :openDelay="openDelay"
      :closeDelay="closeDelay"
      :destroyOnClose="destroyOnClose"
      :modal="modal"
      :direction="direction"
      :showClose="false"
      :size="size"
      :title="title"
      :withHeader="withHeader"
      :modalClass="drawerClass"
      :zIndex="zIndex"
      :headerAriaLevel="headerAriaLevel"
      @open="handleDrawerOpen"
      @opened="handleDrawerOpened"
      @close="handleDrawerClose"
      @closed="handleDrawerClosed"
      @openAutoFocus="handleDrawerOpenAutoFocus"
      @closeAutoFocus="handleDrawerCloseAutoFocus"
      @update:modelValue="updateModelValue"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="ele-drawer-header" :style="headerStyle">
          <div role="heading" class="ele-drawer-title" :style="titleStyle">
            <slot
              name="header"
              :close="close"
              :titleId="titleId"
              :titleClass="titleClass"
            >
              {{ title }}
            </slot>
          </div>
          <div
            v-if="showClose"
            class="ele-drawer-close"
            :style="closeBtnStyle"
            @click="close()"
          >
            <slot name="closeBtn">
              <ElIcon>
                <CloseOutlined />
              </ElIcon>
            </slot>
          </div>
        </div>
      </template>
      <template v-if="$slots.footer" #footer>
        <div class="ele-drawer-footer" :style="footerStyle">
          <slot name="footer"></slot>
        </div>
      </template>
      <MainContent
        class="ele-drawer-body"
        :class="[{ 'is-form': form }, drawerBodyClass]"
        :style="bodyStyle"
      >
        <slot></slot>
      </MainContent>
      <LoadingSpinner
        v-bind="loadingProps || {}"
        :loading="compLoading || loading"
        :plain="true"
      />
    </ElDrawer>
  </Teleport>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, onActivated, onDeactivated } from 'vue';
  import { ElDrawer, ElIcon, drawerEmits } from 'element-plus';
  import { CloseOutlined } from '../icons/index';
  import type { ElDrawerInstance } from '../ele-app/el';
  import { pick } from '../utils/common';
  import LoadingSpinner from '../ele-loading/components/loading-spinner.vue';
  import MainContent from '../ele-loading/components/main-content.vue';
  import { useLayoutState, useResponsive } from '../ele-pro-layout/util';
  import { getModalContainer } from '../ele-modal/util';
  import { drawerProps, elDrawerPropKeys } from './props';

  defineOptions({ name: 'EleDrawer', inheritAttrs: false });

  const props = defineProps(drawerProps);

  const emit = defineEmits(drawerEmits);

  const layoutState = useLayoutState();
  const isResponsive = useResponsive(props);

  /** 抽屉组件 */
  const drawerRef = ref<ElDrawerInstance>(null);

  /** 适配组件缓存 */
  const isActivated = ref<boolean>(!props.isDeactivated);

  /** 抽屉类名 */
  const drawerClass = computed<string>(() => {
    const classes: string[] = ['ele-drawer'];
    // 开启布局响应
    if (isResponsive.value) {
      classes.push('ele-drawer-responsive');
    }
    // 关闭状态
    if (!props.modelValue) {
      classes.push('ele-drawer-closed');
    }
    // 失活状态
    if (!isActivated.value && props.modelValue) {
      classes.push('ele-drawer-hide');
    }
    // 限制在内部区域
    if (props.inner) {
      classes.push('ele-drawer-inner');
    }
    // 异步内容组件时加载状态
    if (props.compLoading && !props.loading) {
      classes.push('ele-drawer-comp-loading');
    }
    // 内部表格弹性布局
    if (props.flexTable === 'auto') {
      classes.push('ele-drawer-flex-auto-table');
    } else if (props.flexTable) {
      classes.push('ele-drawer-flex-table');
    }
    // 在内容区添加自定义底栏
    if (props.customFooter) {
      classes.push('ele-drawer-custom-footer');
    }
    // 自定义类名
    if (props.modalClass) {
      classes.push(props.modalClass);
    }
    return classes.join(' ');
  });

  /** 抽屉插入位置 */
  const teleportTo = computed<Element | string>(() => {
    return getModalContainer(
      props.inner,
      false,
      props.appendTo,
      layoutState.modalsEl
    );
  });

  /** 禁用抽屉插入其它位置 */
  const teleportDisabled = computed<boolean>(() => {
    const appendTo = props.appendTo || 'body';
    const disabled = appendTo === 'body' ? !props.appendToBody : false;
    return props.inner ? false : disabled;
  });

  /** 关闭抽屉 */
  const handleClose = () => {
    if (drawerRef.value && drawerRef.value.handleClose) {
      drawerRef.value.handleClose();
    }
  };

  /** 更新modelValue */
  const updateModelValue = (value: boolean) => {
    emit('update:modelValue', value);
  };

  /** 打开事件 */
  const handleDrawerOpen = () => {
    emit('open');
  };

  /** 打开动画结束事件 */
  const handleDrawerOpened = () => {
    emit('opened');
  };

  /** 关闭事件 */
  const handleDrawerClose = () => {
    emit('close');
  };

  /** 关闭动画结束事件 */
  const handleDrawerClosed = () => {
    emit('closed');
  };

  /** 内容获取焦点的回调 */
  const handleDrawerOpenAutoFocus = () => {
    emit('openAutoFocus');
  };

  /** 内容失去焦点的回调 */
  const handleDrawerCloseAutoFocus = () => {
    emit('closeAutoFocus');
  };

  /** 同步属性 */
  watch(
    () => props.isDeactivated,
    (deactivated) => {
      isActivated.value = !deactivated;
    }
  );

  onActivated(() => {
    isActivated.value = true;
  });

  onDeactivated(() => {
    isActivated.value = false;
  });

  defineExpose({
    drawerRef,
    handleClose
  });
</script>
