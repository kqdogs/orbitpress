import { onBeforeUnmount, ref, watch, toRaw } from "vue";
import { communityCardInput, settingsInput, type Settings } from "../../../lib/schema";
import { request } from "../../admin/api";
import { useStudio } from "../store";
import type { SettingRecord } from "../types";
export function useSettingsDraft() {
  const store = useStudio();
  const initial = store.data.settings!;
  const value = ref<Settings>(structuredClone(toRaw(initial.value)));
  const version = ref(initial.version);
  watch(
    value,
    () => {
      store.dirty.value = true;
    },
    { deep: true, flush: "sync" },
  );
  onBeforeUnmount(() => {
    store.dirty.value = false;
  });
  async function save() {
    const card = communityCardInput.nullable().safeParse(value.value.communityCard);
    if (!card.success) throw new Error('请检查首页交流群卡片：标题、图标和按钮文字不能为空，链接须为本站路径或 HTTPS 链接。');
    const input = settingsInput.parse(value.value);
    const saved = await request<SettingRecord>("/api/admin/settings", {
      method: "PUT",
      csrf: store.session.value!.csrf,
      body: { ...input, version: version.value },
    });
    value.value = structuredClone(saved.value);
    version.value = saved.version;
    store.data.settings = saved;
    store.dirty.value = false;
    return saved;
  }
  return { value, save, store };
}
