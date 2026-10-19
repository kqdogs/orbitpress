import type EleAdminLayout from '../ele-admin-layout/index';
import type { BacktopProps } from '../ele-backtop/props';
import type EleBasicSelect from '../ele-basic-select/index';
import type EleBasicSelectView from '../ele-basic-select/components/select-view';
import type { BreadcrumbProps } from '../ele-breadcrumb/props';
import type { CardProps } from '../ele-card/props';
import type EleChat from '../ele-chat/index';
import type EleCronPanel from '../ele-cron-panel/index';
import type EleDataTable from '../ele-data-table/index';
import type { DataTableProps } from '../ele-data-table/props';
import type EleDrawer from '../ele-drawer/index';
import type { DrawerProps, DrawerPropsAndEmits } from '../ele-drawer/props';
import type EleDropdown from '../ele-dropdown/index';
import type {
  DropdownProps,
  DropdownPropsAndEmits
} from '../ele-dropdown/props';
import type { FileListProps } from '../ele-file-list/props';
import type EleImageViewer from '../ele-image-viewer/index';
import type {
  ImageViewerProps,
  ImageViewerPropsAndEmits
} from '../ele-image-viewer/props';
import type { LoadingProps } from '../ele-loading/props';
import type EleMenus from '../ele-menus/index';
import type { MenusProps } from '../ele-menus/props';
import type { MenuItem } from '../ele-menus/types';
import type EleModal from '../ele-modal/index';
import type { ModalProps, ModalPropsAndEmits } from '../ele-modal/props';
import type ElePage from '../ele-page/index';
import type { PageProps } from '../ele-page/props';
import type { PaginationProps } from '../ele-pagination/props';
import type ElePopconfirm from '../ele-popconfirm/index';
import type {
  PopconfirmProps,
  PopconfirmPropsAndEmits
} from '../ele-popconfirm/props';
import type ElePopover from '../ele-popover/index';
import type { PopoverProps } from '../ele-popover/props';
import type { PrinterProps } from '../ele-printer/props';
import type EleProTable from '../ele-pro-table/index';
import type { ProTableProps } from '../ele-pro-table/props';
import type EleSplitPanel from '../ele-split-panel/index';
import type { SplitPanelProps } from '../ele-split-panel/props';
import type { TableProps } from '../ele-table/props';
import type EleTableSelect from '../ele-table-select/index';
import type EleTabs from '../ele-tabs/index';
import type EleText from '../ele-text/index';
import type { TextProps } from '../ele-text/props';
import type EleTool from '../ele-tool/index';
import type { ToolProps } from '../ele-tool/props';
import type { ToolbarProps } from '../ele-toolbar/props';
import type EleTooltip from '../ele-tooltip/index';
import type { TooltipProps, TooltipPropsAndEmits } from '../ele-tooltip/props';
import type EleTreeSelect from '../ele-tree-select/index';
import type EleUploadList from '../ele-upload-list/index';
import type { UploadListProps } from '../ele-upload-list/props';
import type EleVirtualTable from '../ele-virtual-table/index';
import type { MessageOptions } from '../utils/message';
import type { MessageBoxOptions } from '../utils/message-box';
import type { ComponentProps } from './types';

/**
 * EleAdminLayout
 */
export type EleAdminLayoutInstance = InstanceType<typeof EleAdminLayout> | null;

/**
 * EleBacktop
 */
export type EleBacktopProps = ComponentProps<BacktopProps>;

/**
 * EleBasicSelect
 */
export type EleBasicSelectInstance = InstanceType<typeof EleBasicSelect> | null;

export type EleBasicSelectViewInstance = InstanceType<
  typeof EleBasicSelectView
> | null;

/**
 * EleBreadcrumb
 */
export type EleBreadcrumbProps = ComponentProps<BreadcrumbProps>;

/**
 * EleCard
 */
export type EleCardProps = ComponentProps<CardProps>;

/**
 * EleChat
 */
export type EleChatInstance = InstanceType<typeof EleChat> | null;

/**
 * EleCronPanel
 */
export type EleCronPanelInstance = InstanceType<typeof EleCronPanel> | null;

/**
 * EleDataTable
 */
export type EleDataTableInstance = InstanceType<typeof EleDataTable> | null;

export type EleDataTableProps = ComponentProps<DataTableProps>;

/**
 * EleDrawer
 */
export type EleDrawerInstance = InstanceType<typeof EleDrawer> | null;

