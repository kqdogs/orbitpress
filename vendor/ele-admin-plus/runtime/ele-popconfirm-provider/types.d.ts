import type { Ref } from 'vue';
import type {
  ElePopconfirmPropsAndEmits,
  ElePopconfirmInstance
} from '../ele-app/plus';

/**
 * 提供气泡确认框操作给子组件
 */
export interface PopconfirmProvider {
  /**
   * 打开气泡确认框
   * @param triggerEl 触发元素
   * @param props 气泡确认框属性
   */
  openPopconfirm: (triggerEl: any, props?: ElePopconfirmPropsAndEmits) => void;
  /**
   * 移除气泡确认框
   * @param triggerEl 触发元素
   */
  removePopconfirm: (triggerEl?: any) => void;
  /**
   * 气泡确认框组件实例
   */
  popconfirmRef: Ref<ElePopconfirmInstance>;
}
