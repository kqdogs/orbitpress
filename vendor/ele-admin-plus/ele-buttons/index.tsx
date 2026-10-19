/** 配置化操作按钮 */
import { defineComponent } from 'vue';
import type { UserComponentSlots, SlotObject } from '../ele-app/types';
import { useLocale } from '../ele-config-provider/receiver';
import ItemRender from './components/item-render.vue';
import { buttonsProps, buttonsEmits } from './props';

export default defineComponent({
  name: 'EleButtons',
  props: buttonsProps,
  emits: buttonsEmits,
  setup(props, { emit, slots }) {
    /** 国际化语言 */
    const { lang } = useLocale('buttons', props);

    /** 操作项点击事件 */
    const handleItemClick = (command: any, e?: MouseEvent) => {
      emit('itemClick', command, e);
    };

    /** 传递操作按钮插槽 */
    const getItemSlots = (itemSlots?: UserComponentSlots) => {
      const slotObj: SlotObject = {};
      if (!itemSlots) {
        return slotObj;
      }
      Object.keys(itemSlots).forEach((key) => {
        const slot = itemSlots[key];
        if (slot) {
          if (typeof slot === 'function') {
            slotObj[key] = slot;
          } else if (typeof slot === 'string') {
            slotObj[key] = slots[slot];
          }
        }
      });
      return slotObj;
    };

    /** 渲染操作按钮 */
    const renderItems = (wrapClass: boolean) => {
      return (props.items || []).map((item, index) => (
        <ItemRender
          key={item.key ?? item.command ?? item.title ?? item.preset}
          item={item}
          divider={index === 0 ? false : props.divider}
          type={props.type}
          wrapClass={wrapClass}
          lang={lang.value}
          onItemClick={handleItemClick}
        >
          {getItemSlots(item.slots)}
        </ItemRender>
      ));
    };

    return () =>
      props.gap != null || props.wrap != null || props.modalFooter ? (
        <div
          class={[
            'ele-buttons-wrap ele-buttons',
            {
              'is-nowrap': props.wrap === false,
              'is-gap': props.gap != null,
              'is-modal-footer': props.modalFooter
            }
          ]}
          style={
            props.gap == null || props.gap === true
              ? {}
              : { gap: `${props.gap || 0}px` }
          }
        >
          {renderItems(false)}
          {slots.default?.()}
        </div>
      ) : (
        [renderItems(true), slots.default?.()]
      );
  }
});
