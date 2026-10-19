/** 消息提示 */
import {
  h,
  isVNode,
  getCurrentInstance,
  onActivated,
  onDeactivated,
  onBeforeUnmount,
  provide,
  inject,
  mergeProps,
  unref
} from 'vue';
import type { AppContext, InjectionKey } from 'vue';
import { ElMessage } from 'element-plus';
import type {
  MessageHandler as ElMessageHandler,
  MessageOptions as ElMessageOptions,
  MessageFn as ElMessageFn
} from 'element-plus/es/components/message';
import { useGlobalProps } from '../ele-config-provider/receiver';
import { useLayoutState } from '../ele-pro-layout/util';
import MessageBody from '../ele-app/components/message-body.vue';
import { omit, queryChild } from './common';

/**
 * 消息提示配置
 */
export interface MessageOptions extends ElMessageOptions {
  /** 是否为原始风格 */
  original?: boolean | 'plain';
  /** 是否显示遮罩层 */
  mask?: boolean;
  /** 是否居中显示 */
  centered?: boolean;
  /** 是否限制在主体内部 */
  inner?: boolean;
  /** 限制在主体内部的分组标识 */
  groupKey?: string;
}

/**
 * 消息提示方法参数
 */
export type MessageParams = MessageOptions | ElMessageOptions['message'];

/**
 * 消息提示方法
 */
export type MessageFn = (
  options?: MessageParams,
  context?: null | AppContext
) => ElMessageHandler;

/**
 * 消息提示
 */
export interface Message extends MessageFn {
  closeAll: ElMessageFn['closeAll'];
  success: MessageFn;
  warning: MessageFn;
  error: MessageFn;
  info: MessageFn;
  loading: MessageFn;
}

/**
 * 消息提示数据
 */
interface MessageState {
  wrapEl: HTMLElement | null;
  isActivated: boolean;
  id: number;
}

/**
 * 消息提示依赖注入
 */
interface MessageProvide {
  /** 限制在主体内部的分组标识 */
  groupKey: string;
  /** 获取限制在主体内部的容器 */
  getInnerWrap: () => HTMLElement;
}

/**
 * 消息提示依赖注入key
 */
type MessageKey = InjectionKey<MessageProvide>;

/**
 * 让当前焦点元素失去焦点
 */
function blurCurrentFocus() {
  if (typeof document?.body?.querySelector === 'function') {
    const el = document.body.querySelector(':focus') as HTMLElement;
    typeof el?.blur === 'function' && el.blur();
  }
}

/**
 * 获取容器
 * @param bodyEl 父容器
 * @param force 是否强制创建新容器
 * @param groupKey 限制在主体内部的分组标识
 */
function getWrapEl(
  bodyEl?: HTMLElement | null,
  force?: boolean,
  groupKey?: string
): HTMLElement {
  const parent = bodyEl || document.body;
  const className = 'ele-message-wrapper';
  const attr = 'data-group';
  const attrSelector = groupKey == null ? void 0 : [attr, groupKey];
  const el = force ? void 0 : queryChild(parent, className, attrSelector);
  if (el != null) {
    return el as HTMLElement;
  }
  const elem = document.createElement('div');
  elem.classList.add(className);
  if (groupKey) {
    elem.setAttribute(attr, groupKey);
  }
  parent.appendChild(elem);
  return elem;
}

/**
 * 获取默认的限制在主体内部的分组标识
 */
function getDefaultGroupKey() {
  const url = location?.href;
  const pi = url.indexOf('?');
  return url.substring(0, pi < 0 ? void 0 : pi);
}

/**
 * 获取顶部偏移量样式
 * @param offset 顶部偏移量
 * @param userStyle 自定义样式
 */
function getOffsetStyle(offset: number, userStyle: any) {
  const mt = typeof offset === 'number' ? `${offset}px` : offset;
  return mergeProps({ style: { marginTop: mt } }, { style: userStyle }).style;
}

/**
 * 判断是否是对象类型参数
 * @param params 参数
 */
function isObjOpt(params?: MessageParams | null) {
  return params != null && typeof params === 'object' && !isVNode(params);
}

/**
 * 处理参数
 * @param params 参数
 * @param globalOpt 全局参数
 * @param onClose 关闭按钮点击事件
 * @param type 类型
 * @param loading 是否是加载框
 * @param getWrapEl 获取消息容器
 * @param groupKey 限制在主体内部的分组标识
 * @param messageId 标识id
 * @param onMessageDestroy 消息提示销毁事件
 */
