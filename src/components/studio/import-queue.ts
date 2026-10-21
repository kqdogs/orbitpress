import {t} from '../../lib/i18n/client';
import type {PostInput} from '../../lib/schema';
import type {ImportedArticle} from '../../lib/import-contract';
export type ImportRow={url:string;title:string;status:'pending'|'importing'|'saving'|'success'|'error';error:string;warnings:string[];postId?:string;payload?:PostInput;key:string};
type Dependencies={collect:(url:string,signal:AbortSignal)=>Promise<ImportedArticle>;save:(input:PostInput,key:string,signal:AbortSignal)=>Promise<{id:string}>;wait:(ms:number,signal:AbortSignal)=>Promise<void>;now?:()=>number;interval?:number};
/** Retain exact payload/key to safely retry ambiguous save results. */
export async function runImportQueue(rows:ImportRow[],categoryId:string,signal:AbortSignal,deps:Dependencies){
 const now=deps.now||Date.now;let lastStart:number|undefined;
 for(const row of rows){
  if(signal.aborted)break;if(row.status==='success')continue;
  row.error='';
  try{
   if(!row.payload){
    if(lastStart!==undefined)await deps.wait(Math.max(0,(deps.interval??5100)-(now()-lastStart)),signal);
    if(signal.aborted)break;lastStart=now();row.status='importing';
    const result=await deps.collect(row.url,signal);if(signal.aborted){row.status='pending';break;}
    row.payload={...result.article,categoryId};row.warnings=result.warnings;
   }
   row.status='saving';const result=await deps.save(row.payload,row.key,signal);
   row.postId=result.id;row.status='success';
  }catch(error){
   row.status='error';row.error=signal.aborted?(row.payload?t("已停止；保存结果待确认，重试会沿用幂等键"):t("已停止，可重试")):error instanceof Error?error.message:t("采集失败");
   if(signal.aborted)break;
  }
 }
}
export function waitForImport(ms:number,signal:AbortSignal){
 return new Promise<void>((resolve,reject)=>{
  if(signal.aborted){reject(new DOMException('Aborted','AbortError'));return;}
  const abort=()=>{clearTimeout(timer);signal.removeEventListener('abort',abort);reject(new DOMException('Aborted','AbortError'));};
  const timer=setTimeout(()=>{signal.removeEventListener('abort',abort);resolve();},ms);
  signal.addEventListener('abort',abort,{once:true});
 });
}
