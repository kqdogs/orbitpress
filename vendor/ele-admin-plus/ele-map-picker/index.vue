<!-- 地图位置选择 -->
<template>
  <EleModal
    width="740px"
    :title="lang.title"
    v-bind="modalProps || {}"
    :modelValue="modelValue"
    class="ele-map-picker"
    :class="{ 'is-responsive': isResponsive }"
    @update:modelValue="updateModelValue"
    @opened="handleOpened"
    @closed="handleClosed"
    @resized="handleResized"
    @update:fullscreen="handleFullscreenChange"
  >
    <MapView
      v-if="isOpened"
      v-bind="pick($props, mapPropKeys)"
      ref="mapRef"
      :message="lang.message"
      :clickMessage="lang.clickMessage"
      :searchPlaceholder="lang.placeholder"
      :okText="lang.ok"
      :mapKey="aMapKey"
      :mode="keywordMode ? 'keyword' : mode"
      :mapPlugin="mapPluginImpl"
      @mapDone="handleMapDone"
      @done="handleDone"
    />
    <template
      v-for="name in Object.keys($slots).filter((k) => 'default' !== k)"
      #[name]="slotProps"
    >
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </EleModal>
</template>

<script lang="ts" setup>
  import { ref, computed, nextTick } from 'vue';
  import { pick, debounce } from '../utils/common';
  import type { EleMapPickerViewInstance } from '../ele-app/plusx';
  import { useLocale } from '../ele-config-provider/receiver';
  import { useResponsive } from '../ele-pro-layout/util';
  import EleModal from '../ele-modal/index.vue';
  import MapView from './components/map-view.vue';
  import { AMapPlugin } from './amap-plugin';
  import type { PoiItem, MapPluginConstructor } from './types';
  import { mapPickerProps, mapPickerEmits, mapPropKeys } from './props';

  defineOptions({ name: 'EleMapPicker' });

  const props = defineProps(mapPickerProps);

  const emit = defineEmits(mapPickerEmits);

  const { lang, globalConfig } = useLocale('map', props);

  /** 是否开启布局响应 */
  const isResponsive = useResponsive(props);

  /** 弹窗是否完全打开状态 */
  const isOpened = ref(false);

  /** 地图组件 */
  const mapRef = ref<EleMapPickerViewInstance>(null);

  /** 地图插件 */
  const mapPluginImpl = computed<MapPluginConstructor>(() => {
    return props.mapPlugin || globalConfig.mapPlugin || AMapPlugin;
  });

  /** 地图密钥 */
  const aMapKey = computed<string | undefined>(() => {
    return props.mapKey || globalConfig.mapKey;
  });

  /** 更新modelValue */
  const updateModelValue = (visible: boolean) => {
    emit('update:modelValue', visible);
  };

  /** 地图渲染完成事件 */
  const handleMapDone = (ins: any) => {
    emit('mapDone', ins);
  };

  /** 位置选择完成事件 */
  const handleDone = (result: PoiItem) => {
    emit('done', result);
  };

  /** 弹窗打开动画结束事件 */
  const handleOpened = () => {
    isOpened.value = true;
    if (mapRef.value) {
      mapRef.value.checkResize();
      mapRef.value.showInitSelected();
    }
  };

  /** 弹窗关闭动画结束事件 */
  const handleClosed = () => {
    if (props.modalProps?.destroyOnClose) {
      isOpened.value = false;
    }
  };

  /** 弹窗尺寸改变事件 */
  const handleResized = debounce(() => {
    nextTick(() => {
      mapRef.value && mapRef.value.checkResize();
    });
  }, 350);

  /** 弹窗全屏状态改变事件 */
  const handleFullscreenChange = () => {
    nextTick(() => {
      mapRef.value && mapRef.value.checkResize();
    });
  };

  defineExpose({
    mapRef
  });
</script>
