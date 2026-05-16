// DepotForge — root component. Wires the sidebar, header, modal, and screens to the IPC bridge.

const SETTINGS_KEY = "depotforge.settings.v1";

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) { return null; }
};
const saveSettings = (s) => {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch (_) {}
};

const DEFAULT_SETTINGS = {
  parallel: 8,
  autoVerify: false,
  reducedMotion: false,
  theme: "dark",
  lastUsername: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "DEPS_SET":
      return { ...state, deps: action.deps };
    case "BUILDS_SET":
      return { ...state, builds: action.builds };
    case "PATHS_SET":
      return { ...state, paths: action.paths };
    case "SETTING": {
      const settings = { ...state.settings, [action.key]: action.value };
      saveSettings(settings);
      return { ...state, settings };
    }
    case "RESET_SETTINGS":
      saveSettings(DEFAULT_SETTINGS);
      return { ...state, settings: { ...DEFAULT_SETTINGS } };

    case "DOWNLOAD_START":
      return {
        ...state,
        download: {
          active: true, pct: 0, step: "Spawning DepotDownloader…",
          build: action.build, depot: action.build.depots[0].id,
          manifest: action.build.depots[0].manifest, lastError: null,
        },
      };
    case "DOWNLOAD_DEPOT":
      return { ...state, download: { ...state.download, depot: action.depot, manifest: action.manifest, step: `Downloading depot ${action.depot}` } };
    case "DOWNLOAD_PCT":
      return { ...state, download: { ...state.download, pct: action.pct } };
    case "DOWNLOAD_DONE":
      return {
        ...state,
        download: { ...state.download, active: false, pct: 100, step: "Complete" },
        lastOp: { label: `${action.build.name} downloaded`, when: "Just now" },
      };
    case "DOWNLOAD_FAIL":
      return {
        ...state,
        download: { ...state.download, active: false, lastError: action.error, step: "Failed" },
        lastOp: { label: "Download failed", when: "Just now" },
      };
    case "DOWNLOAD_CANCEL":
      return { ...state, download: { ...state.download, active: false, step: "Cancelled" } };

    default:
      return state;
  }
}

