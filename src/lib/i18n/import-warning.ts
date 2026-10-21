import {translate,type Locale} from './index';

/** Recognize only the importer-owned template; image alt text stays literal. */
export function importWarning(message:string,locale:Locale):string {
 const image=/^“([\s\S]*)”未下载到本站（来源限制、大小或格式），请重试或手动上传。$/.exec(message);
 return image?translate(locale,'“{0}”未下载到本站（来源限制、大小或格式），请重试或手动上传。',[image[1]]):translate(locale,message);
}
