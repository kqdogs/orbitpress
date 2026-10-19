import { defineComponent, ref, computed, inject, watch, onMounted, onBeforeUnmount, openBlock, createBlock, normalizeStyle, normalizeClass, withCtx, createElementVNode, createElementBlock, Fragment, createVNode, unref, createCommentVNode, toDisplayString, createTextVNode, renderList, mergeProps, nextTick } from "vue";
import { ElIcon, ElAutocomplete, ElButton, ElInput, ElEmpty } from "element-plus";
import { PlusOutlined, SearchOutlined, EnvironmentOutlined, CheckCircleOutlined } from "../../icons/index";
import { modalItemContextKey } from "../../utils/hook";
import EleLoading from "../../ele-loading/index";
import { defaultMarkerSrc, isNullCity } from "../util";
import { mapProps } from "../props";
const _hoisted_1 = { class: "ele-map-view-body" };
const _hoisted_2 = ["src"];
const _hoisted_3 = { class: "ele-map-suggest-item" };
const _hoisted_4 = ["title"];
const _hoisted_5 = ["title"];
const _hoisted_6 = {
  key: 0,
  class: "ele-map-view-message"
};
const _hoisted_7 = ["onClick"];
const _hoisted_8 = { class: "ele-map-view-item-body" };
const _hoisted_9 = { class: "ele-map-view-item-title" };
const _hoisted_10 = {
  key: 0,
  class: "ele-map-view-item-text"
};
const _hoisted_11 = { key: 0 };
const _hoisted_12 = { key: 1 };
const _hoisted_13 = { key: 2 };
const _hoisted_14 = { class: "ele-map-view-item-title" };
const _hoisted_15 = {
  key: 0,
  class: "ele-map-view-item-text"
};
const _hoisted_16 = {
  key: 0,
  class: "ele-map-view-empty"
};
const _hoisted_17 = { class: "ele-map-view-extra" };
const _hoisted_18 = {
  key: 0,
  class: "ele-map-view-message"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "MapView" },
  __name: "map-view",
  props: mapProps,
  emits: {
    mapDone: (_ins) => true,
    select: (_selected) => true,
    done: (_result) => true
  },
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const mapRef = ref(null);
    const autocompleteRef = ref(null);
    const listRef = ref(null);
    const mapPoiCenterIconRef = ref(null);
    const loading = ref(true);
    const poiLoading = ref(false);
    const confirmLoading = ref(false);
    const data = ref([]);
    const suggestionData = ref([]);
    const keywords = ref("");
    const current = ref(null);
    const confirmDisabled = computed(() => props.required && !current.value);
    const keywordMode = computed(() => "keyword" === props.mode);
    const poiMode = computed(() => "poi" === props.mode);
    const state = { context: inject(modalItemContextKey, null) };
    const getInitSelected = () => {
      if (props.selected != null) {
        const { lng, lat } = props.selected;
        if (lat != null && lng != null) {
          return props.selected;
        }
      }
    };
    const isSamePOI = (poi, item) => {
      return item.lat === poi.lat && item.lng === poi.lng && item.name === poi.name && item.address === poi.address;
    };
    const addFirstPOI = (poi, list) => {
      const index = list.findIndex((d) => isSamePOI(poi, d));
      if (index == -1) {
        return [poi, ...list];
      }
      const result = [...list];
      result[index] = poi;
      return result;
    };
    const scrollToTop = () => {
      const listEl = listRef.value;
      if (listEl) {
        listEl.scrollTop = 0;
      }
    };
    const scrollToActive = () => {
      const listEl = listRef.value;
      if (listEl) {
        const el = listEl.querySelector(".ele-map-view-item.is-active");
        if (el) {
          if (typeof el["scrollIntoViewIfNeeded"] === "function") {
            el.scrollIntoViewIfNeeded(true);
          } else {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }
    };
    const setSelected = (item, trigger) => {
      if (current.value !== item) {
        current.value = item;
        if (trigger) {
          emit("select", current.value);
        }
      }
    };
    const searchNearBy = async (lng, lat) => {
      const mapPluginIns = state.mapPluginIns;
      if (!mapPluginIns || lng == null || lat == null) {
        return [];
      }
      const data2 = await mapPluginIns.searchNearBy({
        lng,
        lat,
        poiKeywords: props.poiKeywords,
        poiRadius: props.poiRadius,
        poiType: props.poiType
      });
      return data2;
    };
    const searchPOI = (lng, lat) => {
      loading.value = true;
      poiLoading.value = true;
      searchNearBy(lng, lat).then((result) => {
        poiLoading.value = false;
        loading.value = false;
        if (!state.selectedSuggestion) {
          data.value = result;
          setSelected(null, true);
          scrollToTop();
          return;
        }
        data.value = addFirstPOI(state.selectedSuggestion, result);
        setSelected(state.selectedSuggestion, true);
        state.selectedSuggestion = null;
        nextTick(() => {
        });
      }).catch((e) => {
        console.error(e);
        poiLoading.value = false;
        loading.value = false;
        const selectedSuggestion = state.selectedSuggestion;
        data.value = selectedSuggestion ? [selectedSuggestion] : [];
        setSelected(selectedSuggestion ? selectedSuggestion : null, true);
      });
    };
    const bounceIcon = () => {
      const iconEl = mapPoiCenterIconRef.value;
      if (iconEl) {
        iconEl.animate(
          [
            { transform: "translateY(0)" },
            { transform: "translateY(-20px)" },
            { transform: "translateY(0)" }
          ],
          { duration: 600 }
        );
      }
    };
    const destroyAll = () => {
      if (state.mapPluginIns) {
        state.mapPluginIns.destroyMap();
        state.mapPluginIns = null;
      }
      state.lastSuggestion = "";
      state.selectedSuggestion = null;
      state.isItemClickMove = false;
      data.value = [];
      suggestionData.value = [];
      keywords.value = "";
      setSelected(null);
    };
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
        center: selCenter || props.center,
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
            mapPluginIns.getMapCenter().then(({ lng, lat }) => {
              searchPOI(lng, lat);
            }).catch((e) => {
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
          state.mapPluginIns.getMapCenter().then(({ lng, lat }) => {
            searchPOI(lng, lat);
          }).catch((e) => {
            console.error(e);
          });
        },
        onDragend: () => {
          if (!poiMode.value || !state.mapPluginIns) {
            return;
          }
          bounceIcon();
          state.mapPluginIns.getMapCenter().then(({ lng, lat }) => {
            searchPOI(lng, lat);
          }).catch((e) => {
            console.error(e);
          });
        },
        onClick: (e) => {
          if (poiMode.value || keywordMode.value) {
            return;
          }
          if (e.lnglat == null || typeof e.lnglat !== "object" || !state.mapPluginIns) {
            console.error(e);
            return;
          }
          const { lng, lat } = e.lnglat;
          setSelected(
            {
              name: "",
              address: "",
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
        onRendered: (mapIns) => {
          emit("mapDone", mapIns);
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
    const getMapIns = () => {
      if (state.mapPluginIns) {
        return state.mapPluginIns.getMapInstance();
      }
    };
    const checkResize = () => {
      state.mapPluginIns?.checkResize && state.mapPluginIns.checkResize();
    };
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
      if ((keywordMode.value || poiMode.value) && !data.value.includes(selected)) {
        data.value = addFirstPOI(selected, data.value);
      }
      nextTick(() => {
        scrollToActive();
      });
    };
    const handleSearch = (keyword, callback) => {
      if (!keyword || state.lastSuggestion === keyword || !state.mapPluginIns) {
        callback && callback(suggestionData.value);
        return;
      }
      state.lastSuggestion = keyword;
      if (keywordMode.value) {
        poiLoading.value = true;
      }
      state.mapPluginIns.searchKeyword(keyword).then((result) => {
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
      }).catch((e) => {
        console.error(e);
        poiLoading.value = false;
        callback && callback(suggestionData.value);
      });
    };
    const handleSearchSelect = (item) => {
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
      state.mapPluginIns && state.mapPluginIns.setMapCenter(lng, lat, props.selectedZoom);
      bounceIcon();
      searchPOI(lng, lat);
    };
    const handleItemClick = (item) => {
      state.isItemClickMove = true;
      setSelected(item, true);
      if (!state.mapPluginIns) {
        return;
      }
      const { lng, lat } = item;
      state.mapPluginIns.setMapCenter(lng, lat, props.selectedZoom);
      if (poiMode.value) {
        bounceIcon();
        return;
      }
      state.mapPluginIns.showCenterMarker(lng, lat);
    };
    const handleConfirm = () => {
      if (!state.mapPluginIns || !state.context?.label) {
        return;
      }
      if (!current.value) {
        confirmLoading.value = true;
        state.mapPluginIns.getMapCenter(props.returnRegions).then((result) => {
          confirmLoading.value = false;
          emit("done", result);
        }).catch((e) => {
          console.error(e);
          confirmLoading.value = false;
          emit("done", {});
        });
        return;
      }
      if (!props.returnRegions || !isNullCity(current.value.city)) {
        emit("done", current.value);
        return;
      }
      confirmLoading.value = true;
      state.isItemClickMove = true;
      state.mapPluginIns.setMapCenter(current.value.lng, current.value.lat);
      state.mapPluginIns.getMapCenter(true).then(({ city }) => {
        confirmLoading.value = false;
        emit("done", { ...current.value || {}, city });
      }).catch((e) => {
        console.error(e);
        confirmLoading.value = false;
        emit("done", current.value || {});
      });
    };
    watch(
      () => props.selected,
      () => {
        showInitSelected();
      }
    );
    watch(
      () => props.darkMode,
      (darkMode) => {
        if (!props.mapStyle) {
          state.mapPluginIns && state.mapPluginIns.setMapStyle(darkMode);
        }
      }
    );
    watch(
      () => props.mapStyle,
      (mapStyle) => {
        if (mapStyle) {
          state.mapPluginIns && state.mapPluginIns.setMapStyle(mapStyle);
        }
      }
    );
    watch(
      () => props.mode,
      (mode) => {
        keywords.value = "";
        suggestionData.value = [];
        state.selectedSuggestion = null;
        state.lastSuggestion = "";
        state.mapPluginIns && state.mapPluginIns.removeCenterMarker();
        if (mode !== "poi" && current.value && state.mapPluginIns) {
          const { lng, lat } = current.value;
          state.mapPluginIns.showCenterMarker(lng, lat);
        }
        if (!data.value.length && (mode === "poi" || mode === "keyword")) {
          if (current.value) {
            const { lng, lat } = current.value;
            searchPOI(lng, lat);
          } else if (state.mapPluginIns) {
            state.mapPluginIns.getMapCenter().then((centerPoint) => {
              const { lng, lat } = centerPoint || {};
              searchPOI(lng, lat);
            }).catch((e) => {
              console.error(e);
            });
          }
        }
      }
    );
    watch([() => props.mapKey, () => props.mapPlugin], () => {
      destroyAll();
      renderMap();
    });
    onMounted(() => {
      renderMap();
    });
    onBeforeUnmount(() => {
      destroyAll();
    });
    __expose({
      autocompleteRef,
      getMapIns,
      showInitSelected,
      checkResize
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleLoading, {
        loading: loading.value,
        class: normalizeClass(["ele-map-view", { "is-poi-mode": poiMode.value }]),
        style: normalizeStyle({ height: _ctx.height })
      }, {
        default: withCtx(() => [
          createElementVNode("div", _hoisted_1, [
            createElementVNode("div", {
              ref_key: "mapRef",
              ref: mapRef,
              style: { height: "100%", width: "100%" }
            }, null, 512),
            poiMode.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              createVNode(unref(ElIcon), { class: "ele-map-view-icon-plus" }, {
                default: withCtx(() => [
                  createVNode(unref(PlusOutlined))
                ]),
                _: 1
              }),
              createElementVNode("img", {
                ref_key: "mapPoiCenterIconRef",
                ref: mapPoiCenterIconRef,
                src: _ctx.markerSrc ?? unref(defaultMarkerSrc),
                class: "ele-map-view-body-icon"
              }, null, 8, _hoisted_2)
            ], 64)) : createCommentVNode("", true),
            _ctx.filterable && !keywordMode.value ? (openBlock(), createElementBlock("div", {
              key: 1,
              class: "ele-map-view-search",
              style: normalizeStyle(_ctx.searchStyle)
            }, [
              createVNode(unref(ElAutocomplete), {
                ref_key: "autocompleteRef",
                ref: autocompleteRef,
                valueKey: "name",
                clearable: true,
                modelValue: keywords.value,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => keywords.value = $event),
                placeholder: _ctx.searchPlaceholder,
                popperClass: "ele-map-suggest-popper",
                fetchSuggestions: handleSearch,
                onSelect: handleSearchSelect
              }, {
                prefix: withCtx(() => [
                  createVNode(unref(ElIcon), { class: "el-input__icon" }, {
                    default: withCtx(() => [
                      createVNode(unref(SearchOutlined))
                    ]),
                    _: 1
                  })
                ]),
                default: withCtx(({ item }) => [
                  createElementVNode("div", _hoisted_3, [
                    createElementVNode("div", {
                      class: "ele-map-suggest-title",
                      title: item.name
                    }, toDisplayString(item.name), 9, _hoisted_4),
                    createElementVNode("div", {
                      class: "ele-map-suggest-text",
                      title: item.district
                    }, toDisplayString(item.district), 9, _hoisted_5)
                  ])
                ]),
                _: 1
              }, 8, ["modelValue", "placeholder"])
            ], 4)) : createCommentVNode("", true),
            !poiMode.value && !keywordMode.value ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [
              confirmDisabled.value && _ctx.clickMessage ? (openBlock(), createElementBlock("div", _hoisted_6, toDisplayString(_ctx.clickMessage), 1)) : (openBlock(), createBlock(unref(ElButton), {
                key: 1,
                type: "primary",
                loading: confirmLoading.value,
                disabled: confirmDisabled.value,
                class: "ele-map-view-btn-ok",
                onClick: handleConfirm
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(_ctx.okText), 1)
                ]),
                _: 1
              }, 8, ["loading", "disabled"]))
            ], 64)) : createCommentVNode("", true)
          ]),
          keywordMode.value || poiMode.value ? (openBlock(), createBlock(EleLoading, {
            key: 0,
            loading: poiLoading.value,
            style: normalizeStyle(_ctx.sideStyle),
            class: "ele-map-view-side"
          }, {
            default: withCtx(() => [
              keywordMode.value ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: "ele-map-view-search",
                style: normalizeStyle(_ctx.searchStyle)
              }, [
                createVNode(unref(ElInput), {
                  clearable: true,
                  modelValue: keywords.value,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => keywords.value = $event),
                  prefixIcon: unref(SearchOutlined),
                  placeholder: _ctx.searchPlaceholder,
                  validateEvent: false,
                  onChange: handleSearch
                }, null, 8, ["modelValue", "prefixIcon", "placeholder"])
              ], 4)) : createCommentVNode("", true),
              createElementVNode("div", {
                ref_key: "listRef",
                ref: listRef,
                class: "ele-map-view-list"
              }, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(data.value, (item) => {
                  return openBlock(), createElementBlock("div", {
                    key: item.key,
                    class: normalizeClass(["ele-map-view-item", { "is-active": item === current.value }]),
                    onClick: ($event) => handleItemClick(item)
                  }, [
                    createVNode(unref(ElIcon), { class: "ele-map-view-item-icon" }, {
                      default: withCtx(() => [
                        createVNode(unref(EnvironmentOutlined))
                      ]),
                      _: 1
                    }),
                    createElementVNode("div", _hoisted_8, [
                      !item.name && !item.address ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                        createElementVNode("div", _hoisted_9, [
                          createElementVNode("span", null, toDisplayString(item.lng), 1),
                          _cache[2] || (_cache[2] = createElementVNode("span", null, ",", -1)),
                          createElementVNode("span", null, toDisplayString(item.lat), 1)
                        ]),
                        item.city && (item.city.province || item.city.city || item.city.district) ? (openBlock(), createElementBlock("div", _hoisted_10, [
                          item.city.province ? (openBlock(), createElementBlock("span", _hoisted_11, toDisplayString(item.city.province), 1)) : createCommentVNode("", true),
                          item.city.city ? (openBlock(), createElementBlock("span", _hoisted_12, toDisplayString(item.city.city), 1)) : createCommentVNode("", true),
                          item.city.district ? (openBlock(), createElementBlock("span", _hoisted_13, toDisplayString(item.city.district), 1)) : createCommentVNode("", true)
                        ])) : createCommentVNode("", true)
                      ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                        createElementVNode("div", _hoisted_14, toDisplayString(item.name), 1),
                        item.address ? (openBlock(), createElementBlock("div", _hoisted_15, toDisplayString(item.address), 1)) : createCommentVNode("", true)
                      ], 64))
                    ]),
                    createVNode(unref(ElIcon), { class: "ele-map-view-item-radio" }, {
                      default: withCtx(() => [
                        createVNode(unref(CheckCircleOutlined))
                      ]),
                      _: 1
                    })
                  ], 10, _hoisted_7);
                }), 128)),
                !data.value || !data.value.length ? (openBlock(), createElementBlock("div", _hoisted_16, [
                  createVNode(unref(ElEmpty), mergeProps({ imageSize: 80 }, _ctx.emptyProps || {}), null, 16)
                ])) : createCommentVNode("", true)
              ], 512),
              createElementVNode("div", _hoisted_17, [
                confirmDisabled.value && _ctx.message ? (openBlock(), createElementBlock("div", _hoisted_18, toDisplayString(_ctx.message), 1)) : (openBlock(), createBlock(unref(ElButton), {
                  key: 1,
                  type: "primary",
                  loading: confirmLoading.value,
                  disabled: confirmDisabled.value,
                  class: "ele-map-view-btn-ok",
                  onClick: handleConfirm
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(_ctx.okText), 1)
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"]))
              ])
            ]),
            _: 1
          }, 8, ["loading", "style"])) : createCommentVNode("", true)
        ]),
        _: 1
      }, 8, ["loading", "class", "style"]);
    };
  }
});
export {
  _sfc_main as default
};
