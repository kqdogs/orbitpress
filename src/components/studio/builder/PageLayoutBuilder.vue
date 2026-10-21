<script setup lang="ts">
import {t} from '../../../lib/i18n/client';
import { computed,ref,toRaw,watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import EleCard from 'ele-admin-plus/es/ele-card';
import { Check, RefreshLeft, EditPen } from '@element-plus/icons-vue';
import { useSettingsDraft } from '../shared/settingsDraft';
import { blockName,createBlock,initialPageLayout,moveLayoutBlock,regionNames } from '../../../lib/page-layouts';
import type {LayoutBlock,LayoutRegion,PageLayout} from '../../../lib/schema';
import {pageLayoutsInput} from '../../../lib/schema';
import Preview from '../shared/Preview.vue';
import PageTitle from '../shared/PageTitle.vue';
import BlockLibrary from './BlockLibrary.vue';
import BlockList from './BlockList.vue';
import BlockFields from './BlockFields.vue';
import HomeBlockFields from './HomeBlockFields.vue';
import {useLayoutCanvas} from './useLayoutCanvas';
const props=defineProps<{target:string}>();
const {value,save,store}=useSettingsDraft(),{busy,data}=store,router=useRouter();
const key=props.target;
const layout=ref<PageLayout>(structuredClone(toRaw(initialPageLayout(value.value,key))));
const selected=ref(layout.value.main[0]?.id||''),tab=ref('blocks'),mobile=ref(false),postId=ref(''),restored=ref(false),announcement=ref('');
let hydrating=false;
watch(layout,current=>{
 if(hydrating)return;restored.value=false;value.value.pageLayouts[key]=JSON.parse(JSON.stringify(current));
},{deep:true,flush:'sync'});
const regions:LayoutRegion[]=['main','left','right'];
const selectedRegion=computed(()=>regions.find(region=>layout.value[region].some(block=>block.id===selected.value))||'main');
const activeBlock=computed({get:()=>layout.value[selectedRegion.value].find(b=>b.id===selected.value),set:(block:LayoutBlock|undefined)=>{if(!block)return;const list=layout.value[selectedRegion.value],index=list.findIndex(b=>b.id===selected.value);if(index>=0)list[index]=block;}});
const page=computed(()=>key.startsWith('page:')?data.pages.find(p=>p.id===key.slice(5)):undefined);
const title=computed(()=>key==='home'?t("首页装修"):key==='article'?t("文章模板装修"):key==='about'?t("关于页面装修"):key==='default'?t("独立页面默认模板"):t("装修：{0}", [page.value?.title||t("独立页面")]));
const previewSettings=computed(()=>{
 const settings={...value.value,pageLayouts:{...value.value.pageLayouts}};
 if(!restored.value)settings.pageLayouts[key]=layout.value;
 return settings;
});
const previewBody=computed(()=>({page:key==='home'?'home':key==='article'?'article':key==='about'?'about':'page',settings:previewSettings.value,builder:true,...(postId.value?{postId:postId.value}:{}),...(page.value?{pageId:page.value.id}:{})}));
const validation=computed(()=>{const result=pageLayoutsInput.safeParse(previewSettings.value.pageLayouts);return result.success?'':t(result.error.issues[0]?.message||"布局配置有误");});
function add(type:LayoutBlock['type'],region:LayoutRegion){
 void store.run(async()=>{
  if(layout.value[region].length>=(region==='main'?12:8))throw new Error(t("该区域的组件数量已达上限"));
  const block=createBlock(type,`block-${crypto.randomUUID()}`);layout.value[region].push(block);
  if(region!=='main'&&layout.value.sidebar!==region&&layout.value.sidebar!=='both')layout.value.sidebar=layout.value.sidebar==='none'?region:'both';
  selected.value=block.id;tab.value='blocks';announcement.value=t("已添加{0}，请保存布局", [blockName(block)]);
 });
}
function move(id:string,region:LayoutRegion,target?:string,after=false){
 void store.run(async()=>{
  layout.value=moveLayoutBlock(layout.value,id,region,target,after);
  if(region!=='main'&&layout.value.sidebar!==region&&layout.value.sidebar!=='both')layout.value.sidebar=layout.value.sidebar==='none'?region:'both';
  selected.value=id;announcement.value=t("组件位置已调整，请保存布局");
 });
}
function remove(){
 const block=activeBlock.value;if(!block||block.type==='content')return;
 layout.value[selectedRegion.value]=layout.value[selectedRegion.value].filter(b=>b.id!==block.id);
 selected.value=layout.value.main[0]?.id||'';announcement.value=t("组件已从草稿移除，请保存布局");
}
async function restore(){
 try{await ElMessageBox.confirm(t("将布局恢复为继承模板或原始布局？页面正文不受影响，保存后生效。"),t("恢复布局"),{confirmButtonText:t("恢复布局"),cancelButtonText:t("取消"),type:'warning'});}catch{return;}
 delete value.value.pageLayouts[key];hydrating=true;
 layout.value=structuredClone(toRaw(initialPageLayout(value.value,key)));selected.value=layout.value.main[0]?.id||'';hydrating=false;restored.value=true;
 announcement.value=t("已恢复继承或原始布局，请保存");
}
async function commit(){await store.run(async()=>{if(validation.value)throw new Error(validation.value);if(!restored.value)value.value.pageLayouts[key]=layout.value;await save();},t("页面布局已保存"));}
const bindCanvas=useLayoutCanvas(selected,layout,busy,move);
</script>
<template>
 <PageTitle :title="title" :description="key==='home'?t('从组件库添加首页区块或通用组件，拖动调整位置，实时预览效果。'):t('从组件库添加组件，拖动调整正文与左右侧栏。正文仍由页面编辑器管理。')">
  <el-button v-if="page" :icon="EditPen" :disabled="busy" @click="router.push(`/page-editor/${page.id}`)"> {{ t("编辑正文") }} </el-button>
  <el-button :icon="RefreshLeft" :disabled="busy" @click="restore"> {{ t("恢复默认") }} </el-button>
  <el-switch v-model="mobile" :active-text="t('手机')" :aria-label="t('手机预览')"/>
  <el-button type="primary" :icon="Check" :loading="busy" @click="commit"> {{ t("保存布局") }} </el-button>
 </PageTitle>
 <el-alert v-if="validation" :title="validation" type="error" :closable="false" class="layout-validation"/>
 <div class="visual-builder page-layout-builder">
  <EleCard class="builder-outline builder-block-browser">
   <el-tabs v-model="tab" stretch>
    <el-tab-pane :label="t('列表视图')" name="blocks">
     <BlockList v-for="region in regions" :key="region" :region="region" :title="t(regionNames[region])" :blocks="layout[region]" :selected="selected" :disabled="busy" @select="selected=$event" @move="move"/>
     <p class="field-help"> {{ t("支持跨区域拖动，画布可用 Alt + ↑ / ↓ 排序。隐藏侧栏仍保留组件。") }} </p>
    </el-tab-pane>
    <el-tab-pane :label="t('组件库')" name="library"><BlockLibrary :disabled="busy" :home="key==='home'" @add="add"/></el-tab-pane>
   </el-tabs>
   <p role="status" class="field-help">{{ announcement }}</p>
  </EleCard>
  <div class="builder-canvas">
   <Preview :body="previewBody" endpoint="/admin/page-preview" :mobile="mobile" @load="bindCanvas"/>
  </div>
  <EleCard class="builder-properties" :header="t('页面与组件设置')">
   <el-form label-position="top" :disabled="busy">
    <el-form-item :label="t('侧栏布局')"><el-select v-model="layout.sidebar" :aria-label="t('侧栏布局')"><el-option v-for="item in [{value:'none',label:t('无侧栏')},{value:'left',label:t('左侧栏')},{value:'right',label:t('右侧栏')},{value:'both',label:t('双侧栏')}]" :key="item.value" :label="item.label" :value="item.value"/></el-select></el-form-item>
    <el-form-item :label="t('页面宽度')"><el-radio-group v-model="layout.width"><el-radio value="standard"> {{ t("标准") }} </el-radio><el-radio value="wide"> {{ t("宽屏") }} </el-radio></el-radio-group></el-form-item>
    <el-form-item v-if="key==='article'" :label="t('选择示例文章')"><el-select v-model="postId" clearable :placeholder="t('自动选择最新文章')"><el-option v-for="post in data.posts.filter(p=>p.status==='published')" :key="post.id" :value="post.id" :label="post.title"/></el-select></el-form-item>
   </el-form>
   <el-divider content-position="left">{{ activeBlock?blockName(activeBlock):t("选择组件") }}</el-divider>
   <BlockFields v-if="activeBlock" v-model="activeBlock" :region="selectedRegion" :disabled="busy" :media="data.media" @move="move(selected,$event)" @remove="remove"/>
   <HomeBlockFields v-if="activeBlock?.type.startsWith('home-')" v-model="value" :type="activeBlock.type" :disabled="busy" :posts="data.posts" :categories="data.cats"/>
   <el-divider v-if="key==='article'||key==='about'"/>
   <el-form v-if="key==='article'" label-position="top" :disabled="busy">
    <el-form-item :label="t('文章眉题')"><el-input v-model="value.articleDesign.bannerEyebrow" maxlength="40"/></el-form-item>
    <el-form-item :label="t('正文字号')"><el-input-number v-model="value.articleDesign.fontSize" :min="14" :max="18"/></el-form-item>
    <el-checkbox v-model="value.articleDesign.showTags"> {{ t("显示文章标签") }} </el-checkbox><el-checkbox v-model="value.articleDesign.showAuthor"> {{ t("显示文末作者") }} </el-checkbox>
   </el-form>
   <el-form v-if="key==='about'" label-position="top" :disabled="busy">
    <el-form-item :label="t('关于页面标题')"><el-input v-model="value.aboutDesign.title" maxlength="80"/></el-form-item>
    <el-form-item :label="t('眉题')"><el-input v-model="value.aboutDesign.eyebrow" maxlength="40"/></el-form-item>
    <el-form-item :label="t('简介')"><el-input v-model="value.aboutDesign.lead" type="textarea" maxlength="180"/></el-form-item>
    <el-form-item :label="t('关于正文（Markdown）')"><el-input v-model="value.aboutDesign.body" type="textarea" :rows="10" maxlength="20000"/></el-form-item>
   </el-form>
  </EleCard>
 </div>
</template>
