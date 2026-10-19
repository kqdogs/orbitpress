import ExcelJS from "exceljs";
import { download } from "../utils/common";
function getExportWorkbook(params) {
  const { headerData, bodyData, footerData, bodyCols } = params;
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Sheet1");
  const sheetRows = [];
  const sheetStyles = [];
  const sheetMerges = [];
  const sheetRowHeight = [];
  [...headerData, ...bodyData, ...footerData].forEach((item, index) => {
    const sheetCols = [];
    const rowStyles = [];
    item.forEach((d, colIndex) => {
      if (!d.isTreeCell || !d.indent) {
        sheetCols.push(d.text ?? "");
      } else {
        const gap = Array.from({ length: d.indent }).fill("  ").join("");
        sheetCols.push(gap + (d.text ?? ""));
      }
      rowStyles.push({
        font: { size: 12, bold: index < headerData.length },
        alignment: {
          vertical: d.isTreeIndex && d.rowspan !== 1 ? "top" : "middle",
          horizontal: d.isExpandCell ? "left" : d.column?.align || "left",
          wrapText: d.isExpandCell ? true : false,
          indent: d.isExpandCell ? 1 : 0
        },
        border: {
          top: { style: "thin" },
          left: d.hideLeftBorder ? {} : { style: "thin" },
          bottom: { style: "thin" },
          right: d.hideRightBorder ? {} : { style: "thin" }
        }
      });
      if (d.rowspan && d.rowspan > 1 || d.colspan && d.colspan > 1) {
        sheetMerges.push([
          index + 1,
          colIndex + 1,
          index + (d.rowspan || 1),
          colIndex + (d.colspan || 1)
        ]);
      }
    });
    sheetRows.push(sheetCols);
    sheetStyles.push(rowStyles);
    const expandCell = item.find((d) => d.isExpandCell && d.colspan);
    const lines = String(expandCell?.text ?? "").split("\n").length || 1;
    sheetRowHeight.push(lines * 20);
  });
  sheet.addRows(sheetRows).forEach((row, index) => {
    row.eachCell({ includeEmpty: true }, (cell, colIndex) => {
      Object.assign(cell, sheetStyles[index][colIndex - 1]);
    });
    row.height = sheetRowHeight[index];
  });
  sheetMerges.forEach((merges) => {
    sheet.mergeCells(merges);
  });
  bodyCols.forEach((col, colIndex) => {
    const w = col.width ?? col.minWidth;
    sheet.getColumn(colIndex + 1).width = w == null ? void 0 : w / 8;
  });
  return workbook;
}
const exceljsExportPlugin = function(params) {
  return new Promise((resolve, reject) => {
    getExportWorkbook(params).xlsx.writeBuffer().then((data) => {
      download(data, `${params.fileName}.xlsx`);
      resolve();
    }).catch((e) => {
      console.error(e);
      reject(e);
    });
  });
};
export {
  exceljsExportPlugin,
  getExportWorkbook
};
