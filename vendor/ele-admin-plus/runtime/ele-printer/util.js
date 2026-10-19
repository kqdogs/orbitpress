import { onBeforeUnmount } from "vue";
import { useTimer } from "../utils/hook";
import { escape } from "../utils/common";
const printContainerId = "ele-printer-container";
const printFrameId = "ele-printer-iframe";
const printingClass = "ele-printing";
let printIdNum = 0;
function mergeOptions(options, userOptions) {
  if (options == null) {
    return userOptions;
  }
  return Object.assign({}, options, userOptions);
}
function getPrintContainer() {
  const container = document.getElementById(printContainerId);
  if (container) {
    return container;
  }
  const elem = document.createElement("div");
  elem.id = printContainerId;
  document.body.appendChild(elem);
  return elem;
}
function removePrintFrame() {
  const pFrame = document.getElementById(printFrameId);
  if (pFrame) {
    const url = pFrame.getAttribute("src");
    if (pFrame.parentNode) {
      pFrame.parentNode.removeChild(pFrame);
    }
    if (url) {
      try {
        window.URL.revokeObjectURL(url);
      } catch (e) {
        console.error(e);
      }
    }
  }
}
function getPrintFrame() {
  removePrintFrame();
  const elem = document.createElement("iframe");
  elem.id = printFrameId;
  elem.style.width = "66px";
  elem.style.height = "66px";
  elem.style.position = "fixed";
  elem.style.left = "-666px";
  elem.style.top = "-666px";
  document.body.appendChild(elem);
  elem.focus();
  return elem;
}
function getOptionCss(opt) {
  const css = ["@page {"];
  if (opt.margin != null && opt.margin !== "") {
    const v = typeof opt.margin === "number" ? `${opt.margin}px` : opt.margin;
    css.push(`margin: ${escape(v)};`);
  }
  if (opt.direction != null && opt.direction !== "") {
    css.push(`size: ${escape(opt.direction)};`);
  }
  if (opt.orientation != null && opt.orientation !== "") {
    css.push(`page-orientation: ${escape(opt.orientation)};`);
  }
  css.push("}");
  return css.join(" ");
}
function initFormEl(containerEl) {
  Array.from(containerEl.querySelectorAll("input")).forEach(
    (el) => {
      if (el.value === "") {
        const type = el.getAttribute("type");
        if (type && ["button", "submit", "reset"].includes(type)) {
          return;
        }
      }
      el.setAttribute("value", el.value);
    }
  );
  Array.from(containerEl.querySelectorAll("textarea")).forEach(
    (el) => {
      el.innerText = el.value;
    }
  );
}
function doPrintOnFrame(opt, printId, timeout) {
  const pFrame = getPrintFrame();
  const pWin = pFrame.contentWindow;
  if (!pWin) {
    return;
  }
  pWin.focus();
  const pDoc = pFrame.contentDocument || pWin.document;
  if (!pDoc) {
    return;
  }
  initFormEl(getPrintContainer());
  const printOption = opt.options ? `JSON.parse(${JSON.stringify(JSON.stringify(opt.options))})` : "";
  const printJsStr = `window.print(${printOption});
    window.parent.postMessage('elePrintDone_${Number(printId)}', '*');`;
  const printJsFuncStr = `setTimeout(function() { ${printJsStr} }, ${Number(timeout)});`;
  const printTitle = opt.title ? JSON.stringify(String(opt.title)) : void 0;
  const optHtml = `
  <style type="text/css" media="print">
    ${getOptionCss(opt)}
  </style>
  <script>
    const $html = document.documentElement;
    if($html && $html.classList && $html.classList.add) {
      $html.classList.add('${printingClass}');
    }
    window.onload = function() {
      if(${printTitle == null ? 0 : 1}) {
        document.title = ${printTitle};
      }
      ${printJsFuncStr}
    };
  <\/script>
  `;
  const content = document.documentElement.outerHTML.replace(/<script/g, '<textarea style="display:none;" ').replace(/<\/script>/g, "</textarea>").replace(/<\/html>/, `${optHtml}</html>`);
  pDoc.open();
  pDoc.write(`<!DOCTYPE html>${content}`);
  pDoc.close();
  return pWin;
}
function usePrinter(done) {
  printIdNum++;
  const printId = printIdNum;
  const printTimeout = 500;
  const [startPrintTimer] = useTimer(printTimeout);
  const doPrint = (option, target) => {
    if (target === "_iframe") {
      doPrintOnFrame(option, printId, printTimeout);
      return;
    }
    const $html = document.documentElement;
    if (!$html) {
      done && done();
      return;
    }
    $html.classList.add(printingClass);
    const elem = document.createElement("style");
    elem.setAttribute("type", "text/css");
    elem.setAttribute("media", "print");
    elem.innerHTML = getOptionCss(option);
    document.body.appendChild(elem);
    const title = document.title;
    if (option.title != null && option.title !== "") {
      document.title = option.title;
    }
    startPrintTimer(() => {
      window.print(option.options);
      startPrintTimer(() => {
        $html.classList.remove(printingClass);
        document.body.removeChild(elem);
        if (option.title != null) {
          document.title = title;
        }
        done && done();
      });
    });
  };
  const handleMessage = (e) => {
    if (e.data === `elePrintDone_${printId}`) {
      startPrintTimer(() => {
        removePrintFrame();
        done && done();
      });
    }
  };
  onBeforeUnmount(() => {
    window.removeEventListener("message", handleMessage);
  });
  window.addEventListener("message", handleMessage);
  return doPrint;
}
function printPdf(option) {
  const pFrame = getPrintFrame();
  pFrame.onload = () => {
    const url = pFrame.getAttribute("src");
    if (!url) {
      return;
    }
    pFrame.focus();
    try {
      pFrame.contentWindow && pFrame.contentWindow.print(option.options);
      option.done && option.done();
      try {
        window.URL.revokeObjectURL(url);
      } catch (e) {
        console.error(e);
      }
    } catch (e) {
      console.error(e);
      if (!option.arraybuffer && option.url) {
        try {
          window.URL.revokeObjectURL(url);
        } catch (e2) {
          console.error(e2);
        }
        window.open(option.url);
      } else {
        window.open(url);
      }
      option.done && option.done();
    }
  };
  const doPrint = (buffer) => {
    const blob = new window.Blob([buffer], { type: "application/pdf" });
    if (window.navigator && window.navigator["msSaveOrOpenBlob"]) {
      window.navigator["msSaveOrOpenBlob"](blob, "print.pdf");
      option.done && option.done();
      return;
    }
    pFrame.setAttribute("src", window.URL.createObjectURL(blob));
  };
  if (option.arraybuffer) {
    doPrint(option.arraybuffer);
    return;
  }
  if (option.url) {
    const req = new window.XMLHttpRequest();
    req.open("GET", option.url, true);
    req.responseType = "arraybuffer";
    req.onload = () => {
      if ([200, 201].indexOf(req.status) !== -1) {
        doPrint(req.response);
        return;
      }
      option.error && option.error(req.status, req.statusText);
    };
    req.send();
  }
}
export {
  getPrintContainer,
  mergeOptions,
  printContainerId,
  printFrameId,
  printPdf,
  printingClass,
  usePrinter
};
