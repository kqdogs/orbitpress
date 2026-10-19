<script setup lang="ts">
import {computed} from 'vue';
import * as icons from '@element-plus/icons-vue';
import {elementCategoryIcon} from '../lib/category-icons';
const props=withDefaults(defineProps<{name:string;size?:number}>(),{size:22});
const icon=computed(()=>icons[(elementCategoryIcon(props.name)||'Position') as keyof typeof icons]);
</script>
<template><component :is="icon" :width="size" :height="size" fill="currentColor" aria-hidden="true"/></template>
