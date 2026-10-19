<!-- 文件列表 -->
<template>
  <div class="ele-file-list-group" @mousedown="handleMousedown">
    <!-- 网格模式 -->
    <FileGrid
      v-if="grid"
      :data="data"
      :icons="icons"
      :selectionType="selectionType"
      :selections="selections"
      :current="current"
      :isCheckAll="isCheckAll"
      :isIndeterminate="isIndeterminate"
      :checkAllText="lang.selectAll"
      :selectedText="lang.selectTips"
      :ctxMenuDropdownVisible="ctxMenuDropdownVisible"
      :contextMenuFileItem="contextMenuFileItem"
      @checkAllChange="handleCheckAllChange"
      @itemClick="handleItemClick"
      @itemCheckChange="handleItemCheckChange"
      @itemContextOpen="handleItemContextOpen"
    >
      <template v-for="name in Object.keys($slots)" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps || {}"></slot>
      </template>
    </FileGrid>
    <!-- 表格模式 -->
    <FileTable
      v-else
      :data="data"
      :icons="smallIcons || icons"
      :selectionType="selectionType"
      :selections="selections"
      :current="current"
      :isCheckAll="isCheckAll"
      :isIndeterminate="isIndeterminate"
      :nameText="lang.fileName"
      :sizeText="lang.fileSize"
      :timeText="lang.fileTimestamp"
      :sortable="sortable"
      :sort="sort"
      :order="order"
      :columns="columns"
      :ctxMenuDropdownVisible="ctxMenuDropdownVisible"
      :contextMenuFileItem="contextMenuFileItem"
      @checkAllChange="handleCheckAllChange"
      @itemClick="handleItemClick"
      @itemCheckChange="handleItemCheckChange"
      @itemContextOpen="handleItemContextOpen"
      @sortChange="handleSortChange"
    >
      <template v-for="name in Object.keys($slots)" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps || {}"></slot>
      </template>
    </FileTable>
    <!-- 鼠标选择框 -->
    <div class="ele-file-list-selector" :style="selectorStyle"></div>
    <!-- 右键菜单 -->
    <EleDropdown
      v-if="contextMenus"
      :persistent="false"
      placement="bottom-start"
      popperClass="ele-file-list-item-context"
      :validateEvent="false"
      v-bind="contextMenuProps || {}"
      ref="ctxMenuDropdownRef"
      componentType="pro"
      :preventContextmenu="true"
      trigger="click"
      :virtualTriggering="true"
      :virtualRef="ctxMenuDropdownVirtualRef"
      :disabled="!ctxMenuDropdownItems.length"
      :items="ctxMenuDropdownItems"
      @command="handleItemCtxMenuClick"
      @visibleChange="handleItemCtxMenuVisible"
    />
  </div>
</template>

