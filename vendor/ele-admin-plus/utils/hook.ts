import type { Ref, InjectionKey, EmitsOptions, EmitsToProps } from 'vue';
import {
  ref,
  unref,
  computed,
  watch,
  provide,
  onMounted,
  onBeforeUnmount,
  onActivated,
  onDeactivated,
  nextTick
} from 'vue';
import { formItemContextKey } from 'element-plus';
import type { EmitMethods } from '../ele-app/types';
import { getValue, capitalize, debounce } from './common';

/**
 * useTimer 返回结果
 */
export type UseTimerResult = [
  /**
   * 开始定时执行方法
   * @param callback 重设执行方法
   * @param timeout 重设等待时间
   */
  (callback?: () => void, timeout?: number) => void,
  /** 停止定时器 */
  () => void,
  /** 方法是否等待执行状态 */
  Ref<boolean>
];

/**
 * 定时器
 * @param ms 等待时间
 * @param cb 执行方法
 */
export function useTimer(
  ms?: number | (() => number),
  cb?: () => void
): UseTimerResult {
  let timer: number | null = null;
  const waiting = ref<boolean>(false);

  const stopTimer = () => {
    if (timer != null) {
      clearTimeout(timer);
      timer = null;
    }
    waiting.value = false;
  };

  const startTimer = (callback?: () => void, timeout?: number) => {
    stopTimer();
    waiting.value = true;
    const to = timeout ?? (typeof ms === 'function' ? ms() : ms);
    timer = setTimeout(() => {
      const func = callback ?? cb;
      func && func();
      waiting.value = false;
    }, to) as unknown as number;
  };

  onBeforeUnmount(() => {
    stopTimer();
  });

  return [startTimer, stopTimer, waiting];
}

/**
 * useMediaQuery 返回结果
 */
export type UseMediaQueryResult = [MediaQueryList, () => void, () => void];

/**
 * 媒体查询
 * @param query 媒体查询字符串
 * @param onChange 改变回调
 */
export function useMediaQuery(
  query: string,
  onChange?: () => void
): UseMediaQueryResult {
  const mediaQuery = window.matchMedia(query);

  const handleChange = () => {
    onChange && onChange();
  };

  const startWatch = () => {
    stopWatch();
    if ('addEventListener' in mediaQuery) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      (mediaQuery as any).addListener(handleChange);
    }
  };

  const stopWatch = () => {
    if ('removeEventListener' in mediaQuery) {
      mediaQuery.removeEventListener('change', handleChange);
    } else {
      (mediaQuery as any).removeListener(handleChange);
    }
    handleChange();
  };

  onBeforeUnmount(() => {
    stopWatch();
  });

  return [mediaQuery, startWatch, stopWatch];
}

/**
 * 移动端小屏幕媒体查询
 */
export const mobileMediaQuery = '(max-width: 767.99px)';

/**
 * 移动端触摸设备媒体查询
 */
export const mobileDeviceMediaQuery = '(pointer: coarse)';

/**
 * useMobile 返回结果
 */
export type UseMobileResult = [Ref<boolean>, () => void, () => void];

/**
 * 获取是否是移动端小屏幕
 * @param onChange 值改变回调
 */
export function useMobile(
  onChange?: (isMobile: boolean) => void
): UseMobileResult {
  const mobile = ref<boolean>(false);

  const [media, startMedia, stopMedia] = useMediaQuery(mobileMediaQuery, () => {
    const isMobile = media.matches;
    if (mobile.value !== isMobile) {
      mobile.value = isMobile;
      onChange && onChange(isMobile);
    }
  });

  startMedia();

  return [mobile, startMedia, stopMedia];
}

/**
 * useMobileDevice 返回结果
 */
export type UseMobileDeviceResult = [Ref<boolean>, () => void, () => void];

/**
 * 获取是否是移动端触摸设备
 * @param onChange 值改变回调
 */
export function useMobileDevice(
  onChange?: (isMobile: boolean) => void
): UseMobileDeviceResult {
  const mobileDevice = ref<boolean>(false);

  const [media, startMedia, stopMedia] = useMediaQuery(
    mobileDeviceMediaQuery,
    () => {
      const isMobileDevice = media.matches;
      if (mobileDevice.value !== isMobileDevice) {
        mobileDevice.value = isMobileDevice;
        onChange && onChange(isMobileDevice);
      }
    }
  );

  startMedia();

  return [mobileDevice, startMedia, stopMedia];
}

/**
 * 折叠展开动画
 */
