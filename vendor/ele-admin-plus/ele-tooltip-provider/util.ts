import type { InjectionKey } from 'vue';
import { ref, nextTick, provide, inject, shallowRef } from 'vue';
import type {
  EleTooltipInstance,
  EleTooltipPropsAndEmits
} from '../ele-app/plus';
import type { TooltipProvider } from './types';

/**
 * 文本提示注入键名
 */
export const TOOLTIP_KEY = Symbol('tooltip') as InjectionKey<TooltipProvider>;

/**
 * 提供文本提示操作
 */
export function useTooltipProvider() {
  const tooltipRef = ref<EleTooltipInstance>(null);

  const tooltipVirtualRef = shallowRef<any>();

  const tooltipProps = shallowRef<EleTooltipPropsAndEmits>({});

  const showTooltip = (triggerEl: any, props?: EleTooltipPropsAndEmits) => {
    if (triggerEl == null) {
      return;
    }
    if (tooltipVirtualRef.value === triggerEl) {
      tooltipProps.value = props || {};
      return;
    }
    tooltipRef.value && tooltipRef.value.hide();
    nextTick(() => {
      tooltipProps.value = props || {};
      tooltipVirtualRef.value = triggerEl;
      if (!tooltipProps.value.disabled) {
        nextTick(() => {
          tooltipRef.value && tooltipRef.value.onOpen();
        });
      }
    });
  };

  const removeTooltip = (triggerEl?: any) => {
    if (!triggerEl || tooltipVirtualRef.value === triggerEl) {
      tooltipRef.value && tooltipRef.value.hide();
      tooltipVirtualRef.value = void 0;
    }
  };

  provide(TOOLTIP_KEY, {
    showTooltip,
    removeTooltip,
    tooltipRef
  });

  return {
    tooltipRef,
    tooltipVirtualRef,
    tooltipProps,
    showTooltip,
    removeTooltip
  };
}

/**
 * 使用文本提示操作
 */
export function useTooltip(): TooltipProvider | null {
  return inject(TOOLTIP_KEY, null);
}

/**
 * 提供文本提示操作, 先调用 ele-app 的方法, 没有才调用自己的
 */
export function useTooltipProviderPro() {
  const tooltipProvider = useTooltip();
  const {
    tooltipRef,
    tooltipVirtualRef,
    tooltipProps,
    showTooltip,
    removeTooltip
  } = useTooltipProvider();

  /** 打开文本提示 */
  const showTooltipPro = (
    triggerEl: any,
    options?: EleTooltipPropsAndEmits
  ) => {
    const func = tooltipProvider?.showTooltip || showTooltip;
    func(triggerEl, options);
  };

  /** 关闭文本提示 */
  const removeTooltipPro = (triggerEl?: any) => {
    const func = tooltipProvider?.removeTooltip || removeTooltip;
    func(triggerEl);
  };

  return {
    tooltipRef,
    tooltipVirtualRef,
    tooltipProps,
    showTooltip: showTooltipPro,
    removeTooltip: removeTooltipPro
  };
}
