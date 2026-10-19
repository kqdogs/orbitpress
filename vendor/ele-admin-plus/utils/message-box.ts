/** 消息弹窗 */
import type { AppContext } from 'vue';
import {
  h,
  getCurrentInstance,
  onActivated,
  onDeactivated,
  onBeforeUnmount,
  unref
} from 'vue';
import { ElMessageBox } from 'element-plus';
import type {
  ElMessageBoxOptions,
  MessageBoxData as ElMessageBoxData
} from 'element-plus';
import { useGlobalProps } from '../ele-config-provider/receiver';
import { useLayoutState } from '../ele-pro-layout/util';
import MessageBoxIcon from '../ele-app/components/message-box-icon.vue';
import { omit } from './common';

/**
 * 消息弹窗配置
 */
export interface MessageBoxOptions extends ElMessageBoxOptions {
  /** 是否限制在主体内部 */
  inner?: boolean;
}

/**
 * 消息弹窗方法
 */
export type MessageBoxMethod = (
  message: ElMessageBoxOptions['message'],
  title: ElMessageBoxOptions['title'],
  options?: MessageBoxOptions,
  context?: AppContext | null
) => Promise<ElMessageBoxData>;

/**
 * 消息弹窗
 */
export interface MessageBox {
  (
    options?: MessageBoxOptions,
    context?: AppContext | null
  ): Promise<ElMessageBoxData>;
  alert: MessageBoxMethod;
  confirm: MessageBoxMethod;
  prompt: MessageBoxMethod;
  close: () => void;
}

/**
 * 消息弹窗数据
 */
interface MessageBoxState {
  wrapEl: HTMLElement | null;
  isActivated: boolean;
  id: number;
}

/**
 * 获取容器
 * @param bodyEl 父容器
 */
function getWrapEl(bodyEl?: HTMLElement | null): HTMLElement {
  const parent = bodyEl || document.body;
  const className = 'ele-message-box-wrapper';
  const elem = document.createElement('div');
  elem.classList.add(className);
  parent.appendChild(elem);
  return elem;
}

export function useMessageBox(globalOpt?: MessageBoxOptions) {
  const layoutState = useLayoutState();
  const globalProps = useGlobalProps('messageBox');
  const appContext = getCurrentInstance?.()?.appContext;
  const state: MessageBoxState = { wrapEl: null, isActivated: true, id: 0 };
  const instances: Map<string, any> = new Map();
  const hideClass = 'is-hide';

  onActivated(() => {
    state.isActivated = true;
    state.wrapEl && state.wrapEl.classList.remove(hideClass);
  });

  onDeactivated(() => {
    state.isActivated = false;
    state.wrapEl && state.wrapEl.classList.add(hideClass);
  });

  onBeforeUnmount(() => {
    for (const [_key, insDoClose] of instances) {
      insDoClose && insDoClose();
    }
    instances.clear();
  });

  const getOption = (options?: MessageBoxOptions): ElMessageBoxOptions => {
    state.id++;
    const msgId = `m_${state.id}`;
    const opt = {
      ...(globalProps.value || {}),
      ...(globalOpt || {}),
      ...(options || {})
    };
    if (opt.inner) {
      if (opt.appendTo == null && layoutState.modalsEl != null) {
        if (state.wrapEl == null) {
          state.wrapEl = getWrapEl(layoutState.modalsEl);
        }
        opt.appendTo = state.wrapEl;
      } else if (opt.appendTo != null) {
        opt.appendTo = unref(opt.appendTo);
      }
      opt.lockScroll = false;
    } else if (opt.appendTo != null) {
      opt.appendTo = unref(opt.appendTo);
    }
    const classes: string[] = ['ele-message-box'];
    if (opt.customClass) {
      classes.push(opt.customClass);
    }
    opt.customClass = classes.join(' ');
    opt.icon = h(MessageBoxIcon, {
      type: opt.type,
      icon: opt.icon,
      boxId: msgId,
      onBoxDestroy: (boxId) => {
        boxId && instances.delete(boxId);
      },
      onBoxMounted: ({ boxId, doClose }) => {
        boxId && instances.set(boxId, doClose);
      }
    });
    return omit(opt, ['inner']);
  };

  const messageBox: MessageBox = function (options) {
    return ElMessageBox(getOption(options), appContext);
  };

  messageBox.alert = function (message, title, options, context) {
    const ctx = context ?? appContext;
    return ElMessageBox.alert(message, title, getOption(options), ctx);
  };

  messageBox.confirm = function (message, title, options, context) {
    const ctx = context ?? appContext;
    return ElMessageBox.confirm(message, title, getOption(options), ctx);
  };

  messageBox.prompt = function (message, title, options, context) {
    const ctx = context ?? appContext;
    return ElMessageBox.prompt(message, title, getOption(options), ctx);
  };

  messageBox.close = function () {
    return ElMessageBox.close();
  };

  return messageBox;
}