export function useCollapseAnim() {
  let enterHeight: number = 0;

  const getHeight = (el: HTMLElement, isEnter?: boolean) => {
    if (!isEnter) {
      return Math.max(el.offsetHeight, el.scrollHeight);
    }
    return Math.max(el.offsetHeight, el.scrollHeight, enterHeight);
  };

  const handleBeforeEnter = (el: HTMLElement) => {
    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;
    el.style.maxHeight = '0px';
    el.style.paddingTop = '0px';
    el.style.paddingBottom = '0px';
  };

  const handleEnter = (el: HTMLElement) => {
    el.dataset.oldOverflow = el.style.overflow;
    el.style.maxHeight = `${getHeight(el, true)}px`;
    el.style.paddingTop = el.dataset.oldPaddingTop ?? '';
    el.style.paddingBottom = el.dataset.oldPaddingBottom ?? '';
    el.style.overflow = 'hidden';
  };

  const handleAfterEnter = (el: HTMLElement) => {
    el.style.maxHeight = '';
    el.style.overflow = el.dataset.oldOverflow ?? '';
  };

  const handleBeforeLeave = (el: HTMLElement) => {
    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;
    el.dataset.oldOverflow = el.style.overflow;
    enterHeight = getHeight(el);
    el.style.maxHeight = `${enterHeight}px`;
    el.style.overflow = 'hidden';
  };

  const handleLeave = (el: HTMLElement) => {
    el.style.maxHeight = '0px';
    el.style.paddingTop = '0px';
    el.style.paddingBottom = '0px';
  };

  const handleAfterLeave = (el: HTMLElement) => {
    el.style.maxHeight = '';
    el.style.overflow = el.dataset.oldOverflow ?? '';
    el.style.paddingTop = el.dataset.oldPaddingTop ?? '';
    el.style.paddingBottom = el.dataset.oldPaddingBottom ?? '';
  };

  return {
    handleBeforeEnter,
    handleEnter,
    handleAfterEnter,
    handleBeforeLeave,
    handleLeave,
    handleAfterLeave
  };
}

/**
 * 弹窗挂载容器
 */
export const modalItemContextKey = Symbol(
  'modalItemContextKey'
) as InjectionKey<Record<string, any>>;

/**
 * 鼠标滚轮事件回调方法参数
 */
export interface UseMousewheelCallbackParam {
  /** 事件对象 */
  e: MouseEvent;
  /** 方向 */
  direction: 'up' | 'down';
}

/**
 * 鼠标滚轮事件
 * @param cb 回调
 */
export function useMousewheel(cb?: (p: UseMousewheelCallbackParam) => void) {
  const handleMousewheel = (e: MouseEvent) => {
    const delta = (e as any).wheelDelta || e.detail;
    cb && cb({ e, direction: delta > 0 ? 'up' : 'down' });
  };

  const handleFirefoxMousewheel = (e: MouseEvent) => {
    const delta = (e as any).wheelDelta || e.detail;
    cb && cb({ e, direction: delta < 0 ? 'up' : 'down' });
  };

  const bindMousewheel = (el: HTMLElement) => {
    el.addEventListener('mousewheel', handleMousewheel, { passive: false });
    el.addEventListener('DOMMouseScroll', handleFirefoxMousewheel);
  };

  const unbindMousewheel = (el: HTMLElement) => {
    el.removeEventListener('mousewheel', handleMousewheel);
    el.removeEventListener('DOMMouseScroll', handleFirefoxMousewheel);
  };

  return {
    handleMousewheel,
    handleFirefoxMousewheel,
    bindMousewheel,
    unbindMousewheel
  };
}

/**
 * 触摸事件回调参数
 */
export interface UseTouchEventCallbackParam<T> {
  /** 事件对象 */
  e: T;
  /** 开始横向位置 */
  startX: number | null;
  /** 开始纵向位置 */
  startY: number | null;
  /** 横向移动距离 */
  distanceX?: number | null;
  /** 纵向移动距离 */
  distanceY?: number | null;
}

/**
 * 触摸事件参数
 */
export interface UseTouchEventOption<T> {
  /** 触摸开始的回调 */
  start?: (param: UseTouchEventCallbackParam<T>) => void;
  /** 触摸移动的回调 */
  move?: (param: UseTouchEventCallbackParam<T>) => void;
  /** 触摸结束的回调 */
  end?: (param: UseTouchEventCallbackParam<T>) => void;
  /** touchstart 事件参数 */
  touchstartOptions?: any;
  /** touchmove 事件参数 */
  touchmoveOptions?: any;
}

/**
 * 触摸事件
 * @param option 参数
 */
