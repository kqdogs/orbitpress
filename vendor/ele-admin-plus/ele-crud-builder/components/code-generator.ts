import type { EleCrudProps } from '../../ele-app/plusx';
import {
  templateEngine,
  obj2Str
} from '../../ele-pro-form-builder/components/code-util';
import { proTemplate } from './code-template';

/**
 * 生成代码
 * @param data 配置数据
 */
export function generateElCode(_data?: EleCrudProps) {
  return '';
}

/**
 * 生成 ProCrud 代码
 * @param data 配置数据
 */
export function generateProCode(data?: EleCrudProps) {
  const config: EleCrudProps = JSON.parse(
    JSON.stringify({ ...(data || {}), fields: data?.fields || [] })
  );
  const templateData = {
    proCrudConfigCode: obj2Str(config, false, 2, () => void 0)
  };
  return templateEngine(proTemplate, templateData);
}
