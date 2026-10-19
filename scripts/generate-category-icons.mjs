import * as icons from '@element-plus/icons-vue';
import {writeFileSync} from 'node:fs';
import {createSSRApp} from 'vue';
import {renderToString} from 'vue/server-renderer';
const names=Object.keys(icons).sort();
const svg={};
for(const name of names){
 const markup=await renderToString(createSSRApp(icons[name]));
 const match=markup.match(/^<svg\b[^>]*>([\s\S]*)<\/svg>$/);if(!match)throw Error(`图标不是SVG：${name}`);
 svg[name]=match[1];
}
writeFileSync(new URL('../src/lib/element-icon-names.json',import.meta.url),JSON.stringify(names,null,2)+'\n');
writeFileSync(new URL('../src/lib/element-icon-svg.json',import.meta.url),JSON.stringify(svg,null,2)+'\n');
console.log(`已生成 ${names.length} 个 Element Plus 图标白名单`);
