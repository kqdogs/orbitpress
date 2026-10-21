<script setup lang="ts">
import {t} from '../../../lib/i18n/client';
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { requestPreview } from "../../admin/api";
import { useStudio } from "../store";
import { previewViewport } from "../../../lib/preview-viewport";
const props = defineProps<{
  body: unknown;
  endpoint?:
    | "/admin/preview"
    | "/admin/home-preview"
    | "/admin/page-preview"
    | "/admin/content-preview";
  mobile?: boolean;
}>();
const emit = defineEmits<{ load: [frame: HTMLIFrameElement] }>();
const { session } = useStudio();
const html = ref(""),
  error = ref(""),
  loading = ref(false);
const frame = ref<HTMLIFrameElement>();
const viewport = ref<HTMLDivElement>();
const bounds=ref({width:1440,height:720});
const screen=computed(()=>previewViewport(bounds.value.width,bounds.value.height,props.mobile));
const screenStyle=computed(()=>({width:`${screen.value.width}px`,height:`${screen.value.height}px`,left:`${screen.value.left}px`,transform:`scale(${screen.value.scale})`}));
let observer:ResizeObserver|undefined;
onMounted(()=>{
 if(!viewport.value)return;
 observer=new ResizeObserver(([entry])=>{if(entry)bounds.value={width:entry.contentRect.width,height:entry.contentRect.height};});
 observer.observe(viewport.value);
});
let scrollPosition = { x: 0, y: 0 };
function ready() {
  if (!frame.value) return;
  frame.value.contentWindow?.scrollTo(scrollPosition.x, scrollPosition.y);
  emit("load", frame.value);
}
let controller = new AbortController(),
  timer: ReturnType<typeof setTimeout>;
async function load() {
  controller.abort();
  controller = new AbortController();
  const signal = controller.signal;
  loading.value = true;
  error.value = "";
  try {
    const value = await requestPreview(
      props.body,
      session.value!.csrf,
      signal,
      props.endpoint || "/admin/preview",
    );
    if (!signal.aborted) {
      const win = frame.value?.contentWindow;
      scrollPosition = { x: win?.scrollX || 0, y: win?.scrollY || 0 };
      html.value = value;
    }
  } catch (cause) {
    if (!signal.aborted)
      error.value = cause instanceof Error ? cause.message : t("预览失败");
  } finally {
    if (!signal.aborted) loading.value = false;
  }
}
watch(
  () => props.body,
  () => {
    controller.abort();
    clearTimeout(timer);
    timer = setTimeout(load, 350);
  },
  { deep: true, immediate: true },
);
onBeforeUnmount(() => {
  observer?.disconnect();
  controller.abort();
  clearTimeout(timer);
});
</script>
<template>
  <section class="studio-preview" v-loading="loading">
    <div class="preview-caption"> {{ t("真实前台预览 · 尚未保存的内容") }} <el-tag size="small" type="info"> {{ t("实时更新") }} </el-tag>
      <span class="preview-device">{{ mobile?t("手机"):t("桌面") }} {{ screen.width }}px · {{ Math.round(screen.scale*100) }}%</span>
      <slot />
    </div>
    <el-alert v-if="error" :title="error" type="error" :closable="false">
      <el-button @click="load"> {{ t("重试") }} </el-button>
    </el-alert>
    <div ref="viewport" class="preview-viewport">
     <iframe
      v-if="html"
      ref="frame"
      :class="{ mobile }"
      :style="screenStyle"
      :srcdoc="html"
      sandbox="allow-same-origin"
      :title="t('实时前台预览')"
      @load="ready"
    />
    </div>
  </section>
</template>
