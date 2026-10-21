<script setup lang="ts">
import {t} from '../../../lib/i18n/client';
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Fold, Expand, Refresh } from "@element-plus/icons-vue";
import EleProLayout from "ele-admin-plus/es/ele-pro-layout";
import LayoutTool from "ele-admin-plus/es/ele-admin-layout/components/layout-tool";
import { menuItems } from "../router";
import { useStudio } from "../store";
import { useTheme } from "./theme";
import StudioTopbar from "./StudioTopbar.vue";
import ThemeSettings from "./ThemeSettings.vue";
import {currentLocale} from '../../../lib/i18n/client';
type Tab = {
  key?: string;
  fullPath?: string;
  path?: string;
  title?: string;
  closable?: boolean;
};
const { data, refresh, run, dirty } = useStudio(),
  router = useRouter();
const { theme, reset, applyLayout } = useTheme();
const settingsOpen = ref(false),
  tabs = ref<Tab[]>([]);
function addTab(tab: Tab) {
  if (!tabs.value.some((item) => item.key === tab.key)) tabs.value.push(tab);
}
function tabClick(option: { key?: string; item?: Tab }) {
  const path = option.item?.fullPath || option.key;
  if (path) void router.push(path);
}
async function removeTab(option: { key?: string }) {
  const index = tabs.value.findIndex((item) => item.key === option.key);
  if (index < 0) return;
  if (router.currentRoute.value.fullPath === option.key) {
    const result = await router.push(
      tabs.value[index - 1]?.fullPath || "/dashboard",
    );
    if (result) return;
  }
  tabs.value.splice(index, 1);
}
function reload() {
  if (dirty.value) {
    void run(async () => {
      throw new Error(t("请先保存当前内容，再刷新数据"));
    });
    return;
  }
  void run(refresh, t("内容已刷新"));
}
</script>
<template>
  <EleProLayout
    :locale="currentLocale()"
    :menus="menuItems"
    :tabs="tabs"
    v-model:collapse="theme.collapse"
    :layout="theme.layout"
    :compact="theme.compact"
    :colorful-icon="theme.colorfulIcon"
    :mix-sidebar-style="theme.mixSidebarStyle"
    :sidebar-custom-style="theme.sidebarCustomStyle"
    :sidebox-custom-style="theme.sideboxCustomStyle"
    :side-custom-style="theme.sideCustomStyle"
    :header-custom-style="theme.headerCustomStyle"
    :tabs-custom-style="theme.tabsCustomStyle"
    :content-custom-style="theme.contentCustomStyle"
    :style="theme.layoutCustomStyle"
    :class="theme.layoutCustomClass"
    :sidebar-layout="theme.sidebarLayout"
    :sidebar-style="theme.sidebarStyle"
    :header-style="theme.headerStyle"
    :tab-style="theme.tabStyle"
    :tab-bar="theme.tabBar ? (theme.tabInHeader ? 'header' : true) : false"
    :breadcrumb="!theme.tabInHeader"
    :fixed-header="theme.fixedHeader"
    :fixed-sidebar="theme.fixedSidebar"
    :fixed-body="theme.fixedBody"
    :logo-in-header="theme.logoInHeader"
    :unique-opened="theme.uniqueOpened"
    :fluid="theme.fluid"
    :responsive="true"
    :fixed-home="true"
    home-path="/dashboard"
    :tab-sortable="true"
    @tab-add="addTab"
    @tab-click="tabClick"
    @tab-remove="removeTab"
    @tab-sort-change="(value: Tab[]) => (tabs = value)"
  >
    <template #logo>
      <img
        :src="data.settings?.value.logo || '/images/yachin-mark.svg'"
        alt=""
        width="28"
        height="28"
      />
    </template>
    <template #logoTitle>
      <h1>{{ data.settings?.value.title || t("内容工作台") }}</h1>
    </template>
    <template #left>
      <LayoutTool :title="t('折叠侧栏')" @click="theme.collapse = !theme.collapse">
        <el-icon>
          <Expand v-if="theme.collapse" />
          <Fold v-else />
        </el-icon>
      </LayoutTool>
      <LayoutTool :title="t('刷新当前内容')" @click="reload">
        <el-icon><Refresh /></el-icon>
      </LayoutTool>
    </template>
    <template #right>
      <StudioTopbar :theme="theme" @settings="settingsOpen = true" />
    </template>
    <main class="studio-workspace"><slot /></main>
  </EleProLayout>
  <el-drawer
    v-model="settingsOpen"
    :title="t('主题设置')"
    :size="288"
    class="studio-theme-drawer"
    append-to-body
  >
    <ThemeSettings :theme="theme" @reset="reset" @layout="applyLayout" />
  </el-drawer>
</template>
