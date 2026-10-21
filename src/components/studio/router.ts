import {t} from '../../lib/i18n/client';
import { createRouter, createWebHashHistory } from "vue-router";
import {
  House,
  Document,
  Download,
  Files,
  Folder,
  Picture,
  Brush,
  Setting,
  Link,
  Key,
  List,
  Lock,
  Menu,
  Postcard,
  ChatDotRound,
} from "@element-plus/icons-vue";
export const menuItems = [
  { path: "/dashboard", meta: { title: t("概览"), icon: House, closable: false } },
  {
    path: "/content",
    meta: { title: t("内容管理"), icon: Document },
    children: [
      { path: "/posts", meta: { title: t("所有文章"), icon: Document } },
      { path: "/import", meta: { title: t("文章采集"), icon: Download } },
      { path: "/pages", meta: { title: t("所有页面"), icon: Files } },
      { path: "/categories", meta: { title: t("分类目录"), icon: Folder } },
      { path: "/media", meta: { title: t("媒体库"), icon: Picture } },
    ],
  },
  {
    path: "/appearance",
    meta: { title: t("外观设计"), icon: Brush },
    children: [
      { path: "/home", meta: { title: t("页面装修"), icon: Brush } },
      { path: "/header", meta: { title: t("页头与导航"), icon: Menu } },
      { path: "/settings", meta: { title: t("品牌与介绍"), icon: Postcard } },
      { path: "/footer", meta: { title: t("页脚与关注"), icon: ChatDotRound } },
    ],
  },
  {
    path: "/system",
    meta: { title: t("系统设置"), icon: Setting },
    children: [
      { path: "/permalinks", meta: { title: t("固定链接"), icon: Link } },
      { path: "/access", meta: { title: t("后台路径"), icon: Lock } },
      { path: "/password", meta: { title: t("修改密码"), icon: Lock } },
      { path: "/integrations", meta: { title: t("API 连接"), icon: Key } },
      { path: "/audit", meta: { title: t("操作记录"), icon: List } },
    ],
  },
];
const settings = () => import("./pages/Settings.vue");
export function createStudioRouter() {
  return createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: "/", redirect: "/dashboard" },
      {
        path: "/dashboard",
        component: () => import("./pages/Dashboard.vue"),
        meta: { title: t("概览"), closable: false },
      },
      {
        path: "/posts",
        component: () => import("./pages/Posts.vue"),
        meta: { title: t("所有文章") },
      },
      { path: "/import", component: () => import("./pages/Import.vue"), meta: { title: t("文章采集") } },
      {
        path: "/pages",
        component: () => import("./pages/Pages.vue"),
        meta: { title: t("所有页面") },
      },
      {
        path: "/editor/:id?",
        component: () => import("./pages/PostEditor.vue"),
        meta: { title: t("编辑文章"), active: "/posts", hide: true },
      },
      {
        path: "/page-editor/:id?",
        component: () => import("./pages/PageEditor.vue"),
        meta: { title: t("编辑页面"), active: "/pages", hide: true },
      },
      {
        path: "/categories",
        component: () => import("./pages/Categories.vue"),
        meta: { title: t("分类目录") },
      },
      {
        path: "/media",
        component: () => import("./pages/Media.vue"),
        meta: { title: t("媒体库") },
      },
      {
        path: "/home",
        component: () => import("./pages/Builder.vue"),
        meta: { title: t("页面装修") },
      },
      ...["header", "footer", "settings", "permalinks", "access"].map(
        (path) => ({
          path: `/${path}`,
          component: settings,
          meta: {
            title: (
              {
                header: t("页头与导航"),
                footer: t("页脚与关注"),
                settings: t("品牌与介绍"),
                permalinks: t("固定链接"),
                access: t("后台路径"),
              } as Record<string, string>
            )[path],
          },
        }),
      ),
      {
        path: "/integrations",
        component: () => import("./pages/Integrations.vue"),
        meta: { title: t("API 连接") },
      },
      {
        path: "/audit",
        component: () => import("./pages/Audit.vue"),
        meta: { title: t("操作记录") },
      },
      {
        path: "/password",
        component: () => import("./pages/Password.vue"),
        meta: { title: t("修改密码") },
      },
      { path: "/:pathMatch(.*)*", redirect: "/dashboard" },
    ],
  });
}
