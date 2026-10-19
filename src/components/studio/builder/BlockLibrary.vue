<script setup lang="ts">
import { ref } from 'vue';
import { layoutBlockCatalog } from '../../../lib/page-layouts';
import type { LayoutBlock, LayoutRegion } from '../../../lib/schema';
import { Plus, Document, Picture, Link, Bell, User, List, Folder, Clock, Search, Minus, Reading, VideoCamera, Grid, Promotion, House } from '@element-plus/icons-vue';
const props=defineProps<{disabled?:boolean;home?:boolean}>();
const emit=defineEmits<{add:[type:LayoutBlock['type'],region:LayoutRegion]}>();
const region=ref<LayoutRegion>(props.home?'main':'right');
const icons={'home-hero':House,'home-promo':Promotion,'home-categories':Grid,'home-videos':VideoCamera,'home-tutorials':Reading,'home-notice':Bell,heading:Reading,markdown:Document,image:Picture,button:Link,notice:Bell,author:User,toc:List,categories:Folder,latest:Clock,search:Search,links:Link,divider:Minus};
</script>
<template>
 <div class="block-library">
  <el-form-item label="添加到">
   <el-select v-model="region" aria-label="组件添加位置" :disabled="disabled">
    <el-option label="正文区域" value="main"/><el-option label="左侧栏" value="left"/><el-option label="右侧栏" value="right"/>
   </el-select>
  </el-form-item>
  <div class="block-library-grid">
   <el-tooltip v-for="item in layoutBlockCatalog" :key="item.type" :content="item.description" placement="right">
    <button type="button" :disabled="disabled" :aria-label="`添加${item.name}`" @click="emit('add',item.type,region)">
     <el-icon><component :is="icons[item.type as keyof typeof icons]||Plus"/></el-icon><span>{{ item.name }}</span>
    </button>
   </el-tooltip>
  </div>
 </div>
</template>
