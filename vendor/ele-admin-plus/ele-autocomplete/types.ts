import type { AutocompleteFetchSuggestionsCallback } from 'element-plus';
export type ElFetchSuggestionsCallback = AutocompleteFetchSuggestionsCallback;

/**
 * 建议数据项
 */
export interface AutocompleteDataItem extends Record<string, any> {
  /** 值 */
  value?: string;
}

/**
 * 建议数据请求函数
 */
export type AutocompleteDataFunction = (
  keyword: string,
  cb: ElFetchSuggestionsCallback
) => Promise<AutocompleteDataItem[]> | void;
