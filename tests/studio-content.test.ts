import { describe, it, expect } from "vitest";
import { videoDirective } from "../src/components/studio/video";
import { renderMarkdown } from "../src/lib/markdown";
import {
  adminPathInput,
  contentPreviewInput,
  pageInput,
  settingsInput,
  settingsUpdateInput,
} from "../src/lib/schema";
describe("编辑器多视频与安全边界", () => {
  it.each([
    "https://youtu.be/dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com/shorts/dQw4w9WgXcQ",
    "dQw4w9WgXcQ",
  ])("解析 YouTube %s", (value) =>
    expect(videoDirective("youtube", value)).toBe(":::youtube dQw4w9WgXcQ"),
  );
  it("保留哔哩哔哩分 P，av 正确转换 aid", () => {
    const directive = videoDirective(
      "bilibili",
      "https://www.bilibili.com/video/av170001?p=2",
    );
    expect(directive).toBe(":::bilibili av170001 p=2");
    expect(renderMarkdown(directive).html).toContain(
      "aid=170001&amp;page=2&amp;autoplay=0",
    );
  });
  it.each([
    "https://youtube.com.evil.invalid/watch?v=dQw4w9WgXcQ",
    "https://user:pass@youtube.com/watch?v=dQw4w9WgXcQ",
    "javascript:alert(1)",
    "not-an-id",
  ])("拒绝伪造视频输入 %s", (value) =>
    expect(() => videoDirective("youtube", value)).toThrow(),
  );
  it.each([
    "https://www.bilibili.com/video/BV1xx411c7mD?p=0",
    "https://www.bilibili.com/video/BV1xx411c7mD?p=1.2",
    "https://www.bilibili.com/video/BV1xx411c7mD?p=1000",
  ])("拒绝非法分 P %s", (value) =>
    expect(() => videoDirective("bilibili", value)).toThrow(),
  );
  it("代码块中的嵌入示例保持原文", () => {
    const html = renderMarkdown(
      "```text\n:::youtube dQw4w9WgXcQ\n:::bilibili BV1xx411c7mD\n```",
    ).html;
    expect(html).toContain(":::youtube");
    expect(html).not.toContain("<iframe");
  });
  it("同一正文同时插入多个视频", () => {
    const html = renderMarkdown(
      ":::youtube dQw4w9WgXcQ\n\n:::bilibili BV1xx411c7mD p=3\n\n:::youtube L1lVj0XH2dM",
    ).html;
    expect(html.match(/<iframe/g)).toHaveLength(3);
    expect(html).toContain("page=3");
  });
  it("拒绝非白名单 iframe 地址及事件属性", () => {
    const html = renderMarkdown(
      '<iframe src="https://evil.invalid" onload="alert(1)"></iframe>',
    ).html;
    expect(html).not.toContain("evil.invalid");
    expect(html).not.toContain("onload");
  });
});
describe("页面和后台路径契约", () => {
  it.each(["/admin", "/studio", "/my-console-2"])(
    "接受独立后台路径 %s",
    (value) => expect(adminPathInput.parse(value)).toBe(value),
  );
  it.each([
    "/api",
    "/about",
    "//evil",
    "/admin/path",
    "/Admin",
    "/studio?foo",
    "/images",
    "/category",
  ])("拒绝系统或非法后台路径 %s", (value) =>
    expect(adminPathInput.safeParse(value).success).toBe(false),
  );
  it("独立页面不接受客户端注入发布状态", () => {
    const page = {
      title: "联系",
      slug: "contact",
      excerpt: "",
      body: "正文",
      menuLabel: "",
    };
    expect(pageInput.parse(page)).toEqual(page);
    expect(pageInput.safeParse({ ...page, status: "published" }).success).toBe(
      false,
    );
  });
  it("未命名页面可预览，不要求路径或写库", () => {
    expect(
      contentPreviewInput.parse({ title: "", excerpt: "", body: "" }),
    ).toEqual({ title: "", excerpt: "", body: "" });
    expect(
      contentPreviewInput.safeParse({
        title: "test",
        excerpt: "",
        body: "",
        status: "published",
      }).success,
    ).toBe(false);
  });
  it("旧客户端缺少 adminPath 时保持不传，读取默认 /admin", () => {
    const basic = {
      title: "test",
      tagline: "",
      description: "",
      logo: "",
      socialFollowText: "关注",
      headerNav: [{ label: "首页", href: "/" }],
      youtube: "",
      bilibili: "",
      twitter: "",
      telegram: "",
      notice: "",
    };
    expect(settingsInput.parse(basic).adminPath).toBe("/admin");
    expect(
      settingsUpdateInput.parse({ ...basic, version: 1 }),
    ).not.toHaveProperty("adminPath");
  });
});
