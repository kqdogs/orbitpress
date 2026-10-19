<!-- 复杂值编辑 -->
<template>
  <ElInput
    :rows="4"
    size="small"
    type="textarea"
    v-model="inputValue"
    :placeholder="placeholder"
    @change="handleInputChange"
  />
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { ElInput } from 'element-plus';
  type DataValue = string | boolean | number | Record<string, any> | Array<any>;

  defineOptions({ name: 'JsonInput' });

  const props = defineProps<{
    /** 绑定值 */
    modelValue?: DataValue;
    /** 提示文本 */
    placeholder?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value?: DataValue): void;
  }>();

  /** 输入框值 */
  const inputValue = ref('');

  /** 转 json 字符串 */
  const stringifyJSON = (data?: DataValue) => {
    if (data == null) {
      return '';
    }
    return JSON.stringify(data, void 0, 2);
  };

  /** 更新绑定值 */
  const updateModelValue = (json: string) => {
    if (stringifyJSON(props.modelValue) !== json) {
      try {
        const isEmpty = json == null || json === '' || json.trim() === '';
        const value = isEmpty ? void 0 : JSON.parse(json);
        emit('update:modelValue', value);
      } catch (e) {
        console.error(e);
      }
    }
  };

  /** 更新数据 */
  const handleInputChange = (value?: string) => {
    if (value != null) {
      updateModelValue(value);
    }
  };

  /** 同步值 */
  watch(
    () => props.modelValue,
    (value) => {
      const json = stringifyJSON(value);
      if (inputValue.value !== json) {
        inputValue.value = json;
      }
    },
    {
      deep: true,
      immediate: true
    }
  );
</script>
