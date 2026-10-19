import { ApiError, epoch, now } from "./http";
import { assertContentSlug } from "./content-path";
import { getPage } from "./repository";
import { sha256, requireScope, type Actor } from "./security";
import type { Page, PageInput } from "./schema";

export async function writePage(
  db: D1Database,
  request: Request,
  actor: Actor,
  input: PageInput | { version: number },
  id?: string,
  action = "save",
) {
  const key = request.headers.get("idempotency-key");
  if (!key || !/^[\x21-\x7e]{8,100}$/.test(key))
    throw new ApiError(
      400,
      "IDEMPOTENCY_REQUIRED",
      "页面写入需要8至100字符的 Idempotency-Key",
    );
  const scope = await sha256(
    `${actor.id}:${request.method}:${new URL(request.url).pathname}:${key}`,
  );
  const fingerprint = await sha256(JSON.stringify(input));
  const replay = async () => {
    const previous = await db
      .prepare(
        "SELECT fingerprint,response,code FROM idempotency WHERE scope=? AND expires_at>?",
      )
      .bind(scope, epoch())
      .first<{ fingerprint: string; response: string; code: number }>();
    if (previous) {
      if (previous.fingerprint !== fingerprint)
        throw new ApiError(
          409,
          "IDEMPOTENCY_CONFLICT",
          "同一幂等键不能用于不同内容",
        );
      return {
        data: JSON.parse(previous.response) as Page,
        status: previous.code,
      };
    }
    return null;
  };
  const repeated = await replay();
  if (repeated) return repeated;
  const previous = id ? await getPage(db, id) : null;
  if (id && !previous) throw new ApiError(404, "NOT_FOUND", "页面不存在");
  if (action === "save" && previous?.status === "published")
    requireScope(actor, "content:publish");
  if (action === "save" && previous?.status === "trash")
    throw new ApiError(409, "INVALID_STATE", "请先恢复页面");
  if (previous && (!("version" in input) || input.version !== previous.version))
    throw new ApiError(
      409,
      "VERSION_CONFLICT",
      "页面已被修改，请重新读取后合并",
    );
  const transitions: Record<string, [string, string]> = {
    publish: ["draft", "published"],
    unpublish: ["published", "draft"],
    trash: ["any", "trash"],
    restore: ["trash", "draft"],
  };
  let status = previous?.status || "draft";
  if (action !== "save") {
    const rule = transitions[action];
    if (
      !rule ||
      (rule[0] !== "any" && status !== rule[0]) ||
      status === rule[1]
    )
      throw new ApiError(409, "INVALID_STATE", "当前状态不支持此操作");
    status = rule[1] as Page["status"];
  }
  const content = "title" in input ? input : previous!;
  if (status === "published" && !content.body.trim())
    throw new ApiError(400, "EMPTY_CONTENT", "发布前请填写页面内容");
  await assertContentSlug(db, content.slug, "pages");
  const timestamp = now();
  const operation = crypto.randomUUID();
  const next: Page = {
    ...content,
    id: previous?.id || crypto.randomUUID(),
    status,
    publishedAt:
      status === "published"
        ? previous?.publishedAt || timestamp
        : previous?.publishedAt || null,
    createdAt: previous?.createdAt || timestamp,
    updatedAt: timestamp,
    version: (previous?.version || 0) + 1,
  };
  const vals = [
    next.title,
    next.slug,
    next.excerpt,
    next.body,
    next.menuLabel,
    next.status,
    next.publishedAt,
    next.createdAt,
    next.updatedAt,
    actor.id,
    next.version,
    operation,
  ];
  const mutation = previous
    ? db
        .prepare(
          "UPDATE pages SET title=?,slug=?,excerpt=?,body=?,menu_label=?,status=?,published_at=?,created_at=?,updated_at=?,updated_by=?,version=?,last_operation=? WHERE id=? AND version=? RETURNING id",
        )
        .bind(...vals, next.id, previous.version)
    : db
        .prepare(
          "INSERT INTO pages(title,slug,excerpt,body,menu_label,status,published_at,created_at,updated_at,updated_by,version,last_operation,id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?) RETURNING id",
        )
        .bind(...vals, next.id);
  const code = previous ? 200 : 201;
  try {
    const result = await db.batch([
      db
        .prepare("DELETE FROM idempotency WHERE scope=? AND expires_at<=?")
        .bind(scope, epoch()),
      mutation,
      db
        .prepare(
          "INSERT INTO idempotency(scope,fingerprint,response,code,expires_at) SELECT ?,?,?,?,? FROM pages WHERE id=? AND last_operation=?",
        )
        .bind(
          scope,
          fingerprint,
          JSON.stringify(next),
          code,
          epoch() + 86400,
          next.id,
          operation,
        ),
      db
        .prepare(
          "INSERT INTO audit(id,actor,action,resource_id,created_at) SELECT ?,?,?,?,? FROM pages WHERE id=? AND last_operation=?",
        )
        .bind(
          crypto.randomUUID(),
          actor.id,
          previous ? action : "create.page",
          next.id,
          timestamp,
          next.id,
          operation,
        ),
    ]);
    if (!result[1].results.length)
      throw new ApiError(409, "VERSION_CONFLICT", "页面已被修改，请重新读取");
  } catch (error) {
    const r = await replay();
    if (r) return r;
    if (error instanceof ApiError) throw error;
    const message = String(error);
    if (message.includes("CONTENT_PATH_CONFLICT"))
      throw new ApiError(409, "PATH_CONFLICT", "内容路径发生冲突");
    if (message.includes("UNIQUE constraint failed: pages.slug"))
      throw new ApiError(409, "SLUG_EXISTS", "页面路径已存在");
    throw error;
  }
  return { data: next, status: code };
}
