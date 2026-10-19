import { samplePosts } from './sample-posts.mjs';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const categoryRows=[['virtual-cards','虚拟卡','跨境支付、订阅服务与日常消费','card'],['banking','银行账户','开启多币种账户，连接全球金融','bank'],['brokerage','券商证券','海外券商与投资工具指南','chart'],['ai-tools','AI工具','发现好用的 AI 产品与工作流','sparkles'],['esim-phones','eSIM手机号','海外手机号申请与长期保号','phone'],['esim-adapters','eSIM卡托','让普通手机也能使用 eSIM','sim'],['apple-us-id','玩转Apple美区ID','账号注册、应用与订阅','apple'],['cryptocurrency','数字资产入门','基础知识与操作指南','globe']];
const sqlString=v=>`'${String(v).replaceAll("'","''")}'`;
const statements=categoryRows.map(([id,name,description,icon])=>`INSERT OR IGNORE INTO categories(id,name,slug,description,icon) VALUES(${[id,name,id,description,icon].map(sqlString).join(',')});`);
for(const [slug,title,category,excerpt,image,video,date,featured] of samplePosts){
 const body=`> 本文为本地功能演示内容，标题和封面用于视觉比对。正文不构成实际申请指南，请在后台替换为你审核后的正式内容。\n\n## 开始之前\n\n欢迎阅读 **${title}**。这里展示图文教程的排版、目录与内容管理能力。你可以在后台编辑本文，保存草稿后预览，确认内容无误再发布。\n\n## 准备资料\n\n- 先确认自己的实际需求。\n- 阅读产品官方说明，核对适用地区和最新条件。\n- 准备所需资料，妥善保管个人信息。\n\n## 操作步骤\n\n### 第一步：了解流程\n\n建议先通读完整教程，确认每一步的用途。此处可添加截图、提示和操作说明。\n\n### 第二步：完成设置\n\n按自己的实际情况填写信息。在提交之前再次核对，遇到疑问时使用产品官方帮助中心。\n\n## 常见问题\n\n| 问题 | 说明 |\n| --- | --- |\n| 能否保存草稿？ | 支持，只有发布后的内容出现在前台。 |\n| AI 如何接入？ | 在后台创建密钥，通过内容 API 写入草稿。 |\n\n## 最后检查\n\n内容、链接与图片确认无误后，即可在后台点击发布。已发布文章也可以随时下架回到草稿。`;
 const values=[`demo-${slug}`,title,slug,excerpt,body,category,`/images/${image}`,video,featured?1:0,JSON.stringify([category,'演示内容']),'published',`${date}T08:00:00.000Z`,`${date}T08:00:00.000Z`,`${date}T08:00:00.000Z`,'seed',1,`seed-${slug}`];
 statements.push(`INSERT OR IGNORE INTO posts(id,title,slug,excerpt,body,category_id,cover,video_id,featured,tags,status,published_at,created_at,updated_at,updated_by,version,last_operation) VALUES(${values.map(v=>typeof v==='number'?v:sqlString(v)).join(',')});`);
}
mkdirSync('.wrangler',{recursive:true});const file='.wrangler/seed.sql';writeFileSync(file,statements.join('\n'));
try{execFileSync(process.execPath,['node_modules/wrangler/bin/wrangler.js','d1','execute','blog-db','--local','--file',file],{stdio:'inherit'});}finally{rmSync(file,{force:true});}
