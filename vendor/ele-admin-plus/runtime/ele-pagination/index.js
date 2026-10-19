import { defineComponent, ref, computed, openBlock, createBlock, unref, normalizeClass, createSlots, renderList, withCtx, renderSlot, normalizeProps, guardReactiveProps } from "vue";
import { ElPagination } from "element-plus";
import { paginationEmits, paginationProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ElePagination" },
  __name: "index",
  props: paginationProps,
  emits: paginationEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const paginationRef = ref(null);
    const isInfinite = computed(() => "*" === props.total);
    const pageTotal = computed(() => {
      if (isInfinite.value) {
        if (props.hasNext) {
          return Number.MAX_SAFE_INTEGER;
        }
        return (props.currentPage || 1) * (props.pageSize || 10);
      }
      const num = props.total == null ? void 0 : Number(props.total);
      return num == null || isNaN(num) ? void 0 : num;
    });
    const sizesPopperClass = computed(() => {
      const classes = ["ele-pagination-popper"];
      if (props.isFixedPopper) {
        classes.push("is-fixed");
      }
      if (typeof props.popperClass === "string" && props.popperClass) {
        classes.push(props.popperClass);
      }
      return classes.join(" ");
    });
    const handleUpdateCurrentPage = (currentPage) => {
      emit("update:currentPage", currentPage);
    };
    const handleUpdatePageSize = (pageSize) => {
      emit("update:pageSize", pageSize);
    };
    __expose({
      paginationRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ElPagination), {
        ref_key: "paginationRef",
        ref: paginationRef,
        small: _ctx.small,
        size: _ctx.size,
        background: _ctx.type === "circle" ? false : _ctx.background,
        pageSize: _ctx.pageSize,
        defaultPageSize: _ctx.defaultPageSize,
        total: pageTotal.value,
        pageCount: _ctx.pageCount,
        pagerCount: _ctx.pagerCount,
        currentPage: _ctx.currentPage,
        defaultCurrentPage: _ctx.defaultCurrentPage,
        layout: _ctx.layout,
        pageSizes: _ctx.pageSizes,
        popperClass: sizesPopperClass.value,
        prevText: _ctx.prevText,
        prevIcon: _ctx.prevIcon,
        nextText: _ctx.nextText,
        nextIcon: _ctx.nextIcon,
        disabled: _ctx.disabled,
        teleported: _ctx.teleported,
        hideOnSinglePage: _ctx.hideOnSinglePage,
        class: normalizeClass(["ele-pagination", [{ "is-circle": _ctx.type === "circle" }, { "is-infinite": isInfinite.value }]]),
        "onUpdate:currentPage": handleUpdateCurrentPage,
        "onUpdate:pageSize": handleUpdatePageSize
      }, createSlots({ _: 2 }, [
        renderList(Object.keys(_ctx.$slots), (name) => {
          return {
            name,
            fn: withCtx((slotProps) => [
              renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
            ])
          };
        })
      ]), 1032, ["small", "size", "background", "pageSize", "defaultPageSize", "total", "pageCount", "pagerCount", "currentPage", "defaultCurrentPage", "layout", "pageSizes", "popperClass", "prevText", "prevIcon", "nextText", "nextIcon", "disabled", "teleported", "hideOnSinglePage", "class"]);
    };
  }
});
export {
  _sfc_main as default
};
