import type { EleProFormProps } from '../../ele-app/plusx';
import { eachTree, mapTree, pick, omit } from '../../utils/common';
import type {
  ProFormItemProps,
  ProFormItemTypeData
} from '../../ele-pro-form/types';
import { getFormInitValue, isContainerType } from '../../ele-pro-form/util';
import {
  getItemTypeData,
  getRuleMessage,
  getComponentRefName
} from '../../ele-pro-form/components/render-util';
import { computeContentExtraCol } from '../../ele-pro-form/components/render-core';
import type { ComponentGroup } from '../types';
import { getComponentItemByType, deepCloneObject } from './build-core';
import { JsVar, transformJsVar } from './code-js-var';
import {
  templateEngine,
  obj2Str,
  kebabCase,
  addIndentChar,
  generatePropsCode
} from './code-util';
import {
  proTemplate,
  formTemplate,
  contentTemplate,
  footerTemplate
} from './code-template';
const uploadTypes = ['imageUpload', 'fileUpload'];

/**
 * 判断选项数据是否是数组类型
 * @param item 表单项
 * @param options 选项数据
 */
export function isArrayOptions(item?: ProFormItemProps, options?: any) {
  const optionData = (options ?? item?.props?.options) || [];
  const jsVar = transformJsVar(optionData);
  if (jsVar != null) {
    return jsVar.dataType === 'array';
  }
  return Array.isArray(optionData);
}

/**
 * 生成 ElForm 底栏代码
 * @param config 表单配置数据
 * @param showFooterExpand 是否需要展开收起按钮
 */
