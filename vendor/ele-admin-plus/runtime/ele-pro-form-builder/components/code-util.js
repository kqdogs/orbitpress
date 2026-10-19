import { transformJsVar } from "./code-js-var";
function templateEngine(template, data = {}) {
  if (typeof template !== "string" || !template) {
    return "";
  }
  const openCode = "<%";
  const closeCode = "%>";
  try {
    const jss = new RegExp("^" + openCode + "#", "g");
    const jsse = new RegExp(closeCode + "$", "g");
    const result = template.replace(new RegExp(openCode + "#", "g"), openCode + "# ").replace(new RegExp(closeCode + "}", "g"), "} " + closeCode).replace(/\\/g, "\\\\").replace(new RegExp(openCode + "!(.+?)!" + closeCode, "g"), (str) => {
      return str.replace(new RegExp("^" + openCode + "!", "g"), "").replace(new RegExp("!" + closeCode, "g"), "").replace(new RegExp(openCode + "|" + closeCode, "g"), (tag) => {
        return tag.replace(/(.)/g, "\\$1");
      });
    }).replace(/(?="|')/g, "\\").replace(
      new RegExp(openCode + "#([\\s\\S])+?" + closeCode, "g"),
      (str) => {
        return '";' + str.replace(jss, "").replace(jsse, "").replace(/\\/g, "") + ';view+="';
      }
    ).replace(new RegExp(openCode + "([^{#}])*?" + closeCode, "g"), (str) => {
      if (str.replace(/\s/g, "") === openCode + closeCode) {
        return "";
      }
      let start = '"+(';
      str = str.replace(new RegExp(openCode + "|" + closeCode, "g"), "");
      if (/^=/.test(str)) {
        str = str.replace(/^=/, "");
        start = '"+_escape_(';
      }
      return start + str.replace(/\\/g, "") + ')+"';
    }).replace(/\r\n/g, '\\r\\n" + "').replace(/\n/g, '\\n" + "').replace(/\r/g, '\\r" + "');
    return new Function(
      "d, _escape_",
      '"use strict";var view = "' + result + '";return view;'
    )(data, (str) => {
      return String(str || "").replace(/&(?!#?[a-zA-Z0-9]+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;").replace(/"/g, "&quot;");
    });
  } catch (e) {
    console.error("TemplateEngine Error: ", e, "\n" + (template || ""));
    return "";
  }
}
function escapeStr(str) {
  const escapes = {
    "'": "\\'",
    "\\": "\\\\",
    "\n": "\\n",
    "\r": "\\r",
    "	": "\\t",
    "\b": "\\b",
    "\f": "\\f"
  };
  return str.replace(/['\\\n\r\t\b\f]/g, (char) => escapes[char]);
}
function isValidKey(name) {
  const pattern = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
  if (!pattern.test(name)) {
    return false;
  }
  const keywords = [
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "enum",
    "export",
    "extends",
    "finally",
    "for",
    "function",
    "if",
    "goto",
    "implements",
    "import",
    "in",
    "instanceof",
    "interface",
    "let",
    "new",
    "package",
    "private",
    "protected",
    "public",
    "return",
    "static",
    "super",
    "switch",
    "this",
    "throw",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield",
    "as",
    "async",
    "await",
    "of",
    "static",
    "from",
    "null",
    "true",
    "false"
  ];
  return !keywords.includes(name);
}
function kebabCase(name) {
  return name.replace(/([A-Z])/g, " $1").trim().split(" ").join("-").toLowerCase();
}
function addIndentChar(code, indentChar) {
  if (code == null || !indentChar) {
    return code ?? "";
  }
  return code.split("\n").join("\n" + indentChar);
}
function obj2Str(obj, singleLine, indentSize, transformJsVarFunc) {
  if (typeof obj === "undefined") {
    return "void 0";
  }
  if (obj === null) {
    return "null";
  }
  const indent = indentSize ?? 0;
  const indentChar = Array.from({ length: indent }).fill(" ").join("");
  const jsVar = (transformJsVarFunc ?? transformJsVar)(obj);
  if (jsVar != null && jsVar.name) {
    if (singleLine) {
      return jsVar.name;
    }
    return addIndentChar(jsVar.name, indentChar);
  }
  if (typeof obj === "string") {
    return `'${escapeStr(obj)}'`;
  }
  if (Array.isArray(obj)) {
    if (!obj.length) {
      return "[]";
    }
    const result = obj.map(
      (v) => obj2Str(v, singleLine, indent + 2, transformJsVarFunc)
    );
    if (singleLine) {
      return `[ ${result.join(", ")} ]`;
    }
    const code = result.join(",\n  " + indentChar);
    return "[\n  " + indentChar + code + "\n" + indentChar + "]";
  }
  if (typeof obj === "object") {
    const result = [];
    Object.keys(obj).forEach((k) => {
      const code2 = obj2Str(obj[k], singleLine, indent + 2, transformJsVarFunc);
      result.push(isValidKey(k) ? `${k}: ${code2}` : `'${k}': ${code2}`);
    });
    if (!result.length) {
      return "{}";
    }
    if (singleLine) {
      return `{ ${result.join(", ")} }`;
    }
    const code = result.join(",\n  " + indentChar);
    return "{\n  " + indentChar + code + "\n" + indentChar + "}";
  }
  return JSON.stringify(obj) || "";
}
function generatePropsCode(props, singleLine, indentSize, isAllProps, transformJsVarFunc) {
  if (!props) {
    return "";
  }
  const keys = Object.keys(props).filter(
    (k) => typeof props[k] !== "undefined"
  );
  if (!keys.length) {
    return "";
  }
  const codes = keys.map((k) => {
    const key = kebabCase(k);
    const jsVar = (transformJsVarFunc ?? transformJsVar)(props[k]);
    if (jsVar != null && jsVar.name) {
      if (key === "ref" || key === "v-model" || key === "v-if") {
        return `${key}="${jsVar.name}"`;
      }
      if (key.startsWith("on-")) {
        return `@${key.slice(3)}="${jsVar.name}"`;
      }
      return `:${key}="${jsVar.name}"`;
    }
    if (typeof props[k] === "string") {
      if (key === "v-if") {
        return `${key}="${props[k]}"`;
      }
      const str = escapeStr(props[k]);
      if (str.includes("\\n") && !str.includes("`")) {
        return `:${key}="\`${str}\`"`;
      }
      return `${key}="${str}"`;
    }
    return `:${key}="${obj2Str(props[k], true, void 0, transformJsVarFunc)}"`;
  });
  const isAll = isAllProps ?? true;
  if (singleLine ?? keys.length <= 2) {
    return (isAll ? " " : "") + codes.join(" ");
  }
  const indent = indentSize ?? 2;
  const indentChar = Array.from({ length: indent }).fill(" ").join("");
  const code = "\n" + indentChar + codes.join("\n" + indentChar);
  return isAll ? code + "\n" + indentChar.slice(2) : code;
}
export {
  addIndentChar,
  escapeStr,
  generatePropsCode,
  isValidKey,
  kebabCase,
  obj2Str,
  templateEngine
};
