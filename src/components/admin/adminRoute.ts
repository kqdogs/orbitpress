export type View = 'dashboard'|'posts'|'editor'|'pages'|'page-editor'|'media'|'categories'|'settings'|'header'|'footer'|'home'|'permalinks'|'integrations'|'audit';

export const persistentViews: View[] = ['dashboard', 'posts', 'editor', 'pages', 'page-editor', 'media', 'categories', 'settings', 'header', 'footer', 'home', 'permalinks', 'integrations', 'audit'];

export function parseAdminView(search: string): View {
  const value = new URLSearchParams(search).get('view') as View | null;
  return value && persistentViews.includes(value) ? value : 'dashboard';
}

export function parseEditorId(search: string): string {
  const value = new URLSearchParams(search).get('post') || '';
  return /^[a-zA-Z0-9_-]{1,200}$/.test(value) ? value : '';
}

export function parsePageId(search: string): string {
  const value = new URLSearchParams(search).get('page') || '';
  return /^[a-zA-Z0-9_-]{1,200}$/.test(value) ? value : '';
}

export function adminViewUrl(view: View, current = '/admin', postId?: string): string {
  const url = new URL(current, 'http://localhost');
  if (view === 'dashboard') url.searchParams.delete('view');
  else if (persistentViews.includes(view)) url.searchParams.set('view', view);
  else url.searchParams.delete('view');
  url.searchParams.delete('post');
  url.searchParams.delete('page');
  if (view === 'editor' && postId) url.searchParams.set('post', postId);
  if (view === 'page-editor' && postId) url.searchParams.set('page', postId);
  return `${url.pathname}${url.search}${url.hash}`;
}
