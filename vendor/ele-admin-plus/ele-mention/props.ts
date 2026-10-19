import type { MentionProps as ElMentionProps } from 'element-plus';
import type { MentionOption, MentionOptionsFunction } from './types';
export { mentionEmits } from 'element-plus';

/**
 * 属性
 */
export interface MentionProps extends Omit<ElMentionProps, 'options'> {
  /** 数据 */
  options?: MentionOption[] | MentionOptionsFunction;
}
