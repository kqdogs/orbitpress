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
  { path: "/dashboard", meta: { title: "概览", icon: House, closable: false } },
  {
    path: "/content",
    meta: { title: "内容管理", icon: Document },
    children: [
      { path: "/posts", meta: { title: "所有文章", icon: Document } },
      { path: "/import", meta: { title: "文章采集", icon: Download } },
      { path: "/pages", meta: { title: "所有页面", icon: Files } },
      { path: "/categories", meta: { title: "分类目录", icon: Folder } },
      { path: "/media", meta: { title: "媒体库", icon: Picture } },
    ],
  },
  {
    path: "/appearance",
    meta: { title: "外观设计", icon: Brush },
    children: [
      { path: "/home", meta: { title: "页面装修", icon: Brush } },
      { path: "/header", meta: { title: "页头与导航", icon: Menu } },
      { path: "/settings", meta: { title: "品牌与介绍", icon: Postcard } },
      { path: "/footer", meta: { title: "页脚与关注", icon: ChatDotRound } },
    ],
  },
  {
    path: "/system",
    meta: { title: "系统设置", icon: Setting },
    children: [
      { path: "/permalinks", meta: { title: "固定链接", icon: Link } },
      { path: "/access", meta: { title: "后台路径", icon: Lock } },
      { path: "/password", meta: { title: "修改密码", icon: Lock } },
      { path: "/integrations", meta: { title: "API 连接", icon: Key } },
      { path: "/audit", meta: { title: "操作记录", icon: List } },
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
        meta: { title: "概览", closable: false },
      },
      {
        path: "/posts",
        component: () => import("./pages/Posts.vue"),
        meta: { title: "所有文章" },
      },
      { path: "/import", component: () => import("./pages/Import.vue"), meta: { title: "文章采集" } },
      {
        path: "/pages",
        component: () => import("./pages/Pages.vue"),
        meta: { title: "所有页面" },
      },
      {
        path: "/editor/:id?",
        component: () => import("./pages/PostEditor.vue"),
        meta: { title: "编辑文章", active: "/posts", hide: true },
      },
      {
        path: "/page-editor/:id?",
        component: () => import("./pages/PageEditor.vue"),
        meta: { title: "编辑页面", active: "/pages", hide: true },
      },
      {
        path: "/categories",
        component: () => import("./pages/Categories.vue"),
        meta: { title: "分类目录" },
      },
      {
        path: "/media",
        component: () => import("./pages/Media.vue"),
        meta: { title: "媒体库" },
      },
      {
        path: "/home",
        component: () => import("./pages/Builder.vue"),
        meta: { title: "页面装修" },
      },
      ...["header", "footer", "settings", "permalinks", "access"].map(
        (path) => ({
          path: `/${path}`,
          component: settings,
          meta: {
            title: (
              {
                header: "页头与导航",
                footer: "页脚与关注",
                settings: "品牌与介绍",
                permalinks: "固定链接",
                access: "后台路径",
              } as Record<string, string>
            )[path],
          },
        }),
      ),
      {
        path: "/integrations",
        component: () => import("./pages/Integrations.vue"),
        meta: { title: "API 连接" },
      },
      {
        path: "/audit",
        component: () => import("./pages/Audit.vue"),
        meta: { title: "操作记录" },
      },
      {
        path: "/password",
        component: () => import("./pages/Password.vue"),
        meta: { title: "修改密码" },
      },
      { path: "/:pathMatch(.*)*", redirect: "/dashboard" },
    ],
  });
}
