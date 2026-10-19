<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import EleCard from "ele-admin-plus/es/ele-card";
import {
  postInput,
  pageInput,
  type Post,
  type PostInput,
  type Page,
  type PageInput,
} from "../../../lib/schema";
import { request } from "../../admin/api";
import { useStudio } from "../store";
import PageTitle from "./PageTitle.vue";
import MarkdownEditor from "./MarkdownEditor.vue";
import Preview from "./Preview.vue";
import ArticleMetadataFields from './ArticleMetadataFields.vue';
import ArticleResourceFields from './ArticleResourceFields.vue';
import {emptyArticleResources} from '../../../lib/schema';
import type {ImportedArticle} from '../../../lib/import-contract';
import {articleHighlights} from '../../../lib/article-metadata';
import { postPath } from "../../../lib/permalinks";
const props = defineProps<{ kind: "posts" | "pages" }>();
const store = useStudio(),
  { data, session, busy, dirty } = store,
  route = useRoute(),
  router = useRouter();
const isPage = computed(() => props.kind === "pages"),
  label = computed(() => (isPage.value ? "页面" : "文章"));
const draft = ref<PostInput>({
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  categoryId: data.cats.find((cat) => !cat.deletedAt)?.id || "",
  cover: "",
  videoId: "",
  featured: false,
  tags: [],
  highlights: [],
  resources:structuredClone(emptyArticleResources),
});
const menuLabel = ref(""),
  saved = ref<Post | Page | null>(null),
  loading = ref(Boolean(route.params.id)),
  loadError = ref(""),
  mode = ref<"edit" | "preview" | "split">("edit"),
  mobile = ref(false);
const metadataFields=ref<InstanceType<typeof ArticleMetadataFields>>();
const highlights=computed({get:()=>draft.value.highlights||[],set:(value:string[])=>{draft.value.highlights=value;}});
function changeMode(next:unknown){
  if(next!=='edit'&&next!=='preview'&&next!=='split')return;
  try{if(!isPage.value)metadataFields.value?.prepare();mode.value=next;}
  catch(cause){ElMessage.error(cause instanceof Error?cause.message:'请检查文章标签和亮点');}
}
const quick = ref(false),
  quickTitle = ref(""),
  quickOutline = ref("准备工作\n操作步骤\n常见问题");
