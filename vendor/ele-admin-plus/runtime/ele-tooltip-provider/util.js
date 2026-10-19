import { ref, shallowRef, provide, inject, nextTick } from "vue";
const TOOLTIP_KEY = /* @__PURE__ */ Symbol("tooltip");
function useTooltipProvider() {
  const tooltipRef = ref(null);
  const tooltipVirtualRef = shallowRef();
  const tooltipProps = shallowRef({});
  const showTooltip = (triggerEl, props) => {
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
  const removeTooltip = (triggerEl) => {
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
function useTooltip() {
  return inject(TOOLTIP_KEY, null);
}
function useTooltipProviderPro() {
  const tooltipProvider = useTooltip();
  const {
    tooltipRef,
    tooltipVirtualRef,
    tooltipProps,
    showTooltip,
    removeTooltip
  } = useTooltipProvider();
  const showTooltipPro = (triggerEl, options) => {
    const func = tooltipProvider?.showTooltip || showTooltip;
    func(triggerEl, options);
  };
  const removeTooltipPro = (triggerEl) => {
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
export {
  TOOLTIP_KEY,
  useTooltip,
  useTooltipProvider,
  useTooltipProviderPro
};
