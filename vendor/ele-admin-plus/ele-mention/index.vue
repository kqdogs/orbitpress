<!-- 提及 -->
<template>
  <ElMention
    v-bind="omit($props, ['options'])"
    ref="mentionRef"
    :options="optionData"
    @update:modelValue="emitMethods['update:modelValue']"
    @search="emitMethods['search']"
    @select="emitMethods['select']"
    @focus="emitMethods['focus']"
    @blur="emitMethods['blur']"
  >
    <template v-for="name in Object.keys($slots)" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </ElMention>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { ElMention } from 'element-plus';
  import type { ElMentionInstance } from '../ele-app/el';
  import { omit } from '../utils/common';
  import { useComponentEvents, useProOptions } from '../utils/hook';
  import type { MentionOption } from './types';
  import { mentionEmits } from './props';
  import type { MentionProps } from './props';

  defineOptions({ name: 'EleMention' });

  const props = defineProps<MentionProps>();

  const emit = defineEmits(mentionEmits);

  const { emitMethods } = useComponentEvents(mentionEmits, emit);
  const { optionData, reloadOptions } = useProOptions<MentionOption>(props);

  /** 组件引用 */
  const mentionRef = ref<ElMentionInstance>(null);

  defineExpose({
    reloadOptions,
    mentionRef
  });
</script>
