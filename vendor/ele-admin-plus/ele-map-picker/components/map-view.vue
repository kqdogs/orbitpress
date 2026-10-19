<template>
  <EleLoading
    :loading="loading"
    class="ele-map-view"
    :class="{ 'is-poi-mode': poiMode }"
    :style="{ height }"
  >
    <div class="ele-map-view-body">
      <div ref="mapRef" :style="{ height: '100%', width: '100%' }"></div>
      <template v-if="poiMode">
        <ElIcon class="ele-map-view-icon-plus">
          <PlusOutlined />
        </ElIcon>
        <img
          ref="mapPoiCenterIconRef"
          :src="markerSrc ?? defaultMarkerSrc"
          class="ele-map-view-body-icon"
        />
      </template>
      <div
        v-if="filterable && !keywordMode"
        class="ele-map-view-search"
        :style="searchStyle"
      >
        <ElAutocomplete
          ref="autocompleteRef"
          valueKey="name"
          :clearable="true"
          v-model="keywords"
          :placeholder="searchPlaceholder"
          popperClass="ele-map-suggest-popper"
          :fetchSuggestions="handleSearch"
          @select="handleSearchSelect"
        >
          <template #prefix>
            <ElIcon class="el-input__icon">
              <SearchOutlined />
            </ElIcon>
          </template>
          <template #default="{ item }">
            <div class="ele-map-suggest-item">
              <div class="ele-map-suggest-title" :title="item.name">
                {{ item.name }}
              </div>
              <div class="ele-map-suggest-text" :title="item.district">
                {{ item.district }}
              </div>
            </div>
          </template>
        </ElAutocomplete>
      </div>
      <template v-if="!poiMode && !keywordMode">
        <div
          v-if="confirmDisabled && clickMessage"
          class="ele-map-view-message"
        >
          {{ clickMessage }}
        </div>
        <ElButton
          v-else
          type="primary"
          :loading="confirmLoading"
          :disabled="confirmDisabled"
          class="ele-map-view-btn-ok"
          @click="handleConfirm"
        >
          {{ okText }}
        </ElButton>
      </template>
    </div>
    <EleLoading
      v-if="keywordMode || poiMode"
      :loading="poiLoading"
      :style="sideStyle"
      class="ele-map-view-side"
    >
      <div v-if="keywordMode" class="ele-map-view-search" :style="searchStyle">
        <ElInput
          :clearable="true"
          v-model="keywords"
          :prefixIcon="SearchOutlined"
          :placeholder="searchPlaceholder"
          :validateEvent="false"
          @change="handleSearch"
        />
      </div>
      <div ref="listRef" class="ele-map-view-list">
        <div
          v-for="item in data"
          :key="item.key"
          class="ele-map-view-item"
          :class="{ 'is-active': item === current }"
          @click="handleItemClick(item)"
        >
          <ElIcon class="ele-map-view-item-icon">
            <EnvironmentOutlined />
          </ElIcon>
          <div class="ele-map-view-item-body">
            <template v-if="!item.name && !item.address">
              <div class="ele-map-view-item-title">
                <span>{{ item.lng }}</span>
                <span>,</span>
                <span>{{ item.lat }}</span>
              </div>
              <div
                v-if="
                  item.city &&
                  (item.city.province || item.city.city || item.city.district)
                "
                class="ele-map-view-item-text"
              >
                <span v-if="item.city.province">{{ item.city.province }}</span>
                <span v-if="item.city.city">{{ item.city.city }}</span>
                <span v-if="item.city.district">{{ item.city.district }}</span>
              </div>
            </template>
            <template v-else>
              <div class="ele-map-view-item-title">{{ item.name }}</div>
              <div v-if="item.address" class="ele-map-view-item-text">
                {{ item.address }}
              </div>
            </template>
          </div>
          <ElIcon class="ele-map-view-item-radio">
            <CheckCircleOutlined />
          </ElIcon>
        </div>
        <div v-if="!data || !data.length" class="ele-map-view-empty">
          <ElEmpty :imageSize="80" v-bind="emptyProps || {}" />
        </div>
      </div>
      <div class="ele-map-view-extra">
        <div v-if="confirmDisabled && message" class="ele-map-view-message">
          {{ message }}
        </div>
        <ElButton
          v-else
          type="primary"
          :loading="confirmLoading"
          :disabled="confirmDisabled"
          class="ele-map-view-btn-ok"
          @click="handleConfirm"
        >
          {{ okText }}
        </ElButton>
      </div>
    </EleLoading>
  </EleLoading>
