import type { PropType, ExtractPropTypes } from 'vue';

/**
 * 属性
 */
export const backtopProps = {
  /** 触发滚动的对象 */
  target: [String, Object] as PropType<string | HTMLElement | null>,
  /** 滚动高度达到此参数值才出现 */
  visibilityHeight: {
    type: Number,
    default: 200
  },
  /** 距离页面底部距离 */
  bottom: {
    type: [Number, String],
    default: 60
  },
  /** 距离页面右边距 */
  right: {
    type: [Number, String],
    default: 30
  },
  /** 过渡动画名称 */
  transitionName: {
    type: String,
    default: 'ele-backtop-fade'
  }
};

export type BacktopProps = ExtractPropTypes<typeof backtopProps>;

/**
 * 事件
 */
export const backtopEmits = {
  click: (_e: MouseEvent) => true
};
