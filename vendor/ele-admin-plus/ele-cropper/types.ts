import type { Component } from 'vue';

/**
 * 操作按钮名称
 */
export type ToolName =
  | 'zoomIn'
  | 'zoomOut'
  | 'moveLeft'
  | 'moveRight'
  | 'moveUp'
  | 'moveDown'
  | 'rotateLeft'
  | 'rotateRight'
  | 'flipX'
  | 'flipY'
  | 'reset'
  | 'upload'
  | 'ok';

/**
 * 操作按钮
 */
export interface ToolItem {
  /** 标识 */
  key: string;
  /** 名称 */
  name: ToolName;
  /** 图标 */
  icon?: Component;
  /** 类名 */
  className?: string;
}

/**
 * 操作按钮组
 */
export interface ToolGroup {
  /** 标识 */
  key: string;
  /** 操作按钮 */
  items: ToolItem[];
}

/**
 * 上传事件参数
 */
export interface UploadOption {
  /** 文件数据 */
  data?: string | null;
  /** 文件类型 */
  type: string;
}

/**
 * 上传按钮点击自定义处理的回调
 */
export type BeforeUploadOnResult = (
  data: string | ArrayBuffer,
  type?: string
) => void;

/**
 * 上传按钮点击前的钩子
 */
export type BeforeUploadClick = (
  e: MouseEvent,
  onResult: BeforeUploadOnResult
) => boolean | undefined | void;

/**
 * 国际化
 */
export interface CropperLocale {
  zoomIn: string;
  zoomOut: string;
  rotateLeft: string;
  rotateRight: string;
  moveLeft: string;
  moveRight: string;
  moveUp: string;
  moveDown: string;
  flipX: string;
  flipY: string;
  reset: string;
  upload: string;
  ok: string;
  title: string;
}
