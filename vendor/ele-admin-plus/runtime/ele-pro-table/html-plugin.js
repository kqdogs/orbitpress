import { download } from "../utils/common";
function getTableHtml(params) {
  const { headerData, bodyData, footerData, bodyCols } = params;
  const tdPadding = "padding: 9px 12px;";
  const tableHtml = [
    '<table style="width: 100%;border-collapse: collapse;" border="1">',
    "<colgroup>",
    ...bodyCols.map(
      (c) => c.width == null ? "<col/>" : `<col width="${c.width}"/>`
    ),
    "</colgroup>",
    ...headerData.length ? [
      "<thead>",
      ...headerData.map(
        (item) => [
          "<tr>",
          ...item.map((d) => {
            if (d.rowspan === 0 || d.colspan === 0) {
              return "";
            }
            if (d.isTreeIndex) {
              return `<th colspan="${d.colspan}" rowspan="${d.rowspan}" style="${tdPadding}"></th>`;
            }
            const align = d.column?.headerAlign || d.column?.align || "left";
            return `<td colspan="${d.colspan}" rowspan="${d.rowspan}" style="${tdPadding}text-align: ${align};">${d.text ?? ""}</td>`;
          }),
          "</tr>"
        ].join("")
      ),
      "</thead>"
    ] : [],
    "<tbody>",
    ...bodyData.map(
      (item) => [
        "<tr>",
        ...item.map((d) => {
          if (d.rowspan === 0 || d.colspan === 0) {
            return "";
          }
          if (d.isExpandCell) {
            return `<td colspan="${d.colspan}" rowspan="${d.rowspan}" style="${tdPadding}padding-left: 0;padding-right: 0;">${d.text ?? ""}</td>`;
          }
          if (d.isTreeIndex) {
            return `<td colspan="${d.colspan}" rowspan="${d.rowspan}" style="${tdPadding}padding-left: 0;padding-right: 0;text-align: center;vertical-align: top;${d.hideLeftBorder ? "border-left-color: transparent;" : ""}">${d.text ?? ""}</td>`;
          }
          const align = d.column?.align || "left";
          const tdHtml = [
            `<td colspan="${d.colspan}" rowspan="${d.rowspan}" style="${tdPadding}text-align: ${align};">`
          ];
          if ("expand" === d.column?.type) {
            if (d.text != null && d.text !== "") {
              tdHtml.push(String(d.text));
            } else {
              tdHtml.push(
                `<i style="height: 1em;width: 1em;line-height: 1em;display: inline-flex;justify-content: center;align-items: center;position: relative;fill: currentColor;color: inherit;font-size: inherit;">
                   <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                     <path d="M10 17 24 31 38 17"></path>
                   </svg>
                 </i>`
              );
            }
            tdHtml.push("</td>");
            return tdHtml.join("");
          }
          if (d.isTreeCell) {
            if (d.indent) {
              tdHtml.push(
                `<span style="padding-left: ${d.indent * 16}px;"></span>`
              );
            }
            tdHtml.push(
              `<i style="height: 1em;width: 1em;line-height: 1em;display: inline-flex;justify-content: center;align-items: center;position: relative;fill: currentColor;color: inherit;font-size: inherit;vertical-align: middle;margin-right: 2px;${d.isTreeLeaf ? "visibility: hidden;" : ""}">
                 <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                   <path d="M10 17 24 31 38 17"></path>
                 </svg>
               </i>`
            );
          }
          tdHtml.push(String(d.text ?? ""));
          tdHtml.push("</td>");
          return tdHtml.join("");
        }),
        "</tr>"
      ].join("")
    ),
    "</tbody>",
    ...footerData.length ? [
      "<tfoot>",
      ...footerData.map(
        (item) => [
          "<tr>",
          ...item.map((d) => {
            if (d.rowspan === 0 || d.colspan === 0) {
              return "";
            }
            return `<td colspan="${d.colspan}" rowspan="${d.rowspan}" style="${tdPadding}">${d.isExpandCell ? "" : d.text ?? ""}</td>`;
          }),
          "</tr>"
        ].join("")
      ),
      "</tfoot>"
    ] : [],
    "</table>"
  ].join("");
  return tableHtml;
}
const htmlExportPlugin = function(params) {
  return new Promise((resolve) => {
    const tableHtml = getTableHtml(params);
    download(tableHtml, `${params.fileName}.html`, "text/html;charset=UTF-8");
    resolve();
  });
};
export {
  getTableHtml,
  htmlExportPlugin
};
