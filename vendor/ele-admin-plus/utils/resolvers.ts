/** 组件按需加载 */
import type { ComponentResolver } from 'unplugin-vue-components/types';

/**
 * 参数类型
 */
export interface EleAdminResolverOptions {
  /** 包路径 */
  path?: string | '' | '/es' | '/lib' | '/es/core' | '/lib/core';
  /** 排除的组件名称 */
  exclude?: string[];
  /** 是否导入样式 */
  importStyle?: boolean | 'css' | 'sass';
}

/**
 * 获取组件样式导入路径
 * @param path 组件路径
 * @param options 参数
 */
function getSideEffects(path: string, options?: EleAdminResolverOptions) {
  const importStyle = options?.importStyle;
  if (!importStyle) {
    return;
  }
  if (importStyle === 'css') {
    return `${path}/style/css`;
  }
  return `${path}/style/index`;
}

/**
 * 获取组件样式导入包路径
 * @param namePath 组件名路径
 * @param packageName 包名
 * @param path 包路径
 */
function getStylePath(namePath: string, packageName: string, path?: string) {
  if (!path) {
    return `${packageName}/es/${namePath}`;
  }
  if (path === '/es/core') {
    return `${packageName}/es/${namePath}`;
  }
  if (path === '/lib/core') {
    return `${packageName}/lib/${namePath}`;
  }
  return `${packageName}${path}/${namePath}`;
}

/**
 * 按需加载插件
 * @param options 参数
 */
export function EleAdminResolver(
  options?: EleAdminResolverOptions
): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string): any => {
      const { path, exclude } = options || {};
      if (name.match(/^Ele[A-Z]/) && !exclude?.includes?.(name)) {
        const packageName = 'ele-admin-plus';
        const namePath = name
          .replace(/([A-Z])/g, ' $1')
          .trim()
          .split(' ')
          .join('-')
          .toLowerCase();
        const stylePath = getStylePath(namePath, packageName, path);
        if (!path || path === '/es/core' || path === '/lib/core') {
          return {
            name,
            from: `${packageName}${path ?? '/es'}`,
            sideEffects: getSideEffects(stylePath, options)
          };
        }
        return {
          from: `${packageName}${path}/${namePath}/index`,
          sideEffects: getSideEffects(stylePath, options)
        };
      }
    }
  };
}
