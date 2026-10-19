<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import EleCard from "ele-admin-plus/es/ele-card";
import { useStudio } from "../store";
import { request } from "../../admin/api";
import { postInput, type Post } from "../../../lib/schema";
import PageTitle from "../shared/PageTitle.vue";
const store = useStudio(),
  { data, busy, session } = store,
  router = useRouter();
const quick = ref({
  title: "",
  slug: "",
  body: "",
  categoryId: data.cats.find((cat) => !cat.deletedAt)?.id || "",
});
const stats = computed(() => [
  {
    label: "已发布文章",
    value: data.posts.filter((p) => p.status === "published").length,
  },
  {
    label: "草稿",
    value: data.posts.filter((p) => p.status === "draft").length,
  },
  {
    label: "独立页面",
    value: data.pages.filter((p) => p.status !== "trash").length,
  },
  { label: "分类目录", value: data.cats.filter((p) => !p.deletedAt).length },
]);
async function save() {
  await store.run(async () => {
    const input = postInput.parse({
      ...quick.value,
      excerpt: "",
      cover: "",
      videoId: "",
      featured: false,
      tags: [],
    });
    const post = await request<Post>("/api/admin/posts", {
      method: "POST",
      csrf: session.value!.csrf,
      idempotent: true,
      body: input,
    });
    await store.refresh();
    await router.push(`/editor/${post.id}`);
  }, "快速草稿已保存");
}
</script>
<template>
  <PageTitle
    title="概览"
    :description="`欢迎回来，${session?.username}。从这里开始今天的创作。`"
  >
    <el-button type="primary" @click="router.push('/editor')">
      新建文章
    </el-button>
    <el-button @click="router.push('/page-editor')">新建页面</el-button>
  </PageTitle>
  <div class="stat-grid">
    <EleCard v-for="stat in stats" :key="stat.label">
      <span class="muted">{{ stat.label }}</span>
      <div class="stat-value">{{ stat.value }}</div>
    </EleCard>
  </div>
  <div class="dashboard-grid">
    <EleCard header="最近内容">
      <el-table
        :data="data.posts.filter((p) => p.status !== 'trash').slice(0, 8)"
      >
        <el-table-column label="标题" min-width="200">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              @click="router.push(`/editor/${row.id}`)"
            >
              {{ row.title }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'">
              {{ row.status === "published" ? "已发布" : "草稿" }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </EleCard>
    <EleCard header="快速草稿">
      <el-form label-position="top" :disabled="busy" @submit.prevent="save">
        <el-form-item label="标题">
          <el-input
            v-model="quick.title"
            placeholder="你的新想法"
            maxlength="180"
          />
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="quick.slug" placeholder="my-new-post" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="quick.categoryId" class="full-width">
            <el-option
              v-for="cat in data.cats.filter((c) => !c.deletedAt)"
              :key="cat.id"
              :value="cat.id"
              :label="cat.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="正文">
          <el-input
            v-model="quick.body"
            type="textarea"
            :rows="4"
            placeholder="写下灵感，稍后完善……"
          />
        </el-form-item>
        <el-button native-type="submit" type="primary" :loading="busy">
          保存并继续编辑
        </el-button>
      </el-form>
    </EleCard>
  </div>
</template>
