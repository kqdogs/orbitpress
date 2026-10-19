import { defineComponent, ref, computed, onMounted, openBlock, createBlock, normalizeClass, withCtx, createElementBlock, createVNode, unref, createCommentVNode } from "vue";
import { ElInput, ElSwitch } from "element-plus";
import { eachTree, mapTree } from "../../utils/common";
import EleTreeTable from "../../ele-tree-table/index";
import EleSelect from "../../ele-select/index";
import { DeleteOutlined, AppstoreAddOutlined, PlusOutlined } from "../../icons/index";
import { getValue, setValue } from "../../ele-pro-form/util";
import { deepCloneObject, getPropertyPath, generateItemKey } from "./build-core";
import ToolButton from "./tool-button";
const _hoisted_1 = {
  key: 4,
  class: "ele-pro-form-builder-options-edit-cell"
};
const _hoisted_2 = {
  key: 6,
  class: "ele-pro-form-builder-options-edit-cell"
};
const _hoisted_3 = {
  key: 0,
  class: "ele-pro-form-builder-options-edit-th"
};
const _hoisted_4 = {
  key: 1,
  class: "ele-pro-form-builder-options-edit-cell"
};
const actionColKey = "optionsEditTreeTableAction";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "OptionsTable" },
  __name: "options-table",
  props: {
    data: {},
    isTreeData: { type: [Boolean, Object] },
    columns: {}
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const tableColumns = ref([]);
    const tableData = ref([]);
    const tableMinWidth = computed(() => {
      let width = 0;
      tableColumns.value.forEach((col) => {
        const w = col.style?.width;
        const wn = w == null || typeof w === "number" ? w : Number.parseInt(w);
        width += (wn == null || isNaN(wn) ? void 0 : wn) ?? 120;
      });
      return `${width}px`;
    });
    let tablePropStart = 0;
    const generateCellKey = () => {
      const key = generateItemKey();
      tablePropStart++;
      return `${key}c${tablePropStart}`;
    };
    const handleDelete = (row, parent) => {
      const children = parent ? parent.children : tableData.value;
      if (children && children.length) {
        for (let i = 0; i < children.length; i++) {
          const temp = children[i];
          if (temp === row) {
            children.splice(i, 1);
            return true;
          }
          if (handleDelete(row, temp)) {
            return;
          }
        }
      }
    };
    const handleAdd = (parent) => {
      const item = {};
      if (!parent) {
        tableData.value.push(item);
      } else if (parent.children) {
        parent.children.push(item);
      } else {
        parent.children = [item];
      }
    };
    const handleAddCol = () => {
      const index = tableColumns.value.findIndex((c) => c.key === actionColKey);
      if (index !== -1) {
        const col = {
          userProp: "",
          prop: generateCellKey(),
          label: "",
          style: { textAlign: "center" }
        };
        if (index <= 0) {
          tableColumns.value.unshift(col);
        } else {
          tableColumns.value.splice(index, 0, col);
        }
      }
    };
    const handleDeleteCol = (column) => {
      if (column.prop != null) {
        const index = tableColumns.value.findIndex((c) => c.prop === column.prop);
        if (index !== -1) {
          tableColumns.value.splice(index, 1);
        }
      }
    };
    const getResult = () => {
      let result = deepCloneObject(tableData.value);
      if (props.columns === "tableData") {
        result = mapTree(result, (row) => {
          const temp = {};
          tableColumns.value.forEach((col) => {
            if (col.prop) {
              setValue(temp, col.userProp || col.prop, row[col.prop]);
            }
          });
          return temp;
        });
      } else if (props.columns === "stringArray") {
        result = result.map((d) => d.value);
      }
      return result;
    };
    onMounted(() => {
      tableData.value = [];
      const userData = props.data == null || typeof props.data === "string" ? [] : deepCloneObject(props.data);
      const actionCol = {
        key: actionColKey,
        label: "",
        style: {
          textAlign: "center",
          width: props.isTreeData ? "78px" : "48px",
          flex: "none"
        },
        class: "is-fixed-right is-fixed-right-first"
      };
      if (props.columns === "tableData") {
        const keys = [];
        eachTree(userData, (row) => {
          getPropertyPath(row, ["children"]).forEach((k) => {
            if (!keys.includes(k)) {
              keys.push(k);
            }
          });
        });
        tableColumns.value = [
          ...keys.map((k) => ({
            userProp: k,
            prop: generateCellKey(),
            label: "",
            style: { textAlign: "center" }
          })),
          actionCol
        ];
        tableData.value = mapTree(userData, (row) => {
          const temp = { ...row };
          tableColumns.value.forEach((col) => {
            if (col.prop && col.userProp) {
              temp[col.prop] = getValue(temp, col.userProp);
            }
          });
          return temp;
        });
      } else if (props.columns === "tableColumns") {
        tableColumns.value = [
          {
            prop: "label",
            label: "标题",
            style: { textAlign: "center" }
          },
          {
            prop: "prop",
            label: "属性名",
            style: { textAlign: "center" }
          },
          {
            prop: "columnKey",
            label: "ColumnKey",
            style: { textAlign: "center" }
          },
          {
            prop: "align",
            label: "对齐方式",
            style: { textAlign: "center", width: "110px", flex: "none" }
          },
          {
            prop: "width",
            label: "列宽",
            style: { textAlign: "center", width: "110px", flex: "none" }
          },
          {
            prop: "minWidth",
            label: "最小列宽",
            style: { textAlign: "center", width: "110px", flex: "none" }
          },
          {
            prop: "sortable",
            label: "支持排序",
            style: { textAlign: "center", width: "110px", flex: "none" },
            editType: "switch"
          },
          {
            prop: "fixed",
            label: "固定",
            style: { textAlign: "center" }
          },
          {
            prop: "type",
            label: "类型",
            style: { textAlign: "center", width: "110px", flex: "none" }
          },
          actionCol
        ];
        tableData.value = userData;
      } else if (props.columns === "stringArray") {
        tableColumns.value = [
          { prop: "value", label: "值", style: { textAlign: "center" } },
          actionCol
        ];
        tableData.value = userData.map((d) => ({ value: d }));
      } else if (props.columns) {
        tableColumns.value = [...props.columns, actionCol];
        tableData.value = userData;
      } else {
        tableColumns.value = [
          { prop: "label", label: "文本", style: { textAlign: "center" } },
          { prop: "value", label: "值", style: { textAlign: "center" } },
          actionCol
        ];
        tableData.value = userData;
      }
    });
    __expose({
      getResult
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleTreeTable, {
        data: tableData.value,
        columns: tableColumns.value,
        tableStyle: { minWidth: tableMinWidth.value },
        class: normalizeClass(["ele-pro-form-builder-options-editer", { "is-table-data": __props.columns === "tableData" }])
      }, {
        bodyCell: withCtx(({ row, column, treeLevel }) => [
          __props.columns === "tableColumns" && column.prop === "align" ? (openBlock(), createBlock(EleSelect, {
            key: 0,
            size: "default",
            placeholder: "",
            clearable: true,
            modelValue: row[column.prop],
            "onUpdate:modelValue": ($event) => row[column.prop] = $event,
            options: [
              { label: "左对齐", value: "left" },
              { label: "居中", value: "center" },
              { label: "右对齐", value: "right" }
            ],
            popperOptions: { strategy: "fixed" },
            class: "ele-fluid"
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : __props.columns === "tableColumns" && column.prop === "fixed" ? (openBlock(), createBlock(EleSelect, {
            key: 1,
            size: "default",
            placeholder: "",
            clearable: true,
            modelValue: row[column.prop],
            "onUpdate:modelValue": ($event) => row[column.prop] = $event,
            options: [
              { label: "不固定", value: false },
              { label: "左侧", value: "left" },
              { label: "右侧", value: "right" }
            ],
            popperOptions: { strategy: "fixed" },
            class: "ele-fluid"
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : __props.columns === "tableColumns" && column.prop === "type" ? (openBlock(), createBlock(EleSelect, {
            key: 2,
            size: "default",
            placeholder: "",
            clearable: true,
            modelValue: row[column.prop],
            "onUpdate:modelValue": ($event) => row[column.prop] = $event,
            options: [
              { label: "默认", value: "default" },
              { label: "选择列", value: "selection" },
              { label: "序号列", value: "index" },
              { label: "展开列", value: "expand" }
            ],
            popperOptions: { strategy: "fixed" },
            class: "ele-fluid"
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : __props.columns === "tableColumns" && column.prop === "sortable" ? (openBlock(), createBlock(EleSelect, {
            key: 3,
            size: "default",
            placeholder: "",
            clearable: true,
            modelValue: row[column.prop],
            "onUpdate:modelValue": ($event) => row[column.prop] = $event,
            options: [
              { label: "true", value: true },
              { label: "false", value: false },
              { label: "custom", value: "custom" }
            ],
            popperOptions: { strategy: "fixed" },
            class: "ele-fluid"
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : column.prop && column.editType === "switch" ? (openBlock(), createElementBlock("div", _hoisted_1, [
            createVNode(unref(ElSwitch), {
              size: "small",
              modelValue: row[column.prop],
              "onUpdate:modelValue": ($event) => row[column.prop] = $event
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ])) : column.prop ? (openBlock(), createBlock(unref(ElInput), {
            key: 5,
            size: "default",
            placeholder: "",
            clearable: true,
            modelValue: row[column.prop],
            "onUpdate:modelValue": ($event) => row[column.prop] = $event
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : column.key === actionColKey ? (openBlock(), createElementBlock("div", _hoisted_2, [
            createVNode(ToolButton, {
              buttonProps: {
                type: "danger",
                plain: true,
                icon: unref(DeleteOutlined)
              },
              tooltip: "删除数据",
              onClick: ($event) => handleDelete(row)
            }, null, 8, ["buttonProps", "onClick"]),
            __props.isTreeData && !(typeof __props.isTreeData === "object" && __props.isTreeData.maxDepth && (treeLevel || 1) >= __props.isTreeData.maxDepth) ? (openBlock(), createBlock(ToolButton, {
              key: 0,
              buttonProps: {
                type: "primary",
                plain: true,
                icon: unref(PlusOutlined)
              },
              tooltip: "新增子级",
              onClick: ($event) => handleAdd(row)
            }, null, 8, ["buttonProps", "onClick"])) : createCommentVNode("", true)
          ])) : createCommentVNode("", true)
        ]),
        headerCell: withCtx(({ column }) => [
          __props.columns === "tableData" && column.prop ? (openBlock(), createElementBlock("div", _hoisted_3, [
            createVNode(unref(ElInput), {
              size: "default",
              clearable: true,
              modelValue: column.userProp,
              "onUpdate:modelValue": ($event) => column.userProp = $event
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            createVNode(ToolButton, {
              buttonProps: {
                type: "danger",
                plain: true,
                icon: unref(DeleteOutlined)
              },
              tooltip: "删除属性",
              onClick: ($event) => handleDeleteCol(column)
            }, null, 8, ["buttonProps", "onClick"])
          ])) : column.key === actionColKey ? (openBlock(), createElementBlock("div", _hoisted_4, [
            __props.columns === "tableData" ? (openBlock(), createBlock(ToolButton, {
              key: 0,
              buttonProps: {
                type: "primary",
                plain: true,
                icon: unref(AppstoreAddOutlined)
              },
              tooltip: "新增属性",
              onClick: _cache[0] || (_cache[0] = ($event) => handleAddCol())
            }, null, 8, ["buttonProps"])) : createCommentVNode("", true),
            createVNode(ToolButton, {
              buttonProps: {
                type: "primary",
                plain: true,
                icon: unref(PlusOutlined)
              },
              tooltip: "新增数据",
              onClick: _cache[1] || (_cache[1] = ($event) => handleAdd())
            }, null, 8, ["buttonProps"])
          ])) : createCommentVNode("", true)
        ]),
        _: 1
      }, 8, ["data", "columns", "tableStyle", "class"]);
    };
  }
});
export {
  _sfc_main as default
};