export function useTouchEvent(option?: UseTouchEventOption<TouchEvent>) {
  let startX: number | null = null;
  let startY: number | null = null;
  let distanceX: number | null = null;
  let distanceY: number | null = null;

  const handleTouchStart = (e: TouchEvent) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    if (option && option.start) {
      option.start({ e, startX, startY });
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (startX != null && startY != null) {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      distanceX = currentX - startX;
      distanceY = currentY - startY;
      if (option && option.move) {
        option.move({ e, startX, startY, distanceX, distanceY });
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (option && option.end) {
      option.end({ e, startX, startY, distanceX, distanceY });
    }
    startX = null;
    startY = null;
    distanceX = null;
    distanceY = null;
  };

  const bindTouchEvent = (el: HTMLElement) => {
    el.addEventListener(
      'touchstart',
      handleTouchStart,
      option?.touchstartOptions
    );
    el.addEventListener('touchmove', handleTouchMove, option?.touchmoveOptions);
    el.addEventListener('touchend', handleTouchEnd);
  };

  const unbindTouchEvent = (el: HTMLElement) => {
    el.removeEventListener('touchstart', handleTouchStart);
    el.removeEventListener('touchmove', handleTouchMove);
    el.removeEventListener('touchend', handleTouchEnd);
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    bindTouchEvent,
    unbindTouchEvent
  };
}

/**
 * 移动事件对象
 */
export type MoveEvent = MouseEvent | TouchEvent;

/**
 * 鼠标移动事件或触摸移动事件
 * @param option 参数
 */
export function useMoveEvent(option?: UseTouchEventOption<MoveEvent>) {
  let startX: number | null = null;
  let startY: number | null = null;
  let distanceX: number | null = null;
  let distanceY: number | null = null;

  const unbindEvent = () => {
    document.removeEventListener('mousemove', mousemoveFn);
    document.removeEventListener('mouseup', mouseupFn);
    document.removeEventListener('touchmove', touchmoveFn);
    document.removeEventListener('touchend', touchendFn);
  };

  const emitStart = (clientX: number, clientY: number, e: MoveEvent) => {
    startX = clientX;
    startY = clientY;
    if (option && option.start) {
      option.start({ e, startX, startY });
    }
  };

  const emitMove = (currentX: number, currentY: number, e: MoveEvent) => {
    if (startX != null && startY != null) {
      distanceX = currentX - startX;
      distanceY = currentY - startY;
      if (option && option.move) {
        option.move({ e, startX, startY, distanceX, distanceY });
      }
    }
  };

  const emitEnd = (e: MoveEvent) => {
    unbindEvent();
    if (option && option.end) {
      option.end({ e, startX, startY, distanceX, distanceY });
    }
    startX = null;
    startY = null;
    distanceX = null;
    distanceY = null;
  };

  const mousemoveFn = function (e: MouseEvent) {
    emitMove(e.clientX, e.clientY, e);
  };

  const touchmoveFn = function (e: TouchEvent) {
    emitMove(e.touches[0].clientX, e.touches[0].clientY, e);
  };

  const mouseupFn = (e: MouseEvent) => {
    emitEnd(e);
  };

  const touchendFn = (e: TouchEvent) => {
    emitEnd(e);
  };

  const handleMousedown = (e: MouseEvent) => {
    if (e.button !== 0) {
      return;
    }
    emitStart(e.clientX, e.clientY, e);
    document.addEventListener('mousemove', mousemoveFn);
    document.addEventListener('mouseup', mouseupFn);
  };

  const handleTouchstart = (e: TouchEvent) => {
    emitStart(e.touches[0].clientX, e.touches[0].clientY, e);
    document.addEventListener(
      'touchmove',
      touchmoveFn,
      option?.touchmoveOptions
    );
    document.addEventListener('touchend', touchendFn);
  };

  onBeforeUnmount(() => {
    unbindEvent();
  });

  return { handleMousedown, handleTouchstart };
}

/**
 * useComponentEvents 返回结果
 */
export interface UseComponentEventsResult<T extends EmitsOptions> {
  emitMethods: EmitMethods<T>;
  emitProps: Required<EmitsToProps<T>>;
}

/**
 * 二次封装组件事件处理 hook
 */
export function useComponentEvents<T extends EmitsOptions>(
  events: T,
  emit: any
): UseComponentEventsResult<T> {
  // 事件调用方法
  const emitMethods: EmitMethods<T> = {} as any;
  // 事件对应属性
  const emitProps: Required<EmitsToProps<T>> = {} as any;
  // 处理
  (Array.isArray(events) ? events : Object.keys(events)).forEach((name) => {
    emitMethods[name] = (...params: any[]) => {
      emit(name, ...params);
    };
    emitProps[`on${capitalize(name)}`] = (...params: any[]) => {
      emit(name, ...params);
    };
  });
  return {
    emitMethods,
    emitProps
  };
}

/**
 * 二次封装组件导出处理 hook
 */
export function useComponentExpose<
  T extends {},
  M extends keyof T,
  R extends keyof T
>(componentRef: Ref<T | null>, methodNames: M[], refNames: R[]) {
  const exposeValues: Pick<T, M> & Record<R, Ref<T[R]>> = {} as any;
  methodNames.forEach((name) => {
    exposeValues[name] = ((...args: any) => {
      if (!componentRef.value) {
        throw new Error('componentRef is null');
      }
      // @ts-ignore
      return componentRef.value[name](...args);
    }) as any;
  });
  refNames.forEach((name) => {
    exposeValues[name] = computed(() => {
      const val = componentRef.value?.[name];
      return val == null ? val : unref(val);
    }) as any;
  });
  return exposeValues;
}

/**
 * 监听节点宽高改变参数
 */
export interface UseResizeObserverOption {
  /** 获取要观测的节点方法 */
  getEl: () => HTMLElement | null | undefined;
  /** 宽度改变事件 */
  onWidthChange?: (width: number) => void;
  /** 高度改变事件 */
  onHeightChange?: (height: number) => void;
  /** 挂载时立即更新尺寸延迟 */
  mountedUpdateDelay?: number;
  /** 失活又激活时立即更新尺寸延迟 */
  activatedUpdateDelay?: number;
}

/**
 * 监听节点宽高改变
 * @param option 参数
 */
export function useResizeObserver(option: UseResizeObserverOption) {
  /** 容器宽度 */
  const width = ref<number>(0);

  /** 容器高度 */
  const height = ref<number>(0);

  /** 获取当前容器尺寸 */
  const updateWrapSize = () => {
    const el = option.getEl();
    if (el) {
      const w = Math.floor(el.clientWidth);
      if (width.value !== w) {
        width.value = w;
        option.onWidthChange && option.onWidthChange(w);
      }
      const h = Math.floor(el.clientHeight);
      if (height.value !== h) {
        height.value = h;
        option.onHeightChange && option.onHeightChange(h);
      }
    }
  };

  /** 容器尺寸改变监听器 */
  const observer =
    typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(
          debounce(() => {
            updateWrapSize();
          }, 400)
        )
      : void 0;

  /** 开始监听容器尺寸改变 */
  const observe = () => {
    unobserve();
    const el = option.getEl();
    if (el && observer) {
      observer.observe(el);
    }
  };

  /** 结束监听容器尺寸改变 */
  const unobserve = () => {
    const el = option.getEl();
    if (el && observer) {
      observer.unobserve(el);
    }
  };

  /** 延迟更新尺寸 */
  const delayUpdateWrapSize = (delay?: number) => {
    if (delay == null) {
      updateWrapSize();
    } else if (delay === 0) {
      nextTick(() => {
        updateWrapSize();
      });
    } else if (delay > 0) {
      setTimeout(() => {
        updateWrapSize();
      }, delay);
    }
  };

  onMounted(() => {
    delayUpdateWrapSize(option.mountedUpdateDelay);
    observe();
  });

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  onActivated(() => {
    delayUpdateWrapSize(option.activatedUpdateDelay);
    observe();
  });

  onDeactivated(() => {
    unobserve();
  });

  return [width, height, updateWrapSize] as const;
}

/**
 * 窗口事件监听
 * @param event 事件
 * @param listener 回调
 */
export function useWindowListener(
  event: string | EventListenerOrEventListenerObject,
  listener?: EventListenerOrEventListenerObject
) {
  const eventName = typeof event === 'string' ? event : 'resize';
  const callback = typeof event === 'function' ? event : listener;

  if (callback != null) {
    window.addEventListener(eventName, callback);
  }

  onBeforeUnmount(() => {
    if (callback != null) {
      window.removeEventListener(eventName, callback);
    }
  });
}

/**
 * 高级选项数据 hook
 */
export function useProOptions<T extends Record<string, any>>(
  props: Record<string, any>,
  name = 'options'
) {
  /** 选项数据 */
  const optionData = ref<Array<T>>([]) as Ref<Array<T>>;

  /** 选项属性值 */
  const optionsProp = computed(() => getValue(props, name));

  /** 更新选项数据 */
  const reloadOptions = (params?: any) => {
    if (optionsProp.value != null) {
      if (typeof optionsProp.value === 'function') {
        optionData.value = [];
        optionsProp.value(params).then((data: T[]) => {
          optionData.value = data || [];
        });
        return;
      }
      if (Array.isArray(optionsProp.value)) {
        optionData.value = optionsProp.value;
        return;
      }
    }
    optionData.value = [];
  };

  /** 更新选项数据 */
  watch(
    () => optionsProp,
    () => {
      reloadOptions();
    },
    {
      deep: true,
      immediate: true
    }
  );

  return {
    optionData,
    reloadOptions
  };
}

/**
 * 重置组件表单验证
 */
export function useFormItemRest() {
  provide(formItemContextKey, null as any);
}
