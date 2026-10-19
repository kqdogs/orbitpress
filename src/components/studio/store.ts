import {
  inject,
  onBeforeUnmount,
  provide,
  reactive,
  ref,
  type InjectionKey,
} from "vue";
import { request, RequestError } from "../admin/api";
import type {
  ApiKey,
  Audit,
  Media,
  Session,
  SettingRecord,
  StudioData,
} from "./types";
import type { Category, Page, Post } from "../../lib/schema";

const key: InjectionKey<ReturnType<typeof createStudio>> = Symbol("studio");
export function createStudio() {
  const session = ref<Session | null>(null),
    booting = ref(true),
    loading = ref(false),
    busy = ref(false),
    error = ref(""),
    message = ref(""),
    dirty = ref(false);
  const data = reactive<StudioData>({
    posts: [],
    pages: [],
    cats: [],
    media: [],
    keys: [],
    audit: [],
    settings: null,
    nextCursor: null,
  });
  let controller = new AbortController(),
    active = true;
  async function refresh() {
    controller.abort();
    controller = new AbortController();
    const signal = controller.signal;
    loading.value = true;
    try {
      const [posts, pages, cats, settings, media, keys, audit] =
        await Promise.all([
          request<{ items: Post[]; nextCursor: string | null }>(
            "/api/admin/posts?limit=100",
            {
              signal,
            },
          ),
          request<Page[]>("/api/admin/pages", { signal }),
          request<Category[]>("/api/admin/categories?includeTrash=1", {
            signal,
          }),
          request<SettingRecord>("/api/admin/settings", { signal }),
          request<Media[]>("/api/admin/media", { signal }),
          request<ApiKey[]>("/api/admin/keys", { signal }),
          request<Audit[]>("/api/admin/audit", { signal }),
        ]);
      if (!signal.aborted && active)
        Object.assign(data, {
          posts: posts.items,
          nextCursor: posts.nextCursor,
          pages,
          cats,
          settings,
          media,
          keys,
          audit,
        });
    } finally {
      if (!signal.aborted && active) loading.value = false;
    }
  }
  async function run<T>(
    operation: () => Promise<T>,
    success = "",
  ): Promise<T | undefined> {
    if (busy.value) return;
    busy.value = true;
    error.value = "";
    message.value = "";
    try {
      const result = await operation();
      if (active) message.value = success;
      return result;
    } catch (cause) {
      if (!active) return;
      if (cause instanceof RequestError && cause.status === 401)
        session.value = null;
      error.value = cause instanceof Error ? cause.message : "操作失败，请重试";
    } finally {
      if (active) busy.value = false;
    }
  }
  async function boot() {
    try {
      session.value = await request<Session>("/api/auth/session", {
        signal: controller.signal,
      });
      await refresh();
    } catch (cause) {
      if (!(cause instanceof RequestError && cause.status === 401))
        error.value = cause instanceof Error ? cause.message : "连接失败";
    } finally {
      if (active) booting.value = false;
    }
  }
  onBeforeUnmount(() => {
    active = false;
    controller.abort();
  });
  const store = {
    session,
    booting,
    loading,
    busy,
    error,
    message,
    dirty,
    data,
    refresh,
    run,
    boot,
  };
  provide(key, store);
  return store;
}
export function useStudio() {
  const store = inject(key);
  if (!store) throw new Error("Studio provider missing");
  return store;
}
