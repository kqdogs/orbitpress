import { getCurrentStyle, queryChild } from '../utils/common';
import type { MoveOut, MoveOutValue, Position } from './types';
export const containerClass = 'ele-modal-container';
export const wrapperClass = 'ele-modal';
export const closedClass = 'ele-modal-closed';

/**
 * 是否可拉出指定方向
 * @param moveOut 拉出值
 * @param direction 方向
 */
export function canMoveOut(
  moveOut?: MoveOut,
  direction?: MoveOutValue
): boolean {
  if (direction && moveOut != null && Array.isArray(moveOut)) {
    return moveOut.includes(direction);
  }
  return false;
}

/**
 * 获取弹窗容器
 * @param inner 是否限制在主体内部
 * @param multiple 是否支持同时打开多个
 * @param appendTo 自定义插入的容器
 * @param modalsEl 限制在主体内部时的容器
 */
export function getModalContainer(
  inner?: boolean,
  multiple?: boolean,
  appendTo?: string | HTMLElement,
  modalsEl?: HTMLElement | null
): HTMLElement | string {
  if (multiple) {
    const parent = (inner ? modalsEl : void 0) || document.body;
    const wrapper = queryChild(parent, containerClass);
    if (wrapper) {
      return wrapper as HTMLElement;
    }
    const elem = document.createElement('div');
    elem.classList.add(containerClass);
    parent.appendChild(elem);
    return elem;
  }
  if (inner && modalsEl) {
    return modalsEl;
  }
  return appendTo || 'body';
}

/**
 * 获取位置对应的外间距值
 * @param position 位置
 */
export function getPositionMargin(position?: Position) {
  if (
    position == null ||
    typeof position !== 'object' ||
    (position.top == null &&
      position.right == null &&
      position.bottom == null &&
      position.left == null)
  ) {
    return;
  }
  return [position.top, position.right, position.bottom, position.left]
    .map((p) => (typeof p === 'number' ? `${p}px` : p || 'auto'))
    .join(' ');
}

/**
 * 获取弹窗最大层级
 * @param modalEl 弹窗节点
 * @param defaultZIndex 默认层级
 */
export function getMaxZIndex(modalEl?: HTMLElement, defaultZIndex?: number) {
  if (!modalEl) {
    return;
  }
  const overlayEl = modalEl.parentElement?.parentElement;
  if (!overlayEl) {
    return;
  }
  const currentIndex = getCurrentStyle(overlayEl).zIndex;
  const containerEl = overlayEl.parentElement;
  const cls = `.${wrapperClass}:not(.${closedClass})`;
  const modals = containerEl ? containerEl.querySelectorAll(cls) : void 0;
  let maxIndex = 0;
  (modals ? Array.from(modals) : []).forEach((modalEl) => {
    const zIndex = getCurrentStyle(modalEl).zIndex;
    if (zIndex != null) {
      const index = Number(zIndex);
      if (index >= maxIndex && (!overlayEl || modalEl !== overlayEl)) {
        maxIndex = index + 1;
      }
    }
  });
  if (maxIndex > Number(currentIndex || (defaultZIndex ?? 2000) || 0)) {
    return maxIndex;
  }
}
