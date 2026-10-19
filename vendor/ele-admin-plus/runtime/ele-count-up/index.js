import { defineComponent, ref, watch, onMounted, onBeforeUnmount, openBlock, createElementBlock, unref } from "vue";
import { CountUp } from "countup.js";
import { countUpEmits, countUpProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleCountUp" },
  __name: "index",
  props: countUpProps,
  emits: countUpEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isFunction = (value) => typeof value === "function";
    let instance;
    const rootRef = ref(null);
    const create = () => {
      const elem = unref(rootRef);
      if (instance || !elem) {
        return;
      }
      const ins = new CountUp(elem, props.endVal ?? 0, props.options);
      if (ins.error) {
        console.warn(ins);
        return;
      }
      instance = ins;
    };
    const printValue = (value) => {
      if (instance && isFunction(instance.printValue)) {
        return instance.printValue(value);
      }
    };
    const start = (callback) => {
      if (instance && isFunction(instance.start)) {
        return instance.start(callback);
      }
    };
    const pauseResume = () => {
      if (instance && isFunction(instance.pauseResume)) {
        return instance.pauseResume();
      }
    };
    const reset = () => {
      if (instance && isFunction(instance.reset)) {
        return instance.reset();
      }
    };
    const update = (newEndVal) => {
      if (instance && isFunction(instance.update)) {
        return instance.update(newEndVal ?? 0);
      }
    };
    const destroy = () => {
      reset();
      instance = null;
    };
    watch(
      () => props.endVal,
      (value) => {
        update(value);
      }
    );
    watch(
      () => props.options,
      () => {
        destroy();
        create();
        emit("ready", instance);
      }
    );
    onMounted(() => {
      create();
      if (props.delay < 0) {
        emit("ready", instance);
        return;
      }
      setTimeout(() => {
        if (instance && isFunction(instance.start)) {
          instance.start(() => {
            emit("ready", instance);
          });
        }
      }, props.delay);
    });
    onBeforeUnmount(() => {
      destroy();
    });
    __expose({
      printValue,
      start,
      pauseResume,
      reset,
      update
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        ref_key: "rootRef",
        ref: rootRef
      }, null, 512);
    };
  }
});
export {
  _sfc_main as default
};
