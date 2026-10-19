import type { EleTooltipProps } from '../ele-app/plus';
import type { Offset } from './types';

/**
 * 获取元素距浏览器窗口的距离
 * @param el 元素
 */
export function getOffset(el: HTMLElement): Offset {
  const { top, left } = el.getBoundingClientRect();
  const { scrollY, scrollX } = el.ownerDocument.defaultView ?? {};
  return {
    top: top + (scrollY ?? 0),
    left: left + (scrollX ?? 0)
  };
}

/**
 * 获取气泡组件属性
 * @param visible 是否显示
 * @param model 是否是弹窗
 * @param props 自定义属性
 */
export function getPopperProps(
  visible?: boolean,
  modal?: boolean,
  props?: EleTooltipProps
): EleTooltipProps {
  const classes = ['ele-tour-popover'];
  if (modal) {
    classes.push('ele-tour-modal');
  }
  if (props && props.popperClass && typeof props.popperClass === 'string') {
    classes.push(props.popperClass);
  }
  return {
    trigger: 'click',
    placement: 'top',
    teleported: false,
    width: modal ? 440 : 290,
    transition: 'ele-tour-fast',
    persistent: false,
    effect: 'light',
    isPopover: true,
    gpuAcceleration: true,
    ...props,
    visible: visible ?? false,
    popperClass: classes.join(' ')
  };
}

/**
 * 让元素可见
 * @param el 元素
 */
export function scrollIntoView(el: HTMLElement) {
  if (typeof el['scrollIntoViewIfNeeded'] === 'function') {
    (el as any).scrollIntoViewIfNeeded(true);
  } else {
    el.scrollIntoView({ behavior: 'instant', block: 'nearest' });
  }
}
