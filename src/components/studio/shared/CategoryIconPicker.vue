<script setup lang="ts">
import EleIconSelect from 'ele-admin-plus/es/ele-icon-select';
import CategoryIcon from '../../CategoryIcon.vue';
import {categoryIconGroups} from '../../../lib/category-icons';
const model=defineModel<string>({required:true});
defineProps<{disabled?:boolean}>();
</script>
<template>
 <EleIconSelect v-model="model" :data="categoryIconGroups" :disabled="disabled" filterable="popper" :tooltip="'static'" :popper-width="520" :popper-height="380" placeholder="选择分类图标" filter-placeholder="搜索图标英文名称，例如 Video、Star、House" :popper-options="{strategy:'fixed'}">
  <template #icon="{icon}"><el-icon :size="20"><CategoryIcon :name="icon" :size="20"/></el-icon></template>
 </EleIconSelect>
</template>
