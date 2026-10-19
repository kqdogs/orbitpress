<!-- 底部工具栏 -->
<template>
  <Teleport :to="teleportTo" :disabled="!teleported || !teleportTo">
    <div
      v-bind="$attrs"
      class="ele-bottom-bar"
      :class="{ 'is-deactivated': !isActivated }"
    >
      <div class="ele-bottom-bar-body" :style="bodyStyle">
        <slot></slot>
      </div>
      <div class="ele-bottom-bar-extra" :style="extraStyle">
        <slot name="extra"></slot>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
  import { ref, computed, onActivated, onDeactivated } from 'vue';
  import { useLayoutState } from '../ele-pro-layout/util';
  import { bottomBarProps } from './props';

  defineOptions({ name: 'EleBottomBar', inheritAttrs: false });

  defineProps(bottomBarProps);

  const layoutState = useLayoutState();

  /** 适配组件缓存 */
  const isActivated = ref<boolean>(true);

  /** 传送节点 */
  const teleportTo = computed<HTMLElement | null | undefined>(() => {
    return layoutState.getBodyWrapperEl?.();
  });

  onActivated(() => {
    isActivated.value = true;
  });

  onDeactivated(() => {
    isActivated.value = false;
  });
</script>
