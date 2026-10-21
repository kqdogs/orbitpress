<script setup lang="ts">
import {t} from '../../../lib/i18n/client';
import { ref, type Component } from "vue";
import { Check } from "@element-plus/icons-vue";
import SettingItem from "../../../../vendor/ele-admin-plus/theme-ui/SettingItem.vue";
import * as covers from "../../../../vendor/ele-admin-plus/theme-ui/covers";
import { layoutPresets } from "./layoutPresets";
import type { Theme } from "./theme";
const props = defineProps<{ theme: Theme }>();
const emit = defineEmits<{ reset: []; layout: [config: unknown] }>();
const tab = ref("theme"),
  activeLayout = ref("");
const colors = [
  "#2f54eb",
  "#1677ff",
  "#13c2c2",
  "#52c41a",
  "#722ed1",
  "#eb2f96",
  "#f5222d",
  "#fa8c16",
];
const layoutNames: Record<string, string> = {
  default: t("经典布局"),
  mixedSidebar: t("双侧栏"),
  compactMixSidebar: t("紧凑双侧栏"),
  compactSidebar: t("图标侧栏"),
  colorfulSidebar: t("彩色侧栏"),
  tabInHeader: t("顶栏页签"),
  plainHeader: t("简洁顶栏"),
  plainCompactHeader: t("紧凑顶栏"),
  cardLayout: t("卡片布局"),
  cardSidebar: t("卡片侧栏"),
  cardMixedSidebar: t("卡片双侧栏"),
  verticalLayout: t("纵向布局"),
  topBarLayout: t("顶部导航"),
  limitedWidth: t("内容定宽"),
};
const layoutCovers: Record<string, Component> = covers;
function selectLayout(item: (typeof layoutPresets)[number]) {
  emit("layout", item.config);
  activeLayout.value = item.name;
}
function setColor(color: string | null) {
  if (color) props.theme.color = color;
}
function setDoubleSidebar(value: boolean | string | number) {
  props.theme.sidebarLayout = value === true ? "mix" : "default";
}
function setSecondSidebarDark(value: boolean | string | number) {
  props.theme.mixSidebarStyle = value === true ? "dark" : "light";
}
</script>
<template>
  <div class="studio-theme-content">
    <div class="ele-setting-segmented-wrapper">
      <el-segmented
        v-model="tab"
        :options="[
          { label: t('主题'), value: 'theme' },
          { label: t('布局'), value: 'layout' },
        ]"
        block
      />
    </div>
    <div class="ele-setting-wrapper">
      <template v-if="tab === 'theme'">
        <div class="ele-setting-theme">
          <div
            v-for="item in ['light', 'dark'] as const"
            :key="item"
            class="ele-setting-theme-item"
          >
            <button
              :class="[
                'ele-setting-theme-item-cover',
                `ele-setting-side-${item}`,
              ]"
              :aria-label="t('{0}侧栏', [item === 'light' ? t('亮色') : t('暗色')])"
              @click="theme.sidebarStyle = item"
            >
              <el-icon
                v-if="theme.sidebarStyle === item"
                color="var(--el-color-primary)"
              >
                <Check />
              </el-icon>
            </button>
            <div>{{ item === "light" ? t("亮色侧栏") : t("暗色侧栏") }}</div>
          </div>
        </div>
        <div class="ele-setting-theme">
          <div
            v-for="item in ['light', 'dark', 'primary'] as const"
            :key="item"
            class="ele-setting-theme-item"
          >
            <button
              :class="[
                'ele-setting-theme-item-cover',
                `ele-setting-head-${item}`,
              ]"
              :aria-label="t('{0} 顶栏', [item])"
              @click="theme.headerStyle = item"
            >
              <el-icon
                v-if="theme.headerStyle === item"
                color="var(--el-color-primary)"
              >
                <Check />
              </el-icon>
            </button>
            <div>
              {{
                { light: t("亮色顶栏"), dark: t("暗色顶栏"), primary: t("主色顶栏") }[
                  item
                ]
              }}
            </div>
          </div>
        </div>
        <div class="ele-setting-colors">
          <button
            v-for="color in colors"
            :key="color"
            class="ele-setting-color-item"
            :style="{ backgroundColor: color, color }"
            :aria-label="t('主题色 {0}', [color])"
            @click="theme.color = color"
          >
            <el-icon v-if="theme.color === color"><Check /></el-icon>
          </button>
          <el-color-picker
            :model-value="theme.color"
            :teleported="false"
            class="ele-setting-color-picker"
            @change="setColor"
          />
        </div>
        <SettingItem :title="t('暗黑模式')">
          <el-switch v-model="theme.dark" :aria-label="t('暗黑模式')" size="small" />
        </SettingItem>
        <SettingItem :title="t('圆角主题')">
          <el-switch
            v-model="theme.rounded"
            :aria-label="t('圆角主题')"
            size="small"
          />
        </SettingItem>
        <el-divider />
        <div class="ele-setting-title muted"> {{ t("导航布局") }} </div>
        <div class="ele-setting-theme">
          <div
            v-for="item in ['default', 'top', 'mix'] as const"
            :key="item"
            class="ele-setting-theme-item"
          >
            <button
              :class="[
                'ele-setting-theme-item-cover',
                item === 'default'
                  ? 'ele-setting-side-dark ele-setting-layout-side'
                  : item === 'top'
                    ? 'ele-setting-head-dark ele-setting-layout-top'
                    : 'ele-setting-layout-mix',
              ]"
              :aria-label="t('{0} 导航布局', [item])"
              @click="theme.layout = item"
            >
              <el-icon
                v-if="theme.layout === item"
                color="var(--el-color-primary)"
              >
                <Check />
              </el-icon>
            </button>
            <div>
              {{
                { default: t("侧栏导航"), top: t("顶部导航"), mix: t("混合导航") }[item]
              }}
            </div>
          </div>
        </div>
        <SettingItem :title="t('双侧栏')">
          <el-switch
            :model-value="theme.sidebarLayout === 'mix'"
            :disabled="theme.layout === 'top'"
            size="small"
            @update:model-value="setDoubleSidebar"
          />
        </SettingItem>
        <SettingItem :title="t('二级暗色侧栏')">
          <el-switch
            :model-value="theme.mixSidebarStyle === 'dark'"
            :disabled="theme.sidebarLayout !== 'mix'"
            size="small"
            @update:model-value="setSecondSidebarDark"
          />
        </SettingItem>
        <el-divider />
        <SettingItem :title="t('固定主体')">
          <el-switch v-model="theme.fixedBody" size="small" />
        </SettingItem>
        <SettingItem :title="t('固定顶栏')">
          <el-switch
            v-model="theme.fixedHeader"
            :disabled="theme.fixedBody"
            size="small"
          />
        </SettingItem>
        <SettingItem :title="t('固定侧栏')">
          <el-switch
            v-model="theme.fixedSidebar"
            :disabled="theme.fixedBody || theme.layout === 'top'"
            size="small"
          />
        </SettingItem>
        <SettingItem :title="t('Logo 置于顶栏')">
          <el-switch
            v-model="theme.logoInHeader"
            :disabled="theme.layout === 'top'"
            size="small"
          />
        </SettingItem>
        <SettingItem :title="t('彩色菜单图标')">
          <el-switch v-model="theme.colorfulIcon" size="small" />
        </SettingItem>
        <SettingItem :title="t('菜单排他展开')">
          <el-switch v-model="theme.uniqueOpened" size="small" />
        </SettingItem>
        <SettingItem :title="t('内容区域铺满')">
          <el-switch v-model="theme.fluid" size="small" />
        </SettingItem>
        <el-divider />
        <SettingItem :title="t('显示页签')">
          <el-switch v-model="theme.tabBar" size="small" />
        </SettingItem>
        <SettingItem :title="t('页签置于顶栏')">
          <el-switch
            v-model="theme.tabInHeader"
            :disabled="!theme.tabBar"
            size="small"
          />
        </SettingItem>
        <SettingItem :title="t('页签风格')">
          <el-select
            v-model="theme.tabStyle"
            :disabled="!theme.tabBar"
            size="small"
            :teleported="false"
            style="width: 90px"
          >
            <el-option
              v-for="(label, key) in {
                simple: t('默认'),
                indicator: t('圆点'),
                tag: t('标签'),
                button: t('卡片'),
              }"
              :key="key"
              :value="key"
              :label="label"
            />
          </el-select>
        </SettingItem>
      </template>
      <div v-else class="ele-setting-layout-list">
        <button
          v-for="item in layoutPresets"
          :key="item.name"
          class="ele-setting-layout-item"
          :class="{ 'is-active': activeLayout === item.name }"
          @click="selectLayout(item)"
        >
          <div class="ele-setting-layout-item-cover">
            <component :is="layoutCovers[item.cover]" />
          </div>
          <div class="ele-setting-layout-item-label">
            {{ layoutNames[item.name] || item.name }}
          </div>
        </button>
      </div>
      <el-divider />
      <div class="ele-setting-footer">
        <el-button
          size="small"
          @click="
            $emit('reset');
            activeLayout = '';
          "
        > {{ t("重置主题设置") }} </el-button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.studio-theme-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
button {
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  text-align: inherit;
}
.ele-setting-layout-item {
  width: 100%;
}
</style>
