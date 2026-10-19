import type { PropType, ExtractPropTypes, InjectionKey } from 'vue';
import type {
  StyleValues,
  UserComponent,
  ComponentProps
} from '../ele-app/types';
import type {
  ElButtonProps,
  ElUploadProps,
  ElIconProps,
  ElInputProps
} from '../ele-app/el';
import type {
  EleDropdownPropsAndEmits,
  EleTooltipPropsAndEmits
} from '../ele-app/plus';
import type { DropdownItem } from '../ele-dropdown/types';
import type {
  ConversationItem,
  MessageItem,
  FileItem,
  FileImageViewerProps,
  ConversationDropdownItems,
  ChatProvide,
  ChatLocale
} from './types';

/**
 * 输入框底部按钮属性
 */
export const chatInputToolProps = {
  /** 图标 */
  icon: [String, Object, Function] as PropType<UserComponent>,
  /** 图标属性 */
  iconProps: Object as PropType<ElIconProps>,
  /** 图标样式 */
  iconStyle: [Object, Array, String] as PropType<StyleValues>,
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
  labelStyle: [Object, Array, String] as PropType<StyleValues>,
  /** 非按钮风格时的文本提示属性 */
  tooltipProps: Object as PropType<EleTooltipPropsAndEmits>,
  /** 下拉菜单属性 */
  dropdownProps: Object as PropType<EleDropdownPropsAndEmits>,
  /** 下拉菜单数据 */
  dropdownItems: Array as PropType<DropdownItem[]>,
  /** 按钮类型 */
  type: String as PropType<'default' | 'primary'>,
  /** 是否选中状态 */
  selected: Boolean,
  /** 是否禁用状态 */
  disabled: Boolean,
  /** 是否是加载状态 */
  loading: Boolean
};

export type ChatInputToolProps = ExtractPropTypes<typeof chatInputToolProps>;

export type EleChatInputToolProps = ComponentProps<ChatInputToolProps>;

/**
 * 属性
 */
export const chatProps = {
  /** 输入框文本 */
  modelValue: String,
  /** 输入框提示文本 */
  placeholder: String,
  /** 对话列表 */
  conversations: Array as PropType<ConversationItem[]>,
  /** 对话列表选中 */
  active: [String, Number] as PropType<string | number>,
  /** 消息列表 */
  messages: Array as PropType<MessageItem[]>,
  /** 附件列表 */
  files: Array as PropType<FileItem[]>,
  /** 是否折叠侧栏 */
  collapse: Boolean,
  /** 侧栏样式 */
  sideStyle: {
    type: [Object, Array, String, Boolean] as PropType<StyleValues | boolean>,
    default: () => null
  },
  /** logo 样式 */
  logoStyle: [Object, Array, String] as PropType<StyleValues>,
  /** logo 图片地址 */
  logoSrc: String,
  /** logo 文字 */
  logoTitle: String,
  /** logo 图片样式 */
  logoImgStyle: [Object, Array, String] as PropType<StyleValues>,
  /** logo 文字样式 */
  logoTitleStyle: [Object, Array, String] as PropType<StyleValues>,
  /** 顶栏 logo 样式 */
  headerLogoStyle: [Object, Array, String] as PropType<StyleValues>,
  /** 顶栏样式 */
  headerStyle: {
    type: [Object, Array, String, Boolean] as PropType<StyleValues | boolean>,
    default: () => null
  },
  /** 顶栏标题样式 */
  headerTitleStyle: [Object, Array, String] as PropType<StyleValues>,
  /** 顶栏左侧操作按钮区样式 */
  headerToolsStyle: {
    type: [Object, Array, String, Boolean] as PropType<StyleValues | boolean>,
    default: () => null
  },
  /** 底栏样式 */
  footerStyle: {
    type: [Object, Array, String, Boolean] as PropType<StyleValues | boolean>,
    default: () => null
  },
  /** 新对话按钮属性 */
  newBtnProps: {
    type: [Object, Boolean] as PropType<ElButtonProps | boolean>,
    default: () => null
  },
  /** 发送按钮属性 */
  sendBtnProps: {
    type: [Object, Boolean] as PropType<EleChatInputToolProps | boolean>,
    default: () => null
  },
  /** 上传按钮属性 */
  uploadBtnProps: {
    type: [Object, Boolean] as PropType<EleChatInputToolProps | boolean>,
    default: () => null
  },
  /** 上传组件属性 */
  uploadProps: Object as PropType<ElUploadProps>,
  /** 附件图片查看器属性 */
  imageViewerProps: {
    type: [Boolean, Object, Function] as PropType<FileImageViewerProps>,
    default: () => null
  },
  /** 下拉菜单属性 */
  dropdownProps: Object as PropType<EleDropdownPropsAndEmits>,
  /** 下拉菜单数据 */
  dropdownItems: [Array, Function] as PropType<ConversationDropdownItems>,
  /** 文字提示属性 */
  tooltipProps: {
    type: [Object, Boolean] as PropType<EleTooltipPropsAndEmits | boolean>,
    default: () => null
  },
  /** 返回底部按钮属性 */
  backbottomProps: Object as PropType<ElIconProps>,
  /** 气泡内容编辑确认按钮属性 */
  editConfirmBtnProps: Object as PropType<ElButtonProps>,
  /** 气泡内容编辑取消按钮属性 */
  editCancelBtnProps: Object as PropType<ElButtonProps>,
  /** 气泡内容编辑框属性 */
  editInputProps: Object as PropType<ElInputProps>,
  /** 是否开启响应式 */
  responsive: {
    type: Boolean,
    default: null
  },
  /** 国际化 */
  locale: Object as PropType<Partial<ChatLocale>>
};

