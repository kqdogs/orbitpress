<script setup lang="ts">
import { ref } from "vue";
import { useStudio } from "../store";
import { request } from "../../admin/api";
import type { Session } from "../types";
const store = useStudio(),
  { busy, error, message } = store;
const username = ref(""),
  password = ref("");
function login() {
  void store.run(async () => {
    store.session.value = await request<Session>("/api/auth/login", {
      method: "POST",
      body: { username: username.value, password: password.value },
    });
    password.value = "";
    await store.refresh();
  });
}
</script>
<template>
  <div class="studio-login">
    <el-card>
      <img src="/images/yachin-mark.svg" width="48" height="48" alt="" />
      <h1>内容工作台</h1>
      <p>欢迎回来，继续你的创作。</p>
      <el-alert v-if="error" :title="error" type="error" :closable="false" />
      <el-alert v-if="message" :title="message" type="success" :closable="false" />
      <el-form label-position="top" @submit.prevent="login">
        <el-form-item label="用户名">
          <el-input
            v-model="username"
            autocomplete="username"
            aria-label="用户名"
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="password"
            type="password"
            show-password
            autocomplete="current-password"
            aria-label="密码"
          />
        </el-form-item>
        <el-button
          type="primary"
          native-type="submit"
          :loading="busy"
          :disabled="!username || !password"
          class="full-width"
        >
          登录工作台
        </el-button>
      </el-form>
      <a href="/">返回网站首页</a>
    </el-card>
  </div>
</template>
