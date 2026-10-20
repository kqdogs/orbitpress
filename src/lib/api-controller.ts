import { z } from "zod";
import { adminCredential, changeAdminPassword, passwordChangeInput } from './password-service';
import { ApiError, readBody, json, now, epoch } from "./http";
import {
  authenticate,
  session,
  sameOrigin,
  requireScope,
  rateLimit,
  randomToken,
  sha256,
  verifyPassword,
  sessionCookie,
} from "./security";
import {
  categories,
  articleTags,
  getPage,
  getPost,
  listPages,
  listPosts,
  siteSettings,
} from "./repository";
import {
  categoryInput,
  keyInput,
  pageInput,
  pageUpdate,
  postInput,
  postUpdate,
  settingsInput,
  settingsUpdateInput,
  versionInput,
  configuredCategorySlugs,
} from "./schema";
import { writePost } from "./content-service";
import { assertAdminPath } from "./content-path";
import { writePage } from "./page-service";
import { purgeContent } from './purge-service';
import { renderMarkdown } from "./markdown";
import {importArticle,importRequest,discoverArticles} from './article-import';
import {discoverRequest} from './import-contract';
import {
  createApiKey,
  listApiKeys,
  revealApiKey,
  revokeApiKey,
} from "./key-service";

export async function handleApi(request: Request, env: Env, path: string) {
  const db = env.DB;
  const method = request.method;
  const url = new URL(request.url);
  if (path === "auth/login" && method === "POST") {
    sameOrigin(request);
    await rateLimit(
      db,
      `login:${await sha256(request.headers.get("cf-connecting-ip") || "local")}`,
      10,
      300,
    );
    const body = await readBody(
      request,
      z
        .object({ username: z.string().max(80), password: z.string().max(200) })
        .strict(),
      2000,
    );
    if (!env.ADMIN_PASSWORD_HASH || !env.ADMIN_USERNAME)
      throw new ApiError(503, "NOT_CONFIGURED", "请先运行本地初始化");
    const credential = await adminCredential(db, env.ADMIN_PASSWORD_HASH);
    const valid = await verifyPassword(body.password, credential.passwordHash);
    if (!valid || body.username !== env.ADMIN_USERNAME)
      throw new ApiError(401, "LOGIN_FAILED", "用户名或密码错误");
    const token = randomToken(),
      csrf = randomToken();
    const result = await db.batch([
      db.prepare("DELETE FROM sessions WHERE expires_at<=?").bind(epoch()),
      db
        .prepare("INSERT INTO sessions(hash,csrf,expires_at,credential_version) SELECT ?,?,?,? WHERE COALESCE((SELECT version FROM admin_credentials WHERE id=1),0)=? AND COALESCE((SELECT password_hash FROM admin_credentials WHERE id=1),?)=? RETURNING hash")
        .bind(await sha256(token), csrf, epoch() + 28800, credential.version, credential.version, env.ADMIN_PASSWORD_HASH, credential.passwordHash),
    ]);
    if (!result[1].results.length) throw new ApiError(409, 'CREDENTIAL_CONFLICT', '密码已修改，请使用新密码重新登录');
    return json({ csrf, username: env.ADMIN_USERNAME }, 200, {
      "Set-Cookie": sessionCookie(token, request.url),
    });
  }
  if (path === "auth/session" && method === "GET") {
    const actor = await session(request, db);
    return json({ csrf: actor.csrf, username: env.ADMIN_USERNAME });
  }
  if (path === 'auth/password' && method === 'POST') {
    await authenticate(request, db, 'admin');
    await rateLimit(db, 'password-change:admin', 5, 300);
    const input = await readBody(request, passwordChangeInput, 3000);
    if (!env.ADMIN_PASSWORD_HASH) throw new ApiError(503, 'NOT_CONFIGURED', '管理员凭据未配置');
    await changeAdminPassword(db, env.ADMIN_PASSWORD_HASH, input);
    return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie('', request.url, 0) });
  }
  if (path === "auth/logout" && method === "POST") {
    await authenticate(request, db, "admin");
    const token =
      request.headers.get("cookie")?.match(/(?:^|;\s*)session=([^;]+)/)?.[1] ||
      "";
    await db
      .prepare("DELETE FROM sessions WHERE hash=?")
      .bind(await sha256(token))
      .run();
    return json({ ok: true }, 200, {
      "Set-Cookie": sessionCookie("", request.url, 0),
    });
  }
  const [prefix, resource, id, action] = path.split("/");
  if (prefix !== "admin" && prefix !== "v1")
    throw new ApiError(404, "NOT_FOUND", "接口不存在");
  const actor = await authenticate(
    request,
    db,
    prefix === "admin" ? "admin" : "key",
  );
  if(prefix==='admin'&&resource==='tags'&&method==='GET'&&!id){
    requireScope(actor,'content:read');
    if(url.searchParams.size)throw new ApiError(400,'VALIDATION','标签列表不接受额外参数');
    return json(await articleTags(db));
  }
  if(resource==='categories'&&method==='POST'&&id&&action==='purge'){
    if(prefix!=='admin')throw new ApiError(403,'FORBIDDEN','自动化接口不支持彻底删除');
    return json(await purgeContent(db,request,actor,'categories',id,await readBody(request,versionInput)));
  }
  if (resource === "categories") {
    if (method === "GET") {
      requireScope(actor, "content:read");
      return json(
        await categories(
          db,
          prefix === "admin" && url.searchParams.get("includeTrash") === "1",
        ),
      );
    }
    if (
      prefix === "admin" &&
      id &&
      ((method === "DELETE" && !action) ||
        (method === "POST" && action === "restore"))
    ) {
      requireScope(actor, "content:write");
      const { version } = await readBody(request, versionInput);
      const restore = action === "restore";
      const timestamp = now();
      const operation = crypto.randomUUID();
      if (
        !restore &&
        (await db
          .prepare("SELECT id FROM posts WHERE category_id=? LIMIT 1")
          .bind(id)
          .first())
      )
        throw new ApiError(
          409,
          "CATEGORY_IN_USE",
          "该分类仍有关联文章（包括草稿和回收站），请先移动文章",
        );
      const settings = await siteSettings(db);
      const category = await db
        .prepare("SELECT slug FROM categories WHERE id=?")
        .bind(id)
        .first<{ slug: string }>();
      if (
        !restore &&
        category &&
        (configuredCategorySlugs(settings.value).includes(category.slug) ||
          settings.value.homeOptions.categoryIds.includes(id))
      )
        throw new ApiError(
          409,
          "CATEGORY_LINKED",
          "请先调整页头、页脚导航或页面装修中对该分类的引用",
        );
      const result = await db.batch([
        db
          .prepare(
            `UPDATE categories SET deleted_at=?,version=version+1,last_operation=? WHERE id=? AND version=? AND deleted_at IS ${restore ? "NOT NULL" : "NULL"} AND EXISTS(SELECT 1 FROM settings WHERE id=1 AND version=?) ${restore ? "" : "AND NOT EXISTS(SELECT 1 FROM posts WHERE category_id=categories.id)"} RETURNING id`,
          )
          .bind(
            restore ? null : timestamp,
            operation,
            id,
            version,
            settings.version,
          ),
        db
          .prepare(
            "INSERT INTO audit SELECT ?,?,?,?,? FROM categories WHERE id=? AND last_operation=?",
          )
          .bind(
            crypto.randomUUID(),
            actor.id,
            restore ? "category.restore" : "category.delete",
            id,
            timestamp,
            id,
            operation,
          ),
      ]);
      if (!result[0].results.length) {
        const existing = await db
          .prepare("SELECT version FROM categories WHERE id=?")
          .bind(id)
          .first<{ version: number }>();
        if (!existing) throw new ApiError(404, "NOT_FOUND", "分类不存在");
        if (existing.version !== version)
          throw new ApiError(409, "VERSION_CONFLICT", "分类已更新，请刷新");
        const usage = await db
          .prepare("SELECT id FROM posts WHERE category_id=? LIMIT 1")
          .bind(id)
          .first();
        if (usage)
          throw new ApiError(
            409,
            "CATEGORY_IN_USE",
            "该分类仍有关联文章（包括草稿和回收站），请先移动文章",
          );
        throw new ApiError(
          409,
          "CATEGORY_LINKED",
          "请先移除页头、页脚或页面装修中该分类的链接，或刷新分类状态",
        );
      }
      return json({ id });
    }
    if (
      prefix === "admin" &&
      !action &&
      ((method === "POST" && !id) || (method === "PUT" && id))
    ) {
      requireScope(actor, "content:write");
      const input = await readBody(
        request,
        method === "PUT"
          ? categoryInput.extend({ version: z.number().int().positive() })
          : categoryInput,
      );
      const categoryId = id || crypto.randomUUID();
      const settings = await siteSettings(db);
      if (method === "PUT") {
        const current = await db
          .prepare("SELECT slug FROM categories WHERE id=?")
          .bind(categoryId)
          .first<{ slug: string }>();
        if (
          current &&
          current.slug !== input.slug &&
          configuredCategorySlugs(settings.value).includes(current.slug)
        )
          throw new ApiError(
            409,
            "CATEGORY_LINKED",
            "请先调整页头、页脚导航或页面装修中该分类的链接，再修改分类路径",
          );
      }
      try {
        if (method === "POST")
          await db
            .prepare(
              "INSERT INTO categories(id,name,slug,description,icon) VALUES(?,?,?,?,?)",
            )
            .bind(
              categoryId,
              input.name,
              input.slug,
              input.description,
              input.icon,
            )
            .run();
        else {
          const result = await db
            .prepare(
              "UPDATE categories SET name=?,slug=?,description=?,icon=?,version=version+1 WHERE id=? AND version=? AND deleted_at IS NULL AND EXISTS(SELECT 1 FROM settings WHERE id=1 AND version=?)",
            )
            .bind(
              input.name,
              input.slug,
              input.description,
              input.icon,
              categoryId,
              "version" in input ? input.version : 0,
              settings.version,
            )
            .run();
          if (result.meta.changes !== 1)
            throw new ApiError(
              409,
              "VERSION_CONFLICT",
              "分类或站点设置已更新，请刷新",
            );
        }
      } catch (e) {
        if (String(e).includes("UNIQUE"))
          throw new ApiError(409, "SLUG_EXISTS", "分类路径已存在");
        throw e;
      }
      return json({ id: categoryId }, method === "POST" ? 201 : 200);
    }
  }
  if ((resource==='posts'||resource==='pages')&&method==='DELETE'&&id&&!action) {
    if(prefix!=='admin')throw new ApiError(403,'FORBIDDEN','自动化接口不支持彻底删除');
    return json(await purgeContent(db,request,actor,resource,id,await readBody(request,versionInput)));
  }
  if (resource === "posts") {
    if (method === "GET") {
      requireScope(actor, "content:read");
      if (id) {
        const post = await getPost(db, id);
        if (!post) throw new ApiError(404, "NOT_FOUND", "文章不存在");
        return json(post);
      }
      const query = z
        .object({
          status: z.enum(["draft", "published", "trash"]).optional(),
          q: z.string().max(100).optional(),
          limit: z.coerce
            .number()
            .int()
            .min(1)
            .max(prefix === "admin" ? 100 : 24)
            .default(12),
          cursor: z.string().max(500).optional(),
          category: z.string().max(120).optional(),
          tag: z.string().trim().min(1).max(30).optional(),
        })
        .strict()
        .safeParse(Object.fromEntries(url.searchParams));
      if (!query.success) throw new ApiError(400, "VALIDATION", "列表参数无效");
      return json(await listPosts(db, { ...query.data, admin: true }));
    }
    if (method === "POST" && !id) {
      requireScope(actor, "content:write");
      const result = await writePost(
        db,
        request,
        actor,
        await readBody(request, postInput),
      );
      return json(result.data, result.status, {
        Location: `/api/${prefix}/posts/${result.data.id}`,
      });
    }
    if (method === "PUT" && id && !action) {
      requireScope(actor, "content:write");
      const existing = await getPost(db, id);
      if (existing?.status === "published")
        requireScope(actor, "content:publish");
      const result = await writePost(
        db,
        request,
        actor,
        await readBody(request, postUpdate),
        id,
      );
      return json(result.data);
    }
    if (
      method === "POST" &&
      id &&
      ["publish", "unpublish", "trash", "restore"].includes(action)
    ) {
      if (prefix === "v1" && ["trash", "restore"].includes(action))
        throw new ApiError(403, "SCOPE", "自动化接口不支持删除或恢复");
      requireScope(
        actor,
        ["publish", "unpublish"].includes(action)
          ? "content:publish"
          : "content:write",
      );
      const result = await writePost(
        db,
        request,
        actor,
        await readBody(request, versionInput),
        id,
        action,
      );
      return json(result.data);
    }
  }
  if (resource === "pages") {
    if (method === "GET") {
      requireScope(actor, "content:read");
      if (id) {
        const page = await getPage(db, id);
        if (!page) throw new ApiError(404, "NOT_FOUND", "页面不存在");
        return json(page);
      }
      const query = z
        .object({
          status: z.enum(["draft", "published", "trash"]).optional(),
          q: z.string().max(100).optional(),
        })
        .strict()
        .safeParse(Object.fromEntries(url.searchParams));
      if (!query.success) throw new ApiError(400, "VALIDATION", "列表参数无效");
      return json(await listPages(db, { ...query.data, admin: true }));
    }
    if (method === "POST" && !id) {
      requireScope(actor, "content:write");
      const result = await writePage(
        db,
        request,
        actor,
        await readBody(request, pageInput),
      );
      return json(result.data, result.status, {
        Location: `/api/${prefix}/pages/${result.data.id}`,
      });
    }
    if (method === "PUT" && id && !action) {
      requireScope(actor, "content:write");
      const result = await writePage(
        db,
        request,
        actor,
        await readBody(request, pageUpdate),
        id,
      );
      return json(result.data);
    }
    if (
      method === "POST" &&
      id &&
      ["publish", "unpublish", "trash", "restore"].includes(action)
    ) {
      if (prefix === "v1" && ["trash", "restore"].includes(action))
        throw new ApiError(403, "FORBIDDEN", "外部 API 不允许删除或恢复页面");
      requireScope(
        actor,
        ["publish", "unpublish"].includes(action)
          ? "content:publish"
          : "content:write",
      );
      const result = await writePage(
        db,
        request,
        actor,
        await readBody(request, versionInput),
        id,
        action,
      );
      return json(result.data);
    }
  }
  if (prefix !== "admin") throw new ApiError(404, "NOT_FOUND", "接口不存在");
  if(resource==='imports'&&method==='POST'&&id==='discover'&&!action){
    await rateLimit(db,`import-discover:${actor.id}`,10,60);
    const input=await readBody(request,discoverRequest,4000);
    return json(await discoverArticles(input.url,input.page));
  }
  if(resource==='imports'&&method==='POST'&&!id){
    await rateLimit(db,`import:${actor.id}`,12,60);
    const input=await readBody(request,importRequest,4000);
    return json(await importArticle(input.url,env));
  }
  if (resource === "preview" && method === "POST") {
    const input = await readBody(
      request,
      z.object({ body: z.string().max(100000) }).strict(),
    );
    return json(renderMarkdown(input.body));
  }
  if (resource === "settings") {
    if (method === "GET") return json(await siteSettings(db));
    if (method === "PUT") {
      const { version, ...patch } = await readBody(
        request,
        settingsUpdateInput,
      );
      const currentSettings = await siteSettings(db);
      const input = settingsInput.parse({ ...currentSettings.value, ...patch });
      for(const key of Object.keys(input.pageLayouts)) {
        if(key.startsWith('page:')&&!await getPage(db,key.slice(5)))
          throw new ApiError(409,'PAGE_NOT_FOUND','布局关联的独立页面不存在，请刷新后重新选择');
      }
      await assertAdminPath(db, input);
      const categorySlugs = configuredCategorySlugs(input);
      const result = await db
        .prepare(
          "UPDATE settings SET value=?,version=version+1 WHERE id=1 AND version=? AND NOT EXISTS(SELECT 1 FROM json_each(?) nav WHERE NOT EXISTS(SELECT 1 FROM categories c WHERE c.slug=nav.value AND c.deleted_at IS NULL)) AND NOT EXISTS(SELECT 1 FROM json_each(?) ids WHERE NOT EXISTS(SELECT 1 FROM categories c WHERE c.id=ids.value AND c.deleted_at IS NULL)) AND NOT EXISTS(SELECT 1 FROM json_each(?) ids WHERE NOT EXISTS(SELECT 1 FROM pages p WHERE p.id=ids.value))",
        )
        .bind(
          JSON.stringify(input),
          version,
          JSON.stringify(categorySlugs),
          JSON.stringify(input.homeOptions.categoryIds),
          JSON.stringify(Object.keys(input.pageLayouts).filter(key=>key.startsWith('page:')).map(key=>key.slice(5))),
        )
        .run()
        .catch((error: unknown) => {
          if (String(error).includes("CONTENT_PATH_CONFLICT"))
            throw new ApiError(
              409,
              "PATH_CONFLICT",
              "后台路径与内容发生冲突，请调整路径",
            );
          throw error;
        });
      if (result.meta.changes !== 1) {
        const current = await siteSettings(db);
        if (current.version !== version)
          throw new ApiError(409, "VERSION_CONFLICT", "设置已变化，请刷新");
        for(const key of Object.keys(input.pageLayouts))if(key.startsWith('page:')&&!await getPage(db,key.slice(5)))throw new ApiError(409,'PAGE_NOT_FOUND','布局关联的独立页面已被删除，请刷新');
        throw new ApiError(
          409,
          "CATEGORY_LINKED",
          "导航或首页装修引用了不存在或已删除的分类，请调整",
        );
      }
      return json(await siteSettings(db));
    }
  }
  if (resource === "keys") {
    if (method === "GET" && !id) return json(await listApiKeys(db));
    if (method === "POST" && !id) {
      const input = await readBody(request, keyInput, 2000);
      return json(
        await createApiKey(db, actor, input, env.API_KEY_ENCRYPTION_KEY),
        201,
      );
    }
    if (method === "POST" && id && action === "reveal")
      return json(
        await revealApiKey(db, actor, id, env.API_KEY_ENCRYPTION_KEY),
      );
    if (method === "POST" && id && action === "revoke")
      return json(await revokeApiKey(db, actor, id));
  }
  if (resource === "audit" && method === "GET")
    return json(
      (
        await db
          .prepare(
            "SELECT id,actor,action,resource_id resourceId,created_at createdAt FROM audit ORDER BY created_at DESC LIMIT 100",
          )
          .all()
      ).results,
    );
  if (resource === "media") {
    if (method === "GET")
      return json(
        (
          await db
            .prepare(
              "SELECT id,name,mime,size,created_at createdAt FROM media ORDER BY created_at DESC LIMIT 100",
            )
            .all()
        ).results,
      );
    if (method === "POST") {
      const max = 5 * 1024 * 1024;
      if (Number(request.headers.get("content-length")) > max + 10000)
        throw new ApiError(413, "FILE_TOO_LARGE", "图片不能超过5MB");
      // Bound the stream before multipart parsing; Content-Length alone is untrusted.
      const reader = request.body?.getReader();
      let size = 0;
      const chunks: Uint8Array[] = [];
      if (!reader) throw new ApiError(400, "FILE", "请上传图片");
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > max + 10000) {
          await reader.cancel();
          throw new ApiError(413, "FILE_TOO_LARGE", "图片不能超过5MB");
        }
        chunks.push(value);
      }
      const form = await new Response(new Blob(chunks as BlobPart[]), {
        headers: { "Content-Type": request.headers.get("content-type") || "" },
      })
        .formData()
        .catch(() => {
          throw new ApiError(400, "FILE", "上传格式错误");
        });
      const file = form.get("file");
      if (!(file instanceof File) || file.size > max || file.size < 12)
        throw new ApiError(400, "FILE", "请选择5MB以内的图片");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const type = detectImage(bytes);
      if (!type || file.type !== type.mime)
        throw new ApiError(
          415,
          "IMAGE_TYPE",
          "仅支持真实 PNG、JPEG、WebP 图片",
        );
      const mediaId = `${crypto.randomUUID()}.${type.ext}`;
      await env.MEDIA.put(mediaId, bytes, {
        httpMetadata: { contentType: type.mime },
      });
      try {
        await db
          .prepare("INSERT INTO media VALUES(?,?,?,?,?)")
          .bind(
            mediaId,
            file.name.replace(/[<>\x00-\x1f]/g, "").slice(0, 120),
            type.mime,
            file.size,
            now(),
          )
          .run();
      } catch (e) {
        await env.MEDIA.delete(mediaId);
        throw e;
      }
      return json({ id: mediaId, url: `/media/${mediaId}` }, 201);
    }
  }
  throw new ApiError(405, "METHOD_NOT_ALLOWED", "不支持此操作");
}
export function detectImage(b: Uint8Array) {
  if (b.length < 12) return null;
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => b[i] === v))
    return { mime: "image/png", ext: "png" };
  if (b[0] === 255 && b[1] === 216 && b[2] === 255)
    return { mime: "image/jpeg", ext: "jpg" };
  if (
    new TextDecoder().decode(b.slice(0, 4)) === "RIFF" &&
    new TextDecoder().decode(b.slice(8, 12)) === "WEBP"
  )
    return { mime: "image/webp", ext: "webp" };
  return null;
}