const importOpen=ref(route.query.import==='1'),importUrl=ref(''),importError=ref(''),importing=ref(false),importWarnings=ref<string[]>([]);
async function collectArticle(){
 if(importing.value||busy.value||loading.value||saved.value)return;
 if(saved.value||draft.value.body.trim()||draft.value.title.trim()){
  try{await ElMessageBox.confirm('采集会替换当前编辑内容，请先保存需要保留的内容。','采集文章',{confirmButtonText:'替换为采集草稿',cancelButtonText:'取消'});}catch{return;}
 }
 importing.value=true;importError.value='';
 try{
  const result=await request<ImportedArticle>('/api/admin/imports',{method:'POST',csrf:session.value!.csrf,body:{url:importUrl.value},signal:controller.signal});
  if(controller.signal.aborted)return;
  draft.value={...result.article,categoryId:draft.value.categoryId,highlights:result.article.highlights||[],resources:structuredClone(result.article.resources||emptyArticleResources)};
  saved.value=null;importWarnings.value=result.warnings;dirty.value=true;
  importOpen.value=false;ElMessage.success('采集内容已填入新草稿，请检查分类、正文与来源后保存');
 }catch(cause){if(!controller.signal.aborted)importError.value=cause instanceof Error?cause.message:'采集失败，原草稿已保留';}
 finally{importing.value=false;}
}
const permalink = computed(() => {
  if (isPage.value) return `/${draft.value.slug || "your-slug"}/`;
  return postPath(
    {
      id: saved.value?.id || "post-id",
      slug: draft.value.slug || "your-slug",
      categorySlug: data.cats.find((cat) => cat.id === draft.value.categoryId)
        ?.slug,
      publishedAt: saved.value?.publishedAt || null,
      createdAt: saved.value?.createdAt || new Date().toISOString(),
    },
    data.settings!.value,
  );
});
let hydrating = true;
const controller = new AbortController();
watch(
  [draft, menuLabel],
  () => {
    if (!hydrating) dirty.value = true;
  },
  { deep: true, flush: "sync" },
);
const previewBody = computed(() =>
  isPage.value
    ? {
        title: draft.value.title,
        excerpt: draft.value.excerpt,
        body: draft.value.body,
        ...(saved.value?{pageId:saved.value.id}:{}),
      }
    : {
        title: draft.value.title,
        excerpt: draft.value.excerpt,
        body: draft.value.body,
        categoryId: draft.value.categoryId,
        cover: draft.value.cover,
        videoId: draft.value.videoId,
        tags: draft.value.tags,
        highlights: highlights.value,
        resources:draft.value.resources,
        publishedAt: saved.value?.publishedAt || null,
      },
);
function hydrate(value: Post | Page) {
  hydrating = true;
  saved.value = value;
  draft.value = {
    title: value.title,
    slug: value.slug,
    excerpt: value.excerpt,
    body: value.body,
    categoryId:
      "categoryId" in value ? value.categoryId : draft.value.categoryId,
    cover: "cover" in value ? value.cover : "",
    videoId: "videoId" in value ? value.videoId : "",
    featured: "featured" in value ? value.featured : false,
    tags: "tags" in value ? [...value.tags] : [],
    highlights: 'tags' in value ? [...articleHighlights(value)] : [],
    resources:'tags' in value?structuredClone(value.resources||emptyArticleResources):structuredClone(emptyArticleResources),
  };
  menuLabel.value = "menuLabel" in value ? value.menuLabel : "";
  hydrating = false;
  dirty.value = false;
}
async function load() {
  loading.value = true;
  loadError.value = "";
  try {
    if (route.params.id) {
      hydrate(
        await request<Post | Page>(
          `/api/admin/${props.kind}/${encodeURIComponent(String(route.params.id))}`,
          { signal: controller.signal },
        ),
      );
    }
  } catch (cause) {
    if (!controller.signal.aborted)
      loadError.value = cause instanceof Error ? cause.message : "读取失败";
  } finally {
    if (!controller.signal.aborted) {
      loading.value = false;
      hydrating = false;
    }
  }
}
onMounted(load);
onBeforeUnmount(() => {
  controller.abort();
  dirty.value = false;
});
function values() {
  return isPage.value
    ? pageInput.parse({
        title: draft.value.title,
        slug: draft.value.slug,
        excerpt: draft.value.excerpt,
        body: draft.value.body,
        menuLabel: menuLabel.value,
      })
    : postInput.parse(draft.value);
}
async function save() {
  const input = values();
  const value = await request<Post | Page>(
    `/api/admin/${props.kind}${saved.value ? `/${saved.value.id}` : ""}`,
    {
      method: saved.value ? "PUT" : "POST",
      csrf: session.value!.csrf,
      idempotent: true,
      body: saved.value ? { ...input, version: saved.value.version } : input,
    },
  );
  hydrate(value);
  return value;
}
async function commit(publish = false) {
  await store.run(
    async () => {
      if(!isPage.value)metadataFields.value?.prepare();
      let value = dirty.value || !saved.value ? await save() : saved.value;
      if (publish) {
        value = await request<Post | Page>(
          `/api/admin/${props.kind}/${value.id}/${value.status === "published" ? "unpublish" : "publish"}`,
          {
            method: "POST",
            csrf: session.value!.csrf,
            idempotent: true,
            body: { version: value.version },
          },
        );
        hydrate(value);
      }
      await store.refresh();
      if (!route.params.id)
        await router.replace(
          `/${isPage.value ? "page-editor" : "editor"}/${value.id}`,
        );
    },
    publish ? "发布状态已更新" : "草稿已保存",
  );
}
async function quickWrite() {
  if (busy.value || loading.value) return;
  if (draft.value.body.trim()) {
    try {
      await ElMessageBox.confirm(
        "正文已有内容，生成的提纲将追加到正文末尾。",
        "快速写文章",
        {
          confirmButtonText: "追加提纲",
          cancelButtonText: "取消",
        },
      );
    } catch {
      return;
    }
  }
  const title = quickTitle.value.trim();
  if (!draft.value.title && title) draft.value.title = title;
  const sections = quickOutline.value
    .split("\n")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => `## ${value}\n\n`)
    .join("\n");
  draft.value.body += `${draft.value.body ? "\n\n" : ""}${sections}`;
  quick.value = false;
}
async function upload(event: Event) {
  const target = event.target as HTMLInputElement,
    file = target.files?.[0];
  if (!file) return;
  await store.run(async () => {
    if (file.size > 5 * 1024 * 1024) throw new Error("图片不能超过 5MB");
    const form = new FormData();
    form.set("file", file);
    const result = await request<{ url: string }>("/api/admin/media", {
      method: "POST",
      csrf: session.value!.csrf,
      body: form,
    });
    draft.value.cover = result.url;
  }, "封面已上传");
  target.value = "";
}
</script>
<template>
  <PageTitle
    :title="`${saved ? '编辑' : '新建'}${label}`"
    :description="
      dirty ? '有未保存的修改' : '使用 Markdown 写作，保存后可继续编辑。'
    "
  >
    <el-button
      :disabled="busy"
      @click="router.push(isPage ? '/pages' : '/posts')"
    >
      返回列表
    </el-button>
    <el-button :disabled="busy || loading" @click="quick = true">
      快速写文章
    </el-button>
    <el-button v-if="!isPage" :disabled="busy||loading||importing" @click="saved ? router.push('/editor?import=1') : importOpen=true">采集文章</el-button>
    <el-radio-group :model-value="mode" size="small" @update:model-value="changeMode">
      <el-radio-button value="edit">编辑</el-radio-button>
      <el-radio-button value="preview">预览</el-radio-button>
      <el-radio-button value="split">实时对照</el-radio-button>
    </el-radio-group>
  </PageTitle>
  <el-alert v-if="loadError" type="error" :title="loadError" :closable="false">
    <el-button @click="load">重新加载</el-button>
  </el-alert>
  <el-alert v-if="importWarnings.length" type="warning" :title="`采集提示：${importWarnings.join(' ')}`" show-icon @close="importWarnings=[]"/>
  <div
    v-if="!loadError"
    v-loading="loading"
    class="wp-compose"
    :class="{ 'has-split': mode === 'split' }"
  >
    <div class="wp-writing">
      <template v-if="mode !== 'preview'">
        <el-input
          v-model="draft.title"
          :disabled="busy || loading"
          class="wp-title-input"
          maxlength="180"
          :placeholder="`添加${label}标题`"
          :aria-label="`${label}标题`"
        />
        <div class="wp-permalink">
          <span>固定链接：</span>
          <code>{{ permalink }}</code>
        </div>
        <MarkdownEditor v-model="draft.body" :disabled="busy || loading" />
        <EleCard header="摘要" class="excerpt-card">
          <el-input
            v-model="draft.excerpt"
            :disabled="busy"
            type="textarea"
            :rows="3"
            maxlength="500"
            show-word-limit
            aria-label="内容摘要"
            placeholder="可选，向读者概括内容。"
          />
        </EleCard>
      </template>
      <Preview
        v-if="mode !== 'edit'"
        :body="previewBody"
        :endpoint="isPage ? '/admin/content-preview' : '/admin/preview'"
        :mobile="mobile"
      >
        <el-switch v-model="mobile" active-text="手机" />
      </Preview>
    </div>
    <aside class="wp-publish">
      <EleCard header="发布">
        <div class="publish-state">
          <span>状态</span>
          <el-tag :type="saved?.status === 'published' ? 'success' : 'info'">
            {{ saved?.status === "published" ? "已发布" : "草稿" }}
          </el-tag>
        </div>
        <div class="publish-state">
          <span>修改时间</span>
          <span>
            {{ saved?.updatedAt.slice(0, 16).replace("T", " ") || "尚未保存" }}
          </span>
        </div>
        <div class="publish-buttons">
          <el-button :loading="busy" :disabled="loading" @click="commit()">
            {{ saved?.status === "published" ? "更新内容" : "保存草稿" }}
          </el-button>
          <el-button
            type="primary"
            :disabled="busy || loading"
            @click="commit(true)"
          >
            {{ saved?.status === "published" ? "下架为草稿" : `发布${label}` }}
          </el-button>
        </div>
      </EleCard>
      <EleCard :header="`${label}设置`">
        <el-form label-position="top" :disabled="busy || loading">
          <el-form-item label="访问路径">
            <el-input
              v-model="draft.slug"
              aria-label="访问路径"
              placeholder="英文小写、数字、连字符"
              maxlength="120"
            >
              <template #prepend>/</template>
              <template #append>/</template>
            </el-input>
            <p class="field-help">必填，使用唯一的英文路径。</p>
          </el-form-item>
          <template v-if="!isPage">
            <el-form-item label="分类目录">
              <el-select
                v-model="draft.categoryId"
                aria-label="分类目录"
                class="full-width"
              >
                <el-option
                  v-for="cat in data.cats.filter((value) => !value.deletedAt)"
                  :key="cat.id"
                  :label="cat.name"
                  :value="cat.id"
                />
              </el-select>
            </el-form-item>
            <el-checkbox v-model="draft.featured">设为首页推荐</el-checkbox>
          </template>
          <el-form-item v-else label="菜单显示名称">
            <el-input
              v-model="menuLabel"
              aria-label="菜单显示名称"
              maxlength="60"
              placeholder="可选"
            />
          </el-form-item>
        </el-form>
      </EleCard>
      <ArticleMetadataFields v-if="!isPage" ref="metadataFields" v-model:tags="draft.tags" v-model:highlights="highlights" :title="draft.title" :excerpt="draft.excerpt" :body="draft.body" :category="data.cats.find(cat=>cat.id===draft.categoryId)?.name" :disabled="busy||loading" @change="dirty=true"/>
      <ArticleResourceFields v-if="!isPage" v-model="draft.resources" :disabled="busy||loading"/>
      <EleCard v-if="!isPage" header="特色图片与主视频">
        <el-form label-position="top" :disabled="busy || loading">
          <img
            v-if="draft.cover"
            :src="draft.cover"
            alt="当前封面"
            class="cover-image"
          />
          <el-form-item label="封面路径">
            <el-input
              v-model="draft.cover"
              aria-label="封面路径"
              placeholder="/media/…"
            />
          </el-form-item>
          <label class="upload-button">
            <span>上传封面图片</span>
            <input
              type="file"
              :disabled="busy"
              accept="image/png,image/jpeg,image/webp"
              @change="upload"
            />
          </label>
          <el-form-item label="顶部 YouTube 视频 ID">
            <el-input
              v-model="draft.videoId"
              aria-label="顶部视频 ID"
              maxlength="11"
              placeholder="可选，11 位视频 ID"
            />
          </el-form-item>
        </el-form>
      </EleCard>
    </aside>
  </div>
  <el-dialog v-model="quick" title="快速写文章" width="540" append-to-body>
    <el-form label-position="top" :disabled="busy || loading">
      <el-form-item label="文章标题">
        <el-input v-model="quickTitle" placeholder="记录一个标题或灵感" />
      </el-form-item>
      <el-form-item label="章节提纲">
        <el-input v-model="quickOutline" type="textarea" :rows="7" />
      </el-form-item>
      <p class="field-help">
        每行生成一个二级标题，可直接继续写作；这不会调用外部
        AI，也不会自动发布。
      </p>
    </el-form>
    <template #footer>
      <el-button @click="quick = false">取消</el-button>
      <el-button type="primary" @click="quickWrite">插入写作提纲</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="importOpen" title="采集文章到草稿" width="560" append-to-body :close-on-click-modal="!importing" :close-on-press-escape="!importing" :show-close="!importing">
   <el-form label-position="top" :disabled="importing" @submit.prevent="collectArticle">
    <el-form-item label="原文地址"><el-input v-model="importUrl" placeholder="https://rinfinity.net/文章路径/" aria-label="采集文章地址"/></el-form-item>
    <p class="field-help">导入标题、正文、站内图片与视频，保留原文来源。请仅导入你有权转载的内容，采集后检查草稿再发布。</p>
    <el-alert v-if="importError" :title="importError" type="error" :closable="false"/>
   </el-form>
   <template #footer><el-button :disabled="importing" @click="importOpen=false">取消</el-button><el-button type="primary" :loading="importing" :disabled="!importUrl.trim()" @click="collectArticle">一键采集</el-button></template>
  </el-dialog>
</template>
