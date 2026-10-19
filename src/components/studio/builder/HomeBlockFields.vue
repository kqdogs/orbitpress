<script setup lang="ts">
import type { Category, LayoutBlock, Post, Settings } from '../../../lib/schema';
import CommunityCardFields from '../shared/CommunityCardFields.vue';
const settings=defineModel<Settings>({required:true});
defineProps<{type:LayoutBlock['type'];disabled?:boolean;posts:Post[];categories:Category[]}>();
</script>
<template>
 <el-divider content-position="left">首页组件数据</el-divider>
 <p class="field-help">同类首页组件共用以下数据设置，标题、副标题、位置和显隐可分别编辑。</p>
 <el-form label-position="top" :disabled="disabled">
  <template v-if="type==='home-hero'">
   <el-form-item label="首屏推荐文章"><el-select v-model="settings.homeOptions.featuredPostId" clearable filterable placeholder="自动选择"><el-option label="自动选择" value=""/><el-option v-for="post in posts.filter(p=>p.status==='published')" :key="post.id" :label="post.title" :value="post.id"/></el-select></el-form-item>
   <el-form-item label="首屏眉题"><el-input v-model="settings.homeHero.eyebrow" maxlength="40"/></el-form-item>
   <el-form-item label="首屏标题覆盖"><el-input v-model="settings.homeHero.title" maxlength="100" placeholder="留空使用文章标题"/></el-form-item>
   <CommunityCardFields v-model="settings" :disabled="disabled"/>
   <el-divider>新手引导步骤</el-divider>
   <div v-for="(step,i) in settings.homeOptions.steps" :key="i" class="builder-step">
    <el-form-item :label="`步骤 ${i+1} 标题`"><el-input v-model="step.title" maxlength="60"/></el-form-item>
    <el-form-item label="说明"><el-input v-model="step.description" maxlength="120"/></el-form-item>
    <el-form-item label="链接"><el-input v-model="step.href"/></el-form-item>
    <el-button type="danger" link @click="settings.homeOptions.steps.splice(i,1)">移除步骤</el-button>
   </div>
   <el-button :disabled="settings.homeOptions.steps.length>=8" @click="settings.homeOptions.steps.push({title:'新步骤',description:'',href:'/tutorials/'})">添加步骤</el-button>
  </template>
  <el-form-item v-if="type==='home-promo'" label="横幅链接"><el-input v-model="settings.homeOptions.promoHref"/></el-form-item>
  <el-form-item v-if="type==='home-categories'" label="首页分类（留空显示默认分类）"><el-select v-model="settings.homeOptions.categoryIds" multiple filterable><el-option v-for="cat in categories.filter(c=>!c.deletedAt)" :key="cat.id" :label="cat.name" :value="cat.id"/></el-select></el-form-item>
  <template v-if="type==='home-videos'">
   <el-form-item label="卡片列数"><el-select v-model="settings.homeOptions.columns"><el-option v-for="n in [2,3,4]" :key="n" :label="`${n} 列`" :value="n"/></el-select></el-form-item>
   <el-form-item label="视频数量"><el-input-number v-model="settings.homeOptions.videoLimit" :min="1" :max="12"/></el-form-item>
  </template>
  <el-form-item v-if="type==='home-tutorials'" label="图文数量"><el-input-number v-model="settings.homeOptions.tutorialLimit" :min="1" :max="12"/></el-form-item>
  <el-form-item v-if="type==='home-notice'" label="公告内容"><el-input v-model="settings.notice" type="textarea" maxlength="180"/></el-form-item>
 </el-form>
</template>
