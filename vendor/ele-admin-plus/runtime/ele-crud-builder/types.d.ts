import type { UserComponent } from '../ele-app/types';
import type { EleCrudProps } from '../ele-app/plusx';

/**
 * 模板库模板
 */
export interface TemplateItem {
  /** 模板名称 */
  name: string;
  /** 模板缩略图 */
  cover?: UserComponent;
  /** 模板数据 */
  config: EleCrudProps;
}

/**
 * 顶栏右侧操作按钮名称
 */
export type HeaderRightToolName = 'import' | 'export' | 'clear' | 'code';

/**
 * 字段编辑抽屉配置
 */
export interface FieldEditOption {
  /** 是否显示编辑抽屉 */
  visible?: boolean;
  /** 是否是编辑字段 */
  isEdit?: boolean;
  /** 添加字段时的父级 */
  parentKey?: string;
  /** 添加字段时插入的位置 */
  index?: number;
}

/**
 * 页面配置表单项数据分组
 */
export interface PageConfigGroup {
  /** 唯一值 */
  key: string;
  /** 标题 */
  label: string;
}

/**
 * 表单设计类型
 */
export type FormDesignType = 'search' | 'add' | 'edit';

/**
 * 表单设计弹窗配置
 */
export interface FormDesignOption {
  /** 是否显示弹窗 */
  visible?: boolean;
  /** 弹窗标题 */
  title?: string;
  /** 表单设计类型 */
  type?: FormDesignType;
}
