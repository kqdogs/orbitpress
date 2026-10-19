import { ref, provide, markRaw, defineAsyncComponent } from "vue";
import { useTimer } from "../utils/hook";
import ModalLoading from "./components/modal-loading";
const MODAL_RELEASE_TIMEOUT = 500;
const MODAL_UTIL_KEY = /* @__PURE__ */ Symbol(
  "modalUtil"
);
const MODAL_HOLDER_KEY = /* @__PURE__ */ Symbol("modalHolder");
function getItemComponent(item, onLoaded) {
  const { component, asyncComponent, custom, asyncComponentOptions } = item;
  if (component && typeof component === "object") {
    return [markRaw(component), false];
  }
  if (component != null) {
    return [component, false];
  }
  if (!asyncComponent) {
    return [void 0, false];
  }
  if (custom) {
    const comp2 = defineAsyncComponent({
      loadingComponent: ModalLoading,
      ...asyncComponentOptions || {},
      loader: asyncComponent
    });
    return [markRaw(comp2), false];
  }
  const comp = defineAsyncComponent(async () => {
    const c = await asyncComponent();
    onLoaded();
    return c;
  });
  return [markRaw(comp), true];
}
function useModalRender() {
  let startId = 0;
  const modals = ref([]);
  const [startReleaseTimer] = useTimer(MODAL_RELEASE_TIMEOUT);
  const generateModalId = () => {
    startId++;
    return startId;
  };
  const releaseModalData = (modalIds) => {
    startReleaseTimer(() => {
      for (let i = modals.value.length - 1; i >= 0; i--) {
        const { visible, modalId } = modals.value[i];
        if ((visible == null || visible === false) && modalIds.includes(modalId)) {
          modals.value.splice(i, 1);
        }
      }
    });
  };
  const updateModalVisible = (modalId, visible) => {
    if (modalId == null) {
      return;
    }
    const item = modals.value.find((item2) => item2.modalId === modalId);
    if (item) {
      item.visible = visible;
      releaseModalData([modalId]);
    }
  };
  const closeModal = (modalId) => {
    updateModalVisible(modalId, false);
  };
  const closeAllModal = () => {
    const modalIds = [];
    modals.value.forEach((item) => {
      modalIds.push(item.modalId);
      item.visible = false;
    });
    releaseModalData(modalIds);
  };
  const removeModal = (modalId) => {
    if (modalId == null) {
      return;
    }
    const index = modals.value.findIndex((item) => item.modalId === modalId);
    if (index !== -1) {
      modals.value.splice(index, 1);
    }
  };
  const removeAllModal = () => {
    modals.value = [];
  };
  const updateModalState = (modalId, deactivated) => {
    if (modalId == null) {
      return;
    }
    const item = modals.value.find((item2) => item2.modalId === modalId);
    if (item) {
      item.isDeactivated = !!deactivated;
    }
  };
  const updateModalCompLoading = (modalId, loading) => {
    if (modalId == null) {
      return;
    }
    const item = modals.value.find((item2) => item2.modalId === modalId);
    if (item) {
      item.compLoading = loading;
    }
  };
  const updateModalProps = (modalId, option) => {
    if (modalId == null || option == null) {
      return;
    }
    const item = modals.value.find((item2) => item2.modalId === modalId);
    if (!item) {
      return;
    }
    if (!item.props) {
      item.props = Object.assign({}, option);
    } else {
      Object.assign(item.props, option);
    }
  };
  const updateComponentProps = (modalId, option) => {
    if (modalId == null || option == null) {
      return;
    }
    const item = modals.value.find((item2) => item2.modalId === modalId);
    if (!item) {
      return;
    }
    if (!item.componentProps) {
      item.componentProps = Object.assign({}, option);
    } else {
      Object.assign(item.componentProps, option);
    }
  };
  const openModal = (option) => {
    if (option.modalId != null && modals.value.some((item2) => item2.modalId === option.modalId)) {
      updateModalVisible(option.modalId, true);
      updateModalProps(option.modalId, option.props);
      updateComponentProps(option.modalId, option.componentProps);
      return option.modalId;
    }
    const modalId = option.modalId ?? generateModalId();
    const [component, compLoading] = getItemComponent(option, () => {
      updateModalCompLoading(modalId, false);
    });
    const item = {
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
function useModalRenderProvider() {
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
export {
  MODAL_HOLDER_KEY,
  MODAL_UTIL_KEY,
  useModalRender,
  useModalRenderProvider
};
