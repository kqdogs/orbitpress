<script setup lang="ts">
import {t} from '../../../lib/i18n/client';
import { computed } from "vue";
import { Lock } from "@element-plus/icons-vue";
import SocialFields from "../shared/SocialFields.vue";
import CommunityCardFields from '../shared/CommunityCardFields.vue';
import NavigationFields from "../shared/NavigationFields.vue";
import { useRoute } from "vue-router";
import EleCard from "ele-admin-plus/es/ele-card";
import { useSettingsDraft } from "../shared/settingsDraft";
import PageTitle from "../shared/PageTitle.vue";
import { permalinkPresets } from "../../../lib/permalinks";
import { request } from "../../admin/api";
import { useAddressSettings } from "../shared/addressSettings";
import { adminPathInput, permalinkCustomInput } from "../../../lib/schema";
import {footerNavigation} from '../../../lib/footer-settings';
const route = useRoute(),
  { value, save, store } = useSettingsDraft(),
  { busy, dirty } = store;
const page = computed(() => route.path.slice(1));
const footerNav=computed({get:()=>footerNavigation(value.value),set:(links)=>{value.value.footerNav=links;}});
function customizeFooter(){value.value.footerNav=structuredClone(footerNavigation(value.value));}
const { adminSegment, primaryFormat, aliases, structure } =
  useAddressSettings(value);
