import { mapTree } from "../utils/common";
const codeStringPrefix = "/*__PRO_CRUD__*/";
function getDefaultSearchFormProps() {
  const config = {
    grid: { lg: 6, md: 8, sm: 12, xs: 24 },
    rowProps: { gutter: 16 },
    footer: true,
    footerProps: { labelWidth: 0 },
    autoFooterCol: true
  };
  return config;
}
function getFieldsSearchFormItems(fields) {
  return mapTree(
    fields || [],
    (field, index) => {
      if (field.hideInSearch === "flat") {
        return "flatChildren";
      } else if (!field.hideInSearch) {
        return {
          key: field.key ?? `${index}-${field.prop}`,
          prop: field.prop,
          label: field.label,
          ...field.searchItemProps || {}
        };
      }
    },
    "children",
    "children",
    (item) => {
      return {
        type: item.children?.length ? "div" : "input",
        ...item
      };
    }
  );
}
function getFieldsAddFormItems(fields) {
  return mapTree(
    fields || [],
    (field, index) => {
      if (field.hideInAdd === "flat") {
        return "flatChildren";
      } else if (!field.hideInAdd) {
        return {
          key: field.key ?? `${index}-${field.prop}`,
          prop: field.prop,
          label: field.label,
          ...field.addItemProps || {}
        };
      }
    },
    "children",
    "children",
    (item) => {
      return {
        type: item.children?.length ? "div" : "input",
        ...item
      };
    }
  );
}
function getFieldsEditFormItems(fields) {
  return mapTree(
    fields || [],
    (field, index) => {
      if (field.hideInEdit === "flat") {
        return "flatChildren";
      } else if (!field.hideInEdit) {
        return {
          key: field.key ?? `${index}-${field.prop}`,
          prop: field.prop,
          label: field.label,
          ...field.editItemProps || {}
        };
      }
    },
    "children",
    "children",
    (item) => {
      return {
        type: item.children?.length ? "div" : "input",
        ...item
      };
    }
  );
}
const defaultTreeNodeKey = "value";
function getTreeValueField(sideConfig) {
  return sideConfig?.treeProps?.nodeKey ?? defaultTreeNodeKey;
}
function getTreeLabelField(sideConfig) {
  const field = sideConfig?.treeProps?.props?.label;
  return typeof field === "string" ? field : "label";
}
function getCodeResult(code, httpRequest) {
  try {
    return new Function("httpRequest", `return (${code})`)(httpRequest);
  } catch (e) {
    console.error(e);
  }
}
export {
  codeStringPrefix,
  defaultTreeNodeKey,
  getCodeResult,
  getDefaultSearchFormProps,
  getFieldsAddFormItems,
  getFieldsEditFormItems,
  getFieldsSearchFormItems,
  getTreeLabelField,
  getTreeValueField
};
