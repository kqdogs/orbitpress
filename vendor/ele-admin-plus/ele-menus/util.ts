import { onBeforeUnmount, onActivated, onDeactivated } from 'vue';
import { debounce, getCurrentStyle } from '../utils/common';
import type {
  MenuItem,
  MenuTheme,
  PopupMenuTheme,
  PopupColorful,
  MenuResult,
  MenuEllipsisOption
} from './types';

/**
 * 生成气泡菜单的类名
 * @param customerClass 自定义的类名
 * @param theme 主题
 * @param popTheme 气泡菜单主题
 * @param colorful 是否彩色图标
 * @param popupColorful 气泡菜单是否彩色图标
 * @param firstPopClass 第一级气泡菜单类名
 * @param first 是否是第一级菜单
 * @param webkit 是否是webkit内核
 */
export function getPopperClass(
  customerClass?: string,
  theme?: MenuTheme,
  popTheme?: PopupMenuTheme,
  colorful?: boolean,
  popupColorful?: PopupColorful,
  firstPopClass?: string,
  first?: boolean,
  webkit?: boolean
): string {
  const popperClass: string[] = ['ele-menu'];
  if (webkit) {
    popperClass.push('is-webkit');
  }
  if (popTheme === 'dark' || (popTheme === 'auto' && theme === 'dark')) {
    popperClass.push('is-night ele-menu-dark');
  }
  if (popupColorful === true || (popupColorful === 'auto' && colorful)) {
    popperClass.push('is-colorful ele-menu-colorful');
  }
  if (first && firstPopClass) {
    popperClass.push(firstPopClass);
  }
  if (customerClass) {
    popperClass.push(customerClass);
  }
  return popperClass.join(' ');
}

/**
 * 生成菜单数据
 * @param items 菜单数据
 * @param index 省略位置
 * @param horizontal 是否是水平菜单
 */
export function getMenuItems(
  menus?: MenuItem[],
  index?: number,
  horizontal?: boolean
): MenuResult {
  if (!horizontal || !menus || !menus.length) {
    return { items: menus };
  }
  if (index == null || index < 0 || index >= menus.length) {
    return { items: menus, activeIndex: `/${index}item15737` };
  }
  const items = index === 0 ? [] : menus.slice(0, index);
  const moreItems = index === 0 ? menus : menus.slice(index);
  moreItems.forEach((d) => {
    items.push({
      ...d,
      key: `overflow-${d.key || d.index || d.path}`,
      index: `overflow-${d.index || d.path}`,
      overflow: true,
      children: (d.children?.length ? [null] : void 0) as any
    });
  });
  return { items, moreItems };
}

/**
 * 获取菜单节点宽度
 * @param el 菜单节点
 */
export function getMenuWidth(el?: HTMLElement | null): number | undefined {
  if (!el) {
    return;
  }
  const style = getCurrentStyle(el);
  const pl = Number.parseInt(style.paddingLeft || '0', 10);
  const pr = Number.parseInt(style.paddingRight || '0', 10);
  return el.clientWidth - pl - pr;
}

/**
 * 获取菜单项节点宽度
 * @param el 菜单项节点
 */
export function getItemWidth(el?: HTMLElement | null): number | undefined {
  if (!el) {
    return;
  }
  const style = getCurrentStyle(el);
  const ml = Number.parseInt(style.marginLeft || '0', 10);
  const mr = Number.parseInt(style.marginRight || '0', 10);
  return el.offsetWidth + ml + mr;
}

/**
 * 获取菜单子级节点
 * @param el 菜单节点
 */
export function getMenuChilds(el: HTMLElement): HTMLElement[] {
  const ellipsisClass = 'ele-sub-menu-ellipsis';
  return Array.from(el.childNodes ?? []).filter((t: HTMLElement) => {
    return t.nodeName === 'LI' && !t.classList.contains(ellipsisClass);
  }) as HTMLElement[];
}

/**
 * 菜单溢出省略
 */
export function useMenuEllipsis(option: MenuEllipsisOption) {
  const { getMenuEl, getMoreEl, onEllipsis } = option;
  const state = { activated: true };
  /** 菜单尺寸改变监听器 */
  const observer =
    typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(
          debounce(() => {
            computedEllipsis();
          }, 350)
        )
      : void 0;

  /** 计算省略索引 */
  const computedEllipsis = () => {
    const menuEl = getMenuEl();
    if (!menuEl || !state.activated) {
      return;
    }
    const childs = getMenuChilds(menuEl);
    const menuWidth = getMenuWidth(menuEl) || 0;
    const moreWidth = getItemWidth(getMoreEl()) || 48;
    let index = 0;
    let calcWidth = 0;
    for (let i = 0; i < childs.length; i++) {
      const width = getItemWidth(childs[i]) || 0;
      calcWidth += width;
      if (calcWidth > menuWidth) {
        if (calcWidth - width + moreWidth > menuWidth) {
          index = i - 1;
        }
        break;
      }
      index = i + 1;
    }
    onEllipsis(index);
  };

  /** 开始监听菜单尺寸改变 */
  const observe = () => {
    unobserve();
    const menuEl = getMenuEl();
    if (menuEl && observer) {
      observer.observe(menuEl);
    }
  };

  /** 结束监听菜单尺寸改变 */
  const unobserve = () => {
    const menuEl = getMenuEl();
    if (menuEl && observer) {
      observer.unobserve(menuEl);
    }
  };

  onBeforeUnmount(() => {
    unobserve();
  });

  onActivated(() => {
    state.activated = true;
  });

  onDeactivated(() => {
    state.activated = false;
  });

  return { observe, unobserve, computedEllipsis };
}
