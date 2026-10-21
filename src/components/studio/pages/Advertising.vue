<script setup lang="ts">
import { computed } from 'vue';
import EleCard from 'ele-admin-plus/es/ele-card';
import { t } from '../../../lib/i18n/client';
import { useSettingsDraft } from '../shared/settingsDraft';
import PageTitle from '../shared/PageTitle.vue';

const { value, save, store } = useSettingsDraft();
const ads = computed(() => value.value.advertising);
const placements = [
  { key: 'home', label: t('首页底部广告位') },
  { key: 'articleTop', label: t('文章顶部广告位') },
  { key: 'articleBottom', label: t('文章底部广告位') },
  { key: 'sidebar', label: t('装修组件广告位') },
] as const;
const adsTxt = computed(() => ads.value.clientId ? `google.com, ${ads.value.clientId.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0` : '');
const submit = () => store.run(save, t('广告设置已保存'));
</script>
<template>
  <PageTitle :title="t('Google 广告')" :description="t('填写发布商 ID 验证站点，通过 AdSense 审核后再启用广告。')" />
  <EleCard class="advertising-settings">
    <el-alert :title="t('没有 AdSense 账号也可先保存配置；默认关闭，不会加载广告。')" type="info" :closable="false" show-icon />
    <el-form label-position="top" :disabled="store.busy.value" @submit.prevent="submit">
      <el-form-item :label="t('发布商 ID')">
        <el-input v-model="ads.clientId" placeholder="ca-pub-…" :maxlength="23" :aria-label="t('发布商 ID')" />
        <p class="field-help">{{ t('只填 ID，不要粘贴 script 代码。保存后生成站点验证 meta 和 /ads.txt。') }}</p>
      </el-form-item>
      <el-form-item :label="t('启用广告')"><el-switch v-model="ads.enabled" /></el-form-item>
      <el-alert :title="t('自动广告的开关与位置在 AdSense 中配置；下方 ID 用于本站的手动广告位，留空则不显示。')" type="info" :closable="false" />
      <el-form-item v-for="placement in placements" :key="placement.key" :label="placement.label">
        <el-input v-model="ads.slots[placement.key]" :placeholder="t('10 位数字，留空不显示')" :maxlength="10" :aria-label="placement.label" />
      </el-form-item>
      <p class="field-help">{{ t('在页面装修组件库添加 Google 广告，可拖放到正文或左右侧栏。预览只显示占位。') }}</p>
      <el-divider />
      <el-form-item :label="t('隐私联系邮箱')"><el-input v-model="ads.privacyContact" type="email" :maxlength="180" :aria-label="t('隐私联系邮箱')" /></el-form-item>
      <el-form-item :label="t('隐私政策补充（Markdown）')"><el-input v-model="ads.privacyPolicy" type="textarea" :rows="6" :maxlength="20000" :aria-label="t('隐私政策补充（Markdown）')" /></el-form-item>
      <p class="field-help">{{ t('补充站长身份、实际使用的服务、数据保留和访问者权利。内置说明不是完整的法律文件。') }}</p>
      <el-form-item>
        <el-checkbox v-model="ads.consentReady">{{ t('我已核对隐私政策，并在 AdSense 隐私与消息中完成适用地区的 Google 认证 CMP 设置') }}</el-checkbox>
      </el-form-item>
      <p class="field-help">{{ t('此选项仅记录站长确认，不会代替访问者同意或创建认证 CMP。未确认不能启用广告。') }}</p>
      <div class="advertising-links">
        <el-link href="/privacy/" target="_blank" rel="noopener noreferrer" type="primary">{{ t('查看隐私政策') }}</el-link>
        <el-link href="/ads.txt" target="_blank" rel="noopener noreferrer" type="primary">{{ t('查看 ads.txt') }}</el-link>
        <el-link href="https://www.google.com/adsense/" target="_blank" rel="noopener noreferrer" type="primary">Google AdSense ↗</el-link>
      </div>
      <el-form-item v-if="adsTxt" :label="t('保存后的 ads.txt 内容')"><el-input :model-value="adsTxt" readonly :aria-label="t('保存后的 ads.txt 内容')" /></el-form-item>
      <el-button type="primary" native-type="submit" :loading="store.busy.value">{{ t('保存广告设置') }}</el-button>
    </el-form>
  </EleCard>
</template>
<style scoped>
.advertising-settings{max-width:900px}.advertising-settings :deep(.el-alert){margin-bottom:24px}.advertising-settings :deep(.el-checkbox){height:auto;white-space:normal;align-items:flex-start}.advertising-settings :deep(.el-checkbox__label){white-space:normal;line-height:1.6}.advertising-links{display:flex;flex-wrap:wrap;gap:20px;margin:16px 0 24px}
</style>
