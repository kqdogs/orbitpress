<script setup lang="ts">
import {t} from '../../lib/i18n/client';
import { onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import { createStudio } from "./store";
import StudioShell from "./layout/StudioShell.vue";
import Login from "./pages/Login.vue";
import EleConfigProvider from 'ele-admin-plus/es/ele-config-provider';
import en from 'ele-admin-plus/es/lang/en_US';
import zh from 'ele-admin-plus/es/lang/zh_CN';
import {currentLocale} from '../../lib/i18n/client';
const store = createStudio(),
  router = useRouter();
const { session, booting, error, message, busy, dirty } = store;
const removeRouteGuard = router.beforeEach(async (to, from) => {
  if (to.fullPath === from.fullPath) return true;
  if (busy.value && dirty.value) return false;
  if (!dirty.value) return true;
  try {
    await ElMessageBox.confirm(
      t("当前有未保存的修改，离开会丢失这些修改。"),
      t("离开当前页面？"),
      {
        confirmButtonText: t("放弃并离开"),
        cancelButtonText: t("继续编辑"),
        type: "warning",
      },
    );
    dirty.value = false;
    return true;
  } catch {
    return false;
  }
});
function unload(event: BeforeUnloadEvent) {
  if (dirty.value) {
    event.preventDefault();
    event.returnValue = "";
  }
}
onMounted(() => {
  void store.boot();
  window.addEventListener("beforeunload", unload);
});
onBeforeUnmount(() => {
  removeRouteGuard();
  window.removeEventListener("beforeunload", unload);
});
</script>
<template>
 <EleConfigProvider :locale="currentLocale()==='en'?en:zh">
  <div
    v-if="booting"
    class="studio-boot"
    v-loading="true"
    :element-loading-text="t('正在连接内容服务…')"
  />
  <Login v-else-if="!session" />
  <div v-else-if="!store.data.settings" class="studio-login">
    <el-result icon="error" :title="t('内容加载失败')" :sub-title="error">
      <template #extra>
        <el-button type="primary" @click="store.run(store.refresh)"> {{ t("重新加载") }} </el-button>
      </template>
    </el-result>
  </div>
  <StudioShell v-else>
    <el-alert
      v-if="error"
      type="error"
      :title="error"
      show-icon
      @close="error = ''"
    />
    <el-alert
      v-if="message"
      type="success"
      :title="message"
      show-icon
      @close="message = ''"
    />
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :key="route.fullPath" />
    </router-view>
  </StudioShell>
 </EleConfigProvider>
</template>
