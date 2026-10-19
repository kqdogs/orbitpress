import type { App, Plugin, Component } from 'vue';
import * as components from './core-components';

export const installer: Plugin = {
  install(app: App) {
    Object.keys(components).forEach((key) => {
      app.component(
        (components as unknown as Record<string, Component>)[key].name!,
        (components as unknown as Record<string, Component>)[key]
      );
    });
  }
};
