<!-- 图标选择 -->
<template>
  <EleBasicSelect
    ref="selectRef"
    :value="modelValue"
    :multiple="false"
    :disabled="disabled"
    :size="size"
    :clearable="clearable"
    :placeholder="placeholder"
    :automaticDropdown="automaticDropdown"
    :filterable="typeof filterable === 'boolean' ? filterable : false"
    :teleported="teleported"
    :persistent="persistent"
    :placement="placement"
    :transition="transition"
    :popperOptions="popperOptions"
    selectClass="is-icon-select"
    :selectStyle="selectStyle"
    :inputStyle="inputStyle"
    :selectTagsStyle="selectTagsStyle"
    :popperClass="selectPopperClass"
    :popperWidth="popperWidth"
    :popperHeight="popperHeight"
    :popperType="popperType"
    :popperProps="popperProps"
    :popperSlots="popperSlots"
    :popperTitle="lang.title"
    :responsive="isResponsive"
    :selectedLabel="modelValue"
    :visible="selectVisible"
    @update:visible="updateVisible"
    @filterChange="handleSelectFilter"
    @clear="handleSelectClear"
    @focus="handleSelectFocus"
    @blur="handleSelectBlur"
  >
    <template
      v-for="name in Object.keys($slots).filter((k) => !ownSlots.includes(k))"
      #[name]="slotProps"
    >
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
    <template v-if="modelValue && $slots.icon" #prefix>
      <slot name="icon" :icon="modelValue" :prefix="true"></slot>
    </template>
    <div
      v-if="tabBar || showFilterInput"
      class="ele-icon-select-header"
      :style="headerStyle"
    >
      <slot name="tabLeftExtra"></slot>
      <div v-if="tabBar" class="ele-icon-select-tabs" :style="tabsStyle">
        <div
          v-for="(t, i) in tabs"
          :key="`${i}-${t}`"
          class="ele-icon-select-tab"
          :class="{ 'is-active': i === tabActive }"
          @click="handleTabClick(i)"
        >
          {{ t }}
        </div>
      </div>
      <div
        v-if="showFilterInput"
        class="ele-icon-select-search"
        :style="searchStyle"
      >
        <ElInput
          size="small"
          :clearable="true"
          :modelValue="keywords"
          :validateEvent="false"
          :prefixIcon="SearchOutlined"
          :placeholder="filterPlaceholder ?? lang.searchPlaceholder"
          @update:modelValue="handleSelectFilter"
        />
      </div>
      <slot name="tabRightExtra"></slot>
    </div>
    <div class="ele-icon-select-main">
      <div
        v-if="menus && menus.length"
        class="ele-icon-select-menus"
        :style="menusStyle"
      >
        <div
          v-for="(m, i) in menus"
          :key="`${i}-${m}`"
          class="ele-icon-select-menu"
          :class="{ 'is-active': i === menuActive }"
          @click="handleMenuClick(i)"
        >
          {{ m }}
        </div>
      </div>
      <IconGrid
        :data="icons"
        :icon="modelValue"
        :emptyProps="emptyProps"
        :tooltip="tooltip"
        :tooltipProps="tooltipProps"
        :popperVisible="selectVisible"
        :gridStyle="gridStyle"
        :itemStyle="itemStyle"
        :popperType="popperType"
        :style="bodyStyle"
        @select="handleIconSelect"
      >
        <template v-if="$slots.icon" #icon="slotProps">
          <slot name="icon" v-bind="slotProps || {}"></slot>
        </template>
      </IconGrid>
    </div>
  </EleBasicSelect>
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { ElInput } from 'element-plus';
  import type { EleBasicSelectInstance } from '../ele-app/plus';
  import { useLocale } from '../ele-config-provider/receiver';
  import { useResponsive } from '../ele-pro-layout/util';
  import EleBasicSelect from '../ele-basic-select/index.vue';
  import { valueIsChanged, useFormValidate } from '../ele-basic-select/util';
  import { SearchOutlined } from '../icons/index';
  import IconGrid from './components/icon-grid.vue';
  import type { IconItem } from './types';
  import { iconSelectProps, iconSelectEmits } from './props';
  const ownSlots = ['default', 'icon', 'tabLeftExtra', 'tabRightExtra'];

  defineOptions({ name: 'EleIconSelect' });

  const props = defineProps(iconSelectProps);

  const emit = defineEmits(iconSelectEmits);

  const { lang } = useLocale('iconSelect', props);
  const { validateChange } = useFormValidate();
  const isResponsive = useResponsive(props);

  /** 下拉组件 */
  const selectRef = ref<EleBasicSelectInstance>(null);

  /** 下拉框是否显示 */
  const selectVisible = ref<boolean>(false);

  /** 选项卡数据 */
  const tabs = ref<string[]>([]);

  /** 选项卡选中 */
  const tabActive = ref<number>();

  /** 菜单数据 */
  const menus = ref<string[]>([]);

  /** 菜单选中 */
  const menuActive = ref<number>();

  /** 图标数据 */
  const icons = ref<string[]>([]);

  /** 搜索框输入值 */
  const keywords = ref<string>('');

  /** 是否显示选项卡栏 */
  const tabBar = computed(() => {
    if (!tabs.value || !tabs.value.length) {
      return false;
    }
    if (props.hideOnSingleTab && tabs.value.length === 1) {
      return false;
    }
    return true;
  });

  /** 是否显示下拉框中搜索框 */
  const showFilterInput = computed(() => {
    if (props.filterable === true && props.popperType !== 'popper') {
      return true;
    }
    return props.filterable === 'popper';
  });

  /** 下拉框类名 */
  const selectPopperClass = computed<string>(() => {
    const classes: string[] = ['ele-icon-select-popper'];
    if (props.popperType === 'default') {
      classes.push('is-icon-select-default');
    }
    if (
      props.popperType === 'modal' &&
      (tabBar.value || showFilterInput.value || menus.value?.length)
    ) {
      classes.push('ele-modal-show-header-border');
    }
    if (isResponsive.value && props.popperType === 'popper') {
      classes.push('is-icon-select-responsive');
    }
    if (props.popperClass) {
      classes.push(props.popperClass);
    }
    return classes.join(' ');
  });

  /** 更新气泡位置 */
  const updatePopover = () => {
    selectRef.value && selectRef.value.updatePopper();
  };

  /** 初始化数据 */
  const initData = () => {
    // 纯图标数据
    if (
      props.data == null ||
      !props.data.length ||
      typeof props.data[0] === 'string'
    ) {
      tabs.value = [];
      menus.value = [];
      tabActive.value = void 0;
      menuActive.value = void 0;
      icons.value = filterData(props.data as string[]);
      return;
    }
    // 选项卡数据
    tabs.value = props.data.map(
      (d: IconItem | string) => (d as IconItem).title
    );
    if (tabActive.value == null || tabActive.value >= tabs.value.length) {
      tabActive.value = 0;
    }
    const data: IconItem | string = props.data[tabActive.value];
    // 获取菜单导航数据
    if (
      typeof data !== 'string' &&
      data.children != null &&
      data.children.length
    ) {
      menus.value = data.children.map((d) => d.title);
      if (menuActive.value == null || menuActive.value >= menus.value.length) {
        menuActive.value = 0;
      }
      icons.value = filterData(data.children[menuActive.value].icons);
      return;
    }
    // 子级纯图标
    menus.value = [];
    menuActive.value = void 0;
    icons.value = typeof data !== 'string' ? filterData(data.icons) : [];
  };

  /** 搜索图标 */
  const filterData = (data?: string[]) => {
    if (!data) {
      return [];
    }
    if (!keywords.value) {
      return data;
    }
    const keyword = keywords.value.toLowerCase();
    return data.filter((t) => t.toLowerCase().includes(keyword));
  };

  /** 更新下拉框显示状态 */
  const updateVisible = (visible: boolean) => {
    if (visible) {
      handleSelectFilter('');
    }
    if (selectVisible.value !== visible) {
      selectVisible.value = visible;
      emit('visibleChange', visible);
    }
  };

  /** 更新选中值 */
  const updateModelValue = (modelValue?: string | null) => {
    if (valueIsChanged(modelValue, props.modelValue)) {
      emit('update:modelValue', modelValue);
      validateChange();
      emit('change', modelValue);
    }
  };

  /** 清除 */
  const handleSelectClear = () => {
    updateModelValue(null);
    updateVisible(false);
    emit('clear');
  };

  /** 获取焦点事件 */
  const handleSelectFocus = (e: FocusEvent) => {
    emit('focus', e);
  };

  /** 失去焦点事件 */
  const handleSelectBlur = (e: FocusEvent) => {
    emit('blur', e);
  };

  /** 筛选关键字改变事件 */
  const handleSelectFilter = (value: string) => {
    if (keywords.value !== value) {
      keywords.value = value;
    }
    initData();
    // 跳转到存在搜索数据的选项卡和菜单
    if (!props.data?.length || icons.value.length) {
      return;
    }
    for (let i = 0; i < props.data.length; i++) {
      const d = props.data[i];
      if (typeof d === 'string') {
        return;
      }
      const keyword = keywords.value.toLowerCase();
      if (d.children != null && d.children.length) {
        for (let j = 0; j < d.children.length; j++) {
          const icons = d.children[j].icons;
          if (icons && icons.some((t) => t.toLowerCase().includes(keyword))) {
            menuActive.value = j;
            tabActive.value = i;
            initData();
            return;
          }
        }
      } else if (
        d.icons != null &&
        d.icons.some((t) => t.toLowerCase().includes(keyword))
      ) {
        tabActive.value = i;
        initData();
        return;
      }
    }
  };

  /** 选项卡点击事件 */
  const handleTabClick = (index: number) => {
    tabActive.value = index;
    initData();
  };

  /** 菜单点击事件 */
  const handleMenuClick = (index: number) => {
    menuActive.value = index;
    initData();
  };

  /** 选择图标 */
  const handleIconSelect = (icon: string) => {
    updateModelValue(icon);
    updateVisible(false);
  };

  watch(
    () => props.data,
    () => {
      initData();
    },
    {
      immediate: true,
      deep: true
    }
  );

  defineExpose({
    selectRef,
    updatePopover
  });
</script>
