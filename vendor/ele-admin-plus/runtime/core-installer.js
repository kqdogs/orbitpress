import * as components from "./core-components";
const installer = {
  install(app) {
    Object.keys(components).forEach((key) => {
      app.component(
        components[key].name,
        components[key]
      );
    });
  }
};
export {
  installer
};
