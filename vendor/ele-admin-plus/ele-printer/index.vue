<!-- 打印 -->
<template>
  <Teleport :to="container" :disabled="isStatic && !visible">
    <table
      v-bind="$attrs"
      class="ele-printer"
      :class="[{ 'is-open': visible }, { 'is-static': isStatic }]"
    >
      <thead v-if="$slots.header">
        <tr>
          <td>
            <div class="ele-printer-header" :style="headerStyle">
              <slot name="header"></slot>
            </div>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="ele-printer-body" :style="bodyStyle">
              <slot></slot>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot v-if="$slots.footer">
        <tr>
          <td>
            <div class="ele-printer-footer" :style="footerStyle">
              <slot name="footer"></slot>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  </Teleport>
</template>

<script lang="ts" setup>
  import { shallowRef, ref, watch, nextTick, computed, onMounted } from 'vue';
  import { getPrintContainer, mergeOptions, usePrinter } from './util';
  import type { PrintOption } from './types';
  import { printerProps, printerEmits } from './props';

  defineOptions({ name: 'ElePrinter', inheritAttrs: false });

  const props = defineProps(printerProps);

  const emit = defineEmits(printerEmits);

  const doPrint = usePrinter(() => {
    visible.value = false;
    updateModelValue(false);
    handleDone();
  });

  /** 打印容器 */
  const container = shallowRef<Element>(getPrintContainer());

  /** 是否开始打印 */
  const visible = ref<boolean>(false);

  /** 是否显示在文档流中 */
  const isStatic = computed<boolean>(() => props.static);

  /** 打印 */
  const print = (options?: any) => {
    if (visible.value) {
      return;
    }
    visible.value = true;
    nextTick(() => {
      const option: PrintOption = {
        title: props.title,
        margin: props.margin,
        direction: props.direction,
        orientation: props.orientation,
        options: mergeOptions(props.options, options)
      };
      doPrint(option, props.target);
    });
  };

  /** 打印完成事件 */
  const handleDone = () => {
    emit('done');
  };

  /** 更新绑定值 */
  const updateModelValue = (value: boolean) => {
    emit('update:modelValue', value);
  };

  watch(
    () => props.modelValue,
    (modelValue) => {
      if (modelValue) {
        print();
      }
    }
  );

  onMounted(() => {
    if (props.modelValue) {
      print();
    }
  });

  defineExpose({
    print
  });
</script>
