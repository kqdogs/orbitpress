import { ElNotification } from "element-plus";
import { useModal as useModal$1 } from "../ele-modal-render/use-modal";
import { useMessage } from "./message";
import { useMessageBox } from "./message-box";
import { useImageViewer } from "../ele-image-viewer-provider/util";
function useModal(options) {
  const modal = useModal$1();
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
export {
  useModal
};
