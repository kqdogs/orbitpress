import { TableV2SortOrder } from "element-plus";
import { omit, getValue, mapTree, findTree, eachTree, contentIsEllipsis } from "../utils/common";
import { getColFixedNumber } from "../ele-data-table/util";
function getRowHeight(size, rowHeight) {
  if (rowHeight != null && rowHeight > 0) {
    return rowHeight;
  }
  if (size === "small") {
    return 34;
  }
  if (size === "large") {
    return 50;
  }
  return 42;
}
function getColKey(column) {
  if (!column) {
    return "";
  }
  return column.columnKey ?? column.property ?? column.prop ?? "";
}
function getNumberSize(size, defaultValue) {
  if (typeof size === "number") {
    if (size < 0) {
      return defaultValue;
    }
    return size;
  }
  if (size == null || size === "" || size === "auto" || size.endsWith("%")) {
    return defaultValue;
  }
  const num = Number.parseInt(size);
  return isNaN(num) ? defaultValue : num;
}
function getTableHeight(height, maxHeight, minHeight, wrapHeight) {
  const max = getNumberSize(maxHeight);
  const h = getNumberSize(height);
  if (h != null) {
    return max == null || h <= max ? h : max;
  }
  return Math.max(wrapHeight, minHeight);
}
function computeFixedCols(cols) {
  let lastFixedLeftIndex;
  let firstFixedRightIndex;
  cols.forEach((col, i) => {
    const c = col.originalCol;
    if (c) {
      if (c.fixed === "left" || c.fixed === true) {
        lastFixedLeftIndex = i;
      } else if (firstFixedRightIndex == null && c.fixed === "right") {
        firstFixedRightIndex = i;
      }
    }
  });
  if (lastFixedLeftIndex != null) {
    cols[lastFixedLeftIndex].isFixedLeftLast = true;
  }
  if (firstFixedRightIndex != null) {
    cols[firstFixedRightIndex].isFixedRightFirst = true;
  }
}
function generateRowCols(columns, cols, rows, level, parentRowCol) {
  if (rows[level] == null) {
    rows[level] = [];
  }
  columns.forEach((col) => {
    const colKey = getColKey(col);
    const originalCol = omit(col, ["children"]);
    if (parentRowCol != null && parentRowCol.originalCol != null) {
      originalCol.fixed = parentRowCol.originalCol.fixed;
    }
    const rowCol = { key: colKey, originalCol };
    if (col.children && col.children.length) {
      rowCol.rowspan = 1;
      rowCol.colspan = col.children.length;
      generateRowCols(col.children, cols, rows, level + 1, rowCol);
      if (parentRowCol && parentRowCol.colspan != null) {
        parentRowCol.colspan += rowCol.colspan - 1;
      }
    } else {
      rowCol.colspan = 1;
      const bodyCol = {
        width: getNumberSize(col.width),
        minWidth: getNumberSize(col.minWidth, 80),
        key: colKey,
        dataKey: col.property ?? col.prop,
        originalCol
      };
      cols.push(bodyCol);
    }
    rows[level].push(rowCol);
  });
}
function analyseColumns(columns) {
  const cols = [];
  const rows = [];
  if (!columns || !columns.length) {
    return { cols, rows };
  }
  const sortedCols = [...columns];
  sortedCols.sort(
    (a, b) => getColFixedNumber(a.fixed) - getColFixedNumber(b.fixed)
  );
  generateRowCols(sortedCols, cols, rows, 0);
  computeFixedCols(cols);
  rows.forEach((row, i) => {
    row.forEach((col) => {
      if (col != null && col.rowspan == null) {
        col.rowspan = rows.length - i;
      }
    });
  });
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      const row = rows[i][j];
      if (row.colspan != null && row.colspan > 1) {
        for (let n = 1; n < row.colspan; n++) {
          rows[i].splice(j + n, 0, { colspan: 0, rowspan: 1 });
        }
      }
      if (row.rowspan != null && row.rowspan > 1) {
        for (let n = 1; n < row.rowspan; n++) {
          rows[i + n].splice(j, 0, {
            colspan: 1,
            rowspan: 0,
            originalCol: row.originalCol
          });
        }
      }
    }
  }
  rows.forEach((row) => {
    computeFixedCols(row);
  });
  return { cols, rows };
}
function getColWidth(col, tableWidth, colsWidth, colsMinWidth) {
  if (col.width != null) {
    return col.width;
  }
  if (col.minWidth == null) {
    return 0;
  }
  const surplusWidth = tableWidth - colsWidth;
  if (surplusWidth <= colsMinWidth) {
    return col.minWidth;
  }
  return Math.floor(col.minWidth / colsMinWidth * surplusWidth);
}
function computeFixedPositions(cols, colSizes) {
  let left = 0;
  cols.forEach((col, i) => {
    const c = col.originalCol;
    if (c && (c.fixed === "left" || c.fixed === true)) {
      colSizes[i].fixedLeft = left + "px";
      if (colSizes[i].width) {
        left += colSizes[i].width;
      }
    }
  });
  let right = 0;
  for (let i = cols.length - 1; i >= 0; i--) {
    const c = cols[i].originalCol;
    if (c && c.fixed === "right") {
      colSizes[i].fixedRight = right + "px";
      if (colSizes[i].width) {
        right += colSizes[i].width;
      }
    }
  }
}
function computeColSizes(cols, rows, wrapWidth) {
  let isFixed = true;
  let colsSumWidth = 0;
  let colsSumMinWidth = 0;
  cols.forEach((col) => {
    if (col.width == null) {
      isFixed = false;
      if (col.minWidth != null) {
        colsSumMinWidth += col.minWidth;
      }
      return;
    }
    colsSumWidth += col.width;
  });
  const tableWidth = isFixed ? Math.min(wrapWidth, colsSumWidth) : wrapWidth;
  const colSizes = [];
  let sumWidth = 0;
  cols.forEach((col, i) => {
    const width = getColWidth(col, tableWidth, colsSumWidth, colsSumMinWidth);
    sumWidth += width;
    colSizes[i] = { width };
    if (i === cols.length - 1 && tableWidth > sumWidth) {
      colSizes[i].width = width + tableWidth - sumWidth;
      sumWidth = tableWidth;
    }
  });
  computeFixedPositions(cols, colSizes);
  const rowSizes = [];
  rows.forEach((row) => {
    const sizes = [];
    row.forEach((col, colIndex) => {
      if (!cols[colIndex] || !col.colspan) {
        sizes[colIndex] = { width: 0 };
        return;
      }
      let width = colSizes[colIndex].width || 0;
      if (col.colspan > 1) {
        const end = colIndex + col.colspan;
        for (let i = colIndex + 1; i < end; i++) {
          if (colSizes[i] && colSizes[i].width) {
            width += colSizes[i].width;
          }
        }
      }
      sizes[colIndex] = { width };
    });
    rowSizes.push(sizes);
    computeFixedPositions(row, sizes);
  });
  return { width: tableWidth, colSizes, rowSizes, sumWidth };
}
function colSizesIsChanged(colSizes, newSizes) {
  if (colSizes.length !== newSizes.length) {
    return true;
  }
  for (let i = 0; i < colSizes.length; i++) {
    if (colSizes[i].width !== newSizes[i].width) {
      return true;
    }
  }
  return false;
}
function getTableColumns(bodyCols, colSizes) {
  const columns = bodyCols.map((col, i) => {
    return {
      title: col.originalCol ? col.originalCol.label : void 0,
      width: colSizes[i].width,
      key: col.key,
      dataKey: col.dataKey
    };
  });
  return columns.filter((col) => !!col.width);
}
function transformTableData(data, hasExpandCol, childrenName, hasChildrenName, rowKey, selectable) {
  if (!data || !data.length) {
    return [];
  }
  if (hasExpandCol) {
    return data.map((d, i) => {
      const key = getValue(d, rowKey) ?? i;
      const temp = {
        rowId: `_expand_${key}`,
        rowIndex: i,
        rowData: d,
        isExpandRow: true
      };
      return {
        rowId: key,
        rowIndex: i,
        rowData: d,
        isDisabled: !(selectable == null || selectable(d, index) === true),
        children: [temp]
      };
    });
  }
  let index = -1;
  return mapTree(
    data,
    (d) => {
      index++;
      return {
        rowId: getValue(d, rowKey) ?? index,
        rowIndex: index,
        rowData: d,
        isDisabled: !(selectable == null || selectable(d, index) === true),
        hasChildren: d[hasChildrenName] === true
      };
    },
    childrenName
  );
}
function getRowByKey(key, data, rowKey, childrenField) {
  if (rowKey == null) {
    return findTree(data, (d) => d.rowId === key && !d.isExpandRow);
  }
  return findTree(data, (d) => getValue(d, rowKey) === key, childrenField);
}
function getKeysAndList(data, rowKey, childrenField) {
  const keys = [];
  const list = [];
  eachTree(
    data,
    (d) => {
      const flag = rowKey == null;
      if (!flag || !d.isExpandRow) {
        keys.push(flag ? d.rowId : getValue(d, rowKey));
        list.push(d);
      }
    },
    childrenField
  );
  return [keys, list];
}
function isAutoRowHeight(hasExpandCol, bodyCols, showOverflowTooltip) {
  if (hasExpandCol) {
    return true;
  }
  let isAllEllipsis = true;
  for (const bodyCol of bodyCols) {
    const col = bodyCol.originalCol;
    if (col && col.type !== "selection" && col.type !== "expand") {
      if (col.showOverflowTooltip == null) {
        isAllEllipsis = false;
      } else if (col.showOverflowTooltip === false) {
        return true;
      }
    }
  }
  if (isAllEllipsis) {
    return false;
  }
  return showOverflowTooltip == null || showOverflowTooltip === false;
}
function CellRender(props, ctx) {
  if (typeof props.render === "function" && props.params != null) {
    const node = props.render(...props.params);
    if (node != null) {
      return Array.isArray(node) ? node : [node];
    }
  }
  return ctx.slots.default?.();
}
function getSortBy(current, col) {
  const key = getColKey(col);
  if (current == null || current.order == null || current.key !== key) {
    return { key, order: TableV2SortOrder.ASC };
  }
  if (current.order === TableV2SortOrder.DESC) {
    return;
  }
  return { key, order: TableV2SortOrder.DESC };
}
function getSortOrder(order) {
  if (order === "ascending") {
    return TableV2SortOrder.ASC;
  }
  if (order === "descending") {
    return TableV2SortOrder.DESC;
  }
}
function getOrderValue(sort) {
  if (sort != null) {
    if (sort === TableV2SortOrder.ASC) {
      return "ascending";
    }
    if (sort === TableV2SortOrder.DESC) {
      return "descending";
    }
  }
}
function getDefaultSort(defaultSort) {
  if (!defaultSort) {
    return;
  }
  const { prop, order } = defaultSort;
  if (!prop || !order || !["ascending", "descending"].includes(order)) {
    return;
  }
  return {
    key: prop,
    order: order === "ascending" ? TableV2SortOrder.ASC : TableV2SortOrder.DESC
  };
}
function getDefaultSorter(defaultSort, columns) {
  if (!defaultSort) {
    return;
  }
  const { prop, order } = defaultSort;
  const col = findTree(columns, (c) => c.prop === prop);
  return { prop, order, column: col };
}
function getDefaultFiltered(columns) {
  const filtered = {};
  eachTree(columns, (col) => {
    const key = getColKey(col);
    if (key && col.filteredValue != null && col.filteredValue.length) {
      filtered[key] = col.filteredValue;
    }
  });
  return filtered;
}
function getColFiltered(col, filtered) {
  if (!col) {
    return;
  }
  if (!filtered) {
    return col.filteredValue;
  }
  const key = getColKey(col);
  if (!key) {
    return col.filteredValue;
  }
  return filtered[key] ?? col.filteredValue;
}
function getSelectableFunction(cols) {
  for (const bodyCol of cols) {
    const c = bodyCol.originalCol;
    if (c && c.type === "selection") {
      return typeof c.selectable === "function" ? c.selectable : null;
    }
  }
}
function getTreeProps(treeProps) {
  const { children, hasChildren } = treeProps || {};
  return {
    childrenName: children || "children",
    hasChildrenName: hasChildren || "hasChildren"
  };
}
function getIndexValue(rowIndex, index, pageIndex) {
  if (index == null) {
    return (pageIndex ?? 1) + rowIndex;
  }
  if (typeof index === "function") {
    return index(rowIndex);
  }
  return index + rowIndex;
}
function getCellSpan(params, spanMethod) {
  const span = { rowspan: 1, colspan: 1 };
  const type = params.column?.type;
  if ((!type || !["index", "selection", "expand"].includes(type)) && typeof spanMethod === "function") {
    const result = spanMethod(params);
    if (result != null) {
      if (Array.isArray(result)) {
        const [rowspan, colspan] = result;
        if (rowspan != null) {
          span.rowspan = rowspan;
        }
        if (colspan != null) {
          span.colspan = colspan;
        }
      } else {
        if (result.rowspan != null) {
          span.rowspan = result.rowspan;
        }
        if (result.colspan != null) {
          span.colspan = result.colspan;
        }
      }
    }
  }
  return span;
}
function getUserSums(summaryMethod, bodyCols, data) {
  if (typeof summaryMethod !== "function" || bodyCols == null || data == null) {
    return;
  }
  const columns = bodyCols.map((col) => {
    return { ...col.originalCol || {}, property: col.dataKey };
  });
  return summaryMethod({ columns, data });
}
function getSumValue(data, prop, index, sumText) {
  if (index === 0) {
    return sumText ?? "Sum";
  }
  if (!data || !prop) {
    return "";
  }
  let sum = 0;
  for (const item of data) {
    const val = Number(getValue(item, prop));
    if (Number.isNaN(val)) {
      return "";
    }
    sum += val;
  }
  return String(sum);
}
function getColumnByKey(columns, key, dataKey) {
  let column = void 0;
  if (columns != null && key != null) {
    eachTree(columns, (col) => {
      if (dataKey != null) {
        if (col.property === dataKey || col.prop === dataKey) {
          column = col;
          return false;
        }
      } else if (getColKey(col) === key) {
        column = col;
        return false;
      }
    });
  }
  return column;
}
function floorSize(size) {
  const floor = Math.floor(size);
  if (size - floor < 1e-3) {
    return floor;
  }
  return size;
}
function cellIsOverflow(cell) {
  const cellChild = cell.querySelector(".ele-table-cell");
  return contentIsEllipsis(cellChild, "horizontal");
}
function getSortCompareValue(sortMethod, a, b, prop) {
  if (sortMethod) {
    return sortMethod(a.rowData, b.rowData);
  }
  if (!prop) {
    return a.rowIndex - b.rowIndex;
  }
  const aValue = getValue(a.rowData, prop);
  const bValue = getValue(b.rowData, prop);
  if (aValue < bValue) {
    return -1;
  }
  if (aValue > bValue) {
    return 1;
  }
  return 0;
}
export {
  CellRender,
  analyseColumns,
  cellIsOverflow,
  colSizesIsChanged,
  computeColSizes,
  computeFixedCols,
  computeFixedPositions,
  floorSize,
  generateRowCols,
  getCellSpan,
  getColFiltered,
  getColKey,
  getColWidth,
  getColumnByKey,
  getDefaultFiltered,
  getDefaultSort,
  getDefaultSorter,
  getIndexValue,
  getKeysAndList,
  getNumberSize,
  getOrderValue,
  getRowByKey,
  getRowHeight,
  getSelectableFunction,
  getSortBy,
  getSortCompareValue,
  getSortOrder,
  getSumValue,
  getTableColumns,
  getTableHeight,
  getTreeProps,
  getUserSums,
  isAutoRowHeight,
  transformTableData
};
