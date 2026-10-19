<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from 'vue';
import EleCard from 'ele-admin-plus/es/ele-card';
import { useStudio } from '../store';
import { request } from '../../admin/api';
import { passwordChangeInput } from '../../../lib/password-service-input';
import PageTitle from '../shared/PageTitle.vue';
const store = useStudio();
const form = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' });
const validation = ref('');
const clear = () => { form.currentPassword = ''; form.newPassword = ''; form.confirmPassword = ''; };
onBeforeUnmount(clear);
async function submit() {
  const result = passwordChangeInput.safeParse(form);
  if (!result.success) { validation.value = result.error.issues[0].message; return; }
  validation.value = '';
  await store.run(async () => {
    await request('/api/auth/password', { method: 'POST', csrf: store.session.value!.csrf, body: result.data });
    clear();
    store.session.value = null;
  }, '密码已修改，请使用新密码登录。');
}
</script>
<template>
  <PageTitle title="修改密码" description="更新管理员登录密码，保存成功后所有管理端登录会话将失效。" />
  <EleCard class="password-card">
    <el-alert v-if="validation" :title="validation" type="error" :closable="false" show-icon />
    <el-form label-position="top" @submit.prevent="submit">
      <el-form-item label="当前密码">
        <el-input v-model="form.currentPassword" type="password" show-password autocomplete="current-password" :maxlength="200" aria-label="当前密码" :disabled="store.busy.value" />
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="form.newPassword" type="password" show-password autocomplete="new-password" :maxlength="200" placeholder="至少 12 个字符，建议使用较长的独有密码" aria-label="新密码" :disabled="store.busy.value" />
      </el-form-item>
      <el-form-item label="确认新密码">
        <el-input v-model="form.confirmPassword" type="password" show-password autocomplete="new-password" :maxlength="200" aria-label="确认新密码" :disabled="store.busy.value" />
      </el-form-item>
      <p class="password-note">修改后请使用新密码登录。本地初始化文件中的旧密码将不再有效。</p>
      <el-button type="primary" native-type="submit" :loading="store.busy.value">保存新密码</el-button>
    </el-form>
  </EleCard>
</template>
<style scoped>
.password-card { max-width: 640px; }
.password-card :deep(.el-alert) { margin-bottom: 20px; }
.password-note { color: var(--el-text-color-secondary); line-height: 1.6; margin: 0 0 24px; }
</style>