const adminPathError = computed(() =>
  adminPathInput.safeParse(value.value.adminPath).success
    ? ""
    : t("请输入英文小写、数字或连字符，不能留空或使用系统路径。"),
);
const structureError = computed(() =>
  permalinkCustomInput.safeParse(value.value.permalinkCustom).success
    ? ""
    : t("结构须包含一次 %postname% 或 %post_id%，且不能使用系统路径或未知标记。"),
);
async function commit() {
  await store.run(async () => {
    if (adminPathError.value) throw new Error(adminPathError.value);
    if (structureError.value) throw new Error(structureError.value);
    const result = await save();
    if (location.pathname.replace(/\/$/, "") !== result.value.adminPath) {
      location.assign(`${result.value.adminPath}${location.hash}`);
    }
  }, t("设置已保存"));
}
async function upload(event: Event) {
  const target = event.target as HTMLInputElement,
    file = target.files?.[0];
  if (!file) return;
  await store.run(async () => {
    if (file.size > 5 * 1024 * 1024) throw new Error(t("图片不能超过 5MB"));
    const body = new FormData();
    body.set("file", file);
    const saved = await request<{ url: string }>("/api/admin/media", {
      method: "POST",
      csrf: store.session.value!.csrf,
      body,
    });
    value.value.logo = saved.url;
  }, t("Logo 已上传，请保存设置"));
  target.value = "";
}
function move(index: number, offset: number) {
  const next = [...value.value.headerNav],
    target = index + offset;
  if (target < 0 || target >= next.length) return;
  [next[index], next[target]] = [next[target], next[index]];
  value.value.headerNav = next;
}
</script>
<template>
  <PageTitle
    :title="String(route.meta.title)"
    :description="dirty ? t('有未保存的设置') : t('设置统一应用于全站。')"
  >
    <el-button type="primary" :loading="busy" @click="commit"> {{ t("保存设置") }} </el-button>
  </PageTitle>
  <EleCard class="settings-panel">
    <el-form label-position="top" :disabled="busy" @submit.prevent="commit">
      <template v-if="page === 'settings' || page === 'header'">
        <div class="brand-preview">
          <img
            :src="value.logo || '/images/yachin-mark.svg'"
            :alt="t('当前站点图标')"
          />
          <div>
            <strong>{{ value.title }}</strong>
            <span>{{ value.tagline }}</span>
          </div>
        </div>
        <el-form-item :label="t('站点标题')">
          <el-input v-model="value.title" maxlength="80" />
        </el-form-item>
        <el-form-item :label="t('副标题')">
          <el-input v-model="value.tagline" maxlength="120" />
        </el-form-item>
        <el-form-item :label="t('Logo 图片路径')">
          <el-input v-model="value.logo" :placeholder="t('/images/… 或 /media/…')" />
        </el-form-item>
        <label class="upload-button">
          <span> {{ t("上传 Logo") }} </span>
          <input
            type="file"
            :disabled="busy"
            accept="image/png,image/jpeg,image/webp"
            @change="upload"
          />
        </label>
        <el-form-item v-if="page === 'settings'" :label="t('站点描述')">
          <el-input
            v-model="value.description"
            type="textarea"
            :rows="4"
            maxlength="300"
          />
        </el-form-item>
      </template>
      <template v-if="page === 'header'">
        <el-divider content-position="left"> {{ t("页头导航") }} </el-divider>
        <p class="field-help"> {{ t("首页为系统默认入口，不依赖分类；未配置首页时会自动显示。可添加指向 / 的导航，自定义首页名称和位置。") }} </p>
        <NavigationFields v-model="value.headerNav" />
      </template>
      <template v-if="page === 'footer'">
        <el-form-item :label="t('底部版权信息')">
          <el-input v-model="value.footerCopyright" :aria-label="t('底部版权信息')" maxlength="300" placeholder="© {year} {title}"/>
          <p class="field-help"> {{ t("支持 {year} 自动年份、{title} 站点标题；留空使用默认版权信息。") }} </p>
        </el-form-item>
        <el-divider content-position="left"> {{ t("底部导航") }} </el-divider>
        <template v-if="value.footerNav!=null">
          <NavigationFields v-model="footerNav" compact :min-items="0"/>
          <el-button link @click="value.footerNav=null"> {{ t("恢复默认导航") }} </el-button>
        </template>
        <template v-else>
          <p class="field-help">{{ footerNav.map(item=>item.label).join(' / ') }} {{ t("；当前沿用默认导航。") }} </p>
          <el-button @click="customizeFooter"> {{ t("编辑底部导航") }} </el-button>
        </template>
        <el-divider content-position="left"> {{ t("关注与社交链接") }} </el-divider>
        <el-form-item :label="t('底部关注文案')">
          <el-input v-model="value.socialFollowText" maxlength="80" />
        </el-form-item>
        <SocialFields v-model="value" />
        <CommunityCardFields v-model="value" :disabled="busy"/>
      </template>
      <template v-if="page === 'permalinks'">
        <p> {{ t("选择主链接格式，或直接修改下面的结构。文章卡片、分享链接和站点地图使用主链接。") }} </p>
        <el-radio-group v-model="primaryFormat" class="permalink-options">
          <el-radio
            v-for="preset in permalinkPresets"
            :key="preset.value"
            :value="preset.value"
          >
            <strong>{{ t(preset.label) }}</strong>
            <code>{{ preset.template || value.permalinkCustom }}</code>
          </el-radio>
        </el-radio-group>
        <el-form-item :label="t('自定义结构')" :error="structureError">
          <el-input
            v-model="structure"
            :aria-label="t('固定链接结构')"
            placeholder="/blog/%postname%/"
            maxlength="180"
          />
        </el-form-item>
        <p class="field-help"> {{ t("选择任何预设后都能修改。修改会自动切换到自定义；使用一次 %postname% 或 %post_id% 标识文章，也支持 %year%、%monthnum%、%day%、%category%。") }} </p>
        <el-divider content-position="left"> {{ t("其他访问格式") }} </el-divider>
        <p class="field-help"> {{ t("可多选兼容地址，保留旧链接访问；主链接仍以上方选择为准。") }} </p>
        <el-checkbox-group
          v-model="aliases"
          class="permalink-options permalink-aliases"
        >
          <el-checkbox
            v-for="preset in permalinkPresets.filter(
              (item) => item.value !== primaryFormat,
            )"
            :key="preset.value"
            :value="preset.value"
          >
            <strong>{{ t(preset.label) }}</strong>
            <code>{{ preset.template || value.permalinkCustom }}</code>
          </el-checkbox>
        </el-checkbox-group>
      </template>
      <template v-if="page === 'access'">
        <el-form-item :label="t('后台访问路径')" :error="adminPathError">
          <el-input
            v-model="adminSegment"
            :aria-label="t('后台路径名称')"
            placeholder="admin"
            maxlength="79"
            :prefix-icon="Lock"
          >
            <template #prepend>/</template>
          </el-input>
          <p class="field-help"> {{ t("/ 为固定前缀，只需填写一段英文小写、数字或连字符。保存后会跳转到新地址，登录状态保留。") }} </p>
        </el-form-item>
        <el-alert
          :title="t('修改访问地址后，原 /admin 会跳转到新地址；身份验证与 API 地址保持统一。')"
          type="info"
          :closable="false"
        />
      </template>
    </el-form>
  </EleCard>
</template>
