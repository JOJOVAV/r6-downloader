# DepotForge

A modern desktop UI on top of the existing **HeatedMetal.bat** Rainbow Six Siege legacy-build downloader. The original terminal flow is preserved verbatim alongside the app; DepotForge simply replaces the prompt-driven menu with a launcher-style interface.

> **DepotForge is a UI fork.** It does **not** replace, host, or modify any of the upstream tools, URLs, or manifest IDs. Everything you see in this UI invokes the same commands the original BAT script does (`dotnet`, `curl`, `7z`, `robocopy`).

---

## Credits & attribution

This project is built **on top of existing work**. The downloader logic, mod content, and external loader are all maintained by other people. Please support them.

| Component | Maintainer | Source |
|-----------|------------|--------|
| `HeatedMetal.bat` (original downloader) | **JVAV** | preserved in this repo |
| Heated Metal mod | **DataCluster0 / ZeroBytes** | <https://github.com/DataCluster0/HeatedMetal> |
| r6-downloader & Helios loader | **JOJOVAV** | <https://github.com/JOJOVAV/r6-downloader> |
| DepotDownloader | **SteamRE** | <https://github.com/SteamRE/DepotDownloader> |
| 7-Zip CLI bundle | **DataCluster0** | <https://github.com/DataCluster0/R6TBBatchTool> |
| .NET 9 SDK | **Microsoft** | <https://dotnet.microsoft.com> |

If you find this project useful, **donate to ZeroBytes**: <https://www.buymeacoffee.com/DataCluster0>.

The DepotForge UI itself is a separate layer added on top — it does not claim authorship over the original project. The upstream HeatedMetal.bat workflow continues to be the source of truth for which depots, manifests, and external components are used.

Discord (community FAQ & support): <https://discord.gg/7mR9VxBxWd>

---

## Requirements

DepotForge automates the same dependency checks the original BAT did. On first launch the **Dependencies** screen will let you install whatever is missing.

- **Windows 10/11** — uses `curl`, `robocopy`, `dotnet`
- **.NET 9 SDK** — required by DepotDownloader (must be installed manually; UI opens the download page)
- **A Steam account that owns Rainbow Six Siege** — Ubisoft + Steam offer it free periodically. The UI links to the Steam store page.

The first three components below are auto-downloaded into `./Resources` when you click *Install*:

- `7z.exe` (from `github.com/DataCluster0/R6TBBatchTool`)
- `DepotDownloader.dll` (latest release from `github.com/SteamRE/DepotDownloader`)
- `HeliosLoader` (from `github.com/JOJOVAV/r6-downloader`) — **third-party, not signed by Steam, no upstream checksum.**

---

## Running

```bash
npm install
npm start
```

That's it. DepotForge launches as an Electron desktop window. The original `HeatedMetal.bat` is kept in the repo root and still works as before — the UI is purely additive.

### Project layout

```
DepotForge/
├── HeatedMetal.bat           # Original downloader by JVAV — UNCHANGED
├── package.json
├── src/
│   ├── main/main.js          # Electron main: spawns dotnet, curl, 7z, robocopy
│   ├── preload/preload.js    # contextBridge — exposes a narrow `window.df` API
│   └── renderer/
│       ├── index.html
│       ├── theme.css         # design tokens (dark/light)
│       ├── app.css           # app-specific tweaks
│       ├── ui.jsx            # UI primitives (Icon, Btn, Card, Modal, etc.)
│       ├── screens.jsx       # 8 screens: Dashboard, Downloader, Installer, …
│       └── app.jsx           # root: routing, state, IPC wiring
├── Resources/                # tools downloaded by the UI (auto-created)
└── Downloads/                # game builds (auto-created)
```

---

## How it works

Every action in the UI maps to the same shell commands the BAT used:

| UI action | Underlying command |
|-----------|---------------------|
| Install 7-Zip | `curl -L https://github.com/DataCluster0/R6TBBatchTool/raw/master/Requirements/7z.exe -o Resources/7z.exe` |
| Install DepotDownloader | `curl -L <latest-release> -o depot.zip` → `7z x depot.zip` |
| Install Helios | `curl -L https://github.com/JOJOVAV/r6-downloader/raw/refs/heads/main/cracks/HeliosLoader.zip` → `7z x` |
| Download a build | `dotnet Resources/DepotDownloader.dll -app 359550 -depot <id> -manifest <id> -username <u> -remember-password -dir Downloads/<folder> -validate -max-downloads <n>` (for each depot) |
| Stage Helios | `robocopy Resources/HeliosLoader Downloads/<folder>` |
| Install Heated Metal | `curl -L <release>.7z` → `7z x` into the build folder |
| Verify a build | DepotDownloader with `-validate` only |

All depot IDs, manifest IDs, and URLs are lifted directly from `HeatedMetal.bat` and live in `src/main/main.js`. **If you fork this project to add new builds, add to those constants — do not edit existing entries.** Other forks may depend on them.

---

## Safety notes

This project downloads and runs code from third-party sources. Some of those sources are not signed by Steam and do not publish checksums DepotForge could verify against.

- **DepotDownloader** is an open-source Steam client maintained by SteamRE. Code is auditable.
- **7-Zip CLI** is the standard 7z standalone executable, bundled by DataCluster0.
- **Heated Metal mod** is a community mod project. The archive ships unsigned.
- **Helios loader** is third-party. **DepotForge cannot verify its integrity** — it records a local hash so you'll be warned if it changes between sessions, but there is no upstream signature to compare against. Review the source code on its repository before launching the modded game.

The UI uses neutral, factual language for these. It does **not** claim "everything is safe" or hide risky components. If you're unsure, read the upstream README on each project before clicking *Install*.

---

## License

MIT for the DepotForge UI code in this repository. Upstream components retain their own licenses — see their respective repositories.
