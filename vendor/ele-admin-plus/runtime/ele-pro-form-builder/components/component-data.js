import { covers } from "./covers";
const codeTips = `/** 全局变量
 * \`form\` 表单数据,
 * \`items\` 全部表单项,
 * \`searchExpand\` 展开状态,
 * \`getProFormRefs\` 获取组件引用,
 * \`httpRequest\` 请求工具
 */`;
const vIfCodeTips = `/** 全局变量
 * \`form\` 表单数据,
 * \`items\` 全部表单项,
 * \`searchExpand\` 展开状态
 */`;
const defaultComponentData = [
  {
    name: "表单类型组件",
    items: [
      {
        type: "input",
        name: "输入框",
        cover: covers.input,
        presetProps: { type: "text" },
        defaultProps: { clearable: true },
        initialProps: { placeholder: "" },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "input"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "占位文本",
            prop: "props.placeholder",
            type: "input"
          },
          {
            label: "最大输入长度",
            prop: "props.maxlength",
            type: "inputNumber",
            props: { min: 1, step: 1, stepStrictly: true }
          },
          {
            label: "清除按钮",
            prop: "props.clearable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否只读",
            prop: "props.readonly",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "类型",
            prop: "props.type",
            type: "checkCard",
            props: {
              items: [
                { value: "text", label: "text" },
                { value: "password", label: "password" }
              ],
              class: "ele-pro-form-builder-props-options-check-card is-loose"
            }
          },
          {
            label: "是否显示密码切换图标",
            prop: "props.showPassword",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "自动获取焦点",
            prop: "props.autofocus",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "前缀图标",
            prop: "props.prefixIcon",
            type: "proFormBuilderIconInput"
          },
          {
            label: "后缀图标",
            prop: "props.suffixIcon",
            type: "proFormBuilderIconInput"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "失去焦点",
            prop: "props.onBlur",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 blur 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "获得焦点",
            prop: "props.onFocus",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 focus 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "值改变后失去焦点或按 Enter",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "值改变",
            prop: "props.onInput",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 input 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "清空按钮点击",
            prop: "props.onClear",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 clear 事件",
              codeTips,
              codePlaceholder: "() => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElInput"
      },
      {
        type: "textarea",
        name: "文本域",
        cover: covers.textarea,
        presetProps: { rows: 2 },
        defaultProps: { rows: 4 },
        initialProps: { placeholder: "" },
        reservedProps: { type: "textarea" },
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "textarea"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "占位文本",
            prop: "props.placeholder",
            type: "textarea"
          },
          {
            label: "最大输入长度",
            prop: "props.maxlength",
            type: "inputNumber",
            props: { min: 1, step: 1, stepStrictly: true }
          },
          {
            label: "输入框行数",
            prop: "props.rows",
            type: "inputNumber",
            props: { min: 1, step: 1, stepStrictly: true }
          },
          {
            label: "显示统计字数",
            prop: "props.showWordLimit",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否只读",
            prop: "props.readonly",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "自动获取焦点",
            prop: "props.autofocus",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "失去焦点",
            prop: "props.onBlur",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 blur 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "获得焦点",
            prop: "props.onFocus",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 focus 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "值改变后失去焦点或按 Enter",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "值改变",
            prop: "props.onInput",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 input 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElInput"
      },
      {
        type: "select",
        name: "下拉",
        cover: covers.select,
        presetProps: {},
        defaultProps: { class: "ele-fluid", clearable: true },
        initialProps: {
          placeholder: "",
          options: [
            { label: "选项一", value: "1" },
            { label: "选项二", value: "2" }
          ]
        },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "input"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选项数据",
            prop: "props.options",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑选项数据",
              isTreeData: { maxDepth: 2 },
              codeOptions: true,
              codeTips,
              codePlaceholder: `async () => {
    // 示例
    const res = await httpRequest.get('/system/user');
    return res.data.data.map(d => ({ label: d.nickname, value: d.userId }));
}
`
            }
          },
          {
            label: "占位文本",
            prop: "props.placeholder",
            type: "input"
          },
          {
            label: "清除按钮",
            prop: "props.clearable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否只读",
            prop: "props.readonly",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否可搜索",
            prop: "props.filterable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "搜索无匹配时允许新建",
            prop: "props.allowCreate",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "搜索无匹配时的显示文字",
            prop: "props.noMatchText",
            type: "input"
          },
          {
            label: "无选项时的显示文字",
            prop: "props.noDataText",
            type: "input"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "下拉框出现/隐藏",
            prop: "props.onVisibleChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 visibleChange 事件",
              codeTips,
              codePlaceholder: "(visible) => {\n\n}"
            }
          },
          {
            label: "清空按钮点击",
            prop: "props.onClear",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 clear 事件",
              codeTips,
              codePlaceholder: "() => {\n\n}"
            }
          },
          {
            label: "失去焦点",
            prop: "props.onBlur",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 blur 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "获得焦点",
            prop: "props.onFocus",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 focus 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleSelect"
      },
      {
        type: "multipleSelect",
        name: "下拉多选",
        cover: covers.multipleSelect,
        presetProps: { reserveKeyword: true, maxCollapseTags: 1 },
        defaultProps: { class: "ele-fluid", clearable: true },
        initialProps: {
          placeholder: "",
          options: [
            { label: "选项一", value: "1" },
            { label: "选项二", value: "2" }
          ]
        },
        reservedProps: { multiple: true },
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "editTag"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选项数据",
            prop: "props.options",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑选项数据",
              isTreeData: { maxDepth: 2 },
              codeOptions: true,
              codeTips,
              codePlaceholder: `async () => {
    // 示例
    const res = await httpRequest.get('/system/user');
    return res.data.data.map(d => ({ label: d.nickname, value: d.userId }));
}
`
            }
          },
          {
            label: "占位文本",
            prop: "props.placeholder",
            type: "input"
          },
          {
            label: "清除按钮",
            prop: "props.clearable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否只读",
            prop: "props.readonly",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否可搜索",
            prop: "props.filterable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "搜索无匹配时允许新建",
            prop: "props.allowCreate",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "搜索无匹配时的显示文字",
            prop: "props.noMatchText",
            type: "input"
          },
          {
            label: "无选项时的显示文字",
            prop: "props.noDataText",
            type: "input"
          },
          {
            label: "最大可选择数量",
            prop: "props.multipleLimit",
            type: "inputNumber",
            props: { min: 1, step: 1, stepStrictly: true }
          },
          {
            label: "折叠显示 Tag",
            prop: "props.collapseTags",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "最大显示 Tag 数量",
            prop: "props.maxCollapseTags",
            type: "inputNumber",
            props: { min: 1, step: 1, stepStrictly: true }
          },
          {
            label: "悬浮显示折叠的 Tag",
            prop: "props.collapseTagsTooltip",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "选中后保留当前搜索输入",
            prop: "props.reserveKeyword",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "下拉框出现/隐藏",
            prop: "props.onVisibleChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 visibleChange 事件",
              codeTips,
              codePlaceholder: "(visible) => {\n\n}"
            }
          },
          {
            label: "移除 tag",
            prop: "props.onRemoveTag",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 removeTag 事件",
              codeTips,
              codePlaceholder: "(tagValue) => {\n\n}"
            }
          },
          {
            label: "清空按钮点击",
            prop: "props.onClear",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 clear 事件",
              codeTips,
              codePlaceholder: "() => {\n\n}"
            }
          },
          {
            label: "失去焦点",
            prop: "props.onBlur",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 blur 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "获得焦点",
            prop: "props.onFocus",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 focus 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleSelect"
      },
      {
        type: "radio",
        name: "单选",
        cover: covers.radio,
        presetProps: {},
        defaultProps: {},
        initialProps: {
          options: [
            { label: "选项一", value: "1" },
            { label: "选项二", value: "2" }
          ]
        },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "input"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选项数据",
            prop: "props.options",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑选项数据",
              columns: [
                {
                  prop: "label",
                  label: "文本",
                  style: { textAlign: "center" }
                },
                { prop: "value", label: "值", style: { textAlign: "center" } },
                {
                  prop: "border",
                  label: "边框",
                  style: { textAlign: "center", width: "80px", flex: "none" },
                  editType: "switch"
                }
              ],
              codeOptions: true,
              codeTips,
              codePlaceholder: `async () => {
    // 示例
    const res = await httpRequest.get('/system/user');
    return res.data.data.map(d => ({ label: d.nickname, value: d.userId }));
}
`
            }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleRadioGroup"
      },
      {
        type: "radioButton",
        name: "单选按钮",
        cover: covers.radioButton,
        presetProps: {},
        defaultProps: {},
        initialProps: {
          options: [
            { label: "选项一", value: "1" },
            { label: "选项二", value: "2" }
          ]
        },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "input"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选项数据",
            prop: "props.options",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑选项数据",
              codeOptions: true,
              codeTips,
              codePlaceholder: `async () => {
    // 示例
    const res = await httpRequest.get('/system/user');
    return res.data.data.map(d => ({ label: d.nickname, value: d.userId }));
}
`
            }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleRadioGroup"
      },
      {
        type: "checkbox",
        name: "多选",
        cover: covers.checkbox,
        presetProps: {},
        defaultProps: {},
        initialProps: {
          options: [
            { label: "选项一", value: "1" },
            { label: "选项二", value: "2" }
          ]
        },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "editTag"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选项数据",
            prop: "props.options",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑选项数据",
              columns: [
                {
                  prop: "label",
                  label: "文本",
                  style: { textAlign: "center" }
                },
                { prop: "value", label: "值", style: { textAlign: "center" } },
                {
                  prop: "border",
                  label: "边框",
                  style: { textAlign: "center", width: "80px", flex: "none" },
                  editType: "switch"
                }
              ],
              codeOptions: true,
              codeTips,
              codePlaceholder: `async () => {
    // 示例
    const res = await httpRequest.get('/system/user');
    return res.data.data.map(d => ({ label: d.nickname, value: d.userId }));
}
`
            }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "最大选择数量",
            prop: "props.max",
            type: "inputNumber",
            props: { min: 1, step: 1, stepStrictly: true }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleCheckboxGroup"
      },
      {
        type: "checkboxButton",
        name: "多选按钮",
        cover: covers.checkboxButton,
        presetProps: {},
        defaultProps: {},
        initialProps: {
          options: [
            { label: "选项一", value: "1" },
            { label: "选项二", value: "2" }
          ]
        },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "editTag"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选项数据",
            prop: "props.options",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑选项数据",
              codeOptions: true,
              codeTips,
              codePlaceholder: `async () => {
    // 示例
    const res = await httpRequest.get('/system/user');
    return res.data.data.map(d => ({ label: d.nickname, value: d.userId }));
}
`
            }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "最大选择数量",
            prop: "props.max",
            type: "inputNumber",
            props: { min: 1, step: 1, stepStrictly: true }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleCheckboxGroup"
      },
      {
        type: "date",
        name: "日期选择",
        cover: covers.date,
        presetProps: { clearable: true, editable: true, type: "date" },
        defaultProps: { class: "ele-fluid", valueFormat: "YYYY-MM-DD" },
        initialProps: { placeholder: "" },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "input"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "占位文本",
            prop: "props.placeholder",
            type: "input"
          },
          {
            label: "清除按钮",
            prop: "props.clearable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否只读",
            prop: "props.readonly",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否可输入",
            prop: "props.editable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "显示格式",
            prop: "props.format",
            type: "input"
          },
          {
            label: "值格式",
            prop: "props.valueFormat",
            type: "input"
          },
          {
            label: "类型",
            prop: "props.type",
            type: "checkCard",
            props: {
              items: [
                { value: "date", label: "日期选择" },
                { value: "dates", label: "日期多选" },
                { value: "week", label: "周选择" },
                { value: "month", label: "月选择" },
                { value: "months", label: "月多选" },
                { value: "year", label: "年选择" },
                { value: "years", label: "年多选" }
              ],
              class: "ele-pro-form-builder-props-options-check-card is-loose"
            }
          },
          {
            label: "前缀图标",
            prop: "props.prefixIcon",
            type: "proFormBuilderIconInput"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "失去焦点",
            prop: "props.onBlur",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 blur 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "获得焦点",
            prop: "props.onFocus",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 focus 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "清空按钮点击",
            prop: "props.onClear",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 clear 事件",
              codeTips,
              codePlaceholder: "() => {\n\n}"
            }
          },
          {
            label: "下拉框出现/隐藏",
            prop: "props.onVisibleChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 visibleChange 事件",
              codeTips,
              codePlaceholder: "(visible) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElDatePicker"
      },
      {
        type: "datetime",
        name: "日期时间选择",
        cover: covers.datetime,
        presetProps: { clearable: true, editable: true },
        defaultProps: {
          class: "ele-fluid",
          valueFormat: "YYYY-MM-DD HH:mm:ss"
        },
        initialProps: { placeholder: "" },
        reservedProps: { type: "datetime" },
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "input"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "占位文本",
            prop: "props.placeholder",
            type: "input"
          },
          {
            label: "清除按钮",
            prop: "props.clearable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否只读",
            prop: "props.readonly",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否可输入",
            prop: "props.editable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "显示格式",
            prop: "props.format",
            type: "input"
          },
          {
            label: "值格式",
            prop: "props.valueFormat",
            type: "input"
          },
          {
            label: "前缀图标",
            prop: "props.prefixIcon",
            type: "proFormBuilderIconInput"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "失去焦点",
            prop: "props.onBlur",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 blur 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "获得焦点",
            prop: "props.onFocus",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 focus 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "清空按钮点击",
            prop: "props.onClear",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 clear 事件",
              codeTips,
              codePlaceholder: "() => {\n\n}"
            }
          },
          {
            label: "下拉框出现/隐藏",
            prop: "props.onVisibleChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 visibleChange 事件",
              codeTips,
              codePlaceholder: "(visible) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElDatePicker"
      },
      {
        type: "daterange",
        name: "日期范围选择",
        cover: covers.daterange,
        presetProps: { clearable: true, editable: true },
        defaultProps: {
          class: "ele-fluid",
          valueFormat: "YYYY-MM-DD",
          rangeSeparator: "-",
          startPlaceholder: "开始日期",
          endPlaceholder: "结束日期",
          unlinkPanels: true,
          type: "daterange"
        },
        initialProps: {},
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "input"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "开始日期占位内容",
            prop: "props.startPlaceholder",
            type: "input"
          },
          {
            label: "结束日期占位内容",
            prop: "props.endPlaceholder",
            type: "input"
          },
          {
            label: "分隔符",
            prop: "props.rangeSeparator",
            type: "input"
          },
          {
            label: "清除按钮",
            prop: "props.clearable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否只读",
            prop: "props.readonly",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否可输入",
            prop: "props.editable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "显示格式",
            prop: "props.format",
            type: "input"
          },
          {
            label: "值格式",
            prop: "props.valueFormat",
            type: "input"
          },
          {
            label: "取消两个日期面板联动",
            prop: "props.unlinkPanels",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "类型",
            prop: "props.type",
            type: "checkCard",
            props: {
              items: [
                { value: "daterange", label: "日期范围" },
                { value: "monthrange", label: "月范围" },
                { value: "yearrange", label: "年范围" }
              ],
              class: "ele-pro-form-builder-props-options-check-card is-loose"
            }
          },
          {
            label: "前缀图标",
            prop: "props.prefixIcon",
            type: "proFormBuilderIconInput"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "失去焦点",
            prop: "props.onBlur",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 blur 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "获得焦点",
            prop: "props.onFocus",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 focus 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "清空按钮点击",
            prop: "props.onClear",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 clear 事件",
              codeTips,
              codePlaceholder: "() => {\n\n}"
            }
          },
          {
            label: "下拉框出现/隐藏",
            prop: "props.onVisibleChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 visibleChange 事件",
              codeTips,
              codePlaceholder: "(visible) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElDatePicker"
      },
      {
        type: "datetimerange",
        name: "日期时间范围选择",
        cover: covers.datetimerange,
        presetProps: { clearable: true, editable: true },
        defaultProps: {
          class: "ele-fluid",
          valueFormat: "YYYY-MM-DD HH:mm:ss",
          rangeSeparator: "-",
          startPlaceholder: "开始时间",
          endPlaceholder: "结束时间",
          unlinkPanels: true
        },
        initialProps: {},
        reservedProps: { type: "datetimerange" },
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "input"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "开始时间占位内容",
            prop: "props.startPlaceholder",
            type: "input"
          },
          {
            label: "结束时间占位内容",
            prop: "props.endPlaceholder",
            type: "input"
          },
          {
            label: "分隔符",
            prop: "props.rangeSeparator",
            type: "input"
          },
          {
            label: "清除按钮",
            prop: "props.clearable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否只读",
            prop: "props.readonly",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否可输入",
            prop: "props.editable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "显示格式",
            prop: "props.format",
            type: "input"
          },
          {
            label: "值格式",
            prop: "props.valueFormat",
            type: "input"
          },
          {
            label: "取消两个日期面板联动",
            prop: "props.unlinkPanels",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "前缀图标",
            prop: "props.prefixIcon",
            type: "proFormBuilderIconInput"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "失去焦点",
            prop: "props.onBlur",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 blur 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "获得焦点",
            prop: "props.onFocus",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 focus 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "清空按钮点击",
            prop: "props.onClear",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 clear 事件",
              codeTips,
              codePlaceholder: "() => {\n\n}"
            }
          },
          {
            label: "下拉框出现/隐藏",
            prop: "props.onVisibleChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 visibleChange 事件",
              codeTips,
              codePlaceholder: "(visible) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElDatePicker"
      },
      {
        type: "time",
        name: "时间选择",
        cover: covers.time,
        presetProps: { clearable: true, editable: true },
        defaultProps: { class: "ele-fluid", valueFormat: "HH:mm:ss" },
        initialProps: { placeholder: "" },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "input"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "占位文本",
            prop: "props.placeholder",
            type: "input"
          },
          {
            label: "清除按钮",
            prop: "props.clearable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否只读",
            prop: "props.readonly",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否可输入",
            prop: "props.editable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "显示格式",
            prop: "props.format",
            type: "input"
          },
          {
            label: "值格式",
            prop: "props.valueFormat",
            type: "input"
          },
          {
            label: "前缀图标",
            prop: "props.prefixIcon",
            type: "proFormBuilderIconInput"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "失去焦点",
            prop: "props.onBlur",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 blur 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "获得焦点",
            prop: "props.onFocus",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 focus 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "清空按钮点击",
            prop: "props.onClear",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 clear 事件",
              codeTips,
              codePlaceholder: "() => {\n\n}"
            }
          },
          {
            label: "下拉框出现/隐藏",
            prop: "props.onVisibleChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 visibleChange 事件",
              codeTips,
              codePlaceholder: "(visible) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElTimePicker"
      },
      {
        type: "timerange",
        name: "时间范围选择",
        cover: covers.timerange,
        presetProps: { clearable: true, editable: true },
        defaultProps: {
          class: "ele-fluid",
          valueFormat: "HH:mm:ss",
          rangeSeparator: "-",
          startPlaceholder: "开始时间",
          endPlaceholder: "结束时间"
        },
        initialProps: {},
        reservedProps: { isRange: true },
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "input"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "开始时间占位内容",
            prop: "props.startPlaceholder",
            type: "input"
          },
          {
            label: "结束时间占位内容",
            prop: "props.endPlaceholder",
            type: "input"
          },
          {
            label: "分隔符",
            prop: "props.rangeSeparator",
            type: "input"
          },
          {
            label: "清除按钮",
            prop: "props.clearable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否只读",
            prop: "props.readonly",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否可输入",
            prop: "props.editable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "显示格式",
            prop: "props.format",
            type: "input"
          },
          {
            label: "值格式",
            prop: "props.valueFormat",
            type: "input"
          },
          {
            label: "前缀图标",
            prop: "props.prefixIcon",
            type: "proFormBuilderIconInput"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "失去焦点",
            prop: "props.onBlur",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 blur 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "获得焦点",
            prop: "props.onFocus",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 focus 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "清空按钮点击",
            prop: "props.onClear",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 clear 事件",
              codeTips,
              codePlaceholder: "() => {\n\n}"
            }
          },
          {
            label: "下拉框出现/隐藏",
            prop: "props.onVisibleChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 visibleChange 事件",
              codeTips,
              codePlaceholder: "(visible) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElTimePicker"
      },
      {
        type: "timeSelect",
        name: "时间下拉选择",
        cover: covers.timeSelect,
        presetProps: {
          clearable: true,
          editable: true,
          start: "09:00",
          end: "18:00",
          step: "00:30",
          format: "HH:mm"
        },
        defaultProps: { class: "ele-fluid" },
        initialProps: { placeholder: "" },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "input"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "占位文本",
            prop: "props.placeholder",
            type: "input"
          },
          {
            label: "清除按钮",
            prop: "props.clearable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否可搜索",
            prop: "props.editable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "时间格式",
            prop: "props.format",
            type: "input"
          },
          {
            label: "开始时间",
            prop: "props.start",
            type: "input"
          },
          {
            label: "结束时间",
            prop: "props.end",
            type: "input"
          },
          {
            label: "间隔时间",
            prop: "props.step",
            type: "input"
          },
          {
            label: "最早时间点",
            prop: "props.minTime",
            type: "input"
          },
          {
            label: "最晚时间点",
            prop: "props.maxTime",
            type: "input"
          },
          {
            label: "前缀图标",
            prop: "props.prefixIcon",
            type: "proFormBuilderIconInput"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "失去焦点",
            prop: "props.onBlur",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 blur 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "获得焦点",
            prop: "props.onFocus",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 focus 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "清空按钮点击",
            prop: "props.onClear",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 clear 事件",
              codeTips,
              codePlaceholder: "() => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElTimeSelect"
      },
      {
        type: "inputNumber",
        name: "数字输入框",
        cover: covers.inputNumber,
        presetProps: { step: 1, controls: true },
        defaultProps: { class: "ele-fluid", controlsPosition: "right" },
        initialProps: { placeholder: "" },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "inputNumber"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "占位文本",
            prop: "props.placeholder",
            type: "input"
          },
          {
            label: "清除按钮",
            prop: "props.clearable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否只读",
            prop: "props.readonly",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "最小值",
            prop: "props.min",
            type: "inputNumber"
          },
          {
            label: "最大值",
            prop: "props.max",
            type: "inputNumber"
          },
          {
            label: "步长",
            prop: "props.step",
            type: "inputNumber"
          },
          {
            label: "只能输入步长倍数",
            prop: "props.stepStrictly",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "数值精度",
            prop: "props.precision",
            type: "inputNumber"
          },
          {
            label: "显示控制按钮",
            prop: "props.controls",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "控制按钮位置",
            prop: "props.controlsPosition",
            type: "checkCard",
            props: {
              items: [
                { label: "默认", value: "" },
                { label: "右侧", value: "right" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value, oldValue) => {\n\n}"
            }
          },
          {
            label: "失去焦点",
            prop: "props.onBlur",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 blur 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "获得焦点",
            prop: "props.onFocus",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 focus 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElInputNumber"
      },
      {
        type: "switch",
        name: "开关",
        cover: covers.switch,
        presetProps: {},
        defaultProps: { activeValue: 1, inactiveValue: 0 },
        initialProps: {},
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "input"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "宽度",
            prop: "props.width",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "打开时的文本",
            prop: "props.activeText",
            type: "input"
          },
          {
            label: "关闭时的文本",
            prop: "props.inactiveText",
            type: "input"
          },
          {
            label: "文本显示在开关内",
            prop: "props.inlinePrompt",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "打开时的值",
            prop: "props.activeValue",
            type: "input"
          },
          {
            label: "关闭时的值",
            prop: "props.inactiveValue",
            type: "input"
          },
          {
            label: "打开时的图标",
            prop: "props.activeActionIcon",
            type: "proFormBuilderIconInput"
          },
          {
            label: "关闭时的图标",
            prop: "props.inactiveActionIcon",
            type: "proFormBuilderIconInput"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElSwitch"
      },
      {
        type: "rate",
        name: "评分",
        cover: covers.rate,
        presetProps: {
          max: 5,
          voidColor: "#c6d1de",
          disabledVoidColor: "#eff2f7"
        },
        defaultProps: {},
        initialProps: {},
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "inputNumber",
            props: { min: 0, step: 0.5, stepStrictly: true, precision: 1 }
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "最大分值",
            prop: "props.max",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "允许半选",
            prop: "props.allowHalf",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "未选中的颜色",
            prop: "props.voidColor",
            type: "input"
          },
          {
            label: "禁用时未选中的颜色",
            prop: "props.disabledVoidColor",
            type: "input"
          },
          {
            label: "显示当前分数",
            prop: "props.showScore",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "分数显示模板",
            prop: "props.scoreTemplate",
            type: "input"
          },
          {
            label: "分数显示颜色",
            prop: "props.textColor",
            type: "input"
          },
          {
            label: "选中的图标",
            prop: "props.icons",
            type: "proFormBuilderOptionsEdit",
            props: { title: "编辑选中的图标", columns: "stringArray" }
          },
          {
            label: "未选中的图标",
            prop: "props.voidIcon",
            type: "proFormBuilderIconInput"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElRate"
      },
      {
        type: "cascader",
        name: "级联选择",
        cover: covers.cascader,
        presetProps: {
          showAllLevels: true,
          separator: "/",
          maxCollapseTags: 1,
          props: { expandTrigger: "click" }
        },
        defaultProps: { class: "ele-fluid", clearable: true },
        initialProps: {
          placeholder: "",
          options: [
            {
              label: "选项1",
              value: "1",
              children: [
                {
                  label: "选项1-1",
                  value: "1-1",
                  children: [
                    { label: "选项1-1-1", value: "1-1-1" },
                    { label: "选项1-1-2", value: "1-1-2" }
                  ]
                },
                {
                  label: "选项1-2",
                  value: "1-2",
                  children: [
                    { label: "选项1-2-1", value: "1-2-1" },
                    { label: "选项1-2-2", value: "1-2-2" }
                  ]
                }
              ]
            },
            {
              label: "选项2",
              value: "2",
              children: [
                {
                  label: "选项2-1",
                  value: "2-1",
                  children: [
                    { label: "选项2-1-1", value: "2-1-1" },
                    { label: "选项2-1-2", value: "2-1-2" }
                  ]
                },
                {
                  label: "选项2-2",
                  value: "2-2",
                  children: [
                    { label: "选项2-2-1", value: "2-2-1" },
                    { label: "选项2-2-2", value: "2-2-2" }
                  ]
                }
              ]
            }
          ]
        },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "editTag"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选项数据",
            prop: "props.options",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑选项数据",
              isTreeData: true,
              codeOptions: true,
              codeTips,
              codePlaceholder: `async () => {
    // 示例
    const res = await httpRequest.get('/auth/menu');
    return res.data.data.map(d => ({
        label: d.title,
        value: d.menuId,
        children: d.children ? d.children.map(c => ({
            label: c.title,
            value: c.menuId
        })) : undefined
    }));
}
`
            }
          },
          {
            label: "占位文本",
            prop: "props.placeholder",
            type: "input"
          },
          {
            label: "清除按钮",
            prop: "props.clearable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否可搜索",
            prop: "props.filterable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "显示选中值完整路径",
            prop: "props.showAllLevels",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "选项分隔符",
            prop: "props.separator",
            type: "input"
          },
          {
            label: "父子节点不关联",
            prop: "props.props.checkStrictly",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "次级菜单展开方式",
            prop: "props.props.expandTrigger",
            type: "checkCard",
            props: {
              items: [
                { value: "click", label: "点击" },
                { value: "hover", label: "鼠标移入" }
              ],
              class: "ele-pro-form-builder-props-options-check-card is-loose"
            }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "展开节点改变",
            prop: "props.onExpandChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 expandChange 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "失去焦点",
            prop: "props.onBlur",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 blur 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "获得焦点",
            prop: "props.onFocus",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 focus 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "清空按钮点击",
            prop: "props.onClear",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 clear 事件",
              codeTips,
              codePlaceholder: "() => {\n\n}"
            }
          },
          {
            label: "下拉框出现/隐藏",
            prop: "props.onVisibleChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 visibleChange 事件",
              codeTips,
              codePlaceholder: "(visible) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleCascader"
      },
      {
        type: "multipleCascader",
        name: "级联多选",
        cover: covers.multipleCascader,
        presetProps: {
          showAllLevels: true,
          separator: "/",
          maxCollapseTags: 1,
          props: { expandTrigger: "click" }
        },
        defaultProps: { class: "ele-fluid", clearable: true },
        initialProps: {
          placeholder: "",
          options: [
            {
              label: "选项1",
              value: "1",
              children: [
                {
                  label: "选项1-1",
                  value: "1-1",
                  children: [
                    { label: "选项1-1-1", value: "1-1-1" },
                    { label: "选项1-1-2", value: "1-1-2" }
                  ]
                },
                {
                  label: "选项1-2",
                  value: "1-2",
                  children: [
                    { label: "选项1-2-1", value: "1-2-1" },
                    { label: "选项1-2-2", value: "1-2-2" }
                  ]
                }
              ]
            },
            {
              label: "选项2",
              value: "2",
              children: [
                {
                  label: "选项2-1",
                  value: "2-1",
                  children: [
                    { label: "选项2-1-1", value: "2-1-1" },
                    { label: "选项2-1-2", value: "2-1-2" }
                  ]
                },
                {
                  label: "选项2-2",
                  value: "2-2",
                  children: [
                    { label: "选项2-2-1", value: "2-2-1" },
                    { label: "选项2-2-2", value: "2-2-2" }
                  ]
                }
              ]
            }
          ]
        },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "proFormBuilderJsonInput",
            props: { placeholder: "输入 JSON 格式" }
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选项数据",
            prop: "props.options",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑选项数据",
              isTreeData: true,
              codeOptions: true,
              codeTips,
              codePlaceholder: `async () => {
    // 示例
    const res = await httpRequest.get('/auth/menu');
    return res.data.data.map(d => ({
        label: d.title,
        value: d.menuId,
        children: d.children ? d.children.map(c => ({
            label: c.title,
            value: c.menuId
        })) : undefined
    }));
}
`
            }
          },
          {
            label: "占位文本",
            prop: "props.placeholder",
            type: "input"
          },
          {
            label: "清除按钮",
            prop: "props.clearable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否可搜索",
            prop: "props.filterable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "显示选中值完整路径",
            prop: "props.showAllLevels",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "选项分隔符",
            prop: "props.separator",
            type: "input"
          },
          {
            label: "父子节点不关联",
            prop: "props.props.checkStrictly",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "次级菜单展开方式",
            prop: "props.props.expandTrigger",
            type: "checkCard",
            props: {
              items: [
                { value: "click", label: "点击" },
                { value: "hover", label: "鼠标移入" }
              ],
              class: "ele-pro-form-builder-props-options-check-card is-loose"
            }
          },
          {
            label: "折叠显示 Tag",
            prop: "props.collapseTags",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "最大显示 Tag 数量",
            prop: "props.maxCollapseTags",
            type: "inputNumber",
            props: { min: 1, step: 1, stepStrictly: true }
          },
          {
            label: "悬浮显示折叠的 Tag",
            prop: "props.collapseTagsTooltip",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "展开节点改变",
            prop: "props.onExpandChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 expandChange 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "失去焦点",
            prop: "props.onBlur",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 blur 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "获得焦点",
            prop: "props.onFocus",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 focus 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "清空按钮点击",
            prop: "props.onClear",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 clear 事件",
              codeTips,
              codePlaceholder: "() => {\n\n}"
            }
          },
          {
            label: "下拉框出现/隐藏",
            prop: "props.onVisibleChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 visibleChange 事件",
              codeTips,
              codePlaceholder: "(visible) => {\n\n}"
            }
          },
          {
            label: "移除 tag",
            prop: "props.onRemoveTag",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 removeTag 事件",
              codeTips,
              codePlaceholder: "(tagValue) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleCascader"
      },
      {
        type: "treeSelect",
        name: "树下拉",
        cover: covers.treeSelect,
        presetProps: { expandOnClickNode: true },
        defaultProps: { class: "ele-fluid", clearable: true },
        initialProps: {
          placeholder: "",
          defaultExpandAll: true,
          nodeKey: "value",
          props: { label: "label" },
          data: [
            {
              label: "选项1",
              value: "1",
              children: [
                {
                  label: "选项1-1",
                  value: "1-1",
                  children: [
                    { label: "选项1-1-1", value: "1-1-1" },
                    { label: "选项1-1-2", value: "1-1-2" }
                  ]
                },
                {
                  label: "选项1-2",
                  value: "1-2",
                  children: [
                    { label: "选项1-2-1", value: "1-2-1" },
                    { label: "选项1-2-2", value: "1-2-2" }
                  ]
                }
              ]
            },
            {
              label: "选项2",
              value: "2",
              children: [
                {
                  label: "选项2-1",
                  value: "2-1",
                  children: [
                    { label: "选项2-1-1", value: "2-1-1" },
                    { label: "选项2-1-2", value: "2-1-2" }
                  ]
                },
                {
                  label: "选项2-2",
                  value: "2-2",
                  children: [
                    { label: "选项2-2-1", value: "2-2-1" },
                    { label: "选项2-2-2", value: "2-2-2" }
                  ]
                }
              ]
            }
          ]
        },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "input"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选项数据",
            prop: "props.data",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑选项数据",
              isTreeData: true,
              codeOptions: true,
              codeTips,
              codePlaceholder: `async () => {
    // 示例
    const res = await httpRequest.get('/auth/menu');
    return res.data.data.map(d => ({
        label: d.title,
        value: d.menuId,
        children: d.children ? d.children.map(c => ({
            label: c.title,
            value: c.menuId
        })) : undefined
    }));
}
`
            }
          },
          {
            label: "占位文本",
            prop: "props.placeholder",
            type: "input"
          },
          {
            label: "清除按钮",
            prop: "props.clearable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否可搜索",
            prop: "props.filterable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "默认展开所有节点",
            prop: "props.defaultExpandAll",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "可选择父级",
            prop: "props.checkStrictly",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "只展开一个同级节点",
            prop: "props.accordion",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleSelectTree"
      },
      {
        type: "treeMultipleSelect",
        name: "树下拉多选",
        cover: covers.treeMultipleSelect,
        presetProps: { expandOnClickNode: true },
        defaultProps: {
          class: "ele-fluid",
          clearable: true,
          showCheckbox: true
        },
        initialProps: {
          placeholder: "",
          multiple: true,
          showCheckbox: true,
          defaultExpandAll: true,
          nodeKey: "value",
          props: { label: "label" },
          data: [
            {
              label: "选项1",
              value: "1",
              children: [
                {
                  label: "选项1-1",
                  value: "1-1",
                  children: [
                    { label: "选项1-1-1", value: "1-1-1" },
                    { label: "选项1-1-2", value: "1-1-2" }
                  ]
                },
                {
                  label: "选项1-2",
                  value: "1-2",
                  children: [
                    { label: "选项1-2-1", value: "1-2-1" },
                    { label: "选项1-2-2", value: "1-2-2" }
                  ]
                }
              ]
            },
            {
              label: "选项2",
              value: "2",
              children: [
                {
                  label: "选项2-1",
                  value: "2-1",
                  children: [
                    { label: "选项2-1-1", value: "2-1-1" },
                    { label: "选项2-1-2", value: "2-1-2" }
                  ]
                },
                {
                  label: "选项2-2",
                  value: "2-2",
                  children: [
                    { label: "选项2-2-1", value: "2-2-1" },
                    { label: "选项2-2-2", value: "2-2-2" }
                  ]
                }
              ]
            }
          ]
        },
        reservedProps: { multiple: true },
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "editTag"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选项数据",
            prop: "props.data",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑选项数据",
              isTreeData: true,
              codeOptions: true,
              codeTips,
              codePlaceholder: `async () => {
    // 示例
    const res = await httpRequest.get('/auth/menu');
    return res.data.data.map(d => ({
        label: d.title,
        value: d.menuId,
        children: d.children ? d.children.map(c => ({
            label: c.title,
            value: c.menuId
        })) : undefined
    }));
}
`
            }
          },
          {
            label: "占位文本",
            prop: "props.placeholder",
            type: "input"
          },
          {
            label: "清除按钮",
            prop: "props.clearable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否可搜索",
            prop: "props.filterable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "默认展开所有节点",
            prop: "props.defaultExpandAll",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "父子不关联",
            prop: "props.checkStrictly",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "只展开一个同级节点",
            prop: "props.accordion",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "最大可选择数量",
            prop: "props.multipleLimit",
            type: "inputNumber",
            props: { min: 1, step: 1, stepStrictly: true }
          },
          {
            label: "折叠显示 Tag",
            prop: "props.collapseTags",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "最大显示 Tag 数量",
            prop: "props.maxCollapseTags",
            type: "inputNumber",
            props: { min: 1, step: 1, stepStrictly: true }
          },
          {
            label: "悬浮显示折叠的 Tag",
            prop: "props.collapseTagsTooltip",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleSelectTree"
      },
      {
        type: "virtualTreeSelect",
        name: "虚拟树下拉",
        cover: covers.virtualTreeSelect,
        presetProps: {},
        defaultProps: { clearable: true },
        initialProps: {
          placeholder: "",
          popperWidth: 320,
          treeProps: {
            height: 266,
            data: [
              {
                label: "选项1",
                value: "1",
                children: [
                  {
                    label: "选项1-1",
                    value: "1-1",
                    children: [
                      { label: "选项1-1-1", value: "1-1-1" },
                      { label: "选项1-1-2", value: "1-1-2" }
                    ]
                  },
                  {
                    label: "选项1-2",
                    value: "1-2",
                    children: [
                      { label: "选项1-2-1", value: "1-2-1" },
                      { label: "选项1-2-2", value: "1-2-2" }
                    ]
                  }
                ]
              },
              {
                label: "选项2",
                value: "2",
                children: [
                  {
                    label: "选项2-1",
                    value: "2-1",
                    children: [
                      { label: "选项2-1-1", value: "2-1-1" },
                      { label: "选项2-1-2", value: "2-1-2" }
                    ]
                  },
                  {
                    label: "选项2-2",
                    value: "2-2",
                    children: [
                      { label: "选项2-2-1", value: "2-2-1" },
                      { label: "选项2-2-2", value: "2-2-2" }
                    ]
                  }
                ]
              }
            ],
            props: { value: "value", label: "label" },
            expandOnClickNode: true
          },
          placement: "bottom"
        },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "input"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选项数据",
            prop: "props.treeProps.data",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑选项数据",
              isTreeData: true,
              codeOptions: true,
              codeTips,
              codePlaceholder: `async () => {
    // 示例
    const res = await httpRequest.get('/auth/menu');
    return res.data.data.map(d => ({
        label: d.title,
        value: d.menuId,
        children: d.children ? d.children.map(c => ({
            label: c.title,
            value: c.menuId
        })) : undefined
    }));
}
`
            }
          },
          {
            label: "占位文本",
            prop: "props.placeholder",
            type: "input"
          },
          {
            label: "清除按钮",
            prop: "props.clearable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否可搜索",
            prop: "props.filterable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "父级点击",
            prop: "props.treeProps.expandOnClickNode",
            type: "checkCard",
            props: {
              items: [
                { label: "选中", value: false },
                { label: "展开", value: true }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "下拉框出现/隐藏",
            prop: "props.onVisibleChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 visibleChange 事件",
              codeTips,
              codePlaceholder: "(visible) => {\n\n}"
            }
          },
          {
            label: "清空按钮点击",
            prop: "props.onClear",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 clear 事件",
              codeTips,
              codePlaceholder: "() => {\n\n}"
            }
          },
          {
            label: "失去焦点",
            prop: "props.onBlur",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 blur 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "获得焦点",
            prop: "props.onFocus",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 focus 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleTreeSelect"
      },
      {
        type: "virtualTreeMultipleSelect",
        name: "虚拟树下拉多选",
        cover: covers.virtualTreeMultipleSelect,
        presetProps: {
          showCheckedStrategy: "parent",
          checkedValueStrategy: false
        },
        defaultProps: { clearable: true, maxTagCount: 1 },
        initialProps: {
          placeholder: "",
          popperWidth: 320,
          treeProps: {
            height: 266,
            data: [
              {
                label: "选项1",
                value: "1",
                children: [
                  {
                    label: "选项1-1",
                    value: "1-1",
                    children: [
                      { label: "选项1-1-1", value: "1-1-1" },
                      { label: "选项1-1-2", value: "1-1-2" }
                    ]
                  },
                  {
                    label: "选项1-2",
                    value: "1-2",
                    children: [
                      { label: "选项1-2-1", value: "1-2-1" },
                      { label: "选项1-2-2", value: "1-2-2" }
                    ]
                  }
                ]
              },
              {
                label: "选项2",
                value: "2",
                children: [
                  {
                    label: "选项2-1",
                    value: "2-1",
                    children: [
                      { label: "选项2-1-1", value: "2-1-1" },
                      { label: "选项2-1-2", value: "2-1-2" }
                    ]
                  },
                  {
                    label: "选项2-2",
                    value: "2-2",
                    children: [
                      { label: "选项2-2-1", value: "2-2-1" },
                      { label: "选项2-2-2", value: "2-2-2" }
                    ]
                  }
                ]
              }
            ],
            props: { value: "value", label: "label" },
            expandOnClickNode: true
          },
          placement: "bottom"
        },
        reservedProps: { multiple: true },
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "editTag"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选项数据",
            prop: "props.treeProps.data",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑选项数据",
              isTreeData: true,
              codeOptions: true,
              codeTips,
              codePlaceholder: `async () => {
    // 示例
    const res = await httpRequest.get('/auth/menu');
    return res.data.data.map(d => ({
        label: d.title,
        value: d.menuId,
        children: d.children ? d.children.map(c => ({
            label: c.title,
            value: c.menuId
        })) : undefined
    }));
}
`
            }
          },
          {
            label: "占位文本",
            prop: "props.placeholder",
            type: "input"
          },
          {
            label: "清除按钮",
            prop: "props.clearable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否可搜索",
            prop: "props.filterable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "父级点击",
            prop: "props.treeProps.expandOnClickNode",
            type: "checkCard",
            props: {
              items: [
                { label: "选中", value: false },
                { label: "展开", value: true }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "父子联动",
            prop: "props.treeProps.checkStrictly",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "标签显示策略",
            prop: "props.showCheckedStrategy",
            type: "checkCard",
            props: {
              items: [
                { label: "当子节点全部选中时只显示父级", value: "parent" },
                { label: "只显示选中的子节点", value: "child" },
                { label: "显示所有选中节点", value: "all" }
              ],
              class: "ele-pro-form-builder-props-options-check-card is-single"
            }
          },
          {
            label: "值策略",
            prop: "props.checkedValueStrategy",
            type: "checkCard",
            props: {
              items: [
                { value: false, label: "全部选中值" },
                { value: true, label: "同标签显示策略" }
              ],
              class: "ele-pro-form-builder-props-options-check-card is-single"
            }
          },
          {
            label: "最大显示 Tag 数量",
            prop: "props.maxTagCount",
            type: "inputNumber",
            props: { min: 1, step: 1, stepStrictly: true }
          },
          {
            label: "最大显示 Tag 文本长度",
            prop: "props.maxTagTextLength",
            type: "inputNumber",
            props: { min: 1, step: 1, stepStrictly: true }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "下拉框出现/隐藏",
            prop: "props.onVisibleChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 visibleChange 事件",
              codeTips,
              codePlaceholder: "(visible) => {\n\n}"
            }
          },
          {
            label: "移除 tag",
            prop: "props.onRemoveTag",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 removeTag 事件",
              codeTips,
              codePlaceholder: "(tagValue) => {\n\n}"
            }
          },
          {
            label: "清空按钮点击",
            prop: "props.onClear",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 clear 事件",
              codeTips,
              codePlaceholder: "() => {\n\n}"
            }
          },
          {
            label: "失去焦点",
            prop: "props.onBlur",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 blur 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "获得焦点",
            prop: "props.onFocus",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 focus 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleTreeSelect"
      },
      {
        type: "tableSelect",
        name: "表格下拉",
        cover: covers.tableSelect,
        presetProps: { valueKey: "value", labelKey: "label" },
        defaultProps: { clearable: true },
        initialProps: {
          placeholder: "",
          popperWidth: 580,
          valueKey: "userId",
          labelKey: "nickname",
          tableProps: {
            datasource: [
              { userId: "1", username: "001", nickname: "用户一", sex: "男" },
              { userId: "2", username: "002", nickname: "用户二", sex: "女" },
              { userId: "3", username: "003", nickname: "用户三", sex: "女" },
              { userId: "4", username: "004", nickname: "用户四", sex: "男" },
              { userId: "5", username: "005", nickname: "用户五", sex: "女" }
            ],
            columns: [
              { type: "index", columnKey: "index", width: 48, align: "center" },
              { prop: "username", label: "账号" },
              { prop: "nickname", label: "用户名" },
              { prop: "sex", label: "性别" }
            ],
            showOverflowTooltip: true,
            highlightCurrentRow: true,
            toolbar: false,
            pagination: {
              pageSize: 6,
              layout: "total, prev, pager, next, jumper"
            },
            footerStyle: { padding: "0px" },
            rowStyle: { cursor: "pointer" }
          }
        },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "input"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "表格数据",
            prop: "props.tableProps.datasource",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑表格数据",
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
`
            }
          },
          {
            label: "表格列",
            prop: "props.tableProps.columns",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑表格列",
              isTreeData: true,
              columns: "tableColumns"
            }
          },
          {
            label: "占位文本",
            prop: "props.placeholder",
            type: "input"
          },
          {
            label: "清除按钮",
            prop: "props.clearable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "值属性名",
            prop: "props.valueKey",
            type: "input"
          },
          {
            label: "显示文本属性名",
            prop: "props.labelKey",
            type: "input"
          },
          {
            label: "虚拟滚动",
            prop: "props.tableProps.virtual",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "表格高度",
            prop: "props.tableProps.height",
            type: "inputNumber",
            props: { min: 1 }
          },
          {
            label: "表格最大高度",
            prop: "props.tableProps.maxHeight",
            type: "inputNumber",
            props: { min: 1 }
          },
          {
            label: "表格表头工具栏",
            prop: "props.tableProps.toolbar",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "表格边框",
            prop: "props.tableProps.border",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "表格斑马纹",
            prop: "props.tableProps.stripe",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "表格列宽自动撑开",
            prop: "props.tableProps.fit",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "表格是否显示表头",
            prop: "props.tableProps.showHeader",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "树表格默认展开所有",
            prop: "props.tableProps.defaultExpandAll",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "树表格缩进",
            prop: "props.tableProps.indent",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "表格是否显示合计行",
            prop: "props.tableProps.showSummary",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "表格合计行第一列文本",
            prop: "props.tableProps.sumText",
            type: "input"
          },
          {
            label: "表格布局方式",
            prop: "props.tableProps.tableLayout",
            type: "checkCard",
            props: {
              items: [
                { label: "fixed", value: "fixed" },
                { label: "auto", value: "auto" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "表格总是显示滚动条",
            prop: "props.tableProps.scrollbarAlwaysOn",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "表格确保主轴最小尺寸",
            prop: "props.tableProps.flexible",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "表格表头内容溢出省略",
            prop: "props.tableProps.headerEllipsis",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "下拉框出现/隐藏",
            prop: "props.onVisibleChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 visibleChange 事件",
              codeTips,
              codePlaceholder: "(visible) => {\n\n}"
            }
          },
          {
            label: "清空按钮点击",
            prop: "props.onClear",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 clear 事件",
              codeTips,
              codePlaceholder: "() => {\n\n}"
            }
          },
          {
            label: "失去焦点",
            prop: "props.onBlur",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 blur 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "获得焦点",
            prop: "props.onFocus",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 focus 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "选中",
            prop: "props.onSelect",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 select 事件",
              codeTips,
              codePlaceholder: "(data) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleTableSelect"
      },
      {
        type: "tableMultipleSelect",
        name: "表格下拉多选",
        cover: covers.tableMultipleSelect,
        presetProps: { valueKey: "value", labelKey: "label" },
        defaultProps: { clearable: true },
        initialProps: {
          placeholder: "",
          popperWidth: 580,
          valueKey: "userId",
          labelKey: "nickname",
          tableProps: {
            datasource: [
              { userId: "1", username: "001", nickname: "用户一", sex: "男" },
              { userId: "2", username: "002", nickname: "用户二", sex: "女" },
              { userId: "3", username: "003", nickname: "用户三", sex: "女" },
              { userId: "4", username: "004", nickname: "用户四", sex: "男" },
              { userId: "5", username: "005", nickname: "用户五", sex: "女" }
            ],
            columns: [
              {
                type: "selection",
                columnKey: "selection",
                width: 48,
                align: "center",
                reserveSelection: true
              },
              { type: "index", columnKey: "index", width: 48, align: "center" },
              { prop: "username", label: "账号" },
              { prop: "nickname", label: "用户名" },
              { prop: "sex", label: "性别" }
            ],
            showOverflowTooltip: true,
            rowClickChecked: true,
            toolbar: false,
            pagination: {
              pageSize: 6,
              layout: "total, prev, pager, next, jumper"
            },
            footerStyle: { padding: "0px" },
            rowStyle: { cursor: "pointer" }
          }
        },
        reservedProps: { multiple: true },
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "editTag"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "表格数据",
            prop: "props.tableProps.datasource",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑表格数据",
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
`
            }
          },
          {
            label: "表格列",
            prop: "props.tableProps.columns",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑表格列",
              isTreeData: true,
              columns: "tableColumns"
            }
          },
          {
            label: "占位文本",
            prop: "props.placeholder",
            type: "input"
          },
          {
            label: "清除按钮",
            prop: "props.clearable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "值属性名",
            prop: "props.valueKey",
            type: "input"
          },
          {
            label: "显示文本属性名",
            prop: "props.labelKey",
            type: "input"
          },
          {
            label: "最大显示 Tag 数量",
            prop: "props.maxTagCount",
            type: "inputNumber",
            props: { min: 1, step: 1, stepStrictly: true }
          },
          {
            label: "Tag 最大显示文本长度",
            prop: "props.maxTagTextLength",
            type: "inputNumber",
            props: { min: 1, step: 1, stepStrictly: true }
          },
          {
            label: "虚拟滚动",
            prop: "props.tableProps.virtual",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "表格高度",
            prop: "props.tableProps.height",
            type: "inputNumber",
            props: { min: 1 }
          },
          {
            label: "表格最大高度",
            prop: "props.tableProps.maxHeight",
            type: "inputNumber",
            props: { min: 1 }
          },
          {
            label: "表格表头工具栏",
            prop: "props.tableProps.toolbar",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "表格边框",
            prop: "props.tableProps.border",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "表格斑马纹",
            prop: "props.tableProps.stripe",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "表格列宽自动撑开",
            prop: "props.tableProps.fit",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "表格是否显示表头",
            prop: "props.tableProps.showHeader",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "树表格默认展开所有",
            prop: "props.tableProps.defaultExpandAll",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "树表格缩进",
            prop: "props.tableProps.indent",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "表格是否显示合计行",
            prop: "props.tableProps.showSummary",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "表格合计行第一列文本",
            prop: "props.tableProps.sumText",
            type: "input"
          },
          {
            label: "表格布局方式",
            prop: "props.tableProps.tableLayout",
            type: "checkCard",
            props: {
              items: [
                { label: "fixed", value: "fixed" },
                { label: "auto", value: "auto" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "表格总是显示滚动条",
            prop: "props.tableProps.scrollbarAlwaysOn",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "表格确保主轴最小尺寸",
            prop: "props.tableProps.flexible",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "表格表头内容溢出省略",
            prop: "props.tableProps.headerEllipsis",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "下拉框出现/隐藏",
            prop: "props.onVisibleChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 visibleChange 事件",
              codeTips,
              codePlaceholder: "(visible) => {\n\n}"
            }
          },
          {
            label: "移除 tag",
            prop: "props.onRemoveTag",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 removeTag 事件",
              codeTips,
              codePlaceholder: "(tagValue) => {\n\n}"
            }
          },
          {
            label: "清空按钮点击",
            prop: "props.onClear",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 clear 事件",
              codeTips,
              codePlaceholder: "() => {\n\n}"
            }
          },
          {
            label: "失去焦点",
            prop: "props.onBlur",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 blur 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "获得焦点",
            prop: "props.onFocus",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 focus 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "选中",
            prop: "props.onSelect",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 select 事件",
              codeTips,
              codePlaceholder: "(data) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleTableSelect"
      },
      {
        type: "checkCard",
        name: "可选卡片",
        cover: covers.checkCard,
        presetProps: { arrow: true },
        defaultProps: {},
        initialProps: {
          style: { display: "flex", alignItems: "flex-start" },
          itemStyle: {
            padding: "8px 22px",
            margin: "0 12px 0 0",
            lineHeight: "normal"
          },
          items: [
            { label: "选项一", value: "1" },
            { label: "选项二", value: "2" }
          ]
        },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "input"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选项数据",
            prop: "props.items",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑选项数据",
              codeOptions: true,
              codeTips,
              codePlaceholder: `async () => {
    // 示例
    const res = await httpRequest.get('/system/user');
    return res.data.data.map(d => ({ label: d.nickname, value: d.userId }));
}
`
            }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否可取消选择",
            prop: "props.allowUncheck",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "卡片项样式",
            prop: "props.itemStyle",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "卡片项类名",
            prop: "props.itemClass",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "是否显示选中箭头",
            prop: "props.arrow",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "选中箭头样式",
            prop: "props.arrowStyle",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleCheckCard"
      },
      {
        type: "multipleCheckCard",
        name: "多选卡片",
        cover: covers.multipleCheckCard,
        presetProps: { arrow: true },
        defaultProps: {},
        initialProps: {
          style: { display: "flex", alignItems: "flex-start" },
          itemStyle: {
            padding: "8px 22px",
            margin: "0 12px 0 0",
            lineHeight: "normal"
          },
          items: [
            { label: "选项一", value: "1" },
            { label: "选项二", value: "2" }
          ]
        },
        reservedProps: { multiple: true },
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "editTag"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选项数据",
            prop: "props.items",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑选项数据",
              codeOptions: true,
              codeTips,
              codePlaceholder: `async () => {
    // 示例
    const res = await httpRequest.get('/system/user');
    return res.data.data.map(d => ({ label: d.nickname, value: d.userId }));
}
`
            }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "卡片项样式",
            prop: "props.itemStyle",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "卡片项类名",
            prop: "props.itemClass",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "是否显示选中箭头",
            prop: "props.arrow",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "选中箭头样式",
            prop: "props.arrowStyle",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleCheckCard"
      },
      {
        type: "editTag",
        name: "标签输入",
        cover: covers.editTag,
        presetProps: { effect: "light" },
        defaultProps: {
          type: "info",
          style: { marginTop: "4px" },
          itemStyle: { margin: "0 4px 4px 0" },
          buttonStyle: { marginBottom: "4px" },
          inputTagStyle: { marginBottom: "4px" }
        },
        initialProps: {},
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "editTag"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "占位文本",
            prop: "props.placeholder",
            type: "input"
          },
          {
            label: "是否只读",
            prop: "props.readonly",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "类型",
            prop: "props.type",
            type: "checkCard",
            props: {
              items: [
                { value: "info", label: "信息色" },
                { value: "primary", label: "主色" },
                { value: "success", label: "成功色" },
                { value: "warning", label: "警告色" },
                { value: "danger", label: "危险色" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "椭圆风格",
            prop: "props.round",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "加深边框",
            prop: "props.hit",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "主题风格",
            prop: "props.effect",
            type: "checkCard",
            props: {
              items: [
                { value: "light", label: "淡色" },
                { value: "dark", label: "深色" },
                { value: "plain", label: "朴素" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleEditTag"
      },
      {
        type: "colorPicker",
        name: "颜色选择",
        cover: covers.colorPicker,
        presetProps: { colorFormat: "hex" },
        defaultProps: {},
        initialProps: {},
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "input"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "颜色格式",
            prop: "props.colorFormat",
            type: "checkCard",
            props: {
              items: [
                { value: "hsl", label: "hsl" },
                { value: "hsv", label: "hsv" },
                { value: "hex", label: "hex" },
                { value: "rgb", label: "rgb" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "透明度选择",
            prop: "props.showAlpha",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "预定义颜色",
            prop: "props.predefine",
            type: "proFormBuilderOptionsEdit",
            props: { title: "编辑预定义颜色", columns: "stringArray" }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "失去焦点",
            prop: "props.onBlur",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 blur 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "获得焦点",
            prop: "props.onFocus",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 focus 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElColorPicker"
      },
      {
        type: "autocomplete",
        name: "自动完成",
        cover: covers.autocomplete,
        presetProps: { triggerOnFocus: true },
        defaultProps: { class: "ele-fluid" },
        initialProps: {
          placeholder: "",
          fetchSuggestions: [{ value: "选项一" }, { value: "选项二" }]
        },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "input"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选项数据",
            prop: "props.fetchSuggestions",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑选项数据",
              columns: [
                { prop: "value", label: "选项", style: { textAlign: "center" } }
              ],
              codeOptions: true,
              codeTips,
              codePlaceholder: `async (keyword) => {
    // 示例
    const res = await httpRequest.get('/system/user', {
        params: { nickname: keyword }
    });
    return res.data.data.map(d => ({ value: d.nickname }));
}
`
            }
          },
          {
            label: "占位文本",
            prop: "props.placeholder",
            type: "input"
          },
          {
            label: "清除按钮",
            prop: "props.clearable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "获取焦点后展开",
            prop: "props.triggerOnFocus",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "清空按钮点击",
            prop: "props.onClear",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 clear 事件",
              codeTips,
              codePlaceholder: "() => {\n\n}"
            }
          },
          {
            label: "失去焦点",
            prop: "props.onBlur",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 blur 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "获得焦点",
            prop: "props.onFocus",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 focus 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "选中建议项",
            prop: "props.onSelect",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 select 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleAutocomplete"
      },
      {
        type: "mention",
        name: "提及",
        cover: covers.mention,
        presetProps: {
          prefix: "@",
          split: " ",
          placement: "bottom",
          offset: 0
        },
        defaultProps: { clearable: true },
        initialProps: {
          placeholder: "",
          options: [
            { label: "选项一", value: "选项一" },
            { label: "选项二", value: "选项二" }
          ]
        },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "input"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选项数据",
            prop: "props.options",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑选项数据",
              codeOptions: true,
              codeTips,
              codePlaceholder: `async () => {
    // 示例
    const res = await httpRequest.get('/system/user');
    return res.data.data.map(d => ({ label: d.nickname, value: d.nickname }));
}
`
            }
          },
          {
            label: "占位文本",
            prop: "props.placeholder",
            type: "input"
          },
          {
            label: "清除按钮",
            prop: "props.clearable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "触发字段的前缀",
            prop: "props.prefix",
            type: "input"
          },
          {
            label: "用于拆分提及的字符",
            prop: "props.split",
            type: "input"
          },
          {
            label: "弹出面板位置",
            prop: "props.placement",
            type: "checkCard",
            props: {
              items: [
                { value: "bottom", label: "下方" },
                { value: "top", label: "上方" }
              ],
              class: "ele-pro-form-builder-props-options-check-card is-loose"
            }
          },
          {
            label: "弹出面板偏移量",
            prop: "props.offset",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "退格键删除提及整体",
            prop: "props.whole",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "失去焦点",
            prop: "props.onBlur",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 blur 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "获得焦点",
            prop: "props.onFocus",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 focus 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "选中选择项",
            prop: "props.onSelect",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 select 事件",
              codeTips,
              codePlaceholder: "(option, prefix) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleMention"
      },
      {
        type: "slider",
        name: "滑块",
        cover: covers.slider,
        presetProps: {
          min: 0,
          max: 100,
          step: 1,
          showInputControls: true,
          showTooltip: true
        },
        defaultProps: {},
        initialProps: {},
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "最小值",
            prop: "props.min",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "最大值",
            prop: "props.max",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "步长",
            prop: "props.step",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "显示输入框",
            prop: "props.showInput",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "显示输入框控制按钮",
            prop: "props.showInputControls",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "显示间断点",
            prop: "props.showStops",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "显示提示框",
            prop: "props.showTooltip",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "垂直模式",
            prop: "props.vertical",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "垂直模式高度",
            prop: "props.height",
            type: "input"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElSlider"
      },
      {
        type: "sliderRange",
        name: "范围滑块",
        cover: covers.sliderRange,
        presetProps: {
          min: 0,
          max: 100,
          step: 1,
          showInputControls: true,
          showTooltip: true
        },
        defaultProps: {},
        initialProps: {},
        reservedProps: { range: true },
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "proFormBuilderJsonInput",
            props: { placeholder: "输入 JSON 格式" }
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "最小值",
            prop: "props.min",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "最大值",
            prop: "props.max",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "步长",
            prop: "props.step",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "显示间断点",
            prop: "props.showStops",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "显示提示框",
            prop: "props.showTooltip",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "垂直模式",
            prop: "props.vertical",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "垂直模式高度",
            prop: "props.height",
            type: "input"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElSlider"
      },
      {
        type: "transfer",
        name: "穿梭框",
        cover: covers.transfer,
        presetProps: { targetOrder: "original" },
        defaultProps: {},
        initialProps: {
          data: [
            { key: "1", label: "选项1" },
            { key: "2", label: "选项2" },
            { key: "3", label: "选项3" }
          ],
          titles: ["来源", "目标"]
        },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "editTag"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "数据",
            prop: "props.data",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑数据",
              columns: [
                { prop: "key", label: "值", style: { textAlign: "center" } },
                {
                  prop: "label",
                  label: "文本",
                  style: { textAlign: "center" }
                },
                {
                  prop: "disabled",
                  label: "禁用",
                  style: { textAlign: "center", width: "80px", flex: "none" },
                  editType: "switch"
                }
              ],
              codeOptions: true,
              codeTips,
              codePlaceholder: `async () => {
    // 示例
    const res = await httpRequest.get('/system/user');
    return res.data.data.map(d => ({ label: d.nickname, key: d.userId }));
}
`
            }
          },
          {
            label: "是否可搜索",
            prop: "props.filterable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "搜索框占位文本",
            prop: "props.filterPlaceholder",
            type: "input"
          },
          {
            label: "右侧列表排序策略",
            prop: "props.targetOrder",
            type: "checkCard",
            props: {
              items: [
                { value: "original", label: "original" },
                { value: "push", label: "push" },
                { value: "unshift", label: "unshift" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "列表标题",
            prop: "props.titles",
            type: "proFormBuilderOptionsEdit",
            props: { title: "编辑列表标题", columns: "stringArray" }
          },
          {
            label: "按钮文案",
            prop: "props.buttonTexts",
            type: "proFormBuilderOptionsEdit",
            props: { title: "编辑按钮文案", columns: "stringArray" }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中值改变",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(value, diretion, movedKeys) => {\n\n}"
            }
          },
          {
            label: "左侧选中/取消选中",
            prop: "props.onLeftCheckChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 leftCheckChange 事件",
              codeTips,
              codePlaceholder: "(value, movedKeys) => {\n\n}"
            }
          },
          {
            label: "右侧选中/取消选中",
            prop: "props.onRightCheckChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 rightCheckChange 事件",
              codeTips,
              codePlaceholder: "(value, movedKeys) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleTransfer"
      },
      {
        type: "text",
        name: "只读文本",
        cover: covers.text,
        presetProps: { tag: "div", type: "default", size: "default" },
        defaultProps: {},
        initialProps: {},
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "字段名称",
            prop: "label",
            type: "input"
          },
          {
            label: "字段属性",
            prop: "prop",
            type: "input"
          },
          {
            label: "是否必填",
            prop: "required",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "必填校验信息",
            prop: "requiredMessage",
            type: "input"
          },
          {
            label: "初始值",
            prop: "initValue",
            type: "textarea"
          },
          {
            label: "标签宽度",
            prop: "itemProps.labelWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "标签位置",
            prop: "itemProps.labelPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "right", label: "右对齐" },
                { value: "top", label: "顶部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "渲染标签",
            prop: "props.tag",
            type: "input"
          },
          {
            label: "类型",
            prop: "props.type",
            type: "checkCard",
            props: {
              items: [
                { value: "default", label: "默认" },
                { value: "heading", label: "标题色" },
                { value: "regular", label: "内容色" },
                { value: "secondary", label: "次要色" },
                { value: "placeholder", label: "提示色" },
                { value: "primary", label: "主色" },
                { value: "success", label: "成功色" },
                { value: "warning", label: "警告色" },
                { value: "danger", label: "危险色" },
                { value: "info", label: "信息色" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "尺寸",
            prop: "props.size",
            type: "checkCard",
            props: {
              items: [
                { value: "default", label: "不设置" },
                { value: "xxxl", label: "极大" },
                { value: "xxl", label: "超大" },
                { value: "xl", label: "特大" },
                { value: "lg", label: "大型" },
                { value: "md", label: "中等" },
                { value: "base", label: "常规" },
                { value: "sm", label: "小型" },
                { value: "xs", label: "超小" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "删除线",
            prop: "props.deleted",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "下划线",
            prop: "props.underline",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "加粗",
            prop: "props.strong",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "斜体",
            prop: "props.italic",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "图标",
            prop: "props.icon",
            type: "proFormBuilderIconInput"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "表单项样式",
            prop: "itemProps.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "表单项类名",
            prop: "itemProps.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleText"
      }
    ]
  },
  {
    name: "展示类型组件",
    items: [
      {
        type: "label",
        name: "文本",
        cover: covers.label,
        presetProps: { tag: "div", type: "default", size: "default" },
        defaultProps: {},
        initialProps: {},
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "内容",
            prop: "label",
            type: "textarea"
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "子级",
            prop: "childrenEdit",
            type: "proFormBuilderChildrenEdit",
            props: { addBtnText: "添加子级" }
          },
          {
            label: "渲染标签",
            prop: "props.tag",
            type: "input"
          },
          {
            label: "类型",
            prop: "props.type",
            type: "checkCard",
            props: {
              items: [
                { value: "default", label: "不设置" },
                { value: "heading", label: "标题色" },
                { value: "regular", label: "内容色" },
                { value: "secondary", label: "次要色" },
                { value: "placeholder", label: "提示色" },
                { value: "primary", label: "主色" },
                { value: "success", label: "成功色" },
                { value: "warning", label: "警告色" },
                { value: "danger", label: "危险色" },
                { value: "info", label: "信息色" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "尺寸",
            prop: "props.size",
            type: "checkCard",
            props: {
              items: [
                { value: "default", label: "不设置" },
                { value: "xxxl", label: "极大" },
                { value: "xxl", label: "超大" },
                { value: "xl", label: "特大" },
                { value: "lg", label: "大型" },
                { value: "md", label: "中等" },
                { value: "base", label: "常规" },
                { value: "sm", label: "小型" },
                { value: "xs", label: "超小" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "删除线",
            prop: "props.deleted",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "下划线",
            prop: "props.underline",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "加粗",
            prop: "props.strong",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "斜体",
            prop: "props.italic",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "图标",
            prop: "props.icon",
            type: "proFormBuilderIconInput"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "点击",
            prop: "props.onClick",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 click 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleText"
      },
      {
        type: "divider",
        name: "分割线",
        cover: covers.divider,
        presetProps: {
          direction: "horizontal",
          borderStyle: "solid",
          contentPosition: "center"
        },
        defaultProps: {},
        initialProps: {},
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "文本",
            prop: "label",
            type: "input"
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "子级",
            prop: "childrenEdit",
            type: "proFormBuilderChildrenEdit",
            props: { addBtnText: "添加子级" }
          },
          {
            label: "文本位置",
            prop: "props.contentPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左侧" },
                { value: "center", label: "中间" },
                { value: "right", label: "右侧" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "风格",
            prop: "props.borderStyle",
            type: "checkCard",
            props: {
              items: [
                { value: "solid", label: "实线" },
                { value: "dashed", label: "虚线" },
                { value: "dotted", label: "圆点" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "方向",
            prop: "props.direction",
            type: "checkCard",
            props: {
              items: [
                { value: "horizontal", label: "水平" },
                { value: "vertical", label: "垂直" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElDivider"
      },
      {
        type: "button",
        name: "按钮",
        cover: covers.button,
        presetProps: { size: "default" },
        defaultProps: { type: "primary" },
        initialProps: {},
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "文本",
            prop: "label",
            type: "input"
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "子级",
            prop: "childrenEdit",
            type: "proFormBuilderChildrenEdit",
            props: { addBtnText: "添加子级" }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "类型",
            prop: "props.type",
            type: "checkCard",
            props: {
              items: [
                { value: "default", label: "默认" },
                { value: "primary", label: "主色" },
                { value: "success", label: "成功色" },
                { value: "warning", label: "警告色" },
                { value: "danger", label: "危险色" },
                { value: "info", label: "信息色" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "尺寸",
            prop: "props.size",
            type: "checkCard",
            props: {
              items: [
                { value: "large", label: "大型" },
                { value: "default", label: "默认" },
                { value: "small", label: "小型" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "朴素风格",
            prop: "props.plain",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "文字风格",
            prop: "props.text",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "文字风格背景",
            prop: "props.bg",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "椭圆风格",
            prop: "props.round",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "圆形风格",
            prop: "props.circle",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "图标",
            prop: "props.icon",
            type: "proFormBuilderIconInput"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "点击",
            prop: "props.onClick",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 click 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElButton"
      },
      {
        type: "icon",
        name: "图标",
        cover: covers.icon,
        presetProps: {},
        defaultProps: {},
        initialProps: {},
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "图标",
            prop: "props.name",
            type: "proFormBuilderIconInput"
          },
          {
            label: "子级",
            prop: "childrenEdit",
            type: "proFormBuilderChildrenEdit",
            props: { addBtnText: "添加子级" }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "点击",
            prop: "props.onClick",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 click 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleIcon"
      },
      {
        type: "alert",
        name: "提示",
        cover: covers.alert,
        presetProps: { type: "info", closable: true, effect: "light" },
        defaultProps: {},
        initialProps: { title: "提示", showIcon: true },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "标题",
            prop: "props.title",
            type: "textarea"
          },
          {
            label: "描述",
            prop: "props.description",
            type: "textarea"
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "风格类型",
            prop: "props.type",
            type: "checkCard",
            props: {
              items: [
                { value: "info", label: "信息色" },
                { value: "success", label: "成功色" },
                { value: "warning", label: "警告色" },
                { value: "error", label: "危险色" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "是否可关闭",
            prop: "props.closable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否居中",
            prop: "props.center",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否显示图标",
            prop: "props.showIcon",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "主题",
            prop: "props.effect",
            type: "checkCard",
            props: {
              items: [
                { value: "light", label: "浅色" },
                { value: "dark", label: "深色" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "标题样式",
            prop: "props.titleStyle",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "描述样式",
            prop: "props.descriptionStyle",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "关闭",
            prop: "props.onClose",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 close 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleAlert"
      },
      {
        type: "image",
        name: "图片",
        cover: covers.image,
        presetProps: {
          initialIndex: 0,
          closeOnPressEscape: true,
          infinite: true,
          zoomRate: 1.2,
          minScale: 0.2,
          maxScale: 7
        },
        defaultProps: {},
        initialProps: { style: { width: "300px", height: "200px" } },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "图片地址",
            prop: "props.src",
            type: "input"
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "备用文本描述",
            prop: "props.alt",
            type: "input"
          },
          {
            label: "图片适应模式",
            prop: "props.fit",
            type: "checkCard",
            props: {
              items: [
                { value: "fill", label: "fill" },
                { value: "contain", label: "contain" },
                { value: "cover", label: "cover" },
                { value: "none", label: "none" },
                { value: "scale-down", label: "scale-down" }
              ],
              class: "ele-pro-form-builder-props-options-check-card is-loose"
            }
          },
          {
            label: "浏览器加载策略",
            prop: "props.loading",
            type: "checkCard",
            props: {
              items: [
                { label: "eager", value: "eager" },
                { label: "lazy", value: "lazy" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "是否懒加载",
            prop: "props.lazy",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "懒加载监听滚动容器",
            prop: "props.scrollContainer",
            type: "input"
          },
          {
            label: "使用的来源地址",
            prop: "props.referrerpolicy",
            type: "input"
          },
          {
            label: "跨域请求",
            prop: "props.crossorigin",
            type: "input"
          },
          {
            label: "图片预览地址列表",
            prop: "props.previewSrcList",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑图片预览地址列表",
              columns: "stringArray"
            }
          },
          {
            label: "初始预览索引",
            prop: "props.initialIndex",
            type: "inputNumber",
            props: { min: 0, step: 1, stepStrictly: true }
          },
          {
            label: "图片预览层级",
            prop: "props.zIndex",
            type: "inputNumber",
            props: { step: 1, stepStrictly: true }
          },
          {
            label: "是否点击遮罩关闭预览",
            prop: "props.hideOnClickModal",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否按返回键关闭预览",
            prop: "props.closeOnPressEscape",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "预览组件插入body",
            prop: "props.previewTeleported",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否可循环预览",
            prop: "props.infinite",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "图片预览缩放速率",
            prop: "props.zoomRate",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "图片预览最小缩放比例",
            prop: "props.minScale",
            type: "inputNumber",
            props: { min: 0, max: 1 }
          },
          {
            label: "图片预览最大缩放比例",
            prop: "props.maxScale",
            type: "inputNumber",
            props: { min: 1 }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "图片加载成功",
            prop: "props.onLoad",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 load 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "图片加载失败",
            prop: "props.onError",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 error 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElImage"
      },
      {
        type: "steps",
        name: "步骤条",
        cover: covers.steps,
        presetProps: { direction: "horizontal", type: "default" },
        defaultProps: {},
        initialProps: { finishStatus: "success" },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "初始选中",
            prop: "initValue",
            type: "inputNumber",
            props: { min: 0, step: 1, stepStrictly: true }
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "步骤数据",
            prop: "props.items",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑步骤数据",
              columns: [
                {
                  prop: "title",
                  label: "标题",
                  style: { textAlign: "center" }
                },
                {
                  prop: "description",
                  label: "描述",
                  style: { textAlign: "center" }
                }
              ],
              codeOptions: true,
              codeTips,
              codePlaceholder: `async () => {
    // 示例
    const res = await httpRequest.get('/system/role');
    return res.data.data.map(d => ({ title: d.roleCode, description: d.roleName }));
}
`
            }
          },
          {
            label: "方向",
            prop: "props.direction",
            type: "checkCard",
            props: {
              items: [
                { value: "horizontal", label: "水平" },
                { value: "vertical", label: "垂直" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "居中",
            prop: "props.alignCenter",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "风格",
            prop: "props.type",
            type: "checkCard",
            props: {
              items: [
                { value: "default", label: "默认" },
                { value: "inline", label: "紧凑" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleSteps"
      },
      {
        type: "proTable",
        name: "高级表格",
        cover: covers.proTable,
        presetProps: {
          fit: true,
          showHeader: true,
          tooltipEffect: "dark",
          selectOnIndeterminate: true,
          indent: 16,
          tableLayout: "fixed",
          showOverflowTooltip: true,
          headerEllipsis: true
        },
        defaultProps: {},
        initialProps: {
          datasource: [
            {
              key: "1",
              username: "张小三",
              amount: 18,
              province: "浙江",
              city: "杭州",
              zone: "西湖区",
              street: "西溪街道",
              address: "西溪花园30栋1单元"
            },
            {
              key: "2",
              username: "李小四",
              amount: 39,
              province: "江苏",
              city: "苏州",
              zone: "姑苏区",
              street: "丝绸路",
              address: "天墅之城9幢2单元"
            },
            {
              key: "3",
              username: "王小五",
              amount: 8,
              province: "江西",
              city: "南昌",
              zone: "青山湖区",
              street: "艾溪湖办事处",
              address: "中兴和园1幢3单元"
            },
            {
              key: "4",
              username: "赵小六",
              amount: 16,
              province: "福建",
              city: "泉州",
              zone: "丰泽区",
              street: "南洋街道",
              address: "南洋村6幢1单元"
            },
            {
              key: "5",
              username: "孙小七",
              amount: 12,
              province: "湖北",
              city: "武汉",
              zone: "武昌区",
              street: "武昌大道",
              address: "两湖花园16幢2单元"
            },
            {
              key: "6",
              username: "周小八",
              amount: 11,
              province: "安徽",
              city: "黄山",
              zone: "黄山区",
              street: "汤口镇",
              address: "温泉村21号"
            }
          ],
          columns: [
            {
              type: "index",
              columnKey: "index",
              width: 56,
              align: "center",
              fixed: "left"
            },
            { prop: "username", label: "账号", align: "center", minWidth: 110 },
            {
              columnKey: "cityAddress",
              label: "地址",
              align: "center",
              children: [
                {
                  prop: "province",
                  label: "省",
                  align: "center",
                  minWidth: 100
                },
                {
                  prop: "city",
                  label: "市",
                  align: "center",
                  minWidth: 100
                },
                {
                  prop: "zone",
                  label: "区",
                  align: "center",
                  minWidth: 120
                },
                {
                  prop: "street",
                  label: "街道",
                  align: "center",
                  minWidth: 120
                },
                {
                  prop: "address",
                  label: "详细地址",
                  align: "center",
                  minWidth: 160
                }
              ]
            },
            {
              prop: "amount",
              label: "金额",
              align: "center",
              minWidth: 80
            }
          ],
          showOverflowTooltip: true,
          highlightCurrentRow: true
        },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "表格数据",
            prop: "props.datasource",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑表格数据",
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
`
            }
          },
          {
            label: "表格列",
            prop: "props.columns",
            type: "proFormBuilderOptionsEdit",
            props: {
              title: "编辑表格列",
              isTreeData: true,
              columns: "tableColumns"
            }
          },
          {
            label: "行数据Key",
            prop: "props.rowKey",
            type: "input"
          },
          {
            label: "高度",
            prop: "props.height",
            type: "inputNumber",
            props: { min: 1 }
          },
          {
            label: "最大高度",
            prop: "props.maxHeight",
            type: "inputNumber",
            props: { min: 1 }
          },
          {
            label: "是否显示斑马纹",
            prop: "props.stripe",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否显示边框",
            prop: "props.border",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "尺寸",
            prop: "props.size",
            type: "checkCard",
            props: {
              items: [
                { value: "large", label: "宽松" },
                { value: "default", label: "中等" },
                { value: "small", label: "紧凑" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "列宽是否自动撑开",
            prop: "props.fit",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否显示表头",
            prop: "props.showHeader",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否高亮点击行",
            prop: "props.highlightCurrentRow",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "空数据显示文本",
            prop: "props.emptyText",
            type: "input"
          },
          {
            label: "树表格默认展开所有",
            prop: "props.defaultExpandAll",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否显示表尾合计行",
            prop: "props.showSummary",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "表尾合计行第一列文本",
            prop: "props.sumText",
            type: "input"
          },
          {
            label: "全选框半选点击是否选中所有",
            prop: "props.selectOnIndeterminate",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "树表格缩进",
            prop: "props.indent",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "树表格是否懒加载",
            prop: "props.lazy",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "表格布局方式",
            prop: "props.tableLayout",
            type: "checkCard",
            props: {
              items: [
                { label: "fixed", value: "fixed" },
                { label: "auto", value: "auto" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "总是显示滚动条",
            prop: "props.scrollbarAlwaysOn",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "确保主轴最小尺寸",
            prop: "props.flexible",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "表头内容是否溢出省略",
            prop: "props.headerEllipsis",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "表头是否粘性定位",
            prop: "props.sticky",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否使用虚拟滚动",
            prop: "props.virtual",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "数据加载完成",
            prop: "props.onDone",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 done 事件",
              codeTips,
              codePlaceholder: "(result, parent) => {\n\n}"
            }
          },
          {
            label: "列配置改变",
            prop: "props.onColumnsChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 columnsChange 事件",
              codeTips,
              codePlaceholder: "(columns, tableColumns, isReset) => {\n\n}"
            }
          },
          {
            label: "尺寸改变",
            prop: "props.onSizeChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 sizeChange 事件",
              codeTips,
              codePlaceholder: "(size) => {\n\n}"
            }
          },
          {
            label: "最大化切换",
            prop: "props.onMaximizedChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 maximizedChange 事件",
              codeTips,
              codePlaceholder: "(maximized) => {\n\n}"
            }
          },
          {
            label: "静态数据时刷新按钮点击",
            prop: "props.onRefresh",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 refresh 事件",
              codeTips,
              codePlaceholder: "() => {\n\n}"
            }
          },
          {
            label: "选择项改变",
            prop: "props.onSelectionChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 selectionChange 事件",
              codeTips,
              codePlaceholder: "(selections) => {\n\n}"
            }
          },
          {
            label: "单元格点击",
            prop: "props.onCellClick",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 cellClick 事件",
              codeTips,
              codePlaceholder: "(row, column, cell, event) => {\n\n}"
            }
          },
          {
            label: "单元格双击",
            prop: "props.onCellDblclick",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 cellDblclick 事件",
              codeTips,
              codePlaceholder: "(row, column, cell, event) => {\n\n}"
            }
          },
          {
            label: "行点击",
            prop: "props.onRowClick",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 rowClick 事件",
              codeTips,
              codePlaceholder: "(row, column, event) => {\n\n}"
            }
          },
          {
            label: "行双击",
            prop: "props.onRowDblclick",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 rowDblclick 事件",
              codeTips,
              codePlaceholder: "(row, column, event) => {\n\n}"
            }
          },
          {
            label: "表头点击",
            prop: "props.onHeaderClick",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 headerClick 事件",
              codeTips,
              codePlaceholder: "(column, event) => {\n\n}"
            }
          },
          {
            label: "表格滚动",
            prop: "props.onScroll",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 scroll 事件",
              codeTips,
              codePlaceholder: "(params) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleProTable"
      }
    ]
  },
  {
    name: "容器类型组件",
    items: [
      {
        type: "card",
        name: "卡片",
        cover: covers.card,
        presetProps: { shadow: "never", collapsable: false },
        defaultProps: { bordered: true },
        initialProps: { header: "卡片" },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "标题",
            prop: "props.header",
            type: "textarea"
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "边框",
            prop: "props.bordered",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "阴影",
            prop: "props.shadow",
            type: "checkCard",
            props: {
              items: [
                { value: "never", label: "不显示" },
                { value: "always", label: "显示" },
                { value: "hover", label: "鼠标进入显示" }
              ],
              class: "ele-pro-form-builder-props-options-check-card is-loose"
            }
          },
          {
            label: "可否折叠",
            prop: "props.collapsable",
            type: "checkCard",
            props: {
              items: [
                { value: false, label: "不可折叠" },
                { value: true, label: "可折叠" },
                { value: "header", label: "点击标题折叠" }
              ],
              class: "ele-pro-form-builder-props-options-check-card is-loose"
            }
          },
          {
            label: "标题样式",
            prop: "props.headerStyle",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "主体样式",
            prop: "props.bodyStyle",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "主体类名",
            prop: "props.bodyClass",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "底部文本",
            prop: "props.footer",
            type: "textarea"
          },
          {
            label: "底部样式",
            prop: "props.footerStyle",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "折叠展开改变",
            prop: "props.onCollapseChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 collapseChange 事件",
              codeTips,
              codePlaceholder: "(collapse) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleCard"
      },
      {
        type: "table",
        name: "表格",
        cover: covers.table,
        presetProps: { size: "default", hasHeader: true },
        defaultProps: {},
        initialProps: {
          border: true,
          hasHeader: false,
          style: { tableLayout: "fixed" }
        },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "边框",
            prop: "props.border",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "斑马纹",
            prop: "props.stripe",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "尺寸",
            prop: "props.size",
            type: "checkCard",
            props: {
              items: [
                { value: "large", label: "宽松" },
                { value: "default", label: "正常" },
                { value: "small", label: "紧凑" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleTable"
      },
      {
        type: "tableCell",
        name: "单元格",
        cover: covers.table,
        presetProps: { is: "td" },
        defaultProps: {},
        initialProps: {},
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "标签",
            prop: "props.is",
            type: "checkCard",
            props: {
              items: [
                { value: "td", label: "td" },
                { value: "th", label: "th" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "点击",
            prop: "props.onClick",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 click 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          }
        ],
        componentName: "td",
        hide: true
      },
      {
        type: "tableRow",
        name: "表格行",
        cover: covers.table,
        presetProps: {},
        defaultProps: {},
        initialProps: {},
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "点击",
            prop: "props.onClick",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 click 事件",
              codeTips,
              codePlaceholder: "(collapse) => {\n\n}"
            }
          }
        ],
        componentName: "tr",
        hide: true
      },
      {
        type: "tabs",
        name: "选项卡",
        cover: covers.tabs,
        presetProps: { tabPosition: "top", size: "default", type: "default" },
        defaultProps: { type: "border-card" },
        initialProps: {},
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "初始选中",
            prop: "initValue",
            type: "input"
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选项卡",
            prop: "childrenEdit",
            type: "proFormBuilderChildrenEdit",
            props: { addBtnText: "添加选项卡" }
          },
          {
            label: "选项卡所在位置",
            prop: "props.tabPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "top", label: "顶部" },
                { value: "left", label: "左侧" },
                { value: "right", label: "右侧" },
                { value: "bottom", label: "底部" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "标签宽度自动撑开",
            prop: "props.stretch",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "尺寸",
            prop: "props.size",
            type: "checkCard",
            props: {
              items: [
                { value: "large", label: "大型" },
                { value: "default", label: "默认" },
                { value: "small", label: "小型" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "风格",
            prop: "props.type",
            type: "checkCard",
            props: {
              items: [
                { value: "default", label: "默认" },
                { value: "card", label: "卡片" },
                { value: "border-card", label: "边框卡片" },
                { value: "simple", label: "简约" },
                { value: "indicator", label: "指示器" },
                { value: "button", label: "按钮" },
                { value: "tag", label: "标签" }
              ],
              class: "ele-pro-form-builder-props-options-check-card is-loose"
            }
          },
          {
            label: "标签居中",
            prop: "props.center",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "标签鼠标滑轮滚动",
            prop: "props.mousewheel",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中切换",
            prop: "props.onTabChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 tabChange 事件",
              codeTips,
              codePlaceholder: "(name) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleTabs"
      },
      {
        type: "tabPane",
        name: "选项卡",
        cover: covers.tabs,
        presetProps: {},
        defaultProps: {},
        initialProps: { label: "选项卡" },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "标题",
            prop: "props.label",
            type: "input"
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "是否可关闭",
            prop: "props.closable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否禁用",
            prop: "props.disabled",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "是否延迟渲染",
            prop: "props.lazy",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "div",
        hide: true
      },
      {
        type: "row",
        name: "栅格",
        cover: covers.row,
        presetProps: { gutter: 0, justify: "start" },
        defaultProps: {},
        initialProps: { gutter: 6 },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "栅格",
            prop: "childrenEdit",
            type: "proFormBuilderChildrenEdit",
            props: { addBtnText: "添加栅格" }
          },
          {
            label: "栅格间隔",
            prop: "props.gutter",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "水平排列方式",
            prop: "props.justify",
            type: "checkCard",
            props: {
              items: [
                { value: "start", label: "start" },
                { value: "end", label: "end" },
                { value: "center", label: "center" },
                { value: "space-around", label: "space-around" },
                { value: "space-between", label: "space-between" },
                { value: "space-evenly", label: "space-evenly" }
              ],
              class: "ele-pro-form-builder-props-options-check-card is-loose"
            }
          },
          {
            label: "垂直排列方式",
            prop: "props.align",
            type: "checkCard",
            props: {
              items: [
                { value: "top", label: "top" },
                { value: "middle", label: "middle" },
                { value: "bottom", label: "bottom" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElRow"
      },
      {
        type: "col",
        name: "栅格列",
        cover: covers.row,
        presetProps: { span: 24, offset: 0, push: 0, pull: 0 },
        defaultProps: {},
        initialProps: { span: 12 },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "栅格所占列数",
            prop: "props.span",
            type: "inputNumber",
            props: { min: 1, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "栅格左侧间隔格数",
            prop: "props.offset",
            type: "inputNumber",
            props: { min: 0, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "栅格向右移动格数",
            prop: "props.push",
            type: "inputNumber",
            props: { min: 0, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "栅格向左移动格数",
            prop: "props.pull",
            type: "inputNumber",
            props: { min: 0, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "响应式 xs (<768px)",
            prop: "groupXsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "栅格所占列数",
            prop: "props.xs.span",
            type: "inputNumber",
            props: { min: 1, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "栅格左侧间隔格数",
            prop: "props.xs.offset",
            type: "inputNumber",
            props: { min: 0, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "栅格向右移动格数",
            prop: "props.xs.push",
            type: "inputNumber",
            props: { min: 0, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "栅格向左移动格数",
            prop: "props.xs.pull",
            type: "inputNumber",
            props: { min: 0, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "响应式 sm (≥768px)",
            prop: "groupSmLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "栅格所占列数",
            prop: "props.sm.span",
            type: "inputNumber",
            props: { min: 1, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "栅格左侧间隔格数",
            prop: "props.sm.offset",
            type: "inputNumber",
            props: { min: 0, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "栅格向右移动格数",
            prop: "props.sm.push",
            type: "inputNumber",
            props: { min: 0, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "栅格向左移动格数",
            prop: "props.sm.pull",
            type: "inputNumber",
            props: { min: 0, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "响应式 md (≥992px)",
            prop: "groupMdLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "栅格所占列数",
            prop: "props.md.span",
            type: "inputNumber",
            props: { min: 1, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "栅格左侧间隔格数",
            prop: "props.md.offset",
            type: "inputNumber",
            props: { min: 0, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "栅格向右移动格数",
            prop: "props.md.push",
            type: "inputNumber",
            props: { min: 0, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "栅格向左移动格数",
            prop: "props.md.pull",
            type: "inputNumber",
            props: { min: 0, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "响应式 lg (≥1200px)",
            prop: "groupLgLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "栅格所占列数",
            prop: "props.lg.span",
            type: "inputNumber",
            props: { min: 1, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "栅格左侧间隔格数",
            prop: "props.lg.offset",
            type: "inputNumber",
            props: { min: 0, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "栅格向右移动格数",
            prop: "props.lg.push",
            type: "inputNumber",
            props: { min: 0, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "栅格向左移动格数",
            prop: "props.lg.pull",
            type: "inputNumber",
            props: { min: 0, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "响应式 xl (≥1920px)",
            prop: "groupXlLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "栅格所占列数",
            prop: "props.xl.span",
            type: "inputNumber",
            props: { min: 1, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "栅格左侧间隔格数",
            prop: "props.xl.offset",
            type: "inputNumber",
            props: { min: 0, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "栅格向右移动格数",
            prop: "props.xl.push",
            type: "inputNumber",
            props: { min: 0, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "栅格向左移动格数",
            prop: "props.xl.pull",
            type: "inputNumber",
            props: { min: 0, max: 24, step: 1, stepStrictly: true }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElCol",
        hide: true
      },
      {
        type: "collapse",
        name: "折叠面板",
        cover: covers.collapse,
        presetProps: {},
        defaultProps: {},
        initialProps: { accordion: true },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "初始展开",
            prop: "initValue",
            type: "input"
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "面板",
            prop: "childrenEdit",
            type: "proFormBuilderChildrenEdit",
            props: { addBtnText: "添加面板" }
          },
          {
            label: "手风琴模式",
            prop: "props.accordion",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "展开折叠切换",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(activeNames) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElCollapse"
      },
      {
        type: "collapseItem",
        name: "折叠面板",
        cover: covers.collapse,
        presetProps: {},
        defaultProps: {},
        initialProps: { title: "折叠面板" },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "标题",
            prop: "props.title",
            type: "input"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElCollapseItem",
        hide: true
      },
      {
        type: "carousel",
        name: "走马灯",
        cover: covers.carousel,
        presetProps: {
          height: "300px",
          initialIndex: 0,
          trigger: "hover",
          autoplay: true,
          interval: 3e3,
          arrow: "hover",
          type: "",
          cardScale: 0.83,
          loop: true,
          direction: "horizontal",
          pauseOnHover: true
        },
        defaultProps: {},
        initialProps: { indicatorPosition: "outside" },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "走马灯",
            prop: "childrenEdit",
            type: "proFormBuilderChildrenEdit",
            props: { addBtnText: "添加走马灯" }
          },
          {
            label: "高度",
            prop: "props.height",
            type: "input"
          },
          {
            label: "初始显示索引",
            prop: "props.initialIndex",
            type: "inputNumber",
            props: { min: 1, step: 1, stepStrictly: true }
          },
          {
            label: "指示器触发方式",
            prop: "props.trigger",
            type: "checkCard",
            props: {
              items: [
                { value: "hover", label: "hover" },
                { value: "click", label: "click" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "是否自动切换",
            prop: "props.autoplay",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "自动切换间隔",
            prop: "props.interval",
            type: "inputNumber",
            props: { min: 1, step: 1, stepStrictly: true }
          },
          {
            label: "指示器位置",
            prop: "props.indicatorPosition",
            type: "checkCard",
            props: {
              items: [
                { value: "", label: "default" },
                { value: "none", label: "none" },
                { value: "outside", label: "outside" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "类型",
            prop: "props.type",
            type: "checkCard",
            props: {
              items: [
                { value: "", label: "默认" },
                { value: "card", label: "卡片" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "卡片类型二级缩放",
            prop: "props.cardScale",
            type: "inputNumber",
            props: { max: 1, step: 0.01 }
          },
          {
            label: "是否循环显示",
            prop: "props.loop",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "展示方向",
            prop: "props.direction",
            type: "checkCard",
            props: {
              items: [
                { value: "horizontal", label: "水平" },
                { value: "vertical", label: "垂直" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "鼠标移入暂停切换",
            prop: "props.pauseOnHover",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "切换时动态模糊",
            prop: "props.motionBlur",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "选中切换",
            prop: "props.onChange",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 change 事件",
              codeTips,
              codePlaceholder: "(current, prev) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElCarousel"
      },
      {
        type: "carouselItem",
        name: "走马灯",
        cover: covers.carousel,
        presetProps: {},
        defaultProps: {},
        initialProps: {},
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "指示器文本",
            prop: "props.label",
            type: "input"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElCarouselItem",
        hide: true
      },
      {
        type: "descriptions",
        name: "描述列表",
        cover: covers.descriptions,
        presetProps: { column: 3, direction: "horizontal" },
        defaultProps: {},
        initialProps: {
          border: true,
          column: 2,
          class: "ele-pro-form-descriptions-details"
        },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "描述列表",
            prop: "childrenEdit",
            type: "proFormBuilderChildrenEdit",
            props: { addBtnText: "添加描述列表" }
          },
          {
            label: "边框",
            prop: "props.border",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "显示列数",
            prop: "props.column",
            type: "inputNumber",
            props: { min: 1, step: 1, stepStrictly: true }
          },
          {
            label: "排列方向",
            prop: "props.direction",
            type: "checkCard",
            props: {
              items: [
                { value: "horizontal", label: "水平" },
                { value: "vertical", label: "垂直" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "尺寸",
            prop: "props.size",
            type: "checkCard",
            props: {
              items: [
                { value: "large", label: "大型" },
                { value: "default", label: "默认" },
                { value: "small", label: "小型" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "标题",
            prop: "props.title",
            type: "input"
          },
          {
            label: "操作区文本",
            prop: "props.extra",
            type: "input"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElDescriptions"
      },
      {
        type: "descriptionsItem",
        name: "描述列表",
        cover: covers.descriptions,
        presetProps: { span: 1, rowspan: 1, align: "left" },
        defaultProps: {},
        initialProps: { label: "标题" },
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "标签文本",
            prop: "props.label",
            type: "input"
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "跨列",
            prop: "props.span",
            type: "inputNumber",
            props: { min: 1, step: 1, stepStrictly: true }
          },
          {
            label: "跨行",
            prop: "props.rowspan",
            type: "inputNumber",
            props: { min: 1, step: 1, stepStrictly: true }
          },
          {
            label: "列宽",
            prop: "props.width",
            type: "inputNumber",
            props: { min: 1, step: 1, stepStrictly: true }
          },
          {
            label: "最小列宽",
            prop: "props.minWidth",
            type: "inputNumber",
            props: { min: 0 }
          },
          {
            label: "对齐方式",
            prop: "props.align",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "center", label: "居中" },
                { value: "right", label: "右对齐" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "标签对齐方式",
            prop: "props.labelAlign",
            type: "checkCard",
            props: {
              items: [
                { value: "left", label: "左对齐" },
                { value: "center", label: "居中" },
                { value: "right", label: "右对齐" }
              ],
              class: "ele-pro-form-builder-props-options-check-card"
            }
          },
          {
            label: "内容自定义类名",
            prop: "props.className",
            type: "input"
          },
          {
            label: "标签自定义类名",
            prop: "props.labelClassName",
            type: "input"
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "ElDescriptionsItem",
        hide: true
      },
      {
        type: "adminLayout",
        name: "高级布局",
        cover: covers.div,
        presetProps: { height: "100%", tabStyle: "simple" },
        defaultProps: {},
        initialProps: {},
        reservedProps: {},
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "高度",
            prop: "props.height",
            type: "input"
          },
          {
            label: "是否折叠侧栏",
            prop: "props.collapse",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "双侧栏一级是否紧凑风格",
            prop: "props.compact",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "Logo文字",
            prop: "props.logoTitle",
            type: "input"
          },
          {
            label: "Logo图片地址",
            prop: "props.logoSrc",
            type: "input"
          },
          {
            label: "是否是移动端风格",
            prop: "props.mobile",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "EleAdminLayout",
        hide: true
      },
      {
        type: "div",
        name: "div",
        cover: covers.div,
        presetProps: { is: "div" },
        defaultProps: {},
        initialProps: {},
        reservedProps: {},
        initialData: { containerDraggable: true },
        configForm: [
          {
            label: "基础配置",
            prop: "groupBasicLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件类型",
            prop: "type",
            type: "proFormBuilderTypeEdit"
          },
          {
            label: "编号",
            prop: "prop",
            type: "input"
          },
          {
            label: "组件属性",
            prop: "groupPropsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "子级",
            prop: "childrenEdit",
            type: "proFormBuilderChildrenEdit",
            props: { addBtnText: "添加子级" }
          },
          {
            label: "子级可视化拖拽",
            prop: "containerDraggable",
            type: "switch",
            props: { activeValue: true, inactiveValue: false }
          },
          {
            label: "渲染标签",
            prop: "props.is",
            type: "input"
          },
          {
            label: "内容",
            prop: "label",
            type: "textarea"
          },
          {
            label: "富文本",
            prop: "props.innerHTML",
            type: "proFormBuilderHtmlEdit",
            props: { title: "编辑富文本" }
          },
          {
            label: "样式设置",
            prop: "groupStylesLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "组件样式",
            prop: "props.style",
            type: "proFormBuilderStyleEdit"
          },
          {
            label: "组件类名",
            prop: "props.class",
            type: "proFormBuilderStyleEdit",
            props: { isClass: true }
          },
          {
            label: "事件设置",
            prop: "groupEventsLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "点击",
            prop: "props.onClick",
            type: "proFormBuilderEventEdit",
            props: {
              title: "设置 click 事件",
              codeTips,
              codePlaceholder: "(event) => {\n\n}"
            }
          },
          {
            label: "高级设置",
            prop: "groupAdvancedLabel",
            type: "label",
            props: { class: "ele-pro-form-builder-props-group-label" }
          },
          {
            label: "显示条件",
            prop: "vIf",
            type: "proFormBuilderIfEdit",
            props: {
              title: "设置显示条件",
              codeTips: vIfCodeTips
            }
          },
          {
            label: "开发者选项",
            prop: "__sourceCode",
            type: "proFormBuilderSourceEdit",
            props: { title: "编辑源码" }
          }
        ],
        componentName: "div"
      }
    ]
  }
];
export {
  codeTips,
  defaultComponentData,
  vIfCodeTips
};
