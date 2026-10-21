<script setup lang="ts">
import {t} from '../../../lib/i18n/client';
import type { Settings } from "../../../lib/schema";
const model = defineModel<Settings["headerNav"]>({ required: true });
withDefaults(defineProps<{compact?:boolean;minItems?:number}>(),{minItems:0});
function move(index: number, offset: number) {
  const rows = [...model.value],
    target = index + offset;
  if (target < 0 || target >= rows.length) return;
  [rows[index], rows[target]] = [rows[target], rows[index]];
  model.value = rows;
}
</script>
<template>
  <div>
    <div v-for="(item, index) in model" :key="index" class="navigation-row">
      <el-input
        v-model="item.label"
        :aria-label="t('导航名称')"
        :placeholder="t('名称')"
        maxlength="30"
      />
      <el-input
        v-model="item.href"
        :aria-label="t('导航链接')"
        :placeholder="t('本站路径或 HTTPS 链接')"
      />
      <el-input
        v-if="!compact"
        v-model="item.badge"
        :aria-label="t('导航徽标')"
        :placeholder="t('徽标')"
        maxlength="10"
      />
      <el-checkbox v-if="!compact" v-model="item.accent"> {{ t("突出") }} </el-checkbox>
      <el-button
        :disabled="index === 0"
        :aria-label="t('上移导航')"
        @click="move(index, -1)"
      >
        ↑
      </el-button>
      <el-button
        :disabled="index === model.length - 1"
        :aria-label="t('下移导航')"
        @click="move(index, 1)"
      >
        ↓
      </el-button>
      <el-button
        type="danger"
        link
        :disabled="model.length <= minItems"
        @click="model.splice(index, 1)"
      > {{ t("删除") }} </el-button>
    </div>
    <el-button
      :disabled="model.length >= 12"
      @click="model.push({ label: t('新导航'), href: '/' })"
    > {{ t("添加导航") }} </el-button>
  </div>
</template>
