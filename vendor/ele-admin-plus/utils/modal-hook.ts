import { ElNotification } from 'element-plus';
import { useModal as useModalBase } from '../ele-modal-render/use-modal';
import type { ModalItemType } from '../ele-modal-render/types';
import { useMessage } from './message';
import type { MessageOptions } from './message';
import { useMessageBox } from './message-box';
import type { MessageBoxOptions } from './message-box';
import { useImageViewer } from '../ele-image-viewer-provider/util';

export interface UseModalOptions {
  message: MessageOptions;
  messageBox?: MessageBoxOptions;
}

/**
 * 弹窗, 抽屉, 图片预览, 消息, 弹出框, 消息通知等组件操作
 */
export function useModal<T extends ModalItemType>(options?: UseModalOptions) {
  const modal = useModalBase<T>();
  const message = useMessage(options?.message);
  const messageBox = useMessageBox(options?.messageBox);
  const imageViewer = useImageViewer();

  return {
    ...modal,
    imageViewer,
    message,
    messageBox,
    notification: ElNotification
  };
}
