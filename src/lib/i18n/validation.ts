import {ZodError} from 'zod';
import {translator,type Locale} from './index';

const labels:Readonly<Record<string,string>>={title:'标题',slug:'路径',excerpt:'摘要',body:'正文',categoryId:'内容分类',cover:'封面',videoId:'视频ID',featured:'推荐设置',tags:'标签',highlights:'文章亮点',name:'名称',version:'版本号',days:'有效期',scopes:'权限',username:'用户名',password:'密码',currentPassword:'当前密码',newPassword:'新密码',confirmPassword:'确认新密码',youtube:'YouTube链接',telegram:'Telegram链接',bilibili:'哔哩哔哩链接',twitter:'X链接'};

/** Format system validation metadata; never transform submitted values. */
export function validationMessage(issues:readonly ZodError['issues'][number][],locale:Locale):string {
 const t=translator(locale);
 return [...new Set(issues.map(issue=>{
  const field=t(labels[String(issue.path[0])]||String(issue.path[0]||'请求'));
  if(issue.code==='unrecognized_keys')return t('包含不允许提交的字段');
  if(issue.code==='too_small')return t('{0}不能为空或低于最小长度',[field]);
  if(issue.code==='too_big')return t('{0}超过允许长度或范围',[field]);
  if(issue.code==='invalid_type')return t('{0}的数据类型不正确',[field]);
  if(issue.code==='custom')return field+(locale==='en'?': ':'：')+t(issue.message);
  return t('{0}格式不正确',[field]);
 }))].join(locale==='en'?'; ':'；').slice(0,500);
}

export function localizedError(error:unknown,locale:Locale,fallback:string):string {
 return error instanceof ZodError?validationMessage(error.issues,locale):translator(locale)(error instanceof Error?error.message:fallback);
}
