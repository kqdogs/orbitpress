<script setup lang="ts">
import type { LayoutBlock, LayoutRegion } from '../../../lib/schema';
import { regionNames } from '../../../lib/page-layouts';
import { Delete, Plus } from '@element-plus/icons-vue';
const block=defineModel<LayoutBlock>({required:true});
defineProps<{region:LayoutRegion;disabled?:boolean;media:{id:string;name:string}[]}>();
const emit=defineEmits<{move:[region:LayoutRegion];remove:[]}>();
function setLink(index:number,field:'label'|'href',value:string){block.value={...block.value,links:block.value.links.map((link,i)=>i===index?{...link,[field]:value}:link)};}
</script>
<template>
 <el-form label-position="top" :disabled="disabled" class="block-properties-form">
  <el-alert v-if="block.type==='content'" title="这里显示页面编辑器中的正文，装修不会覆盖原文。" type="info" :closable="false"/>
  <template v-else>
   <el-form-item label="显示组件"><el-switch v-model="block.enabled"/></el-form-item>
   <el-form-item label="放置位置">
    <el-select :model-value="region" aria-label="组件放置位置" @change="emit('move',$event)"><el-option v-for="(name,key) in regionNames" :key="key" :label="name" :value="key"/></el-select>
   </el-form-item>
   <el-form-item v-if="block.type!=='divider'" label="组件标题"><el-input v-model="block.title" maxlength="80"/></el-form-item>
   <el-form-item v-if="block.type.startsWith('home-')" label="组件副标题"><el-input v-model="block.text" type="textarea" :rows="3" maxlength="180"/></el-form-item>
   <el-form-item v-if="block.type==='heading'" label="标题级别"><el-radio-group v-model="block.level"><el-radio :value="2">H2</el-radio><el-radio :value="3">H3</el-radio></el-radio-group></el-form-item>
   <el-form-item v-if="['markdown','notice','author','image','button','search'].includes(block.type)" :label="block.type==='button'?'按钮文字':block.type==='image'?'图片说明':block.type==='search'?'搜索占位文字':'组件内容'">
    <el-input v-model="block.text" :type="['button','search'].includes(block.type)?'text':'textarea'" :rows="block.type==='markdown'?10:4" maxlength="6000" show-word-limit/>
    <p v-if="block.type==='markdown'" class="field-help">支持 Markdown 排版和原有 YouTube / 哔哩哔哩嵌入语法。</p>
   </el-form-item>
   <template v-if="block.type==='image'">
    <el-form-item label="媒体库图片"><el-select v-model="block.image" clearable filterable allow-create placeholder="选择或填写本站图片路径"><el-option v-for="item in media" :key="item.id" :label="item.name" :value="`/media/${item.id}`"/></el-select></el-form-item>
    <el-form-item label="图片替代文字"><el-input v-model="block.alt" maxlength="160"/></el-form-item>
    <p class="field-help">仅支持 /media/ 或 /images/ 的本站图片。</p>
   </template>
   <el-form-item v-if="block.type==='button'" label="按钮链接"><el-input v-model="block.href" placeholder="/tutorials/ 或 https://…"/></el-form-item>
   <el-form-item v-if="['latest','categories'].includes(block.type)" label="显示数量"><el-input-number v-model="block.limit" :min="1" :max="8"/></el-form-item>
   <template v-if="block.type==='links'">
    <div v-for="(link,i) in block.links" :key="i" class="block-link-fields">
     <el-form-item :label="`链接 ${i+1} 名称`"><el-input :model-value="link.label" maxlength="60" @update:model-value="setLink(i,'label',$event)"/></el-form-item>
     <el-form-item label="链接地址"><el-input :model-value="link.href" @update:model-value="setLink(i,'href',$event)"/></el-form-item>
     <el-button type="danger" link :icon="Delete" @click="block.links=block.links.filter((_,index)=>index!==i)">移除链接</el-button>
    </div>
    <el-button :icon="Plus" :disabled="disabled||block.links.length>=8" @click="block.links=[...block.links,{label:'新链接',href:'/'}]">添加链接</el-button>
   </template>
   <el-divider/>
   <el-button type="danger" plain :icon="Delete" @click="emit('remove')">移除组件</el-button>
  </template>
 </el-form>
</template>
