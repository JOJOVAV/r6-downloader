// DepotForge — Electron main process
// Owns the OS-level work: spawning DepotDownloader, curl, 7z; filesystem checks; open external URLs.
// Renderer talks to it via the contextBridge exposed in preload.js.

const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const { spawn } = require("node:child_process");

const ROOT = app.isPackaged ? path.dirname(app.getPath("exe")) : __dirname.replace(/[\\/]src[\\/]main$/, "");
const RESOURCES_DIR = path.join(ROOT, "Resources");
const DOWNLOADS_DIR = path.join(ROOT, "Downloads");

// Source URLs are intentionally kept identical to the original HeatedMetal.bat.
// Do not change these — the project is forkable and the upstream link contract must stay intact.
const SOURCES = {
  sevenZip: "https://github.com/DataCluster0/R6TBBatchTool/raw/master/Requirements/7z.exe",
  depotDownloaderLatestApi: "https://api.github.com/repos/SteamRE/DepotDownloader/releases/latest",
  heliosLoader: "https://github.com/JOJOVAV/r6-downloader/raw/refs/heads/main/cracks/HeliosLoader.zip",
  heatedMetalLegacy: "https://github.com/DataCluster0/HeatedMetal/releases/download/0.2.3/HeatedMetal.7z",
  heatedMetalLatestApi: "https://api.github.com/repos/DataCluster0/HeatedMetal/releases/latest",
  dotnetDownload: "https://dotnet.microsoft.com/en-us/download",
  steamSiegePage: "https://store.steampowered.com/app/359550/Rainbow_Six_Siege/",
  discord: "https://discord.gg/7mR9VxBxWd",
  buymeacoffee: "https://www.buymeacoffee.com/DataCluster0",
};

// Rainbow Six Siege depot manifests — values lifted from the original HeatedMetal.bat.
// These are the contract between users and Steam; do not edit without verifying against the upstream BAT.
const BUILDS = {
  y5s3: {
    id: "y5s3",
    name: "Shadow Legacy",
    code: "Y5S3",
    folder: "Y5S3_ShadowLegacy",
    sizeGB: 88.0,
    depots: [
      { id: 377237, manifest: "85893637567200342" },
      { id: 377238, manifest: "4020038723910014041" },
      { id: 359551, manifest: "3089981610366186823" },
    ],
  },
  y5s4: {
    id: "y5s4",
    name: "Neon Dawn",
    code: "Y5S4",
    folder: "Y5S4_NeonDawnHM",
    sizeGB: 57.0,
    depots: [
      { id: 377237, manifest: "3390446325154338855" },
      { id: 377238, manifest: "3175150742361965235" },
      { id: 359551, manifest: "6947060999143280245" },
    ],
  },
  y9s2: {
    id: "y9s2",
    name: "New Blood",
    code: "Y9S2",
    folder: "Y9S2_NewBloodHM",
    sizeGB: 56.0,
    depots: [
      { id: 377237, manifest: "6874184890918352263" },
      { id: 377238, manifest: "3648252944070415883" },
      { id: 359551, manifest: "2171250367116101899" },
    ],
  },
};

const APP_ID = 359550;
let mainWindow = null;
let activeProc = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: "#1a1d20",
    title: "DepotForge",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "..", "preload", "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  mainWindow.loadFile(path.join(__dirname, "..", "renderer", "index.html"));

  mainWindow.webContents.on("render-process-gone", (_e, details) => {
    console.error("[renderer crashed]", details);
  });
  mainWindow.webContents.on("console-message", (_e, level, message, line, src) => {
    if (level >= 2) console.error(`[renderer ${src}:${line}]`, message);
  });
  if (!app.isPackaged) mainWindow.webContents.openDevTools({ mode: "detach" });
}

