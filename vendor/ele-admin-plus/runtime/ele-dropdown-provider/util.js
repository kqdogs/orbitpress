import { ref, shallowRef, provide, inject, nextTick } from "vue";
const DROPDOWN_KEY = /* @__PURE__ */ Symbol(
  "dropdown"
);
function useDropdownProvider() {
  const dropdownRef = ref(null);
  const dropdownVirtualRef = shallowRef();
  const dropdownItems = shallowRef([]);
  const dropdownProps = shallowRef({});
  const openDropdown = (triggerEl, items, props) => {
    if (triggerEl == null) {
      return;
    }
    dropdownRef.value && dropdownRef.value.handleClose();
    nextTick(() => {
      dropdownProps.value = props || {};
      dropdownItems.value = items || [];
      const rect = triggerEl.getBoundingClientRect();
      dropdownVirtualRef.value = { getBoundingClientRect: () => rect };
      if (dropdownItems.value.length && !dropdownProps.value.disabled) {
        nextTick(() => {
          dropdownRef.value && dropdownRef.value.handleOpen();
        });
      }
    });
  };
  const removeDropdown = (triggerEl) => {
    if (!triggerEl || dropdownVirtualRef.value === triggerEl) {
      dropdownRef.value && dropdownRef.value.handleClose();
      dropdownVirtualRef.value = void 0;
      dropdownItems.value = [];
    }
  };
  provide(DROPDOWN_KEY, {
    openDropdown,
    removeDropdown,
    dropdownRef
  });
  return {
    dropdownRef,
    dropdownVirtualRef,
    dropdownItems,
    dropdownProps,
    openDropdown,
    removeDropdown
  };
}
function useDropdown() {
  return inject(DROPDOWN_KEY, null);
}
function useDropdownProviderPro() {
  const dropdownProvider = useDropdown();
  const {
    dropdownRef,
    dropdownVirtualRef,
    dropdownItems,
    dropdownProps,
    openDropdown,
    removeDropdown
  } = useDropdownProvider();
  const openDropdownPro = (triggerEl, items, props) => {
    const func = dropdownProvider?.openDropdown || openDropdown;
    func(triggerEl, items, props);
  };
  const removeDropdownPro = (triggerEl) => {
    const func = dropdownProvider?.removeDropdown || removeDropdown;
    func(triggerEl);
  };
  return {
    dropdownRef,
    dropdownVirtualRef,
    dropdownItems,
    dropdownProps,
    openDropdown: openDropdownPro,
    removeDropdown: removeDropdownPro
  };
}
export {
  DROPDOWN_KEY,
  useDropdown,
  useDropdownProvider,
  useDropdownProviderPro
};
