import { omit, eachTree, getValue, findTree, uuid, mapTree } from "../utils/common";
import { getColFixedNumber } from "../ele-data-table/util";
import { getIndexValue, analyseColumns, getCellSpan, getUserSums, getSumValue } from "../ele-virtual-table/util";
function mergeProps(props, globalProps) {
  if (props == null) {
    return globalProps ?? true;
  }
  if (!props) {
    return false;
  }
  if (!globalProps || typeof globalProps !== "object") {
    return props;
  }
  if (typeof props !== "object") {
    return globalProps;
  }
  return { ...globalProps, ...props };
}
function getPaginationProps(size, pagination, globalPagination, pageProps) {
  const props = mergeProps(pagination, globalPagination);
  if (props == null || props === false) {
    return null;
  }
  const defaultProps = {
    size: size !== "large" ? "small" : "default",
    pagerCount: 5,
    layout: "total, prev, pager, next, sizes, jumper",
    pageSizes: [10, 20, 30, 40, 50, 100],
    hideOnSinglePage: false
  };
  if (typeof props !== "object") {
    return Object.assign(defaultProps, pageProps);
  }
  return Object.assign(defaultProps, omit(props, ["autoAmend"]), pageProps);
}
function getTablePage(pagination, globalPagination) {
  const props = getPaginationProps(void 0, pagination, globalPagination);
  return props?.currentPage ?? 1;
}
function getTableLimit(pagination, globalPagination) {
  const props = getPaginationProps(void 0, pagination, globalPagination);
  return props?.pageSize ?? 10;
}
function isAutoAmend(pagination, globalPagination) {
  const props = mergeProps(pagination, globalPagination);
  if (!props) {
    return false;
  }
  if (typeof props === "object") {
    return !!props.autoAmend;
  }
  return props === true;
}
function getTableSize(cacheKey, size, globalSize) {
  return getCacheSize(cacheKey) ?? size ?? globalSize ?? "default";
}
function getDefaultFilter(columns) {
  const filter = {};
  eachTree(columns, (d) => {
    const prop = d.columnKey ?? d.prop;
    if (typeof prop === "string" && prop && d.filteredValue) {
      filter[prop] = d.filteredValue;
    }
  });
  return filter;
}
function getRequestName(globalRequest, request) {
  const defaultRequest = {
    pageName: "page",
    limitName: "limit",
    sortName: "sort",
    orderName: "order",
    ascValue: "asc",
    descValue: "desc"
  };
  return Object.assign(defaultRequest, globalRequest, request);
}
function getResponseName(globalResponse, response) {
  const defaultResponse = {
    dataName: "list",
    countName: "count"
  };
  return Object.assign(defaultResponse, globalResponse, response);
}
function getOrderItems(sorter) {
  const orders = [];
  if (!sorter || !sorter.order) {
    return orders;
  }
  const descend = sorter.order === "descending";
  const sortMethod = sorter.column?.sortMethod;
  const sortBy = sorter.column?.sortBy;
  if (Array.isArray(sortBy) && sortBy.length) {
    sortBy.forEach((field) => {
      if (typeof field === "string" && field.length) {
        orders.push({ field, descend, sortMethod });
      }
    });
  } else {
    const field = typeof sortBy === "string" && sortBy ? sortBy : sorter.prop;
    if (field) {
      orders.push({ field, descend, sortMethod });
    }
  }
  return orders;
}
function getRequestOrders(sorter, request, globalRequest) {
  const orders = {};
  const { sortName, orderName, ascValue, descValue } = getRequestName(
    globalRequest,
    request
  );
  if (!sortName || !orderName) {
    return orders;
  }
  const items = getOrderItems(sorter);
  if (items.length === 1) {
    orders[sortName] = items[0].field;
    orders[orderName] = items[0].descend ? descValue : ascValue;
  } else if (items.length) {
    orders[sortName] = items.map((d) => [d.field, d.descend ? descValue : ascValue].join(" ")).join(",");
  }
  return orders;
}
function getRequestFilters(filter) {
  const filters = {};
  if (filter) {
    Object.keys(filter).forEach((key) => {
      const value = filter[key];
      if (value == null) {
        return;
      }
      if (typeof value === "string") {
        if (value) {
          filters[key] = value;
        }
      } else if (Array.isArray(value)) {
        if (value.length) {
          filters[key] = value.join(",");
        }
      } else {
        filters[key] = value;
      }
    });
  }
  return filters;
}
function getRequestPages(page, limit, request, globalRequest) {
  const pages = {};
  const { pageName, limitName } = getRequestName(globalRequest, request);
  if (!pageName || !limitName) {
    return pages;
  }
  pages[pageName] = page;
  pages[limitName] = limit;
  return pages;
}
function getResponseResult(result, response, globalResponse, lazy, treeOpt) {
  if (!result || Array.isArray(result)) {
    return {
      data: getResponseData(result, lazy, treeOpt),
      result
    };
  }
  const { dataName, countName } = getResponseName(globalResponse, response);
  if (!dataName) {
    return { result };
  }
  return {
    data: getResponseData(getValue(result, dataName), lazy, treeOpt),
    total: (countName ? getValue(result, countName) : void 0) ?? 0,
    result
  };
}
function getResponseData(data, lazy, treeProps) {
  if (!data || !lazy) {
    return data || [];
  }
  const name = treeProps?.hasChildren ?? "hasChildren";
  return data.map((d) => {
    const temp = { ...d };
    temp[name] = temp[name] ?? true;
    return temp;
  });
}
function sortData(datasource, sorter) {
  if (!datasource || !datasource.length) {
    return [];
  }
  const data = [...datasource];
  getOrderItems(sorter).forEach((item) => {
    data.sort((a, b) => {
      if (typeof item.sortMethod === "function") {
        const r2 = item.sortMethod(a, b);
        return item.descend ? -r2 : r2;
      }
      const aValue = getValue(a, item.field);
      const bValue = getValue(b, item.field);
      const r = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return item.descend ? -r : r;
    });
  });
  return data;
}
function reloadData(datasource, sorter, page, limit) {
  const data = sortData(datasource, sorter);
  const total = data.length;
  if (!page || !limit) {
    return { page: 1, data, total };
  }
  const maxPage = Math.ceil(total / limit);
  if (maxPage && page > maxPage) {
    page = maxPage;
  }
  const start = (page - 1) * limit;
  const end = start + limit;
  const list = data.slice(start, end > total ? total : end);
  return { page, data: list, total };
}
function getColId(column) {
  if (column.columnKey == null || column.columnKey === "") {
    return column.prop;
  }
  return column.columnKey;
}
function getInitColumns(columns, cacheColsWidth) {
  const data = [];
  columns.forEach((d) => {
    if (!d.hideInTable) {
      const width = getCacheColWidth(cacheColsWidth, d) ?? d.width;
      if (d.children?.length) {
        const children = getInitColumns(d.children);
        if (children.length) {
          data.push({ ...d, width, children });
        }
      } else {
        data.push({ ...d, width });
      }
    }
  });
  return data;
}
function getInitCacheColumns(columns, cacheKey, sortable) {
  const cacheCols = getCacheCols(getColsCacheKey(cacheKey));
  if (!cacheCols) {
    return getInitColumns(columns, getCacheColsWidth(cacheKey));
  }
  return getCheckedColumns(
    columns,
    cacheCols,
    sortable,
    (item) => item.hideInSetting,
    void 0,
    false,
    getCacheColsWidth(cacheKey)
  );
}
function getCheckedColumns(columns, cols, sortable, isHideInCol, filter, reserveUnchecked, cacheColsWidth) {
  const data = [];
  if (!columns || !columns.length) {
    return data;
  }
  columns.forEach((d) => {
    const colId = getColId(d);
    if (filter && !filter(d)) {
      return;
    }
    const temp = colId == null ? null : findTree(cols, (t) => t.uid === colId);
    const hideInTable = temp ? !temp.checked : d.hideInTable;
    if (!reserveUnchecked && hideInTable) {
      return;
    }
    const width = getCacheColWidth(cacheColsWidth, d) ?? d.width;
    const fixed = temp?.fixed ?? d.fixed;
    const uid = uuid(8);
    if (d.children && d.children.length) {
      const children = getCheckedColumns(
        d.children,
        cols,
        sortable,
        isHideInCol,
        filter,
        reserveUnchecked,
        cacheColsWidth
      );
      if (children.length) {
        data.push({ ...d, width, fixed, hideInTable, children, uid });
      }
      return;
    }
    data.push({ ...d, width, fixed, hideInTable, uid });
  });
  if (!sortable || !data.length) {
    return data;
  }
  data.sort((a, b) => {
    const aColId = getColId(a);
    const bColId = getColId(b);
    let i = 0;
    let ai;
    let bi;
    eachTree(cols, (c) => {
      if (c.uid === aColId) {
        ai = i;
      }
      if (c.uid === bColId) {
        bi = i;
      }
      i++;
    });
    if (ai == null && isHideInCol?.(a) && a.fixed === "right") {
      ai = i;
    }
    if (ai == null) {
      ai = -1;
    }
    if (a.fixed === true || a.fixed === "left") {
      ai -= i;
    } else if (a.fixed === "right" || isHideInCol?.(a) && !a.fixed) {
      ai += i;
    }
    if (bi == null && isHideInCol?.(b) && b.fixed === "right") {
      bi = i;
    }
    if (bi == null) {
      bi = -1;
    }
    if (b.fixed === true || b.fixed === "left") {
      bi -= i;
    } else if (b.fixed === "right" || isHideInCol?.(b) && !b.fixed) {
      bi += i;
    }
    return ai - bi;
  });
  return data;
}
function getColItems(columns, locale, filter, cacheCols, sortFixed, cancelFixed, cacheColsWidth) {
  const temp = columns == null ? [] : [...columns];
  if (sortFixed) {
    temp.sort(
      (a, b) => getColFixedNumber(a.fixed) - getColFixedNumber(b.fixed)
    );
  }
  const cols = mapTree(temp, (d, _i, parent) => {
    const colId = getColId(d);
    if (colId == null || filter && !filter(d)) {
      return;
    }
    const old = findTree(cacheCols, (t) => t.uid === colId);
    const item = {
      uid: colId,
      type: d.type,
      label: d.label || (d.type === "index" ? locale.columnIndex : d.type === "selection" ? locale.columnSelection : d.type === "expand" ? locale.columnExpand : locale.columnUntitled),
      checked: old?.checked ?? !d.hideInTable,
      fixed: cancelFixed || parent != null ? false : old?.fixed ?? d.fixed,
      width: getCacheColWidth(cacheColsWidth, d) ?? d.width
    };
    return item;
  });
  if (cacheCols && cacheCols.length) {
    cols.sort((a, b) => {
      const oldAI = cacheCols.findIndex((t) => t.uid === a.uid);
      const oldBI = cacheCols.findIndex((t) => t.uid === b.uid);
      const ai = oldAI === -1 ? cols.indexOf(a) : oldAI;
      const bi = oldBI === -1 ? cols.indexOf(b) : oldBI;
      return ai - bi;
    });
    eachTree(cols, (item) => {
      if (item.children && item.children.length) {
        const oldC = findTree(cacheCols, (t) => t.uid === item.uid)?.children;
        if (oldC && oldC.length) {
          item.children.sort((a, b) => {
            const oldAI = oldC.findIndex((t) => t.uid === a.uid);
            const oldBI = oldC.findIndex((t) => t.uid === b.uid);
            const ai = oldAI === -1 ? cols.indexOf(a) : oldAI;
            const bi = oldBI === -1 ? cols.indexOf(b) : oldBI;
            return ai - bi;
          });
        }
      }
    });
  }
  let checkAll = true;
  let indeterminate = false;
  eachTree(cols, (d) => {
    if (!d.checked && checkAll) {
      checkAll = false;
    }
    if (d.checked && !indeterminate) {
      indeterminate = true;
    }
    if (!checkAll && indeterminate) {
      return false;
    }
  });
  return {
    cols,
    checkAll: cols.length > 0 && checkAll,
    indeterminate: !checkAll && indeterminate
  };
}
function getSizeCacheKey(cacheKey) {
  return `${cacheKey}Size`;
}
function getColsCacheKey(cacheKey) {
  return cacheKey ? `${cacheKey}Cols` : void 0;
}
function getColsWidthCacheKey(cacheKey) {
  return `${cacheKey}ColsWidth`;
}
function getCacheCols(cacheKey) {
  if (cacheKey) {
    const oldJSON = localStorage.getItem(cacheKey);
    if (oldJSON) {
      try {
        const old = JSON.parse(oldJSON);
        return old && Array.isArray(old) ? old : void 0;
      } catch (e) {
        console.error(e);
      }
    }
  }
}
function getCacheSize(cacheKey) {
  if (cacheKey) {
    const size = localStorage.getItem(getSizeCacheKey(cacheKey));
    if (size) {
      return size;
    }
  }
}
function getCacheColsWidth(cacheKey) {
  if (cacheKey) {
    const oldJSON = localStorage.getItem(getColsWidthCacheKey(cacheKey));
    if (oldJSON) {
      try {
        const old = JSON.parse(oldJSON);
        return old && Array.isArray(old) ? old : void 0;
      } catch (e) {
        console.error(e);
      }
    }
  }
}
function getCacheColWidth(cacheColsWidth, column) {
  if (cacheColsWidth == null || column == null) {
    return;
  }
  const colId = getColId(column);
  const c = findTree(cacheColsWidth, (d) => d.uid === colId);
  if (!c || c.width == null) {
    return;
  }
  if (c.width === "" || typeof c.width === "string" && !c.width.trim()) {
    return "";
  }
  const width = Number(c.width);
  return isNaN(width) ? c.width : width;
}
function cacheColWidth(width, column, cacheKey) {
  if (cacheKey && column) {
    const colId = getColId(column);
    if (colId) {
      const colsWidth = getCacheColsWidth(cacheKey) || [];
      const old = colsWidth.find((d) => d.uid === colId);
      if (!old) {
        colsWidth.push({ uid: colId, width });
      } else {
        old.width = width;
      }
      localStorage.setItem(
        getColsWidthCacheKey(cacheKey),
        JSON.stringify(colsWidth)
      );
    }
  }
}
function getRowKey(rowKey) {
  if (rowKey != null) {
    return rowKey;
  }
  return (row) => {
    return JSON.stringify(row);
  };
}
function getCellText(column, row, index, pageIndex) {
  if (!column) {
    return "";
  }
  if (column.type === "index") {
    return getIndexValue(index, column.index, pageIndex);
  }
  const propValue = column.prop == null ? void 0 : getValue(row, column.prop);
  if (typeof column.formatter === "function") {
    return column.formatter(row, column, propValue, index);
  }
  return propValue == null ? "" : propValue;
}
function getHeaderCellText(column, index) {
  if (!column) {
    return "";
  }
  if (typeof column.renderHeader === "function") {
    return column.renderHeader({ column, $index: index });
  }
  return column.label == null ? "" : String(column.label);
}
function getExportBodyNode(data, childrenField = "children", level = 0, parents = []) {
  const bodyDodes = [];
  let maxDepth = 0;
  data.forEach((row, index) => {
    const node = { row, index, level, childSize: 0 };
    bodyDodes.push(node);
    parents.forEach((parent) => {
      parent.childSize++;
    });
    const children = row[childrenField];
    if (children && children.length) {
      const { depth, nodes } = getExportBodyNode(
        children,
        childrenField,
        level + 1,
        [...parents, node]
      );
      maxDepth = Math.max(maxDepth, depth);
      nodes.forEach((n) => {
        bodyDodes.push(n);
      });
    }
  });
  return { depth: maxDepth + 1, nodes: bodyDodes };
}
function getExportData(data, columns, spanMethod, pageIndex, showSummary, sumText, summaryMethod, childrenField, showTreeIndex, showHeader) {
  const { nodes, depth } = getExportBodyNode(data, childrenField);
  const { rows: headerRows, cols: bodyCols } = analyseColumns(columns);
  const showExpandIndex = bodyCols.some((c) => c.originalCol?.type === "expand") ? showTreeIndex : false;
  if (depth <= 1 || showExpandIndex) {
    showTreeIndex = false;
  }
  const treeIconIndex = showTreeIndex ? void 0 : bodyCols.findIndex(
    (c) => !c.originalCol?.type || !["index", "expand", "selection"].includes(c.originalCol.type)
  );
  const bodyData = [];
  nodes.forEach((node, index) => {
    const row = node.row;
    const bodyRowData = [];
    const expandRowData = [];
    bodyCols.forEach((col, columnIndex) => {
      const { key: colKey, originalCol: column } = col;
      const key = `${index}-${columnIndex}-${colKey}`;
      const { colspan, rowspan } = getCellSpan(
        { column, columnIndex, row, rowIndex: index, data, columns },
        spanMethod
      );
      const isNone = colspan == 0 || rowspan == 0;
      const text = isNone ? "" : getCellText(column, row, index, pageIndex);
      const dataItem = {
        key,
        row,
        index,
        column,
        text,
        colspan,
        rowspan,
        isTreeCell: depth > 1 ? columnIndex === treeIconIndex : false,
        isTreeLeaf: !node.childSize,
        indent: node.level
      };
      if (column.type === "expand") {
        dataItem.text = showExpandIndex ? node.index + 1 : "";
        if (showExpandIndex && !expandRowData.length) {
          dataItem.rowspan = 2;
        }
        const expandDataItem = {
          key: `_expand_${key}`,
          row,
          index,
          column,
          text,
          colspan: showExpandIndex ? bodyCols.length - 1 : bodyCols.length,
          isExpandCell: true
        };
        if (showExpandIndex) {
          expandRowData[0] = {
            key: `_expand_0-${key}`,
            row,
            index,
            rowspan: 0,
            colspan: 0,
            isExpandCell: true
          };
          expandRowData[1] = expandDataItem;
        } else {
          expandRowData[0] = expandDataItem;
        }
      }
      bodyRowData.push(dataItem);
    });
    bodyData.push(bodyRowData);
    if (expandRowData.length) {
      bodyData.push(expandRowData);
    }
    if (showTreeIndex) {
      for (let i = depth - 1; i >= 0; i--) {
        const colspan = i < node.level ? 0 : 1;
        bodyRowData.unshift({
          key: `_index_${index}-${i}`,
          index,
          text: i === node.level ? node.index + 1 : void 0,
          colspan,
          rowspan: i === node.level ? node.childSize + 1 : colspan,
          isTreeIndex: true,
          hideLeftBorder: i === node.level ? false : true,
          hideRightBorder: bodyCols.length ? true : false
        });
      }
    }
  });
  const headerData = [];
  if (showHeader) {
    headerRows.forEach((headerCols, index) => {
      const headerRowData = [];
      headerCols.forEach((col) => {
        const { key, colspan, rowspan, originalCol: column } = col;
        const isNone = colspan == 0 || rowspan == 0;
        const text = isNone ? "" : getHeaderCellText(column, index);
        headerRowData.push({ key, index, column, text, colspan, rowspan });
      });
      headerData.push(headerRowData);
      if (showTreeIndex) {
        for (let i = depth - 1; i >= 0; i--) {
          headerRowData.unshift({
            key: `_index_th_${index}-${i}`,
            index,
            colspan: i === 0 ? index === 0 ? depth : 0 : 0,
            rowspan: i === 0 ? index === 0 ? headerRows.length : 0 : 0,
            isTreeIndex: true
          });
        }
      }
    });
  }
  const footerData = [];
  if (showSummary && data.length) {
    const footerRowData = [];
    const uSum = getUserSums(summaryMethod, bodyCols, data);
    bodyCols.forEach((col, i) => {
      const { key, dataKey: dKey, originalCol: column } = col;
      const text = uSum == null ? getSumValue(data, dKey, i, sumText) : uSum[i];
      footerRowData.push({ key, column, text, index: 0 });
    });
    footerData.push(footerRowData);
    if (showTreeIndex) {
      for (let i = depth - 1; i >= 0; i--) {
        footerRowData.unshift({
          key: `_index_tf-${i}`,
          index: 0,
          colspan: i === 0 ? depth : 0,
          rowspan: i === 0 ? headerRows.length : 0,
          isTreeIndex: true
        });
      }
    }
  }
  if (showTreeIndex) {
    for (let i = depth - 1; i >= 0; i--) {
      bodyCols.unshift({ key: `_index_${i}`, width: 26 });
    }
  }
  return { headerData, bodyData, footerData, bodyCols };
}
function exportCSV(fileName, headerData, bodyData, footerData) {
  const csvRows = [];
  [...headerData, ...bodyData, ...footerData].forEach((item) => {
    const cells = item.map((d) => {
      const str = d.text ?? "";
      const text = typeof str === "string" ? str.replace(/,/g, "，").replace(/\n/g, "    ") : str;
      if (!d.isTreeCell || !d.indent) {
        return text;
      }
      const indent = Array.from({ length: d.indent }).fill("  ").join("");
      return indent + text;
    });
    csvRows.push(cells.join(","));
  });
  const content = encodeURIComponent(csvRows.join("\n"));
  const a = document.createElement("a");
  a.href = `data:text/csv;charset=utf-8,${content}`;
  a.download = fileName + ".csv";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
function columnsExportFilter(item) {
  if (item.hideInExport) {
    return false;
  }
  return !item.type || !["selection"].includes(item.type);
}
function columnsPrintFilter(item) {
  if (item.hideInPrint) {
    return false;
  }
  return !item.type || !["selection"].includes(item.type);
}
function columnsSettingFilter(item) {
  if (item.hideInSetting) {
    return false;
  }
  return true;
}
export {
  cacheColWidth,
  columnsExportFilter,
  columnsPrintFilter,
  columnsSettingFilter,
  exportCSV,
  getCacheColWidth,
  getCacheCols,
  getCacheColsWidth,
  getCacheSize,
  getCellText,
  getCheckedColumns,
  getColId,
  getColItems,
  getColsCacheKey,
  getColsWidthCacheKey,
  getDefaultFilter,
  getExportBodyNode,
  getExportData,
  getHeaderCellText,
  getInitCacheColumns,
  getInitColumns,
  getOrderItems,
  getPaginationProps,
  getRequestFilters,
  getRequestName,
  getRequestOrders,
  getRequestPages,
  getResponseData,
  getResponseName,
  getResponseResult,
  getRowKey,
  getSizeCacheKey,
  getTableLimit,
  getTablePage,
  getTableSize,
  isAutoAmend,
  mergeProps,
  reloadData,
  sortData
};
