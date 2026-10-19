function getSideEffects(path, options) {
  const importStyle = options?.importStyle;
  if (!importStyle) {
    return;
  }
  if (importStyle === "css") {
    return `${path}/style/css`;
  }
  return `${path}/style/index`;
}
function getStylePath(namePath, packageName, path) {
  if (!path) {
    return `${packageName}/es/${namePath}`;
  }
  if (path === "/es/core") {
    return `${packageName}/es/${namePath}`;
  }
  if (path === "/lib/core") {
    return `${packageName}/lib/${namePath}`;
  }
  return `${packageName}${path}/${namePath}`;
}
function EleAdminResolver(options) {
  return {
    type: "component",
    resolve: (name) => {
      const { path, exclude } = options || {};
      if (name.match(/^Ele[A-Z]/) && !exclude?.includes?.(name)) {
        const packageName = "ele-admin-plus";
        const namePath = name.replace(/([A-Z])/g, " $1").trim().split(" ").join("-").toLowerCase();
        const stylePath = getStylePath(namePath, packageName, path);
        if (!path || path === "/es/core" || path === "/lib/core") {
          return {
            name,
            from: `${packageName}${path ?? "/es"}`,
            sideEffects: getSideEffects(stylePath, options)
          };
        }
        return {
          from: `${packageName}${path}/${namePath}/index`,
          sideEffects: getSideEffects(stylePath, options)
        };
      }
    }
  };
}
export {
  EleAdminResolver
};
