import { inject, computed } from "vue";
import { findTree, mapTree, omit } from "../utils/common";
import { LAYOUT_KEY } from "../ele-admin-layout/props";
import { PRO_LAYOUT_KEY } from "./props";
function findMenuByPath(path, menus) {
  return path == null ? void 0 : findTree(menus, (d) => path === d.path);
}
function findTabByPath(path, tabs) {
  if (path != null && tabs != null) {
    return tabs.find((d) => path === d.key || path === d.fullPath);
  }
}
function findTabByKey(key, tabs) {
  if (key != null && tabs != null) {
    return tabs.find((d) => key === d.key);
  }
}
function getMatchedMenus(path, menus, parents) {
  for (const m of menus) {
    const p = parents ? [...parents, m] : [m];
    if (m.path === path) {
      return p;
    } else if (m.children?.length) {
      const result = getMatchedMenus(path, m.children, p);
      if (result) {
        return result;
      }
    }
  }
}
function getRouteMatched(route, menus) {
  const { path, fullPath, meta } = route;
  if (meta?.active) {
    const m2 = findMenuByPath(fullPath, menus) ?? findMenuByPath(path, menus);
    return {
      active: meta.active,
      activeOther: true,
      title: m2?.meta?.title ?? meta.title,
      menu: m2,
      matched: getMatchedMenus(meta.active, menus)
    };
  }
  const fm = findMenuByPath(fullPath, menus);
  if (fm) {
    return {
      active: fullPath,
      title: fm.meta?.title ?? meta.title,
      menu: fm,
      matched: getMatchedMenus(fullPath, menus)
    };
  }
  const m = findMenuByPath(path, menus);
  return {
    active: path,
    title: m?.meta?.title ?? meta.title,
    menu: m,
    matched: getMatchedMenus(path, menus)
  };
}
function getMatchedLevels(matched, activeOther, route, menus, tabs) {
  const levels = [];
  if (matched) {
    matched.forEach((m) => {
      if (m.meta && m.meta.title && m.meta.breadcrumb !== false) {
        const title = findTabByPath(m.path, tabs)?.title || m.meta.title;
        levels.push({ path: m.path, title });
      }
    });
  }
  if (activeOther) {
    const { path, fullPath, meta } = route;
    const notIn = !levels.length || fullPath !== levels[levels.length - 1].path;
    if (notIn && meta.title) {
      const m = findMenuByPath(fullPath, menus) ?? findMenuByPath(path, menus);
      const t = findTabByPath(fullPath, tabs) ?? findTabByPath(path, tabs);
      const title = t?.title || m?.meta?.title || meta.title;
      levels.push({ path: fullPath, title });
    }
  }
  return levels;
}
function getMatchedComponents(matched) {
  const components = [];
  matched.forEach((m) => {
    if (m.components?.default?.name) {
      components.push(m.components.default.name);
    }
  });
  return components;
}
function getRouteTab(route, tabs, homePath, routeTitle, routeMenu) {
  const { path, fullPath, meta, matched, params } = route;
  const key = meta.tabUnique === false ? fullPath : path;
  const t = findTabByPath(key, tabs);
  const title = t?.title || routeTitle;
  const home = path === homePath || fullPath === homePath;
  const closable = t?.closable ?? meta.closable !== false;
  const components = getMatchedComponents(matched);
  const { iframe, iframeTitle } = meta.iframe || meta.openType === "iframe" ? {
    iframe: getIframeUrl(params, meta.iframe),
    iframeTitle: getIframeTitle(params.title)
  } : {
    iframe: meta.iframe,
    iframeTitle: void 0
  };
  return {
    key,
    path,
    fullPath,
    title: iframeTitle || title,
    closable,
    home,
    components,
    meta: { ...routeMenu?.meta || {}, ...meta, iframe }
  };
}
function getActiveChilds(menus, active, childrenName) {
  const field = childrenName || "children";
  if (!menus.length) {
    return [];
  }
  if (!active) {
    return menus[0][field] || [];
  }
  const m = menus.find((m2) => m2.path === active);
  if (m == null) {
    return menus[0][field] || [];
  }
  return m[field] || [];
}
function getIframeUrl(routeParams, defaultUrl) {
  const { url } = routeParams;
  const pathUrl = Array.isArray(url) ? url[0] : url;
  return (pathUrl ? decodeURIComponent(pathUrl) : void 0) || defaultUrl;
}
function getIframeTitle(title) {
  try {
    return decodeURIComponent((Array.isArray(title) ? title[0] : title) || "");
  } catch (e) {
    console.error(e);
  }
  return String(title || "");
}
function getIframeSrc(routeFullPath, iframeUrl) {
  const [_path1, query1 = ""] = (routeFullPath ?? "").split("?");
  const [path2, query2 = ""] = (iframeUrl ?? "").split("?");
  const params1 = new URLSearchParams(query1);
  const params2 = new URLSearchParams(query2);
  for (const [key, value] of params2.entries()) {
    params1.append(key, value);
  }
  const newQuery = params1.toString();
  return `${path2}${newQuery ? `?${newQuery}` : ""}`;
}
function getMenuItems(menus, link) {
  return mapTree(menus, (m) => {
    const { path, meta } = m;
    const { hide, icon, title, props, openTarget } = meta ?? {};
    if (hide) {
      return;
    }
    const item = {
      title,
      icon,
      path: link ? path : void 0,
      index: path,
      pathTarget: openTarget,
      ...omit(props, ["title", "icon", "path", "index"]),
      meta
    };
    return item;
  });
}
function useLayoutState() {
  return inject(LAYOUT_KEY, {});
}
function useProLayoutState() {
  return inject(PRO_LAYOUT_KEY, {});
}
function useResponsive(props) {
  const state = useProLayoutState();
  return computed(() => props.responsive ?? state.responsive ?? true);
}
export {
  findMenuByPath,
  findTabByKey,
  findTabByPath,
  getActiveChilds,
  getIframeSrc,
  getIframeTitle,
  getIframeUrl,
  getMatchedComponents,
  getMatchedLevels,
  getMatchedMenus,
  getMenuItems,
  getRouteMatched,
  getRouteTab,
  useLayoutState,
  useProLayoutState,
  useResponsive
};
