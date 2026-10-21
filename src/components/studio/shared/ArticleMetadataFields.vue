<script setup lang="ts">
import {t} from '../../../lib/i18n/client';
import {onBeforeUnmount,onMounted,ref} from 'vue';
import {ElMessage} from 'element-plus';
import EleCard from 'ele-admin-plus/es/ele-card';
import TermInput from './TermInput.vue';
import {request} from '../../admin/api';
import {legacyHighlights,MAX_HIGHLIGHTS,MAX_TAGS,suggestArticleTags,uniqueTerms} from '../../../lib/article-metadata';
const tags=defineModel<string[]>('tags',{required:true}),highlights=defineModel<string[]>('highlights',{required:true});
const props=defineProps<{title:string;excerpt:string;body:string;category?:string;disabled?:boolean}>();
const emit=defineEmits<{change:[]}>();
const tagInput=ref<InstanceType<typeof TermInput>>(),highlightInput=ref<InstanceType<typeof TermInput>>();
const popular=ref<string[]>([]),error=ref(''),loading=ref(false);
const controller=new AbortController();
async function loadTags(){
 loading.value=true;error.value='';
 try{const rows=await request<{name:string;count:number}[]>('/api/admin/tags',{signal:controller.signal});if(!controller.signal.aborted)popular.value=rows.map(row=>row.name);}
 catch(cause){if(!controller.signal.aborted)error.value=cause instanceof Error?cause.message:t("常用标签读取失败");}
 finally{if(!controller.signal.aborted)loading.value=false;}
}
function prepare(){tagInput.value?.prepare();highlightInput.value?.prepare();}
function generate(){
 try{
  tagInput.value?.prepare();
  const before=tags.value.length;
  tags.value=uniqueTerms([...tags.value,...suggestArticleTags(props,popular.value)],MAX_TAGS);
  ElMessage.info(tags.value.length>before?t("已提取标签，可继续修改"):t("没有新增标签，可手动添加或补充正文"));
 }catch(cause){ElMessage.error(cause instanceof Error?cause.message:t("标签输入无效"));}
}
function extractHighlights(){highlights.value=uniqueTerms([...highlights.value,...legacyHighlights(props.excerpt)],MAX_HIGHLIGHTS,40);}
onMounted(loadTags);onBeforeUnmount(()=>controller.abort());defineExpose({prepare});
</script>
<template>
 <EleCard :header="t('标签')">
  <TermInput ref="tagInput" v-model="tags" :label="t('标签')" :max="MAX_TAGS" :max-length="30" :disabled="disabled" :suggestions="popular" @change="emit('change')"/>
  <el-button class="metadata-action" :disabled="disabled||tags.length>=MAX_TAGS||!(title.trim()||excerpt.trim()||body.trim())" @click="generate"> {{ t("自动生成标签") }} </el-button>
  <p class="field-help"> {{ t("根据标题、摘要和正文提取，保留已添加标签；生成后可逐个删除。") }} </p>
  <p v-if="loading" class="field-help" role="status"> {{ t("正在读取常用标签…") }} </p>
  <el-alert v-if="error" :title="error" type="warning" :closable="false"><el-button link @click="loadTags"> {{ t("重新读取") }} </el-button></el-alert>
 </EleCard>
 <EleCard :header="t('文章亮点（黄色）')">
  <TermInput ref="highlightInput" v-model="highlights" :label="t('文章亮点')" :max="MAX_HIGHLIGHTS" :max-length="40" :disabled="disabled" warning @change="emit('change')"/>
  <el-button class="metadata-action" :disabled="disabled||!excerpt.trim()||highlights.length>=MAX_HIGHLIGHTS" @click="extractHighlights"> {{ t("从摘要提取亮点") }} </el-button>
  <p class="field-help"> {{ t("显示在文章标题下方，按添加顺序排列；留空不显示黄色亮点。") }} </p>
 </EleCard>
</template>
<style scoped>.metadata-action{margin-top:12px}</style>
