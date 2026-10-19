<template>
  <template v-if="icon">
    <img v-if="typeof icon === 'string'" :src="icon" />
    <ElIcon v-else>
      <component :is="icon" />
    </ElIcon>
  </template>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { computed } from 'vue';
  import { ElIcon } from 'element-plus';
  import type { UserComponent } from '../../ele-app/types';
  import type { IconItem } from '../types';

  const props = defineProps({
    /** 文件名称 */
    fileName: String,
    /** 是否是目录 */
    isDirectory: Boolean,
    /** 后缀对应的图标 */
    icons: Array as PropType<IconItem[]>
  });

  /** 对应图标 */
  const icon = computed<UserComponent | undefined>(() => {
    const { icons, fileName, isDirectory } = props;
    if (!icons) {
      return;
    }
    // 文件夹
    if (isDirectory) {
      return icons.find((d) => d.type === 'dir')?.icon;
    }
    // 匹配后缀对应的图标
    if (fileName) {
      const icon = icons.find(
        (d) => d.suffixes && d.suffixes.some((t) => fileName.endsWith(t))
      )?.icon;
      if (icon) {
        return icon;
      }
    }
    // 默认文件图标
    return icons.find((d) => d.type === 'file')?.icon;
  });
</script>
