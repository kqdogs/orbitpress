import { markRaw } from 'vue';
import {
  ElDivider,
  ElButton,
  ElImage,
  ElCollapse,
  ElCollapseItem,
  ElCarousel,
  ElCarouselItem,
  ElDescriptions,
  ElDescriptionsItem,
  ElRow,
  ElCol,
  ElInput,
  ElDatePicker,
  ElTimePicker,
  ElTimeSelect,
  ElSwitch,
  ElInputNumber,
  ElRate,
  ElSlider,
  ElColorPicker
} from 'element-plus';
import EleIcon from '../../ele-icon/index.vue';
import EleText from '../../ele-text/index.vue';
import EleAlert from '../../ele-alert/index.vue';
import EleSteps from '../../ele-steps/index.vue';
import EleProTable from '../../ele-pro-table/index.vue';
import EleCard from '../../ele-card/index.vue';
import EleTabs from '../../ele-tabs/index.vue';
import EleTable from '../../ele-table/index.vue';
import EleAdminLayout from '../../ele-admin-layout/index.vue';
import EleTreeSelect from '../../ele-tree-select/index.vue';
import EleTableSelect from '../../ele-table-select/index.vue';
import EleCheckCard from '../../ele-check-card/index.vue';
import EleEditTag from '../../ele-edit-tag/index.vue';
import EleSelect from '../../ele-select/index.vue';
import EleCascader from '../../ele-cascader/index.vue';
import EleRadioGroup from '../../ele-radio-group/index.vue';
import EleCheckboxGroup from '../../ele-checkbox-group/index.vue';
import EleSelectTree from '../../ele-select-tree/index.vue';
import EleTransfer from '../../ele-transfer/index.vue';
import EleMention from '../../ele-mention/index.vue';
import EleAutocomplete from '../../ele-autocomplete/index.vue';
import type { ProFormItemTypeData } from '../types';

/**
 * 默认表单项类型
 */
