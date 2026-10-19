import { describe, expect, it } from 'vitest';
import { renderMarkdown } from '../src/lib/markdown';

describe('Markdown 视频嵌入', () => {
  it('支持多个 YouTube 与哔哩哔哩视频并过滤伪造地址', () => {
    const result = renderMarkdown(':::youtube dQw4w9WgXcQ\n\n:::bilibili BV1xx411c7mD\n\n:::youtube invalid-id');
    expect(result.html).toContain('youtube.com/embed/dQw4w9WgXcQ?playsinline=1');
    expect(result.html).toContain('player.bilibili.com/player.html?bvid=BV1xx411c7mD&amp;page=1');
    expect(result.html).not.toMatch(/youtube(?:-nocookie)?\.com\/embed\/invalid-id/);
  });
});
