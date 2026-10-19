/**
 * 数据类型
 */
export interface UploadItem extends Record<keyof any, any> {
  /** 唯一标识 */
  key: PropertyKey;
  /** 显示的图片地址, 为空时显示文件图标 */
  url?: string;
  /** 文件名称 */
  name?: string;
  /** 上传状态 */
  status?: UploadStatus;
  /** 上传进度, 0 ~ 100 */
  progress?: number;
  /** 选择的文件 */
  file?: File;
  /** 是否只读 */
  readonly?: boolean;
  /** 是否显示缩略图 */
  thumbnail?: boolean | string;
}

/**
 * 上传状态
 */
export type UploadStatus = 'uploading' | 'done' | 'exception' | null;

/**
 * 列表样式
 */
export type ListType = 'image' | 'file' | null;

/**
 * 上传按钮点击前的钩子
 */
export type BeforeUploadClick = (e: MouseEvent) => boolean | undefined | void;

/**
 * 修改按钮点击前的钩子
 */
export type BeforeItemEdit = (item: UploadItem) => boolean | undefined | void;

/**
 * 预览前的钩子
 */
export type BeforePreview = (item: UploadItem) => boolean | undefined | void;

/**
 * 图片文件预读地址
 */
export interface ImageObjectUrl {
  /** 文件 */
  file: File;
  /** 预览地址 */
  url: string;
}

/**
 * 修改事件参数
 */
export interface EditUploadResult {
  /** 修改的数据项 */
  item: UploadItem;
  /** 新的数据项 */
  newItem: UploadItem;
}

/**
 * 国际化
 */
export interface UploadLocale {
  uploading: string;
  exception: string;
  retry: string;
  remove: string;
  preview: string;
  edit: string;
}
