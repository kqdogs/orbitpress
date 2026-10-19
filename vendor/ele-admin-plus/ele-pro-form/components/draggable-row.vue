<template>
  <VueDraggable
    itemKey="key"
    :animation="150"
    :modelValue="itemsData"
    :setData="() => void 0"
    :group="sortableGroupName"
    handle=".ele-pro-form-builder-item-handle"
    draggable=".ele-pro-form-builder-grid-item-wrapper"
    :tag="componentData?.tag ?? 'div'"
    :class="rowClass"
    :style="rowStyle"
    @update:modelValue="handleUpdateItemsModelValue"
  >
    <template #item="{ element }">
      <ElCol
        :key="element.key ?? element.prop"
        class="ele-pro-form-builder-grid-item-wrapper"
        v-bind="
          getScreenSizeColProps(
            screenSize,
            gridColProps,
            translateJsCode(
              element.colProps || {},
              formData,
              formItems || [],
              searchExpand,
              httpRequest,
              getProFormRefs,
              getAndCacheCode
            ).result
          )
        "
      >
        <slot name="item" :element="element"></slot>
      </ElCol>
    </template>
    <template v-if="$slots.footer" #footer>
      <ElCol
        v-bind="
          getScreenSizeColProps(
            screenSize,
            autoContentExtraCol
              ? computeContentExtraCol(
                  gridColProps,
                  (formItems || []).filter((item) =>
                    isShowItem(
                      item,
                      formData,
                      formItems || [],
                      searchExpand,
                      editable
                    )
                  ).length
                )
              : { span: 24 },
            translateJsCode(
              contentExtraColProps || {},
              formData,
              formItems || [],
              searchExpand,
              httpRequest,
              getProFormRefs,
              getAndCacheCode
            ).result
          )
        "
      >
        <slot name="footer"></slot>
      </ElCol>
    </template>
  </VueDraggable>
</template>

<script lang="ts" setup>
  import { computed, provide } from 'vue';
  import { ElCol, rowContextKey, useNamespace } from 'element-plus';
  import VueDraggable from 'vuedraggable';
  import type { ElRowProps, ElColProps } from '../../ele-app/el';
  import type { StyleValue } from '../../ele-app/types';
  import type { ProFormItemProps, ScreenSize } from '../types';
  import {
    sortableGroupName,
    getScreenSizeColProps,
    computeContentExtraCol,
    translateJsCode,
    isShowItem
  } from './render-core';

  defineOptions({ name: 'DraggableRow' });

  const props = defineProps<{
    /** 表单项数据 */
    itemsData?: ProFormItemProps[];
    /** 组件属性 */
    componentData?: ElRowProps;
    /** 屏幕尺寸 */
    screenSize?: ScreenSize;
    /** 栅格布局属性 */
    gridColProps?: ElColProps;
    /** 表单数据 */
    formData?: Record<string, any>;
    /** 全部的表单项 */
    formItems?: ProFormItemProps[];
    /** 搜索表单展开状态 */
    searchExpand?: boolean;
    /** 远程数据源请求工具 */
    httpRequest?: any;
    /** 获取表单组件的组件引用数据方法 */
    getProFormRefs?: () => Record<string, any>;
    /** 获取并缓存代码解析结果方法 */
    getAndCacheCode?: (code: string, codeResult: any) => any;
    /** 自动计算额外的 ElCol 份数 */
    autoContentExtraCol?: boolean;
    /** 额外的 ElCol 属性 */
    contentExtraColProps?: ElColProps;
    /** 编辑模式 */
    editable?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'updateItems', data?: ProFormItemProps[]): void;
  }>();

  /** 表单项数据排序更新事件 */
  const handleUpdateItemsModelValue = (data: ProFormItemProps[]) => {
    emit('updateItems', data);
  };

  /** 保持 ElRow 的原始功能 */
  const ns = useNamespace('row');

  const gutter = computed<number>(() => props.componentData?.gutter ?? 0);

  const rowStyle = computed<StyleValue>(() => {
    const styles: StyleValue = {};
    if (!props.componentData?.gutter) {
      return styles;
    }
    styles.marginRight =
      styles.marginLeft = `-${props.componentData.gutter / 2}px`;
    return styles;
  });

  const rowClass = computed<string[]>(() => [
    'ele-pro-form-builder-grid-container-wrapper',
    ns.b(),
    ns.is(
      `justify-${props.componentData?.justify ?? 'start'}`,
      (props.componentData?.justify ?? 'start') !== 'start'
    ),
    ns.is(`align-${props.componentData?.align}`, !!props.componentData?.align)
  ]);

  provide(rowContextKey, { gutter });
</script>
