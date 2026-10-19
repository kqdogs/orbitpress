<script setup lang="ts">
import {computed} from 'vue';
import EleIconSelect from 'ele-admin-plus/es/ele-icon-select';
import CategoryIcon from '../../CategoryIcon.vue';
import {categoryIconGroups} from '../../../lib/category-icons';
import {navigationHref,type Settings} from '../../../lib/schema';
import {resolveCommunityCard,type CommunityCard} from '../../../lib/community-card';
const settings=defineModel<Settings>({required:true});
defineProps<{disabled?:boolean}>();
const card=computed(()=>resolveCommunityCard(settings.value));
const icons=[{title:'社群图标',icons:['telegram']},...categoryIconGroups];
const hrefError=computed(()=>navigationHref.safeParse(card.value.href).success?'':'请输入本站路径或 HTTPS 链接');
function update(patch:Partial<CommunityCard>){settings.value.communityCard={...card.value,...patch};}
</script>
<template>
 <el-divider content-position="left">首页交流群卡片</el-divider>
 <p class="field-help">对应首页新手引导下方的深色卡片，与首页装修共用设置。</p>
 <el-form-item label="显示交流群卡片"><el-switch :model-value="card.enabled" aria-label="显示交流群卡片" :disabled="disabled" @update:model-value="update({enabled:Boolean($event)})"/></el-form-item>
 <el-form-item label="交流群标题"><el-input :model-value="card.title" aria-label="交流群标题" maxlength="120" :disabled="disabled" @update:model-value="update({title:$event})"/></el-form-item>
 <el-form-item label="交流群说明"><el-input :model-value="card.description" aria-label="交流群说明" maxlength="180" :disabled="disabled" @update:model-value="update({description:$event})"/></el-form-item>
 <el-form-item label="交流群图标">
  <EleIconSelect :model-value="card.icon" :data="icons" :disabled="disabled" filterable="popper" :tooltip="'static'" :popper-width="520" :popper-height="380" placeholder="选择交流群图标" filter-placeholder="搜索图标，例如 Chat、Star、Position" :popper-options="{strategy:'fixed'}" @update:model-value="update({icon:$event})">
   <template #icon="{icon}"><el-icon :size="20"><svg v-if="icon==='telegram'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 11 18-8-4 18-6-6-4 3 1-6 9-6-11 7z"/></svg><CategoryIcon v-else :name="icon" :size="20"/></el-icon></template>
  </EleIconSelect>
 </el-form-item>
 <el-form-item label="加入按钮文字"><el-input :model-value="card.buttonLabel" aria-label="加入按钮文字" maxlength="20" :disabled="disabled" @update:model-value="update({buttonLabel:$event})"/></el-form-item>
 <el-form-item label="交流群链接" :error="hrefError"><el-input :model-value="card.href" aria-label="交流群链接" maxlength="180" placeholder="https://t.me/… 或 /about/" :disabled="disabled" @update:model-value="update({href:$event})"/></el-form-item>
 <el-button link :disabled="disabled||settings.communityCard===null" @click="settings.communityCard=null">恢复跟随站点信息</el-button>
</template>
