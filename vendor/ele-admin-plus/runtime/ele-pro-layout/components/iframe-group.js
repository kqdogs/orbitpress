import { defineComponent, computed, ref, watch, openBlock, createElementBlock, Fragment, renderList, withDirectives, vShow, createCommentVNode, createBlock, TransitionGroup, withCtx, nextTick } from "vue";
import { useTimer } from "../../utils/hook";
import { getIframeSrc } from "../util";
const _hoisted_1 = { class: "ele-admin-iframe-wrap" };
const _hoisted_2 = ["data-id", "src"];
const _hoisted_3 = ["data-id", "src"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "IframeGroup" },
  __name: "iframe-group",
  props: {
    /** 是否支持内嵌缓存 */
    keepAlive: Boolean,
    /** 内嵌切换动画 */
    transitionName: String,
    /** 内嵌进入动画延迟时间 */
    transitionDelay: Number,
    /** 页签数据 */
    tabData: {
      type: Array,
      required: true
    },
    /** 页签选中 */
    tabActive: String
  },
  setup(__props) {
    const props = __props;
    const [startActiveTimer, stopActiveTimer] = useTimer();
    const data = computed(() => {
      const list = [];
      props.tabData.forEach((t) => {
        const isAlive = t.meta?.keepAlive !== false;
        if (t.key && t.meta?.iframe && isAlive) {
          const src = getIframeSrc(t.fullPath, t.meta.iframe);
          list.push({ id: t.key, src, refresh: t.refresh });
        }
      });
      return list.sort((a, b) => a.id === b.id ? 0 : a.id > b.id ? 1 : -1);
    });
    const dataActive = computed(() => {
      if (!props.tabActive || !data.value.length || !data.value.some((d) => d.id === props.tabActive)) {
        return;
      }
      return props.tabActive;
    });
    const active = ref(dataActive.value);
    const handleLeave = (delay) => {
      if (!dataActive.value) {
        active.value = null;
        return;
      }
      if (!delay) {
        active.value = dataActive.value;
        return;
      }
      startActiveTimer(() => {
        nextTick(() => {
          active.value = dataActive.value;
        });
      }, delay);
    };
    watch(dataActive, () => {
      stopActiveTimer();
      if (active.value == null) {
        handleLeave(props.transitionName ? props.transitionDelay : void 0);
      } else if (!props.transitionName) {
        handleLeave();
      } else {
        active.value = null;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        !__props.transitionName ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(data.value, (item) => {
          return openBlock(), createElementBlock(Fragment, {
            key: item.id
          }, [
            !item.refresh ? withDirectives((openBlock(), createElementBlock("iframe", {
              key: 0,
              "data-id": item.id,
              src: item.src,
              class: "ele-admin-iframe"
            }, null, 8, _hoisted_2)), [
              [vShow, active.value === item.id]
            ]) : createCommentVNode("", true)
          ], 64);
        }), 128)) : (openBlock(), createBlock(TransitionGroup, {
          key: 1,
          appear: true,
          name: __props.transitionName,
          onAfterLeave: _cache[0] || (_cache[0] = ($event) => handleLeave())
        }, {
          default: withCtx(() => [
            (openBlock(true), createElementBlock(Fragment, null, renderList(data.value, (item) => {
              return openBlock(), createElementBlock(Fragment, {
                key: item.id
              }, [
                !item.refresh ? withDirectives((openBlock(), createElementBlock("iframe", {
                  key: 0,
                  "data-id": item.id,
                  src: item.src,
                  class: "ele-admin-iframe"
                }, null, 8, _hoisted_3)), [
                  [vShow, active.value === item.id]
                ]) : createCommentVNode("", true)
              ], 64);
            }), 128))
          ]),
          _: 1
        }, 8, ["name"]))
      ]);
    };
  }
});
export {
  _sfc_main as default
};
