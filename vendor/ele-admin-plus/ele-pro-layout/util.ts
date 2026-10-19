import { inject, computed } from 'vue';
import type {
  RouteLocationNormalizedLoaded,
  RouteLocationMatched
} from 'vue-router';
import type { EleMenuItemProps } from '../ele-app/plus';
import { findTree, mapTree, omit } from '../utils/common';
import type { LayoutProvide } from '../ele-admin-layout/types';
import { LAYOUT_KEY } from '../ele-admin-layout/props';
import { PRO_LAYOUT_KEY } from './props';
import type {
  MenuItem,
  TabItem,
  LevelItem,
  MatchedResult,
  ProLayoutProvide,
  ResponsiveProps
} from './types';

/**
 * 根据菜单地址获取菜单
 * @param path 菜单地址
 * @param menus 菜单数据
 */
export function findMenuByPath(path?: string, menus?: MenuItem[]) {
  return path == null ? void 0 : findTree(menus, (d) => path === d.path);
}

/**
 * 根据路由地址获取页签
 * @param path 路由地址
 * @param tabs 页签数据
 */
export function findTabByPath(path?: string, tabs?: TabItem[] | null) {
  if (path != null && tabs != null) {
    return tabs.find((d) => path === d.key || path === d.fullPath);
  }
}

/**
 * 根据页签标识获取页签
 * @param key 页签标识
 * @param tabs 页签数据
 */
export function findTabByKey(key?: string, tabs?: TabItem[] | null) {
  if (key != null && tabs != null) {
    return tabs.find((d) => key === d.key);
  }
}

/**
 * 根据菜单地址获取菜单及所有父级
 * @param path 菜单地址
 * @param menus 菜单数据
 */
export function getMatchedMenus(
  path: string,
  menus: MenuItem[],
  parents?: MenuItem[]
): MenuItem[] | undefined {
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

/**
 * 获取路由匹配的菜单数据
 * @param route 路由信息
 * @param menus 菜单数据
 */
export function getRouteMatched(
  route: RouteLocationNormalizedLoaded,
  menus: MenuItem[]
): MatchedResult {
  const { path, fullPath, meta } = route;
  if (meta?.active) {
    const m = findMenuByPath(fullPath, menus) ?? findMenuByPath(path, menus);
    return {
      active: meta.active as string,
      activeOther: true,
      title: m?.meta?.title ?? (meta.title as string),
      menu: m,
      matched: getMatchedMenus(meta.active as string, menus)
    };
  }
  const fm = findMenuByPath(fullPath, menus);
  if (fm) {
    return {
      active: fullPath,
      title: fm.meta?.title ?? (meta.title as string),
      menu: fm,
      matched: getMatchedMenus(fullPath, menus)
    };
  }
  const m = findMenuByPath(path, menus);
  return {
    active: path,
    title: m?.meta?.title ?? (meta.title as string),
    menu: m,
    matched: getMatchedMenus(path, menus)
  };
}

/**
 * 获取面包屑导航数据
 * @param matched 匹配的菜单数据
 * @param activeOther 是否选中非本身
 * @param route 路由信息
 * @param menus 菜单数据
 * @param tabs 页签数据
 */
export function getMatchedLevels(
  matched: MenuItem[] | undefined,
  activeOther: boolean | undefined,
  route: RouteLocationNormalizedLoaded,
  menus: MenuItem[],
  tabs: TabItem[]
): LevelItem[] {
  const levels: LevelItem[] = [];
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
      const title = t?.title || m?.meta?.title || (meta.title as string);
      levels.push({ path: fullPath, title });
    }
  }
  return levels;
}

/**
 * 获取路由对应的组件名称
 * @param matched 路由匹配数据
 */
export function getMatchedComponents(matched: RouteLocationMatched[]) {
  const components: string[] = [];
  matched.forEach((m) => {
    if (m.components?.default?.name) {
      components.push(m.components.default.name);
    }
  });
  return components;
}

/**
 * 返回路由对应的页签数据
 * @param route 路由信息
 * @param tabs 当前页签数据
 * @param homePath 主页地址
 * @param routeTitle 路由对应的标题
 * @param routeMenu 路由对应的菜单
 */
