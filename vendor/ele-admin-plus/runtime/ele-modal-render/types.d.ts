import type {
  Ref,
  AsyncComponentLoader,
  AsyncComponentOptions,
  Component
} from 'vue';
import type { UserComponent, SlotObject } from '../ele-app/types';
import type {
  EleModalPropsAndEmits,
  EleDrawerPropsAndEmits
} from '../ele-app/plus';

/**
 * 弹窗 id
 */
export type ModalItemId = string | number;

/**
 * 弹窗类型
 */
export type ModalItemType = 'modal' | 'drawer' | 'custom';

/**
 * 弹窗组件属性
 */
export type ModalItemProps<T extends ModalItemType> = T extends 'drawer'
  ? EleDrawerPropsAndEmits
  : T extends 'modal'
    ? EleModalPropsAndEmits
    : Record<string, any>;

/**
 * 提供给内容组件的弹窗数据
 */
export interface ModalHolderProvider<T extends ModalItemType> {
  /** 关闭弹窗方法 */
  closeModal: () => void;
  /** 移除弹窗方法 */
  removeModal: () => void;
  /** 修改弹窗属性方法 */
  setModalProps: (option?: ModalItemProps<T>) => void;
  /** 弹窗属性 */
  modalProps: Ref<ModalItemProps<T>>;
}

/**
 * 弹窗数据配置
 */
export interface ModalItem<
  T extends ModalItemType,
  P extends Record<string, any>
> {
  /** 弹窗类型 */
  type?: T;
  /** 弹窗内容组件 */
  component?: UserComponent<P>;
  /** 弹窗内容异步组件 */
  asyncComponent?: AsyncComponentLoader<Component<P>>;
  /** 弹窗内容异步组件配置 */
  asyncComponentOptions?: Partial<AsyncComponentOptions>;
  /** 弹窗内容组件属性 */
  componentProps?:
    | (Record<string, any> & Partial<P>)
    | ((data: ModalHolderProvider<T>) => Record<string, any> & Partial<P>);
  /** 弹窗属性 */
  props?: ModalItemProps<T>;
  /** 传递插槽 */
  slots?: SlotObject;
  /** 是否自定义弹窗组件 */
  custom?: boolean;
  /** 不为自定义弹窗组件时异步组件加载状态 */
  compLoading?: boolean;
  /** 弹窗打开状态 */
  visible?: boolean;
  /** 弹窗是否是失活状态 */
  isDeactivated?: boolean;
  /** 是否在页面销毁后不关闭弹窗 */
  keepAlive?: boolean;
  /** 弹窗 id */
  modalId?: ModalItemId;
}

/**
 * 提供给后代组件的弹窗操作方法
 */
export interface ModalUtilProvider {
  /** 打开弹窗 */
  openModal: <T extends ModalItemType, P extends Record<string, any>>(
    option: ModalItem<T, P>
  ) => ModalItemId;
  /** 关闭弹窗 */
  closeModal: (modalId?: ModalItemId) => void;
  /** 关闭所有弹窗 */
  closeAllModal: () => void;
  /** 修改弹窗失活状态 */
  updateModalState: (modalId?: ModalItemId, deactivated?: boolean) => void;
  /** 修改弹窗属性 */
  updateModalProps: <T extends ModalItemType>(
    modalId?: ModalItemId,
    option?: ModalItemProps<T>
  ) => void;
  /** 移除弹窗 */
  removeModal: (modalId?: ModalItemId) => void;
  /** 移除所有弹窗 */
  removeAllModal: () => void;
}

/**
 * 弹窗操作方法
 */
export interface UseModalMethods {
  /** 打开弹窗 */
  openModal: <T extends ModalItemType, P extends Record<string, any>>(
    option: ModalItem<T, P>
  ) => ModalItemId;
  /** 关闭所有弹窗(是否只关闭当前组件中打开的弹窗) */
  closeAllModal: (current?: boolean) => void;
  /** 关闭弹窗(指定弹窗 id 或者当前内容组件所在弹窗) */
  closeModal: (modalId?: ModalItemId) => void;
  /** 修改弹窗属性(指定弹窗 id 或者当前内容组件所在弹窗) */
  setModalProps: <T extends ModalItemType>(
    modalId?: ModalItemId | ModalItemProps<T>,
    options?: ModalItemProps<T>
  ) => void;
  /** 移除所有弹窗(是否只移除当前组件中打开的弹窗) */
  removeAllModal: (current?: boolean) => void;
  /** 移除弹窗(指定弹窗 id 或者当前内容组件所在弹窗) */
  removeModal: (modalId?: ModalItemId) => void;
}

/**
 * useModalRender 返回类型
 */
export interface UseModalRenderResult {
  modals: Ref<ModalItem<ModalItemType, Record<string, any>>[]>;
  openModal: <T extends ModalItemType, P extends Record<string, any>>(
    option: ModalItem<T, P>
  ) => ModalItemId;
  closeModal: (modalId?: ModalItemId) => void;
  closeAllModal: () => void;
  removeModal: (modalId?: ModalItemId) => void;
  removeAllModal: () => void;
  updateModalVisible: (modalId?: ModalItemId, visible?: boolean) => void;
  updateModalState: (modalId?: ModalItemId, deactivated?: boolean) => void;
  updateModalProps: <T extends ModalItemType>(
    modalId?: ModalItemId,
    option?: ModalItemProps<T>
  ) => void;
}

/**
 * useModal 返回类型
 */
export interface UseModalResult<
  T extends ModalItemType
> extends UseModalMethods {
  ModalHolder: Component;
  modalProps?: Ref<ModalItemProps<T>>;
}
