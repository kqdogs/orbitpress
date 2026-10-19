<template>
  <div class="ele-cropper-tools">
    <ElButtonGroup
      v-for="group in groups"
      :key="group.key"
      class="ele-cropper-tool-item"
    >
      <template v-for="item in group.items" :key="item.key">
        <ElUpload
          v-if="item.name === 'upload'"
          action=""
          :accept="accept"
          :showFileList="false"
          :beforeUpload="handleUpload"
          class="ele-cropper-tool-upload"
        >
          <ElButton
            type="primary"
            :icon="item.icon"
            class="ele-cropper-tool"
            :class="item.className"
            @mouseover="(e: MouseEvent) => handleItemHover(item, e)"
            @click="handleUploadButtonClick"
          />
        </ElUpload>
        <ElButton
          v-else
          type="primary"
          :icon="item.icon"
          class="ele-cropper-tool"
          :class="item.className"
          @mouseover="(e: MouseEvent) => handleItemHover(item, e)"
          @click="handleClick(item.name)"
        >
          <template v-if="item.name === 'ok'">{{ lang.ok }}</template>
        </ElButton>
      </template>
    </ElButtonGroup>
    <EleTooltip
      placement="top"
      :offset="6"
      v-bind="tooltipProps || {}"
      :content="tooltipContent"
      :virtualRef="virtualRef"
      :virtualTriggering="true"
      ref="tooltipRef"
    />
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { watch, ref, shallowRef, markRaw } from 'vue';
  import { ElButtonGroup, ElButton, ElUpload } from 'element-plus';
  import {
    ZoomInOutlined,
    ZoomOutOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    UndoOutlined,
    ReloadOutlined,
    SwapOutlined,
    SortOutlined,
    SyncOutlined,
    UploadOutlined,
    CheckOutlined
  } from '../../icons/index';
  import { useTimer } from '../../utils/hook';
  import { useLocale } from '../../ele-config-provider/receiver';
  import type { EleTooltipProps, EleTooltipInstance } from '../../ele-app/plus';
  import EleTooltip from '../../ele-tooltip/index.vue';
  import type {
    UploadOption,
    ToolName,
    ToolGroup,
    ToolItem,
    BeforeUploadClick,
    CropperLocale
  } from '../types';

  const props = defineProps({
    /** 操作按钮布局 */
    tools: String,
    /** 允许上传的图片类型 */
    accept: String,
    /** 是否需要提示组件 */
    tooltip: Boolean,
    /** 提示组件属性 */
    tooltipProps: Object as PropType<EleTooltipProps>,
    /** 上传按钮点击前的钩子 */
    beforeUploadClick: Function as PropType<BeforeUploadClick>,
    /** 国际化 */
    locale: Object as PropType<Partial<CropperLocale>>
  });

  const emit = defineEmits({
    action: (_action: Exclude<ToolName, 'upload'>) => true,
    upload: (_option?: UploadOption) => true
  });

  const TOOL_ICONS = {
    zoomIn: ZoomInOutlined,
    zoomOut: ZoomOutOutlined,
    moveLeft: ArrowLeftOutlined,
    moveRight: ArrowRightOutlined,
    moveUp: ArrowUpOutlined,
    moveDown: ArrowDownOutlined,
    rotateLeft: UndoOutlined,
    rotateRight: ReloadOutlined,
    flipX: SwapOutlined,
    flipY: SortOutlined,
    reset: SyncOutlined,
    upload: UploadOutlined,
    ok: CheckOutlined
  };

  const { lang } = useLocale('cropper', props);

  const [startHideTipTimer, stopHideTipTimer] = useTimer(200);

  /** 提示组件 */
  const tooltipRef = ref<EleTooltipInstance>(null);

  /** 按钮布局 */
  const groups = shallowRef<ToolGroup[]>([]);

  /** 提示文本 */
  const tooltipContent = ref<string>('');

  /** 提示组件单例目标 */
  const virtualRef = ref<any>();

  /** 触发替换图片事件 */
  const emitUpload = (data: string, type: string) => {
    emit('upload', { data, type });
  };

  /** 图片上传处理 */
  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const url = e.target?.result;
      if (url != null) {
        emitUpload(url as string, file.type);
      }
    };
    reader.readAsDataURL(file);
    return false;
  };

  /** 关闭提示 */
  const hideTooltip = () => {
    tooltipRef.value && tooltipRef.value.hide();
  };

  /** 打开提示 */
  const handleItemHover = (item: ToolItem, e: MouseEvent) => {
    const title = lang.value[item.name];
    if (props.tooltip && item.name !== 'ok' && title) {
      stopHideTipTimer();
      virtualRef.value = e.currentTarget;
      tooltipContent.value = title;
    }
  };

  /** 按钮点击事件 */
  const handleClick = (name: Exclude<ToolName, 'upload'>) => {
    startHideTipTimer(() => {
      hideTooltip();
    });
    emit('action', name);
  };

  /** 上传按钮点击事件 */
  const handleUploadButtonClick = (e: MouseEvent) => {
    startHideTipTimer(() => {
      hideTooltip();
    });
    if (
      props.beforeUploadClick &&
      props.beforeUploadClick(e, emitUpload) === false
    ) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  /** 同步按钮布局 */
  watch(
    () => props.tools,
    (tools) => {
      if (!tools) {
        groups.value = [];
        return;
      }
      const names = Object.keys(TOOL_ICONS);
      groups.value = tools
        .split('|')
        .filter((g) => !!g.trim())
        .map((g, i) => {
          const items: ToolItem[] = g
            .split(',')
            .filter((t) => {
              const name = t.trim();
              return name && names.includes(name);
            })
            .map((t, j) => {
              const name = t.trim() as ToolName;
              return {
                key: `${i}-${j}-${name}`,
                name,
                icon: markRaw(TOOL_ICONS[name]),
                className: `ele-cropper-${name}`
              };
            });
          return { key: i + g, items };
        });
    },
    { immediate: true }
  );
</script>
