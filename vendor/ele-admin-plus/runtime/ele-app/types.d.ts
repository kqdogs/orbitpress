import type {
  CSSProperties,
  Component,
  SetupContext,
  VNode,
  EmitsOptions,
  ObjectEmitsOptions,
  Slot
} from 'vue';

/**
 * 只读属性改为可读
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: Mutable<T[P]>;
};

/**
 * 只读属性改为可读及非必须
 */
export type MutablePartial<T> = {
  -readonly [P in keyof T]?: T[P];
};

/**
 * 样式值
 */
export type StyleValue = Partial<CSSProperties>;

/**
 * 样式多个值
 */
export type StyleValues = StyleValue | Array<StyleValue>;

/**
 * 类名值
 */
export type ClassValue = string | Record<string, boolean | undefined>;

/**
 * 类名多个值
 */
export type ClassValues =
  | string
  | Record<string, boolean | undefined>
  | Array<string | Record<string, boolean | undefined> | Array<any>>;

/**
 * 组件属性
 */
export type ComponentProps<T> = MutablePartial<T> & {
  /** 类名 */
  class?: ClassValues;
  /** 样式 */
  style?: StyleValues;
  /** key */
  key?: keyof any;
};

/**
 * 组件名或组件
 */
export type UserComponent<P = any> = string | Component<P>;

/**
 * 组件插槽配置
 */
export type UserComponentSlots = Record<string, string | Slot>;

/**
 * 组件事件触发器
 */
export type Emitter<T> = SetupContext<T>['emit'];

/**
 * 渲染结果
 */
export type ResultNode = string | VNode | Array<string | VNode> | undefined;

/**
 * 插槽方法
 */
export type SlotFunction = (slotProps?: Record<string, any>) => ResultNode;

/**
 * 插槽对象
 */
export type SlotObject = Record<string, SlotFunction | undefined>;

/**
 * 组件事件对应的方法
 */
export type EmitMethods<T extends EmitsOptions> = T extends string[]
  ? {
      [K in T[number]]: (...args: any[]) => void;
    }
  : T extends ObjectEmitsOptions
    ? {
        [K in string & keyof T]: (
          ...args: T[K] extends (...args: infer P) => any
            ? P
            : T[K] extends null
              ? any[]
              : never
        ) => void;
      }
    : {};
