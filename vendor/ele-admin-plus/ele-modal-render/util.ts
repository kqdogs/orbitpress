import type { InjectionKey } from 'vue';
import { ref, markRaw, defineAsyncComponent, provide } from 'vue';
import type { UserComponent } from '../ele-app/types';
import { useTimer } from '../utils/hook';
import ModalLoading from './components/modal-loading.vue';
import type {
  ModalItem,
  ModalItemId,
  ModalItemType,
  ModalUtilProvider,
  ModalHolderProvider,
  UseModalRenderResult,
  ModalItemProps
} from './types';
/** 对于没有关闭动画结束事件的弹窗释放延时 */
const MODAL_RELEASE_TIMEOUT = 500;

/**
 * 弹窗渲染器容器注入键名
 */
export const MODAL_UTIL_KEY = Symbol(
  'modalUtil'
) as InjectionKey<ModalUtilProvider>;

/**
 * 直接父级的弹窗渲染器注入键名
 */
export const MODAL_HOLDER_KEY = Symbol('modalHolder') as InjectionKey<
  ModalHolderProvider<ModalItemType>
>;

/**
 * 获取用户组件
 * @param item 弹窗配置
 * @param onLoaded 异步组件加载完成回调
 */
function getItemComponent<
  T extends ModalItemType,
  P extends Record<string, any>
>(
  item: ModalItem<T, P>,
  onLoaded: () => void
): [UserComponent<P> | undefined, boolean] {
  const { component, asyncComponent, custom, asyncComponentOptions } = item;
  // 非异步组件
  if (component && typeof component === 'object') {
    return [markRaw(component), false];
  }
  if (component != null) {
    return [component, false];
  }
  if (!asyncComponent) {
    return [void 0, false];
  }
  // 异步组件为自定义弹窗组件时使用全屏加载状态
  if (custom) {
    const comp = defineAsyncComponent({
      loadingComponent: ModalLoading,
      ...(asyncComponentOptions || {}),
      loader: asyncComponent
    });
    return [markRaw(comp), false];
  }
  // 异步组件加载状态显示在弹窗上
  const comp = defineAsyncComponent(async () => {
    const c = await asyncComponent();
    onLoaded();
    return c;
  });
  return [markRaw(comp), true];
}

/**
 * 弹窗渲染器数据操作
 */
export function useModalRender(): UseModalRenderResult {
  let startId: number = 0;
  const modals = ref<ModalItem<ModalItemType, any>[]>([]);
  const [startReleaseTimer] = useTimer(MODAL_RELEASE_TIMEOUT);

  /** 生成弹窗 id */
  const generateModalId = () => {
    startId++;
    return startId;
  };

  /** 检查并释放已关闭的弹窗 */
  const releaseModalData = (modalIds: (ModalItemId | undefined)[]) => {
    startReleaseTimer(() => {
      for (let i = modals.value.length - 1; i >= 0; i--) {
        const { visible, modalId } = modals.value[i];
        if (
          (visible == null || visible === false) &&
          modalIds.includes(modalId)
        ) {
          modals.value.splice(i, 1);
        }
      }
    });
  };

  /** 修改弹窗显示状态 */
  const updateModalVisible = (modalId?: ModalItemId, visible?: boolean) => {
    if (modalId == null) {
      return;
    }
    const item = modals.value.find((item) => item.modalId === modalId);
    if (item) {
      item.visible = visible;
      releaseModalData([modalId]);
    }
  };

  /** 关闭弹窗 */
  const closeModal = (modalId?: ModalItemId) => {
    updateModalVisible(modalId, false);
  };

  /** 关闭所有弹窗 */
  const closeAllModal = () => {
    const modalIds: (ModalItemId | undefined)[] = [];
    modals.value.forEach((item) => {
      modalIds.push(item.modalId);
      item.visible = false;
    });
    releaseModalData(modalIds);
  };

  /** 移除弹窗 */
  const removeModal = (modalId?: ModalItemId) => {
    if (modalId == null) {
      return;
    }
    const index = modals.value.findIndex((item) => item.modalId === modalId);
    if (index !== -1) {
      modals.value.splice(index, 1);
    }
  };

  /** 移除全部弹窗 */
  const removeAllModal = () => {
    modals.value = [];
  };

  /** 修改弹窗失活状态 */
  const updateModalState = (modalId?: ModalItemId, deactivated?: boolean) => {
    if (modalId == null) {
      return;
    }
    const item = modals.value.find((item) => item.modalId === modalId);
    if (item) {
      item.isDeactivated = !!deactivated;
    }
  };

  /** 修改弹窗用户组件加载状态 */
  const updateModalCompLoading = (modalId?: ModalItemId, loading?: boolean) => {
    if (modalId == null) {
      return;
    }
    const item = modals.value.find((item) => item.modalId === modalId);
    if (item) {
      item.compLoading = loading;
    }
  };

  /** 修改弹窗属性 */
  const updateModalProps = <T extends ModalItemType>(
    modalId?: ModalItemId,
    option?: ModalItemProps<T>
  ) => {
    if (modalId == null || option == null) {
      return;
    }
    const item = modals.value.find((item) => item.modalId === modalId);
    if (!item) {
      return;
    }
    if (!item.props) {
      item.props = Object.assign({}, option) as ModalItemProps<T>;
    } else {
      Object.assign(item.props, option);
    }
  };

  /** 修改内容组件属性 */
  const updateComponentProps = <P extends Record<string, any>>(
    modalId?: ModalItemId,
    option?: P
  ) => {
    if (modalId == null || option == null) {
      return;
    }
    const item = modals.value.find((item) => item.modalId === modalId);
    if (!item) {
      return;
    }
    if (!item.componentProps) {
      item.componentProps = Object.assign({}, option);
    } else {
      Object.assign(item.componentProps, option);
    }
  };

  /** 打开弹窗 */
  const openModal = <T extends ModalItemType, P extends Record<string, any>>(
    option: ModalItem<T, P>
  ): ModalItemId => {
    if (
      option.modalId != null &&
      modals.value.some((item) => item.modalId === option.modalId)
    ) {
      updateModalVisible(option.modalId, true);
      updateModalProps(option.modalId, option.props);
      updateComponentProps(option.modalId, option.componentProps);
      return option.modalId;
    }
    const modalId = option.modalId ?? generateModalId();
    const [component, compLoading] = getItemComponent<T, P>(option, () => {
      updateModalCompLoading(modalId, false);
    });
    const item: ModalItem<T, P> = {
      ...option,
      component,
      asyncComponent: void 0,
      compLoading,
      visible: true,
      modalId
    };
    modals.value.push(item);
    return modalId;
  };

  return {
    modals,
    openModal,
    closeModal,
    closeAllModal,
    removeModal,
    removeAllModal,
    updateModalVisible,
    updateModalState,
    updateModalProps
  };
}

/**
 * 提供弹窗操作方法给后代组件
 */
export function useModalRenderProvider(): UseModalRenderResult {
  const {
    modals,
    openModal,
    closeModal,
    closeAllModal,
    removeModal,
    removeAllModal,
    updateModalVisible,
    updateModalState,
    updateModalProps
  } = useModalRender();

  provide(MODAL_UTIL_KEY, {
    openModal,
    closeModal,
    closeAllModal,
    removeModal,
    removeAllModal,
    updateModalState,
    updateModalProps
  });

  return {
    modals,
    openModal,
    closeModal,
    closeAllModal,
    removeModal,
    removeAllModal,
    updateModalVisible,
    updateModalState,
    updateModalProps
  };
}
