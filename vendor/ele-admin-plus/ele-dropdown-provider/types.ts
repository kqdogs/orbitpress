import type { Ref } from 'vue';
import type {
  EleDropdownPropsAndEmits,
  EleDropdownInstance
} from '../ele-app/plus';
import type { DropdownItem } from '../ele-dropdown/types';

/**
 * 下拉菜单操作
 */
export interface DropdownProvider {
  /**
   * 打开下拉菜单
   * @param triggerEl 触发元素
   * @param items 下拉菜单项数据
   * @param props 下拉菜单属性
   */
  openDropdown: (
    triggerEl: any,
    items?: DropdownItem[],
    props?: EleDropdownPropsAndEmits
  ) => void;
  /**
   * 移除下拉菜单
   * @param triggerEl 触发元素
   */
  removeDropdown: (triggerEl?: any) => void;
  /**
   * 下拉菜单组件实例
   */
  dropdownRef: Ref<EleDropdownInstance>;
}
