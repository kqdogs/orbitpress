// AI Agent sends already-written Markdown here; no model provider is called.
import { randomUUID } from 'node:crypto';
const base=process.env.BLOG_URL||'http://127.0.0.1:4321';
const token=process.env.BLOG_API_KEY;
if(!token)throw new Error('请通过 BLOG_API_KEY 环境变量提供后台创建的密钥，不要把密钥写进代码。');
const headers={'Authorization':`Bearer ${token}`,'Content-Type':'application/json'};
async function send(path,body,key){const response=await fetch(`${base}/api/v1${path}`,{method:'POST',headers:{...headers,'Idempotency-Key':key},body:JSON.stringify(body)});const result=await response.json();if(!response.ok)throw new Error(`${response.status}: ${result.error?.message}`);return result.data;}
const post=await send('/posts',{title:'AI 内容接入示例',slug:`ai-example-${Date.now()}`,excerpt:'外部 Agent 通过内容 API 创建的草稿。',body:'## AI 写入的内容\n\n这是可供人工审核的草稿。',categoryId:'ai-tools',cover:'',videoId:'',featured:false,tags:['AI'],highlights:['人工审核后发布']},randomUUID());
console.log(`草稿已创建：${post.id}，version=${post.version}`);
// Explicit opt-in for publication; the key must also have content:publish.
if(process.argv.includes('--publish')){await send(`/posts/${post.id}/publish`,{version:post.version},randomUUID());console.log('已发布。');}
