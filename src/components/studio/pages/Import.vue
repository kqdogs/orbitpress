<script setup lang="ts">
import {computed,onBeforeUnmount,onMounted,ref} from 'vue';
import {onBeforeRouteLeave,useRouter} from 'vue-router';
import {ElMessageBox} from 'element-plus';
import EleCard from 'ele-admin-plus/es/ele-card';
import PageTitle from '../shared/PageTitle.vue';
import {useStudio} from '../store';
import {request} from '../../admin/api';
import type {DiscoveredArticles,ImportedArticle} from '../../../lib/import-contract';
import {runImportQueue,waitForImport,type ImportRow} from '../import-queue';
const router=useRouter(),store=useStudio(),{data,session}=store;
const url=ref(''),categoryId=ref(''),rows=ref<ImportRow[]>([]),selected=ref<ImportRow[]>([]);
const scanning=ref(false),running=ref(false),error=ref(''),notice=ref('');
let controller:AbortController|undefined;let active=true;
const working=computed(()=>scanning.value||running.value);
const done=computed(()=>rows.value.filter(row=>row.status==='success').length);
const failed=computed(()=>rows.value.filter(row=>row.status==='error').length);
const statuses={pending:'待采集',importing:'下载文章与图片',saving:'保存草稿',success:'已保存草稿',error:'失败 / 已停止'};
async function discover(){
 if(working.value)return;
 if(rows.value.some(row=>row.payload&&row.status!=='success')){
  try{await ElMessageBox.confirm('有保存结果待确认的文章，建议先重试。重新扫描将清除当前队列。','重新扫描',{confirmButtonText:'重新扫描',cancelButtonText:'返回队列'});}catch{return;}
 }
 controller=new AbortController();scanning.value=true;error.value='';notice.value='';rows.value=[];selected.value=[];
 const known=new Set<string>();
 try{
  let page:number|null=1;
  while(page&&page<=5&&!controller.signal.aborted&&rows.value.length<100){
   const result:DiscoveredArticles=await request('/api/admin/imports/discover',{method:'POST',csrf:session.value!.csrf,body:{url:url.value.trim(),page},signal:controller.signal});
   if(!active||controller.signal.aborted)return;
   for(const item of result.items){if(known.has(item.url)||rows.value.length>=100)continue;known.add(item.url);rows.value.push({...item,status:'pending',error:'',warnings:[],key:crypto.randomUUID()});}
   page=result.nextPage;
  }
  notice.value=page?`已列出前 5 页的 ${rows.value.length} 篇文章，请分批处理。`:`找到 ${rows.value.length} 篇文章，可勾选后批量采集。`;
 }catch(cause){if(active)error.value=controller.signal.aborted?'扫描已停止':cause instanceof Error?cause.message:'目录读取失败';}
 finally{if(active)scanning.value=false;}
}
async function start(retry=false){
 if(working.value)return;
 const queue=retry?rows.value.filter(row=>row.status==='error'):selected.value.filter(row=>row.status!=='success');
 if(!queue.length){error.value='请先勾选要采集的文章';return;}
 controller=new AbortController();running.value=true;error.value='';const signal=controller.signal;
 try{
  await runImportQueue(queue,categoryId.value,signal,{
   collect:(source,signal)=>request<ImportedArticle>('/api/admin/imports',{method:'POST',csrf:session.value!.csrf,body:{url:source},signal}),
   save:(body,idempotencyKey,signal)=>request('/api/admin/posts',{method:'POST',csrf:session.value!.csrf,body,idempotencyKey,signal}),wait:waitForImport
  });
  if(active)notice.value=signal.aborted?'批量采集已停止；已保存的草稿保留。':'本批次处理完成，请在文章列表检查草稿后发布。';
 }finally{if(active){running.value=false;try{await store.refresh();}catch(cause){error.value=`草稿列表刷新失败，请重新打开文章列表：${cause instanceof Error?cause.message:'网络异常'}`;}}}
}
function stop(){controller?.abort();}
function beforeUnload(event:BeforeUnloadEvent){
 if(working.value||rows.value.some(row=>row.payload&&row.status!=='success')){event.preventDefault();event.returnValue='';}
}
onMounted(()=>window.addEventListener('beforeunload',beforeUnload));
onBeforeRouteLeave(async()=>{
 if(working.value||rows.value.some(row=>row.payload&&row.status!=='success')){
  try{await ElMessageBox.confirm('离开将停止采集并清除当前队列。已保存的草稿会保留；保存结果待确认的项目请先重试。','离开采集页面',{confirmButtonText:'停止并离开',cancelButtonText:'继续处理'});}catch{return false;}
 }
 stop();return true;
});
onBeforeUnmount(()=>{active=false;stop();window.removeEventListener('beforeunload',beforeUnload);});
</script>
<template>
 <PageTitle title="文章采集" description="输入站点首页，自动查找文章并批量保存为草稿。">
  <el-button :disabled="working" @click="router.push('/editor?import=1')">采集单篇文章</el-button>
 </PageTitle>
 <EleCard header="批量采集">
  <el-form label-position="top" :disabled="working" @submit.prevent="discover">
   <div class="import-form-grid">
    <el-form-item label="目标站网址"><el-input v-model="url" placeholder="请输入目标站的首页地址" aria-label="目标站网址" clearable/></el-form-item>
    <el-form-item label="保存到分类（可选）"><el-select v-model="categoryId" aria-label="批量采集分类" placeholder="不分配分类" clearable :value-on-clear="''" style="width:100%"><el-option label="不分配分类" value=""/><el-option v-for="cat in data.cats.filter(cat=>!cat.deletedAt)" :key="cat.id" :value="cat.id" :label="cat.name"/></el-select></el-form-item>
   </div>
   <p class="field-help">目前支持 rinfinity.net。输入首页即可读取文章目录；标题、标签、封面及正文图片会一并采集，图片下载到本站媒体库。分类默认留空，可统一选择或稍后逐篇修改。</p>
   <el-button native-type="submit" type="primary" :disabled="working||!url.trim()" :loading="scanning">查找文章</el-button>
  </el-form>
  <el-button v-if="scanning" type="danger" style="margin-top:12px" @click="stop">停止扫描</el-button>
  <el-alert v-if="error" :title="error" type="error" :closable="false" show-icon style="margin-top:16px"/>
  <el-alert v-if="notice" :title="notice" type="info" :closable="false" style="margin-top:16px"/>
 </EleCard>
 <EleCard v-if="rows.length" header="发现的文章" style="margin-top:16px">
  <div class="import-actions">
   <el-button :disabled="working" @click="selected=rows.filter(row=>row.status!=='success')">全选待处理</el-button>
   <el-button :disabled="working" @click="selected=[]">清空选择</el-button>
   <el-button type="primary" :disabled="working||!selected.length" :loading="running" @click="start()">采集所选（{{ selected.length }}）</el-button>
   <el-button v-if="failed" :disabled="working" @click="start(true)">重试失败（{{ failed }}）</el-button>
   <el-button v-if="working" type="danger" @click="stop">停止</el-button>
   <span role="status">已保存 {{ done }} / {{ rows.length }} 篇 · 失败 {{ failed }} 篇</span>
  </div>
  <el-progress :percentage="Math.round(done/rows.length*100)" :stroke-width="8" style="margin:16px 0"/>
  <el-table :data="rows" row-key="url">
   <el-table-column label="选择" width="65"><template #default="{row}"><el-checkbox :model-value="selected.includes(row)" :aria-label="`选择${row.title}`" :disabled="working||row.status==='success'" @change="(value:unknown)=>selected=value?[...selected,row]:selected.filter(item=>item.url!==row.url)"/></template></el-table-column>
   <el-table-column label="文章标题" min-width="260"><template #default="{row}"><div>{{ row.title }}</div><small class="muted">{{ row.url }}</small></template></el-table-column>
   <el-table-column label="状态" min-width="190"><template #default="{row}"><el-tag :type="row.status==='success'?'success':row.status==='error'?'danger':'info'">{{ statuses[row.status as ImportRow['status']] }}</el-tag><p v-if="row.error" class="import-error">{{ row.error }}</p><p v-if="row.warnings.length" class="field-help">{{ row.warnings.join(' ') }}</p></template></el-table-column>
   <el-table-column label="操作" width="100"><template #default="{row}"><el-button v-if="row.postId" link type="primary" :disabled="working" @click="router.push(`/editor/${row.postId}`)">编辑草稿</el-button></template></el-table-column>
  </el-table>
 </EleCard>
</template>
<style scoped>
.import-form-grid{display:grid;grid-template-columns:minmax(0,2fr) minmax(200px,1fr);gap:20px}.import-actions{display:flex;flex-wrap:wrap;align-items:center;gap:10px}.import-actions .el-button{margin:0}.import-error{color:var(--el-color-danger);font-size:12px;overflow-wrap:anywhere}.muted{overflow-wrap:anywhere}@media(max-width:700px){.import-form-grid{grid-template-columns:minmax(0,1fr);gap:0}}
</style>