function normalizeOption(
  params?: MessageParams,
  globalOpt?: MessageOptions | null,
  onClose?: () => void,
  type?: ElMessageOptions['type'] | null,
  loading?: boolean | null,
  getWrapEl?: (inner?: boolean) => HTMLElement | undefined,
  groupKey?: string,
  messageId?: string,
  onMessageDestroy?: (messageId?: string) => void
): ElMessageOptions {
  const opt = { ...(globalOpt || {}) };
  if (isObjOpt(params)) {
    Object.assign(opt, params);
  } else {
    opt.message = params as ElMessageOptions['message'];
  }
  opt.type = type ?? opt.type;
  opt.appendTo =
    (opt.appendTo == null ? void 0 : unref(opt.appendTo)) ??
    getWrapEl?.(opt.inner);
  const classes: string[] = ['ele-message'];
  // 添加风格类名
  if (opt.original === 'plain') {
    classes.push('is-plain-alert');
  } else if (opt.original) {
    classes.push('is-alert');
  } else if (opt.plain) {
    classes.push('is-plain');
  }
  // 加载框
  if (loading) {
    classes.push('is-loading');
    opt.duration = opt.duration ?? 0;
    // 遮罩
    if (opt.mask) {
      classes.push('is-show-mask');
    }
    // 居中
    if (opt.centered) {
      classes.push('is-centered');
    }
  }
  // 限制在主体内部
  if (opt.inner) {
    classes.push('is-inner');
  }
  // 自定义类名
  if (opt.customClass) {
    classes.push(opt.customClass);
  }
  opt.customClass = classes.join(' ');
  // 顶部偏移量
  if (opt.offset != null && (opt.offset as any) !== '') {
    (opt as any).style = getOffsetStyle(opt.offset, (opt as any).style);
  }
  // 内容处理
  const content = opt.message;
  const isFn = typeof content === 'function';
  const isStr = !(isFn || isVNode(content));
  opt.icon = h(
    MessageBody,
    {
      message: isStr && content != null ? String(content) : void 0,
      type: opt.type,
      icon: opt.icon,
      showClose: opt.showClose,
      dangerouslyUseHTMLString: opt.dangerouslyUseHTMLString,
      loading,
      messageId,
      onClose,
      onMessageDestroy
    },
    { default: isFn ? content : isStr ? void 0 : () => content }
  );
  const key = (opt.inner ? groupKey : void 0) ?? '';
  opt.message = isStr
    ? `${key}_${opt.type || 'info'}_${content ?? ''}`
    : void 0;
  opt.grouping = isStr ? opt.grouping : false;
  return omit(opt, [
    'showClose',
    'dangerouslyUseHTMLString',
    'offset',
    'original',
    'plain',
    'mask',
    'centered',
    'inner',
    'groupKey'
  ]);
}

/**
 * 提供各种调用方法
 * @param options 参数
 * @param context 上下文
 */
const EleMessage: Message = function (params, context) {
  const onClose = () => ins.close();
  const getWrap = () => getWrapEl();
  const opt = normalizeOption(params, null, onClose, null, null, getWrap);
  const ins = ElMessage(opt, context);
  return ins;
};

EleMessage.success = function (params, context) {
  const onClose = () => ins.close();
  const getWrap = () => getWrapEl();
  const opt = normalizeOption(params, null, onClose, 'success', null, getWrap);
  const ins = ElMessage(opt, context);
  return ins;
};

EleMessage.warning = function (params, context) {
  const onClose = () => ins.close();
  const getWrap = () => getWrapEl();
  const opt = normalizeOption(params, null, onClose, 'warning', null, getWrap);
  const ins = ElMessage(opt, context);
  return ins;
};

EleMessage.error = function (params, context) {
  const onClose = () => ins.close();
  const getWrap = () => getWrapEl();
  const opt = normalizeOption(params, null, onClose, 'error', null, getWrap);
  const ins = ElMessage(opt, context);
  return ins;
};

EleMessage.info = function (params, context) {
  const onClose = () => ins.close();
  const getWrap = () => getWrapEl();
  const opt = normalizeOption(params, null, onClose, null, null, getWrap);
  const ins = ElMessage(opt, context);
  return ins;
};

