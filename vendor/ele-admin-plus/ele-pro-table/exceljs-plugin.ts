import ExcelJS from 'exceljs';
import { download } from '../utils/common';
import type { ExportPlugin, BeforeExportParams } from './types';

/**
 * 导出生成 ExcelJS Workbook
 * @param params 参数
 */
export function getExportWorkbook(params: BeforeExportParams) {
  const { headerData, bodyData, footerData, bodyCols } = params;
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Sheet1');
  // 遍历数据
  const sheetRows: string[][] = [];
  const sheetStyles: Record<string, any>[][] = [];
  const sheetMerges: number[][] = [];
  const sheetRowHeight: number[] = [];
  [...headerData, ...bodyData, ...footerData].forEach((item, index) => {
    const sheetCols: Array<any> = [];
    const rowStyles: Record<string, any>[] = [];
    item.forEach((d, colIndex) => {
      if (!d.isTreeCell || !d.indent) {
        sheetCols.push(d.text ?? '');
      } else {
        // 树表格缩进
        const gap = Array.from({ length: d.indent }).fill('  ').join('');
        sheetCols.push(gap + (d.text ?? ''));
      }
      // 单元格样式
      rowStyles.push({
        font: { size: 12, bold: index < headerData.length },
        alignment: {
          vertical: d.isTreeIndex && d.rowspan !== 1 ? 'top' : 'middle',
          horizontal: d.isExpandCell ? 'left' : d.column?.align || 'left',
          wrapText: d.isExpandCell ? true : false,
          indent: d.isExpandCell ? 1 : 0
        },
        border: {
          top: { style: 'thin' },
          left: d.hideLeftBorder ? {} : { style: 'thin' },
          bottom: { style: 'thin' },
          right: d.hideRightBorder ? {} : { style: 'thin' }
        }
      });
      // 单元格合并
      if ((d.rowspan && d.rowspan > 1) || (d.colspan && d.colspan > 1)) {
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
    // 行高
    const expandCell = item.find((d) => d.isExpandCell && d.colspan);
    const lines = String(expandCell?.text ?? '').split('\n').length || 1;
    sheetRowHeight.push(lines * 20);
  });
  // 添加到表格
  sheet.addRows(sheetRows).forEach((row, index) => {
    row.eachCell({ includeEmpty: true }, (cell, colIndex) => {
      Object.assign(cell, sheetStyles[index][colIndex - 1]);
    });
    row.height = sheetRowHeight[index];
  });
  sheetMerges.forEach((merges) => {
    sheet.mergeCells(merges as any);
  });
  // 列宽
  bodyCols.forEach((col, colIndex) => {
    const w = col.width ?? col.minWidth;
    sheet.getColumn(colIndex + 1).width = w == null ? void 0 : w / 8;
  });
  return workbook;
}

/**
 * 使用 ExcelJS 进行导出的插件
 */
export const exceljsExportPlugin: ExportPlugin = function (params) {
  return new Promise((resolve, reject) => {
    getExportWorkbook(params)
      .xlsx.writeBuffer()
      .then((data) => {
        download(data, `${params.fileName}.xlsx`);
        resolve();
      })
      .catch((e) => {
        console.error(e);
        reject(e);
      });
  });
};
