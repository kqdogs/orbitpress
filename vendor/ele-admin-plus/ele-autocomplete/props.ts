import type { AutocompleteProps as ElAutocompleteProps } from 'element-plus';
import type { AutocompleteDataItem, AutocompleteDataFunction } from './types';
export { autocompleteEmits } from 'element-plus';

/**
 * 属性
 */
export interface AutocompleteProps extends Omit<
  ElAutocompleteProps,
  'fetchSuggestions'
> {
  /** 建议数据 */
  fetchSuggestions?: AutocompleteDataItem[] | AutocompleteDataFunction;
}
