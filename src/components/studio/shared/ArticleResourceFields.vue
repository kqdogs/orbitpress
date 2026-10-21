<script setup lang="ts">
import {t} from '../../../lib/i18n/client';
import EleCard from 'ele-admin-plus/es/ele-card';
import {emptyArticleResources,type PostInput} from '../../../lib/schema';
const props=defineProps<{modelValue:PostInput['resources'];disabled?:boolean}>();
const emit=defineEmits<{'update:modelValue':[value:NonNullable<PostInput['resources']>]} >();
function update(patch:Partial<NonNullable<PostInput['resources']>>){emit('update:modelValue',{...(props.modelValue||emptyArticleResources),...patch});}
function change(index:number,field:'label'|'url'|'code',value:string){update({items:(props.modelValue?.items||[]).map((item,i)=>i===index?{...item,[field]:value}:item)});}
</script>
<template>
 <EleCard :header="t('本期视频提到的链接')">
  <p class="field-help"> {{ t("文章右侧的资源卡片：添加链接、优惠码和视频简介，保存文章后生效。可切换预览查看。") }} </p>
  <el-form label-position="top" :disabled="disabled">
   <el-form-item :label="t('卡片标题')"><el-input :model-value="modelValue?.title||emptyArticleResources.title" maxlength="80" @update:model-value="update({title:$event})"/></el-form-item>
   <template v-for="(item,index) in (modelValue?.items||[])" :key="index"><div class="article-resource-fields">
    <el-form-item :label="t('链接 {0} 名称', [index+1])"><el-input :model-value="item.label" maxlength="100" :placeholder="t('工具或资源名称')" @update:model-value="change(index,'label',$event)"/></el-form-item>
    <el-form-item :label="t('链接地址')"><el-input :model-value="item.url" :placeholder="t('填写完整的 HTTPS 地址')" @update:model-value="change(index,'url',$event)"/></el-form-item>
    <el-form-item :label="t('优惠码（可选）')"><el-input :model-value="item.code" maxlength="100" @update:model-value="change(index,'code',$event)"/></el-form-item>
    <el-button type="danger" text @click="update({items:modelValue!.items.filter((_,i)=>i!==index)})"> {{ t("删除此链接") }} </el-button>
   </div></template>
   <el-button :disabled="disabled||(modelValue?.items.length||0)>=12" @click="update({items:[...(modelValue?.items||[]),{label:'',url:'',code:''}]})" type="primary"> {{ t("添加资源链接") }} </el-button>
   <el-form-item :label="t('完整视频简介链接（可选）')"><el-input :model-value="modelValue?.descriptionUrl||''" :placeholder="t('填写完整视频简介的 HTTPS 地址')" @update:model-value="update({descriptionUrl:$event})"/></el-form-item>
   <p class="field-help"> {{ t("不填写链接时隐藏卡片。支持多条链接和优惠码，单篇文章独立保存。") }} </p>
  </el-form>
 </EleCard>
</template>
<style scoped>
.article-resource-fields{padding:12px;background:var(--el-fill-color-light);border:1px solid var(--el-border-color-lighter);border-radius:8px;margin-bottom:12px}
.el-form-item:last-of-type{margin-top:18px}
</style>
