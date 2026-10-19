const sortableGroupName = "ProFormBuilderBodySortGroup";
const codeStringPrefix = "/*__PRO_FORM__*/";
function getColObjectProp(prop) {
  if (typeof prop === "number") {
    return { span: prop };
  }
  return prop || {};
}
function getScreenSizeColProps(screenSize, gridColProps, itemColProps) {
  const colProps = {
    ...gridColProps || {},
    ...itemColProps || {}
  };
  if (!screenSize || screenSize === "pc") {
    return colProps;
  }
  const obj = getColObjectProp(
    screenSize === "phone" ? colProps.xs : colProps.sm
  );
  const props = {
    span: obj.span ?? colProps.span,
    offset: obj.offset ?? colProps.offset,
    push: obj.push ?? colProps.push,
    pull: obj.pull ?? colProps.pull
  };
  return {
    ...colProps,
    ...props,
    xs: { ...props },
    sm: { ...props },
    md: { ...props },
    lg: { ...props },
    xl: { ...props }
  };
}
function computeContentExtraCol(grid, itemsLength) {
  const colProps = {};
  if (!grid) {
    return colProps;
  }
  Object.keys(grid).forEach((key) => {
    const value = grid[key];
    if (value != null && ["span", "xs", "sm", "md", "lg", "xl"].includes(key)) {
      if (typeof value === "number") {
        const cols = 24 / value;
        colProps[key] = (cols - (itemsLength || 0) % cols) * value;
        return;
      }
      if (typeof value === "object" && value.span != null) {
        const cols = 24 / value.span;
        colProps[key] = {
          ...value,
          span: (cols - (itemsLength || 0) % cols) * value
        };
        return;
      }
    }
    colProps[key] = value;
  });
  return colProps;
}
function getCodeResult(code, form, items, searchExpand, httpRequest, getProFormRefs) {
  try {
    return new Function(
      "form",
      "items",
      "searchExpand",
      "httpRequest",
      "getProFormRefs",
      "formItems",
      // 兼容旧版
      "formData",
      // 兼容旧版
      `return (${code})`
    )(form, items, searchExpand, httpRequest, getProFormRefs, items, form);
  } catch (e) {
    console.error(e);
  }
}
function isShowItem(item, form, items, searchExpand, editable) {
  if (editable) {
    return true;
  }
  if (item.prop == null && item.key == null) {
    return false;
  }
  if (item.vIf != null) {
    if (typeof item.vIf === "function") {
      return item.vIf(form, items, searchExpand);
    }
    if (typeof item.vIf === "string" && item.vIf.trim().length) {
      return getCodeResult(item.vIf, form, items, searchExpand);
    }
    if (item.vIf === false) {
      return false;
    }
  }
  return true;
}
function translateJsCode(code, form, items, searchExpand, httpRequest, getProFormRefs, getAndCacheCode) {
  if (code != null) {
    if (typeof code === "string") {
      if (code.startsWith(codeStringPrefix)) {
        const result = getCodeResult(
          code,
          form,
          items,
          searchExpand,
          httpRequest,
          getProFormRefs
        );
        if (getAndCacheCode && typeof result === "function") {
          return { result: getAndCacheCode(code, result), isCode: true };
        }
        return { result, isCode: true };
      }
      return { result: code, isCode: false };
    } else if (Array.isArray(code)) {
      const arrayResult = [];
      let arrayIsCode = false;
      code.forEach((c) => {
        const { result, isCode } = translateJsCode(
          c,
          form,
          items,
          searchExpand,
          httpRequest,
          getProFormRefs,
          getAndCacheCode
        );
        arrayResult.push(result);
        if (isCode) {
          arrayIsCode = true;
        }
      });
      if (arrayIsCode) {
        return { result: arrayResult, isCode: true };
      }
      return { result: code, isCode: false };
    } else if (typeof code === "object") {
      const objectResult = {};
      let objectIsCode = false;
      Object.keys(code).forEach((k) => {
        const { result, isCode } = translateJsCode(
          code[k],
          form,
          items,
          searchExpand,
          httpRequest,
          getProFormRefs,
          getAndCacheCode
        );
        objectResult[k] = result;
        if (isCode) {
          objectIsCode = true;
        }
      });
      if (objectIsCode) {
        return { result: objectResult, isCode: true };
      }
      return { result: code, isCode: false };
    }
  }
  return { result: code, isCode: false };
}
export {
  codeStringPrefix,
  computeContentExtraCol,
  getCodeResult,
  getColObjectProp,
  getScreenSizeColProps,
  isShowItem,
  sortableGroupName,
  translateJsCode
};
