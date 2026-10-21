<script setup lang="ts">
import {ElMessageBox} from 'element-plus';
import {locales,localeNames,type Locale} from '../../../lib/i18n';
import {changeLocale,currentLocale,t} from '../../../lib/i18n/client';
const props=defineProps<{dirty?:boolean;disabled?:boolean}>();
const emit=defineEmits<{beforeReload:[]}>();
async function change(locale:Locale){
 if(locale===currentLocale())return;
 if(props.dirty){
  try{await ElMessageBox.confirm(t('切换语言会重新加载页面，未保存的修改将丢失。'),t('切换语言'),{confirmButtonText:t('切换语言'),cancelButtonText:t('继续编辑'),type:'warning'});}catch{return;}
 }
 emit('beforeReload');
 changeLocale(locale);
}
</script>
<template>
 <el-dropdown :disabled="disabled" @command="change">
  <button class="language-switch" type="button" :aria-label="t('切换语言')">{{ currentLocale()==='en'?'EN':'中文' }} <span aria-hidden="true">⌄</span></button>
  <template #dropdown><el-dropdown-menu><el-dropdown-item v-for="locale in locales" :key="locale" :command="locale" :disabled="locale===currentLocale()">{{ localeNames[locale] }}</el-dropdown-item></el-dropdown-menu></template>
 </el-dropdown>
</template>
<style scoped>.language-switch{border:0;background:transparent;color:inherit;cursor:pointer;font:inherit;padding:6px;white-space:nowrap}</style>
