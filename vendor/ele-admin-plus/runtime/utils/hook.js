import { ref, onBeforeUnmount, computed, unref, onMounted, onActivated, onDeactivated, watch, provide, nextTick } from "vue";
import { formItemContextKey } from "element-plus";
import { capitalize, debounce, getValue } from "./common";
function useTimer(ms, cb) {
  let timer = null;
  const waiting = ref(false);
  const stopTimer = () => {
    if (timer != null) {
      clearTimeout(timer);
      timer = null;
    }
    waiting.value = false;
  };
  const startTimer = (callback, timeout) => {
    stopTimer();
    waiting.value = true;
    const to = timeout ?? (typeof ms === "function" ? ms() : ms);
    timer = setTimeout(() => {
      const func = callback ?? cb;
      func && func();
      waiting.value = false;
    }, to);
  };
  onBeforeUnmount(() => {
    stopTimer();
  });
  return [startTimer, stopTimer, waiting];
}
function useMediaQuery(query, onChange) {
  const mediaQuery = window.matchMedia(query);
  const handleChange = () => {
    onChange && onChange();
  };
  const startWatch = () => {
    stopWatch();
    if ("addEventListener" in mediaQuery) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }
  };
  const stopWatch = () => {
    if ("removeEventListener" in mediaQuery) {
      mediaQuery.removeEventListener("change", handleChange);
    } else {
      mediaQuery.removeListener(handleChange);
    }
    handleChange();
  };
  onBeforeUnmount(() => {
    stopWatch();
  });
  return [mediaQuery, startWatch, stopWatch];
}
const mobileMediaQuery = "(max-width: 767.99px)";
const mobileDeviceMediaQuery = "(pointer: coarse)";
function useMobile(onChange) {
  const mobile = ref(false);
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
function useMobileDevice(onChange) {
  const mobileDevice = ref(false);
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
function useCollapseAnim() {
  let enterHeight = 0;
  const getHeight = (el, isEnter) => {
    if (!isEnter) {
      return Math.max(el.offsetHeight, el.scrollHeight);
    }
    return Math.max(el.offsetHeight, el.scrollHeight, enterHeight);
  };
  const handleBeforeEnter = (el) => {
    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;
    el.style.maxHeight = "0px";
    el.style.paddingTop = "0px";
    el.style.paddingBottom = "0px";
  };
  const handleEnter = (el) => {
    el.dataset.oldOverflow = el.style.overflow;
    el.style.maxHeight = `${getHeight(el, true)}px`;
    el.style.paddingTop = el.dataset.oldPaddingTop ?? "";
    el.style.paddingBottom = el.dataset.oldPaddingBottom ?? "";
    el.style.overflow = "hidden";
  };
  const handleAfterEnter = (el) => {
    el.style.maxHeight = "";
    el.style.overflow = el.dataset.oldOverflow ?? "";
  };
  const handleBeforeLeave = (el) => {
    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;
    el.dataset.oldOverflow = el.style.overflow;
    enterHeight = getHeight(el);
    el.style.maxHeight = `${enterHeight}px`;
    el.style.overflow = "hidden";
  };
  const handleLeave = (el) => {
    el.style.maxHeight = "0px";
    el.style.paddingTop = "0px";
    el.style.paddingBottom = "0px";
  };
  const handleAfterLeave = (el) => {
    el.style.maxHeight = "";
    el.style.overflow = el.dataset.oldOverflow ?? "";
    el.style.paddingTop = el.dataset.oldPaddingTop ?? "";
    el.style.paddingBottom = el.dataset.oldPaddingBottom ?? "";
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
const modalItemContextKey = /* @__PURE__ */ Symbol(
  "modalItemContextKey"
);
function useMousewheel(cb) {
  const handleMousewheel = (e) => {
    const delta = e.wheelDelta || e.detail;
    cb && cb({ e, direction: delta > 0 ? "up" : "down" });
  };
  const handleFirefoxMousewheel = (e) => {
    const delta = e.wheelDelta || e.detail;
    cb && cb({ e, direction: delta < 0 ? "up" : "down" });
  };
  const bindMousewheel = (el) => {
    el.addEventListener("mousewheel", handleMousewheel, { passive: false });
    el.addEventListener("DOMMouseScroll", handleFirefoxMousewheel);
  };
  const unbindMousewheel = (el) => {
    el.removeEventListener("mousewheel", handleMousewheel);
    el.removeEventListener("DOMMouseScroll", handleFirefoxMousewheel);
  };
  return {
    handleMousewheel,
    handleFirefoxMousewheel,
    bindMousewheel,
    unbindMousewheel
  };
}
function useTouchEvent(option) {
  let startX = null;
  let startY = null;
  let distanceX = null;
  let distanceY = null;
  const handleTouchStart = (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    if (option && option.start) {
      option.start({ e, startX, startY });
    }
  };
  const handleTouchMove = (e) => {
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
  const handleTouchEnd = (e) => {
    if (option && option.end) {
      option.end({ e, startX, startY, distanceX, distanceY });
    }
    startX = null;
    startY = null;
    distanceX = null;
    distanceY = null;
  };
  const bindTouchEvent = (el) => {
    el.addEventListener(
      "touchstart",
      handleTouchStart,
      option?.touchstartOptions
    );
    el.addEventListener("touchmove", handleTouchMove, option?.touchmoveOptions);
    el.addEventListener("touchend", handleTouchEnd);
  };
  const unbindTouchEvent = (el) => {
    el.removeEventListener("touchstart", handleTouchStart);
    el.removeEventListener("touchmove", handleTouchMove);
    el.removeEventListener("touchend", handleTouchEnd);
  };
  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    bindTouchEvent,
    unbindTouchEvent
  };
}
function useMoveEvent(option) {
  let startX = null;
  let startY = null;
  let distanceX = null;
  let distanceY = null;
  const unbindEvent = () => {
    document.removeEventListener("mousemove", mousemoveFn);
    document.removeEventListener("mouseup", mouseupFn);
    document.removeEventListener("touchmove", touchmoveFn);
    document.removeEventListener("touchend", touchendFn);
  };
  const emitStart = (clientX, clientY, e) => {
    startX = clientX;
    startY = clientY;
    if (option && option.start) {
      option.start({ e, startX, startY });
    }
  };
  const emitMove = (currentX, currentY, e) => {
    if (startX != null && startY != null) {
      distanceX = currentX - startX;
      distanceY = currentY - startY;
      if (option && option.move) {
        option.move({ e, startX, startY, distanceX, distanceY });
      }
    }
  };
  const emitEnd = (e) => {
    unbindEvent();
    if (option && option.end) {
      option.end({ e, startX, startY, distanceX, distanceY });
    }
    startX = null;
    startY = null;
    distanceX = null;
    distanceY = null;
  };
  const mousemoveFn = function(e) {
    emitMove(e.clientX, e.clientY, e);
  };
  const touchmoveFn = function(e) {
    emitMove(e.touches[0].clientX, e.touches[0].clientY, e);
  };
  const mouseupFn = (e) => {
    emitEnd(e);
  };
  const touchendFn = (e) => {
    emitEnd(e);
  };
  const handleMousedown = (e) => {
    if (e.button !== 0) {
      return;
    }
    emitStart(e.clientX, e.clientY, e);
    document.addEventListener("mousemove", mousemoveFn);
    document.addEventListener("mouseup", mouseupFn);
  };
  const handleTouchstart = (e) => {
    emitStart(e.touches[0].clientX, e.touches[0].clientY, e);
    document.addEventListener(
      "touchmove",
      touchmoveFn,
      option?.touchmoveOptions
    );
    document.addEventListener("touchend", touchendFn);
  };
  onBeforeUnmount(() => {
    unbindEvent();
  });
  return { handleMousedown, handleTouchstart };
}
function useComponentEvents(events, emit) {
  const emitMethods = {};
  const emitProps = {};
  (Array.isArray(events) ? events : Object.keys(events)).forEach((name) => {
    emitMethods[name] = (...params) => {
      emit(name, ...params);
    };
    emitProps[`on${capitalize(name)}`] = (...params) => {
      emit(name, ...params);
    };
  });
  return {
    emitMethods,
    emitProps
  };
}
function useComponentExpose(componentRef, methodNames, refNames) {
  const exposeValues = {};
  methodNames.forEach((name) => {
    exposeValues[name] = ((...args) => {
      if (!componentRef.value) {
        throw new Error("componentRef is null");
      }
      return componentRef.value[name](...args);
    });
  });
  refNames.forEach((name) => {
    exposeValues[name] = computed(() => {
      const val = componentRef.value?.[name];
      return val == null ? val : unref(val);
    });
  });
  return exposeValues;
}
function useResizeObserver(option) {
  const width = ref(0);
  const height = ref(0);
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
  const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(
    debounce(() => {
      updateWrapSize();
    }, 400)
  ) : void 0;
  const observe = () => {
    unobserve();
    const el = option.getEl();
    if (el && observer) {
      observer.observe(el);
    }
  };
  const unobserve = () => {
    const el = option.getEl();
    if (el && observer) {
      observer.unobserve(el);
    }
  };
  const delayUpdateWrapSize = (delay) => {
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
  return [width, height, updateWrapSize];
}
function useWindowListener(event, listener) {
  const eventName = typeof event === "string" ? event : "resize";
  const callback = typeof event === "function" ? event : listener;
  if (callback != null) {
    window.addEventListener(eventName, callback);
  }
  onBeforeUnmount(() => {
    if (callback != null) {
      window.removeEventListener(eventName, callback);
    }
  });
}
function useProOptions(props, name = "options") {
  const optionData = ref([]);
  const optionsProp = computed(() => getValue(props, name));
  const reloadOptions = (params) => {
    if (optionsProp.value != null) {
      if (typeof optionsProp.value === "function") {
        optionData.value = [];
        optionsProp.value(params).then((data) => {
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
function useFormItemRest() {
  provide(formItemContextKey, null);
}
export {
  mobileDeviceMediaQuery,
  mobileMediaQuery,
  modalItemContextKey,
  useCollapseAnim,
  useComponentEvents,
  useComponentExpose,
  useFormItemRest,
  useMediaQuery,
  useMobile,
  useMobileDevice,
  useMousewheel,
  useMoveEvent,
  useProOptions,
  useResizeObserver,
  useTimer,
  useTouchEvent,
  useWindowListener
};
