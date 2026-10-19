import { obj2Str, templateEngine } from "../../ele-pro-form-builder/components/code-util";
import { proTemplate } from "./code-template";
function generateElCode(_data) {
  return "";
}
function generateProCode(data) {
  const config = JSON.parse(
    JSON.stringify({ ...data || {}, fields: data?.fields || [] })
  );
  const templateData = {
    proCrudConfigCode: obj2Str(config, false, 2, () => void 0)
  };
  return templateEngine(proTemplate, templateData);
}
export {
  generateElCode,
  generateProCode
};
