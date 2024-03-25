function r(e) {
  return new Worker(
    import.meta.url.split("/").slice(0, -1).join("/") + "/assets/html.worker-Dm9KJ4MD.js",
    {
      name: e == null ? void 0 : e.name
    }
  );
}
export {
  r as default
};
