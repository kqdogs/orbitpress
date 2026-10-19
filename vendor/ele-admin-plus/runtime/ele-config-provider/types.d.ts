import type { ComputedRef } from 'vue';
import type {
  EleProTableProps,
  EleMessageOptions,
  EleMessageBoxOptions
} from '../ele-app/plus';
import type { ChatLocale } from '../ele-chat/types';
import type { ButtonsLocale } from '../ele-buttons/types';
import type { CopyableLocale } from '../ele-copyable/types';
import type { CronBuilderLocale } from '../ele-cron-builder/types';
import type { CronPanelLocale } from '../ele-cron-panel/types';
import type { CropperLocale } from '../ele-cropper/types';
import type { CrudLocale } from '../ele-crud/types';
import type { FileListLocale } from '../ele-file-list/types';
import type { IconSelectLocale } from '../ele-icon-select/types';
import type { MapPluginConstructor, MapLocale } from '../ele-map-picker/types';
import type { ProFormLocale } from '../ele-pro-form/types';
import type { TableLocale } from '../ele-pro-table/types';
import type { TourLocale } from '../ele-tour/types';
import type { UploadLocale } from '../ele-upload-list/types';

/**
 * 国际化
 */
export interface EleLocale {
  /** 操作按钮 */
  buttons: ButtonsLocale;
  /** 聊天 */
  chat: ChatLocale;
  /** 文本复制 */
  copyable: CopyableLocale;
  /** cron 生成器 */
  cronBuilder: CronBuilderLocale;
  /** cron */
  cronPanel: CronPanelLocale;
  /** 图片裁剪 */
  cropper: CropperLocale;
  /** 增删改查 */
  crud: CrudLocale;
  /** 文件列表 */
  fileList: FileListLocale;
  /** 图标选择 */
  iconSelect: IconSelectLocale;
  /** 地图选择 */
  map: MapLocale;
  /** 高级表单 */
  proForm: ProFormLocale;
  /** 高级表格 */
  table: TableLocale;
  /** 漫游式引导 */
  tour: TourLocale;
  /** 文件上传 */
  upload: UploadLocale;
}

/**
 * 表格全局配置
 */
export type TableGlobalConfig = Pick<
  EleProTableProps,
  | 'stripe'
  | 'border'
  | 'request'
  | 'response'
  | 'parseData'
  | 'size'
  | 'tools'
  | 'maximizedIndex'
  | 'pagination'
  | 'emptyProps'
  | 'toolbar'
  | 'exportConfig'
  | 'printConfig'
>;

/**
 * 消息提示全局配置
 */
export type MessageGlobalConfig = Pick<
  EleMessageOptions,
  | 'plain'
  | 'duration'
  | 'showClose'
  | 'offset'
  | 'appendTo'
  | 'grouping'
  | 'original'
  | 'mask'
  | 'centered'
  | 'inner'
>;

/**
 * 全局配置
 */
export interface GlobalProvide {
  key?: string;
  locale?: EleLocale;
  table?: TableGlobalConfig;
  message?: MessageGlobalConfig;
  messageBox?: EleMessageBoxOptions;
  mapPlugin?: MapPluginConstructor;
  mapKey?: string;
}

/**
 * 获取国际化方法返回结果
 */
export interface UseLocaleResult<T> {
  /** 语言 */
  lang: ComputedRef<T>;
  /** 全局配置 */
  globalConfig: GlobalProvide;
}

/**
 * 带国际化的组件属性
 */
export interface LocaleProps<T> extends Record<keyof any, any> {
  locale?: Partial<T>;
}
