import { ApiError } from "./http";
import { siteSettings } from "./repository";
import type { Settings } from "./schema";
import { permalinkTemplate } from "./permalinks";
export async function assertContentSlug(
  db: D1Database,
  slug: string,
  kind: "posts" | "pages",
) {
  const other = kind === "posts" ? "pages" : "posts";
  if (
    await db
      .prepare(`SELECT id FROM ${other} WHERE slug=? LIMIT 1`)
      .bind(slug)
      .first()
  )
    throw new ApiError(
      409,
      "PATH_CONFLICT",
      "此路径已被其他内容使用（包括回收站）",
    );
  const { value } = await siteSettings(db);
  if (value.adminPath === `/${slug}`)
    throw new ApiError(409, "PATH_CONFLICT", "此路径已被后台使用");
}
export async function assertAdminPath(db: D1Database, settings: Settings) {
  const slug = settings.adminPath.slice(1);
  const occupied = await db
    .prepare(
      "SELECT id FROM posts WHERE slug=? UNION ALL SELECT id FROM pages WHERE slug=? LIMIT 1",
    )
    .bind(slug, slug)
    .first();
  if (occupied)
    throw new ApiError(409, "PATH_CONFLICT", "后台路径与已有内容冲突");
  for (const format of settings.permalinkFormats) {
    const prefix = permalinkTemplate(settings, format).split("/")[1];
    if (prefix === slug)
      throw new ApiError(409, "PATH_CONFLICT", "后台路径与文章链接前缀冲突");
  }
}
