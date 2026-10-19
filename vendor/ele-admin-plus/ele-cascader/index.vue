<!-- 级联选择 -->
<template>
  <ElCascader
    v-bind="omit($props, ['props', 'options', 'multiple'])"
    ref="cascaderRef"
    :props="cascaderPropsOption"
    :options="optionData"
    @update:modelValue="emitMethods['update:modelValue']"
    @change="emitMethods['change']"
    @focus="emitMethods['focus']"
    @blur="emitMethods['blur']"
    @clear="emitMethods['clear']"
    @visibleChange="emitMethods['visibleChange']"
    @expandChange="emitMethods['expandChange']"
    @removeTag="emitMethods['removeTag']"
  >
    <template v-for="name in Object.keys($slots)" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </ElCascader>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { ElCascader } from 'element-plus';
  import type { ElCascaderProps, ElCascaderInstance } from '../ele-app/el';
  import { omit } from '../utils/common';
  import { useComponentEvents, useProOptions } from '../utils/hook';
  import type { CascaderOption } from './types';
  import { cascaderEmits } from './props';
  import type { CascaderProps } from './props';

  defineOptions({ name: 'EleCascader' });

  const props = defineProps<CascaderProps>();

  const emit = defineEmits(cascaderEmits);

  const { emitMethods } = useComponentEvents(cascaderEmits, emit);
  const { optionData, reloadOptions } = useProOptions<CascaderOption>(props);

  /** 组件引用 */
  const cascaderRef = ref<ElCascaderInstance>(null);

  /** 级联面板配置 */
  const cascaderPropsOption = reactive<ElCascaderProps>({
    ...(props.props || {}),
    multiple: !!(props.multiple || props.props?.multiple)
  });

  /** 同步级联面板配置 */
  watch(
    [() => props.multiple, () => props.props],
    () => {
      const cProps = props.props || {};
      [
        'expandTrigger',
        'checkStrictly',
        'emitPath',
        'lazy',
        'lazyLoad',
        'value',
        'label',
        'children',
        'disabled',
        'leaf',
        'hoverThreshold'
      ].forEach((k) => {
        if (cascaderPropsOption[k] == null && cProps[k] == null) {
          return;
        }
        if (cascaderPropsOption[k] !== cProps[k]) {
          cascaderPropsOption[k] = cProps[k];
        }
      });
      if (props.multiple) {
        if (!cascaderPropsOption.multiple) {
          cascaderPropsOption.multiple = true;
        }
      } else if (!!cascaderPropsOption.multiple !== !!cProps.multiple) {
        cascaderPropsOption.multiple = cProps.multiple;
      }
    },
    {
      immediate: true,
      deep: true
    }
  );

  defineExpose({
    reloadOptions,
    cascaderRef
  });
</script>
