import { defineComponent, ref, watch, onMounted, openBlock, createBlock, mergeProps, withCtx, createVNode, unref, createSlots, renderList, renderSlot, normalizeProps, guardReactiveProps } from "vue";
import { ElTree, ElEmpty } from "element-plus";
import { getSlotsMap } from "../../utils/common";
import EleLoading from "../../ele-loading/index";
import { defaultTreeNodeKey, getTreeValueField, getTreeLabelField } from "../util";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "PageSide" },
  __name: "page-side",
  props: {
    /** 侧栏配置 */
    sideConfig: Object,
    /** 数据 */
    data: Array,
    /** 加载状态 */
    loading: Boolean,
    /** 加载错误信息 */
    errorMessage: String,
    /** 选中值 */
    selectedValue: [String, Number, Boolean, Object, Array],
    /** 侧栏树搜索关键字 */
    keywords: String,
    /** 国际化 */
    lang: {
      type: Object,
      required: true
    }
  },
  emits: {
    /** 侧栏树点击事件 */
    treeNodeClick: (_nodeValue) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const treeRef = ref(null);
    const setTreeCurrentKey = (key) => {
      if (key != null) {
        try {
          treeRef.value?.setCurrentKey?.(key);
        } catch (e) {
          console.error(e);
        }
      }
    };
    const handleNodeClick = (item) => {
      if (item != null) {
        emit("treeNodeClick", item[getTreeValueField(props.sideConfig)]);
      }
    };
    const filterNode = (value, item) => {
      if (value) {
        const itemLabel = item[getTreeLabelField(props.sideConfig)];
        return !!(itemLabel && itemLabel.includes(value));
      }
      return true;
    };
    watch(
      () => props.keywords,
      (value) => {
        treeRef.value?.filter?.(value);
      }
    );
    watch(
      () => props.selectedValue,
      (selected) => {
        setTreeCurrentKey(selected);
      }
    );
    onMounted(() => {
      setTreeCurrentKey(props.selectedValue);
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleLoading, mergeProps({
        loading: __props.loading,
        class: "ele-crud-tree-wrapper"
      }, __props.sideConfig?.loadingProps || {}), {
        default: withCtx(() => [
          createVNode(unref(ElTree), mergeProps({
            ref_key: "treeRef",
            ref: treeRef,
            data: __props.data,
            highlightCurrent: true,
            expandOnClickNode: false,
            defaultExpandAll: true,
            filterNodeMethod: filterNode,
            class: "ele-crud-tree",
            nodeKey: unref(defaultTreeNodeKey)
          }, __props.sideConfig?.treeProps || {}, { onNodeClick: handleNodeClick }), createSlots({
            empty: withCtx(() => [
              createVNode(unref(ElEmpty), mergeProps({
                imageSize: 68,
                description: __props.errorMessage
              }, __props.sideConfig?.emptyProps || {}), null, 16, ["description"])
            ]),
            _: 2
          }, [
            renderList(unref(getSlotsMap)(
              _ctx.$slots,
              __props.sideConfig?.treeSlots,
              ["empty"]
            ), (slotName, compSlotName) => {
              return {
                name: compSlotName,
                fn: withCtx((slotProps) => [
                  renderSlot(_ctx.$slots, slotName, normalizeProps(guardReactiveProps(slotProps || {})))
                ])
              };
            })
          ]), 1040, ["data", "nodeKey"])
        ]),
        _: 3
      }, 16, ["loading"]);
    };
  }
});
export {
  _sfc_main as default
};
