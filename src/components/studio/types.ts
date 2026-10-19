import type { Category, Page, Post, Settings } from "../../lib/schema";
export type Session = { csrf: string; username: string };
export type Media = {
  id: string;
  name: string;
  mime: string;
  size: number;
  createdAt: string;
};
export type ApiKey = {
  id: string;
  name: string;
  scopes: string;
  createdAt: string;
  expiresAt: number;
  revokedAt: string | null;
  canReveal: boolean;
};
export type Audit = {
  id: string;
  actor: string;
  action: string;
  resourceId: string;
  createdAt: string;
};
export type SettingRecord = { value: Settings; version: number };
export type StudioData = {
  posts: Post[];
  pages: Page[];
  cats: Category[];
  media: Media[];
  keys: ApiKey[];
  audit: Audit[];
  settings: SettingRecord | null;
  nextCursor: string | null;
};
