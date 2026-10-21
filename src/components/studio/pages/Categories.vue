<script setup lang="ts">
import {t} from '../../../lib/i18n/client';
import { computed, ref } from "vue";
import { ElMessageBox } from "element-plus";
import CategoryIcon from '../../CategoryIcon.vue';
import CategoryIconPicker from '../shared/CategoryIconPicker.vue';
import EleCard from "ele-admin-plus/es/ele-card";
import { useStudio } from "../store";
import { request } from "../../admin/api";
import { categoryInput, type Category } from "../../../lib/schema";
import PageTitle from "../shared/PageTitle.vue";
const store = useStudio(),
  { data, busy, session } = store;
const blank = () => ({
  name: "",
  slug: "",
  description: "",
  icon: "globe" as Category["icon"],
});
const form = ref(blank()),
  editing = ref<Category | null>(null),
  trash = ref(false),
  query = ref("");
const rows = computed(() =>
  data.cats.filter(
    (c) => Boolean(c.deletedAt) === trash.value && c.name.includes(query.value),
  ),
);
function edit(cat: Category) {
  editing.value = cat;
  form.value = {
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    icon: cat.icon,
  };
}
function reset() {
  editing.value = null;
  form.value = blank();
}
async function save() {
  await store.run(async () => {
    const input = categoryInput.parse(form.value);
    await request(
      `/api/admin/categories${editing.value ? `/${editing.value.id}` : ""}`,
      {
        method: editing.value ? "PUT" : "POST",
        csrf: session.value!.csrf,
        body: editing.value
          ? { ...input, version: editing.value.version }
          : input,
      },
    );
    reset();
    await store.refresh();
  }, t("分类已保存"));
}
async function transition(cat: Category, purge = false) {
  if(busy.value)return;
  try {
    await ElMessageBox.confirm(
      t("{0}分类“{1}”？{2}", [purge ? t("彻底删除") : cat.deletedAt ? t("恢复") : t("删除"), cat.name, purge ? t("此操作无法恢复，有关联文章或导航时无法删除。") : cat.deletedAt ? "" : t("有关联文章或导航的分类需要先移除引用。")]),
      t("分类操作"),
      { type: "warning", confirmButtonText: purge ? t("彻底删除") : t("确认"), cancelButtonText: t("取消") },
    );
  } catch {
    return;
  }
  await store.run(async () => {
    await request(
      `/api/admin/categories/${cat.id}${purge ? "/purge" : cat.deletedAt ? "/restore" : ""}`,
      {
        method: cat.deletedAt ? "POST" : "DELETE",
        idempotent: purge,
        csrf: session.value!.csrf,
        body: { version: cat.version },
      },
    );
    if (editing.value?.id === cat.id) reset();
    await store.refresh();
  }, purge ? t("分类已彻底删除") : t("分类状态已更新"));
}
</script>
<template>
  <PageTitle
    :title="t('分类目录')"
    :description="t('用分类整理文章。名称、路径和图标会显示在前台。')"
  />
  <div class="wp-taxonomy">
    <EleCard :header="editing ? t('编辑分类') : t('添加新分类')">
      <el-form label-position="top" :disabled="busy" @submit.prevent="save">
        <el-form-item :label="t('名称')">
          <el-input v-model="form.name" maxlength="40" />
        </el-form-item>
        <el-form-item :label="t('别名 / 路径')">
          <el-input v-model="form.slug" :placeholder="t('英文小写、数字、连字符')" />
        </el-form-item>
        <el-form-item :label="t('图标')">
          <CategoryIconPicker v-model="form.icon" :disabled="busy"/>
        </el-form-item>
        <el-form-item :label="t('描述')">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            maxlength="300"
          />
        </el-form-item>
        <el-button type="primary" native-type="submit" :loading="busy">
          {{ editing ? t("保存分类") : t("添加分类") }}
        </el-button>
        <el-button v-if="editing" @click="reset"> {{ t("取消编辑") }} </el-button>
      </el-form>
    </EleCard>
    <EleCard>
      <div class="wp-list-tools">
        <el-switch v-model="trash" :active-text="t('回收站')" />
        <el-input
          v-model="query"
          :placeholder="t('搜索分类')"
          clearable
          :aria-label="t('搜索分类')"
        />
      </div>
      <el-table :data="rows" row-key="id">
        <el-table-column :label="t('名称')" min-width="150">
          <template #default="{ row }">
            <div class="category-title">
              <el-icon :size="20">
                <CategoryIcon :name="row.icon" :size="20"/>
              </el-icon>
              <strong>{{ row.name }}</strong>
            </div>
            <div class="wp-row-actions">
              <el-button
                v-if="!row.deletedAt"
                link
                type="primary"
                :disabled="busy"
                @click="edit(row)"
              > {{ t("编辑") }} </el-button>
              <el-button
                link
                :type="row.deletedAt ? 'primary' : 'danger'"
                :disabled="busy"
                @click="transition(row, false)"
              >
                {{ row.deletedAt ? t("恢复") : t("删除") }}
              </el-button>
              <el-button v-if="row.deletedAt" link type="danger" :disabled="busy" @click="transition(row,true)"> {{ t("彻底删除") }} </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="slug" :label="t('别名')" />
        <el-table-column
          prop="description"
          :label="t('描述')"
          min-width="140"
          show-overflow-tooltip
        />
        <el-table-column prop="count" :label="t('文章数')" width="85" />
      </el-table>
    </EleCard>
  </div>
</template>