export function generateFooterCode(
  config: EleProFormProps,
  showFooterExpand?: boolean
) {
  if (!config.footer) {
    return '';
  }
  const style = { flex: 1, display: 'flex', alignItems: 'center' };
  const code = obj2Str({ ...style, ...(config.footerStyle || {}) }, true);
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

/**
 * 生成 ElFormItem 所有属性代码
 * @param item 表单项
 * @param indentSize 属性换行的缩进空格数量
 * @param indentChar 上层代码缩进
 */
export function generateFormItemProps(
  item: ProFormItemProps,
  indentSize?: number,
  indentChar?: string
) {
  const { vIf, label, prop, itemProps } = item;
  const labelWidth = itemProps?.labelWidth;
  const props = {
    label,
    prop,
    ...(itemProps || {}),
    labelWidth: typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth,
    vIf
  };
  const code = generatePropsCode(props, null, indentSize);
  return addIndentChar(code, indentChar);
}

/**
 * 生成 ElCol 所有属性代码
 * @param item 表单项
 * @param grid 父级的 grid 属性
 * @param indentSize 属性换行的缩进空格数量
 * @param indentChar 上层代码缩进
 */
export function generateColProps(
  item?: ProFormItemProps,
  grid?: Record<string, any> | boolean,
  indentSize?: number,
  indentChar?: string
) {
  const gridCol = grid === true ? { span: 12 } : grid || {};
  const { vIf, colProps } = item || {};
  const props = { ...gridCol, ...(colProps || {}), vIf };
  const code = generatePropsCode(props, null, indentSize);
  return addIndentChar(code, indentChar);
}

/**
 * 生成容器组件和非单标签组件的所有属性代码
 * @param item 表单项
 * @param indentSize 属性换行的缩进空格数量
 * @param indentChar 上层代码缩进
 * @param omitKeys 排除的属性名
 */
export function generateComponentProps(
  item: ProFormItemProps,
  indentSize?: number,
  indentChar?: string,
  omitKeys?: string[]
) {
  const props = omit(item.props || {}, [
    ...(omitKeys || []),
    ...(item.type && ['div', 'tableCell'].includes(item.type)
      ? ['is', 'innerHTML']
      : [])
  ]);
  const code = generatePropsCode(props, null, indentSize);
  return addIndentChar(code, indentChar);
}

/**
 * 生成 ElForm 代码时获取组件使用的组件名称
 * @param item 表单项
 * @param componentData 组件库数据
 */
export function getItemComponentTag(
  item: ProFormItemProps,
  componentData?: ComponentGroup[]
) {
  if (item.type === 'tableCell') {
    if (item.props?.is === 'th') {
      return 'th';
    }
  } else if (item.type === 'autocomplete') {
    const fetchSuggestions = item.props?.fetchSuggestions ?? [];
    if (isArrayOptions(item, fetchSuggestions)) {
      return 'el-autocomplete';
    }
  } else if (item.type === 'mention') {
    const options = item.props?.options ?? [];
    if (isArrayOptions(item, options)) {
      return 'el-mention';
    }
  } else if (item.type === 'transfer') {
    const data = item.props?.data ?? [];
    if (isArrayOptions(item, data)) {
      return 'el-transfer';
    }
  } else if (item.type === 'treeSelect' || item.type === 'treeMultipleSelect') {
    const data = item.props?.data ?? [];
    if (isArrayOptions(item, data)) {
      return 'el-tree-select';
    }
  } else if (item.type === 'cascader' || item.type === 'multipleCascader') {
    const options = item.props?.options ?? [];
    if (isArrayOptions(item, options)) {
      return 'el-cascader';
    }
  }
  const name = getComponentItemByType(item.type, componentData)?.componentName;
  return kebabCase(name || 'div');
}

/**
 * 生成展示型组件和单标签组件的完整代码
 * @param item 表单项
 * @param indentSize 属性换行的缩进空格数量
 * @param indentChar 上层代码缩进
 * @param content 展示型组件的文本内容
 * @param componentData 组件库数据
 */
export function generateItemComponentCode(
  item: ProFormItemProps,
  indentSize: number | undefined,
  indentChar: string | undefined,
  content: string | undefined,
  componentData?: ComponentGroup[]
) {
  const component = getItemComponentTag(item, componentData);
  const propsCode = generatePropsCode(item.props, null, indentSize);
  const code = addIndentChar(propsCode, indentChar);
  if (content == null) {
    return `<${component}${code}/>`;
  }
  if (content === '') {
    return `<${component}${code}>\n${indentChar}</${component}>`;
  }
  return `<${component}${code}>\n${indentChar}  ${content}\n${indentChar}</${component}>`;
}

/**
 * 生成 ElForm 代码时获取 div 容器使用的组件名称
 * @param item 表单项
 */
export function getDivTag(item: ProFormItemProps) {
  const divTag = item.props?.is;
  const jsVar = transformJsVar(divTag);
  if (jsVar != null) {
    return jsVar.name;
  }
  return divTag || 'div';
}

/**
 * 生成 ElForm 内容代码
 * @param config 表单配置数据
 * @param showFooterExpand 是否需要展开收起按钮
 * @param componentData 组件库数据
 * @param itemTypeData 高级表单组件类型数据
 */
export function generateContentCode(
  config: EleProFormProps,
  showFooterExpand: boolean | undefined,
  componentData?: ComponentGroup[],
  itemTypeData?: ProFormItemTypeData[]
) {
  let contentCode = templateEngine(contentTemplate, {
    items: config.items,
    grid: config.grid,
    rowProps: config.rowProps,
    indentSize: 4,
    contentExtra: generateFooterCode(config, showFooterExpand),
    contentExtraColProps: {
      ...(config.autoFooterCol
        ? computeContentExtraCol(
            config.grid === true ? { span: 12 } : config.grid || {},
            (config.items || []).filter((d) => d.vIf == null).length
          )
        : { span: 24 }),
      ...(config.footerColProps || {})
    },
    generateFormItemProps,
    generateColProps,
    generateComponentProps,
    generateComponentCode: (
      item: ProFormItemProps,
      indentSize: number | undefined,
      indentChar: string | undefined,
      content: string | undefined
    ) =>
      generateItemComponentCode(
        item,
        indentSize,
        indentChar,
        content,
        componentData
      ),
    getDivTag,
    getComponentTag: (item: ProFormItemProps) =>
      getItemComponentTag(item, componentData),
    isContainerType: (item: ProFormItemProps) =>
      isContainerType(item, itemTypeData),
    addIndentChar,
    generatePropsCode,
    isArrayOptions
  });
  // 自闭合标签处理
  [
    'img',
    'input',
    'hr',
    'br',
    'col',
    'area',
    'embed',
    'source',
    'track',
    'wbr'
  ].forEach((tagName) => {
    contentCode = contentCode.replace(
      new RegExp(`>\\s*</${tagName}>`, 'g'),
      '/>'
    );
  });
  return contentCode;
}

/**
 * 获取上传组件表单验证方法代码
 * @param item 表单项
 */
export function getUploadValidatorCode(item: ProFormItemProps) {
  const refName = getComponentRefName(item);
  return `(_rule, value, callback) => {
  const compRef = getProFormRefs()['${refName}'];
  if (compRef && compRef.isDone && !compRef.isDone()) {
    return callback(new Error('${item.label}还未上传完毕'));
  }
  callback();
}`;
}

/**
 * 生成 ElForm 验证规则代码
 * @param items 表单项数据
 * @param componentData 组件库数据
 * @param itemTypeData 高级表单组件类型数据
 * @param requiredLang 默认的必填提示文本
 */
export function generateRuleCode(
  items: ProFormItemProps[],
  componentData?: ComponentGroup[],
  itemTypeData?: ProFormItemTypeData[],
  requiredLang?: string
) {
  const rules: Record<string, any> = {};
  eachTree(items, (item) => {
    if (isContainerType(item, itemTypeData)) {
      return;
    }
    const itemRules: any = [];
    const typeData = getItemTypeData(item, itemTypeData);
    if (item.required) {
      const config = getComponentItemByType(item.type, componentData);
      const componentPropsData = {
        ...(config?.defaultProps || {}),
        ...(item.props || {}),
        ...(config?.reservedProps || {})
      };
      itemRules.push({
        required: true,
        message: getRuleMessage(
          item.label,
          item.requiredMessage,
          componentPropsData.placeholder,
          requiredLang
        ),
        trigger: typeData?.requiredTrigger ?? 'change'
      });
    }
    if (item.type && uploadTypes.includes(item.type)) {
      itemRules.push({
        trigger: typeData?.requiredTrigger ?? 'change',
        validator: new JsVar({ name: getUploadValidatorCode(item) })
      });
    }
    if (itemRules.length && item.prop) {
      rules[item.prop] = itemRules;
    }
  });
  return obj2Str(rules, false, 2);
}

/**
 * 获取生成 ElForm 代码时组件的属性
 * @param item 表单项
 * @param componentData 组件库数据
 * @param itemTypeData 高级表单组件类型数据
 */
export function getComponentProps(
  item: ProFormItemProps,
  componentData?: ComponentGroup[],
  itemTypeData?: ProFormItemTypeData[]
) {
  const typeData = getComponentItemByType(item.type, componentData);
  const props = {
    ...(typeData?.defaultProps || {}),
    ...(item.props || {}),
    ...(typeData?.reservedProps || {})
  };
  const refName = getComponentRefName(item);
  props.ref = new JsVar({ name: refName });
  // 添加 v-if 和 v-model 属性
  if (item.type && isContainerType(item, itemTypeData)) {
    props.vIf = item.vIf;
    if (item.type === 'steps') {
      if (props.active == null) {
        props.active = new JsVar({
          name: `form.${item.prop} ?? 0`
        });
      }
    } else if (item.type === 'tabs') {
      props.vModel = `form.${item.prop}`;
      props.modelValue = void 0;
      props.items = (item.children || []).map((c) => ({
        name: c.props?.name ?? c.prop,
        label: c.props?.label ?? c.label,
        disabled: c.props?.disabled,
        closable: c.props?.closable,
        lazy: c.props?.lazy
      }));
    } else if (['collapseItem', 'carouselItem'].includes(item.type)) {
      if (props.name == null && item.prop != null) {
        props.name = item.prop;
      }
    } else if (item.type === 'collapse') {
      if (props.modelValue == null) {
        props.vModel = `form.${item.prop}`;
        props.modelValue = void 0;
      }
    }
  } else if (item.type && item.type !== 'text') {
    props.vModel = `form.${item.prop}`;
  }

  // 需要引用 js 变量的属性
  const keyName = String(item.key ?? item.prop);
  const labelName = String(item.label || item.prop);
  if (item.type === 'cascader' || item.type === 'multipleCascader') {
    props.options = new JsVar({
      name: `${keyName}CascaderOptions`,
      code: `/** ${labelName}级联数据 */
const ${keyName}CascaderOptions = ref(${obj2Str(props.options || [], false, 0)});`,
      dataType: Array.isArray(props.options || []) ? 'array' : void 0
    });
    const temp = props.props || {};
    if (item.type === 'multipleCascader') {
      temp.multiple = true;
    }
    props.props = new JsVar({
      name: `${keyName}CascaderProps`,
      code: `/** ${labelName}级联配置 */
const ${keyName}CascaderProps = reactive(${obj2Str(temp, false, 0)});`
    });
  } else if (
    item.type === 'tableSelect' ||
    item.type === 'tableMultipleSelect'
  ) {
    props.tableProps = new JsVar({
      name: `${keyName}TableProps`,
      code: `/** ${labelName}表格配置 */
const ${keyName}TableProps = reactive(${obj2Str(props.tableProps || {}, false, 0)});`
    });
  } else if (
    item.type === 'checkCard' ||
    item.type === 'multipleCheckCard' ||
    item.type === 'steps'
  ) {
    props.items = new JsVar({
      name: `${keyName}Items`,
      code: `/** ${labelName}数据 */
const ${keyName}Items = ref(${obj2Str(props.items || [], false, 0)});`
    });
  } else if (
    item.type === 'virtualTreeSelect' ||
    item.type === 'virtualTreeMultipleSelect'
  ) {
    props.treeProps = new JsVar({
      name: `${keyName}TreeProps`,
      code: `/** ${labelName}树配置 */
const ${keyName}TreeProps = ref(${obj2Str(props.treeProps || {}, false, 0)});`
    });
  } else if (
    item.type === 'transfer' ||
    item.type === 'treeSelect' ||
    item.type === 'treeMultipleSelect'
  ) {
    props.data = new JsVar({
      name: `${keyName}Data`,
      code: `/** ${labelName}数据 */
const ${keyName}Data = ref(${obj2Str(props.data || [], false, 0)});`,
      dataType: Array.isArray(props.data || []) ? 'array' : void 0
    });
  } else if (
    item.type === 'select' ||
    item.type === 'multipleSelect' ||
    item.type === 'radio' ||
    item.type === 'radioButton' ||
    item.type === 'checkbox' ||
    item.type === 'checkboxButton'
  ) {
    const options = props.options || [];
    if (!Array.isArray(options)) {
      props.options = new JsVar({
        name: `${keyName}Options`,
        code: `/** ${labelName}选项数据 */
const ${keyName}Options = ref(${obj2Str(options, false, 0)});`
      });
    }
  } else if (item.type === 'mention') {
    props.options = new JsVar({
      name: `${keyName}Options`,
      code: `/** ${labelName}选项数据 */
const ${keyName}Options = ref(${obj2Str(props.options || [], false, 0)});`,
      dataType: Array.isArray(props.options || []) ? 'array' : void 0
    });
  } else if (item.type === 'autocomplete') {
    props.fetchSuggestions = new JsVar({
      name: `${keyName}FetchSuggestions`,
      code: `/** ${labelName}建议数据 */
const ${keyName}FetchSuggestions = ref(${obj2Str(props.fetchSuggestions || [], false, 0)});`,
      dataType: Array.isArray(props.fetchSuggestions || []) ? 'array' : void 0
    });
  }
  return props;
}

/**
 * 获取导入代码和变量声明代码
 * @param config 表单配置
 * @param componentData 组件库数据
 */
export function getImportAndVarCode(
  config: EleProFormProps,
  componentData?: ComponentGroup[]
) {
  const imports = new Set<string>([]);
  const codes = new Set<string>([]);
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

  const proImports = new Set<string>([]);
  const proCodes = new Set<string>([]);
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

/**
 * 取消表单项数据的多余属性
 * @param formItems 表单项数据
 * @param componentData 组件库数据
 * @param itemTypeData 高级表单组件类型数据
 */
export function getElNormalizeItems(
  formItems?: ProFormItemProps[],
  componentData?: ComponentGroup[],
  itemTypeData?: ProFormItemTypeData[]
): ProFormItemProps[] {
  const items: ProFormItemProps[] = mapTree(formItems, (item) => {
    return {
      ...item,
      props: getComponentProps(item, componentData, itemTypeData),
      initValue: void 0
    };
  });
  return deepCloneObject(items, true); // 去掉空值
}

/**
 * 生成 ElForm 代码
 * @param data 表单配置数据
 * @param componentData 组件库数据
 * @param itemTypeData 高级表单组件类型数据
 * @param requiredLang 默认的必填提示文本
 */
export function generateElFormCode(
  data?: EleProFormProps,
  componentData?: ComponentGroup[],
  itemTypeData?: ProFormItemTypeData[],
  requiredLang?: string
) {
  const config: EleProFormProps = deepCloneObject({
    ...(data || {}),
    items: data?.items || []
  });
  const formInitValue = getFormInitValue(config.items, itemTypeData);
  config.items = getElNormalizeItems(config.items, componentData, itemTypeData);
  const elFormProps = pick(config, [
    'labelPosition',
    'requireAsteriskPosition',
    'labelWidth',
    'labelSuffix',
    'inline',
    'inlineMessage',
    'statusIcon',
    'showMessage',
    'validateOnRuleChange',
    'hideRequiredAsterisk',
    'scrollToError',
    'scrollIntoViewOptions',
    'size',
    'disabled',
    'style',
    'class'
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
    formImportCode: imports.join('\n  '),
    formVarCode: addIndentChar(codes.join('\n\n'), '  '),
    showFooterExpand: sfe
  };
  return templateEngine(formTemplate, templateData);
}

/**
 * 生成 ProForm 代码
 * @param data 表单配置数据
 * @param componentData 组件库数据
 */
export function generateProFormCode(
  data?: EleProFormProps,
  componentData?: ComponentGroup[]
) {
  const config: EleProFormProps = deepCloneObject({
    ...(data || {}),
    items: data?.items || []
  });
  const sfe = config.showSearchExpand;
  const { proImports, proCodes } = getImportAndVarCode(config, componentData);
  const templateData = {
    proFormConfigCode: obj2Str(config, false, 2, () => void 0),
    proFormImportCode: proImports.join('\n  '),
    proFormVarCode: addIndentChar(proCodes.join('\n\n'), '  '),
    showFooterExpand: sfe
  };
  return templateEngine(proTemplate, templateData);
}