app.whenReady().then(() => {
  ensureDir(RESOURCES_DIR);
  ensureDir(DOWNLOADS_DIR);
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// ─── Helpers ────────────────────────────────────────────────────────────
function ensureDir(p) {
  try { fs.mkdirSync(p, { recursive: true }); } catch (_) {}
}

function exists(p) {
  try { fs.accessSync(p); return true; } catch (_) { return false; }
}

function sendLog(channel, level, message) {
  if (!mainWindow) return;
  const time = new Date().toTimeString().slice(0, 8);
  mainWindow.webContents.send("log:entry", { time, level, message, channel });
}

// Spawn a child process and stream stdout/stderr lines back to the renderer as log events.
// Returns a promise that resolves with the exit code.
function runProcess(channel, cmd, args, opts = {}) {
  return new Promise((resolve) => {
    sendLog(channel, "info", `> ${cmd} ${args.join(" ")}`);
    const proc = spawn(cmd, args, { cwd: ROOT, shell: false, ...opts });
    activeProc = proc;

    let stdoutBuf = "";
    let stderrBuf = "";
    const flush = (buf, fn) => {
      let i;
      while ((i = buf.indexOf("\n")) !== -1) {
        const line = buf.slice(0, i).replace(/\r$/, "");
        if (line.trim()) fn(line);
        buf = buf.slice(i + 1);
      }
      return buf;
    };

    proc.stdout.on("data", (d) => {
      stdoutBuf += d.toString();
      stdoutBuf = flush(stdoutBuf, (line) => {
        const level = /error|fail/i.test(line) ? "error"
          : /warn/i.test(line) ? "warn"
          : /\b\d+(\.\d+)?%/.test(line) || /downloading|fetching/i.test(line) ? "download"
          : "info";
        sendLog(channel, level, line);
        mainWindow?.webContents.send(`${channel}:stdout`, line);
      });
    });

    proc.stderr.on("data", (d) => {
      stderrBuf += d.toString();
      stderrBuf = flush(stderrBuf, (line) => {
        sendLog(channel, "error", line);
        mainWindow?.webContents.send(`${channel}:stderr`, line);
      });
    });

    proc.on("error", (err) => {
      sendLog(channel, "error", `Process failed to start: ${err.message}`);
      activeProc = null;
      resolve({ code: -1, error: err.message });
    });

    proc.on("close", (code) => {
      if (stdoutBuf.trim()) sendLog(channel, "info", stdoutBuf.trim());
      if (stderrBuf.trim()) sendLog(channel, "error", stderrBuf.trim());
      activeProc = null;
      resolve({ code });
    });
  });
}

async function fetchJSON(url) {
  const https = require("node:https");
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "DepotForge" } }, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        return fetchJSON(res.headers.location).then(resolve, reject);
      }
      let body = "";
      res.on("data", (c) => body += c);
      res.on("end", () => {
        try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
      });
    }).on("error", reject);
  });
}

function downloadFile(url, dest, channel = "deps") {
  // Use curl when available (matches the BAT). curl ships with Windows 10+.
  return runProcess(channel, "curl", ["-L", "--ssl-no-revoke", "-o", dest, url]);
}

// ─── IPC: dependency checks & install ───────────────────────────────────
ipcMain.handle("deps:check", async () => {
  const dotnetOK = await checkDotnet();
  return [
    {
      id: "dotnet",
      name: ".NET 9 SDK",
      icon: "cpu",
      version: dotnetOK.version || "Not detected",
      source: "dotnet.microsoft.com",
      desc: "Runtime DepotForge uses to execute the Steam depot downloader.",
      status: dotnetOK.ok ? "installed" : "missing",
    },
    {
      id: "sevenZip",
      name: "7-Zip CLI",
      icon: "package",
      version: exists(path.join(RESOURCES_DIR, "7z.exe")) ? "bundled" : "Not present",
      source: "github.com/DataCluster0",
      desc: "Extracts mod and dependency archives.",
      status: exists(path.join(RESOURCES_DIR, "7z.exe")) ? "installed" : "missing",
    },
    {
      id: "depot",
      name: "DepotDownloader",
      icon: "download",
      version: exists(path.join(RESOURCES_DIR, "DepotDownloader.dll")) ? "installed" : "Not present",
      source: "github.com/SteamRE",
      desc: "Official Steam depot client. Pulls game files from your owned library.",
      status: exists(path.join(RESOURCES_DIR, "DepotDownloader.dll")) ? "installed" : "missing",
    },
    {
      id: "helios",
      name: "External loader (Helios)",
      icon: "plug",
      version: exists(path.join(RESOURCES_DIR, "HeliosLoader", "HeliosLoader.json")) ? "installed" : "Not present",
      source: "github.com/JOJOVAV (third-party)",
      desc: "Required by the Heated Metal mod. Not signed by the platform. Hash is not verified against an upstream checksum.",
      status: exists(path.join(RESOURCES_DIR, "HeliosLoader", "HeliosLoader.json")) ? "review" : "missing",
      untrusted: true,
    },
  ];
});

function checkDotnet() {
  return new Promise((resolve) => {
    const p = spawn("dotnet", ["--list-sdks"], { shell: true });
    let out = "";
    p.stdout.on("data", (d) => out += d.toString());
    p.on("error", () => resolve({ ok: false }));
    p.on("close", () => {
      const lines = out.split(/\r?\n/).filter(Boolean);
      const versions = lines.map((l) => l.split(" ")[0]).filter(Boolean);
      const has9 = versions.some((v) => parseInt(v.split(".")[0], 10) >= 9);
      const top = versions.sort().pop() || "";
      resolve({ ok: has9, version: top });
    });
  });
}

