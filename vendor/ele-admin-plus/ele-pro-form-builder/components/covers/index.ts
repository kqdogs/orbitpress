import { markRaw } from 'vue';
import CoverInput from './cover-input.vue';
import CoverTextarea from './cover-textarea.vue';
import CoverSelect from './cover-select.vue';
import CoverMultipleSelect from './cover-multiple-select.vue';
import CoverRadio from './cover-radio.vue';
import CoverRadioButton from './cover-radio-button.vue';
import CoverCheckbox from './cover-checkbox.vue';
import CoverCheckboxButton from './cover-checkbox-button.vue';
import CoverDate from './cover-date.vue';
import CoverDatetime from './cover-datetime.vue';
import CoverDaterange from './cover-daterange.vue';
import CoverDatetimerange from './cover-datetimerange.vue';
import CoverTime from './cover-time.vue';
import CoverTimerange from './cover-timerange.vue';
import CoverTimeSelect from './cover-time-select.vue';
import CoverSwitch from './cover-switch.vue';
import CoverInputNumber from './cover-input-number.vue';
import CoverAutocomplete from './cover-autocomplete.vue';
import CoverMention from './cover-mention.vue';
import CoverCascader from './cover-cascader.vue';
import CoverMultipleCascader from './cover-multiple-cascader.vue';
import CoverRate from './cover-rate.vue';
import CoverTransfer from './cover-transfer.vue';
import CoverColorPicker from './cover-color-picker.vue';
import CoverSlider from './cover-slider.vue';
import CoverSliderRange from './cover-slider-range.vue';
import CoverTreeSelect from './cover-tree-select.vue';
import CoverTreeMultipleSelect from './cover-tree-multiple-select.vue';
import CoverVirtualTreeSelect from './cover-virtual-tree-select.vue';
import CoverVirtualTreeMultipleSelect from './cover-virtual-tree-multiple-select.vue';
import CoverTableSelect from './cover-table-select.vue';
import CoverTableMultipleSelect from './cover-table-multiple-select.vue';
import CoverCheckCard from './cover-check-card.vue';
import CoverMultipleCheckCard from './cover-multiple-check-card.vue';
import CoverEditTag from './cover-edit-tag.vue';
import CoverText from './cover-text.vue';
import CoverLabel from './cover-label.vue';
import CoverDivider from './cover-divider.vue';
import CoverButton from './cover-button.vue';
import CoverIcon from './cover-icon.vue';
import CoverImage from './cover-image.vue';
import CoverAlert from './cover-alert.vue';
import CoverSteps from './cover-steps.vue';
import CoverProTable from './cover-pro-table.vue';
import CoverCard from './cover-card.vue';
import CoverTable from './cover-table.vue';
import CoverTabs from './cover-tabs.vue';
import CoverRow from './cover-row.vue';
import CoverCollapse from './cover-collapse.vue';
import CoverCarousel from './cover-carousel.vue';
import CoverDescriptions from './cover-descriptions.vue';
import CoverDiv from './cover-div.vue';

export const covers = {
  input: markRaw(CoverInput),
  textarea: markRaw(CoverTextarea),
  select: markRaw(CoverSelect),
  multipleSelect: markRaw(CoverMultipleSelect),
  radio: markRaw(CoverRadio),
  radioButton: markRaw(CoverRadioButton),
  checkbox: markRaw(CoverCheckbox),
  checkboxButton: markRaw(CoverCheckboxButton),
  date: markRaw(CoverDate),
  datetime: markRaw(CoverDatetime),
  daterange: markRaw(CoverDaterange),
  datetimerange: markRaw(CoverDatetimerange),
  time: markRaw(CoverTime),
  timerange: markRaw(CoverTimerange),
  timeSelect: markRaw(CoverTimeSelect),
  switch: markRaw(CoverSwitch),
  inputNumber: markRaw(CoverInputNumber),
  autocomplete: markRaw(CoverAutocomplete),
  mention: markRaw(CoverMention),
  cascader: markRaw(CoverCascader),
  multipleCascader: markRaw(CoverMultipleCascader),
  rate: markRaw(CoverRate),
  transfer: markRaw(CoverTransfer),
  colorPicker: markRaw(CoverColorPicker),
  slider: markRaw(CoverSlider),
  sliderRange: markRaw(CoverSliderRange),
  treeSelect: markRaw(CoverTreeSelect),
  treeMultipleSelect: markRaw(CoverTreeMultipleSelect),
  virtualTreeSelect: markRaw(CoverVirtualTreeSelect),
  virtualTreeMultipleSelect: markRaw(CoverVirtualTreeMultipleSelect),
  tableSelect: markRaw(CoverTableSelect),
  tableMultipleSelect: markRaw(CoverTableMultipleSelect),
  checkCard: markRaw(CoverCheckCard),
  multipleCheckCard: markRaw(CoverMultipleCheckCard),
  editTag: markRaw(CoverEditTag),
  text: markRaw(CoverText),
  label: markRaw(CoverLabel),
  divider: markRaw(CoverDivider),
  button: markRaw(CoverButton),
  icon: markRaw(CoverIcon),
  image: markRaw(CoverImage),
  alert: markRaw(CoverAlert),
  steps: markRaw(CoverSteps),
  proTable: markRaw(CoverProTable),
  card: markRaw(CoverCard),
  table: markRaw(CoverTable),
  tabs: markRaw(CoverTabs),
  row: markRaw(CoverRow),
  collapse: markRaw(CoverCollapse),
  carousel: markRaw(CoverCarousel),
  descriptions: markRaw(CoverDescriptions),
  div: markRaw(CoverDiv)
};
