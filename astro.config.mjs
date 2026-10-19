import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import vue from '@astrojs/vue';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  output: 'server', adapter: cloudflare({ imageService: 'compile', ...(process.env.BLOG_DEPLOY_CONFIG ? { configPath: process.env.BLOG_DEPLOY_CONFIG } : {}) }), integrations: [vue()], session: false,
  server: { port: 4321, host: '127.0.0.1' },
  devToolbar: { enabled: false },
  vite: {
    css: { preprocessorOptions: { scss: { additionalData: `@use "${fileURLToPath(new URL("./src/styles/studio-variables.scss",import.meta.url)).replaceAll("\\","/")}" as *;` } } },
    resolve: { alias: { 'ele-admin-plus/es': fileURLToPath(new URL('./vendor/ele-admin-plus/runtime', import.meta.url)) } },
  },
});
