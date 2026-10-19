import type { InjectionKey } from 'vue';
import { ref, nextTick, provide, inject, shallowRef, unref } from 'vue';
import type {
  ElePopconfirmInstance,
  ElePopconfirmPropsAndEmits
} from '../ele-app/plus';
import type { PopconfirmProvider } from './types';

/**
 * 气泡确认框注入键名
 */
export const POPCONFIRM_KEY = Symbol(
  'popconfirm'
) as InjectionKey<PopconfirmProvider>;

/**
 * 提供气泡确认框操作
 */
export function usePopconfirmProvider() {
  const popconfirmRef = ref<ElePopconfirmInstance>(null);

  const popconfirmVirtualRef = shallowRef<any>();

  const popconfirmProps = shallowRef<ElePopconfirmPropsAndEmits>({});

  const openPopconfirm = (
    triggerEl: any,
    props?: ElePopconfirmPropsAndEmits
  ) => {
    if (triggerEl == null) {
      return;
    }
    if (popconfirmVirtualRef.value === triggerEl) {
      popconfirmProps.value = props || {};
      return;
    }
    popconfirmRef.value && popconfirmRef.value.hidePopper();
    nextTick(() => {
      popconfirmProps.value = props || {};
      popconfirmVirtualRef.value = triggerEl;
      if (!popconfirmProps.value.disabled) {
        nextTick(() => {
          if (popconfirmRef.value) {
            unref(popconfirmRef.value.tooltipRef)?.handleOpen?.();
          }
        });
      }
    });
  };

  const removePopconfirm = (triggerEl?: any) => {
    if (!triggerEl || popconfirmVirtualRef.value === triggerEl) {
      popconfirmRef.value && popconfirmRef.value.hidePopper();
      popconfirmVirtualRef.value = void 0;
    }
  };

  provide(POPCONFIRM_KEY, {
    openPopconfirm,
    removePopconfirm,
    popconfirmRef
  });

  return {
    popconfirmRef,
    popconfirmVirtualRef,
    popconfirmProps,
    openPopconfirm,
    removePopconfirm
  };
}

/**
 * 使用气泡确认框操作
 */
export function usePopconfirm(): PopconfirmProvider | null {
  return inject(POPCONFIRM_KEY, null);
}
