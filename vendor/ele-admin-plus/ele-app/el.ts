import type { ExtractPropTypes } from 'vue';
import type {
  // ElAlert
  AlertProps,
  // ElAutocomplete
  AutocompleteInstance,
  // ElAvatar
  AvatarProps,
  // ElBadge
  BadgeProps,
  // ElBreadcrumb
  ElBreadcrumb,
  BreadcrumbProps,
  BreadcrumbItemProps,
  // ElButton
  ButtonProps,
  // ElCard
  CardProps,
  // ElCascader
  ElCascader,
  CascaderProps,
  // ElCheckbox
  ElCheckboxGroup,
  // ElDialog
  ElDialog,
  DialogProps,
  // ElDrawer
  ElDrawer,
  // ElDropdown
  ElDropdown,
  dropdownProps,
  dropdownItemProps,
  // ElDivider
  DividerProps,
  // ElEmpty
  EmptyProps,
  // ElForm
  ElForm,
  ElFormItem,
  FormItemProps,
  FormItemRule,
  FormInstance,
  FormItemProp,
  // ElIcon
  ElIcon,
  IconProps,
  // ElImage
  ElImage,
  ImageProps,
  ElImageViewer,
  // ElInput
  ElInput,
  InputProps,
  // ElLink
  LinkProps,
  // ElMenu
  ElMenu,
  MenuProps,
  ElSubMenu,
  SubMenuProps,
  MenuItemProps,
  MenuItemGroupProps,
  // ElMessage
  MessageOptions,
  // ElMessageBox
  ElMessageBoxOptions as MessageBoxOptions,
  // ElMention
  MentionInstance,
  // ElPopper
  ElPopper,
  ElPopover,
  PopoverProps,
  ElTooltip,
  UseTooltipProps as TooltipProps,
  TooltipContentInstance,
  PopconfirmProps,
  // ElProgress
  ProgressProps,
  // ElPagination
  ElPagination,
  // ElRow
  RowProps,
  ColProps,
  // ElRadio
  ElRadioGroup,
  // ElScrollbar
  ElScrollbar,
  // ElSelect
  ElSelect,
  // ElStep
  ElStep,
  StepProps,
  // ElTable
  ElTable,
  TableProps,
  TableColumnCtx,
  ElTableV2,
  TableV2Props,
  // ElTabs
  ElTabs,
  TabsProps,
  TabPaneProps,
  // ElTag
  ElTag,
  TagProps,
  // ElTransfer
  TransferInstance,
  // ElTreeSelect
  ElTreeSelect,
  // ElTree
  ElTree,
  // ElTreeV2
  ElTreeV2,
  // ElUpload
  UploadProps
} from 'element-plus';
import type { TreeComponentProps } from 'element-plus/es/components/tree/src/tree.type';
import type { TreeProps } from 'element-plus/es/components/tree-v2/src/types';
import type { ComponentProps } from './types';

/**
 * ElAlert
 */
export type ElAlertProps = ComponentProps<AlertProps>;

/**
 * ElAutocomplete
 */
export type ElAutocompleteInstance = AutocompleteInstance | null;

/**
 * ElAvatar
 */
export type ElAvatarProps = ComponentProps<AvatarProps>;

/**
 * ElBadge
 */
export type ElBadgeProps = ComponentProps<BadgeProps>;

/**
 * ElBreadcrumb
 */
export type ElBreadcrumbInstance = InstanceType<typeof ElBreadcrumb> | null;

export type ElBreadcrumbProps = ComponentProps<BreadcrumbProps>;

export type ElBreadcrumbItemProps = ComponentProps<BreadcrumbItemProps>;

/**
 * ElButton
 */
export type ElButtonProps = ComponentProps<ButtonProps>;

/**
 * ElCard
 */
export type ElCardProps = ComponentProps<CardProps>;

/**
 * ElCascader
 */
export type ElCascaderInstance = InstanceType<typeof ElCascader> | null;

export type ElCascaderProps = ComponentProps<CascaderProps>;

/**
 * ElCheckbox
 */
export type ElCheckboxGroupInstance = InstanceType<
  typeof ElCheckboxGroup
> | null;

/**
 * ElDialog
 */
export type ElDialogInstance = InstanceType<typeof ElDialog> | null;

export type ElDialogProps = ComponentProps<DialogProps>;

/**
 * ElDrawer
 */
export type ElDrawerInstance = InstanceType<typeof ElDrawer> | null;

/**
 * ElDropdown
 */
export type ElDropdownInstance = InstanceType<typeof ElDropdown> | null;

export type ElDropdownProps = ComponentProps<
  ExtractPropTypes<typeof dropdownProps>
>;

export type ElDropdownItemProps = ComponentProps<
  ExtractPropTypes<typeof dropdownItemProps>
>;

/**
 * ElDivider
 */
export type ElDividerProps = ComponentProps<DividerProps>;

/**
 * ElEmpty
 */
export type ElEmptyProps = ComponentProps<EmptyProps>;

/**
 * ElForm
 */
