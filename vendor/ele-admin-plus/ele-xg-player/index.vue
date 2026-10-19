<!-- 视频播放器 -->
<template>
  <div ref="rootRef"></div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
  import Player from 'xgplayer';
  import type { IPlayerOptions } from 'xgplayer';

  defineOptions({ name: 'EleXgPlayer' });

  const props = defineProps({
    config: {
      type: Object as PropType<IPlayerOptions>,
      required: true
    }
  });

  const emit = defineEmits({
    player: (_player: Player | null) => true
  });

  /** 播放器实例 */
  let player: Player | null = null;

  /** 根节点 */
  const rootRef = ref<HTMLDivElement | null>(null);

  /** 初始化 */
  const init = () => {
    destroy();
    if (rootRef.value && props.config?.url) {
      player = new Player(
        Object.assign({}, props.config, { el: rootRef.value })
      );
      emit('player', player);
    }
  };

  /** 销毁 */
  const destroy = () => {
    if (player && typeof player.destroy === 'function') {
      player.destroy();
      player = null;
    }
  };

  onMounted(() => {
    init();
  });

  onBeforeUnmount(() => {
    destroy();
  });

  watch(
    () => props.config,
    () => {
      init();
    }
  );

  defineExpose({
    player
  });
</script>
