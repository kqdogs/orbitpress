import { inject, onBeforeUnmount, onDeactivated, onActivated, defineComponent, createVNode } from "vue";
import ItemRender from "./components/item-render";
import { MODAL_UTIL_KEY, MODAL_HOLDER_KEY, useModalRender } from "./util";
function useModal() {
  let isHolderRender = false;
  const renderProvider = inject(MODAL_UTIL_KEY, null);
  const holderProvider = inject(MODAL_HOLDER_KEY, null);
  const {
    modals,
    openModal,
    closeModal,
    closeAllModal,
    removeModal,
    removeAllModal,
    updateModalVisible,
    updateModalProps
  } = useModalRender();
  const modalIds = [];
  const aliveModalIds = [];
  const ModalHolder = /* @__PURE__ */ defineComponent({
    name: "ModalHolder",
    setup() {
      isHolderRender = true;
      const renderModal = (item) => {
        return createVNode(ItemRender, {
          "key": item.modalId,
          "item": item,
          "onRemoveItem": removeModal,
          "onUpdateItemVisible": updateModalVisible,
          "onUpdateItemProps": updateModalProps
        }, {
          ...item.slots || {}
        });
      };
      return () => modals.value.map((item) => renderModal(item));
    }
  });
  const methods = {
    openModal: (option) => {
      if (isHolderRender || !renderProvider) {
        const modalId2 = openModal(option);
        if (modalId2 != null) {
          modalIds.push(modalId2);
          if (option.keepAlive) {
            aliveModalIds.push(modalId2);
          }
        }
        return modalId2;
      }
      const modalId = renderProvider.openModal(option);
      if (modalId != null) {
        modalIds.push(modalId);
        if (option.keepAlive) {
          aliveModalIds.push(modalId);
        }
      }
      return modalId;
    },
    closeAllModal: (current) => {
      if (isHolderRender || !renderProvider) {
        closeAllModal();
        return;
      }
      if (!current) {
        renderProvider.closeAllModal();
        return;
      }
      modalIds.forEach((modalId) => {
        if (renderProvider) {
          renderProvider.closeModal(modalId);
        }
      });
    },
    closeModal: (modalId) => {
      if (modalId == null) {
        holderProvider && holderProvider.closeModal();
        return;
      }
      if (isHolderRender || !renderProvider) {
        closeModal(modalId);
        return;
      }
      renderProvider.closeModal(modalId);
    },
    setModalProps: (modalId, options) => {
      if (modalId == null || typeof modalId === "object") {
        if (modalId != null && holderProvider) {
          holderProvider.setModalProps(modalId);
        }
        return;
      }
      if (isHolderRender || !renderProvider) {
        updateModalProps(modalId, options);
        return;
      }
      renderProvider.updateModalProps(modalId, options);
    },
    removeAllModal: (current) => {
      if (isHolderRender || !renderProvider) {
        removeAllModal();
        return;
      }
      if (!current) {
        renderProvider.removeAllModal();
        return;
      }
      modalIds.forEach((modalId) => {
        if (renderProvider) {
          renderProvider.removeModal(modalId);
        }
      });
    },
    removeModal: (modalId) => {
      if (modalId == null) {
        holderProvider && holderProvider.removeModal();
        return;
      }
      if (isHolderRender || !renderProvider) {
        removeModal(modalId);
        return;
      }
      renderProvider.removeModal(modalId);
    }
  };
  onBeforeUnmount(() => {
    modalIds.forEach((modalId) => {
      if (!aliveModalIds.includes(modalId)) {
        methods.closeModal(modalId);
      }
    });
  });
  onDeactivated(() => {
    if (isHolderRender) {
      return;
    }
    modalIds.forEach((modalId) => {
      if (!renderProvider || aliveModalIds.includes(modalId)) {
        return;
      }
      renderProvider.updateModalState(modalId, true);
    });
  });
  onActivated(() => {
    if (isHolderRender) {
      return;
    }
    modalIds.forEach((modalId) => {
      if (!renderProvider) {
        return;
      }
      renderProvider.updateModalState(modalId, false);
    });
  });
  return {
    ...methods,
    ModalHolder,
    modalProps: holderProvider?.modalProps
  };
}
export {
  useModal
};
