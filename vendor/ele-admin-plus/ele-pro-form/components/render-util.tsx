import type { VNode, Slot } from 'vue';
import { defineComponent, h, mergeProps } from 'vue';
import {
  get as getValue,
  set as setValue,
  merge as mergeValue,
  cloneDeep
} from 'lodash-es';
import VueDraggable from 'vuedraggable';
import type { FormItemRule } from 'element-plus';
import { ElRow, ElCol, ElFormItem } from 'element-plus';
import { useLocale } from '../../ele-config-provider/receiver';
import { omit, getMappedSlots } from '../../utils/common';
import type {
  ProFormItemKey,
  ProFormItemProps,
  ProFormItemTypeData,
  ProFormItemRenderSlots,
  ProFormItemPropsFunctionParams
} from '../types';
import type {
  RenderProFormItemProps,
  RenderProFormContentProps,
  RenderSlotProFormParam
} from '../props';
import { childrenRenderProps } from '../props';
import BuilderWrapper from './builder-wrapper.vue';
import BuilderToolWrapper from './builder-tool-wrapper.vue';
import DraggableRow from './draggable-row.vue';
import { defaultItemTypeData } from './item-type-data';
import {
  sortableGroupName,
  getScreenSizeColProps,
  computeContentExtraCol,
  isShowItem,
  translateJsCode
} from './render-core';
export { setValue, getValue, mergeValue, cloneDeep };

/**
 * 获取表单项的类型名称
 * @param item 表单项
 */
export function getItemTypeName(item: ProFormItemProps) {
  let itemType = item.type;
  const divTag = item.props?.is;
  // 类型兼容旧版
  if (itemType === 'div' && divTag) {
    if (divTag === 'tr') {
      itemType = 'tableRow';
    } else if (divTag === 'td') {
      itemType = 'tableCell';
    } else if (divTag === 'ele-table' || divTag === 'EleTable') {
      itemType = 'table';
    } else if (divTag === 'el-carousel' || divTag === 'ElCarousel') {
      itemType = 'carousel';
    } else if (divTag === 'el-carousel-item' || divTag === 'ElCarouselItem') {
      itemType = 'carouselItem';
    } else if (divTag === 'el-icon' || divTag === 'ElIcon') {
      itemType = 'icon';
    } else if (divTag === 'ele-admin-layout' || divTag === 'EleAdminLayout') {
      itemType = 'adminLayout';
    } else if (divTag === 'el-alert' || divTag === 'EleAlert') {
      itemType = 'alert';
    }
  }
  return itemType;
}

/**
 * 获取表单项类型数据
 * @param item 表单项
 * @param itemTypeData 组件类型数据
 */
export function getItemTypeData(
  item: ProFormItemProps,
  itemTypeData?: ProFormItemTypeData[]
) {
  const itemType = getItemTypeName(item);
  if (itemType == null) {
    return;
  }
  const typeData = [...(itemTypeData || []), ...defaultItemTypeData].find(
    (d) => d.type === itemType
  );
  return typeData;
}

/**
 * 生成兼容旧版本的组件默认属性
 * @param item 表单项
 */
export function getComponentLegacyProps(item: ProFormItemProps) {
  const result: Record<string, any> = {};
  const itemType = getItemTypeName(item);
  if (itemType) {
    const options = (item as any).options;
    if (options) {
      if (
        [
          'select',
          'multipleSelect',
          'radio',
          'radioButton',
          'checkbox',
          'checkboxButton',
          'cascader',
          'multipleCascader',
          'mention'
        ].includes(itemType)
      ) {
        result.options = options;
      } else if (['treeSelect', 'treeMultipleSelect'].includes(itemType)) {
        result.data = options;
      } else if (['checkCard', 'multipleCheckCard'].includes(itemType)) {
        result.items = options;
      } else if (itemType === 'autocomplete') {
        result.fetchSuggestions = options;
      }
    }
    if (item.label != null) {
      if (['descriptionsItem', 'carouselItem'].includes(itemType)) {
        result.label = item.label;
      } else if (['alert', 'collapseItem', 'descriptions'].includes(itemType)) {
        result.title = item.label;
      } else if (itemType === 'card') {
        result.header = item.label;
      } else if (itemType === 'image') {
        result.alt = item.label;
      }
    }
    if (item.prop != null) {
      if (['collapseItem', 'carouselItem'].includes(itemType)) {
        result.name = item.prop;
      }
    }
  }
  return result;
}

