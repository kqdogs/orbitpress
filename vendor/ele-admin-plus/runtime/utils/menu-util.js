import { defineComponent, computed, h } from "vue";
import { useProLayoutState } from "../ele-pro-layout/util";
import IframeItem from "../ele-pro-layout/components/iframe-item";
import { isExternalLink, findTree } from "./common";
function getIframeRouteComponent(menu, name) {
  const menuComponent = menu.component;
  const menuKeepAlive = menu.meta?.keepAlive !== false;
  return defineComponent({
    name,
    setup() {
      const proLayoutState = useProLayoutState();
      const keepAlive = computed(() => !!proLayoutState.keepAlive);
      return () => {
        if (!menuKeepAlive || !keepAlive.value) {
          return h(IframeItem, { menuComponent });
        }
        return h("div", { class: "ele-none", style: { display: "none" } });
      };
    }
  });
}
function camelCase(str) {
  const val = str.replace(/[-|/](\w)/g, (_, c) => c ? c.toUpperCase() : "");
  return val.charAt(0).toUpperCase() + val.slice(1);
}
function pathIsAdd(path, data) {
  return findTree(data, (d) => path === d.path) != null;
}
function getRoutePath(path) {
  if (!path || !path.includes("?") || path.endsWith("?")) {
    return path;
  }
  return path.substring(0, path.indexOf("?"));
}
function menuToRoutes(menus, getComponent, added, iframePageUrl, iframePageName) {
  if (!menus?.length) {
    return;
  }
  const routes = [];
  const addedRoutes = added ? [...added] : [];
  menus.forEach((item) => {
    const meta = { ...item.meta };
    const itemPath = getRoutePath(item.path);
    const path = meta.routePath || itemPath;
    if (!path || isExternalLink(path) || meta.openType === "external" || pathIsAdd(path, addedRoutes)) {
      const childs = menuToRoutes(
        item.children,
        getComponent,
        addedRoutes,
        iframePageUrl,
        iframePageName
      );
      if (childs) {
        childs.forEach((child) => {
          routes.push(child);
        });
      }
      return;
    }
    const name = item.name || camelCase(path);
    let component;
    if (meta.openType === "iframe" || isExternalLink(item.component)) {
      if (item.component && item.component.startsWith("c://")) {
        const link = `${itemPath || ""}${iframePageUrl || "/page"}`;
        const linkName = `${name}${iframePageName || "Page"}`;
        component = getIframeRouteComponent({ ...item, component: link }, name);
        meta.iframe = link;
        if (meta.hideFooter == null) {
          meta.hideFooter = true;
        }
        if (!pathIsAdd(link, addedRoutes)) {
          const pageComponent = item.component.slice(3);
          addedRoutes.push({ path: link });
          routes.push({
            name: linkName,
            path: link,
            component: getComponent(pageComponent, item, linkName),
            redirect: void 0,
            props: item.props,
            meta: { ...meta, iframe: void 0, layout: false }
          });
        }
      } else {
        component = getIframeRouteComponent(item, name);
        meta.iframe = item.component;
        if (meta.hideFooter == null) {
          meta.hideFooter = true;
        }
      }
    } else {
      component = getComponent(item.component, item, name);
    }
    addedRoutes.push({ path });
    routes.push({
      name,
      path,
      component,
      redirect: item.redirect,
      props: item.props,
      meta,
      children: menuToRoutes(
        item.children,
        getComponent,
        addedRoutes,
        iframePageUrl,
        iframePageName
      )
    });
  });
  return routes;
}
export {
  getIframeRouteComponent,
  menuToRoutes
};
