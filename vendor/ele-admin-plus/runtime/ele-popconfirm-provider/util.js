import { ref, shallowRef, provide, inject, nextTick, unref } from "vue";
const POPCONFIRM_KEY = /* @__PURE__ */ Symbol(
  "popconfirm"
);
function usePopconfirmProvider() {
  const popconfirmRef = ref(null);
  const popconfirmVirtualRef = shallowRef();
  const popconfirmProps = shallowRef({});
  const openPopconfirm = (triggerEl, props) => {
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
  const removePopconfirm = (triggerEl) => {
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
function usePopconfirm() {
  return inject(POPCONFIRM_KEY, null);
}
export {
  POPCONFIRM_KEY,
  usePopconfirm,
  usePopconfirmProvider
};