/**
 * 获取验证规则提示文本
 * @param label 表单项标题
 * @param requiredMessage 必填校验信息
 * @param placeholder 组件占位文本
 * @param requiredLang 默认的必填提示文本
 */
export function getRuleMessage(
  label?: string,
  requiredMessage?: string,
  placeholder?: string,
  requiredLang?: string
) {
  if (typeof requiredMessage === 'string' && requiredMessage) {
    return requiredMessage;
  }
  if (typeof placeholder === 'string' && placeholder) {
    return placeholder;
  }
  const labelText = label ?? '';
  if (!requiredLang) {
    return labelText;
  }
  return requiredLang.replace(/\{\s*label\s*\}/g, String(labelText));
}

/**
 * 获取组件引用名称
 * @param item 表单项
 */
export function getComponentRefName(item: ProFormItemProps) {
  const prop = item.prop;
  if (prop == null || prop === '' || String(prop).trim() === '') {
    return `${String(item.key)}Ref`;
  }
  return `${String(prop)}Ref`;
}

/**
 * 渲染表单项组件
 * @param props 属性
 */
export function renderProFormItem(
  props: RenderProFormItemProps
): string | VNode | Array<string | VNode> | undefined {
  const slots = props.slots || {};
  const formData = props.model || {};
  const typeData = getItemTypeData(props.item, props.itemTypeData);
  const typeSlot = props.item?.type ? slots[props.item.type] : void 0;
  if (!typeSlot && !typeData) {
    return;
  }

  /** 组件绑定值 */
  const modelValue =
    props.item.prop == null ? void 0 : getValue(formData, props.item.prop);

  /** 更新组件绑定值方法 */
  const handleUpdateModelValue = (value: unknown) => {
    const propName = props.item.prop;
    if (propName != null && props.updateItemValue) {
      props.updateItemValue(propName, value);
    }
  };

  /** 自定义渲染的方法参数 */
  const propsFunctionParams: ProFormItemPropsFunctionParams = {
    item: props.item,
    modelValue,
    updateModelValue: handleUpdateModelValue,
    isShowFormItem: (cItem) =>
      isShowItem(
        cItem,
        formData,
        props.formItems || [],
        props.searchExpand,
        props.editable
      ),
    renderChildren: (cItem, cSortDisabled, cContainerSelectable) =>
      renderProFormContent({
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

  /** 自定义插槽的增加参数 */
  const slotProFormParams: RenderSlotProFormParam = {
    item: props.item, // 替代 items , 兼容旧版
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

  /** 渲染组件时传递插槽 */
  const itemSlots: ProFormItemRenderSlots = {};
  if (!typeSlot) {
    const itemSlotMap = props.item.slots || {};
    Object.keys(itemSlotMap).forEach((name) => {
      if (itemSlotMap[name]) {
        const slotFuntion = slots[itemSlotMap[name]];
        if (slotFuntion) {
          itemSlots[name] = (slotProps) =>
            slotFuntion({ proForm: slotProFormParams, ...(slotProps || {}) });
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

    /** 渲染组件子级 */
    if (!itemSlots.default) {
      const csd = !(props.item.containerDraggable ?? !typeData?.sortDisabled);
      const isRenderLabel =
        typeData?.renderLabelText &&
        props.item.label != null &&
        props.item.label !== '';
      const isRenderChildren =
        (!typeData || typeData.isContainer) &&
        ((!csd && props.editable) ||
          (props.item.children && props.item.children.length));
      if (isRenderLabel || isRenderChildren) {
        itemSlots.default = () => {
          const nodes: Array<string | VNode> = [];
          if (isRenderLabel && props.item.label != null) {
            nodes.push(props.item.label);
          }
          if (isRenderChildren) {
            // 容器组件渲染子级
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

  /** 渲染对应组件 */
  const componentTag = typeData?.component || 'div';
  const isDivTag = componentTag === 'div' || componentTag === 'td';
  const componentPropsData = translateJsCode(
    props.item.props || {},
    formData,
    props.formItems || [],
    props.searchExpand,
    props.httpRequest,
    props.getProFormRefs,
    props.getAndCacheCode
  ).result;
  const componentNode = typeSlot
    ? typeSlot({
        item: {
          ...props.item,
          props: componentPropsData
        },
        model: formData,
        modelValue: modelValue,
        updateValue: handleUpdateModelValue,
        updatePropValue: props.updateItemValue,
        itemComponentRef: getComponentRefName(props.item),
        proForm: slotProFormParams
      })
    : h(
        (isDivTag ? props.item.props?.is : void 0) || componentTag,
        mergeProps(
          { key: props.key },
          getComponentLegacyProps(props.item),
          typeData?.defaultProps?.(propsFunctionParams) || {},
          isDivTag
            ? omit(componentPropsData, ['is'])
            : typeData?.type === 'col'
              ? getScreenSizeColProps(props.screenSize, {}, componentPropsData)
              : componentPropsData,
          typeData?.reservedProps?.(propsFunctionParams) || {},
          { ref: getComponentRefName(props.item) }
        ),
        itemSlots
      );

  /** 渲染展示类型或容器类型组件 */
  if (
    typeData?.isContainer ||
    props.item.itemType === 'container' ||
    props.item.itemType === 'view'
  ) {
    return componentNode;
  }

  /** 渲染表单类型组件 */
  const itemPropsData = translateJsCode(
    props.item.itemProps || {},
    formData,
    props.formItems || [],
    props.searchExpand,
    props.httpRequest,
    props.getProFormRefs,
    props.getAndCacheCode
  ).result;
  const labelWidth = itemPropsData.labelWidth;
  const formItemLabelWidth =
    typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth;
  // 传递插槽
  const formItemSlots = getMappedSlots(slots, props.item.itemSlots);
  formItemSlots.default = () => componentNode;
  // 表单验证规则
  const iRule = itemPropsData.rules;
  const iRules = iRule ? (Array.isArray(iRule) ? iRule : [iRule]) : void 0;
  const fRule =
    props.rules && props.item.prop
      ? getValue(props.rules, props.item.prop)
      : void 0;
  const fRules = fRule ? (Array.isArray(fRule) ? fRule : [fRule]) : void 0;
  const formItemRules: FormItemRule[] = iRules || fRules || [];
  const trigger = typeData?.requiredTrigger ?? 'change';
  const message = getRuleMessage(
    props.item.label,
    props.item.requiredMessage,
    componentPropsData.placeholder,
    props.requiredLang
  );
  if (props.item.required) {
    formItemRules.unshift({ required: true, message, trigger });
  }
  return (
    <ElFormItem
      key={props.key}
      label={props.item.label}
      {...itemPropsData}
      labelWidth={formItemLabelWidth}
      prop={props.item.prop}
      rules={formItemRules}
    >
      {formItemSlots}
    </ElFormItem>
  );
}

/**
 * 渲染表单项
 * @param props 属性
 */
export function renderProFormContent(
  props: RenderProFormContentProps
): string | VNode | Array<VNode | string> | undefined {
  const nodes: Array<VNode | string> = [];
  const slots = props.slots || {};
  const itemsData = props.items || [];
  const formData = props.model || {};
  const ownSlots = ['default', 'contentExtra'];

  /** 获取表单项组件 */
  const getProFormItemNode = (
    item: ProFormItemProps,
    isEditable?: boolean,
    isSortDisabled?: boolean
  ): string | VNode | Array<VNode | string> | undefined => {
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
    return (
      <BuilderWrapper
        key={itemKey}
        item={item}
        handle={!isSortDisabled}
        activeItemKey={props.activeItemKey}
        onUpdate:activeItemKey={props.updateActiveItemKey}
      >
        {{
          default: defaultSlot,
          builderItemHandleContent: slots.builderItemHandleContent,
          builderItemTools: slots.builderItemTools
        }}
      </BuilderWrapper>
    );
  };

  /** 更新表单项数据排序方法 */
  const handleUpdateItemsModelValue = (data: ProFormItemProps[]) => {
    if (props.updateItemsData) {
      props.updateItemsData(data, props.parentItem);
    }
  };

  /** 包裹栅格布局 */
  if (props.grid) {
    const gridColProps = props.grid === true ? { span: 12 } : props.grid;

    /** 获取栅格列组件 */
    const getItemColNode = (
      item: ProFormItemProps,
      isEditable?: boolean,
      isSortDisabled?: boolean,
      className?: string
    ) => {
      const itemKey = item.key ?? item.prop;
      const itemColProps = translateJsCode(
        item.colProps || {},
        formData,
        props.formItems || [],
        props.searchExpand,
        props.httpRequest,
        props.getProFormRefs,
        props.getAndCacheCode
      ).result;
      return (
        <ElCol
          key={itemKey}
          class={className}
          {...getScreenSizeColProps(
            props.screenSize,
            gridColProps,
            itemColProps
          )}
        >
          {getProFormItemNode(item, isEditable, isSortDisabled)}
        </ElCol>
      );
    };

    /** 获取额外的栅格列节点 */
    const getContentExtraNode = (contentExtraSlot: Slot) => {
      const itemsLength = (props.formItems || []).filter((item) =>
        isShowItem(
          item,
          formData,
          props.formItems || [],
          props.searchExpand,
          props.editable
        )
      ).length;
      return (
        <ElCol
          {...getScreenSizeColProps(
            props.screenSize,
            props.autoContentExtraCol
              ? computeContentExtraCol(gridColProps, itemsLength)
              : { span: 24 },
            translateJsCode(
              props.contentExtraColProps || {},
              formData,
              props.formItems || [],
              props.searchExpand,
              props.httpRequest,
              props.getProFormRefs,
              props.getAndCacheCode
            ).result
          )}
        >
          {contentExtraSlot()}
        </ElCol>
      );
    };

    // 编辑模式
    if (props.editable && !props.sortDisabled) {
      return (
        <DraggableRow
          itemsData={itemsData}
          componentData={
            translateJsCode(
              props.rowProps || {},
              formData,
              props.formItems || [],
              props.searchExpand,
              props.httpRequest,
              props.getProFormRefs,
              props.getAndCacheCode
            ).result
          }
          screenSize={props.screenSize}
          gridColProps={gridColProps}
          formData={formData}
          formItems={props.formItems}
          searchExpand={props.searchExpand}
          httpRequest={props.httpRequest}
          getProFormRefs={props.getProFormRefs}
          getAndCacheCode={props.getAndCacheCode}
          autoContentExtraCol={props.autoContentExtraCol}
          contentExtraColProps={props.contentExtraColProps}
          editable={props.editable}
          onUpdateItems={handleUpdateItemsModelValue}
        >
          {{
            item: ({ element }) => getProFormItemNode(element, true, false),
            footer: slots.contentExtra ? slots.contentExtra() : void 0
          }}
        </DraggableRow>
      );
    }

    // 正常模式
    itemsData.forEach((item) => {
      const isShow = isShowItem(
        item,
        formData,
        props.formItems || [],
        props.searchExpand,
        props.editable
      );
      if (isShow) {
        nodes.push(getItemColNode(item));
      }
    });
    // 额外内容
    if (slots.contentExtra) {
      nodes.push(getContentExtraNode(slots.contentExtra as any));
    }
    return (
      <ElRow
        {...translateJsCode(
          props.rowProps || {},
          formData,
          props.formItems || [],
          props.searchExpand,
          props.httpRequest,
          props.getProFormRefs,
          props.getAndCacheCode
        ).result}
      >
        {nodes}
      </ElRow>
    );
  }

  /** 不包裹栅格布局 */
  if (props.editable && !props.sortDisabled) {
    // 编辑模式
    const footerSlot = () => (
      <BuilderToolWrapper
        item={props.parentItem}
        activeItemKey={props.activeItemKey}
        handle={false}
      >
        {{
          builderItemHandleContent: slots.builderItemHandleContent,
          builderItemTools: slots.builderItemTools
        }}
      </BuilderToolWrapper>
    );

    // 可选择的构建容器点击进行选中方法
    const handleContainerBuilderWrapperClick = (e: MouseEvent) => {
      const parentItemKey = props.parentItem?.key;
      if (props.containerSelectable && parentItemKey != null) {
        e.stopPropagation();
        if (props.updateActiveItemKey) {
          props.updateActiveItemKey(parentItemKey);
        }
      }
    };
    nodes.push(
      <VueDraggable
        itemKey="key"
        animation={150}
        modelValue={itemsData}
        setData={() => void 0}
        group={sortableGroupName}
        handle=".ele-pro-form-builder-item-handle"
        draggable=".ele-pro-form-builder-item-wrapper"
        class={[
          'ele-pro-form-builder-container-wrapper',
          { 'is-selectable': props.containerSelectable },
          {
            'is-active':
              props.containerSelectable &&
              props.parentItem &&
              props.parentItem.key != null &&
              props.activeItemKey != null &&
              props.activeItemKey === props.parentItem.key
          }
        ]}
        onUpdate:modelValue={handleUpdateItemsModelValue}
        onClick={handleContainerBuilderWrapperClick}
      >
        {{
          item: ({ element }) => getProFormItemNode(element, true),
          footer:
            props.containerSelectable && props.parentItem ? footerSlot : void 0
        }}
      </VueDraggable>
    );
  } else {
    // 正常模式
    itemsData.forEach((item) => {
      if (
        isShowItem(
          item,
          formData,
          props.formItems || [],
          props.searchExpand,
          props.editable
        )
      ) {
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
  // 额外内容
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

/**
 * 表单项数据渲染组件
 */
export const ChildrenRender = defineComponent({
  name: 'ChildrenRender',
  props: childrenRenderProps,
  emits: {
    updateItemValue: (_prop: string, _value: any) => true,
    updateItemsData: (
      _items: ProFormItemProps[],
      _parentItem?: ProFormItemProps
    ) => true,
    'update:activeItemKey': (_activeKey?: ProFormItemKey) => true
  },
  setup(props, { emit, slots }) {
    /** 国际化语言 */
    const { lang } = useLocale('proForm', props);

    /** 更新表单数据属性值 */
    const handleUpdateItemValue = (prop: string, value: unknown) => {
      emit('updateItemValue', prop, value);
    };

    /** 更新表单项数据 */
    const handleUpdateItemsData = (
      items: ProFormItemProps[],
      parentItem?: ProFormItemProps
    ) => {
      emit('updateItemsData', items, parentItem);
    };

    /** 更新编辑模式选中的表单项 */
    const handleUpdateActiveItemKey = (activeKey?: ProFormItemKey) => {
      emit('update:activeItemKey', activeKey);
    };

    return () =>
      renderProFormContent({
        ...omit(props, ['item']),
        items: props.items ?? props.item?.children, // 兼容旧版
        updateItemValue: props.updateItemValue ?? handleUpdateItemValue,
        updateItemsData: props.updateItemsData ?? handleUpdateItemsData,
        updateActiveItemKey:
          props.updateActiveItemKey ?? handleUpdateActiveItemKey,
        slots: (props.slots ?? slots) as any,
        requiredLang: props.requiredLang ?? lang.value.required
      });
  }
});

export type ChildrenRenderInstance = InstanceType<typeof ChildrenRender> | null;
