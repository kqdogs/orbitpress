<!-- 标签页自定义按钮 -->
<template>
  <div
    class="ele-tab-tool"
    :class="[{ 'is-tab': tab }, { 'is-active': active }]"
  >
    <template v-if="tab">
      <div
        class="ele-tab-title"
        @click="handleItemClick"
        @contextmenu="handleItemContextmenu"
      >
        <slot></slot>
      </div>
      <div class="ele-tab-corner-left"></div>
      <div class="ele-tab-corner-right"></div>
    </template>
    <slot v-else></slot>
  </div>
</template>

<script lang="ts" setup>
  import { inject } from 'vue';
  import { TAB_WRAP_KEY } from '../ele-tabs/props';
  import { tabToolProps } from './props';

  defineOptions({ name: 'EleTabTool' });

  const props = defineProps(tabToolProps);

  /** 页签容器注入 */
  const wrapProps = inject(TAB_WRAP_KEY, null);

  /** 页签项标题点击事件 */
  const handleItemClick = (e: MouseEvent) => {
    if (wrapProps && wrapProps.triggerTabItemClick) {
      wrapProps.triggerTabItemClick(void 0, props.tabName, e);
    }
  };

  /** 页签项标题右键事件 */
  const handleItemContextmenu = (e: MouseEvent) => {
    if (wrapProps && wrapProps.triggerItemContextMenu) {
      wrapProps.triggerItemContextMenu(void 0, props.tabName, e);
    }
  };
</script>
