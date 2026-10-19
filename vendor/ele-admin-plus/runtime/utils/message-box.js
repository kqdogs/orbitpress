import { getCurrentInstance, onActivated, onDeactivated, onBeforeUnmount, unref, h } from "vue";
import { ElMessageBox } from "element-plus";
import { useGlobalProps } from "../ele-config-provider/receiver";
import { useLayoutState } from "../ele-pro-layout/util";
import MessageBoxIcon from "../ele-app/components/message-box-icon";
import { omit } from "./common";
function getWrapEl(bodyEl) {
  const parent = bodyEl || document.body;
  const className = "ele-message-box-wrapper";
  const elem = document.createElement("div");
  elem.classList.add(className);
  parent.appendChild(elem);
  return elem;
}
function useMessageBox(globalOpt) {
  const layoutState = useLayoutState();
  const globalProps = useGlobalProps("messageBox");
  const appContext = getCurrentInstance?.()?.appContext;
  const state = { wrapEl: null, isActivated: true, id: 0 };
  const instances = /* @__PURE__ */ new Map();
  const hideClass = "is-hide";
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
  const getOption = (options) => {
    state.id++;
    const msgId = `m_${state.id}`;
    const opt = {
      ...globalProps.value || {},
      ...globalOpt || {},
      ...options || {}
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
    const classes = ["ele-message-box"];
    if (opt.customClass) {
      classes.push(opt.customClass);
    }
    opt.customClass = classes.join(" ");
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
    return omit(opt, ["inner"]);
  };
  const messageBox = function(options) {
    return ElMessageBox(getOption(options), appContext);
  };
  messageBox.alert = function(message, title, options, context) {
    const ctx = context ?? appContext;
    return ElMessageBox.alert(message, title, getOption(options), ctx);
  };
  messageBox.confirm = function(message, title, options, context) {
    const ctx = context ?? appContext;
    return ElMessageBox.confirm(message, title, getOption(options), ctx);
  };
  messageBox.prompt = function(message, title, options, context) {
    const ctx = context ?? appContext;
    return ElMessageBox.prompt(message, title, getOption(options), ctx);
  };
  messageBox.close = function() {
    return ElMessageBox.close();
  };
  return messageBox;
}
export {
  useMessageBox
};
