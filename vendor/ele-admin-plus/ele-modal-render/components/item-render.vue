<template>
  <template v-if="item.custom">
    <template v-if="item.component">
      <component
        v-if="typeof item.componentProps === 'function'"
        v-bind="item.componentProps(provideData) || {}"
        :is="item.component"
      >
        <template
          v-for="name in Object.keys($slots).filter((k) => k !== 'default')"
          #[name]="slotProps"
        >
          <slot :name="name" v-bind="slotProps || {}"></slot>
        </template>
      </component>
      <component v-else v-bind="item.componentProps || {}" :is="item.component">
        <template
          v-for="name in Object.keys($slots).filter((k) => k !== 'default')"
          #[name]="slotProps"
        >
          <slot :name="name" v-bind="slotProps || {}"></slot>
        </template>
      </component>
    </template>
  </template>
  <EleDrawer
    v-else-if="item.type === 'drawer'"
    v-bind="(modalProps as EleDrawerPropsAndEmits) || {}"
  >
    <component
      v-if="item.component"
      v-bind="item.componentProps || {}"
      :is="item.component"
    >
      <template
        v-for="name in Object.keys($slots).filter((k) => k !== 'default')"
        #[name]="slotProps"
      >
        <slot :name="name" v-bind="slotProps || {}"></slot>
      </template>
    </component>
    <template
      v-for="name in Object.keys($slots).filter((k) => k !== 'default')"
      #[name]="slotProps"
    >
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </EleDrawer>
  <EleModal v-else v-bind="(modalProps as EleModalPropsAndEmits) || {}">
    <component
      v-if="item.component"
      v-bind="item.componentProps || {}"
      :is="item.component"
    >
      <template
        v-for="name in Object.keys($slots).filter((k) => k !== 'default')"
        #[name]="slotProps"
      >
        <slot :name="name" v-bind="slotProps || {}"></slot>
      </template>
    </component>
    <template
      v-for="name in Object.keys($slots).filter((k) => k !== 'default')"
      #[name]="slotProps"
    >
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </EleModal>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { computed, provide } from 'vue';
  import type {
    EleModalPropsAndEmits,
    EleDrawerPropsAndEmits
  } from '../../ele-app/plus';
  import EleModal from '../../ele-modal/index.vue';
  import EleDrawer from '../../ele-drawer/index.vue';
  import { MODAL_HOLDER_KEY } from '../util';
  import type {
    ModalItem,
    ModalItemId,
    ModalItemType,
    ModalItemProps,
    ModalHolderProvider
  } from '../types';

  defineOptions({ name: 'ItemRender' });

  const props = defineProps({
    item: {
      type: Object as PropType<ModalItem<ModalItemType, Record<string, any>>>,
      required: true
    }
  });

  const emit = defineEmits({
    removeItem: (_modalId?: ModalItemId) => true,
    updateItemVisible: (_modalId?: ModalItemId, _visible?: boolean) => true,
    updateItemProps: (
      _modalId?: ModalItemId,
      _opt?: ModalItemProps<ModalItemType>
    ) => true
  });

  /** 移除当前弹窗 */
  const removeModal = () => {
    emit('removeItem', props.item.modalId);
  };

  /** 修改当前弹窗属性 */
  const setModalProps = (option?: ModalItemProps<ModalItemType>) => {
    emit('updateItemProps', props.item.modalId, option);
  };

  /** 修改当前弹窗显示状态 */
  const handleUpdateItemVisible = (visible?: boolean) => {
    emit('updateItemVisible', props.item.modalId, visible);
  };

  /** 关闭当前弹窗 */
  const closeModal = () => {
    handleUpdateItemVisible(false);
  };

  /** 弹窗属性 */
  const modalProps = computed<ModalItemProps<ModalItemType>>(() => {
    return {
      ...(props.item.props || {}),
      isDeactivated: props.item.isDeactivated,
      compLoading: props.item.compLoading,
      modelValue: props.item.visible,
      'onUpdate:modelValue': handleUpdateItemVisible,
      onClosed: removeModal
    };
  });

  /** 提供数据给内容组件 */
  const provideData: ModalHolderProvider<ModalItemType> = {
    modalProps,
    closeModal,
    removeModal,
    setModalProps
  };
  provide(MODAL_HOLDER_KEY, provideData);
</script>
