import type { JsVar } from './code-js-var';
import { transformJsVar } from './code-js-var';

/**
 * 模板引擎
 * @param template 模板
 * @param data 数据
 */
export function templateEngine(template: string, data = {}): string {
  if (typeof template !== 'string' || !template) {
    return '';
  }
  const openCode = '<%';
  const closeCode = '%>';
  try {
    const jss = new RegExp('^' + openCode + '#', 'g');
    const jsse = new RegExp(closeCode + '$', 'g');
    const result = template
      .replace(new RegExp(openCode + '#', 'g'), openCode + '# ')
      .replace(new RegExp(closeCode + '}', 'g'), '} ' + closeCode)
      .replace(/\\/g, '\\\\')
      .replace(new RegExp(openCode + '!(.+?)!' + closeCode, 'g'), (str) => {
        return str
          .replace(new RegExp('^' + openCode + '!', 'g'), '')
          .replace(new RegExp('!' + closeCode, 'g'), '')
          .replace(new RegExp(openCode + '|' + closeCode, 'g'), (tag) => {
            return tag.replace(/(.)/g, '\\$1');
          });
      })
      .replace(/(?="|')/g, '\\')
      .replace(
        new RegExp(openCode + '#([\\s\\S])+?' + closeCode, 'g'),
        (str) => {
          return (
            '";' +
            str.replace(jss, '').replace(jsse, '').replace(/\\/g, '') +
            ';view+="'
          );
        }
      )
      .replace(new RegExp(openCode + '([^{#}])*?' + closeCode, 'g'), (str) => {
        if (str.replace(/\s/g, '') === openCode + closeCode) {
          return '';
        }
        let start = '"+(';
        str = str.replace(new RegExp(openCode + '|' + closeCode, 'g'), '');
        if (/^=/.test(str)) {
          str = str.replace(/^=/, '');
          start = '"+_escape_(';
        }
        return start + str.replace(/\\/g, '') + ')+"';
      })
      .replace(/\r\n/g, '\\r\\n" + "')
      .replace(/\n/g, '\\n" + "')
      .replace(/\r/g, '\\r" + "');
    return new Function(
      'd, _escape_',
      '"use strict";var view = "' + result + '";return view;'
    )(data, (str: string) => {
      return String(str || '')
        .replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&quot;');
    });
  } catch (e) {
    console.error('TemplateEngine Error: ', e, '\n' + (template || ''));
    return '';
  }
}

/**
 * 转义字符串
 * @param str 字符串
 */
export function escapeStr(str: string) {
  const escapes = {
    "'": "\\'",
    '\\': '\\\\',
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\b': '\\b',
    '\f': '\\f'
  };
  return str.replace(/['\\\n\r\t\b\f]/g, (char) => escapes[char]);
}

/**
 * 判断是否是合法的属性名
 * @param name 属性名
 */
export function isValidKey(name: string) {
  const pattern = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
  if (!pattern.test(name)) {
    return false;
  }
  const keywords = [
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'enum',
    'export',
    'extends',
    'finally',
    'for',
    'function',
    'if',
    'goto',
    'implements',
    'import',
    'in',
    'instanceof',
    'interface',
    'let',
    'new',
    'package',
    'private',
    'protected',
    'public',
    'return',
    'static',
    'super',
    'switch',
    'this',
    'throw',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'yield',
    'as',
    'async',
    'await',
    'of',
    'static',
    'from',
    'null',
    'true',
    'false'
  ];
  return !keywords.includes(name);
}

/**
 * 驼峰转中划线
 * @param name 驼峰风格名称
 */
export function kebabCase(name: string) {
  return name
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .join('-')
    .toLowerCase();
}

/**
 * 代码增加缩进
 * @param code 代码
 * @param indentChar 缩进字符
 */
export function addIndentChar(code?: string, indentChar?: string) {
  if (code == null || !indentChar) {
    return code ?? '';
  }
  return code.split('\n').join('\n' + indentChar);
}

/**
 * 对象转 js 字符串
 * @param obj 对象
 * @param singleLine 是否单行显示
 * @param indentSize 多行时缩进空格数量
 * @param transformJsVarFunc 转换 JsVar 对象的方法
 */
export function obj2Str(
  obj: any,
  singleLine?: boolean,
  indentSize?: number,
  transformJsVarFunc?: (jv: any) => JsVar | undefined
) {
  if (typeof obj === 'undefined') {
    return 'void 0';
  }
  if (obj === null) {
    return 'null';
  }
  const indent = indentSize ?? 0;
  const indentChar = Array.from({ length: indent }).fill(' ').join('');
  const jsVar = (transformJsVarFunc ?? transformJsVar)(obj);
  if (jsVar != null && jsVar.name) {
    if (singleLine) {
      return jsVar.name;
    }
    return addIndentChar(jsVar.name, indentChar);
  }
  if (typeof obj === 'string') {
    return `'${escapeStr(obj)}'`;
  }
  if (Array.isArray(obj)) {
    if (!obj.length) {
      return '[]';
    }
    const result = obj.map((v) =>
      obj2Str(v, singleLine, indent + 2, transformJsVarFunc)
    );
    if (singleLine) {
      return `[ ${result.join(', ')} ]`;
    }
    const code = result.join(',\n  ' + indentChar);
    return '[\n  ' + indentChar + code + '\n' + indentChar + ']';
  }
  if (typeof obj === 'object') {
    const result: string[] = [];
    Object.keys(obj).forEach((k) => {
      const code = obj2Str(obj[k], singleLine, indent + 2, transformJsVarFunc);
      result.push(isValidKey(k) ? `${k}: ${code}` : `'${k}': ${code}`);
    });
    if (!result.length) {
      return '{}';
    }
    if (singleLine) {
      return `{ ${result.join(', ')} }`;
    }
    const code = result.join(',\n  ' + indentChar);
    return '{\n  ' + indentChar + code + '\n' + indentChar + '}';
  }
  return JSON.stringify(obj) || '';
}

/**
 * 生成组件属性的代码
 * @param props 属性
 * @param singleLine 是否单行显示
 * @param indentSize 多行时缩进空格数量
 * @param isAllProps 是否是全部属性, 会考虑标签结束符的换行和缩进
 * @param transformJsVarFunc 转换 JsVar 对象的方法
 */
export function generatePropsCode(
  props?: Record<string, any>,
  singleLine?: boolean | null,
  indentSize?: number,
  isAllProps?: boolean,
  transformJsVarFunc?: (jv: any) => JsVar | undefined
) {
  if (!props) {
    return '';
  }
  const keys = Object.keys(props).filter(
    (k) => typeof props[k] !== 'undefined'
  );
  if (!keys.length) {
    return '';
  }
  const codes = keys.map((k) => {
    const key = kebabCase(k);
    const jsVar = (transformJsVarFunc ?? transformJsVar)(props[k]);
    if (jsVar != null && jsVar.name) {
      if (key === 'ref' || key === 'v-model' || key === 'v-if') {
        return `${key}="${jsVar.name}"`;
      }
      if (key.startsWith('on-')) {
        return `@${key.slice(3)}="${jsVar.name}"`;
      }
      return `:${key}="${jsVar.name}"`;
    }
    if (typeof props[k] === 'string') {
      if (key === 'v-if') {
        return `${key}="${props[k]}"`;
      }
      const str = escapeStr(props[k]);
      if (str.includes('\\n') && !str.includes('`')) {
        return `:${key}="\`${str}\`"`;
      }
      return `${key}="${str}"`;
    }
    return `:${key}="${obj2Str(props[k], true, void 0, transformJsVarFunc)}"`;
  });
  const isAll = isAllProps ?? true;
  if (singleLine ?? keys.length <= 2) {
    return (isAll ? ' ' : '') + codes.join(' ');
  }
  const indent = indentSize ?? 2;
  const indentChar = Array.from({ length: indent }).fill(' ').join('');
  const code = '\n' + indentChar + codes.join('\n' + indentChar);
  return isAll ? code + '\n' + indentChar.slice(2) : code;
}
