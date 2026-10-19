import { onBeforeUnmount, onActivated, onDeactivated } from "vue";
import { getCurrentStyle, debounce } from "../utils/common";
function getPopperClass(customerClass, theme, popTheme, colorful, popupColorful, firstPopClass, first, webkit) {
  const popperClass = ["ele-menu"];
  if (webkit) {
    popperClass.push("is-webkit");
  }
  if (popTheme === "dark" || popTheme === "auto" && theme === "dark") {
    popperClass.push("is-night ele-menu-dark");
  }
  if (popupColorful === true || popupColorful === "auto" && colorful) {
    popperClass.push("is-colorful ele-menu-colorful");
  }
  if (first && firstPopClass) {
    popperClass.push(firstPopClass);
  }
  if (customerClass) {
    popperClass.push(customerClass);
  }
  return popperClass.join(" ");
}
function getMenuItems(menus, index, horizontal) {
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
      children: d.children?.length ? [null] : void 0
    });
  });
  return { items, moreItems };
}
function getMenuWidth(el) {
  if (!el) {
    return;
  }
  const style = getCurrentStyle(el);
  const pl = Number.parseInt(style.paddingLeft || "0", 10);
  const pr = Number.parseInt(style.paddingRight || "0", 10);
  return el.clientWidth - pl - pr;
}
function getItemWidth(el) {
  if (!el) {
    return;
  }
  const style = getCurrentStyle(el);
  const ml = Number.parseInt(style.marginLeft || "0", 10);
  const mr = Number.parseInt(style.marginRight || "0", 10);
  return el.offsetWidth + ml + mr;
}
function getMenuChilds(el) {
  const ellipsisClass = "ele-sub-menu-ellipsis";
  return Array.from(el.childNodes ?? []).filter((t) => {
    return t.nodeName === "LI" && !t.classList.contains(ellipsisClass);
  });
}
function useMenuEllipsis(option) {
  const { getMenuEl, getMoreEl, onEllipsis } = option;
  const state = { activated: true };
  const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(
    debounce(() => {
      computedEllipsis();
    }, 350)
  ) : void 0;
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
  const observe = () => {
    unobserve();
    const menuEl = getMenuEl();
    if (menuEl && observer) {
      observer.observe(menuEl);
    }
  };
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
export {
  getItemWidth,
  getMenuChilds,
  getMenuItems,
  getMenuWidth,
  getPopperClass,
  useMenuEllipsis
};
