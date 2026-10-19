<script setup lang="ts">
import EleCard from "ele-admin-plus/es/ele-card";
import { useStudio } from "../store";
import { request } from "../../admin/api";
import PageTitle from "../shared/PageTitle.vue";
const store = useStudio(),
  { data, busy, session } = store;
async function upload(event: Event) {
  const target = event.target as HTMLInputElement,
    file = target.files?.[0];
  if (!file) return;
  await store.run(async () => {
    if (file.size > 5 * 1024 * 1024) throw new Error("图片不能超过 5MB");
    const body = new FormData();
    body.set("file", file);
    await request("/api/admin/media", {
      method: "POST",
      csrf: session.value!.csrf,
      body,
    });
    await store.refresh();
  }, "媒体已上传");
  target.value = "";
}
async function copy(id: string) {
  await store.run(
    () => navigator.clipboard.writeText(`/media/${id}`),
    "媒体路径已复制",
  );
}
</script>
<template>
  <PageTitle
    title="媒体库"
    description="上传图片后，可在文章、封面和站点标识中使用。"
  >
    <label class="upload-button primary">
      <span>上传图片</span>
      <input
        type="file"
        :disabled="busy"
        accept="image/png,image/jpeg,image/webp"
        @change="upload"
      />
    </label>
  </PageTitle>
  <EleCard>
    <div v-if="data.media.length" class="media-grid">
      <article v-for="item in data.media" :key="item.id">
        <el-image
          :src="`/media/${item.id}`"
          :alt="item.name"
          fit="cover"
          lazy
        />
        <strong>{{ item.name }}</strong>
        <span class="muted">
          {{ (item.size / 1024).toFixed(1) }} KB ·
          {{ item.createdAt.slice(0, 10) }}
        </span>
        <el-button link type="primary" @click="copy(item.id)">
          复制路径
        </el-button>
      </article>
    </div>
    <el-empty v-else description="还没有上传媒体" />
  </EleCard>
</template>