EleMessage.loading = function (params, context) {
  blurCurrentFocus();
  const onClose = () => ins.close();
  const getWrap = () => getWrapEl();
  const opt = normalizeOption(params, null, onClose, null, true, getWrap);
  const ins = ElMessage(opt, context);
  return ins;
};

EleMessage.closeAll = function (type) {
  return ElMessage.closeAll(type);
};

export { EleMessage };

/**
 * 消息提示依赖注入key
 */
export const MESSAGE_KEY = Symbol('message') as MessageKey;

/**
 * 带当前上下文的消息提示
 * @param globalOpt 参数
 */
export function useMessage(globalOpt?: MessageOptions) {
  const layoutState = useLayoutState();
  const globalProps = useGlobalProps('message');
  const appContext = getCurrentInstance?.()?.appContext;
  const groupKey = globalOpt?.groupKey || getDefaultGroupKey();
  const state: MessageState = { wrapEl: null, isActivated: true, id: 0 };
  const instances: Map<string, ElMessageHandler> = new Map();
  const hideClass = 'is-hide';

  /** 为子组件注入参数 */
  provide(MESSAGE_KEY, { groupKey, getInnerWrap: () => getWrap(true) });

  /** 接收父组件注入 */
  const parentMsg = inject(MESSAGE_KEY, null);

  /** 适配组件缓存 */
  onActivated(() => {
    state.isActivated = true;
    state.wrapEl && state.wrapEl.classList.remove(hideClass);
  });

  onDeactivated(() => {
    state.isActivated = false;
    state.wrapEl && state.wrapEl.classList.add(hideClass);
  });

  onBeforeUnmount(() => {
    for (const [_key, ins] of instances) {
      ins && ins.close && ins.close();
    }
    instances.clear();
  });

  /** 获取容器 */
  const getWrap = (inner?: boolean): HTMLElement => {
    if (inner) {
      if (parentMsg != null && parentMsg.groupKey === groupKey) {
        return parentMsg.getInnerWrap();
      }
      if (state.wrapEl == null && layoutState.modalsEl != null) {
        state.wrapEl = getWrapEl(layoutState.modalsEl, false, groupKey);
        if (!state.isActivated) {
          state.wrapEl.classList.add(hideClass);
        }
      }
      if (state.wrapEl != null) {
        return state.wrapEl;
      }
    }
    return getWrapEl();
  };

  /** 处理参数 */
  const getOpt = function (
    params: MessageParams,
    onClose?: () => void,
    type?: ElMessageOptions['type'],
    loading?: boolean
  ) {
    state.id++;
    const msgId = `m_${state.id}`;
    const opt = normalizeOption(
      params,
      { ...(globalProps.value || {}), ...(globalOpt || {}) },
      onClose,
      type,
      loading,
      getWrap,
      groupKey,
      msgId,
      (messageId) => {
        messageId && instances.delete(messageId);
      }
    );
    return { opt, msgId };
  };

  /** 消息提示各种方法 */
  const message: Message = function (params) {
    const { opt, msgId } = getOpt(params, () => ins.close());
    const ins = ElMessage(opt, appContext);
    instances.set(msgId, ins);
    return ins;
  };

  message.success = function (params) {
    const { opt, msgId } = getOpt(params, () => ins.close(), 'success', false);
    const ins = ElMessage(opt, appContext);
    instances.set(msgId, ins);
    return ins;
  };

  message.warning = function (params) {
    const { opt, msgId } = getOpt(params, () => ins.close(), 'warning', false);
    const ins = ElMessage(opt, appContext);
    instances.set(msgId, ins);
    return ins;
  };

  message.error = function (params) {
    const { opt, msgId } = getOpt(params, () => ins.close(), 'error', false);
    const ins = ElMessage(opt, appContext);
    instances.set(msgId, ins);
    return ins;
  };

  message.info = function (params) {
    const { opt, msgId } = getOpt(params, () => ins.close());
    const ins = ElMessage(opt, appContext);
    instances.set(msgId, ins);
    return ins;
  };

  message.loading = function (params) {
    blurCurrentFocus();
    const { opt, msgId } = getOpt(params, () => ins.close(), void 0, true);
    const ins = ElMessage(opt, appContext);
    instances.set(msgId, ins);
    return ins;
  };

  message.closeAll = function (type) {
    instances.clear();
    return ElMessage.closeAll(type);
  };

  return message;
}