function App() {
  const persisted = loadSettings();
  const [route, setRoute] = React.useState("dashboard");
  const [modal, setModal] = React.useState(null);
  const [logs, setLogs] = React.useState([]);

  const [state, dispatch] = React.useReducer(reducer, {
    deps: [], builds: [], paths: null,
    settings: { ...DEFAULT_SETTINGS, ...(persisted || {}) },
    lastOp: { label: "Idle", when: "—" },
    download: { active: false, pct: 0, step: "Idle", build: null, depot: "—", manifest: "—", lastError: null },
  });

  // Apply theme
  React.useEffect(() => {
    let theme = state.settings.theme;
    if (theme === "system") {
      theme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    document.documentElement.dataset.theme = theme;
  }, [state.settings.theme]);

  // Global log subscription
  React.useEffect(() => {
    const off = window.df.log.onEntry((e) => {
      setLogs((prev) => [[e.time, e.level, e.message], ...prev].slice(0, 500));
    });
    return () => off?.();
  }, []);

  const refresh = React.useCallback(async () => {
    const [deps, builds, paths] = await Promise.all([
      window.df.deps.check(),
      window.df.builds.installed(),
      window.df.paths(),
    ]);
    dispatch({ type: "DEPS_SET", deps });
    dispatch({ type: "BUILDS_SET", builds });
    dispatch({ type: "PATHS_SET", paths });
  }, []);

  React.useEffect(() => { refresh(); }, [refresh]);

  const openModal = (m) => setModal(m);
  const closeModal = () => setModal(null);
  const goto = (r) => setRoute(r);

  const setTheme = (v) => dispatch({ type: "SETTING", key: "theme", value: v });

  const screen = {
    dashboard:  <Dashboard goto={goto} state={state} openModal={openModal} refresh={refresh} />,
    downloader: <Downloader state={state} dispatch={dispatch} openModal={openModal} refresh={refresh} />,
    installer:  <Installer state={state} dispatch={dispatch} openModal={openModal} refresh={refresh} />,
    verify:     <Verify state={state} refresh={refresh} />,
    deps:       <Dependencies state={state} dispatch={dispatch} openModal={openModal} refresh={refresh} />,
    settings:   <Settings state={state} dispatch={dispatch} theme={state.settings.theme} setTheme={setTheme} />,
    logs:       <Logs logs={logs} clearLogs={() => setLogs([])} />,
    about:      <About />,
  }[route];

  return (
    <div className="df-app" data-density="default">
      <Sidebar route={route} goto={goto} state={state} />
      <main className="df-main">
        <Header route={route} goto={goto} state={state} />
        {state.paths?.inOneDrive && (
          <div className="df-onedrive-bar">
            <Icon name="alert" size={14} />
            <span><strong>OneDrive detected:</strong> move DepotForge out of <span className="df-mono">{state.paths.root}</span> before downloading any builds. Cloud-synced folders break multi-GB depot downloads.</span>
          </div>
        )}
        {screen}
      </main>

      {modal && (
        <Modal
          title={modal.title}
          primaryLabel={modal.primaryLabel}
          danger={modal.danger}
          onClose={closeModal}
          primary={() => { modal.confirm?.(); closeModal(); }}
        >
          {modal.body}
        </Modal>
      )}
    </div>
  );
}

function Sidebar({ route, goto, state }) {
  const missingDeps = state.deps.filter(d => d.status !== "installed").length;
  const items = [
    { group: "WORKSPACE", entries: [
      { id: "dashboard",  label: "Dashboard",     icon: "dashboard" },
      { id: "downloader", label: "Build downloader", icon: "download" },
      { id: "installer",  label: "Heated Metal",  icon: "package" },
      { id: "verify",     label: "Verify & repair", icon: "shield" },
    ]},
    { group: "SYSTEM", entries: [
      { id: "deps",     label: "Dependencies", icon: "plug", badge: missingDeps || null, badgeTone: "warn" },
      { id: "settings", label: "Settings",     icon: "settings" },
      { id: "logs",     label: "Logs",         icon: "terminal" },
      { id: "about",    label: "About & credits", icon: "info" },
    ]},
  ];

  return (
    <aside className="df-sidebar">
      <div className="df-brand">
        <div className="df-brand-mark">DF</div>
        <div>
          <div className="df-brand-name">DepotForge</div>
          <div className="df-brand-sub">v1.0.0 · fork</div>
        </div>
      </div>
      <nav className="df-nav">
        {items.map((g) => (
          <div key={g.group} className="df-nav-group">
            <div className="df-nav-label">{g.group}</div>
            {g.entries.map((e) => (
              <div key={e.id} className="df-nav-item" data-active={route === e.id} onClick={() => goto(e.id)}>
                <span className="df-nav-icon"><Icon name={e.icon} size={15} /></span>
                <span>{e.label}</span>
                {e.badge && <span className="df-nav-badge" data-tone={e.badgeTone}>{e.badge}</span>}
              </div>
            ))}
          </div>
        ))}
      </nav>
      <div className="df-sidebar-footer">
        <span className="df-pulse" />
        <span>{state.paths?.inOneDrive ? "OneDrive · unsafe" : "Local · ready"}</span>
      </div>
    </aside>
  );
}

function Header({ route, goto, state }) {
  const labels = {
    dashboard: "Dashboard",
    downloader: "Build downloader",
    installer: "Heated Metal installer",
    verify: "Verify & repair",
    deps: "Dependencies",
    settings: "Settings",
    logs: "Logs",
    about: "About & credits",
  };
  return (
    <header className="df-header">
      <div className="df-crumbs">
        <span>DepotForge</span>
        <Icon name="chevron" size={12} stroke={2} />
        <strong>{labels[route]}</strong>
      </div>
      <div className="df-header-actions">
        {state.download.active && (
          <button onClick={() => goto("downloader")} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "5px 10px 5px 12px",
            background: "var(--accent-soft)", color: "var(--accent)",
            border: "1px solid transparent", borderRadius: 999, cursor: "pointer",
            fontSize: 12, fontFamily: "var(--font-mono)",
          }}>
            <span style={{
              display: "inline-block", width: 8, height: 8, borderRadius: "50%",
              background: "var(--accent)", animation: "pulse 1.8s infinite",
            }} />
            Downloading {state.download.build?.name}{state.download.pct > 0 ? ` · ${state.download.pct.toFixed(0)}%` : ""}
          </button>
        )}
        <Btn variant="ghost" size="icon" icon="refresh" onClick={() => window.location.reload()} />
        <Btn variant="ghost" size="icon" icon="folder" onClick={() => window.df.fs.openFolder(state.paths?.root)} />
      </div>
    </header>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
