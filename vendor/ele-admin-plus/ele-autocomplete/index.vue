<!-- 自动完成 -->
<template>
  <ElAutocomplete
    v-bind="omit($props, ['fetchSuggestions'])"
    ref="autocompleteRef"
    :fetchSuggestions="handleFetchSuggestions"
    @update:modelValue="emitMethods['update:modelValue']"
    @input="emitMethods['input']"
    @change="emitMethods['change']"
    @focus="emitMethods['focus']"
    @blur="emitMethods['blur']"
    @clear="emitMethods['clear']"
    @select="emitMethods['select']"
  >
    <template v-for="name in Object.keys($slots)" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </ElAutocomplete>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { ElAutocomplete } from 'element-plus';
  import type { ElAutocompleteInstance } from '../ele-app/el';
  import { omit } from '../utils/common';
  import { useComponentEvents } from '../utils/hook';
  import type { ElFetchSuggestionsCallback } from './types';
  import { autocompleteEmits } from './props';
  import type { AutocompleteProps } from './props';

  defineOptions({ name: 'EleAutocomplete' });

  const props = defineProps<AutocompleteProps>();

  const emit = defineEmits(autocompleteEmits);

  const { emitMethods } = useComponentEvents(autocompleteEmits, emit);

  /** 组件引用 */
  const autocompleteRef = ref<ElAutocompleteInstance>(null);

  /** 请求建议数据 */
  const handleFetchSuggestions = (
    keyword: string,
    callback: ElFetchSuggestionsCallback
  ) => {
    if (props.fetchSuggestions == null) {
      callback([]);
      return;
    }
    // 自定义方法
    if (typeof props.fetchSuggestions === 'function') {
      const result = props.fetchSuggestions(keyword, callback);
      if (
        result != null &&
        typeof result === 'object' &&
        typeof result.then === 'function'
      ) {
        result.then((data) => {
          callback(data || []);
        });
      }
      return;
    }
    // 直接指定数据
    const kw = (keyword ?? '').toLowerCase();
    const options = props.fetchSuggestions || [];
    const result = options.filter(
      (d) => !kw || (d.value ?? '').toLowerCase().includes(kw)
    );
    callback(result);
  };

  defineExpose({
    autocompleteRef
  });
</script>
