import { describe,it,expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { vi } from 'vitest';
vi.mock('../vendor/ele-admin-plus/runtime/ele-qr-code-svg/util',()=>({useSvgOption:()=>({svgProps:{label:'fixture'}})}));
import MainContent from '../vendor/ele-admin-plus/runtime/ele-loading/components/main-content';
describe('内容容器不再注入全屏品牌水印',()=>{
  it('运行组件保留高度/默认插槽，没有SVG、Teleport或水印覆盖层',async()=>{
    const html=await renderToString(createSSRApp({render:()=>h(MainContent,{wrapHeight:480}, {default:()=>h('p','正文')})}));
    expect(html).toContain('height:480px');expect(html).toContain('正文');
    expect(html).not.toMatch(/svg|teleport|ele-loading-show|ELE ADMIN PLUS/i);
  });
  it('源码内容容器移除Teleport，ReceiverView移除水印渲染分支',()=>{
    const source=readFileSync('vendor/ele-admin-plus/ele-loading/components/main-content.vue','utf8');
    expect(source).not.toContain('<Teleport');expect(source).not.toContain('<LoadingSpinner');
    for(const file of ['vendor/ele-admin-plus/ele-config-provider/components/receiver-view.tsx','vendor/ele-admin-plus/runtime/ele-config-provider/components/receiver-view.js']) expect(readFileSync(file,'utf8')).not.toMatch(/EleWatermark|showLayoutWatermark|svgRender/);
  });
});
