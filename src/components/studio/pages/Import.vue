<script setup lang="ts">
import {useRouter} from 'vue-router';
import EleCard from 'ele-admin-plus/es/ele-card';
import PageTitle from '../shared/PageTitle.vue';
const router=useRouter();
</script>
<template>
 <PageTitle title="文章采集" description="将 rinfinity.net 的单篇文章采集到编辑器，检查后保存或发布。"/>
 <EleCard header="采集单篇文章">
  <p>点击下方按钮，粘贴文章的完整地址。可读取标题、正文、封面、代码块和视频。</p>
  <p class="field-help">采集后先进入未保存草稿；请检查内容、来源和分类，再决定是否发布。不会覆盖已有文章。</p>
  <el-button type="primary" @click="router.push('/editor?import=1')">输入文章地址并采集</el-button>
 </EleCard>
</template>