export type ElFormInstance = InstanceType<typeof ElForm> | null;

export type ElFormItemInstance = InstanceType<typeof ElFormItem> | null;

export type ElFormItemProps = ComponentProps<FormItemProps>;

export type ElFormItemRule = Partial<FormItemRule>;

export type ElFormInstanceMethods = Pick<
  FormInstance,
  | 'validate'
  | 'validateField'
  | 'resetFields'
  | 'scrollToField'
  | 'clearValidate'
>;

export type ElFormItemProp = FormItemProp;

/**
 * ElIcon
 */
export type ElIconInstance = InstanceType<typeof ElIcon> | null;

export type ElIconProps = ComponentProps<IconProps>;

/**
 * ElImage
 */
export type ElImageInstance = InstanceType<typeof ElImage> | null;

export type ElImageProps = ComponentProps<ImageProps>;

export type ElImageViewerInstance = InstanceType<typeof ElImageViewer> | null;

/**
 * ElInput
 */
export type ElInputInstance = InstanceType<typeof ElInput> | null;

export type ElInputProps = ComponentProps<InputProps>;

/**
 * ElLink
 */
export type ElLinkProps = ComponentProps<LinkProps>;

/**
 * ElMenu
 */
export type ElMenuInstance = InstanceType<typeof ElMenu> | null;

export type ElMenuProps = ComponentProps<MenuProps>;

export type ElSubMenuInstance = InstanceType<typeof ElSubMenu> | null;

export type ElSubMenuProps = ComponentProps<SubMenuProps>;

export type ElMenuItemProps = ComponentProps<MenuItemProps>;

export type ElMenuItemGroupProps = ComponentProps<MenuItemGroupProps>;

/**
 * ElMessage
 */
export type ElMessageOptions = Partial<MessageOptions>;

/**
 * ElMessageBox
 */
export type ElMessageBoxOptions = Partial<MessageBoxOptions>;

/**
 * ElMention
 */
export type ElMentionInstance = MentionInstance | null;

/**
 * ElPopper
 */
export type ElPopperInstance = InstanceType<typeof ElPopper> | null;

export type ElPopoverInstance = InstanceType<typeof ElPopover> | null;

export type ElPopoverProps = Partial<PopoverProps>;

export type ElTooltipInstance = InstanceType<typeof ElTooltip> | null;

export type ElTooltipProps = Partial<TooltipProps>;

export type ElTooltipContentInstance =
  | TooltipContentInstance
  | null
  | undefined;

export type ElPopconfirmProps = Partial<PopconfirmProps>;

/**
 * ElProgress
 */
export type ElProgressProps = ComponentProps<ProgressProps>;

/**
 * ElPagination
 */
export type ElPaginationInstance = InstanceType<typeof ElPagination> | null;

/**
 * ElRow
 */
export type ElRowProps = ComponentProps<RowProps>;

export type ElColProps = ComponentProps<ColProps>;

/**
 * ElRadioGroup
 */
export type ElRadioGroupInstance = InstanceType<typeof ElRadioGroup> | null;

/**
 * ElScrollbar
 */
export type ElScrollbarInstance = InstanceType<typeof ElScrollbar> | null;

/**
 * ElSelect
 */
export type ElSelectInstance = InstanceType<typeof ElSelect> | null;

/**
 * ElStep
 */
export type ElStepInstance = InstanceType<typeof ElStep> | null;

export type ElStepProps = ComponentProps<StepProps>;

/**
 * ElTable
 */
// @ts-ignore
export type ElTableInstance = InstanceType<typeof ElTable> | null;

export type ElTableProps<T extends Record<PropertyKey, any>> = ComponentProps<
  TableProps<T>
>;

export type ElColumnProps = Partial<TableColumnCtx<Record<string, any>>>;

export type ElTableV2Instance = InstanceType<typeof ElTableV2> | null;

export type ElTableV2Props = ComponentProps<TableV2Props>;

/**
 * ElTabs
 */
export type ElTabsInstance = InstanceType<typeof ElTabs> | null;

export type ElTabsProps = ComponentProps<TabsProps>;

export type ElTabPaneProps = ComponentProps<TabPaneProps>;

/**
 * ElTag
 */
export type ElTagInstance = InstanceType<typeof ElTag> | null;

export type ElTagProps = ComponentProps<TagProps>;

/**
 * ElTransfer
 */
export type ElTransferInstance = TransferInstance | null;

/**
 * ElTreeSelect
 */
export type ElTreeSelectInstance = InstanceType<typeof ElTreeSelect> | null;

/**
 * ElTree
 */
export type ElTreeInstance = InstanceType<typeof ElTree> | null;

export type ElTreeProps = ComponentProps<TreeComponentProps>;

/**
 * ElTreeV2
 */
export type ElTreeV2Instance = InstanceType<typeof ElTreeV2> | null;

export type ElTreeV2Props = ComponentProps<TreeProps>;

/**
 * ElUpload
 */
export type ElUploadProps = ComponentProps<UploadProps>;
