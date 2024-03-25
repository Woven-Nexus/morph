function r(e) {
  return new Worker(
    import.meta.url.split("/").slice(0, -1).join("/") + "/assets/json.worker-DMGoPdGi.js",
    {
      name: e == null ? void 0 : e.name
    }
  );
}
export {
  r as default
};
