<!-- 模板库列表 -->
<template>
  <div class="ele-crud-builder-template-wrapper">
    <ElEmpty
      v-if="!templateData || !templateData.length"
      :imageSize="58"
      class="ele-crud-builder-form-empty"
    />
    <template v-else>
      <div
        v-for="item in templateData"
        :key="item.name"
        class="ele-crud-builder-template-item"
        @click="handleImportTemplate(item)"
      >
        <div class="ele-crud-builder-template-item-label">
          {{ item.name }}
        </div>
        <div class="ele-crud-builder-template-item-body">
          <div class="ele-crud-builder-template-item-cover">
            <component v-if="item.cover" :is="item.cover" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { ElEmpty } from 'element-plus';
  import type { EleCrudProps } from '../../ele-app/plusx';
  import { deepCloneObject } from '../../ele-pro-form-builder/components/build-core';
  import type { TemplateItem } from '../types';
  import { itemsGenerateNewKey } from '../util';

  defineOptions({ name: 'TemplateList' });

  defineProps<{
    /** 模板数据 */
    templateData?: TemplateItem[];
  }>();

  const emit = defineEmits<{
    (e: 'importData', data: EleCrudProps): void;
  }>();

  /** 导入模板 */
  const handleImportTemplate = (item: TemplateItem) => {
    const result = deepCloneObject(item.config);
    itemsGenerateNewKey(result.fields, [], false);
    emit('importData', result);
  };
</script>
