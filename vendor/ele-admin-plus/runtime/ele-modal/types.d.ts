/**
 * 拉伸类型
 */
export type Resizable = boolean | 'horizontal' | 'vertical';

/**
 * 拖出边界字符类型
 */
export type MoveOutValue = 'top' | 'left' | 'right' | 'bottom';

/**
 * 拖出边界类型
 */
export type MoveOut = boolean | MoveOutValue[];

/**
 * 初始位置对象类型
 */
export interface PositionObject {
  top?: string | number;
  left?: string | number;
  bottom?: string | number;
  right?: string | number;
}

/**
 * 初始位置字符类型
 */
export type PositionValue =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom'
  | 'center';

/**
 * 初始位置类型
 */
export type Position = PositionValue | PositionObject;
