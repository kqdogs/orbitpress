<script setup lang="ts">
import {t} from '../../../lib/i18n/client';
import { onBeforeUnmount, ref } from "vue";
import { ElMessageBox } from "element-plus";
import EleCard from "ele-admin-plus/es/ele-card";
import { useStudio } from "../store";
import { request } from "../../admin/api";
import { keyInput } from "../../../lib/schema";
import PageTitle from "../shared/PageTitle.vue";
import type { ApiKey } from "../types";
const store = useStudio(),
  { data, session, busy } = store;
const name = ref(""),
  days = ref(30),
  scopes = ref(["content:read", "content:write"]),
  token = ref(""),
  open = ref(false);
let controller = new AbortController();
function hide() {
  controller.abort();
  token.value = "";
  open.value = false;
}
function visibility() {
  if (document.hidden) hide();
}
document.addEventListener("visibilitychange", visibility);
onBeforeUnmount(() => {
  hide();
  document.removeEventListener("visibilitychange", visibility);
});
async function show(id?: string) {
  await store.run(async () => {
    hide();
    controller = new AbortController();
    const signal = controller.signal;
    try {
      const value = await request<{ id: string; token: string }>(
        id ? `/api/admin/keys/${id}/reveal` : "/api/admin/keys",
        {
          method: "POST",
          csrf: session.value!.csrf,
          signal,
          ...(id
            ? {}
            : {
                body: keyInput.parse({
                  name: name.value,
                  days: days.value,
                  scopes: scopes.value,
                }),
              }),
        },
      );
      if (!signal.aborted && !document.hidden) {
        token.value = value.token;
        open.value = true;
      }
      await store.refresh();
    } catch (cause) {
      if (!signal.aborted) throw cause;
    }
  });
}
async function revoke(key: ApiKey) {
  try {
    await ElMessageBox.confirm(t("撤销“{0}”的访问权限？", [key.name]), t("撤销密钥"), {
      type: "warning",
    });
  } catch {
    return;
  }
  await store.run(async () => {
    hide();
    await request(`/api/admin/keys/${key.id}/revoke`, {
      method: "POST",
      csrf: session.value!.csrf,
    });
    await store.refresh();
  }, t("密钥已撤销"));
}
async function copy() {
  await store.run(
    () => navigator.clipboard.writeText(token.value),
    t("密钥已复制"),
  );
}
</script>
<template>
  <PageTitle
    :title="t('API 连接')"
    :description="t('为外部写作工具创建连接。新密钥加密保存，可再次查看。')"
  >
    <el-button tag="a" href="/api/openapi.json" target="_blank" rel="noopener"> {{ t("OpenAPI 文档 ↗") }} </el-button>
  </PageTitle>
  <div class="dashboard-grid">
    <EleCard :header="t('创建连接')">
      <el-form label-position="top" :disabled="busy" @submit.prevent="show()">
        <el-form-item :label="t('连接名称')">
          <el-input v-model="name" maxlength="60" />
        </el-form-item>
        <el-form-item :label="t('有效期')">
          <el-select v-model="days">
            <el-option
              v-for="n in [7, 30, 90, 365]"
              :key="n"
              :label="t('{0} 天', [n])"
              :value="n"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('权限范围')">
          <el-checkbox-group v-model="scopes" class="vertical-checks">
            <el-checkbox value="content:read"> {{ t("读取内容") }} </el-checkbox>
            <el-checkbox value="content:write"> {{ t("创建与修改草稿") }} </el-checkbox>
            <el-checkbox value="content:publish"> {{ t("发布、下架及修改已发布内容") }} </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-button
          type="primary"
          native-type="submit"
          :loading="busy"
          :disabled="!name.trim() || !scopes.length"
        > {{ t("创建密钥") }} </el-button>
      </el-form>
    </EleCard>
    <EleCard :header="t('接入说明')">
      <p> {{ t("使用 Bearer 密钥鉴权。写入内容时附带唯一的 Idempotency-Key，修改和发布时携带最新 version。") }} </p>
      <pre class="api-example">
POST /api/v1/posts
Authorization: Bearer &lt;API_KEY&gt;
Idempotency-Key: &lt;unique-request-id&gt;

POST /api/v1/posts/:id/publish
{ "version": 1 }</pre>
      <el-alert
        :title="t('创建内容默认保存为草稿；发布需要单独授予权限。')"
        type="info"
        :closable="false"
      />
    </EleCard>
  </div>
  <EleCard :header="t('已有连接')">
    <el-table :data="data.keys" row-key="id">
      <el-table-column prop="name" :label="t('名称')" />
      <el-table-column prop="scopes" :label="t('权限')" min-width="220" />
      <el-table-column :label="t('状态')" width="100">
        <template #default="{ row }">
          <el-tag
            :type="
              row.revokedAt
                ? 'info'
                : Date.now() / 1000 > row.expiresAt
                  ? 'warning'
                  : 'success'
            "
          >
            {{
              row.revokedAt
                ? t("已撤销")
                : Date.now() / 1000 > row.expiresAt
                  ? t("已过期")
                  : t("有效")
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('操作')" min-width="190">
        <template #default="{ row }">
          <el-button
            v-if="row.canReveal"
            link
            type="primary"
            :disabled="busy"
            @click="show(row.id)"
          > {{ t("查看密钥") }} </el-button>
          <span v-else class="muted"> {{ t("不可查看") }} </span>
          <el-button
            v-if="!row.revokedAt"
            link
            type="danger"
            :disabled="busy"
            @click="revoke(row)"
          > {{ t("撤销") }} </el-button>
        </template>
      </el-table-column>
    </el-table>
  </EleCard>
  <el-dialog v-model="open" :title="t('API 密钥')" width="560" @closed="hide">
    <el-input
      :model-value="token"
      type="password"
      show-password
      readonly
      autocomplete="off"
      :aria-label="t('API 密钥')"
    />
    <template #footer>
      <el-button @click="hide"> {{ t("关闭并清除") }} </el-button>
      <el-button type="primary" @click="copy"> {{ t("复制密钥") }} </el-button>
    </template>
  </el-dialog>
</template>
