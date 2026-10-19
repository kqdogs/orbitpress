import { omit, eachTree, mapTree, pick } from "../../utils/common";
import { isContainerType, getFormInitValue } from "../../ele-pro-form/util";
import { getComponentRefName, getItemTypeData, getRuleMessage } from "../../ele-pro-form/components/render-util";
import { computeContentExtraCol } from "../../ele-pro-form/components/render-core";
import { getComponentItemByType, deepCloneObject } from "./build-core";
import { transformJsVar, JsVar } from "./code-js-var";
import { obj2Str, templateEngine, generatePropsCode, addIndentChar, kebabCase } from "./code-util";
import { footerTemplate, contentTemplate, formTemplate, proTemplate } from "./code-template";
const uploadTypes = ["imageUpload", "fileUpload"];
function isArrayOptions(item, options) {
  const optionData = (options ?? item?.props?.options) || [];
  const jsVar = transformJsVar(optionData);
  if (jsVar != null) {
    return jsVar.dataType === "array";
  }
  return Array.isArray(optionData);
}
function generateFooterCode(config, showFooterExpand) {
  if (!config.footer) {
    return "";
  }
  const style = { flex: 1, display: "flex", alignItems: "center" };
  const code = obj2Str({ ...style, ...config.footerStyle || {} }, true);
  return templateEngine(footerTemplate, {
    footerStyleCode: code,
    footerPropsCode: generatePropsCode(config.footerProps),
    showFooterExpand,
    submitText: config.submitText,
    resetText: config.resetText,
    searchExpandText: config.searchExpandText,
    searchShrinkText: config.searchShrinkText
  });
}
function generateFormItemProps(item, indentSize, indentChar) {
  const { vIf, label, prop, itemProps } = item;
  const labelWidth = itemProps?.labelWidth;
  const props = {
    label,
    prop,
    ...itemProps || {},
    labelWidth: typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth,
    vIf
  };
  const code = generatePropsCode(props, null, indentSize);
  return addIndentChar(code, indentChar);
}
function generateColProps(item, grid, indentSize, indentChar) {
  const gridCol = grid === true ? { span: 12 } : grid || {};
  const { vIf, colProps } = item || {};
  const props = { ...gridCol, ...colProps || {}, vIf };
  const code = generatePropsCode(props, null, indentSize);
  return addIndentChar(code, indentChar);
}
function generateComponentProps(item, indentSize, indentChar, omitKeys) {
  const props = omit(item.props || {}, [
    ...omitKeys || [],
    ...item.type && ["div", "tableCell"].includes(item.type) ? ["is", "innerHTML"] : []
  ]);
  const code = generatePropsCode(props, null, indentSize);
  return addIndentChar(code, indentChar);
}
function getItemComponentTag(item, componentData) {
  if (item.type === "tableCell") {
    if (item.props?.is === "th") {
      return "th";
    }
  } else if (item.type === "autocomplete") {
    const fetchSuggestions = item.props?.fetchSuggestions ?? [];
    if (isArrayOptions(item, fetchSuggestions)) {
      return "el-autocomplete";
    }
  } else if (item.type === "mention") {
    const options = item.props?.options ?? [];
    if (isArrayOptions(item, options)) {
      return "el-mention";
    }
  } else if (item.type === "transfer") {
    const data = item.props?.data ?? [];
    if (isArrayOptions(item, data)) {
      return "el-transfer";
    }
  } else if (item.type === "treeSelect" || item.type === "treeMultipleSelect") {
    const data = item.props?.data ?? [];
    if (isArrayOptions(item, data)) {
      return "el-tree-select";
    }
  } else if (item.type === "cascader" || item.type === "multipleCascader") {
    const options = item.props?.options ?? [];
    if (isArrayOptions(item, options)) {
      return "el-cascader";
    }
  }
  const name = getComponentItemByType(item.type, componentData)?.componentName;
  return kebabCase(name || "div");
}
function generateItemComponentCode(item, indentSize, indentChar, content, componentData) {
  const component = getItemComponentTag(item, componentData);
  const propsCode = generatePropsCode(item.props, null, indentSize);
  const code = addIndentChar(propsCode, indentChar);
  if (content == null) {
    return `<${component}${code}/>`;
  }
  if (content === "") {
    return `<${component}${code}>
${indentChar}</${component}>`;
  }
  return `<${component}${code}>
${indentChar}  ${content}
${indentChar}</${component}>`;
}
function getDivTag(item) {
  const divTag = item.props?.is;
  const jsVar = transformJsVar(divTag);
  if (jsVar != null) {
    return jsVar.name;
  }
  return divTag || "div";
}
function generateContentCode(config, showFooterExpand, componentData, itemTypeData) {
  let contentCode = templateEngine(contentTemplate, {
    items: config.items,
    grid: config.grid,
    rowProps: config.rowProps,
    indentSize: 4,
    contentExtra: generateFooterCode(config, showFooterExpand),
    contentExtraColProps: {
      ...config.autoFooterCol ? computeContentExtraCol(
        config.grid === true ? { span: 12 } : config.grid || {},
        (config.items || []).filter((d) => d.vIf == null).length
      ) : { span: 24 },
      ...config.footerColProps || {}
    },
    generateFormItemProps,
    generateColProps,
    generateComponentProps,
    generateComponentCode: (item, indentSize, indentChar, content) => generateItemComponentCode(
      item,
      indentSize,
      indentChar,
      content,
      componentData
    ),
    getDivTag,
    getComponentTag: (item) => getItemComponentTag(item, componentData),
    isContainerType: (item) => isContainerType(item, itemTypeData),
    addIndentChar,
    generatePropsCode,
    isArrayOptions
  });
  [
    "img",
    "input",
    "hr",
    "br",
    "col",
    "area",
    "embed",
    "source",
    "track",
    "wbr"
  ].forEach((tagName) => {
    contentCode = contentCode.replace(
      new RegExp(`>\\s*</${tagName}>`, "g"),
      "/>"
    );
  });
  return contentCode;
}
function getUploadValidatorCode(item) {
  const refName = getComponentRefName(item);
  return `(_rule, value, callback) => {
  const compRef = getProFormRefs()['${refName}'];
  if (compRef && compRef.isDone && !compRef.isDone()) {
    return callback(new Error('${item.label}还未上传完毕'));
  }
  callback();
}`;
}
function generateRuleCode(items, componentData, itemTypeData, requiredLang) {
  const rules = {};
  eachTree(items, (item) => {
    if (isContainerType(item, itemTypeData)) {
      return;
    }
    const itemRules = [];
    const typeData = getItemTypeData(item, itemTypeData);
    if (item.required) {
      const config = getComponentItemByType(item.type, componentData);
      const componentPropsData = {
        ...config?.defaultProps || {},
        ...item.props || {},
        ...config?.reservedProps || {}
      };
      itemRules.push({
        required: true,
        message: getRuleMessage(
          item.label,
          item.requiredMessage,
          componentPropsData.placeholder,
          requiredLang
        ),
        trigger: typeData?.requiredTrigger ?? "change"
      });
    }
    if (item.type && uploadTypes.includes(item.type)) {
      itemRules.push({
        trigger: typeData?.requiredTrigger ?? "change",
        validator: new JsVar({ name: getUploadValidatorCode(item) })
      });
    }
    if (itemRules.length && item.prop) {
      rules[item.prop] = itemRules;
    }
  });
  return obj2Str(rules, false, 2);
}
function getComponentProps(item, componentData, itemTypeData) {
  const typeData = getComponentItemByType(item.type, componentData);
  const props = {
    ...typeData?.defaultProps || {},
    ...item.props || {},
    ...typeData?.reservedProps || {}
  };
  const refName = getComponentRefName(item);
  props.ref = new JsVar({ name: refName });
  if (item.type && isContainerType(item, itemTypeData)) {
    props.vIf = item.vIf;
    if (item.type === "steps") {
      if (props.active == null) {
        props.active = new JsVar({
          name: `form.${item.prop} ?? 0`
        });
      }
    } else if (item.type === "tabs") {
      props.vModel = `form.${item.prop}`;
      props.modelValue = void 0;
      props.items = (item.children || []).map((c) => ({
        name: c.props?.name ?? c.prop,
        label: c.props?.label ?? c.label,
        disabled: c.props?.disabled,
        closable: c.props?.closable,
        lazy: c.props?.lazy
      }));
    } else if (["collapseItem", "carouselItem"].includes(item.type)) {
      if (props.name == null && item.prop != null) {
        props.name = item.prop;
      }
    } else if (item.type === "collapse") {
      if (props.modelValue == null) {
        props.vModel = `form.${item.prop}`;
        props.modelValue = void 0;
      }
    }
  } else if (item.type && item.type !== "text") {
    props.vModel = `form.${item.prop}`;
  }
  const keyName = String(item.key ?? item.prop);
  const labelName = String(item.label || item.prop);
  if (item.type === "cascader" || item.type === "multipleCascader") {
    props.options = new JsVar({
      name: `${keyName}CascaderOptions`,
      code: `/** ${labelName}级联数据 */
const ${keyName}CascaderOptions = ref(${obj2Str(props.options || [], false, 0)});`,
      dataType: Array.isArray(props.options || []) ? "array" : void 0
    });
    const temp = props.props || {};
    if (item.type === "multipleCascader") {
      temp.multiple = true;
    }
    props.props = new JsVar({
      name: `${keyName}CascaderProps`,
      code: `/** ${labelName}级联配置 */
const ${keyName}CascaderProps = reactive(${obj2Str(temp, false, 0)});`
    });
  } else if (item.type === "tableSelect" || item.type === "tableMultipleSelect") {
    props.tableProps = new JsVar({
      name: `${keyName}TableProps`,
      code: `/** ${labelName}表格配置 */
const ${keyName}TableProps = reactive(${obj2Str(props.tableProps || {}, false, 0)});`
    });
  } else if (item.type === "checkCard" || item.type === "multipleCheckCard" || item.type === "steps") {
    props.items = new JsVar({
      name: `${keyName}Items`,
      code: `/** ${labelName}数据 */
const ${keyName}Items = ref(${obj2Str(props.items || [], false, 0)});`
    });
  } else if (item.type === "virtualTreeSelect" || item.type === "virtualTreeMultipleSelect") {
    props.treeProps = new JsVar({
      name: `${keyName}TreeProps`,
      code: `/** ${labelName}树配置 */
const ${keyName}TreeProps = ref(${obj2Str(props.treeProps || {}, false, 0)});`
    });
  } else if (item.type === "transfer" || item.type === "treeSelect" || item.type === "treeMultipleSelect") {
    props.data = new JsVar({
      name: `${keyName}Data`,
      code: `/** ${labelName}数据 */
const ${keyName}Data = ref(${obj2Str(props.data || [], false, 0)});`,
      dataType: Array.isArray(props.data || []) ? "array" : void 0
    });
  } else if (item.type === "select" || item.type === "multipleSelect" || item.type === "radio" || item.type === "radioButton" || item.type === "checkbox" || item.type === "checkboxButton") {
    const options = props.options || [];
    if (!Array.isArray(options)) {
      props.options = new JsVar({
        name: `${keyName}Options`,
        code: `/** ${labelName}选项数据 */
const ${keyName}Options = ref(${obj2Str(options, false, 0)});`
      });
    }
  } else if (item.type === "mention") {
    props.options = new JsVar({
      name: `${keyName}Options`,
      code: `/** ${labelName}选项数据 */
const ${keyName}Options = ref(${obj2Str(props.options || [], false, 0)});`,
      dataType: Array.isArray(props.options || []) ? "array" : void 0
    });
  } else if (item.type === "autocomplete") {
    props.fetchSuggestions = new JsVar({
      name: `${keyName}FetchSuggestions`,
      code: `/** ${labelName}建议数据 */
const ${keyName}FetchSuggestions = ref(${obj2Str(props.fetchSuggestions || [], false, 0)});`,
      dataType: Array.isArray(props.fetchSuggestions || []) ? "array" : void 0
    });
  }
  return props;
}
function getImportAndVarCode(config, componentData) {
  const imports = /* @__PURE__ */ new Set([]);
  const codes = /* @__PURE__ */ new Set([]);
  eachTree(config.items, (item) => {
    const componentImport = getComponentItemByType(
      item.type,
      componentData
    )?.componentImport;
    if (componentImport) {
      imports.add(componentImport);
    }
  });
  if (config.showSearchExpand) {
    imports.add(`import { ArrowUp } from '@/components/icons';`);
    imports.add(`import { ArrowDown } from '@/components/icons';`);
  }
  const proImports = /* @__PURE__ */ new Set([]);
  const proCodes = /* @__PURE__ */ new Set([]);
  JSON.stringify(config, (_jk, jv) => {
    const jsVar = transformJsVar(jv);
    if (jsVar != null) {
      if (jsVar.imports) {
        jsVar.imports.forEach((code) => {
          imports.add(code);
        });
      }
      if (jsVar.code) {
        codes.add(jsVar.code);
      }
      if (jsVar.proImports) {
        jsVar.proImports.forEach((code) => {
          proImports.add(code);
        });
      }
      if (jsVar.proCode) {
        proCodes.add(jsVar.proCode);
      }
    }
    return jv;
  });
  return {
    imports: [
      `import { ref, reactive, nextTick, getCurrentInstance } from 'vue';`,
      `import { useFormData } from '@/utils/use-form-data';`,
      `import httpRequest from '@/utils/request';`,
      ...imports
    ],
    codes: [...codes],
    proImports: [
      `import { ref } from 'vue';`,
      `import { useFormData } from '@/utils/use-form-data';`,
      `import { getFormInitValue } from '@/components/ProForm/util';`,
      `import ProForm from '@/components/ProForm/index.vue';`,
      ...proImports
    ],
    proCodes: [...proCodes]
  };
}
function getElNormalizeItems(formItems, componentData, itemTypeData) {
  const items = mapTree(formItems, (item) => {
    return {
      ...item,
      props: getComponentProps(item, componentData, itemTypeData),
      initValue: void 0
    };
  });
  return deepCloneObject(items, true);
}
function generateElFormCode(data, componentData, itemTypeData, requiredLang) {
  const config = deepCloneObject({
    ...data || {},
    items: data?.items || []
  });
  const formInitValue = getFormInitValue(config.items, itemTypeData);
  config.items = getElNormalizeItems(config.items, componentData, itemTypeData);
  const elFormProps = pick(config, [
    "labelPosition",
    "requireAsteriskPosition",
    "labelWidth",
    "labelSuffix",
    "inline",
    "inlineMessage",
    "statusIcon",
    "showMessage",
    "validateOnRuleChange",
    "hideRequiredAsterisk",
    "scrollToError",
    "scrollIntoViewOptions",
    "size",
    "disabled",
    "style",
    "class"
  ]);
  const sfe = config.showSearchExpand;
  const formContentCode = generateContentCode(
    config,
    sfe,
    componentData,
    itemTypeData
  );
  const { imports, codes } = getImportAndVarCode(config, componentData);
  codes.push(`/** 获取组件引用 */
const currentInstance = getCurrentInstance();
const getProFormRefs = () => {
  return currentInstance.ctx.$refs;
};`);
  const templateData = {
    modelCode: obj2Str(formInitValue, false, 2),
    formContentCode,
    formPropsCode: generatePropsCode(elFormProps, false, 4, false),
    formRuleCode: generateRuleCode(
      config.items,
      componentData,
      itemTypeData,
      requiredLang
    ),
    formImportCode: imports.join("\n  "),
    formVarCode: addIndentChar(codes.join("\n\n"), "  "),
    showFooterExpand: sfe
  };
  return templateEngine(formTemplate, templateData);
}
function generateProFormCode(data, componentData) {
  const config = deepCloneObject({
    ...data || {},
    items: data?.items || []
  });
  const sfe = config.showSearchExpand;
  const { proImports, proCodes } = getImportAndVarCode(config, componentData);
  const templateData = {
    proFormConfigCode: obj2Str(config, false, 2, () => void 0),
    proFormImportCode: proImports.join("\n  "),
    proFormVarCode: addIndentChar(proCodes.join("\n\n"), "  "),
    showFooterExpand: sfe
  };
  return templateEngine(proTemplate, templateData);
}
export {
  generateColProps,
  generateComponentProps,
  generateContentCode,
  generateElFormCode,
  generateFooterCode,
  generateFormItemProps,
  generateItemComponentCode,
  generateProFormCode,
  generateRuleCode,
  getComponentProps,
  getDivTag,
  getElNormalizeItems,
  getImportAndVarCode,
  getItemComponentTag,
  getUploadValidatorCode,
  isArrayOptions
};