<script lang="ts" setup>
  import {
    ref,
    shallowRef,
    reactive,
    computed,
    nextTick,
    watch,
    onBeforeUnmount
  } from 'vue';
  import type { EleDropdownInstance } from '../ele-app/plus';
  import { throttle } from '../utils/common';
  import { useLocale } from '../ele-config-provider/receiver';
  import type { DropdownItem } from '../ele-dropdown/types';
  import EleDropdown from '../ele-dropdown/index.vue';
  import FileGrid from './components/file-grid.vue';
  import FileTable from './components/file-table.vue';
  import type {
    FileItem,
    SortValue,
    ItemContextMenuOption,
    ContextOpenOption
  } from './types';
  import { fileListProps, fileListEmits } from './props';
  const GRID_ITEM_SEL = '.ele-file-list-body>.ele-file-list-item';

  defineOptions({ name: 'EleFileList' });

  const props = defineProps(fileListProps);

  const emit = defineEmits(fileListEmits);

  const { lang } = useLocale('fileList', props);

  /** 鼠标选择框样式 */
  const selectorStyle = reactive({
    top: '0px',
    left: '0px',
    width: '0px',
    height: '0px',
    display: 'none'
  });

  /** 文件右键菜单组件 */
  const ctxMenuDropdownRef = ref<EleDropdownInstance>(null);

  /** 文件右键菜单数据 */
  const ctxMenuDropdownItems = shallowRef<DropdownItem[]>([]);

  /** 文件右键菜单虚拟触发节点 */
  const ctxMenuDropdownVirtualRef = ref<any>();

  /** 文件右键菜单是否打开 */
  const ctxMenuDropdownVisible = ref<any>(false);

  /** 当前打开的右键菜单对应的文件数据 */
  const contextMenuFileItem = ref<FileItem | undefined | null>(null);

  /** 是否是全选 */
  const isCheckAll = computed<boolean>(() => {
    return !!(
      props.data &&
      props.data.length &&
      props.selections &&
      props.selections.length &&
      !props.data.some((d) => !props.selections?.some?.((t) => d.key === t.key))
    );
  });

  /** 是否是半选 */
  const isIndeterminate = computed<boolean>(() => {
    return !!(!isCheckAll.value && props.selections && props.selections.length);
  });

  /** 更新选中数据 */
  const updateSelections = (selection: FileItem[]) => {
    emit('update:selections', selection);
  };

  /** 更新单选选中 */
  const updateCurrent = (current: FileItem | null) => {
    emit('update:current', current);
  };

  /** 全选框点击事件 */
  const handleCheckAllChange = () => {
    if (props.selectionType !== 'checkbox') {
      return;
    }
    // 取消全选
    if (isCheckAll.value || props.data == null || !props.data.length) {
      if (!props.selections) {
        updateSelections([]);
        return;
      }
      // 支持分页记忆
      const temp = props.selections.filter((d) => {
        return props.data ? !props.data.some((t) => t.key === d.key) : true;
      });
      updateSelections(temp);
      return;
    }
    // 全选
    if (!props.selections) {
      updateSelections([...props.data]);
      return;
    }
    // 支持分页记忆
    const temp = props.selections.concat(
      props.data.filter((d) => {
        return props.selections
          ? !props.selections.some((t) => t.key === d.key)
          : true;
      })
    );
    updateSelections(temp);
  };

  /** 文件复选框点击事件 */
  const handleItemCheckChange = (item: FileItem) => {
    // 单选
    if (props.selectionType === 'radio') {
      updateCurrent(
        props.current && props.current.key === item.key ? null : item
      );
      return;
    }
    // 多选
    if (props.selectionType !== 'checkbox') {
      return;
    }
    if (!props.selections || !props.selections.length) {
      updateSelections([item]);
      return;
    }
    // 选中
    if (!props.selections.some((t) => t.key === item.key)) {
      updateSelections(props.selections.concat([item]));
      return;
    }
    // 取消选中
    updateSelections(props.selections.filter((t) => t.key !== item.key));
  };

  /** 文件点击事件 */
  const handleItemClick = (item: FileItem) => {
    emit('itemClick', item);
  };

  /** 排序点击事件 */
  const handleSortChange = (name: string) => {
    const sorter: SortValue = { sort: name };
    if (props.order && name === props.sort) {
      sorter.order = props.order === 'asc' ? 'desc' : null;
    } else {
      sorter.order = 'asc';
    }
    emit('sortChange', sorter);
  };

  /** 文件右键菜单点击事件 */
  const handleItemCtxMenuClick = (key: string) => {
    if (contextMenuFileItem.value != null) {
      const option: ItemContextMenuOption = {
        key,
        item: contextMenuFileItem.value
      };
      emit('itemContextMenu', option);
    }
  };

  /** 文件右键菜单打开事件 */
  const handleItemCtxMenuVisible = (visible: boolean) => {
    ctxMenuDropdownVisible.value = visible;
    if (
      visible &&
      ctxMenuDropdownRef.value != null &&
      contextMenuFileItem.value != null
    ) {
      emit(
        'itemContextOpen',
        ctxMenuDropdownRef.value,
        contextMenuFileItem.value
      );
    }
  };

  /** 获取文件右键菜单数据 */
  const getContextMenus = (item: FileItem) => {
    if (typeof props.contextMenus === 'function') {
      return props.contextMenus(item);
    }
    return props.contextMenus;
  };

  /** 关闭文件右键菜单 */
  const hideAllDropdown = () => {
    if (ctxMenuDropdownRef.value) {
      ctxMenuDropdownRef.value.handleClose();
    }
  };

  /** 显示文件右键菜单 */
  const showItemContextMenu = (item: FileItem, triggerEl: HTMLElement) => {
    if (
      contextMenuFileItem.value != null &&
      contextMenuFileItem.value === item
    ) {
      return;
    }
    hideAllDropdown();
    nextTick(() => {
      contextMenuFileItem.value = item;
      ctxMenuDropdownItems.value = getContextMenus(item) || [];
      ctxMenuDropdownVirtualRef.value = triggerEl;
      if (ctxMenuDropdownItems.value.length) {
        nextTick(() => {
          ctxMenuDropdownRef.value && ctxMenuDropdownRef.value.handleOpen();
        });
      }
    });
  };

  /** 文件右键菜单展开事件 */
  const handleItemContextOpen = (option: ContextOpenOption) => {
    if (props.contextMenus == null) {
      return;
    }
    option.e.preventDefault();
    option.e.stopPropagation();
    if (ctxMenuDropdownVirtualRef.value !== option.triggerEl) {
      showItemContextMenu(option.item, option.triggerEl);
      return;
    }
    if (ctxMenuDropdownItems.value.length && ctxMenuDropdownRef.value) {
      ctxMenuDropdownRef.value.handleOpen();
    }
  };

  /** 鼠标框选事件 */
  const handleMousedown = (event: MouseEvent) => {
    if (!props.boxChoose || props.selectionType !== 'checkbox') {
      return;
    }
    const downX = event.clientX;
    const downY = event.clientY;
    const target = event.currentTarget as HTMLDivElement;
    const position = target.getBoundingClientRect();
    const items = Array.from(target.querySelectorAll(GRID_ITEM_SEL));

    // 鼠标移动事件
    const mousemoveFn = throttle((e: MouseEvent) => {
      const moveX = Math.max(e.clientX, position.left);
      const moveY = Math.max(e.clientY, position.top);
      const left = Math.min(moveX, downX) - position.left;
      const top = Math.min(moveY, downY) - position.top;
      const width = Math.min(
        Math.abs(moveX - downX),
        target.clientWidth - left
      );
      const height = Math.min(
        Math.abs(moveY - downY),
        target.clientHeight - top
      );
      selectorStyle.left = left + 'px';
      selectorStyle.top = top + 'px';
      selectorStyle.width = width + 'px';
      selectorStyle.height = height + 'px';
      selectorStyle.display = 'block';
      if (width < 6 || height < 6) {
        items.forEach((item) => {
          item.classList.remove('is-active');
        });
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      e.stopPropagation();
      e.preventDefault();
      items.forEach((item: HTMLDivElement) => {
        const itemX = item.offsetLeft + item.clientWidth;
        const itemY = item.offsetTop + item.clientHeight;
        if (
          itemX > left &&
          itemY > top &&
          item.offsetLeft < left + width &&
          item.offsetTop < top + height
        ) {
          item.classList.add('is-active');
        } else {
          item.classList.remove('is-active');
        }
      });
    }, 60);

    // 鼠标抬起事件
    const mouseupFn = (e: MouseEvent) => {
      selectorStyle.display = 'none';
      const moveX = Math.max(e.clientX, position.left);
      const moveY = Math.max(e.clientY, position.top);
      const left = Math.min(moveX, downX) - position.left;
      const top = Math.min(moveY, downY) - position.top;
      const width = Math.min(
        Math.abs(moveX - downX),
        target.clientWidth - left
      );
      const height = Math.min(
        Math.abs(moveY - downY),
        target.clientHeight - top
      );
      if (width > 6 && height > 6) {
        const checked: FileItem[] = [];
        items.forEach((item, i) => {
          if (item.classList.contains('is-active')) {
            item.classList.remove('is-active');
            if (props.data && props.data[i]) {
              checked.push(props.data[i]);
            }
          }
        });
        if (checked.length) {
          updateSelections(checked);
        }
      }

      document.removeEventListener('mousemove', mousemoveFn);
      document.removeEventListener('mouseup', mouseupFn);
    };

    document.addEventListener('mousemove', mousemoveFn);
    document.addEventListener('mouseup', mouseupFn);
  };

  watch(
    [() => props.grid, () => props.data],
    () => {
      hideAllDropdown();
      ctxMenuDropdownVirtualRef.value = null;
      contextMenuFileItem.value = null;
    },
    { deep: true }
  );

  onBeforeUnmount(() => {
    contextMenuFileItem.value = null;
  });
</script>
