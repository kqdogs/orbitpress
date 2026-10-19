import { defineComponent, ref, onMounted, onBeforeUnmount, watch, openBlock, createElementBlock } from "vue";
import Player from "xgplayer";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleXgPlayer" },
  __name: "index",
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  emits: {
    player: (_player) => true
  },
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    let player = null;
    const rootRef = ref(null);
    const init = () => {
      destroy();
      if (rootRef.value && props.config?.url) {
        player = new Player(
          Object.assign({}, props.config, { el: rootRef.value })
        );
        emit("player", player);
      }
    };
    const destroy = () => {
      if (player && typeof player.destroy === "function") {
        player.destroy();
        player = null;
      }
    };
    onMounted(() => {
      init();
    });
    onBeforeUnmount(() => {
      destroy();
    });
    watch(
      () => props.config,
      () => {
        init();
      }
    );
    __expose({
      player
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "rootRef",
        ref: rootRef
      }, null, 512);
    };
  }
});
export {
  _sfc_main as default
};
