import { codeStringPrefix } from "../../ele-pro-form/components/render-core";
class JsVar {
  /** 生成代码时显示的变量名称 */
  name;
  /** 生成 ElForm 代码时添加的声明代码 */
  code;
  /** 生成 ProForm 代码时添加的声明代码 */
  proCode;
  /** 生成 ElForm 代码时添加的导入代码 */
  imports;
  /** 生成 ProForm 代码时添加的导入代码 */
  proImports;
  /** 原始数据类型 */
  dataType;
  /** 转 JSON 时标识是 JsVar 对象 */
  __isJsVar = true;
  constructor(props) {
    this.name = props.name;
    this.code = props.code;
    this.proCode = props.proCode;
    this.imports = props.imports;
    this.proImports = props.proImports;
    this.dataType = props.dataType;
  }
}
function removePrefixStr(content, prefix) {
  if (typeof prefix === "string") {
    if (content.startsWith(prefix)) {
      return content.slice(prefix.length);
    }
    return content;
  }
  let result = content;
  prefix.forEach((temp) => {
    result = removePrefixStr(result, temp);
  });
  return result;
}
function transformJsVar(jv) {
  if (jv != null) {
    if (typeof jv === "string") {
      if (jv.startsWith(codeStringPrefix)) {
        const codeName = removePrefixStr(jv, [codeStringPrefix]);
        return new JsVar({ name: codeName });
      }
    }
    if (typeof jv === "object") {
      if (jv instanceof JsVar) {
        return jv;
      }
      if (jv.__isJsVar === true && jv.name != null) {
        return new JsVar(jv);
      }
    }
  }
}
export {
  JsVar,
  removePrefixStr,
  transformJsVar
};
