const chatInputToolProps = {
  /** 图标 */
  icon: [String, Object, Function],
  /** 图标属性 */
  iconProps: Object,
  /** 图标样式 */
  iconStyle: [Object, Array, String],
  /** 是否是圆形风格 */
  round: {
    type: Boolean,
    default: true
  },
  /** 是否是按钮风格(按钮风格有边框) */
  button: Boolean,
  /** 文本(非按钮风格为文本提示) */
  label: String,
  /** 按钮风格时的文本样式 */
  labelStyle: [Object, Array, String],
  /** 非按钮风格时的文本提示属性 */
  tooltipProps: Object,
  /** 下拉菜单属性 */
  dropdownProps: Object,
  /** 下拉菜单数据 */
  dropdownItems: Array,
  /** 按钮类型 */
  type: String,
  /** 是否选中状态 */
  selected: Boolean,
  /** 是否禁用状态 */
  disabled: Boolean,
  /** 是否是加载状态 */
  loading: Boolean
};
const chatProps = {
  /** 输入框文本 */
  modelValue: String,
  /** 输入框提示文本 */
  placeholder: String,
  /** 对话列表 */
  conversations: Array,
  /** 对话列表选中 */
  active: [String, Number],
  /** 消息列表 */
  messages: Array,
  /** 附件列表 */
  files: Array,
  /** 是否折叠侧栏 */
  collapse: Boolean,
  /** 侧栏样式 */
  sideStyle: {
    type: [Object, Array, String, Boolean],
    default: () => null
  },
  /** logo 样式 */
  logoStyle: [Object, Array, String],
  /** logo 图片地址 */
  logoSrc: String,
  /** logo 文字 */
  logoTitle: String,
  /** logo 图片样式 */
  logoImgStyle: [Object, Array, String],
  /** logo 文字样式 */
  logoTitleStyle: [Object, Array, String],
  /** 顶栏 logo 样式 */
  headerLogoStyle: [Object, Array, String],
  /** 顶栏样式 */
  headerStyle: {
    type: [Object, Array, String, Boolean],
    default: () => null
  },
  /** 顶栏标题样式 */
  headerTitleStyle: [Object, Array, String],
  /** 顶栏左侧操作按钮区样式 */
  headerToolsStyle: {
    type: [Object, Array, String, Boolean],
    default: () => null
  },
  /** 底栏样式 */
  footerStyle: {
    type: [Object, Array, String, Boolean],
    default: () => null
  },
  /** 新对话按钮属性 */
  newBtnProps: {
    type: [Object, Boolean],
    default: () => null
  },
  /** 发送按钮属性 */
  sendBtnProps: {
    type: [Object, Boolean],
    default: () => null
  },
  /** 上传按钮属性 */
  uploadBtnProps: {
    type: [Object, Boolean],
    default: () => null
  },
  /** 上传组件属性 */
  uploadProps: Object,
  /** 附件图片查看器属性 */
  imageViewerProps: {
    type: [Boolean, Object, Function],
    default: () => null
  },
  /** 下拉菜单属性 */
  dropdownProps: Object,
  /** 下拉菜单数据 */
  dropdownItems: [Array, Function],
  /** 文字提示属性 */
  tooltipProps: {
    type: [Object, Boolean],
    default: () => null
  },
  /** 返回底部按钮属性 */
  backbottomProps: Object,
  /** 气泡内容编辑确认按钮属性 */
  editConfirmBtnProps: Object,
  /** 气泡内容编辑取消按钮属性 */
  editCancelBtnProps: Object,
  /** 气泡内容编辑框属性 */
  editInputProps: Object,
  /** 是否开启响应式 */
  responsive: {
    type: Boolean,
    default: null
  },
  /** 国际化 */
  locale: Object
};
const chatPropsKeys = Object.keys(chatProps);
const chatEmits = {
  /** 更新输入框文本 */
  "update:modelValue": (_value) => true,
  /** 更新侧栏折叠状态 */
  "update:collapse": (_collapse) => true,
  /** logo 点击事件 */
  logoClick: (_e) => true,
  /** 新对话按钮点击事件 */
  newBtnClick: (_e) => true,
  /** 更新对话列表选中 */
  "update:active": (_active) => true,
  /** 对话列表项点击事件 */
  conversationClick: (_item) => true,
  /** 回车发送事件 */
  send: (_content) => true,
  /** 发送按钮点击事件 */
  sendBtnClick: (_e) => true,
  /** 输入框输入事件 */
  input: (_e) => true,
  /** 输入框获取焦点事件 */
  focus: (_e) => true,
  /** 输入框失去焦点事件 */
  blur: (_e) => true,
  /** 附件点击事件 */
  fileClick: (_item) => true,
  /** 附件删除事件 */
  fileRemove: (_item) => true,
  /** 附件上传事件 */
  fileUpload: (_item) => true,
  /** 聊天气泡中附件点击事件 */
  bubbleFileClick: (_item, _fileItem) => true,
  /** 聊天气泡中附件删除事件 */
  bubbleFileRemove: (_item, _fileItem) => true,
  /** 编辑取消事件 */
  bubbleEditCancel: (_item) => true,
  /** 编辑确认事件 */
  bubbleEditConfirm: (_item, _content) => true
};
const CHAT_KEY = /* @__PURE__ */ Symbol("chat");
const defaultTooltipProps = {
  offset: 6,
  hideAfter: 100,
  trigger: "hover",
  placement: "top",
  popperClass: "ele-chat-tooltip",
  popperOptions: {
    strategy: "fixed"
  }
};
const defaultDropdownProps = {
  trigger: "click",
  placement: "bottom-end",
  popperClass: "ele-chat-dropdown",
  popperOptions: {
    strategy: "fixed",
    modifiers: [{ name: "offset", options: { offset: [8, 4] } }]
  }
};
export {
  CHAT_KEY,
  chatEmits,
  chatInputToolProps,
  chatProps,
  chatPropsKeys,
  defaultDropdownProps,
  defaultTooltipProps
};
