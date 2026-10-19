<!-- 骨架 -->
<template>
  <div class="ele-admin-layout" :class="{ 'is-row-direction': !isHeaderLogo }">
    <slot v-if="isHeaderLogo" name="head"></slot>
    <slot v-else name="side"></slot>
    <ReceiverView
      class="ele-admin-main"
      :class="{ 'is-row-direction': isHeaderLogo }"
    >
      <template #default="slotProps">
        <slot v-if="isHeaderLogo" name="side" :param="slotProps"></slot>
        <slot v-else name="head" :param="slotProps"></slot>
        <div class="ele-admin-body">
          <slot name="tabs" :param="slotProps"></slot>
          <div class="ele-admin-wrapper">
            <slot name="body" :param="slotProps"></slot>
          </div>
        </div>
      </template>
    </ReceiverView>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  import ReceiverView from '../../ele-config-provider/components/receiver-view';

  defineOptions({ name: 'LayoutSkeleton' });

  defineProps({
    /** logo是否位于顶栏 */
    isHeaderLogo: Boolean
  });
</script>
