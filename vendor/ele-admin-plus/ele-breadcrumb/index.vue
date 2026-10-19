<!-- 面包屑导航 -->
<template>
  <ElBreadcrumb
    ref="breadcrumbRef"
    :separator="breadcrumbSeparator"
    :separatorIcon="breadcrumbSeparatorIcon"
    class="ele-breadcrumb"
  >
    <ElBreadcrumbItem
      v-for="item in items"
      :key="item.key ?? item.title"
      :replace="item.replace"
      :to="item.to"
    >
      <template
        v-if="item.slot && item.slot !== 'default' && $slots[item.slot]"
      >
        <slot :name="item.slot" :item="item"></slot>
      </template>
      <template v-else>
        <ElIcon v-if="item.icon" v-bind="item.iconProps || {}">
          <component :is="item.icon" :style="item.iconStyle" />
        </ElIcon>
        <span v-if="item.title">{{ item.title }}</span>
      </template>
    </ElBreadcrumbItem>
  </ElBreadcrumb>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { ElBreadcrumb, ElBreadcrumbItem, ElIcon } from 'element-plus';
  import type { ElBreadcrumbInstance, ElBreadcrumbProps } from '../ele-app/el';
  import { breadcrumbProps } from './props';

  defineOptions({ name: 'EleBreadcrumb' });

  const props = defineProps(breadcrumbProps);

  /** 组件实例 */
  const breadcrumbRef = ref<ElBreadcrumbInstance>(null);

  /** 字符分隔符 */
  const breadcrumbSeparator = computed<ElBreadcrumbProps['separator']>(() => {
    if (typeof props.separator !== 'string') {
      return;
    }
    return props.separator;
  });

  /** 图标分隔符 */
  const breadcrumbSeparatorIcon = computed<ElBreadcrumbProps['separatorIcon']>(
    () => {
      if (props.separatorIcon != null && props.separatorIcon !== '') {
        return props.separatorIcon;
      }
      if (props.separator != null && typeof props.separator !== 'string') {
        return props.separator;
      }
      return props.separatorIcon;
    }
  );

  defineExpose({
    breadcrumbRef
  });
</script>
