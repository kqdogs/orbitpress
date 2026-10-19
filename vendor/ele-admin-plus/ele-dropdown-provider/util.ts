import type { InjectionKey } from 'vue';
import { ref, nextTick, provide, inject, shallowRef } from 'vue';
import type {
  EleDropdownInstance,
  EleDropdownPropsAndEmits
} from '../ele-app/plus';
import type { DropdownItem } from '../ele-dropdown/types';
import type { DropdownProvider } from './types';

/**
 * 下拉菜单注入键名
 */
export const DROPDOWN_KEY = Symbol(
  'dropdown'
) as InjectionKey<DropdownProvider>;

/**
 * 提供下拉菜单操作
 */
export function useDropdownProvider() {
  const dropdownRef = ref<EleDropdownInstance>(null);

  const dropdownVirtualRef = shallowRef<any>();

  const dropdownItems = shallowRef<DropdownItem[]>([]);

  const dropdownProps = shallowRef<EleDropdownPropsAndEmits>({});

  const openDropdown = (
    triggerEl: any,
    items?: DropdownItem[],
    props?: EleDropdownPropsAndEmits
  ) => {
    if (triggerEl == null) {
      return;
    }
    /* if (dropdownVirtualRef.value === triggerEl) {
      if (!items?.length) {
        dropdownRef.value && dropdownRef.value.handleClose();
        nextTick(() => {
          dropdownProps.value = props || {};
          dropdownItems.value = items || [];
        });
        return;
      }
      dropdownProps.value = props || {};
      dropdownItems.value = items || [];
      return;
    } */
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

  const removeDropdown = (triggerEl?: any) => {
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

/**
 * 使用下拉菜单操作
 */
export function useDropdown(): DropdownProvider | null {
  return inject(DROPDOWN_KEY, null);
}

/**
 * 提供下拉菜单操作, 先调用 ele-app 的方法, 没有才调用自己的
 */
export function useDropdownProviderPro() {
  const dropdownProvider = useDropdown();
  const {
    dropdownRef,
    dropdownVirtualRef,
    dropdownItems,
    dropdownProps,
    openDropdown,
    removeDropdown
  } = useDropdownProvider();

  const openDropdownPro = (
    triggerEl: any,
    items?: DropdownItem[],
    props?: EleDropdownPropsAndEmits
  ) => {
    const func = dropdownProvider?.openDropdown || openDropdown;
    func(triggerEl, items, props);
  };

  const removeDropdownPro = (triggerEl?: any) => {
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
