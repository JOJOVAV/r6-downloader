// DepotForge — preload bridge. Exposes a narrow, typed API to the renderer.
// Renderer can never touch require() or node APIs directly.

const { contextBridge, ipcRenderer } = require("electron");

const invoke = (channel, payload) => ipcRenderer.invoke(channel, payload);

contextBridge.exposeInMainWorld("df", {
  paths: () => invoke("app:paths"),
  sources: () => invoke("app:sources"),

  deps: {
    check: () => invoke("deps:check"),
    install: (id) => invoke("deps:install", id),
  },

  builds: {
    list: () => invoke("builds:list"),
    installed: () => invoke("builds:installed"),
  },

  download: {
    start: (opts) => invoke("download:start", opts),
    cancel: () => invoke("download:cancel"),
    onDepot: (cb) => {
      const l = (_e, payload) => cb(payload);
      ipcRenderer.on("download:depot", l);
      return () => ipcRenderer.removeListener("download:depot", l);
    },
  },

  mod: {
    install: (opts) => invoke("mod:install", opts),
  },

  verify: {
    run: (opts) => invoke("verify:run", opts),
  },

  fs: {
    browseDir: () => invoke("fs:browse"),
    openFolder: (p) => invoke("fs:openFolder", p),
  },

  external: {
    open: (keyOrUrl) => invoke("external:open", keyOrUrl),
  },

  log: {
    onEntry: (cb) => {
      const l = (_e, entry) => cb(entry);
      ipcRenderer.on("log:entry", l);
      return () => ipcRenderer.removeListener("log:entry", l);
    },
  },
});