</template>

<script lang="ts" setup>
  import {
    ref,
    computed,
    onMounted,
    onBeforeUnmount,
    nextTick,
    inject,
    watch
  } from 'vue';
  import {
    ElAutocomplete,
    ElInput,
    ElButton,
    ElIcon,
    ElEmpty
  } from 'element-plus';
  import {
    PlusOutlined,
    EnvironmentOutlined,
    CheckCircleOutlined,
    SearchOutlined
  } from '../../icons/index';
  import type { ElAutocompleteInstance } from '../../ele-app/el';
  import { modalItemContextKey } from '../../utils/hook';
  import EleLoading from '../../ele-loading/index.vue';
  import type { PoiItem, MapState } from '../types';
  import { isNullCity, defaultMarkerSrc } from '../util';
  import { mapProps } from '../props';

  defineOptions({ name: 'MapView' });

  const props = defineProps(mapProps);

  const emit = defineEmits({
    mapDone: (_ins: any) => true,
    select: (_selected: PoiItem | null) => true,
    done: (_result: PoiItem) => true
  });

  /** 地图节点 */
  const mapRef = ref<HTMLDivElement | null>(null);

  /** 搜索建议实例 */
  const autocompleteRef = ref<ElAutocompleteInstance>(null);

  /** 列表节点 */
  const listRef = ref<HTMLDivElement | null>(null);

  /** POI模式地图中心图标节点 */
  const mapPoiCenterIconRef = ref<HTMLElement | null>(null);

  /** 地图渲染状态 */
  const loading = ref<boolean>(true);

  /** 列表请求状态 */
  const poiLoading = ref<boolean>(false);

  /** 确定按钮请求状态 */
  const confirmLoading = ref<boolean>(false);

  /** POI数据 */
  const data = ref<PoiItem[]>([]);

  /** 输入建议数据 */
  const suggestionData = ref<PoiItem[]>([]);

  /** 输入建议关键字 */
  const keywords = ref<string>('');

  /** 选中数据 */
  const current = ref<PoiItem | null | undefined>(null);

  /** 确定按钮是否禁用 */
  const confirmDisabled = computed(() => props.required && !current.value);

  /** 是否是关键字搜索模式 */
  const keywordMode = computed<boolean>(() => 'keyword' === props.mode);

  /** 是否是POI搜索模式 */
  const poiMode = computed<boolean>(() => 'poi' === props.mode);

  /** 状态数据 */
  const state: MapState = { context: inject(modalItemContextKey, null) };

  /** 获取初始回显位置 */
  const getInitSelected = () => {
    if (props.selected != null) {
      const { lng, lat } = props.selected;
      if (lat != null && lng != null) {
        return props.selected;
      }
    }
  };

  /** 判断是否是相同的POI数据 */
  const isSamePOI = (poi: PoiItem, item: PoiItem): boolean => {
    return (
      item.lat === poi.lat &&
      item.lng === poi.lng &&
      item.name === poi.name &&
      item.address === poi.address
    );
  };

  /** 指定POI数据添加到首位 */
  const addFirstPOI = (poi: PoiItem, list: PoiItem[]): PoiItem[] => {
    const index = list.findIndex((d) => isSamePOI(poi, d));
    if (index == -1) {
      return [poi, ...list];
    }
    const result = [...list];
    result[index] = poi;
    return result;
  };

  /** 列表滚动顶部 */
  const scrollToTop = () => {
    const listEl = listRef.value;
    if (listEl) {
      listEl.scrollTop = 0;
    }
  };

  /** 列表滚动到选中位置 */
  const scrollToActive = () => {
    const listEl = listRef.value;
    if (listEl) {
      const el = listEl.querySelector('.ele-map-view-item.is-active');
      if (el) {
        if (typeof el['scrollIntoViewIfNeeded'] === 'function') {
          (el as any).scrollIntoViewIfNeeded(true);
        } else {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  /** 设置选中 */
  const setSelected = (item: PoiItem | null, trigger?: boolean) => {
    if (current.value !== item) {
      current.value = item;
      if (trigger) {
        emit('select', current.value);
      }
    }
  };

  /** 检索附近兴趣点 */
  const searchNearBy = async (
    lng?: number,
    lat?: number
  ): Promise<PoiItem[]> => {
    const mapPluginIns = state.mapPluginIns;
    if (!mapPluginIns || lng == null || lat == null) {
      return [];
    }
    const data = await mapPluginIns.searchNearBy({
      lng,
      lat,
      poiKeywords: props.poiKeywords,
      poiRadius: props.poiRadius,
      poiType: props.poiType
    });
    return data;
  };

  /** 检索POI数据 */
  const searchPOI = (lng?: number, lat?: number) => {
    loading.value = true;
    poiLoading.value = true;
    searchNearBy(lng, lat)
      .then((result) => {
        poiLoading.value = false;
        loading.value = false;
        if (!state.selectedSuggestion) {
          data.value = result;
          setSelected(null, true);
          scrollToTop();
          return;
        }
        // 选中的输入建议不在POI中则添加
        data.value = addFirstPOI(state.selectedSuggestion, result);
        setSelected(state.selectedSuggestion, true);
        state.selectedSuggestion = null;
        nextTick(() => {
          scrollToActive;
        });
      })
      .catch((e) => {
        console.error(e);
        poiLoading.value = false;
        loading.value = false;
        const selectedSuggestion = state.selectedSuggestion;
        data.value = selectedSuggestion ? [selectedSuggestion] : [];
        setSelected(selectedSuggestion ? selectedSuggestion : null, true);
      });
  };

  /** 让地图中心图标跳动 */
  const bounceIcon = () => {
    const iconEl = mapPoiCenterIconRef.value;
    if (iconEl) {
      iconEl.animate(
        [
          { transform: 'translateY(0)' },
          { transform: 'translateY(-20px)' },
          { transform: 'translateY(0)' }
        ],
        { duration: 600 }
      );
    }
  };

  /** 销毁数据 */
  const destroyAll = () => {
    if (state.mapPluginIns) {
      state.mapPluginIns.destroyMap();
      state.mapPluginIns = null;
    }
    state.lastSuggestion = '';
    state.selectedSuggestion = null;
    state.isItemClickMove = false;
    data.value = [];
    suggestionData.value = [];
    keywords.value = '';
    setSelected(null);
  };

  /** 渲染地图 */
  const renderMap = () => {
    destroyAll();
    if (!props.mapPlugin || !mapRef.value) {
      return;
    }
    const initSel = getInitSelected();
    const selCenter = initSel ? [initSel.lng, initSel.lat] : void 0;
    state.mapPluginIns = new props.mapPlugin();
    state.mapPluginIns.renderMap(mapRef.value, {
      mapKey: props.mapKey,
      mapVersion: props.mapVersion,
      zoom: initSel == null ? props.zoom : props.selectedZoom,
      center: (selCenter as unknown as [number, number]) || props.center,
      mapStyle: props.mapStyle,
      darkMode: props.darkMode,
      suggestionCity: props.suggestionCity,
      poiType: props.poiType,
      poiLimit: props.poiLimit,
      markerSrc: props.markerSrc,
      onComplete: () => {
        const mapPluginIns = state.mapPluginIns;
        if (!mapPluginIns) {
          return;
        }
        if (initSel != null) {
          setSelected(initSel);
          if (!poiMode.value) {
            mapPluginIns.showCenterMarker(initSel.lng, initSel.lat);
          }
        }
        if (poiMode.value || keywordMode.value) {
          state.selectedSuggestion = initSel;
          mapPluginIns
            .getMapCenter()
            .then(({ lng, lat }) => {
              searchPOI(lng, lat);
            })
            .catch((e) => {
              console.error(e);
            });
          return;
        }
        loading.value = false;
      },
      onMoveend: () => {
        if (state.isItemClickMove || !poiMode.value || !state.mapPluginIns) {
          state.isItemClickMove = false;
          return;
        }
        bounceIcon();
        state.mapPluginIns
          .getMapCenter()
          .then(({ lng, lat }) => {
            searchPOI(lng, lat);
          })
          .catch((e) => {
            console.error(e);
          });
      },
      onDragend: () => {
        if (!poiMode.value || !state.mapPluginIns) {
          return;
        }
        bounceIcon();
        state.mapPluginIns
          .getMapCenter()
          .then(({ lng, lat }) => {
            searchPOI(lng, lat);
          })
          .catch((e) => {
            console.error(e);
          });
      },
      onClick: (e: any) => {
        if (poiMode.value || keywordMode.value) {
          return;
        }
        if (
          e.lnglat == null ||
          typeof e.lnglat !== 'object' ||
          !state.mapPluginIns
        ) {
          console.error(e);
          return;
        }
        const { lng, lat } = e.lnglat;
        setSelected(
          {
            name: '',
            address: '',
            lat,
            lng,
            key: [lat, lng].join(),
            location: { lat, lng }
          },
          true
        );
        state.mapPluginIns.setMapCenter(lng, lat, props.selectedZoom);
        state.mapPluginIns.showCenterMarker(lng, lat);
      },
      onRendered: (mapIns: any) => {
        emit('mapDone', mapIns);
      },
      onResizeend: () => {
        if (current.value && poiMode.value && state.mapPluginIns) {
          const { lng, lat } = current.value;
          state.mapPluginIns.setMapCenter(lng, lat);
        }
      },
      onZoomend: () => {
        if (current.value && poiMode.value && state.mapPluginIns) {
          const { lng, lat } = current.value;
          state.mapPluginIns.setMapCenter(lng, lat);
        }
      }
    });
  };

  /** 获取地图实例 */
  const getMapIns = () => {
    if (state.mapPluginIns) {
      return state.mapPluginIns.getMapInstance();
    }
  };

  /** 通知地图更改容器大小 */
  const checkResize = () => {
    state.mapPluginIns?.checkResize && state.mapPluginIns.checkResize();
  };

  /** 展示初始回显位置 */
  const showInitSelected = () => {
    const selected = getInitSelected();
    if (selected == null) {
      return;
    }
    setSelected(selected);
    const { lng, lat } = selected;
    state.isItemClickMove = true;
    if (state.mapPluginIns) {
      state.mapPluginIns.setMapCenter(lng, lat, props.selectedZoom);
      if (!poiMode.value) {
        state.mapPluginIns.showCenterMarker(lng, lat);
      }
    }
    if (
      (keywordMode.value || poiMode.value) &&
      !data.value.includes(selected)
    ) {
      data.value = addFirstPOI(selected, data.value);
    }
    nextTick(() => {
      scrollToActive();
    });
  };

  /** 搜索建议获取数据 */
  const handleSearch = (keyword: string, callback?: any) => {
    if (!keyword || state.lastSuggestion === keyword || !state.mapPluginIns) {
      callback && callback(suggestionData.value);
      return;
    }
    state.lastSuggestion = keyword;
    if (keywordMode.value) {
      poiLoading.value = true;
    }
    state.mapPluginIns
      .searchKeyword(keyword)
      .then((result) => {
        // 关键字检索模式
        if (keywordMode.value) {
          data.value = result;
          poiLoading.value = false;
          setSelected(null, true);
          state.mapPluginIns && state.mapPluginIns.removeCenterMarker();
          scrollToTop();
          return;
        }
        suggestionData.value = result;
        callback && callback(suggestionData.value);
      })
      .catch((e: Error) => {
        console.error(e);
        poiLoading.value = false;
        callback && callback(suggestionData.value);
      });
  };

  /** 搜索建议选中事件 */
  const handleSearchSelect = (item: PoiItem) => {
    autocompleteRef.value && autocompleteRef.value.blur();
    if (!item) {
      return;
    }
    const { lng, lat } = item;
    if (lng == null || lat == null) {
      return;
    }
    if (!poiMode.value) {
      if (state.mapPluginIns) {
        state.mapPluginIns.showCenterMarker(lng, lat);
        state.mapPluginIns.setMapCenter(lng, lat, props.selectedZoom);
      }
      setSelected(item, true);
      return;
    }
    loading.value = true;
    state.selectedSuggestion = item;
    state.isItemClickMove = true;
    state.mapPluginIns &&
      state.mapPluginIns.setMapCenter(lng, lat, props.selectedZoom);
    bounceIcon();
    searchPOI(lng, lat);
  };

  /** POI列表条目点击事件 */
  const handleItemClick = (item: PoiItem) => {
    state.isItemClickMove = true;
    setSelected(item, true);
    if (!state.mapPluginIns) {
      return;
    }
    const { lng, lat } = item;
    state.mapPluginIns.setMapCenter(lng, lat, props.selectedZoom);
    // POI检索类型地图中心图标跳动
    if (poiMode.value) {
      bounceIcon();
      return;
    }
    // 非POI检索类型地图中心添加标记
    state.mapPluginIns.showCenterMarker(lng, lat);
  };

  /** 确定按钮点击事件 */
  const handleConfirm = () => {
    if (!state.mapPluginIns || !state.context?.label) {
      return;
    }
    // 未选择使用地图中心点
    if (!current.value) {
      confirmLoading.value = true;
      state.mapPluginIns
        .getMapCenter(props.returnRegions)
        .then((result) => {
          confirmLoading.value = false;
          emit('done', result);
        })
        .catch((e) => {
          console.error(e);
          confirmLoading.value = false;
          emit('done', {});
        });
      return;
    }
    if (!props.returnRegions || !isNullCity(current.value.city)) {
      emit('done', current.value);
      return;
    }
    // 获取行政区
    confirmLoading.value = true;
    state.isItemClickMove = true;
    state.mapPluginIns.setMapCenter(current.value.lng, current.value.lat);
    state.mapPluginIns
      .getMapCenter(true)
      .then(({ city }) => {
        confirmLoading.value = false;
        emit('done', { ...(current.value || {}), city });
      })
      .catch((e) => {
        console.error(e);
        confirmLoading.value = false;
        emit('done', current.value || {});
      });
  };

  /** 同步初始选中 */
  watch(
    () => props.selected,
    () => {
      showInitSelected();
    }
  );

  /** 同步深色切换 */
  watch(
    () => props.darkMode,
    (darkMode) => {
      if (!props.mapStyle) {
        state.mapPluginIns && state.mapPluginIns.setMapStyle(darkMode);
      }
    }
  );

  /** 同步主题 */
  watch(
    () => props.mapStyle,
    (mapStyle) => {
      if (mapStyle) {
        state.mapPluginIns && state.mapPluginIns.setMapStyle(mapStyle);
      }
    }
  );

  /** 切换选择模式 */
  watch(
    () => props.mode,
    (mode) => {
      keywords.value = '';
      suggestionData.value = [];
      state.selectedSuggestion = null;
      state.lastSuggestion = '';
      state.mapPluginIns && state.mapPluginIns.removeCenterMarker();
      if (mode !== 'poi' && current.value && state.mapPluginIns) {
        const { lng, lat } = current.value;
        state.mapPluginIns.showCenterMarker(lng, lat);
      }
      if (!data.value.length && (mode === 'poi' || mode === 'keyword')) {
        if (current.value) {
          const { lng, lat } = current.value;
          searchPOI(lng, lat);
        } else if (state.mapPluginIns) {
          state.mapPluginIns
            .getMapCenter()
            .then((centerPoint) => {
              const { lng, lat } = centerPoint || {};
              searchPOI(lng, lat);
            })
            .catch((e) => {
              console.error(e);
            });
        }
      }
    }
  );

  /** 更新地图插件 */
  watch([() => props.mapKey, () => props.mapPlugin], () => {
    destroyAll();
    renderMap();
  });

  /** 渲染地图 */
  onMounted(() => {
    renderMap();
  });

  /** 销毁地图 */
  onBeforeUnmount(() => {
    destroyAll();
  });

  defineExpose({
    autocompleteRef,
    getMapIns,
    showInitSelected,
    checkResize
  });
</script>
