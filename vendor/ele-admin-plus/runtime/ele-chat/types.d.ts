import type {
  EleImageViewerProps,
  EleDropdownPropsAndEmits,
  EleTooltipPropsAndEmits
} from '../ele-app/plus';
import type { DropdownItem } from '../ele-dropdown/types';

/**
 * 对话
 */
export interface ConversationItem {
  /** key */
  key?: string | number;
  /** 标题 */
  label: string;
  /** 是否是分组 */
  group?: boolean;
  /** 子级数据 */
  children?: ConversationItem[];
}

/**
 * 附件
 */
export interface FileItem {
  /** key */
  key?: string | number;
  /** 文件名称 */
  name?: string;
  /** 文件描述 */
  description?: string;
  /** 上传状态 */
  status?: 'uploading' | 'done' | 'exception';
  /** 错误信息 */
  error?: string;
  /** 是否只读模式 */
  readonly?: boolean;
  /** 文件 */
  file?: File;
  /** 是否是目录 */
  isDirectory?: boolean;
  /** 图片预览地址 */
  imageUrl?: string;
  /** 上传后的地址 */
  url?: string;
}

/**
 * 消息
 */
export interface MessageItem {
  /** key */
  key?: string | number;
  /** 内容 */
  content?: string;
  /** 思考内容 */
  reasoning?: string | null;
  /** 用户名 */
  header?: string;
  /** 头像 */
  avatar?: string;
  /** 气泡位置 */
  placement?: 'start' | 'end';
  /** 消息状态 */
  status?:
    | 'loading'
    | 'thinking'
    | 'receiving'
    | 'finish'
    | 'thinkingStop'
    | 'receivingStop'
    | 'error';
  /** 内容编辑状态 */
  editStatus?: boolean;
  /** 附件 */
  files?: FileItem[];
}

/**
 * 附件图片查看器属性
 */
export type FileImageViewerProps =
  | boolean
  | EleImageViewerProps
  | ((
      item: FileItem,
      message?: MessageItem
    ) => boolean | EleImageViewerProps | undefined);

/**
 * 对话下拉菜单属性
 */
export type ConversationDropdownItems =
  | DropdownItem[]
  | ((item: ConversationItem) => DropdownItem[] | undefined);

/**
 * 共享数据
 */
export interface ChatProvide {
  openDropdown: (
    triggerEl: any,
    items?: DropdownItem[],
    props?: EleDropdownPropsAndEmits
  ) => void;
  removeDropdown: (triggerEl?: any) => void;
  showTooltip?: (triggerEl: any, props?: EleTooltipPropsAndEmits) => void;
  removeTooltip?: (triggerEl?: any) => void;
}

/**
 * 附件卡片插槽
 */
export interface FileCardSlots {
  // TODO 增加区分气泡和输入框调用的参数
  // TODO 增加标题和描述的自定义插槽
  /** 附件卡片图标自定义插槽 */
  fileIcon: (props: { item: FileItem }) => any;
}

/**
 * 气泡插槽
 */
export interface ChatBubbleSlots extends FileCardSlots {
  /** 气泡最上面插槽 */
  itemTop: (props: { item: MessageItem }) => any;
  /** 气泡最下面插槽 */
  itemBottom: (props: { item: MessageItem }) => any;
  /** 气泡头像图片自定义插槽 */
  itemAvatar: (props: { item: MessageItem }) => any;
  /** 气泡用户昵称自定义插槽 */
  itemHeader: (props: { item: MessageItem }) => any;
  /** 气泡内容思考区自定义插槽 */
  itemThink: (props: { item: MessageItem }) => any;
  /** 气泡内容文字自定义插槽 */
  itemContent: (props: { item: MessageItem }) => any;
  /** 气泡底部操作按钮插槽 */
  itemFooter: (props: { item: MessageItem }) => any;
  /** 气泡用户昵称上面插槽 */
  itemBodyTop: (props: { item: MessageItem }) => any;
  /** 气泡底部操作按钮下面插槽 */
  itemBodyBottom: (props: { item: MessageItem }) => any;
  /** 气泡右侧插槽 */
  itemExtra: (props: { item: MessageItem }) => any;
}

/**
 * 对话列表项插槽
 */
export interface ChatConversationSlots {
  /** 对话列表项内容自定义插槽 */
  conversationItem: (props: { item: ConversationItem }) => any;
}

/**
 * 输入框插槽
 */
export interface ChatInputSlots extends FileCardSlots {
  /** 输入框最上面插槽 */
  inputTop: () => any;
  /** 输入框最下面插槽 */
  inputBottom: () => any;
  /** 输入框底部左侧按钮区插槽 */
  inputLeftTools: () => any;
  /** 输入框底部右侧按钮区插槽 */
  inputRightTools: () => any;
}

/**
 * 聊天组件插槽
 */
export interface ChatSlots
  extends ChatInputSlots, ChatConversationSlots, ChatBubbleSlots {
  /** logo 自定义插槽 */
  logo: (props: { header?: boolean }) => any;
  /** 侧栏 logo 右侧操作按钮区域插槽 */
  logoTool: () => any;
  /** 侧栏 logo 下方插槽 */
  sideTop: () => any;
  /** 侧栏最下方插槽 */
  sideBottom: () => any;
  /** 侧栏新对话按钮上方插槽 */
  sideTool: () => any;
  /** 顶栏 logo 左侧插槽 */
  headerLeft: () => any;
  /** 顶栏最右侧插槽 */
  headerRight: () => any;
  /** 顶栏 logo 右侧操作按钮区插槽 */
  headerTool: () => any;
  /** 顶栏标题文字自定义插槽 */
  headerTitle: (props: { activeConversation?: ConversationItem }) => any;
  /** 内容区域消息列表上方插槽 */
  content: () => any;
  /** 内容区域回到底部按钮图标自定义插槽 */
  backbottomIcon: () => any;
  /** 底栏文字自定义插槽 */
  footer: () => any;
}

/**
 * 国际化
 */
export interface ChatLocale {
  newText: string;
  footerText: string;
  placeholder: string;
  sideFoldTip: string;
  sideExpandTip: string;
  uploadTip: string;
  uploadError: string;
  thinkingText: string;
  thoughtText: string;
  editCancel: string;
  editConfirm: string;
}