ipcMain.handle("deps:install", async (_e, depId) => {
  ensureDir(RESOURCES_DIR);
  if (depId === "dotnet") {
    shell.openExternal(SOURCES.dotnetDownload);
    return { ok: true, openedExternal: true };
  }
  if (depId === "sevenZip") {
    sendLog("deps", "info", "Downloading 7-Zip CLI…");
    const tmp = path.join(ROOT, "7z.exe");
    const r = await downloadFile(SOURCES.sevenZip, tmp, "deps");
    if (r.code === 0 && exists(tmp)) {
      fs.renameSync(tmp, path.join(RESOURCES_DIR, "7z.exe"));
      sendLog("deps", "ok", "7-Zip installed.");
      return { ok: true };
    }
    return { ok: false, error: "Download failed" };
  }
  if (depId === "depot") {
    sendLog("deps", "info", "Resolving latest DepotDownloader release…");
    try {
      const release = await fetchJSON(SOURCES.depotDownloaderLatestApi);
      const url = release.assets[0]?.browser_download_url;
      if (!url) throw new Error("No asset URL");
      const tmp = path.join(ROOT, "depot.zip");
      await downloadFile(url, tmp, "deps");
      const sevenZip = path.join(RESOURCES_DIR, "7z.exe");
      if (!exists(sevenZip)) return { ok: false, error: "7-Zip required first" };
      await runProcess("deps", sevenZip, ["x", "-y", `-o${RESOURCES_DIR}`, tmp, "-aoa"]);
      try { fs.unlinkSync(tmp); } catch (_) {}
      sendLog("deps", "ok", "DepotDownloader installed.");
      return { ok: true };
    } catch (e) {
      sendLog("deps", "error", `DepotDownloader install failed: ${e.message}`);
      return { ok: false, error: e.message };
    }
  }
  if (depId === "helios") {
    sendLog("deps", "warn", "Fetching third-party loader. Source is community-maintained and not signed by Steam.");
    const tmp = path.join(ROOT, "HeliosLoader.zip");
    const r = await downloadFile(SOURCES.heliosLoader, tmp, "deps");
    if (r.code !== 0) return { ok: false, error: "Download failed" };
    const sevenZip = path.join(RESOURCES_DIR, "7z.exe");
    if (!exists(sevenZip)) return { ok: false, error: "7-Zip required first" };
    await runProcess("deps", sevenZip, ["x", "-y", `-o${RESOURCES_DIR}`, tmp, "-aoa"]);
    try { fs.unlinkSync(tmp); } catch (_) {}
    sendLog("deps", "ok", "Helios loader extracted to Resources/HeliosLoader.");
    return { ok: true };
  }
  return { ok: false, error: "Unknown dependency" };
});

// ─── IPC: builds & downloads ────────────────────────────────────────────
ipcMain.handle("builds:list", () => Object.values(BUILDS));

ipcMain.handle("builds:installed", () => {
  if (!exists(DOWNLOADS_DIR)) return [];
  const items = [];
  for (const b of Object.values(BUILDS)) {
    const p = path.join(DOWNLOADS_DIR, b.folder);
    if (exists(p)) {
      let bytes = 0;
      try { bytes = dirSize(p); } catch (_) {}
      items.push({
        id: b.id, name: b.name, code: b.code,
        path: p, sizeGB: bytes / 1e9, expectedGB: b.sizeGB,
      });
    }
  }
  return items;
});

function dirSize(p) {
  let total = 0;
  for (const ent of fs.readdirSync(p, { withFileTypes: true })) {
    const full = path.join(p, ent.name);
    if (ent.isDirectory()) total += dirSize(full);
    else { try { total += fs.statSync(full).size; } catch (_) {} }
  }
  return total;
}

ipcMain.handle("download:start", async (_e, { buildId, username, password, twoFactor, parallel, dryRun }) => {
  const build = BUILDS[buildId];
  if (!build) return { ok: false, error: "Unknown build" };
  const dll = path.join(RESOURCES_DIR, "DepotDownloader.dll");
  if (!exists(dll)) return { ok: false, error: "DepotDownloader not installed" };
  const targetDir = path.join(DOWNLOADS_DIR, build.folder);
  ensureDir(targetDir);

  for (const depot of build.depots) {
    mainWindow?.webContents.send("download:depot", { id: depot.id, manifest: depot.manifest });
    const args = [
      dll,
      "-app", String(APP_ID),
      "-depot", String(depot.id),
      "-manifest", depot.manifest,
      "-username", username,
      "-remember-password",
      "-dir", targetDir,
      "-validate",
      "-max-downloads", String(parallel || 8),
    ];
    if (password) args.push("-password", password);
    if (twoFactor) args.push("-mfa", twoFactor);
    if (dryRun) args.push("-manifest-only");

    const r = await runProcess("download", "dotnet", args);
    if (r.code !== 0) {
      sendLog("download", "error", `Depot ${depot.id} exited with code ${r.code}`);
      return { ok: false, depotFailed: depot.id, code: r.code };
    }
  }

  const heliosDir = path.join(RESOURCES_DIR, "HeliosLoader");
  if (exists(heliosDir)) {
    sendLog("download", "info", `Staging HeliosLoader into ${targetDir}`);
    await runProcess("download", "robocopy", [heliosDir, targetDir, "/E", "/NFL", "/NDL", "/NJH", "/NJS"]);
  } else {
    sendLog("download", "warn", "Helios loader not found in Resources/HeliosLoader. Skipping stage step.");
  }

  sendLog("download", "ok", `${build.name} download complete.`);
  return { ok: true, path: targetDir };
});

