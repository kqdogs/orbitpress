import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useAddressSettings } from "../src/components/studio/shared/addressSettings";
import {
  adminPathInput,
  permalinkCustomInput,
  settingsInput,
} from "../src/lib/schema";
import {
  acceptsPlainPermalink,
  matchPostPath,
  permalinkPresets,
  postPath,
} from "../src/lib/permalinks";

const base = {
  title: "路径验收",
  tagline: "",
  description: "",
  logo: "",
  socialFollowText: "关注",
  headerNav: [{ label: "首页", href: "/" }],
  youtube: "",
  telegram: "",
  bilibili: "",
  twitter: "",
  notice: "",
};
const post = {
  id: "article-1",
  slug: "hello-world",
  categorySlug: "tools",
  publishedAt: "2026-10-19",
  createdAt: "2026-10-18",
};

describe("后台路径与可编辑固定链接", () => {
  it("固定前缀与输入分离，粘贴完整路径不产生双斜杠", () => {
    const value = ref(settingsInput.parse(base));
    const { adminSegment } = useAddressSettings(value);
    expect(adminSegment.value).toBe("admin");
    adminSegment.value = "/my-console";
    expect(value.value.adminPath).toBe("/my-console");
    expect(adminPathInput.parse(value.value.adminPath)).toBe("/my-console");
    adminSegment.value = "";
    expect(value.value.adminPath).toBe("/");
    expect(adminPathInput.safeParse(value.value.adminPath).success).toBe(false);
  });
  it.each(permalinkPresets)(
    "%s 预设的结构可以继续修改，主链接和别名同步",
    (preset) => {
      const value = ref(settingsInput.parse(base));
      const { primaryFormat, structure, aliases } = useAddressSettings(value);
      primaryFormat.value = preset.value;
      expect(structure.value).toBe(
        preset.template || value.value.permalinkCustom,
      );
      structure.value = "/read/%post_id%/%postname%.html";
      expect(primaryFormat.value).toBe("custom");
      expect(postPath(post, value.value)).toBe(
        "/read/article-1/hello-world.html",
      );
      if (preset.value !== "custom")
        expect(aliases.value).toContain(preset.value);
      const saved = settingsInput.parse(
        JSON.parse(JSON.stringify(value.value)),
      );
      expect(postPath(post, saved)).toBe("/read/article-1/hello-world.html");
      aliases.value = [];
      expect(value.value.permalinkFormats).toEqual(["custom"]);
    },
  );
  it.each([
    "/stories/%post_id%/",
    "/%year%/entry-%post_id%.html",
    "/?p=%post_id%",
  ])("接受 ID 自定义 %s", (template) => {
    expect(permalinkCustomInput.parse(template)).toBe(template);
    const value = settingsInput.parse({
      ...base,
      permalinkFormats: ["custom"],
      permalinkCustom: template,
    });
    const path = postPath(post, value);
    if (!template.includes("?"))
      expect(matchPostPath(path, value)?.id).toBe(post.id);
    else {
      expect(acceptsPlainPermalink(value)).toBe(true);
      expect(matchPostPath("/", value)).toBeNull();
    }
  });
  it.each([
    "/stories/",
    "/%post_id%/%post_id%/",
    "/?p=%post_id%&next=evil",
    "/api/%post_id%/",
    "/%postname%/%unknown%/",
  ])("拒绝非法自定义 %s", (template) => {
    expect(permalinkCustomInput.safeParse(template).success).toBe(false);
  });
});
