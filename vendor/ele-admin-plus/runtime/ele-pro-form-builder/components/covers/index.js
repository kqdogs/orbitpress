import { markRaw } from "vue";
import CoverInput from "./cover-input";
import CoverTextarea from "./cover-textarea";
import CoverSelect from "./cover-select";
import CoverMultipleSelect from "./cover-multiple-select";
import CoverRadio from "./cover-radio";
import CoverRadioButton from "./cover-radio-button";
import CoverCheckbox from "./cover-checkbox";
import CoverCheckboxButton from "./cover-checkbox-button";
import CoverDate from "./cover-date";
import CoverDatetime from "./cover-datetime";
import CoverDaterange from "./cover-daterange";
import CoverDatetimerange from "./cover-datetimerange";
import CoverTime from "./cover-time";
import CoverTimerange from "./cover-timerange";
import CoverTimeSelect from "./cover-time-select";
import CoverSwitch from "./cover-switch";
import CoverInputNumber from "./cover-input-number";
import CoverAutocomplete from "./cover-autocomplete";
import CoverMention from "./cover-mention";
import CoverCascader from "./cover-cascader";
import CoverMultipleCascader from "./cover-multiple-cascader";
import CoverRate from "./cover-rate";
import CoverTransfer from "./cover-transfer";
import CoverColorPicker from "./cover-color-picker";
import CoverSlider from "./cover-slider";
import CoverSliderRange from "./cover-slider-range";
import CoverTreeSelect from "./cover-tree-select";
import CoverTreeMultipleSelect from "./cover-tree-multiple-select";
import CoverVirtualTreeSelect from "./cover-virtual-tree-select";
import CoverVirtualTreeMultipleSelect from "./cover-virtual-tree-multiple-select";
import CoverTableSelect from "./cover-table-select";
import CoverTableMultipleSelect from "./cover-table-multiple-select";
import CoverCheckCard from "./cover-check-card";
import CoverMultipleCheckCard from "./cover-multiple-check-card";
import CoverEditTag from "./cover-edit-tag";
import CoverText from "./cover-text";
import CoverLabel from "./cover-label";
import CoverDivider from "./cover-divider";
import CoverButton from "./cover-button";
import CoverIcon from "./cover-icon";
import CoverImage from "./cover-image";
import CoverAlert from "./cover-alert";
import CoverSteps from "./cover-steps";
import CoverProTable from "./cover-pro-table";
import CoverCard from "./cover-card";
import CoverTable from "./cover-table";
import CoverTabs from "./cover-tabs";
import CoverRow from "./cover-row";
import CoverCollapse from "./cover-collapse";
import CoverCarousel from "./cover-carousel";
import CoverDescriptions from "./cover-descriptions";
import CoverDiv from "./cover-div";
const covers = {
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
export {
  covers
};
