import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import { siteSettings, toPost, listPages } from "../lib/repository";
import { postPath } from "../lib/permalinks";
export const GET: APIRoute = async ({ url }) => {
  const { value: settings } = await siteSettings(env.DB);
  const posts = await env.DB.prepare(
    "SELECT p.*,c.slug category_slug FROM posts p LEFT JOIN categories c ON c.id=p.category_id WHERE p.status='published' ORDER BY p.id LIMIT 10000",
  ).all<Record<string, unknown>>();
  const pages = await listPages(env.DB, { limit: 10000 });
  const paths = [
    "/",
    "/videos/",
    "/tutorials/",
    "/about/",
    ...posts.results.map((row) => postPath(toPost(row), settings)),
    ...pages.map((page) => `/${page.slug}/`),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${new URL(path, url.origin).href.replaceAll("&", "&amp;")}</loc></url>`).join("")}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
};