export type ChatProps = ExtractPropTypes<typeof chatProps>;

export type ChatPropsKeys = Array<keyof typeof chatProps>;

export const chatPropsKeys: ChatPropsKeys = Object.keys(chatProps) as any;

/**
 * 事件
 */
export const chatEmits = {
  /** 更新输入框文本 */
  'update:modelValue': (_value: string) => true,
  /** 更新侧栏折叠状态 */
  'update:collapse': (_collapse: boolean) => true,
  /** logo 点击事件 */
  logoClick: (_e: MouseEvent) => true,
  /** 新对话按钮点击事件 */
  newBtnClick: (_e: MouseEvent) => true,
  /** 更新对话列表选中 */
  'update:active': (_active?: string | number) => true,
  /** 对话列表项点击事件 */
  conversationClick: (_item: ConversationItem) => true,
  /** 回车发送事件 */
  send: (_content: string) => true,
  /** 发送按钮点击事件 */
  sendBtnClick: (_e: MouseEvent) => true,
  /** 输入框输入事件 */
  input: (_e: InputEvent) => true,
  /** 输入框获取焦点事件 */
  focus: (_e: FocusEvent) => true,
  /** 输入框失去焦点事件 */
  blur: (_e: FocusEvent) => true,
  /** 附件点击事件 */
  fileClick: (_item: FileItem) => true,
  /** 附件删除事件 */
  fileRemove: (_item: FileItem) => true,
  /** 附件上传事件 */
  fileUpload: (_item: FileItem) => true,
  /** 聊天气泡中附件点击事件 */
  bubbleFileClick: (_item: MessageItem, _fileItem: FileItem) => true,
  /** 聊天气泡中附件删除事件 */
  bubbleFileRemove: (_item: MessageItem, _fileItem: FileItem) => true,
  /** 编辑取消事件 */
  bubbleEditCancel: (_item: MessageItem) => true,
  /** 编辑确认事件 */
  bubbleEditConfirm: (_item: MessageItem, _content: string) => true
};

/**
 * 共享数据key
 */
export const CHAT_KEY = Symbol('chat') as InjectionKey<ChatProvide>;

/**
 * 文本提示默认属性
 */
export const defaultTooltipProps: EleTooltipPropsAndEmits = {
  offset: 6,
  hideAfter: 100,
  trigger: 'hover',
  placement: 'top',
  popperClass: 'ele-chat-tooltip',
  popperOptions: {
    strategy: 'fixed'
  }
};

/**
 * 下拉菜单默认属性
 */
export const defaultDropdownProps: EleDropdownPropsAndEmits = {
  trigger: 'click',
  placement: 'bottom-end',
  popperClass: 'ele-chat-dropdown',
  popperOptions: {
    strategy: 'fixed',
    modifiers: [{ name: 'offset', options: { offset: [8, 4] } }]
  }
};
