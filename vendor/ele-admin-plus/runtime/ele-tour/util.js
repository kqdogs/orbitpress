function getOffset(el) {
  const { top, left } = el.getBoundingClientRect();
  const { scrollY, scrollX } = el.ownerDocument.defaultView ?? {};
  return {
    top: top + (scrollY ?? 0),
    left: left + (scrollX ?? 0)
  };
}
function getPopperProps(visible, modal, props) {
  const classes = ["ele-tour-popover"];
  if (modal) {
    classes.push("ele-tour-modal");
  }
  if (props && props.popperClass && typeof props.popperClass === "string") {
    classes.push(props.popperClass);
  }
  return {
    trigger: "click",
    placement: "top",
    teleported: false,
    width: modal ? 440 : 290,
    transition: "ele-tour-fast",
    persistent: false,
    effect: "light",
    isPopover: true,
    gpuAcceleration: true,
    ...props,
    visible: visible ?? false,
    popperClass: classes.join(" ")
  };
}
function scrollIntoView(el) {
  if (typeof el["scrollIntoViewIfNeeded"] === "function") {
    el.scrollIntoViewIfNeeded(true);
  } else {
    el.scrollIntoView({ behavior: "instant", block: "nearest" });
  }
}
export {
  getOffset,
  getPopperProps,
  scrollIntoView
};
