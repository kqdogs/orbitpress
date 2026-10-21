<script setup lang="ts">
import {t} from '../../../lib/i18n/client';
import { computed } from 'vue';
import type { LayoutBlock, LayoutRegion } from '../../../lib/schema';
import { blockName } from '../../../lib/page-layouts';
import { Rank, ArrowUp, ArrowDown } from '@element-plus/icons-vue';
const props=defineProps<{blocks:LayoutBlock[];region:LayoutRegion;title:string;selected:string;disabled?:boolean}>();
const emit=defineEmits<{select:[id:string];move:[id:string,region:LayoutRegion,target?:string,after?:boolean]}>();
const selectedIndex=computed(()=>props.blocks.findIndex(item=>item.id===props.selected));
const transferType='application/x-blog-layout-block';
function drop(event:DragEvent,target?:LayoutBlock){
 event.preventDefault();event.stopPropagation();
 const id=event.dataTransfer?.getData(transferType);if(!id||props.disabled)return;
 const rect=(event.currentTarget as HTMLElement).getBoundingClientRect();
 emit('move',id,props.region,target?.id,!!target&&event.clientY>rect.top+rect.height/2);
}
function drag(event:DragEvent,id:string){event.dataTransfer?.setData(transferType,id);if(event.dataTransfer)event.dataTransfer.effectAllowed='move';}
</script>
<template>
 <section class="builder-block-area" @dragover.prevent @drop="drop($event)">
  <h3>{{ title }} <small>{{ blocks.length }}</small></h3>
  <div class="builder-section-list">
   <button v-for="block in blocks" :key="block.id" :class="{selected:selected===block.id}" :draggable="!disabled" :disabled="disabled" type="button" @click="emit('select',block.id)" @dragstart="drag($event,block.id)" @dragover.prevent @drop="drop($event,block)">
    <el-icon><Rank/></el-icon><span>{{ blockName(block) }}</span><small>{{ block.type==='content'?t("正文"):block.enabled?t("显示"):t("隐藏") }}</small>
   </button>
  </div>
  <p v-if="!blocks.length" class="builder-area-empty"> {{ t("拖入组件，或从组件库添加") }} </p>
  <div v-if="selectedIndex>=0" class="builder-order-actions">
   <el-button :icon="ArrowUp" size="small" :disabled="disabled||selectedIndex===0" :aria-label="t('上移组件')" @click="emit('move',selected,region,blocks[selectedIndex-1].id)"> {{ t("上移") }} </el-button>
   <el-button :icon="ArrowDown" size="small" :disabled="disabled||selectedIndex===blocks.length-1" :aria-label="t('下移组件')" @click="emit('move',selected,region,blocks[selectedIndex+1].id,true)"> {{ t("下移") }} </el-button>
  </div>
 </section>
</template>
