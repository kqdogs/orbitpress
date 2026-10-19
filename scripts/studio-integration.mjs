import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
const base = process.env.TEST_URL || "http://127.0.0.1:4321";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname))
  throw Error("仅允许本地测试");
const password = readFileSync("local-admin.txt", "utf8").match(
  /密码：(.+)/,
)?.[1];
assert(password);
let cookie = "",
  csrf = "",
  snapshot,
  created,
  keyId,
  writer,
  publisher,
  publishId;
const results = [];
const suffix = Date.now();
async function call(
  path,
  { method = "GET", body, token, admin = false, idem, headers = {} } = {},
) {
  const h = { ...headers };
  if (body !== undefined) h["Content-Type"] = "application/json";
  if (admin) {
    h.Cookie = cookie;
    h.Origin = base;
    h["X-CSRF-Token"] = csrf;
  }
  if (token) h.Authorization = `Bearer ${token}`;
  if (idem) h["Idempotency-Key"] = idem;
  const response = await fetch(base + path, {
    method,
    headers: h,
    body: body === undefined ? undefined : JSON.stringify(body),
    redirect: "manual",
    signal: AbortSignal.timeout(15000),
  });
  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {}
  return {
    status: response.status,
    data: json?.data,
    error: json?.error,
    text,
    headers: response.headers,
  };
}
async function test(name, fn) {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log("PASS " + name);
  } catch (error) {
    results.push({ name, passed: false, message: error.message });
    throw error;
  }
}
async function settings(value) {
  const current = await call("/api/admin/settings", { admin: true });
  return call("/api/admin/settings", {
    method: "PUT",
    admin: true,
    body: { ...value, version: current.data.version },
  });
}
const input = {
  title: "独立页面验收",
  slug: `studio-test-${suffix}`,
  excerpt: "独立页面摘要",
  body: "## 多视频验收\n\n:::youtube dQw4w9WgXcQ\n\n:::bilibili BV1xx411c7mD p=2",
  menuLabel: "测试页面",
};
try {
  const login = await call("/api/auth/login", {
    method: "POST",
    headers: { Origin: base },
    body: { username: "admin", password },
  });
  assert.equal(login.status, 200);
  cookie = login.headers.get("set-cookie").split(";")[0];
  csrf = login.data.csrf;
  snapshot = (await call("/api/admin/settings", { admin: true })).data.value;
  await test("页面接口要求管理会话，非法查询返回400", async () => {
    assert.equal((await call("/api/admin/pages")).status, 401);
    assert.equal(
      (await call("/api/admin/pages?unknown=1", { admin: true })).status,
      400,
    );
  });
  await test("未保存独立页面真实预览不落库且受CSRF保护", async () => {
    const before = (await call("/api/admin/pages", { admin: true })).data;
    const payload = {
      title: "实时页面预览",
      excerpt: "预览摘要",
      body: input.body,
    };
    assert.equal((await call("/admin/content-preview")).status, 405);
    assert.equal(
      (
        await call("/admin/content-preview", {
          method: "POST",
          body: payload,
          headers: { Origin: base, Cookie: cookie },
        })
      ).status,
      403,
    );
    const r = await call("/admin/content-preview", {
      method: "POST",
      admin: true,
      body: payload,
    });
    assert.equal(r.status, 200);
    assert(r.text.includes("page-content"));
    assert(r.text.includes("实时页面预览"));
    assert.equal((r.text.match(/<iframe/g) || []).length, 2);
    assert.deepEqual(
      (await call("/api/admin/pages", { admin: true })).data,
      before,
    );
  });
  let idem = randomUUID();
  await test("页面草稿创建、重放、字段持久化和公开隔离", async () => {
    const r = await call("/api/admin/pages", {
      method: "POST",
      admin: true,
      body: input,
      idem,
    });
    assert.equal(r.status, 201);
    created = r.data;
    assert.equal(created.status, "draft");
    assert.equal(created.menuLabel, input.menuLabel);
    const repeated = await call("/api/admin/pages", {
      method: "POST",
      admin: true,
      body: input,
      idem,
    });
    assert.equal(repeated.data.id, created.id);
    assert.equal((await call(`/${created.slug}/`)).status, 404);
    assert.equal(
      (
        await call("/api/admin/pages", {
          method: "POST",
          admin: true,
          body: { ...input, title: "different" },
          idem,
        })
      ).status,
      409,
    );
  });
  await test("页面旧版本拒绝覆盖，最新版本保存成功", async () => {
    const r = await call(`/api/admin/pages/${created.id}`, {
      method: "PUT",
      admin: true,
      body: { ...input, title: "独立页面验收更新", version: created.version },
      idem: randomUUID(),
    });
    assert.equal(r.status, 200);
    assert.equal(r.data.version, created.version + 1);
    created = r.data;
    assert.equal(
      (
        await call(`/api/admin/pages/${created.id}`, {
          method: "PUT",
          admin: true,
          body: { ...input, version: 1 },
          idem: randomUUID(),
        })
      ).status,
      409,
    );
  });
  await test("页面发布后前台展示同一正文与多个视频", async () => {
    const r = await call(`/api/admin/pages/${created.id}/publish`, {
      method: "POST",
      admin: true,
      body: { version: created.version },
      idem: randomUUID(),
    });
    assert.equal(r.status, 200);
    created = r.data;
    const front = await call(`/${created.slug}/`);
    assert.equal(front.status, 200);
    assert(front.text.includes("独立页面验收更新"));
    assert(front.text.includes("多视频验收"));
    assert.equal((front.text.match(/<iframe/g) || []).length, 2);
    assert(front.text.includes("page=2"));
    assert((await call("/sitemap.xml")).text.includes(`/${created.slug}/`));
  });
  await test("草稿API密钥不能改已发布页面或调用回收站", async () => {
    const key = await call("/api/admin/keys", {
      method: "POST",
      admin: true,
      body: {
        name: `studio-test-${suffix}`,
        days: 1,
        scopes: ["content:read", "content:write"],
      },
    });
    assert.equal(key.status, 201);
    keyId = key.data.id;
    writer = key.data.token;
    assert.equal(
      (
        await call(`/api/v1/pages/${created.id}`, {
          method: "PUT",
          token: writer,
          body: { ...input, version: created.version },
          idem: randomUUID(),
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await call(`/api/v1/pages/${created.id}/trash`, {
          method: "POST",
          token: writer,
          body: { version: created.version },
          idem: randomUUID(),
        })
      ).status,
      403,
    );
  });
  await test("发布密钥允许编辑已发布页面和下架", async () => {
    const key = await call("/api/admin/keys", {
      method: "POST",
      admin: true,
      body: {
        name: `studio-publish-${suffix}`,
        days: 1,
        scopes: ["content:read", "content:write", "content:publish"],
      },
    });
    assert.equal(key.status, 201);
    publishId = key.data.id;
    publisher = key.data.token;
    let r = await call(`/api/v1/pages/${created.id}`, {
      method: "PUT",
      token: publisher,
      body: { ...input, title: "发布密钥编辑", version: created.version },
      idem: randomUUID(),
    });
    assert.equal(r.status, 200);
    created = r.data;
    r = await call(`/api/v1/pages/${created.id}/unpublish`, {
      method: "POST",
      token: publisher,
      body: { version: created.version },
      idem: randomUUID(),
    });
    assert.equal(r.status, 200);
    created = r.data;
    assert.equal((await call(`/${created.slug}/`)).status, 404);
    assert(!(await call("/sitemap.xml")).text.includes(`/${created.slug}/`));
  });
  await test("页面回收站、非法编辑和恢复状态闭环", async () => {
    let r = await call(`/api/admin/pages/${created.id}/trash`, {
      method: "POST",
      admin: true,
      body: { version: created.version },
      idem: randomUUID(),
    });
    assert.equal(r.status, 200);
    created = r.data;
    assert.equal(
      (
        await call(`/api/admin/pages/${created.id}`, {
          method: "PUT",
          admin: true,
          body: { ...input, version: created.version },
          idem: randomUUID(),
        })
      ).status,
      409,
    );
    r = await call(`/api/admin/pages/${created.id}/restore`, {
      method: "POST",
      admin: true,
      body: { version: created.version },
      idem: randomUUID(),
    });
    assert.equal(r.status, 200);
    created = r.data;
    assert.equal(created.status, "draft");
  });
  await test("文章与独立页面路径互斥", async () => {
    const posts = (await call("/api/admin/posts?limit=100", { admin: true }))
      .data.items;
    assert.equal(
      (
        await call("/api/admin/pages", {
          method: "POST",
          admin: true,
          body: { ...input, slug: posts[0].slug },
          idem: randomUUID(),
        })
      ).status,
      409,
    );
    assert.equal(
      (
        await call("/api/admin/posts", {
          method: "POST",
          admin: true,
          body: {
            title: "冲突",
            slug: created.slug,
            excerpt: "",
            body: "",
            categoryId: posts[0].categoryId,
            cover: "",
            videoId: "",
            featured: false,
            tags: [],
          },
          idem: randomUUID(),
        })
      ).status,
      409,
    );
  });
  await test("后台路径校验冲突、保存、原入口跳转及会话保留", async () => {
    assert.equal(
      (await settings({ ...snapshot, adminPath: `/${created.slug}` })).status,
      409,
    );
    assert.equal(
      (await settings({ ...snapshot, adminPath: "/api" })).status,
      400,
    );
    const adminPath = `/console-test-${suffix}`;
    const saved = await settings({ ...snapshot, adminPath });
    assert.equal(saved.status, 200);
    const current = await call(adminPath);
    assert.equal(current.status, 200);
    assert(current.text.includes('id="studio"'));
    assert(current.headers.get("cache-control").includes("no-store"));
    const old = await call("/admin");
    assert.equal(old.status, 302);
    assert.equal(old.headers.get("location"), adminPath);
    assert.equal(
      (await call("/api/auth/session", { admin: true })).status,
      200,
    );
    const legacy = { ...saved.data.value };
    delete legacy.adminPath;
    const kept = await settings(legacy);
    assert.equal(kept.status, 200);
    assert.equal(kept.data.value.adminPath, adminPath);
    assert.equal(
      (
        await call("/api/admin/pages", {
          method: "POST",
          admin: true,
          body: { ...input, slug: adminPath.slice(1) },
          idem: randomUUID(),
        })
      ).status,
      409,
    );
    assert.equal((await settings(snapshot)).status, 200);
  });
} finally {
  if (snapshot) {
    const r = await settings(snapshot);
    assert.equal(r.status, 200);
  }
  if (created) {
    const current = (
      await call(`/api/admin/pages/${created.id}`, { admin: true })
    ).data;
    if (current && current.status !== "trash")
      await call(`/api/admin/pages/${created.id}/trash`, {
        method: "POST",
        admin: true,
        body: { version: current.version },
        idem: randomUUID(),
      });
  }
  for (const id of [keyId, publishId].filter(Boolean))
    await call(`/api/admin/keys/${id}/revoke`, { method: "POST", admin: true });
  mkdirSync("test-results", { recursive: true });
  writeFileSync(
    "test-results/studio-integration.json",
    JSON.stringify({ at: new Date().toISOString(), results }, null, 2),
  );
  console.log(
    `新后台集成测试 ${results.filter((r) => r.passed).length}/${results.length} 通过`,
  );
}
