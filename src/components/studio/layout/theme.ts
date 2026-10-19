import { reactive, watch } from "vue";
import { changeColor } from "ele-admin-plus/es/utils/theme-util";
import { z } from "zod";
const schema = z.object({
  dark: z.boolean().default(false),
  color: z
    .string()
    .regex(/^#[a-f\d]{6}$/i)
    .default("#2f54eb"),
  collapse: z.boolean().default(false),
  compact: z.boolean().default(false),
  colorfulIcon: z.boolean().default(false),
  fluid: z.boolean().default(true),
  mixSidebarStyle: z.enum(["light", "dark"]).default("light"),
  layout: z.enum(["default", "top", "mix"]).default("default"),
  sidebarLayout: z.enum(["default", "mix", "box"]).default("default"),
  sidebarStyle: z.enum(["light", "dark"]).default("light"),
  headerStyle: z.enum(["light", "dark", "primary"]).default("light"),
  tabStyle: z
    .enum(["default", "card", "simple", "indicator", "button", "tag"])
    .default("simple"),
  fixedHeader: z.boolean().default(true),
  fixedSidebar: z.boolean().default(true),
  fixedBody: z.boolean().default(true),
  tabBar: z.boolean().default(true),
  tabInHeader: z.boolean().default(false),
  rounded: z.boolean().default(false),
  uniqueOpened: z.boolean().default(true),
  logoInHeader: z.boolean().default(false),
  sidebarCustomStyle: z.record(z.string(), z.string()).nullable().default(null),
  sideboxCustomStyle: z.record(z.string(), z.string()).nullable().default(null),
  sideCustomStyle: z.record(z.string(), z.string()).nullable().default(null),
  headerCustomStyle: z.record(z.string(), z.string()).nullable().default(null),
  tabsCustomStyle: z.record(z.string(), z.string()).nullable().default(null),
  contentCustomStyle: z.record(z.string(), z.string()).nullable().default(null),
  layoutCustomStyle: z.record(z.string(), z.string()).nullable().default(null),
  layoutCustomClass: z.string().nullable().default(null),
});
export type Theme = z.infer<typeof schema>;
export function useTheme() {
  let cached: unknown = {};
  try {
    cached = JSON.parse(localStorage.getItem("studio-ele-theme") || "{}");
  } catch {
    /* Defaults apply. */
  }
  const parsed = schema.safeParse(cached);
  const theme = reactive<Theme>(
    parsed.success ? parsed.data : schema.parse({}),
  );
  watch(
    theme,
    () => {
      changeColor(theme.color, theme.dark);
      document.documentElement.classList.toggle("rounded", theme.rounded);
      try {
        localStorage.setItem("studio-ele-theme", JSON.stringify(theme));
      } catch {
        /* Theme remains usable. */
      }
    },
    { deep: true, immediate: true },
  );
  function reset() {
    Object.assign(theme, schema.parse({}));
  }
  function applyLayout(config: unknown) {
    Object.assign(theme, schema.parse({ ...theme, ...Object(config) }));
  }
  return { theme, reset, applyLayout };
}
