import { computed, type Ref } from "vue";
import type { Settings } from "../../../lib/schema";
import { permalinkTemplate } from "../../../lib/permalinks";

export function useAddressSettings(settings: Ref<Settings>) {
  const adminSegment = computed({
    get: () => settings.value.adminPath.slice(1),
    set: (segment: string) => {
      settings.value.adminPath = `/${segment.replace(/^\/+/, "")}`;
    },
  });
  const primaryFormat = computed({
    get: () => settings.value.permalinkFormats[0],
    set: (format: Settings["permalinkFormats"][number]) => {
      settings.value.permalinkFormats = [
        format,
        ...settings.value.permalinkFormats.filter((item) => item !== format),
      ];
    },
  });
  const aliases = computed({
    get: () => settings.value.permalinkFormats.slice(1),
    set: (formats: Settings["permalinkFormats"]) => {
      settings.value.permalinkFormats = [
        primaryFormat.value,
        ...new Set(formats.filter((item) => item !== primaryFormat.value)),
      ];
    },
  });
  const structure = computed({
    get: () => permalinkTemplate(settings.value),
    set: (template: string) => {
      settings.value.permalinkCustom = template;
      primaryFormat.value = "custom";
    },
  });
  return { adminSegment, primaryFormat, aliases, structure };
}
