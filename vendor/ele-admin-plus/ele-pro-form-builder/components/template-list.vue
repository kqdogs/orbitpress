<!-- 模板库列表 -->
<template>
  <div class="ele-pro-form-builder-template-wrapper">
    <ElEmpty
      v-if="!templateData || !templateData.length"
      :imageSize="58"
      class="ele-pro-form-builder-form-empty"
    />
    <template v-else>
      <div
        v-for="item in templateData"
        :key="item.name"
        class="ele-pro-form-builder-template-item"
        @click="handleImportTemplate(item)"
      >
        <div class="ele-pro-form-builder-template-item-label">
          {{ item.name }}
        </div>
        <div class="ele-pro-form-builder-template-item-body">
          <div class="ele-pro-form-builder-template-item-cover">
            <component v-if="item.cover" :is="item.cover" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { ElEmpty } from 'element-plus';
  import type { EleProFormProps } from '../../ele-app/plusx';
  import type { TemplateItem } from '../types';
  import { deepCloneObject } from './build-core';
  import { itemsGenerateNewKey } from './build-util';

  defineOptions({ name: 'TemplateList' });

  defineProps<{
    /** 模板数据 */
    templateData?: TemplateItem[];
  }>();

  const emit = defineEmits<{
    (e: 'importData', data: EleProFormProps): void;
  }>();

  /** 导入模板 */
  const handleImportTemplate = (item: TemplateItem) => {
    const result = deepCloneObject(item.config);
    itemsGenerateNewKey(result.items, [], false);
    emit('importData', result);
  };
</script>
