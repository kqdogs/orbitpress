<script setup lang="ts">
import {t} from '../../../lib/i18n/client';
import { computed } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import { Brush,Plus } from '@element-plus/icons-vue';
import { useStudio } from '../store';
import PageLayoutBuilder from '../builder/PageLayoutBuilder.vue';
const route=useRoute(),router=useRouter(),{data,busy}=useStudio();
const pages=computed(()=>data.pages.filter(page=>page.status!=='trash'));
const targets=[{value:'home',label:t("首页")},{value:'article',label:t("文章模板")},{value:'about',label:t("关于页面")},{value:'default',label:t("独立页面默认模板")}];
const target=computed(()=>{
 const requested=typeof route.query.target==='string'?route.query.target:'home';
 return targets.some(item=>item.value===requested)||pages.value.some(page=>`page:${page.id}`===requested)?requested:'home';
});
function change(next:string){void router.push({path:'/home',query:next==='home'?{}:{target:next}});}
</script>
<template>
 <div class="builder-target-bar">
  <div><el-icon><Brush/></el-icon><strong> {{ t("页面装修") }} </strong><span class="field-help"> {{ t("选择模板或独立页面") }} </span></div>
  <el-select :model-value="target" :aria-label="t('选择装修页面')" filterable :disabled="busy" @change="change">
   <el-option-group :label="t('站点模板')"><el-option v-for="item in targets" :key="item.value" :value="item.value" :label="item.label"/></el-option-group>
   <el-option-group :label="t('独立页面')"><el-option v-for="page in pages" :key="page.id" :value="`page:${page.id}`" :label="t('{0}{1}', [page.title, page.status==='draft'?t('（草稿）'):''])"/></el-option-group>
  </el-select>
  <el-button :icon="Plus" :disabled="busy" @click="router.push('/page-editor')"> {{ t("新建独立页面") }} </el-button>
 </div>
 <PageLayoutBuilder :key="target" :target="target"/>
</template>
