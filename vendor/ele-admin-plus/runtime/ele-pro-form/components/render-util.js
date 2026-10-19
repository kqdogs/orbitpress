import { h, mergeProps, createVNode, defineComponent, isVNode } from "vue";
import { get } from "lodash-es";
import { cloneDeep, get as get2, merge, set } from "lodash-es";
import VueDraggable from "vuedraggable";
import { ElFormItem, ElRow, ElCol } from "element-plus";
import { useLocale } from "../../ele-config-provider/receiver";
import { omit, getMappedSlots } from "../../utils/common";
import { childrenRenderProps } from "../props";
import BuilderWrapper from "./builder-wrapper";
import BuilderToolWrapper from "./builder-tool-wrapper";
import DraggableRow from "./draggable-row";
import { defaultItemTypeData } from "./item-type-data";
import { translateJsCode, getScreenSizeColProps, isShowItem, sortableGroupName, computeContentExtraCol } from "./render-core";
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !isVNode(s);
}
function getItemTypeName(item) {
  let itemType = item.type;
  const divTag = item.props?.is;
  if (itemType === "div" && divTag) {
    if (divTag === "tr") {
      itemType = "tableRow";
    } else if (divTag === "td") {
      itemType = "tableCell";
    } else if (divTag === "ele-table" || divTag === "EleTable") {
      itemType = "table";
    } else if (divTag === "el-carousel" || divTag === "ElCarousel") {
      itemType = "carousel";
    } else if (divTag === "el-carousel-item" || divTag === "ElCarouselItem") {
      itemType = "carouselItem";
    } else if (divTag === "el-icon" || divTag === "ElIcon") {
      itemType = "icon";
    } else if (divTag === "ele-admin-layout" || divTag === "EleAdminLayout") {
      itemType = "adminLayout";
    } else if (divTag === "el-alert" || divTag === "EleAlert") {
      itemType = "alert";
    }
  }
  return itemType;
}
function getItemTypeData(item, itemTypeData) {
  const itemType = getItemTypeName(item);
  if (itemType == null) {
    return;
  }
  const typeData = [...itemTypeData || [], ...defaultItemTypeData].find((d) => d.type === itemType);
  return typeData;
}
function getComponentLegacyProps(item) {
  const result = {};
  const itemType = getItemTypeName(item);
  if (itemType) {
    const options = item.options;
    if (options) {
      if (["select", "multipleSelect", "radio", "radioButton", "checkbox", "checkboxButton", "cascader", "multipleCascader", "mention"].includes(itemType)) {
        result.options = options;
      } else if (["treeSelect", "treeMultipleSelect"].includes(itemType)) {
        result.data = options;
      } else if (["checkCard", "multipleCheckCard"].includes(itemType)) {
        result.items = options;
      } else if (itemType === "autocomplete") {
        result.fetchSuggestions = options;
      }
    }
    if (item.label != null) {
      if (["descriptionsItem", "carouselItem"].includes(itemType)) {
        result.label = item.label;
      } else if (["alert", "collapseItem", "descriptions"].includes(itemType)) {
        result.title = item.label;
      } else if (itemType === "card") {
        result.header = item.label;
      } else if (itemType === "image") {
        result.alt = item.label;
      }
    }
    if (item.prop != null) {
      if (["collapseItem", "carouselItem"].includes(itemType)) {
        result.name = item.prop;
      }
    }
  }
  return result;
}
function getRuleMessage(label, requiredMessage, placeholder, requiredLang) {
  if (typeof requiredMessage === "string" && requiredMessage) {
    return requiredMessage;
  }
  if (typeof placeholder === "string" && placeholder) {
    return placeholder;
  }
  const labelText = label ?? "";
  if (!requiredLang) {
    return labelText;
  }
  return requiredLang.replace(/\{\s*label\s*\}/g, String(labelText));
}
function getComponentRefName(item) {
  const prop = item.prop;
  if (prop == null || prop === "" || String(prop).trim() === "") {
    return `${String(item.key)}Ref`;
  }
  return `${String(prop)}Ref`;
}
function renderProFormItem(props) {
  const slots = props.slots || {};
  const formData = props.model || {};
  const typeData = getItemTypeData(props.item, props.itemTypeData);
  const typeSlot = props.item?.type ? slots[props.item.type] : void 0;
  if (!typeSlot && !typeData) {
    return;
  }
  const modelValue = props.item.prop == null ? void 0 : get(formData, props.item.prop);
  const handleUpdateModelValue = (value) => {
    const propName = props.item.prop;
    if (propName != null && props.updateItemValue) {
      props.updateItemValue(propName, value);
    }
  };
  const propsFunctionParams = {
    item: props.item,
    modelValue,
    updateModelValue: handleUpdateModelValue,
    isShowFormItem: (cItem) => isShowItem(cItem, formData, props.formItems || [], props.searchExpand, props.editable),
    renderChildren: (cItem, cSortDisabled, cContainerSelectable) => renderProFormContent({
      model: formData,
      items: cItem.children,
      rules: props.rules,
      grid: cItem.grid,
      rowProps: cItem.rowProps,
      parentItem: cItem,
      formItems: props.formItems,
      searchExpand: props.searchExpand,
      editable: props.editable,
      screenSize: props.screenSize,
      sortDisabled: !!cSortDisabled,
      containerSelectable: !!cContainerSelectable,
      activeItemKey: props.activeItemKey,
      updateItemValue: props.updateItemValue,
      updateItemsData: props.updateItemsData,
      updateActiveItemKey: props.updateActiveItemKey,
      getAndCacheCode: props.getAndCacheCode,
      itemTypeData: props.itemTypeData,
      httpRequest: props.httpRequest,
      getProFormRefs: props.getProFormRefs,
      slots,
      requiredLang: props.requiredLang
    })
  };
  const slotProFormParams = {
    item: props.item,
    // 替代 items , 兼容旧版
    model: formData,
    rules: props.rules,
    grid: props.item?.grid,
    rowProps: props.item?.rowProps,
    parentItem: props.item,
    formItems: props.formItems,
    searchExpand: props.searchExpand,
    editable: props.editable,
    screenSize: props.screenSize,
    activeItemKey: props.activeItemKey,
    itemTypeData: props.itemTypeData,
    httpRequest: props.httpRequest,
    getProFormRefs: props.getProFormRefs,
    getAndCacheCode: props.getAndCacheCode,
    updateItemValue: props.updateItemValue,
    updateItemsData: props.updateItemsData,
    updateActiveItemKey: props.updateActiveItemKey,
    slots,
    requiredLang: props.requiredLang
  };
  const itemSlots = {};
  if (!typeSlot) {
    const itemSlotMap = props.item.slots || {};
    Object.keys(itemSlotMap).forEach((name) => {
      if (itemSlotMap[name]) {
        const slotFuntion = slots[itemSlotMap[name]];
        if (slotFuntion) {
          itemSlots[name] = (slotProps) => slotFuntion({
            proForm: slotProFormParams,
            ...slotProps || {}
          });
        }
      }
    });
    if (typeData && typeData.reservedSlots) {
      const itemReservedSlots = typeData.reservedSlots(propsFunctionParams);
      Object.keys(itemReservedSlots).forEach((name) => {
        if (itemReservedSlots[name]) {
          itemSlots[name] = itemReservedSlots[name];
        }
      });
    }
    if (!itemSlots.default) {
      const csd = !(props.item.containerDraggable ?? !typeData?.sortDisabled);
      const isRenderLabel = typeData?.renderLabelText && props.item.label != null && props.item.label !== "";
      const isRenderChildren = (!typeData || typeData.isContainer) && (!csd && props.editable || props.item.children && props.item.children.length);
      if (isRenderLabel || isRenderChildren) {
        itemSlots.default = () => {
          const nodes = [];
          if (isRenderLabel && props.item.label != null) {
            nodes.push(props.item.label);
          }
          if (isRenderChildren) {
            const contentNode = renderProFormContent({
              model: formData,
              items: props.item.children,
              rules: props.rules,
              grid: props.item.grid,
              rowProps: props.item.rowProps,
              parentItem: props.item,
              formItems: props.formItems,
              searchExpand: props.searchExpand,
              editable: props.editable,
              screenSize: props.screenSize,
              sortDisabled: csd,
              containerSelectable: !!typeData?.containerSelectable,
              activeItemKey: props.activeItemKey,
              updateItemValue: props.updateItemValue,
              updateItemsData: props.updateItemsData,
              updateActiveItemKey: props.updateActiveItemKey,
              getAndCacheCode: props.getAndCacheCode,
              itemTypeData: props.itemTypeData,
              httpRequest: props.httpRequest,
              getProFormRefs: props.getProFormRefs,
              slots,
              requiredLang: props.requiredLang
            });
            if (contentNode) {
              if (Array.isArray(contentNode)) {
                contentNode.forEach((node) => {
                  nodes.push(node);
                });
              } else {
                nodes.push(contentNode);
              }
            }
          }
          return nodes;
        };
      }
    }
  }
  const componentTag = typeData?.component || "div";
  const isDivTag = componentTag === "div" || componentTag === "td";
  const componentPropsData = translateJsCode(props.item.props || {}, formData, props.formItems || [], props.searchExpand, props.httpRequest, props.getProFormRefs, props.getAndCacheCode).result;
  const componentNode = typeSlot ? typeSlot({
    item: {
      ...props.item,
      props: componentPropsData
    },
    model: formData,
    modelValue,
    updateValue: handleUpdateModelValue,
    updatePropValue: props.updateItemValue,
    itemComponentRef: getComponentRefName(props.item),
    proForm: slotProFormParams
  }) : h((isDivTag ? props.item.props?.is : void 0) || componentTag, mergeProps({
    key: props.key
  }, getComponentLegacyProps(props.item), typeData?.defaultProps?.(propsFunctionParams) || {}, isDivTag ? omit(componentPropsData, ["is"]) : typeData?.type === "col" ? getScreenSizeColProps(props.screenSize, {}, componentPropsData) : componentPropsData, typeData?.reservedProps?.(propsFunctionParams) || {}, {
    ref: getComponentRefName(props.item)
  }), itemSlots);
  if (typeData?.isContainer || props.item.itemType === "container" || props.item.itemType === "view") {
    return componentNode;
  }
  const itemPropsData = translateJsCode(props.item.itemProps || {}, formData, props.formItems || [], props.searchExpand, props.httpRequest, props.getProFormRefs, props.getAndCacheCode).result;
  const labelWidth = itemPropsData.labelWidth;
  const formItemLabelWidth = typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth;
  const formItemSlots = getMappedSlots(slots, props.item.itemSlots);
  formItemSlots.default = () => componentNode;
  const iRule = itemPropsData.rules;
  const iRules = iRule ? Array.isArray(iRule) ? iRule : [iRule] : void 0;
  const fRule = props.rules && props.item.prop ? get(props.rules, props.item.prop) : void 0;
  const fRules = fRule ? Array.isArray(fRule) ? fRule : [fRule] : void 0;
  const formItemRules = iRules || fRules || [];
  const trigger = typeData?.requiredTrigger ?? "change";
  const message = getRuleMessage(props.item.label, props.item.requiredMessage, componentPropsData.placeholder, props.requiredLang);
  if (props.item.required) {
    formItemRules.unshift({
      required: true,
      message,
      trigger
    });
  }
  return createVNode(ElFormItem, mergeProps({
    "key": props.key,
    "label": props.item.label
  }, itemPropsData, {
    "labelWidth": formItemLabelWidth,
    "prop": props.item.prop,
    "rules": formItemRules
  }), _isSlot(formItemSlots) ? formItemSlots : {
    default: () => [formItemSlots]
  });
}
function renderProFormContent(props) {
  const nodes = [];
  const slots = props.slots || {};
  const itemsData = props.items || [];
  const formData = props.model || {};
  const ownSlots = ["default", "contentExtra"];
  const getProFormItemNode = (item, isEditable, isSortDisabled) => {
    const itemKey = item.key ?? item.prop;
    const defaultSlot = () => {
      return renderProFormItem({
        key: itemKey,
        item,
        model: formData,
        rules: props.rules,
        formItems: props.formItems,
        searchExpand: props.searchExpand,
        editable: props.editable,
        screenSize: props.screenSize,
        activeItemKey: props.activeItemKey,
        updateItemValue: props.updateItemValue,
        updateItemsData: props.updateItemsData,
        updateActiveItemKey: props.updateActiveItemKey,
        getAndCacheCode: props.getAndCacheCode,
        itemTypeData: props.itemTypeData,
        httpRequest: props.httpRequest,
        getProFormRefs: props.getProFormRefs,
        slots: omit(slots, ownSlots),
        requiredLang: props.requiredLang
      });
    };
    if (!isEditable) {
      return defaultSlot();
    }
    return createVNode(BuilderWrapper, {
      "key": itemKey,
      "item": item,
      "handle": !isSortDisabled,
      "activeItemKey": props.activeItemKey,
      "onUpdate:activeItemKey": props.updateActiveItemKey
    }, {
      default: defaultSlot,
      builderItemHandleContent: slots.builderItemHandleContent,
      builderItemTools: slots.builderItemTools
    });
  };
  const handleUpdateItemsModelValue = (data) => {
    if (props.updateItemsData) {
      props.updateItemsData(data, props.parentItem);
    }
  };
  if (props.grid) {
    const gridColProps = props.grid === true ? {
      span: 12
    } : props.grid;
    const getItemColNode = (item, isEditable, isSortDisabled, className) => {
      let _slot;
      const itemKey = item.key ?? item.prop;
      const itemColProps = translateJsCode(item.colProps || {}, formData, props.formItems || [], props.searchExpand, props.httpRequest, props.getProFormRefs, props.getAndCacheCode).result;
      return createVNode(ElCol, mergeProps({
        "key": itemKey,
        "class": className
      }, getScreenSizeColProps(props.screenSize, gridColProps, itemColProps)), _isSlot(_slot = getProFormItemNode(item, isEditable, isSortDisabled)) ? _slot : {
        default: () => [_slot]
      });
    };
    const getContentExtraNode = (contentExtraSlot) => {
      let _slot2;
      const itemsLength = (props.formItems || []).filter((item) => isShowItem(item, formData, props.formItems || [], props.searchExpand, props.editable)).length;
      return createVNode(ElCol, getScreenSizeColProps(props.screenSize, props.autoContentExtraCol ? computeContentExtraCol(gridColProps, itemsLength) : {
        span: 24
      }, translateJsCode(props.contentExtraColProps || {}, formData, props.formItems || [], props.searchExpand, props.httpRequest, props.getProFormRefs, props.getAndCacheCode).result), _isSlot(_slot2 = contentExtraSlot()) ? _slot2 : {
        default: () => [_slot2]
      });
    };
    if (props.editable && !props.sortDisabled) {
      return createVNode(DraggableRow, {
        "itemsData": itemsData,
        "componentData": translateJsCode(props.rowProps || {}, formData, props.formItems || [], props.searchExpand, props.httpRequest, props.getProFormRefs, props.getAndCacheCode).result,
        "screenSize": props.screenSize,
        "gridColProps": gridColProps,
        "formData": formData,
        "formItems": props.formItems,
        "searchExpand": props.searchExpand,
        "httpRequest": props.httpRequest,
        "getProFormRefs": props.getProFormRefs,
        "getAndCacheCode": props.getAndCacheCode,
        "autoContentExtraCol": props.autoContentExtraCol,
        "contentExtraColProps": props.contentExtraColProps,
        "editable": props.editable,
        "onUpdateItems": handleUpdateItemsModelValue
      }, {
        item: ({
          element
        }) => getProFormItemNode(element, true, false),
        footer: slots.contentExtra ? slots.contentExtra() : void 0
      });
    }
    itemsData.forEach((item) => {
      const isShow = isShowItem(item, formData, props.formItems || [], props.searchExpand, props.editable);
      if (isShow) {
        nodes.push(getItemColNode(item));
      }
    });
    if (slots.contentExtra) {
      nodes.push(getContentExtraNode(slots.contentExtra));
    }
    return createVNode(ElRow, translateJsCode(props.rowProps || {}, formData, props.formItems || [], props.searchExpand, props.httpRequest, props.getProFormRefs, props.getAndCacheCode).result, _isSlot(nodes) ? nodes : {
      default: () => [nodes]
    });
  }
  if (props.editable && !props.sortDisabled) {
    const footerSlot = () => createVNode(BuilderToolWrapper, {
      "item": props.parentItem,
      "activeItemKey": props.activeItemKey,
      "handle": false
    }, {
      builderItemHandleContent: slots.builderItemHandleContent,
      builderItemTools: slots.builderItemTools
    });
    const handleContainerBuilderWrapperClick = (e) => {
      const parentItemKey = props.parentItem?.key;
      if (props.containerSelectable && parentItemKey != null) {
        e.stopPropagation();
        if (props.updateActiveItemKey) {
          props.updateActiveItemKey(parentItemKey);
        }
      }
    };
    nodes.push(createVNode(VueDraggable, {
      "itemKey": "key",
      "animation": 150,
      "modelValue": itemsData,
      "setData": () => void 0,
      "group": sortableGroupName,
      "handle": ".ele-pro-form-builder-item-handle",
      "draggable": ".ele-pro-form-builder-item-wrapper",
      "class": ["ele-pro-form-builder-container-wrapper", {
        "is-selectable": props.containerSelectable
      }, {
        "is-active": props.containerSelectable && props.parentItem && props.parentItem.key != null && props.activeItemKey != null && props.activeItemKey === props.parentItem.key
      }],
      "onUpdate:modelValue": handleUpdateItemsModelValue,
      "onClick": handleContainerBuilderWrapperClick
    }, {
      item: ({
        element
      }) => getProFormItemNode(element, true),
      footer: props.containerSelectable && props.parentItem ? footerSlot : void 0
    }));
  } else {
    itemsData.forEach((item) => {
      if (isShowItem(item, formData, props.formItems || [], props.searchExpand, props.editable)) {
        const proFormItemNode = getProFormItemNode(item);
        if (proFormItemNode) {
          if (Array.isArray(proFormItemNode)) {
            proFormItemNode.forEach((node) => {
              nodes.push(node);
            });
          } else {
            nodes.push(proFormItemNode);
          }
        }
      }
    });
  }
  if (slots.contentExtra) {
    const contentExtraNodes = slots.contentExtra();
    if (contentExtraNodes) {
      if (Array.isArray(contentExtraNodes)) {
        contentExtraNodes.forEach((node) => {
          nodes.push(node);
        });
      } else {
        nodes.push(contentExtraNodes);
      }
    }
  }
  return nodes;
}
const ChildrenRender = /* @__PURE__ */ defineComponent({
  name: "ChildrenRender",
  props: childrenRenderProps,
  emits: {
    updateItemValue: (_prop, _value) => true,
    updateItemsData: (_items, _parentItem) => true,
    "update:activeItemKey": (_activeKey) => true
  },
  setup(props, {
    emit,
    slots
  }) {
    const {
      lang
    } = useLocale("proForm", props);
    const handleUpdateItemValue = (prop, value) => {
      emit("updateItemValue", prop, value);
    };
    const handleUpdateItemsData = (items, parentItem) => {
      emit("updateItemsData", items, parentItem);
    };
    const handleUpdateActiveItemKey = (activeKey) => {
      emit("update:activeItemKey", activeKey);
    };
    return () => renderProFormContent({
      ...omit(props, ["item"]),
      items: props.items ?? props.item?.children,
      // 兼容旧版
      updateItemValue: props.updateItemValue ?? handleUpdateItemValue,
      updateItemsData: props.updateItemsData ?? handleUpdateItemsData,
      updateActiveItemKey: props.updateActiveItemKey ?? handleUpdateActiveItemKey,
      slots: props.slots ?? slots,
      requiredLang: props.requiredLang ?? lang.value.required
    });
  }
});
export {
  ChildrenRender,
  cloneDeep,
  getComponentLegacyProps,
  getComponentRefName,
  getItemTypeData,
  getItemTypeName,
  getRuleMessage,
  get2 as getValue,
  merge as mergeValue,
  renderProFormContent,
  renderProFormItem,
  set as setValue
};