export type EleDrawerProps = ComponentProps<DrawerProps>;

export type EleDrawerPropsAndEmits = ComponentProps<DrawerPropsAndEmits>;

/**
 * EleDropdown
 */
export type EleDropdownInstance = InstanceType<typeof EleDropdown> | null;

export type EleDropdownProps = ComponentProps<DropdownProps>;

export type EleDropdownPropsAndEmits = ComponentProps<DropdownPropsAndEmits>;

/**
 * EleFileList
 */
export type EleFileListProps = ComponentProps<FileListProps>;

/**
 * EleImageViewer
 */
export type EleImageViewerInstance = InstanceType<typeof EleImageViewer> | null;

export type EleImageViewerProps = ComponentProps<ImageViewerProps>;

export type EleImageViewerPropsAndEmits =
  ComponentProps<ImageViewerPropsAndEmits>;

/**
 * EleLoading
 */
export type EleLoadingProps = ComponentProps<LoadingProps>;

/**
 * EleMenus
 */
export type EleMenusInstance = InstanceType<typeof EleMenus> | null;

export type EleMenusProps = ComponentProps<MenusProps>;

export type EleMenuItemProps = Partial<MenuItem>;

/**
 * EleModal
 */
export type EleModalInstance = InstanceType<typeof EleModal> | null;

export type EleModalProps = ComponentProps<ModalProps>;

export type EleModalPropsAndEmits = ComponentProps<ModalPropsAndEmits>;

/**
 * ElePage
 */
export type ElePageInstance = InstanceType<typeof ElePage> | null;

export type ElePageProps = ComponentProps<PageProps>;

/**
 * ElePagination
 */
export type ElePaginationProps = ComponentProps<PaginationProps>;

/**
 * ElePopconfirm
 */
export type ElePopconfirmInstance = InstanceType<typeof ElePopconfirm> | null;

export type ElePopconfirmProps = Partial<PopconfirmProps>;

export type ElePopconfirmPropsAndEmits = Partial<PopconfirmPropsAndEmits>;

/**
 * ElePopover
 */
export type ElePopoverInstance = InstanceType<typeof ElePopover> | null;

export type ElePopoverProps = Partial<PopoverProps>;

/**
 * ElePrinter
 */
export type ElePrinterProps = ComponentProps<PrinterProps>;

/**
 * EleProTable
 */
export type EleProTableInstance = InstanceType<typeof EleProTable> | null;

export type EleProTableProps = ComponentProps<ProTableProps>;

/**
 * EleSplitPanel
 */
export type EleSplitPanelInstance = InstanceType<typeof EleSplitPanel> | null;

export type EleSplitPanelProps = ComponentProps<SplitPanelProps>;

/**
 * EleTable
 */
export type EleTableProps = ComponentProps<TableProps>;

/**
 * EleTableSelect
 */
export type EleTableSelectInstance = InstanceType<typeof EleTableSelect> | null;

/**
 * EleTabs
 */
export type EleTabsInstance = InstanceType<typeof EleTabs> | null;

/**
 * EleText
 */
export type EleTextInstance = InstanceType<typeof EleText> | null;

export type EleTextProps = ComponentProps<TextProps>;

/**
 * EleTool
 */
export type EleToolInstance = InstanceType<typeof EleTool> | null;

export type EleToolProps = Partial<ToolProps>;

/**
 * EleToolbar
 */
export type EleToolbarProps = ComponentProps<ToolbarProps>;

/**
 * EleTooltip
 */
export type EleTooltipInstance = InstanceType<typeof EleTooltip> | null;

export type EleTooltipProps = Partial<TooltipProps>;

export type EleTooltipPropsAndEmits = Partial<TooltipPropsAndEmits>;

/**
 * EleTreeSelect
 */
export type EleTreeSelectInstance = InstanceType<typeof EleTreeSelect> | null;

/**
 * EleUploadList
 */
export type EleUploadListInstance = InstanceType<typeof EleUploadList> | null;

export type EleUploadListProps = Partial<UploadListProps>;

/**
 * EleVirtualTable
 */
export type EleVirtualTableInstance = InstanceType<
  typeof EleVirtualTable
> | null;

/**
 * Message
 */
export type EleMessageOptions = Partial<MessageOptions>;

/**
 * MessageBox
 */
export type EleMessageBoxOptions = Partial<MessageBoxOptions>;
