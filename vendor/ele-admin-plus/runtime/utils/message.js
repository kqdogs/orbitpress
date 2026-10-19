import { getCurrentInstance, provide, inject, onActivated, onDeactivated, onBeforeUnmount, unref, isVNode, h, mergeProps } from "vue";
import { ElMessage } from "element-plus";
import { useGlobalProps } from "../ele-config-provider/receiver";
import { useLayoutState } from "../ele-pro-layout/util";
import MessageBody from "../ele-app/components/message-body";
import { omit, queryChild } from "./common";
function blurCurrentFocus() {
  if (typeof document?.body?.querySelector === "function") {
    const el = document.body.querySelector(":focus");
    typeof el?.blur === "function" && el.blur();
  }
}
function getWrapEl(bodyEl, force, groupKey) {
  const parent = bodyEl || document.body;
  const className = "ele-message-wrapper";
  const attr = "data-group";
  const attrSelector = groupKey == null ? void 0 : [attr, groupKey];
  const el = force ? void 0 : queryChild(parent, className, attrSelector);
  if (el != null) {
    return el;
  }
  const elem = document.createElement("div");
  elem.classList.add(className);
  if (groupKey) {
    elem.setAttribute(attr, groupKey);
  }
  parent.appendChild(elem);
  return elem;
}
function getDefaultGroupKey() {
  const url = location?.href;
  const pi = url.indexOf("?");
  return url.substring(0, pi < 0 ? void 0 : pi);
}
function getOffsetStyle(offset, userStyle) {
  const mt = typeof offset === "number" ? `${offset}px` : offset;
  return mergeProps({ style: { marginTop: mt } }, { style: userStyle }).style;
}
function isObjOpt(params) {
  return params != null && typeof params === "object" && !isVNode(params);
}
function normalizeOption(params, globalOpt, onClose, type, loading, getWrapEl2, groupKey, messageId, onMessageDestroy) {
  const opt = { ...globalOpt || {} };
  if (isObjOpt(params)) {
    Object.assign(opt, params);
  } else {
    opt.message = params;
  }
  opt.type = type ?? opt.type;
  opt.appendTo = (opt.appendTo == null ? void 0 : unref(opt.appendTo)) ?? getWrapEl2?.(opt.inner);
  const classes = ["ele-message"];
  if (opt.original === "plain") {
    classes.push("is-plain-alert");
  } else if (opt.original) {
    classes.push("is-alert");
  } else if (opt.plain) {
    classes.push("is-plain");
  }
  if (loading) {
    classes.push("is-loading");
    opt.duration = opt.duration ?? 0;
    if (opt.mask) {
      classes.push("is-show-mask");
    }
    if (opt.centered) {
      classes.push("is-centered");
    }
  }
  if (opt.inner) {
    classes.push("is-inner");
  }
  if (opt.customClass) {
    classes.push(opt.customClass);
  }
  opt.customClass = classes.join(" ");
  if (opt.offset != null && opt.offset !== "") {
    opt.style = getOffsetStyle(opt.offset, opt.style);
  }
  const content = opt.message;
  const isFn = typeof content === "function";
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
  const key = (opt.inner ? groupKey : void 0) ?? "";
  opt.message = isStr ? `${key}_${opt.type || "info"}_${content ?? ""}` : void 0;
  opt.grouping = isStr ? opt.grouping : false;
  return omit(opt, [
    "showClose",
    "dangerouslyUseHTMLString",
    "offset",
    "original",
    "plain",
    "mask",
    "centered",
    "inner",
    "groupKey"
  ]);
}
const EleMessage = function(params, context) {
  const onClose = () => ins.close();
  const getWrap = () => getWrapEl();
  const opt = normalizeOption(params, null, onClose, null, null, getWrap);
  const ins = ElMessage(opt, context);
  return ins;
};
EleMessage.success = function(params, context) {
  const onClose = () => ins.close();
  const getWrap = () => getWrapEl();
  const opt = normalizeOption(params, null, onClose, "success", null, getWrap);
  const ins = ElMessage(opt, context);
  return ins;
};
EleMessage.warning = function(params, context) {
  const onClose = () => ins.close();
  const getWrap = () => getWrapEl();
  const opt = normalizeOption(params, null, onClose, "warning", null, getWrap);
  const ins = ElMessage(opt, context);
  return ins;
};
EleMessage.error = function(params, context) {
  const onClose = () => ins.close();
  const getWrap = () => getWrapEl();
  const opt = normalizeOption(params, null, onClose, "error", null, getWrap);
  const ins = ElMessage(opt, context);
  return ins;
};
EleMessage.info = function(params, context) {
  const onClose = () => ins.close();
  const getWrap = () => getWrapEl();
  const opt = normalizeOption(params, null, onClose, null, null, getWrap);
  const ins = ElMessage(opt, context);
  return ins;
};
EleMessage.loading = function(params, context) {
  blurCurrentFocus();
  const onClose = () => ins.close();
  const getWrap = () => getWrapEl();
  const opt = normalizeOption(params, null, onClose, null, true, getWrap);
  const ins = ElMessage(opt, context);
  return ins;
};
EleMessage.closeAll = function(type) {
  return ElMessage.closeAll(type);
};
const MESSAGE_KEY = /* @__PURE__ */ Symbol("message");
function useMessage(globalOpt) {
  const layoutState = useLayoutState();
  const globalProps = useGlobalProps("message");
  const appContext = getCurrentInstance?.()?.appContext;
  const groupKey = globalOpt?.groupKey || getDefaultGroupKey();
  const state = { wrapEl: null, isActivated: true, id: 0 };
  const instances = /* @__PURE__ */ new Map();
  const hideClass = "is-hide";
  provide(MESSAGE_KEY, { groupKey, getInnerWrap: () => getWrap(true) });
  const parentMsg = inject(MESSAGE_KEY, null);
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
  const getWrap = (inner) => {
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
  const getOpt = function(params, onClose, type, loading) {
    state.id++;
    const msgId = `m_${state.id}`;
    const opt = normalizeOption(
      params,
      { ...globalProps.value || {}, ...globalOpt || {} },
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
  const message = function(params) {
    const { opt, msgId } = getOpt(params, () => ins.close());
    const ins = ElMessage(opt, appContext);
    instances.set(msgId, ins);
    return ins;
  };
  message.success = function(params) {
    const { opt, msgId } = getOpt(params, () => ins.close(), "success", false);
    const ins = ElMessage(opt, appContext);
    instances.set(msgId, ins);
    return ins;
  };
  message.warning = function(params) {
    const { opt, msgId } = getOpt(params, () => ins.close(), "warning", false);
    const ins = ElMessage(opt, appContext);
    instances.set(msgId, ins);
    return ins;
  };
  message.error = function(params) {
    const { opt, msgId } = getOpt(params, () => ins.close(), "error", false);
    const ins = ElMessage(opt, appContext);
    instances.set(msgId, ins);
    return ins;
  };
  message.info = function(params) {
    const { opt, msgId } = getOpt(params, () => ins.close());
    const ins = ElMessage(opt, appContext);
    instances.set(msgId, ins);
    return ins;
  };
  message.loading = function(params) {
    blurCurrentFocus();
    const { opt, msgId } = getOpt(params, () => ins.close(), void 0, true);
    const ins = ElMessage(opt, appContext);
    instances.set(msgId, ins);
    return ins;
  };
  message.closeAll = function(type) {
    instances.clear();
    return ElMessage.closeAll(type);
  };
  return message;
}
export {
  EleMessage,
  MESSAGE_KEY,
  useMessage
};
