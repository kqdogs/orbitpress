import { defineComponent, computed, h } from 'vue';
import type {
  RouteRecordRaw,
  _RouteRecordBase,
  RouteComponent
} from 'vue-router';
import type { MenuItem } from '../ele-pro-layout/types';
import { useProLayoutState } from '../ele-pro-layout/util';
import IframeItem from '../ele-pro-layout/components/iframe-item.vue';
import { findTree, isExternalLink } from './common';

/**
 * 获取路由组件方法
 */
export type GetComponent = (
  component?: string,
  menu?: MenuItem,
  name?: string
) => (() => Promise<RouteComponent>) | RouteComponent | undefined;

/**
 * 获取内嵌页面路由组件
 * @param menu 菜单数据
 * @param name 组件名称
 */
export function getIframeRouteComponent(menu: MenuItem, name: string) {
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
        return h('div', { class: 'ele-none', style: { display: 'none' } });
      };
    }
  });
}

/**
 * 中划线斜线转驼峰
 * @param str 字符串
 */
function camelCase(str: string) {
  const val = str.replace(/[-|/](\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
  return val.charAt(0).toUpperCase() + val.slice(1);
}

/**
 * 判断路由地址是否已经添加
 * @param path 路由地址
 * @param data 路由数据
 */
function pathIsAdd(path: string, data: _RouteRecordBase[]): boolean {
  return findTree(data, (d) => path === d.path) != null;
}

/**
 * 菜单地址去掉参数用于路由地址
 * @param path 菜单地址
 */
function getRoutePath(path: string) {
  if (!path || !path.includes('?') || path.endsWith('?')) {
    return path;
  }
  return path.substring(0, path.indexOf('?'));
}

/**
 * 菜单数据转为路由数据
 * @param menus 菜单数据
 * @param getComponent 加载组件的方法
 * @param added 已添加的路由
 * @param iframePageUrl 内嵌组件的路由地址拼接
 * @param iframePageName 内嵌组件的路由名称拼接
 */
export function menuToRoutes(
  menus: MenuItem[] | undefined,
  getComponent: GetComponent,
  added?: _RouteRecordBase[],
  iframePageUrl?: string,
  iframePageName?: string
): RouteRecordRaw[] | undefined {
  if (!menus?.length) {
    return;
  }
  const routes: RouteRecordRaw[] = [];
  const addedRoutes: _RouteRecordBase[] = added ? [...added] : [];
  menus.forEach((item) => {
    const meta = { ...item.meta };
    const itemPath = getRoutePath(item.path);
    const path = meta.routePath || itemPath;
    if (
      !path ||
      isExternalLink(path) ||
      meta.openType === 'external' ||
      pathIsAdd(path, addedRoutes)
    ) {
      // 跳过当前继续处理子级
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
    let component: any;
    if (meta.openType === 'iframe' || isExternalLink(item.component)) {
      if (item.component && item.component.startsWith('c://')) {
        // 内嵌组件
        const link = `${itemPath || ''}${iframePageUrl || '/page'}`;
        const linkName = `${name}${iframePageName || 'Page'}`;
        component = getIframeRouteComponent({ ...item, component: link }, name);
        meta.iframe = link;
        if (meta.hideFooter == null) {
          meta.hideFooter = true;
        }
        // 被内嵌的组件添加单独路由数据
        if (!pathIsAdd(link, addedRoutes)) {
          const pageComponent = item.component.slice(3);
          addedRoutes.push({ path: link });
          routes.push({
            name: linkName,
            path: link,
            component: getComponent(pageComponent, item, linkName) as any,
            redirect: void 0 as any,
            props: item.props,
            meta: { ...meta, iframe: void 0, layout: false }
          });
        }
      } else {
        // 其它内嵌形式
        component = getIframeRouteComponent(item, name);
        meta.iframe = item.component;
        if (meta.hideFooter == null) {
          meta.hideFooter = true;
        }
      }
    } else {
      component = getComponent(item.component, item, name);
    }
    // 添加菜单路由数据
    addedRoutes.push({ path });
    routes.push({
      name,
      path,
      component,
      redirect: item.redirect as string,
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
