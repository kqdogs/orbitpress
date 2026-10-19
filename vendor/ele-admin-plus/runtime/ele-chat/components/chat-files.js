import { defineComponent, ref, watch, nextTick, onMounted, onBeforeUnmount, openBlock, createElementBlock, normalizeClass, createVNode, unref, withCtx, createBlock, createCommentVNode, createElementVNode, Fragment, renderList, createSlots, renderSlot, mergeProps } from "vue";
import { ElIcon } from "element-plus";
import { ArrowUp, ArrowLeft, ArrowDown, ArrowRight } from "../../icons/index";
import { useTimer, useMousewheel } from "../../utils/hook";
import FileCard from "./file-card";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "chat-files",
  props: {
    /** 附件 */
    files: Array,
    /** 是否只读模式 */
    readonly: Boolean,
    /** 滚动模式 */
    overflow: String,
    /** 上传失败文本 */
    uploadError: String
  },
  emits: {
    /** 附件点击事件 */
    fileClick: (_item, _e) => true,
    /** 附件删除事件 */
    fileRemove: (_item, _e) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const filesRef = ref(null);
    const enableScrollLeft = ref(false);
    const enableScrollRight = ref(false);
    const handleItemClick = (item, e) => {
      emit("fileClick", item, e);
    };
    const handleItemDel = (item, e) => {
      emit("fileRemove", item, e);
    };
    const handleScroll = () => {
      const filesEl = filesRef.value;
      if (!filesEl) {
        return;
      }
      if (props.overflow !== "scrollY") {
        const left = filesEl.scrollLeft || 0;
        enableScrollLeft.value = left > 1;
        const width = filesEl.scrollWidth - filesEl.clientWidth - 1;
        enableScrollRight.value = width > 1 && left < width;
        return;
      }
      const top = filesEl.scrollTop || 0;
      enableScrollLeft.value = top > 1;
      const height = filesEl.scrollHeight - filesEl.clientHeight - 1;
      enableScrollRight.value = height > 1 && top < height;
    };
    const handleScrollTop = (_e, callback) => {
      const filesEl = filesRef.value;
      if (filesEl && filesEl.scrollTop > 0) {
        const top = filesEl.scrollTop - filesEl.clientHeight + 50;
        filesEl.scrollTo({
          top: top < 0 ? 0 : top,
          behavior: "smooth"
        });
        callback && callback();
      }
    };
    const handleScrollLeft = (e, callback) => {
      if (props.overflow === "scrollY") {
        handleScrollTop(e, callback);
        return;
      }
      const filesEl = filesRef.value;
      if (filesEl && filesEl.scrollLeft > 0) {
        const left = filesEl.scrollLeft - filesEl.clientWidth + 50;
        filesEl.scrollTo({
          left: left < 0 ? 0 : left,
          behavior: "smooth"
        });
        callback && callback();
      }
    };
    const handleScrollBottom = (_e, callback) => {
      const filesEl = filesRef.value;
      if (filesEl) {
        const top = filesEl.scrollTop + filesEl.clientHeight - 50;
        filesEl.scrollTo({
          top,
          behavior: "smooth"
        });
        callback && callback();
      }
    };
    const handleScrollRight = (e, callback) => {
      if (props.overflow === "scrollY") {
        handleScrollBottom(e, callback);
        return;
      }
      const filesEl = filesRef.value;
      if (filesEl) {
        const left = filesEl.scrollLeft + filesEl.clientWidth - 50;
        filesEl.scrollTo({
          left,
          behavior: "smooth"
        });
        callback && callback();
      }
    };
    watch(
      () => props.files,
      () => {
        nextTick(() => {
          handleScroll();
        });
      },
      { deep: true }
    );
    const [startScrollTimer, _stopScrollTimer, scrollWaiting] = useTimer(320);
    const { bindMousewheel, unbindMousewheel } = useMousewheel((param) => {
      if (props.overflow === "scrollY" || scrollWaiting.value) {
        return;
      }
      const { e, direction } = param;
      const callback = () => {
        e.preventDefault();
        e.stopPropagation();
      };
      if (direction === "up") {
        if (!enableScrollLeft.value) {
          return;
        }
        startScrollTimer();
        handleScrollLeft(e, callback);
      } else {
        if (!enableScrollRight.value) {
          return;
        }
        startScrollTimer();
        handleScrollRight(e, callback);
      }
      e.preventDefault();
      e.stopPropagation();
    });
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => {
      requestAnimationFrame(() => {
        handleScroll();
      });
    }) : void 0;
    onMounted(() => {
      const filesEl = filesRef.value;
      if (filesEl) {
        if (props.overflow === "scrollY") {
          handleScroll();
        } else {
          bindMousewheel(filesEl);
          observer && observer.observe(filesEl);
        }
      }
    });
    onBeforeUnmount(() => {
      const filesEl = filesRef.value;
      if (filesEl) {
        unbindMousewheel(filesEl);
        observer && observer.unobserve(filesEl);
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-chat-file-wrapper", [
          { "is-ping-left": enableScrollLeft.value },
          { "is-ping-right": enableScrollRight.value },
          { "is-vertical": __props.overflow === "scrollY" }
        ]])
      }, [
        enableScrollLeft.value ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "ele-chat-file-tool",
          onClick: handleScrollLeft
        }, [
          createVNode(unref(ElIcon), null, {
            default: withCtx(() => [
              __props.overflow === "scrollY" ? (openBlock(), createBlock(unref(ArrowUp), { key: 0 })) : (openBlock(), createBlock(unref(ArrowLeft), { key: 1 }))
            ]),
            _: 1
          })
        ])) : createCommentVNode("", true),
        createElementVNode("div", {
          ref_key: "filesRef",
          ref: filesRef,
          class: "ele-chat-files",
          onScroll: handleScroll
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.files, (item) => {
            return openBlock(), createBlock(FileCard, {
              key: item.key ?? item.name,
              item,
              readonly: __props.readonly,
              uploadError: __props.uploadError,
              onClick: (e) => handleItemClick(item, e),
              onFileRemove: handleItemDel
            }, createSlots({ _: 2 }, [
              renderList(Object.keys(_ctx.$slots), (name) => {
                return {
                  name,
                  fn: withCtx((slotProps) => [
                    renderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotProps || {}))
                  ])
                };
              })
            ]), 1032, ["item", "readonly", "uploadError", "onClick"]);
          }), 128))
        ], 544),
        enableScrollRight.value ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: "ele-chat-file-tool",
          onClick: handleScrollRight
        }, [
          createVNode(unref(ElIcon), null, {
            default: withCtx(() => [
              __props.overflow === "scrollY" ? (openBlock(), createBlock(unref(ArrowDown), { key: 0 })) : (openBlock(), createBlock(unref(ArrowRight), { key: 1 }))
            ]),
            _: 1
          })
        ])) : createCommentVNode("", true)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
