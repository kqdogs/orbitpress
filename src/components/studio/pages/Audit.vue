<script setup lang="ts">
import EleCard from "ele-admin-plus/es/ele-card";
import { useStudio } from "../store";
import PageTitle from "../shared/PageTitle.vue";
const { data, loading } = useStudio();
</script>
<template>
  <PageTitle
    title="操作记录"
    description="查看最近 100 条内容、密钥和管理操作记录。"
  />
  <EleCard>
    <el-table :data="data.audit" v-loading="loading" row-key="id">
      <el-table-column prop="createdAt" label="时间" min-width="180" />
      <el-table-column
        prop="actor"
        label="操作人"
        min-width="170"
        show-overflow-tooltip
      />
      <el-table-column prop="action" label="动作" min-width="140" />
      <el-table-column
        prop="resourceId"
        label="对象"
        min-width="220"
        show-overflow-tooltip
      />
    </el-table>
  </EleCard>
</template>
