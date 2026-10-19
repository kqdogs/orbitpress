<script setup lang="ts">
import {ref} from 'vue';
const model=defineModel<string[]>({required:true});
const props=withDefaults(defineProps<{label:string;max:number;maxLength:number;disabled?:boolean;suggestions?:string[];warning?:boolean}>(),{suggestions:()=>[]});
const emit=defineEmits<{change:[]}>();
const pending=ref(''),error=ref('');
function add(values=pending.value):boolean {
 const next=[...model.value], seen=new Set(next.map(value=>value.toLocaleLowerCase()));
 const incoming=values.split(/[,，\n]/).map(value=>value.trim()).filter(Boolean);
 if(!incoming.length){error.value='';return true;}
 for(const value of incoming){
  if(value.length>props.maxLength){error.value='每项最多 '+props.maxLength+' 个字符';return false;}
  if(seen.has(value.toLocaleLowerCase()))continue;
  if(next.length>=props.max){error.value='最多添加 '+props.max+' 项';return false;}
  next.push(value);seen.add(value.toLocaleLowerCase());
 }
 model.value=next;pending.value='';error.value='';return true;
}
function remove(index:number){model.value=model.value.filter((_,position)=>position!==index);error.value='';}
function inputChanged(){error.value='';emit('change');}
function addSuggestion(term:string){add(pending.value?pending.value+','+term:term);}
function prepare(){if(!add())throw new Error(props.label+'：'+error.value);}
defineExpose({prepare});
</script>
<template>
 <div class="term-input">
  <div class="term-entry">
   <el-input v-model="pending" :aria-label="label+'输入'" :disabled="disabled||model.length>=max" :placeholder="'输入后回车或点添加'" @keydown.enter.prevent="add()" @input="inputChanged"/>
   <el-button :disabled="disabled||!pending.trim()||model.length>=max" @click="add()">添加</el-button>
  </div>
  <p v-if="error" class="term-error" role="alert">{{error}}</p>
  <div v-if="model.length" class="term-chips" :aria-label="label+'列表'">
   <el-tag v-for="(value,index) in model" :key="value" :type="warning?'warning':'info'" :closable="!disabled" disable-transitions @close="remove(index)">{{value}}</el-tag>
  </div>
  <p class="field-help">逗号分隔可批量添加；{{model.length}} / {{max}}，每项最多 {{maxLength}} 个字符。</p>
  <div v-if="suggestions.length" class="term-suggestions">
   <span>常用标签</span>
   <el-button v-for="term in suggestions.filter(value=>!model.some(tag=>tag.toLocaleLowerCase()===value.toLocaleLowerCase())).slice(0,12)" :key="term" link :disabled="disabled||model.length>=max" @click="addSuggestion(term)">{{term}}</el-button>
  </div>
 </div>
</template>
<style scoped>
.term-input{width:100%;min-width:0}.term-entry{display:flex;gap:8px}.term-entry .el-input{min-width:0}.term-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}.term-chips :deep(.el-tag){max-width:100%;height:auto;min-height:26px;white-space:normal;overflow-wrap:anywhere}.term-error{font-size:12px;color:var(--el-color-danger);margin:6px 0}.term-suggestions{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;font-size:12px}.term-suggestions>span{width:100%;color:var(--el-text-color-secondary)}
</style>
