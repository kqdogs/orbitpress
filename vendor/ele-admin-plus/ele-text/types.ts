import type { UserComponent } from '../ele-app/types';

/**
 * 文本类型
 */
export type TextType =
  | 'default'
  | 'heading'
  | 'regular'
  | 'secondary'
  | 'placeholder'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | null;

/**
 * 文本大小
 */
export type TextSize =
  | 'default'
  | 'xxxl'
  | 'xxl'
  | 'xl'
  | 'lg'
  | 'md'
  | 'base'
  | 'sm'
  | 'xs'
  | null;

/**
 * 图标
 */
export type TextIcon = UserComponent;
