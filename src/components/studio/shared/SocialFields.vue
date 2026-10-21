<script setup lang="ts">
import {t} from '../../../lib/i18n/client';
import type { Settings } from "../../../lib/schema";
const model = defineModel<Settings>({ required: true });
const fields = [
  { key: "youtube", label: "YouTube" },
  { key: "bilibili", label: t("哔哩哔哩") },
  { key: "twitter", label: "X" },
  { key: "telegram", label: "Telegram" },
] as const;
</script>
<template>
  <div>
    <el-form-item v-for="field in fields" :key="field.key" :label="field.label">
      <el-input v-model="model[field.key]" :placeholder="t('HTTPS 链接，留空隐藏')" />
    </el-form-item>
  </div>
</template>
