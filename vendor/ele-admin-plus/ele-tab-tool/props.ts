import type { ExtractPropTypes } from 'vue';

/**
 * 属性
 */
export const tabToolProps = {
  /** 是否为模拟页签 */
  tab: Boolean,
  /** 为模拟页签时是否选中 */
  active: Boolean,
  /** 为模拟页签时页签标识 */
  tabName: [String, Number]
};

export type TabToolProps = ExtractPropTypes<typeof tabToolProps>;
