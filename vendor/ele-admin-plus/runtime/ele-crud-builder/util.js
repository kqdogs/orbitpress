import { findTree, eachTree } from "../utils/common";
import { generateItemKey } from "../ele-pro-form-builder/components/build-core";
import { codeStringPrefix } from "../ele-crud/util";
const codeTips = `/** 全局变量
 * \`httpRequest\` 请求工具
 */`;
const defaultHeaderRightTools = [
  "import",
  "export",
  "clear"
];
function generateUniqueItemKey(fields, keys) {
  let itemKey = generateItemKey();
  const flag = true;
  while (flag) {
    if (!findTree(fields, (d) => d.key === itemKey) && (!keys || !keys.includes(itemKey))) {
      break;
    }
    itemKey = generateItemKey();
  }
  return itemKey;
}
function itemsGenerateNewKey(fields, curdFields, overwriteProp) {
  if (!fields) {
    return;
  }
  const addedKeys = [];
  eachTree(Array.isArray(fields) ? fields : [fields], (item) => {
    const itemKey = generateUniqueItemKey(curdFields, addedKeys);
    addedKeys.push(itemKey);
    item.key = itemKey;
    if (overwriteProp) {
      item.prop = itemKey;
    }
  });
}
const defaultPageConfigFormItems = [
  {
    label: "基础配置",
    prop: "groupBasicConfig",
    type: "div",
    props: { class: "ele-crud-builder-page-config-group" },
    children: [
      {
        label: "接口配置",
        prop: "groupApiLabel",
        type: "label",
        props: { class: "ele-pro-form-builder-props-group-label" }
      },
      {
        label: "查询接口",
        prop: "listApi",
        type: "proFormBuilderOptionsEdit",
        props: {
          title: "查询接口设置",
          isTreeData: true,
          columns: "tableData",
          codeOptions: true,
          codeTips,
          codePlaceholder: `async ({ pages, orders }) => {
    // 示例
    const res = await httpRequest.get('/system/user/page', {
        params: { ...pages, ...orders }
    });
    return res.data.data;
}
`,
          codePrefix: codeStringPrefix
        }
      },
      {
        label: "删除接口",
        prop: "deleteApi",
        type: "proFormBuilderEventEdit",
        props: {
          title: "删除接口设置",
          codeTips,
          codePlaceholder: `async (dataKeys, data) => {
    // 示例
    const res = await httpRequest.delete('/system/user/batch', {
        data: dataKeys
    });
    if (res.data.code === 0) {
        return res.data.message;
    }
    return Promise.reject(new Error(res.data.message));
}
`,
          codePrefix: codeStringPrefix
        }
      },
      {
        label: "添加接口",
        prop: "addApi",
        type: "proFormBuilderEventEdit",
        props: {
          title: "添加接口设置",
          codeTips,
          codePlaceholder: `async (data) => {
    // 示例
    const res = await httpRequest.post('/system/user', data);
    if (res.data.code === 0) {
        return res.data.message;
    }
    return Promise.reject(new Error(res.data.message));
}
`,
          codePrefix: codeStringPrefix
        }
      },
      {
        label: "修改接口",
        prop: "editApi",
        type: "proFormBuilderEventEdit",
        props: {
          title: "修改接口设置",
          codeTips,
          codePlaceholder: `async (data) => {
    // 示例
    const res = await httpRequest.put('/system/user', data);
    if (res.data.code === 0) {
        return res.data.message;
    }
    return Promise.reject(new Error(res.data.message));
}
`,
          codePrefix: codeStringPrefix
        }
      },
      {
        label: "详情接口",
        prop: "detailApi",
        type: "proFormBuilderEventEdit",
        props: {
          title: "详情接口设置",
          codeTips,
          codePlaceholder: `async (dataKey, data) => {
    // 示例
    const res = await httpRequest.get('/system/user/' + dataKey);
    if (res.data.code === 0) {
        return res.data.data;
    }
    return Promise.reject(new Error(res.data.message));
}
`,
          codePrefix: codeStringPrefix
        }
      },
      {
        label: "页面容器",
        prop: "groupPageLabel",
        type: "label",
        props: { class: "ele-pro-form-builder-props-group-label" }
      },
      {
        label: "包裹页面容器",
        prop: "pageConfig.pageProps",
        type: "crudBuilderSwitch",
        props: { defaultValue: false }
      },
      {
        prop: "groupPageConfigPageProps",
        type: "div",
        vIf: "form.pageConfig && form.pageConfig.pageProps",
        children: [
          {
            label: "容器内表格高度撑满",
            prop: "pageConfig.pageProps.flexTable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "页面容器样式",
            prop: "pageConfig.pageProps.style",
            type: "proFormBuilderStyleEdit"
          }
        ]
      },
      {
        label: "页面卡片",
        prop: "groupPageCardLabel",
        type: "label",
        props: { class: "ele-pro-form-builder-props-group-label" }
      },
      {
        label: "页面包裹卡片",
        prop: "pageConfig.cardProps",
        type: "crudBuilderSwitch",
        props: { defaultValue: false }
      },
      {
        prop: "groupPageConfigCardProps",
        type: "div",
        vIf: "form.pageConfig && form.pageConfig.cardProps",
        children: [
          {
            label: "页面卡片边框",
            prop: "pageConfig.cardProps.bordered",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "页面卡片阴影",
            prop: "pageConfig.cardProps.shadow",
            type: "switch",
            props: { activeValue: "always", inactiveValue: "never" }
          },
          {
            label: "卡片内表格高度撑满",
            prop: "pageConfig.cardProps.flexTable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "页面卡片主体样式",
            prop: "pageConfig.cardProps.bodyStyle",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "页面卡片样式",
            prop: "pageConfig.cardProps.style",
            type: "proFormBuilderStyleEdit"
          }
        ]
      },
      {
        label: "表格卡片",
        prop: "groupTableCardLabel",
        type: "label",
        props: { class: "ele-pro-form-builder-props-group-label" }
      },
      {
        label: "表格包裹卡片",
        prop: "listConfig.cardProps",
        type: "crudBuilderSwitch",
        props: { defaultValue: false }
      },
      {
        prop: "groupListConfigCardProps",
        type: "div",
        vIf: "form.listConfig && form.listConfig.cardProps",
        children: [
          {
            label: "表格卡片边框",
            prop: "listConfig.cardProps.bordered",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "表格卡片阴影",
            prop: "listConfig.cardProps.shadow",
            type: "switch",
            props: { activeValue: "always", inactiveValue: "never" }
          },
          {
            label: "表格高度撑满",
            prop: "listConfig.cardProps.flexTable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "表格卡片主体样式",
            prop: "listConfig.cardProps.bodyStyle",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表格卡片样式",
            prop: "listConfig.cardProps.style",
            type: "proFormBuilderStyleEdit"
          }
        ]
      }
    ]
  },
  {
    label: "表格配置",
    prop: "groupTableConfig",
    type: "div",
    props: { class: "ele-crud-builder-page-config-group" },
    children: [
      {
        label: "表格属性",
        prop: "groupTablePropsLabel",
        type: "label",
        props: { class: "ele-pro-form-builder-props-group-label" }
      },
      {
        label: "表格行数据Key",
        prop: "listConfig.tableProps.rowKey",
        type: "input"
      },
      {
        label: "表格高度",
        prop: "listConfig.tableProps.height",
        type: "inputNumber",
        props: { min: 1 }
      },
      {
        label: "是否显示斑马纹",
        prop: "listConfig.tableProps.stripe",
        type: "switch",
        props: { activeValue: true, inactiveValue: false }
      },
      {
        label: "是否显示边框",
        prop: "listConfig.tableProps.border",
        type: "switch",
        props: { activeValue: true, inactiveValue: false }
      },
      {
        label: "表格尺寸",
        prop: "listConfig.tableProps.size",
        type: "checkCard",
        props: {
          allowUncheck: true,
          items: [
            { value: "large", label: "宽松" },
            { value: "default", label: "中等" },
            { value: "small", label: "紧凑" }
          ],
          class: "ele-pro-form-builder-props-options-check-card"
        }
      },
      {
        label: "是否显示表头",
        prop: "listConfig.tableProps.showHeader",
        type: "switch",
        props: { activeValue: true, inactiveValue: false },
        initValue: true
      },
      {
        label: "是否高亮点击行",
        prop: "listConfig.tableProps.highlightCurrentRow",
        type: "switch",
        props: { activeValue: true, inactiveValue: false }
      },
      {
        label: "单元格溢出省略",
        prop: "listConfig.tableProps.showOverflowTooltip",
        type: "crudBuilderSwitch",
        props: { defaultValue: false }
      },
      {
        label: "表头单元格溢出省略",
        prop: "listConfig.tableProps.headerEllipsis",
        type: "switch",
        props: { activeValue: true, inactiveValue: false },
        initValue: true
      },
      {
        label: "树表格默认展开所有",
        prop: "listConfig.tableProps.defaultExpandAll",
        type: "switch",
        props: { activeValue: true, inactiveValue: false }
      },
      {
        label: "是否显示表尾合计行",
        prop: "listConfig.tableProps.showSummary",
        type: "switch",
        props: { activeValue: true, inactiveValue: false }
      },
      {
        label: "表尾合计行第一列文本",
        prop: "listConfig.tableProps.sumText",
        type: "input"
      },
      {
        label: "树表格是否懒加载",
        prop: "listConfig.tableProps.lazy",
        type: "switch",
        props: { activeValue: true, inactiveValue: false }
      },
      {
        label: "是否使用虚拟滚动表格",
        prop: "listConfig.tableProps.virtual",
        type: "switch",
        props: { activeValue: true, inactiveValue: false }
      },
      {
        label: "表格主体样式",
        prop: "listConfig.tableProps.tableStyle",
        type: "proFormBuilderStyleEdit"
      },
      {
        label: "表格样式",
        prop: "listConfig.tableProps.style",
        type: "proFormBuilderStyleEdit"
      },
      {
        label: "表头操作按钮",
        prop: "groupTableToolLabel",
        type: "label",
        props: { class: "ele-pro-form-builder-props-group-label" }
      },
      {
        label: "添加按钮",
        prop: "listConfig.addBtnProps",
        type: "crudBuilderSwitch"
      },
      {
        label: "批量删除按钮",
        prop: "listConfig.delBtnProps",
        type: "crudBuilderSwitch"
      },
      {
        label: "表格操作列",
        prop: "groupTableActionLabel",
        type: "label",
        props: { class: "ele-pro-form-builder-props-group-label" }
      },
      {
        label: "显示操作列",
        prop: "listConfig.actionColumnProps",
        type: "crudBuilderSwitch"
      },
      {
        prop: "groupListConfigActionColumnProps",
        type: "div",
        vIf: "!form.listConfig || form.listConfig.actionColumnProps!==false",
        children: [
          {
            label: "修改按钮",
            prop: "listConfig.editLinkProps",
            type: "crudBuilderSwitch"
          },
          {
            label: "删除按钮",
            prop: "listConfig.delLinkProps",
            type: "crudBuilderSwitch"
          },
          {
            label: "操作列标题",
            prop: "listConfig.actionColumnProps.label",
            type: "input"
          },
          {
            label: "操作列宽度",
            prop: "listConfig.actionColumnProps.width",
            type: "inputNumber"
          },
          {
            label: "操作列对齐方式",
            prop: "listConfig.actionColumnProps.align",
            type: "checkCard",
            props: {
              allowUncheck: true,
              items: [
                { value: "left", label: "左对齐" },
                { value: "center", label: "居中" },
                { value: "right", label: "右对齐" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "操作列固定位置",
            prop: "listConfig.actionColumnProps.fixed",
            type: "checkCard",
            props: {
              allowUncheck: true,
              items: [
                { value: false, label: "不固定" },
                { value: "left", label: "左侧" },
                { value: "right", label: "右侧" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          }
        ]
      },
      {
        label: "表格多选列",
        prop: "groupTableSelectionLabel",
        type: "label",
        props: { class: "ele-pro-form-builder-props-group-label" }
      },
      {
        label: "显示多选列",
        prop: "listConfig.selectionColumnProps",
        type: "crudBuilderSwitch"
      },
      {
        prop: "groupListConfigSelectionColumnProps",
        type: "div",
        vIf: "!form.listConfig || form.listConfig.selectionColumnProps!==false",
        children: [
          {
            label: "多选列宽度",
            prop: "listConfig.selectionColumnProps.width",
            type: "inputNumber"
          },
          {
            label: "多选列对齐方式",
            prop: "listConfig.selectionColumnProps.align",
            type: "checkCard",
            props: {
              allowUncheck: true,
              items: [
                { value: "left", label: "左对齐" },
                { value: "center", label: "居中" },
                { value: "right", label: "右对齐" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "多选列固定位置",
            prop: "listConfig.selectionColumnProps.fixed",
            type: "checkCard",
            props: {
              allowUncheck: true,
              items: [
                { value: false, label: "不固定" },
                { value: "left", label: "左侧" },
                { value: "right", label: "右侧" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          }
        ]
      },
      {
        label: "表格序号列",
        prop: "groupTableIndexLabel",
        type: "label",
        props: { class: "ele-pro-form-builder-props-group-label" }
      },
      {
        label: "显示序号列",
        prop: "listConfig.indexColumnProps",
        type: "crudBuilderSwitch"
      },
      {
        prop: "groupListConfigIndexColumnProps",
        type: "div",
        vIf: "!form.listConfig || form.listConfig.indexColumnProps!==false",
        children: [
          {
            label: "序号列标题",
            prop: "listConfig.indexColumnProps.label",
            type: "input"
          },
          {
            label: "序号列宽度",
            prop: "listConfig.indexColumnProps.width",
            type: "inputNumber"
          },
          {
            label: "序号列对齐方式",
            prop: "listConfig.indexColumnProps.align",
            type: "checkCard",
            props: {
              allowUncheck: true,
              items: [
                { value: "left", label: "左对齐" },
                { value: "center", label: "居中" },
                { value: "right", label: "右对齐" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "序号列固定位置",
            prop: "listConfig.indexColumnProps.fixed",
            type: "checkCard",
            props: {
              allowUncheck: true,
              items: [
                { value: false, label: "不固定" },
                { value: "left", label: "左侧" },
                { value: "right", label: "右侧" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          }
        ]
      }
    ]
  },
  {
    label: "左树右表",
    prop: "groupSplitConfig",
    type: "div",
    props: { class: "ele-crud-builder-page-config-group" },
    children: [
      {
        label: "左树右表",
        prop: "groupPageConfigSplitPanelPropsLabel",
        type: "label",
        props: { class: "ele-pro-form-builder-props-group-label" }
      },
      {
        label: "开启左树右表",
        prop: "pageConfig.splitPanelProps",
        type: "crudBuilderSwitch",
        props: { defaultValue: false }
      },
      {
        prop: "groupPageConfigSplitPanelProps",
        type: "div",
        vIf: "form.pageConfig && form.pageConfig.splitPanelProps",
        children: [
          {
            label: "树查询接口",
            prop: "treeListApi",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "树查询接口设置",
              isTreeData: true,
              codeOptions: true,
              codeTips,
              codePlaceholder: `async () => {
    // 示例
    const res = await httpRequest.get('/system/organization');
    return res.data.data;
}
`,
              codePrefix: codeStringPrefix
            }
          },
          {
            label: "左树对表格的查询参数名",
            prop: "pageConfig.tableFilterField",
            type: "input",
            props: { placeholder: "请输入参数名" }
          },
          {
            label: "树属性",
            prop: "groupTreePropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "树节点数据Key",
            prop: "pageConfig.sideConfig.treeProps.nodeKey",
            type: "input"
          },
          {
            label: "树节点名称的字段名",
            prop: "pageConfig.sideConfig.treeProps.props.label",
            type: "input"
          },
          {
            label: "树节点子级的字段名",
            prop: "pageConfig.sideConfig.treeProps.props.children",
            type: "input"
          },
          {
            label: "树节点禁用状态的字段名",
            prop: "pageConfig.sideConfig.treeProps.props.disabled",
            type: "input"
          },
          {
            label: "树缩进",
            prop: "pageConfig.sideConfig.treeProps.indent",
            type: "inputNumber"
          },
          {
            label: "点击父节点展开收缩",
            prop: "pageConfig.sideConfig.treeProps.expandOnClickNode",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "树展开手风琴效果",
            prop: "pageConfig.sideConfig.treeProps.accordion",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "树样式",
            prop: "pageConfig.sideConfig.treeProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "树容器样式",
            prop: "pageConfig.sideConfig.loadingProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "分割面板属性",
            prop: "groupSplitPanelPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "分割面板侧栏大小",
            prop: "pageConfig.splitPanelProps.size",
            type: "input"
          },
          {
            label: "分割面板是否可折叠",
            prop: "pageConfig.splitPanelProps.allowCollapse",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "分割面板是否可拉伸宽度",
            prop: "pageConfig.splitPanelProps.resizable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "分割面板内表格高度撑满",
            prop: "pageConfig.splitPanelProps.flexTable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "分割面板侧栏样式",
            prop: "pageConfig.splitPanelProps.customStyle",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "分割面板内容样式",
            prop: "pageConfig.splitPanelProps.bodyStyle",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "分割面板折叠按钮样式",
            prop: "pageConfig.splitPanelProps.collapseStyle",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "树顶部搜索栏属性",
            prop: "groupSideSearchPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示树顶部搜索栏",
            prop: "pageConfig.sideConfig.searchProps",
            type: "crudBuilderSwitch"
          },
          {
            prop: "groupPageConfigSideConfigSearchProps",
            type: "div",
            vIf: "!form.pageConfig || !form.pageConfig.sideConfig || form.pageConfig.sideConfig.searchProps!==false",
            children: [
              {
                label: "搜索输入框提示文本",
                prop: "pageConfig.sideConfig.searchInputProps.placeholder",
                type: "input"
              },
              {
                label: "搜索输入框样式",
                prop: "pageConfig.sideConfig.searchInputProps.style",
                type: "proFormBuilderStyleEdit"
              },
              {
                label: "搜索栏样式",
                prop: "pageConfig.sideConfig.searchProps.style",
                type: "proFormBuilderStyleEdit"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    label: "搜索栏",
    prop: "groupSearchCofnig",
    type: "div",
    props: {
      class: "ele-crud-builder-page-config-group",
      style: { paddingTop: "10px" }
    },
    children: [
      {
        label: "搜索表单设计",
        prop: "searchFormBuilder",
        type: "crudBuilderFormDesign",
        itemType: "view",
        props: { type: "search" }
      },
      {
        label: "搜索栏包裹卡片",
        prop: "searchConfig.cardProps",
        type: "crudBuilderSwitch",
        props: { defaultValue: false },
        itemProps: { style: { marginTop: "12px" } }
      },
      {
        prop: "groupSearchConfigCardProps",
        type: "div",
        vIf: "form.searchConfig && form.searchConfig.cardProps",
        children: [
          {
            label: "搜索栏卡片边框",
            prop: "searchConfig.cardProps.bordered",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "搜索栏卡片阴影",
            prop: "searchConfig.cardProps.shadow",
            type: "switch",
            props: { activeValue: "always", inactiveValue: "never" }
          },
          {
            label: "搜索栏卡片主体样式",
            prop: "searchConfig.cardProps.bodyStyle",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "搜索栏卡片样式",
            prop: "searchConfig.cardProps.style",
            type: "proFormBuilderStyleEdit"
          }
        ]
      }
    ]
  },
  {
    label: "添加弹窗",
    prop: "groupAddConfig",
    type: "div",
    props: {
      class: "ele-crud-builder-page-config-group",
      style: { paddingTop: "10px" }
    },
    children: [
      {
        label: "添加表单设计",
        prop: "addFormBuilder",
        type: "crudBuilderFormDesign",
        itemType: "view",
        props: { type: "add" }
      },
      {
        label: "弹窗标题",
        prop: "addConfig.modalProps.title",
        type: "input",
        itemProps: { style: { marginTop: "12px" } }
      },
      {
        label: "弹窗宽度",
        prop: "addConfig.modalProps.width",
        type: "input"
      },
      {
        label: "弹窗默认全屏",
        prop: "addConfig.modalProps.fullscreen",
        type: "switch",
        props: { activeValue: true, inactiveValue: false }
      },
      {
        label: "弹窗可点击遮罩关闭",
        prop: "addConfig.modalProps.closeOnClickModal",
        type: "switch",
        props: { activeValue: true, inactiveValue: false },
        initValue: true
      },
      {
        label: "弹窗可按ESC键关闭",
        prop: "addConfig.modalProps.closeOnPressEscape",
        type: "switch",
        props: { activeValue: true, inactiveValue: false },
        initValue: true
      },
      {
        label: "弹窗最大化按钮",
        prop: "addConfig.modalProps.maxable",
        type: "switch",
        props: { activeValue: true, inactiveValue: false }
      },
      {
        label: "弹窗取消遮罩",
        prop: "addConfig.modalProps.multiple",
        type: "switch",
        props: { activeValue: true, inactiveValue: false }
      },
      {
        label: "弹窗限制在主体内部",
        prop: "addConfig.modalProps.inner",
        type: "switch",
        props: { activeValue: true, inactiveValue: false }
      },
      {
        label: "弹窗标题栏样式",
        prop: "addConfig.modalProps.headerStyle",
        type: "proFormBuilderStyleEdit"
      },
      {
        label: "弹窗主体样式",
        prop: "addConfig.modalProps.bodyStyle",
        type: "proFormBuilderStyleEdit"
      },
      {
        label: "弹窗底栏样式",
        prop: "addConfig.modalProps.footerStyle",
        type: "proFormBuilderStyleEdit"
      },
      {
        label: "弹窗关闭按钮样式",
        prop: "addConfig.modalProps.closeBtnStyle",
        type: "proFormBuilderStyleEdit"
      },
      {
        label: "弹窗最大化按钮样式",
        prop: "addConfig.modalProps.fullscreenBtnStyle",
        type: "proFormBuilderStyleEdit"
      }
    ]
  },
  {
    label: "修改弹窗",
    prop: "groupEditConfig",
    type: "div",
    props: {
      class: "ele-crud-builder-page-config-group",
      style: { paddingTop: "10px" }
    },
    children: [
      {
        label: "修改表单设计",
        prop: "editFormBuilder",
        type: "crudBuilderFormDesign",
        itemType: "view",
        props: { type: "edit" }
      },
      {
        label: "弹窗标题",
        prop: "editConfig.modalProps.title",
        type: "input",
        itemProps: { style: { marginTop: "12px" } }
      },
      {
        label: "弹窗宽度",
        prop: "editConfig.modalProps.width",
        type: "input"
      },
      {
        label: "弹窗默认全屏",
        prop: "editConfig.modalProps.fullscreen",
        type: "switch",
        props: { activeValue: true, inactiveValue: false }
      },
      {
        label: "弹窗可点击遮罩关闭",
        prop: "editConfig.modalProps.closeOnClickModal",
        type: "switch",
        props: { activeValue: true, inactiveValue: false },
        initValue: true
      },
      {
        label: "弹窗可按ESC键关闭",
        prop: "editConfig.modalProps.closeOnPressEscape",
        type: "switch",
        props: { activeValue: true, inactiveValue: false },
        initValue: true
      },
      {
        label: "弹窗最大化按钮",
        prop: "editConfig.modalProps.maxable",
        type: "switch",
        props: { activeValue: true, inactiveValue: false }
      },
      {
        label: "弹窗取消遮罩",
        prop: "editConfig.modalProps.multiple",
        type: "switch",
        props: { activeValue: true, inactiveValue: false }
      },
      {
        label: "弹窗限制在主体内部",
        prop: "editConfig.modalProps.inner",
        type: "switch",
        props: { activeValue: true, inactiveValue: false }
      },
      {
        label: "弹窗标题栏样式",
        prop: "editConfig.modalProps.headerStyle",
        type: "proFormBuilderStyleEdit"
      },
      {
        label: "弹窗主体样式",
        prop: "editConfig.modalProps.bodyStyle",
        type: "proFormBuilderStyleEdit"
      },
      {
        label: "弹窗底栏样式",
        prop: "editConfig.modalProps.footerStyle",
        type: "proFormBuilderStyleEdit"
      },
      {
        label: "弹窗关闭按钮样式",
        prop: "editConfig.modalProps.closeBtnStyle",
        type: "proFormBuilderStyleEdit"
      },
      {
        label: "弹窗最大化按钮样式",
        prop: "editConfig.modalProps.fullscreenBtnStyle",
        type: "proFormBuilderStyleEdit"
      }
    ]
  },
  {
    prop: "groupAdvancedConfig",
    type: "div",
    props: {
      class: "ele-crud-builder-page-config-group",
      style: { paddingBottom: "10px" }
    },
    children: [
      {
        label: "高级配置",
        prop: "groupAdvancedLabel",
        type: "label",
        props: { class: "ele-pro-form-builder-props-group-label" }
      },
      {
        prop: "__sourceCode",
        type: "proFormBuilderSourceEdit",
        itemType: "view",
        props: { title: "编辑源码", excludeFields: ["fields"] }
      }
    ]
  }
];
const defaultFieldEditFormItems = [
  {
    label: "属性名",
    prop: "prop",
    type: "input"
  },
  {
    label: "字段名",
    prop: "label",
    type: "input"
  },
  {
    label: "不显示在列表中",
    prop: "hideInList",
    type: "checkCard",
    props: {
      allowUncheck: true,
      items: [
        { value: false, label: "否" },
        { value: true, label: "是" },
        { value: "flat", label: "平铺子级" }
      ],
      class: "ele-pro-form-builder-props-options-check-card"
    },
    initValue: false
  },
  {
    label: "不显示在搜索栏中",
    prop: "hideInSearch",
    type: "checkCard",
    props: {
      allowUncheck: true,
      items: [
        { value: false, label: "否" },
        { value: true, label: "是" },
        { value: "flat", label: "平铺子级" }
      ],
      class: "ele-pro-form-builder-props-options-check-card"
    },
    initValue: false
  },
  {
    label: "不显示在添加表单中",
    prop: "hideInAdd",
    type: "checkCard",
    props: {
      allowUncheck: true,
      items: [
        { value: false, label: "否" },
        { value: true, label: "是" },
        { value: "flat", label: "平铺子级" }
      ],
      class: "ele-pro-form-builder-props-options-check-card"
    },
    initValue: false
  },
  {
    label: "不显示在修改表单中",
    prop: "hideInEdit",
    type: "checkCard",
    props: {
      allowUncheck: true,
      items: [
        { value: false, label: "否" },
        { value: true, label: "是" },
        { value: "flat", label: "平铺子级" }
      ],
      class: "ele-pro-form-builder-props-options-check-card"
    },
    initValue: false
  },
  {
    prop: "groupColumnProps",
    type: "div",
    vIf: "!form.hideInList",
    children: [
      {
        label: "表格列配置",
        prop: "groupColumnLabel",
        type: "label",
        props: { class: "ele-pro-form-builder-props-group-label" }
      },
      {
        label: "对齐方式",
        prop: "columnProps.align",
        type: "checkCard",
        props: {
          allowUncheck: true,
          items: [
            { value: "left", label: "左对齐" },
            { value: "center", label: "居中" },
            { value: "right", label: "右对齐" }
          ],
          class: "ele-pro-form-builder-props-options-check-card"
        },
        initValue: "left"
      },
      {
        label: "列宽",
        prop: "columnProps.width",
        type: "inputNumber"
      },
      {
        label: "最小列宽",
        prop: "columnProps.minWidth",
        type: "inputNumber"
      },
      {
        label: "支持排序",
        prop: "columnProps.sortable",
        type: "checkCard",
        props: {
          allowUncheck: true,
          items: [
            { value: true, label: "true" },
            { value: false, label: "false" },
            { value: "custom", label: "custom" }
          ],
          class: "ele-pro-form-builder-props-options-check-card"
        },
        initValue: false
      },
      {
        label: "固定位置",
        prop: "columnProps.fixed",
        type: "checkCard",
        props: {
          allowUncheck: true,
          items: [
            { value: false, label: "不固定" },
            { value: "left", label: "左侧" },
            { value: "right", label: "右侧" }
          ],
          class: "ele-pro-form-builder-props-options-check-card"
        },
        initValue: false
      },
      {
        label: "ColumnKey",
        prop: "columnProps.columnKey",
        type: "input"
      }
    ]
  },
  {
    prop: "groupAddItemProps",
    type: "div",
    vIf: "!form.hideInAdd",
    children: [
      {
        label: "添加表单项配置",
        prop: "groupColumnLabel",
        type: "label",
        props: { class: "ele-pro-form-builder-props-group-label" }
      },
      {
        label: "是否必填",
        prop: "addItemProps.required",
        type: "switch",
        props: { activeValue: true, inactiveValue: false }
      },
      {
        label: "必填校验信息",
        prop: "addItemProps.requiredMessage",
        type: "input"
      }
    ]
  },
  {
    prop: "groupEditItemProps",
    type: "div",
    vIf: "!form.hideInEdit",
    children: [
      {
        label: "修改表单项配置",
        prop: "groupColumnLabel",
        type: "label",
        props: { class: "ele-pro-form-builder-props-group-label" }
      },
      {
        label: "是否必填",
        prop: "editItemProps.required",
        type: "switch",
        props: { activeValue: true, inactiveValue: false }
      },
      {
        label: "必填校验信息",
        prop: "editItemProps.requiredMessage",
        type: "input"
      }
    ]
  },
  {
    label: "高级配置",
    prop: "groupAdvancedLabel",
    type: "label",
    props: { class: "ele-pro-form-builder-props-group-label" }
  },
  {
    prop: "__sourceCode",
    type: "proFormBuilderSourceEdit",
    itemType: "view",
    props: { title: "编辑源码" }
  }
];
export {
  codeTips,
  defaultFieldEditFormItems,
  defaultHeaderRightTools,
  defaultPageConfigFormItems,
  generateUniqueItemKey,
  itemsGenerateNewKey
};
