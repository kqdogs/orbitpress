<template>
  <iframe :src="iframeSrc" class="ele-admin-iframe"></iframe>
</template>

<script lang="ts" setup>
  import { ref, unref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { getIframeUrl, getIframeSrc } from '../util';

  const props = defineProps({
    /** 菜单内嵌地址 */
    menuComponent: String
  });

  const { currentRoute } = useRouter();
  const current = unref(currentRoute);

  /** 内嵌地址 */
  const iframeUrl = getIframeUrl(
    current.params,
    props.menuComponent || (current.meta?.iframe as string | undefined)
  );

  /** 内嵌地址含路由参数 */
  const iframeSrc = ref<string>(getIframeSrc(current.fullPath, iframeUrl));

  /** 路由参数同步到内嵌地址 */
  watch(currentRoute, (to) => {
    const route = unref(to);
    const url = getIframeUrl(
      route.params,
      props.menuComponent || (route.meta?.iframe as string | undefined)
    );
    if (!url || url !== iframeUrl) {
      return;
    }
    const src = getIframeSrc(route.fullPath, iframeUrl);
    if (iframeSrc.value !== src) {
      iframeSrc.value = src;
    }
  });
</script>