export const defaultItemTypeData: ProFormItemTypeData[] = [
  {
    type: 'label',
    component: markRaw(EleText),
    isContainer: true,
    sortDisabled: true,
    renderLabelText: true
  },
  {
    type: 'divider',
    component: markRaw(ElDivider),
    isContainer: true,
    sortDisabled: true,
    renderLabelText: true
  },
  {
    type: 'button',
    component: markRaw(ElButton),
    isContainer: true,
    sortDisabled: true,
    renderLabelText: true,
    defaultProps: () => ({
      type: 'primary'
    })
  },
  {
    type: 'icon',
    component: markRaw(EleIcon),
    isContainer: true,
    sortDisabled: true
  },
  {
    type: 'image',
    component: markRaw(ElImage),
    isContainer: true,
    sortDisabled: true
  },
  {
    type: 'alert',
    component: markRaw(EleAlert),
    isContainer: true,
    sortDisabled: true
  },
  {
    type: 'steps',
    component: markRaw(EleSteps),
    isContainer: true,
    sortDisabled: true,
    defaultProps: ({ modelValue }) => ({
      active: modelValue ?? 0
    })
  },
  {
    type: 'proTable',
    component: markRaw(EleProTable),
    isContainer: true,
    sortDisabled: true
  },
  {
    type: 'card',
    component: markRaw(EleCard),
    isContainer: true,
    defaultProps: () => ({
      bordered: true
    })
  },
  {
    type: 'tabs',
    component: markRaw(EleTabs),
    isContainer: true,
    defaultProps: ({ item, modelValue }) => ({
      type: 'border-card',
      modelValue: modelValue ?? item.children?.[0]?.prop
    }),
    reservedProps: ({ item, isShowFormItem }) => ({
      items: (item.children || [])
        .filter((c) => isShowFormItem(c))
        .map((c) => ({
          name: c.props?.name ?? c.prop,
          label: c.props?.label ?? c.label,
          disabled: c.props?.disabled,
          closable: c.props?.closable,
          lazy: c.props?.lazy,
          slot: 'itemContent',
          meta: c
        }))
    }),
    reservedSlots: ({ renderChildren }) => ({
      itemContent: (slotProps) =>
        renderChildren(slotProps?.item?.meta, false, true),
      default: () => void 0
    })
  },
  {
    type: 'tabPane',
    component: 'div',
    isContainer: true,
    containerSelectable: true
  },
  {
    type: 'table',
    component: markRaw(EleTable),
    isContainer: true,
    sortDisabled: true
  },
  {
    type: 'tableRow',
    component: 'tr',
    isContainer: true,
    sortDisabled: true
  },
  {
    type: 'tableCell',
    component: 'td',
    isContainer: true,
    containerSelectable: true
  },
  {
    type: 'collapse',
    component: markRaw(ElCollapse),
    isContainer: true,
    sortDisabled: true,
    defaultProps: ({ item, modelValue }) => ({
      modelValue:
        modelValue ??
        (item.props?.accordion
          ? (item.children?.[0]?.props?.name ?? item.children?.[0]?.prop)
          : [])
    }),
    reservedProps: ({ updateModelValue }) => ({
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'collapseItem',
    component: markRaw(ElCollapseItem),
    isContainer: true,
    containerSelectable: true
  },
  {
    type: 'carousel',
    component: markRaw(ElCarousel),
    isContainer: true,
    sortDisabled: true
  },
  {
    type: 'carouselItem',
    component: markRaw(ElCarouselItem),
    isContainer: true,
    containerSelectable: true
  },
  {
    type: 'descriptions',
    component: markRaw(ElDescriptions),
    isContainer: true,
    sortDisabled: true
  },
  {
    type: 'descriptionsItem',
    component: markRaw(ElDescriptionsItem),
    isContainer: true,
    containerSelectable: true
  },
  {
    type: 'row',
    component: markRaw(ElRow),
    isContainer: true,
    sortDisabled: true
  },
  {
    type: 'col',
    component: markRaw(ElCol),
    isContainer: true,
    containerSelectable: true
  },
  {
    type: 'adminLayout',
    component: markRaw(EleAdminLayout),
    isContainer: true
  },
  {
    type: 'div',
    component: 'div',
    isContainer: true,
    sortDisabled: true,
    renderLabelText: true
  },
  {
    type: 'input',
    component: markRaw(ElInput),
    defaultProps: () => ({
      clearable: true
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    }),
    requiredTrigger: 'blur'
  },
  {
    type: 'textarea',
    component: markRaw(ElInput),
    defaultProps: () => ({
      rows: 4
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      type: 'textarea',
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    }),
    requiredTrigger: 'blur'
  },
  {
    type: 'select',
    component: markRaw(EleSelect),
    defaultProps: () => ({
      class: 'ele-fluid',
      clearable: true
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'multipleSelect',
    component: markRaw(EleSelect),
    defaultProps: () => ({
      class: 'ele-fluid',
      clearable: true
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      multiple: true,
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'radio',
    component: markRaw(EleRadioGroup),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'radioButton',
    component: markRaw(EleRadioGroup),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      type: 'button',
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'checkbox',
    component: markRaw(EleCheckboxGroup),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'checkboxButton',
    component: markRaw(EleCheckboxGroup),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      type: 'button',
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'date',
    component: markRaw(ElDatePicker),
    defaultProps: () => ({
      class: 'ele-fluid',
      valueFormat: 'YYYY-MM-DD'
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'datetime',
    component: markRaw(ElDatePicker),
    defaultProps: () => ({
      class: 'ele-fluid',
      valueFormat: 'YYYY-MM-DD HH:mm:ss'
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      type: 'datetime',
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'daterange',
    component: markRaw(ElDatePicker),
    defaultProps: () => ({
      class: 'ele-fluid',
      valueFormat: 'YYYY-MM-DD',
      rangeSeparator: '-',
      unlinkPanels: true,
      type: 'daterange'
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'datetimerange',
    component: markRaw(ElDatePicker),
    defaultProps: () => ({
      class: 'ele-fluid',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      rangeSeparator: '-',
      unlinkPanels: true
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      type: 'datetimerange',
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'time',
    component: markRaw(ElTimePicker),
    defaultProps: () => ({
      class: 'ele-fluid',
      valueFormat: 'HH:mm:ss'
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'timerange',
    component: markRaw(ElTimePicker),
    defaultProps: () => ({
      class: 'ele-fluid',
      valueFormat: 'HH:mm:ss',
      rangeSeparator: '-'
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      isRange: true,
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'timeSelect',
    component: markRaw(ElTimeSelect),
    defaultProps: () => ({
      class: 'ele-fluid'
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'switch',
    component: markRaw(ElSwitch),
    defaultProps: () => ({
      activeValue: 1,
      inactiveValue: 0
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'inputNumber',
    component: markRaw(ElInputNumber),
    defaultProps: () => ({
      class: 'ele-fluid',
      controlsPosition: 'right'
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'autocomplete',
    component: markRaw(EleAutocomplete),
    defaultProps: () => ({
      class: 'ele-fluid'
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'cascader',
    component: markRaw(EleCascader),
    defaultProps: () => ({
      class: 'ele-fluid',
      clearable: true
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'multipleCascader',
    component: markRaw(EleCascader),
    defaultProps: () => ({
      class: 'ele-fluid',
      clearable: true
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      multiple: true,
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'rate',
    component: markRaw(ElRate),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'slider',
    component: markRaw(ElSlider),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'sliderRange',
    component: markRaw(ElSlider),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      range: true,
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'mention',
    component: markRaw(EleMention),
    defaultProps: () => ({
      clearable: true
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'colorPicker',
    component: markRaw(ElColorPicker),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'transfer',
    component: markRaw(EleTransfer),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'treeSelect',
    component: markRaw(EleSelectTree),
    defaultProps: () => ({
      class: 'ele-fluid',
      clearable: true
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'treeMultipleSelect',
    component: markRaw(EleSelectTree),
    defaultProps: () => ({
      class: 'ele-fluid',
      clearable: true,
      showCheckbox: true
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      multiple: true,
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'virtualTreeSelect',
    component: markRaw(EleTreeSelect),
    defaultProps: () => ({
      clearable: true
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'virtualTreeMultipleSelect',
    component: markRaw(EleTreeSelect),
    defaultProps: () => ({
      clearable: true,
      maxTagCount: 1
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      multiple: true,
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'tableSelect',
    component: markRaw(EleTableSelect),
    defaultProps: () => ({
      clearable: true
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'tableMultipleSelect',
    component: markRaw(EleTableSelect),
    defaultProps: () => ({
      clearable: true
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      multiple: true,
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'checkCard',
    component: markRaw(EleCheckCard),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'multipleCheckCard',
    component: markRaw(EleCheckCard),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      multiple: true,
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'editTag',
    component: markRaw(EleEditTag),
    defaultProps: () => ({
      type: 'info',
      style: { marginTop: '4px' },
      itemStyle: { margin: '0 4px 4px 0' },
      buttonStyle: { marginBottom: '4px' },
      inputTagStyle: { marginBottom: '4px' }
    }),
    reservedProps: ({ modelValue, updateModelValue }) => ({
      modelValue: modelValue,
      'onUpdate:modelValue': updateModelValue
    })
  },
  {
    type: 'text',
    component: markRaw(EleText),
    reservedSlots: ({ modelValue }) => ({
      default: () => modelValue
    })
  }
];
