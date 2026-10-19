const countUpProps = {
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
  options: Object
};
const countUpEmits = {
  /** 渲染完成事件 */
  ready: (_instance) => true
};
export {
  countUpEmits,
  countUpProps
};