export function getRouteTab(
  route: RouteLocationNormalizedLoaded,
  tabs: TabItem[],
  homePath: string | undefined,
  routeTitle?: string,
  routeMenu?: MenuItem
): TabItem {
  const { path, fullPath, meta, matched, params } = route;
  const key = meta.tabUnique === false ? fullPath : path;
  const t = findTabByPath(key, tabs);
  // 标题
  const title = t?.title || routeTitle;
  // 是否是主页
  const home = path === homePath || fullPath === homePath;
  // 是否可关闭
  const closable = t?.closable ?? meta.closable !== false;
  // 路由对应的组件名
  const components = getMatchedComponents(matched);
  // 内嵌地址及内嵌标题获取
  const { iframe, iframeTitle } =
    meta.iframe || meta.openType === 'iframe'
      ? {
          iframe: getIframeUrl(params, meta.iframe as string | undefined),
          iframeTitle: getIframeTitle(params.title)
        }
      : {
          iframe: meta.iframe as string | undefined,
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
    meta: { ...(routeMenu?.meta || {}), ...meta, iframe }
  };
}

/**
 * 获取选中菜单的子级
 * @param menus 菜单数据
 * @param active 选中地址
 * @param childrenName 子级字段名称
 */
export function getActiveChilds(
  menus: MenuItem[],
  active?: string,
  childrenName?: string
): MenuItem[] {
  const field = childrenName || 'children';
  if (!menus.length) {
    return [];
  }
  if (!active) {
    return menus[0][field] || [];
  }
  const m = menus.find((m) => m.path === active);
  if (m == null) {
    return menus[0][field] || [];
  }
  return m[field] || [];
}

/**
 * 获取内嵌地址
 * @param routeParams 动态路由参数
 * @param defaultUrl 默认地址
 */
export function getIframeUrl(
  routeParams: Record<string, any>,
  defaultUrl?: string
): string | undefined {
  const { url } = routeParams;
  const pathUrl: string | undefined = Array.isArray(url) ? url[0] : url;
  return (pathUrl ? decodeURIComponent(pathUrl) : void 0) || defaultUrl;
}

/**
 * 获取内嵌标题
 * @param title 动态路由参数传递的标题
 */
export function getIframeTitle(title?: string | Array<string>) {
  try {
    return decodeURIComponent((Array.isArray(title) ? title[0] : title) || '');
  } catch (e) {
    console.error(e);
  }
  return String(title || '');
}

/**
 * 拼接内嵌地址合并路由参数
 * @param routeFullPath 路由地址含参数
 * @param iframeUrl 内嵌地址
 */
export function getIframeSrc(
  routeFullPath?: string,
  iframeUrl?: string
): string {
  const [_path1, query1 = ''] = (routeFullPath ?? '').split('?');
  const [path2, query2 = ''] = (iframeUrl ?? '').split('?');
  const params1 = new URLSearchParams(query1);
  const params2 = new URLSearchParams(query2);
  for (const [key, value] of (params2 as any).entries()) {
    params1.append(key, value);
  }
  const newQuery = params1.toString();
  return `${path2}${newQuery ? `?${newQuery}` : ''}`;
}

/**
 * 菜单数据转换
 * @param menus 菜单数据
 * @param link 是否使用超链接
 */
export function getMenuItems(
  menus: MenuItem[],
  link: boolean
): EleMenuItemProps[] {
  return mapTree<MenuItem, EleMenuItemProps>(menus, (m) => {
    const { path, meta } = m;
    const { hide, icon, title, props, openTarget } = meta ?? {};
    if (hide) {
      return;
    }
    const item: EleMenuItemProps = {
      title,
      icon,
      path: link ? path : void 0,
      index: path,
      pathTarget: openTarget,
      ...omit(props, ['title', 'icon', 'path', 'index']),
      meta
    };
    return item;
  });
}

/**
 * 获取布局共享数据
 */
export function useLayoutState(): LayoutProvide {
  return inject(LAYOUT_KEY, {});
}

/**
 * 获取高级布局共享数据
 */
export function useProLayoutState(): ProLayoutProvide {
  return inject(PRO_LAYOUT_KEY, {});
}

/**
 * 获取是否开启布局响应
 */
export function useResponsive(props: ResponsiveProps) {
  const state = useProLayoutState();
  return computed<boolean>(() => props.responsive ?? state.responsive ?? true);
}
