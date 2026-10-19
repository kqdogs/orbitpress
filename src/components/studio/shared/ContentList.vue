<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import EleCard from "ele-admin-plus/es/ele-card";
import { request } from "../../admin/api";
import { useStudio } from "../store";
import type { Post, Page } from "../../../lib/schema";
import { postPath } from "../../../lib/permalinks";
import PageTitle from "./PageTitle.vue";
const props = defineProps<{ kind: "posts" | "pages" }>();
const store = useStudio(),
  { data, busy, loading, session } = store,
  router = useRouter();
const filter = ref("all"),
  search = ref(""),
  selected = ref<Array<Post | Page>>([]),
  category = ref(""),
  page = ref(1);
const isPage = computed(() => props.kind === "pages"),
  label = computed(() => (isPage.value ? "页面" : "文章")),
  items = computed<Array<Post | Page>>(() =>
    isPage.value ? data.pages : data.posts,
  ),
  visible = computed(() =>
    items.value.filter(
      (item) =>
        (filter.value === "all"
          ? item.status !== "trash"
          : item.status === filter.value) &&
        item.title.toLowerCase().includes(search.value.toLowerCase()) &&
        (!category.value ||
          ("categoryId" in item && item.categoryId === category.value)),
    ),
  );
watch(
  () => visible.value.length,
  () => {
    page.value = Math.max(
      1,
      Math.min(page.value, Math.ceil(visible.value.length / 15)),
    );
  },
);
const shown = computed(() =>
  visible.value.slice((page.value - 1) * 15, page.value * 15),
);
function statusLabel(status: string) {
  return (
    (
      { published: "已发布", draft: "草稿", trash: "回收站" } as Record<
        string,
        string
      >
    )[status] || status
  );
}
function edit(item?: Post | Page) {
  void router.push(
    `/${isPage.value ? "page-editor" : "editor"}${item ? `/${item.id}` : ""}`,
  );
}
function href(item: Post | Page) {
  return "categoryId" in item && data.settings
    ? postPath(item, data.settings.value)
    : `/${item.slug}/`;
}
async function transition(item: Post | Page, action: "trash" | "restore") {
  if (action === "trash") {
    try {
      await ElMessageBox.confirm(
        `将“${item.title}”移到回收站？可随时恢复。`,
        "移到回收站",
        {
          type: "warning",
          confirmButtonText: "移到回收站",
          cancelButtonText: "取消",
        },
      );
    } catch {
      return;
    }
  }
  await store.run(
    async () => {
      await request(`/api/admin/${props.kind}/${item.id}/${action}`, {
        method: "POST",
        csrf: session.value!.csrf,
        body: { version: item.version },
        idempotent: true,
      });
      await store.refresh();
      selected.value = [];
    },
    action === "trash" ? "已移到回收站" : "已恢复为草稿",
  );
}
async function bulk() {
  if (!selected.value.length) return;
  const action = filter.value === "trash" ? "restore" : "trash";
  try {
    await ElMessageBox.confirm(
      `确认${action === "trash" ? "移到回收站" : "恢复"}选中的 ${selected.value.length} 项内容？`,
      "批量操作",
      { type: "warning" },
    );
  } catch {
    return;
  }
  await store.run(async () => {
    try {
      for (const item of selected.value)
        await request(`/api/admin/${props.kind}/${item.id}/${action}`, {
          method: "POST",
          csrf: session.value!.csrf,
          body: { version: item.version },
          idempotent: true,
        });
    } finally {
      selected.value = [];
      await store.refresh();
    }
  }, "批量操作已完成");
}
async function loadMore() {
  await store.run(async () => {
    const result = await request<{ items: Post[]; nextCursor: string | null }>(
      `/api/admin/posts?limit=100&cursor=${encodeURIComponent(data.nextCursor!)}`,
    );
    data.posts.push(
      ...result.items.filter(
        (post) => !data.posts.some((value) => value.id === post.id),
      ),
    );
    data.nextCursor = result.nextCursor;
  });
}
</script>
<template>
  <PageTitle
    :title="`所有${label}`"
    :description="
      isPage
        ? '管理关于、联系等独立页面，自定义路径与发布状态。'
        : '整理你的图文与视频内容。删除的内容可从回收站恢复。'
    "
  >
    <el-button type="primary" @click="edit()">新建{{ label }}</el-button>
  </PageTitle>
  <EleCard>
    <div class="wp-list-tabs">
      <button
        v-for="[value, name] in [
          ['all', '全部'],
          ['published', '已发布'],
          ['draft', '草稿'],
          ['trash', '回收站'],
        ]"
        :key="value"
        :class="{ active: filter === value }"
        @click="
          filter = value;
          page = 1;
        "
      >
        {{ name }}
        <span>
          ({{
            items.filter((item) =>
              value === "all" ? item.status !== "trash" : item.status === value,
            ).length
          }})
        </span>
      </button>
    </div>
    <div class="wp-list-tools">
      <div>
        <el-button :disabled="busy || !selected.length" @click="bulk">
          {{ filter === "trash" ? "批量恢复" : "批量移到回收站" }}
        </el-button>
        <el-select
          v-if="!isPage"
          v-model="category"
          clearable
          placeholder="所有分类"
          @change="page = 1"
        >
          <el-option
            v-for="cat in data.cats.filter((value) => !value.deletedAt)"
            :key="cat.id"
            :value="cat.id"
            :label="cat.name"
          />
        </el-select>
      </div>
      <el-input
        v-model="search"
        clearable
        :placeholder="`搜索${label}标题`"
        :aria-label="`搜索${label}`"
        @input="page = 1"
      />
    </div>
    <el-table
      :data="shown"
      v-loading="loading"
      row-key="id"
      @selection-change="(values: Array<Post | Page>) => (selected = values)"
    >
      <el-table-column type="selection" width="45" />
      <el-table-column label="标题" min-width="270">
        <template #default="{ row }">
          <div class="wp-title-cell">
            <div class="wp-cover-title">
              <img v-if="'cover' in row && row.cover" :src="row.cover" alt="" />
              <el-button
                link
                type="primary"
                :disabled="row.status === 'trash'"
                @click="edit(row)"
              >
                {{ row.title }}
              </el-button>
            </div>
            <div class="wp-row-actions">
              <template v-if="row.status !== 'trash'">
                <button @click="edit(row)">编辑</button>
                <button v-if="isPage" @click="router.push({path:'/home',query:{target:`page:${row.id}`}})">装修</button>
                <span>|</span>
                <a
                  v-if="row.status === 'published'"
                  :href="href(row)"
                  target="_blank"
                  rel="noopener"
                >
                  查看
                </a>
                <button
                  class="danger"
                  :disabled="busy"
                  @click="transition(row, 'trash')"
                >
                  移至回收站
                </button>
              </template>
              <button
                v-else
                :disabled="busy"
                @click="transition(row, 'restore')"
              >
                恢复
              </button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="100">
        <template #default>{{ session?.username }}</template>
      </el-table-column>
      <el-table-column
        v-if="!isPage"
        prop="categoryName"
        label="分类目录"
        min-width="130"
      />
      <el-table-column label="路径" min-width="160">
        <template #default="{ row }">
          <code>/{{ row.slug }}/</code>
        </template>
      </el-table-column>
      <el-table-column label="日期" width="170">
        <template #default="{ row }">
          <el-tag
            size="small"
            :type="row.status === 'published' ? 'success' : 'info'"
          >
            {{ statusLabel(row.status) }}
          </el-tag>
          <div class="muted">
            {{ row.updatedAt.slice(0, 16).replace("T", " ") }}
          </div>
        </template>
      </el-table-column>
      <template #empty><el-empty :description="`暂无${label}`" /></template>
    </el-table>
    <div class="table-footer">
      <span>{{ visible.length }} 项内容</span>
      <el-pagination
        v-model:current-page="page"
        :page-size="15"
        :total="visible.length"
        layout="prev,pager,next"
      />
    </div>
    <el-button
      v-if="!isPage && data.nextCursor"
      :loading="busy"
      @click="loadMore"
    >
      加载更多文章
    </el-button>
  </EleCard>
</template>
