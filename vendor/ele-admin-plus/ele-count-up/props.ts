import type { PropType, ExtractPropTypes } from 'vue';
import type { CountUpOptions, CountUp } from 'countup.js';

/**
 * 属性
 */
export const countUpProps = {
  /** 首次动画延迟时间 */
  delay: {
    type: Number,
    default: 300
  },
  /** 结束值 */
  endVal: {
    type: Number,
    required: true
  },
  /** 参数配置 */
  options: Object as PropType<CountUpOptions>
};

export type CountUpProps = ExtractPropTypes<typeof countUpProps>;

/**
 * 事件
 */
export const countUpEmits = {
  /** 渲染完成事件 */
  ready: (_instance?: CountUp | null) => true
};
