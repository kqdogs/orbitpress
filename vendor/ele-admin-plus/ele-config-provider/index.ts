/** 全局配置 */
import { defineComponent, provide, reactive, watch } from 'vue';
import { configProviderProps } from './props';
import type { GlobalProvide } from './types';
import { CONFIG_KEY, configValues } from './receiver';

export default defineComponent({
  name: 'EleConfigProvider',
  props: configProviderProps,
  setup(props, { slots }) {
    const config = reactive<GlobalProvide>({ ...props });

    provide(CONFIG_KEY, config);

    watch(
      () => props.locale,
      () => {
        config.locale = props.locale;
      }
    );

    watch(
      () => props.table,
      () => {
        config.table = props.table;
      },
      { deep: true }
    );

    watch(
      () => props.message,
      () => {
        config.message = props.message;
      },
      { deep: true }
    );

    watch(
      () => props.messageBox,
      () => {
        config.messageBox = props.messageBox;
      },
      { deep: true }
    );

    watch(
      () => props.license,
      (code) => {
        const value = code ? code.trim() : void 0;
        if (!configValues) {
          config.key = void 0;
        } else if (!value) {
          const values = configValues.split('=');
          if (values.length > 16) {
            config.key = `${values[16]}${[values[17], values[18]].map((d) => (d == null ? '' : '=')).join('')}`;
          } else {
            config.key = value;
          }
        } else {
          config.key = value;
        }
      },
      { immediate: true }
    );

    watch(
      () => props.mapKey,
      () => {
        config.mapKey = props.mapKey;
      }
    );

    return () => slots.default?.();
  }
});
