<script setup lang="ts">
import {t} from '../../../lib/i18n/client';
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { ElMessageBox } from "element-plus";
import {
  FullScreen,
  Link,
  Moon,
  Sunny,
  MoreFilled,
  ArrowDown,
  SwitchButton,
  Lock,
} from "@element-plus/icons-vue";
import LayoutTool from "ele-admin-plus/es/ele-admin-layout/components/layout-tool";
import { useStudio } from "../store";
import { request } from "../../admin/api";
import type { Theme } from "./theme";
import LanguageSwitch from '../shared/LanguageSwitch.vue';
defineProps<{ theme: Theme }>();
defineEmits<{ settings: [] }>();
const store = useStudio(),
  { session, busy } = store;
const fullscreen = ref(false);
const router = useRouter();
function accountCommand(command: string) {
  if (command === 'password') void router.push('/password');
  else if (command === 'logout') void logout();
}
async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      fullscreen.value = false;
    } else {
      await document.documentElement.requestFullscreen();
      fullscreen.value = true;
    }
  } catch {
    store.error.value = t("浏览器未允许全屏");
  }
}
async function logout() {
  if (busy.value) return;
  try {
    await ElMessageBox.confirm(
      store.dirty.value
        ? t("有未保存的内容，退出会丢失修改。")
        : t("确认退出当前账号？"),
      t("退出登录"),
      { type: "warning" },
    );
  } catch {
    return;
  }
  await store.run(async () => {
    await request("/api/auth/logout", {
      method: "POST",
      csrf: session.value!.csrf,
    });
    session.value = null;
    store.dirty.value = false;
  });
}
</script>
<template>
  <LayoutTool><LanguageSwitch :dirty="store.dirty.value" :disabled="busy" @before-reload="store.dirty.value=false"/></LayoutTool>
  <LayoutTool :title="t('查看网站')">
    <a href="/" target="_blank" rel="noopener noreferrer" :aria-label="t('查看网站')">
      <el-icon><Link /></el-icon>
    </a>
  </LayoutTool>
  <LayoutTool :title="t('全屏切换')" class="hidden-xs" @click="toggleFullscreen">
    <el-icon><FullScreen /></el-icon>
  </LayoutTool>
  <LayoutTool>
    <el-dropdown @command="accountCommand">
      <div class="studio-user">
        <el-avatar :size="26">
          {{ session?.username.slice(0, 1).toUpperCase() }}
        </el-avatar>
        <span>{{ session?.username }}</span>
        <el-icon><ArrowDown /></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="password" :icon="Lock" :disabled="busy"> {{ t("修改密码") }} </el-dropdown-item>
          <el-dropdown-item command="logout" :icon="SwitchButton" :disabled="busy"> {{ t("退出登录") }} </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </LayoutTool>
  <LayoutTool class="ele-dark-switch">
    <el-switch
      v-model="theme.dark"
      :active-action-icon="Moon"
      :inactive-action-icon="Sunny"
      :aria-label="t('切换明暗主题')"
    />
  </LayoutTool>
  <LayoutTool :title="t('主题设置')" @click="$emit('settings')">
    <el-icon><MoreFilled /></el-icon>
  </LayoutTool>
</template>