ipcMain.handle("download:cancel", () => {
  if (activeProc) {
    try { activeProc.kill(); sendLog("download", "warn", "Cancelled by user."); } catch (_) {}
  }
  return { ok: true };
});

// ─── IPC: Heated Metal mod ──────────────────────────────────────────────
ipcMain.handle("mod:install", async (_e, { variant }) => {
  const sevenZip = path.join(RESOURCES_DIR, "7z.exe");
  if (!exists(sevenZip)) return { ok: false, error: "7-Zip required" };

  let url, targetBuild, fallbackDir;
  if (variant === "legacy") {
    url = SOURCES.heatedMetalLegacy;
    targetBuild = BUILDS.y5s3;
    fallbackDir = path.join(RESOURCES_DIR, "HeatedMetal", "Y5S3_ShadowLegacy");
  } else {
    sendLog("mod", "info", "Resolving latest Heated Metal release…");
    try {
      const release = await fetchJSON(SOURCES.heatedMetalLatestApi);
      url = release.assets[0]?.browser_download_url;
      if (!url) throw new Error("No asset URL");
    } catch (e) {
      sendLog("mod", "error", `Could not resolve latest release: ${e.message}`);
      return { ok: false, error: e.message };
    }
    targetBuild = BUILDS.y5s4;
    fallbackDir = path.join(RESOURCES_DIR, "HeatedMetal", "Y5S4_NeonDawnHM");
  }

  const installedBuildDir = path.join(DOWNLOADS_DIR, targetBuild.folder);
  const finalDir = exists(installedBuildDir) ? installedBuildDir : fallbackDir;
  ensureDir(finalDir);

  const tmp = path.join(ROOT, "HeatedMetal.7z");
  sendLog("mod", "download", `Downloading ${url}`);
  const dl = await downloadFile(url, tmp, "mod");
  if (dl.code !== 0 || !exists(tmp)) return { ok: false, error: "Download failed" };

  sendLog("mod", "info", `Extracting into ${finalDir}`);
  const ex = await runProcess("mod", sevenZip, ["x", "-y", `-o${finalDir}`, tmp, "-aoa"]);
  try { fs.unlinkSync(tmp); } catch (_) {}
  if (ex.code !== 0) return { ok: false, error: "Extraction failed" };

  sendLog("mod", "ok", `Heated Metal staged into ${finalDir}.`);
  return { ok: true, path: finalDir };
});

// ─── IPC: verify ────────────────────────────────────────────────────────
ipcMain.handle("verify:run", async (_e, { buildId }) => {
  const build = BUILDS[buildId];
  if (!build) return { ok: false, error: "Unknown build" };
  const dll = path.join(RESOURCES_DIR, "DepotDownloader.dll");
  if (!exists(dll)) return { ok: false, error: "DepotDownloader not installed" };
  const targetDir = path.join(DOWNLOADS_DIR, build.folder);
  if (!exists(targetDir)) return { ok: false, error: "Build directory not found" };

  for (const depot of build.depots) {
    const args = [
      dll,
      "-app", String(APP_ID),
      "-depot", String(depot.id),
      "-manifest", depot.manifest,
      "-dir", targetDir,
      "-validate",
    ];
    const r = await runProcess("verify", "dotnet", args);
    if (r.code !== 0) return { ok: false, depotFailed: depot.id };
  }
  return { ok: true };
});

// ─── IPC: filesystem & external ─────────────────────────────────────────
ipcMain.handle("fs:browse", async () => {
  const r = await dialog.showOpenDialog(mainWindow, { properties: ["openDirectory"] });
  return r.canceled ? null : r.filePaths[0];
});

ipcMain.handle("fs:openFolder", async (_e, p) => {
  if (!p) p = ROOT;
  await shell.openPath(p);
  return { ok: true };
});

ipcMain.handle("external:open", async (_e, key) => {
  const url = SOURCES[key] || key;
  await shell.openExternal(url);
  return { ok: true };
});

ipcMain.handle("app:paths", () => ({
  root: ROOT,
  resources: RESOURCES_DIR,
  downloads: DOWNLOADS_DIR,
  inOneDrive: /OneDrive/i.test(ROOT),
}));

ipcMain.handle("app:sources", () => SOURCES);
