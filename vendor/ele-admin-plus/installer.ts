/** 全局安装 */
import type { App, Plugin } from 'vue';
import * as components from './components';

export const installer: Plugin = {
  install(app: App) {
    Object.keys(components).forEach((key) => {
      app.component(components[key].name, components[key]);
    });
  }
};
