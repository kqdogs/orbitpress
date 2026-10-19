import { beforeEach, describe, expect, it, vi } from "vitest";
import { settingsInput } from "../src/lib/schema";

vi.mock("../src/lib/security", async (original) => ({
  ...(await original<typeof import("../src/lib/security")>()),
  authenticate: vi.fn(async () => ({ id: "admin", kind: "admin", scopes: [] })),
}));
vi.mock("../src/lib/repository", async (original) => ({
  ...(await original<typeof import("../src/lib/repository")>()),
  siteSettings: vi.fn(),
}));
vi.mock("../src/lib/content-path", () => ({ assertAdminPath: vi.fn() }));
import { handleApi } from "../src/lib/api-controller";
import { siteSettings } from "../src/lib/repository";
import { assertAdminPath } from "../src/lib/content-path";

describe("后台路径保存的并发错误契约", () => {
  const value = settingsInput.parse({
    title: "测试站点",
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
  });
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(siteSettings).mockResolvedValue({ value, version: 1 });
  });
  async function saveFailure(error: Error) {
    const run = vi.fn().mockRejectedValue(error);
    const statement = { bind: vi.fn(), run };
    statement.bind.mockReturnValue(statement);
    const db = { prepare: vi.fn(() => statement) } as unknown as D1Database;
    const request = new Request("http://localhost/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...value, adminPath: "/console", version: 1 }),
    });
    try {
      await handleApi(request, { DB: db } as Env, "admin/settings");
    } finally {
      expect(assertAdminPath).toHaveBeenCalledOnce();
      expect(run).toHaveBeenCalledOnce();
    }
  }
  it("预检查后被并发内容写入占用时返回409 PATH_CONFLICT", async () => {
    await expect(
      saveFailure(
        new Error("D1_ERROR: CONTENT_PATH_CONFLICT: SQLITE_CONSTRAINT"),
      ),
    ).rejects.toMatchObject({ status: 409, code: "PATH_CONFLICT" });
  });
  it("数据库异常保持失败，不伪装成成功或路径冲突", async () => {
    const failure = new Error("D1 storage unavailable");
    await expect(saveFailure(failure)).rejects.toBe(failure);
  });
});
