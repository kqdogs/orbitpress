import type { CropperProps } from '../ele-cropper/props';
import type EleCrud from '../ele-crud/index';
import type { CrudProps } from '../ele-crud/props';
import type EleCrudBuilder from '../ele-crud-builder/index';
import type MapView from '../ele-map-picker/components/map-view';
import type EleProForm from '../ele-pro-form/index';
import type { ProFormProps } from '../ele-pro-form/props';
import type EleProFormBuilder from '../ele-pro-form-builder/index';
import type { ProFormBuilderProps } from '../ele-pro-form-builder/props';
import type { ComponentProps } from './types';

/**
 * EleCropper
 */
export type EleCropperProps = ComponentProps<CropperProps>;

/**
 * EleCrud
 */
export type EleCrudInstance = InstanceType<typeof EleCrud> | null;

export type EleCrudProps = ComponentProps<CrudProps>;

/**
 * EleCrudBuilder
 */
export type EleCrudBuilderInstance = InstanceType<typeof EleCrudBuilder> | null;

/**
 * EleMapPicker
 */
export type EleMapPickerViewInstance = InstanceType<typeof MapView> | null;

/**
 * EleProForm
 */
export type EleProFormInstance = InstanceType<typeof EleProForm> | null;

export type EleProFormProps = ComponentProps<ProFormProps>;

/**
 * EleProFormBuilder
 */
export type EleProFormBuilderInstance = InstanceType<
  typeof EleProFormBuilder
> | null;

export type EleProFormBuilderProps = ComponentProps<ProFormBuilderProps>;
