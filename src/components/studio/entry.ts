import { createApp } from "vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from 'element-plus/es/locale/lang/en';
import {currentLocale} from '../../lib/i18n/client';
import { createStudioRouter } from "./router";
import App from "./StudioApp.vue";
import "element-plus/theme-chalk/src/index.scss";
import "element-plus/theme-chalk/dark/css-vars.css";
import "../../../vendor/ele-admin-plus/runtime/style/index.scss";
import "../../styles/studio-dark.scss";
import "../../styles/studio-rounded.scss";
import "../../styles/studio-theme.scss";
import "../../styles/studio.scss";
import "../../styles/scrollbars.css";
const params = new URLSearchParams(location.search);
if (!location.hash && params.has("view")) {
  const view = params.get("view") || "dashboard",
    id = params.get(view === "page-editor" ? "page" : "post");
  history.replaceState(
    null,
    "",
    `${location.pathname}#/${view}${id && ["editor", "page-editor"].includes(view) ? `/${encodeURIComponent(id)}` : ""}`,
  );
}
const app = createApp(App);
app.use(ElementPlus, { locale: currentLocale()==='en'?en:zhCn });
app.use(createStudioRouter());
app.mount("#studio");
