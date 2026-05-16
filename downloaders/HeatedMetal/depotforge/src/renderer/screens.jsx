// DepotForge — all screens (Dashboard, Downloader, Installer, Verify, Dependencies, Settings, Logs, About)
// Adapted from the Claude Design prototype; download/install/verify now invoke real IPC instead of simulating.

const BUILDS = [
  {
    id: "y5s3", code: "Y5S3 · 2020.3",
    name: "Shadow Legacy",
    size: 88.0,
    note: "Mod support frozen at version 0.2.3.",
    modSupport: "legacy",
    risk: "warn",
    riskNote: "Older build — no current mod updates.",
    depots: [
      { id: 377237, manifest: "85893637567200342" },
      { id: 377238, manifest: "4020038723910014041" },
      { id: 359551, manifest: "3089981610366186823" },
    ],
  },
  {
    id: "y5s4", code: "Y5S4 · 2020.4",
    name: "Neon Dawn",
    size: 57.0,
    note: "Recommended build — full mod compatibility.",
    modSupport: "full",
    risk: "ok",
    riskNote: "Stable. Fully verified manifests.",
    recommended: true,
    depots: [
      { id: 377237, manifest: "3390446325154338855" },
      { id: 377238, manifest: "3175150742361965235" },
      { id: 359551, manifest: "6947060999143280245" },
    ],
  },
  {
    id: "y9s2", code: "Y9S2 · 2024.2",
    name: "New Blood",
    size: 56.0,
    note: "Recent build — partial mod compatibility.",
    modSupport: "partial",
    risk: "info",
    riskNote: "Compatible with current release branch.",
    depots: [
      { id: 377237, manifest: "6874184890918352263" },
      { id: 377238, manifest: "3648252944070415883" },
      { id: 359551, manifest: "2171250367116101899" },
    ],
  },
];

// ─── DASHBOARD ─────────────────────────────────────────────────────────
function Dashboard({ goto, state, openModal, refresh }) {
  const depsOk = state.deps.length > 0 && state.deps.every((d) => d.status === "installed");
  const depsMissing = state.deps.filter((d) => d.status !== "installed").length;
  const hasUntrusted = state.deps.some((d) => d.untrusted && d.status === "installed");

  const setupSteps = [
    {
      id: "deps", title: "Verify dependencies",
      sub: depsOk ? "All required tools detected on disk." : `${depsMissing} item(s) need attention.`,
      state: depsOk ? "done" : "active",
    },
    {
      id: "pick", title: "Pick a build & download",
      sub: state.builds.length ? `${state.builds.length} build(s) installed.` : "Choose a season build to download.",
      state: state.builds.length ? "done" : (depsOk ? "active" : "todo"),
    },
    {
      id: "verify", title: "Verify files",
      sub: "Re-check manifests after download.",
      state: state.builds.length ? "active" : "todo",
    },
    {
      id: "mod", title: "Install Heated Metal",
      sub: "Stage the mod on a verified build.",
      state: state.builds.length ? "active" : "todo",
    },
    {
      id: "launch", title: "Launch instructions",
      sub: "Use the custom launcher to start the game.",
      state: "todo",
    },
  ];

  return (
    <div className="df-screen">
      <div className="df-screen-head">
        <div className="df-screen-head-text">
          <h1 className="df-h1">DepotForge</h1>
          <p className="df-sub">A community downloader and mod manager for Rainbow Six Siege legacy builds. Pulls depots directly via Steam DepotDownloader and stages the Heated Metal mod on disk.</p>
        </div>
        <Badge tone="info" dot>Workspace · default</Badge>
      </div>

      <div className="df-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 20 }}>
        <KPI label="Dependencies"
          value={`${state.deps.filter(d=>d.status==="installed").length}/${state.deps.length || 4}`}
          meta={depsOk ? "All systems go" : "Action needed"}
          tone={depsOk ? "success" : "warning"} />
        <KPI label="Installed builds" value={state.builds.length}
          meta={state.builds[0]?.name || "No builds yet"} />
        <KPI label="Disk root"
          value={state.paths?.inOneDrive ? "Unsafe" : "OK"}
          meta={state.paths?.inOneDrive ? "OneDrive detected" : "Local disk"}
          tone={state.paths?.inOneDrive ? "danger" : "success"} />
        <KPI label="Last operation"
          value={state.lastOp?.label || "Idle"}
          meta={state.lastOp?.when || "—"} />
      </div>

      <div className="df-grid" style={{ gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
        <div className="df-col">
          <div className="df-hero">
            <div className="df-row" style={{ marginBottom: 18 }}>
              <div className="df-flex-1">
                <div style={{ fontSize: 12, color: "var(--text-3)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>Guided setup</div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>Get a clean build up and running</h2>
              </div>
              <Badge tone="accent">{setupSteps.filter(s => s.state === "done").length}/{setupSteps.length} complete</Badge>
            </div>
            <div className="df-col" style={{ gap: 14 }}>
              {setupSteps.map((s, i) => (
                <div key={s.id} className="df-step" data-state={s.state}>
                  <div className="df-step-num">{s.state === "done" ? <Icon name="check" size={13} stroke={2.4} /> : i + 1}</div>
                  <div className="df-step-text df-flex-1">
                    <div className="df-step-title">{s.title}</div>
                    <div className="df-step-sub">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card title="Quick actions">
            <div className="df-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              <QuickAction icon="download" title="Download game build" desc="Fetch depot files for an owned build" onClick={() => goto("downloader")} />
              <QuickAction icon="package" title="Install Heated Metal" desc="Stage mod onto a verified build" onClick={() => goto("installer")} />
              <QuickAction icon="shield" title="Verify files" desc="Re-check manifests; repair if needed" onClick={() => goto("verify")} />
              <QuickAction icon="settings" title="Open settings" desc="Folders, downloads, login behavior" onClick={() => goto("settings")} />
            </div>
          </Card>
        </div>

        <div className="df-col">
          <Card title="External links">
            <div className="df-col" style={{ gap: 0 }}>
              <StatusRow
                name="Claim Siege on Steam"
                meta="Required: own a copy under your Steam account"
                right={<Btn size="sm" icon="external" onClick={() => window.df.external.open("steamSiegePage")}>Open</Btn>} />
              <StatusRow
                name="Community Discord"
                meta="FAQ, guides and support"
                right={<Btn size="sm" icon="external" onClick={() => window.df.external.open("discord")}>Open</Btn>} />
              <StatusRow
                name="Support the original project"
                meta="ZeroBytes / DataCluster0"
                right={<Btn size="sm" icon="external" onClick={() => window.df.external.open("buymeacoffee")}>Open</Btn>} />
            </div>
          </Card>

          {hasUntrusted && (
            <Banner tone="warn" title="Third-party loader component">
              The Heated Metal mod requires an external loader script (Helios) that is not signed by Steam.
              No upstream checksum is published, so DepotForge cannot verify its integrity.
              <div style={{ marginTop: 8 }}>
                <Btn variant="ghost" size="sm" onClick={() => goto("deps")}>Review source <Icon name="chevron" size={12} /></Btn>
              </div>
            </Banner>
          )}

          <Banner tone="info" title="Forked from HeatedMetal.bat">
            DepotForge is a UI layer over JVAV's original batch-script downloader. All download URLs, manifest IDs, and external components are unchanged from upstream.
            <div style={{ marginTop: 8 }}>
              <Btn variant="ghost" size="sm" onClick={() => goto("about")}>Read credits <Icon name="chevron" size={12} /></Btn>
            </div>
          </Banner>
        </div>
      </div>
    </div>
  );
}

const QuickAction = ({ icon, title, desc, onClick }) => (
  <button onClick={onClick} style={{
    background: "var(--bg-2)", border: "1px solid var(--border-1)",
    borderRadius: "var(--r-3)", padding: 14, textAlign: "left",
    display: "flex", gap: 12, alignItems: "flex-start", color: "var(--text-1)",
    transition: "border 0.12s, background 0.12s", cursor: "pointer",
  }}
  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.background = "var(--bg-3)"; }}
  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-1)"; e.currentTarget.style.background = "var(--bg-2)"; }}>
    <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center", flexShrink: 0 }}>
      <Icon name={icon} size={16} />
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 3 }}>{title}</div>
      <div style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.45 }}>{desc}</div>
    </div>
  </button>
);

// ─── DOWNLOADER ────────────────────────────────────────────────────────
function Downloader({ state, dispatch, openModal, refresh }) {
  const [selected, setSelected] = React.useState("y5s4");
  const [username, setUsername] = React.useState(state.settings.lastUsername || "");
  const [password, setPassword] = React.useState("");
  const [twoFactor, setTwoFactor] = React.useState("");
  const [parallel, setParallel] = React.useState(state.settings.parallel || 8);
  const [showLogs, setShowLogs] = React.useState(false);
  const [logs, setLogs] = React.useState([]);
  const dl = state.download;
  const build = BUILDS.find((b) => b.id === selected);

  React.useEffect(() => {
    const off = window.df.log.onEntry((e) => {
      if (e.channel !== "download") return;
      setLogs((prev) => [[e.time, e.level, e.message], ...prev].slice(0, 200));
      if (/(\d+(\.\d+)?)%/.test(e.message)) {
        const m = e.message.match(/(\d+(?:\.\d+)?)%/);
        if (m) dispatch({ type: "DOWNLOAD_PCT", pct: parseFloat(m[1]) });
      }
    });
    return () => off?.();
  }, [dispatch]);

  React.useEffect(() => {
    const off = window.df.download.onDepot((d) => {
      dispatch({ type: "DOWNLOAD_DEPOT", depot: d.id, manifest: d.manifest });
    });
    return () => off?.();
  }, [dispatch]);

  const start = async () => {
    if (!username.trim()) return;
    dispatch({ type: "DOWNLOAD_START", build });
    const result = await window.df.download.start({
      buildId: build.id,
      username: username.trim(),
      password: password || undefined,
      twoFactor: twoFactor || undefined,
      parallel,
    });
    if (result.ok) {
      dispatch({ type: "DOWNLOAD_DONE", build });
      refresh();
    } else {
      dispatch({ type: "DOWNLOAD_FAIL", error: result.error || `Depot ${result.depotFailed} failed` });
    }
  };

  const cancel = async () => {
    await window.df.download.cancel();
    dispatch({ type: "DOWNLOAD_CANCEL" });
  };

  return (
    <div className="df-screen">
      <div className="df-screen-head">
        <div className="df-screen-head-text">
          <h1 className="df-h1">Build downloader</h1>
          <p className="df-sub">Pick a season build, sign in to Steam, and DepotForge will pull the corresponding depots and manifests directly via DepotDownloader.</p>
        </div>
        {dl.active && <Badge tone="accent" dot>Download in progress</Badge>}
      </div>

      {state.paths?.inOneDrive && (
        <div style={{ marginBottom: 18 }}>
          <Banner tone="err" title="DepotForge is running inside a OneDrive folder">
            Move the entire DepotForge folder to a regular local path before downloading. Cloud-synced folders corrupt large multi-GB downloads.
          </Banner>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24 }}>
        <div className="df-col">
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>1. Choose a build</div>
            <div className="df-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {BUILDS.map((b) => <BuildCard key={b.id} build={b} selected={selected === b.id} onSelect={() => setSelected(b.id)} />)}
            </div>
          </div>

          <Card>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>2. Steam account</div>
            <div className="df-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Steam username" hint="Used by Steam DepotDownloader. Passed verbatim as the -username argument.">
                <input className="df-input" placeholder="e.g. alex_dev" value={username} onChange={(e) => setUsername(e.target.value)} disabled={dl.active} />
              </Field>
              <Field label="Steam password" hint="Optional. If empty, DepotDownloader will prompt for it on stdin and you can read the prompt in the live log.">
                <input className="df-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={dl.active} />
              </Field>
            </div>
            <div style={{ marginTop: 12 }}>
              <Field label="Steam Guard code (2FA)" hint="Optional. Provide upfront to skip the in-log prompt. Leave blank if your account has no 2FA.">
                <input className="df-input df-mono" placeholder="ABCDE" value={twoFactor} onChange={(e) => setTwoFactor(e.target.value.toUpperCase())} disabled={dl.active} maxLength={6} />
              </Field>
            </div>
          </Card>

          <Card>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>3. Download options</div>
            <div className="df-grid" style={{ gridTemplateColumns: "2fr 1fr", gap: 14 }}>
              <Field label="Download directory" hint="Always under <DepotForge>/Downloads. Avoid OneDrive, Dropbox, or any synced folder.">
                <div className="df-row">
                  <input className="df-input df-mono" value={`${state.paths?.downloads || "Downloads"}\\${build.id === "y5s3" ? "Y5S3_ShadowLegacy" : build.id === "y5s4" ? "Y5S4_NeonDawnHM" : "Y9S2_NewBloodHM"}`} readOnly />
                  <Btn variant="ghost" icon="folder" onClick={() => window.df.fs.openFolder(state.paths?.downloads)}>Open</Btn>
                </div>
              </Field>
              <Field label="Max parallel downloads" hint="8–16 is typical. Lower if your network is unstable.">
                <select className="df-select" value={parallel} onChange={(e) => setParallel(parseInt(e.target.value, 10))} disabled={dl.active}>
                  <option value="4">4</option>
                  <option value="8">8</option>
                  <option value="12">12</option>
                  <option value="16">16</option>
                </select>
              </Field>
            </div>
          </Card>

          {!dl.active ? (
            <div className="df-row">
              <Btn variant="primary" size="lg" icon="download" onClick={start}
                disabled={!username.trim() || state.deps.find(d => d.id === "depot")?.status !== "installed"}>
                Start download · {build.name}
              </Btn>
              <div className="df-spacer" />
              <div style={{ fontSize: 12, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                ~{fmtBytes(build.size)} disk space required
              </div>
            </div>
          ) : (
            <DownloadProgress dl={dl} showLogs={showLogs} setShowLogs={setShowLogs} cancel={cancel} logs={logs} />
          )}

          {dl.lastError && !dl.active && (
            <Banner tone="err" title="Last attempt failed">
              {dl.lastError}
            </Banner>
          )}
        </div>

        <div className="df-col">
          <Card title="Build details" pad="lg">
            <div style={{ fontSize: 11, color: "var(--text-4)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{build.code}</div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 2, marginBottom: 14 }}>{build.name}</div>
            <div className="df-col" style={{ gap: 0 }}>
              <StatusRow name="Approx. size" meta="On-disk after extraction" right={<span className="df-mono" style={{ color: "var(--text-1)", fontSize: 13 }}>{fmtBytes(build.size)}</span>} />
              <StatusRow name="Mod compatibility" right={
                <Badge tone={{ full: "ok", partial: "info", legacy: "warn" }[build.modSupport]}>
                  {{ full: "Full", partial: "Partial", legacy: "Legacy (0.2.3)" }[build.modSupport]}
                </Badge>
              } />
              <StatusRow name="Risk profile" right={<Badge tone={build.risk}>{build.risk === "ok" ? "Stable" : build.risk === "warn" ? "Caution" : "Standard"}</Badge>} />
              <StatusRow name="Depots" right={<span className="df-mono" style={{ fontSize: 12, color: "var(--text-2)" }}>{build.depots.length} manifest(s)</span>} />
            </div>
            <div style={{ marginTop: 14, padding: 12, background: "var(--bg-2)", borderRadius: "var(--r-2)", fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.55 }}>
              {build.note}
            </div>
          </Card>

          <Card title="Manifests">
            <div className="df-col" style={{ gap: 0 }}>
              {build.depots.map((d) => (
                <StatusRow
                  key={d.id}
                  name={`depot ${d.id}`}
                  meta={`manifest ${d.manifest}`}
                  right={
                    <Icon name="copy" size={14}
                      style={{ color: "var(--text-3)", cursor: "pointer" }}
                      onClick={() => navigator.clipboard?.writeText(d.manifest)} />
                  }
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

const BuildCard = ({ build, selected, onSelect }) => (
  <div className="df-build" data-selected={selected} onClick={onSelect}>
    {build.recommended && (
      <div style={{ position: "absolute", top: -1, left: 14, transform: "translateY(-50%)", padding: "2px 8px", background: "var(--accent)", color: "var(--on-accent)", borderRadius: 999, fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
        Recommended
      </div>
    )}
    <div className="df-build-head">
      <div className="df-flex-1">
        <div className="df-build-code">{build.code}</div>
        <div className="df-build-name">{build.name}</div>
      </div>
    </div>
    <div style={{ fontSize: 12.5, color: "var(--text-3)", lineHeight: 1.5 }}>{build.note}</div>
    <div className="df-build-meta">
      <div>
        <div className="df-meta-k">Size</div>
        <div className="df-meta-v">{fmtBytes(build.size)}</div>
      </div>
      <div>
        <div className="df-meta-k">Mod support</div>
        <div className="df-meta-v" style={{ fontSize: 12 }}>
          <Badge tone={{ full: "ok", partial: "info", legacy: "warn" }[build.modSupport]}>
            {{ full: "Full", partial: "Partial", legacy: "Legacy" }[build.modSupport]}
          </Badge>
        </div>
      </div>
    </div>
  </div>
);

function DownloadProgress({ dl, showLogs, setShowLogs, cancel, logs }) {
  return (
    <Card>
      <div className="df-row" style={{ marginBottom: 14 }}>
        <div className="df-flex-1">
          <div style={{ fontSize: 11, color: "var(--text-4)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Downloading</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>{dl.build?.name}</div>
        </div>
        <Badge tone="accent" dot>Active</Badge>
      </div>
      <Progress value={dl.pct} indeterminate={dl.pct === 0} />
      <div className="df-row" style={{ marginTop: 10, justifyContent: "space-between", fontSize: 12, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
        <span>{dl.pct > 0 ? `${dl.pct.toFixed(1)}%` : "Initializing…"}</span>
        <span>Live progress is reported by DepotDownloader in the log below</span>
      </div>

      <div className="df-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 18 }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Current depot</div>
          <div className="df-mono" style={{ fontSize: 13, marginTop: 4 }}>{dl.depot || "—"}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Manifest</div>
          <div className="df-mono" style={{ fontSize: 13, marginTop: 4 }}>{dl.manifest || "—"}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Step</div>
          <div style={{ fontSize: 13, marginTop: 4, color: "var(--text-1)" }}>{dl.step || "—"}</div>
        </div>
      </div>

      <div className="df-row" style={{ marginTop: 18 }}>
        <Btn variant="danger" icon="x" onClick={cancel}>Cancel</Btn>
        <div className="df-spacer" />
        <Btn variant="ghost" size="sm" onClick={() => setShowLogs(v => !v)}>
          {showLogs ? "Hide" : "Show"} live log <Icon name={showLogs ? "chevronDown" : "chevron"} size={12} />
        </Btn>
      </div>
      {showLogs && (
        <div style={{ marginTop: 14 }}>
          <LogView entries={logs} />
        </div>
      )}
    </Card>
  );
}

// ─── HEATED METAL INSTALLER ────────────────────────────────────────────
function Installer({ state, dispatch, openModal, refresh }) {
  const [variant, setVariant] = React.useState("latest");
  const [installing, setInstalling] = React.useState(false);
  const [installed, setInstalled] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [logs, setLogs] = React.useState([]);

  React.useEffect(() => {
    const off = window.df.log.onEntry((e) => {
      if (e.channel !== "mod") return;
      setLogs((prev) => [[e.time, e.level, e.message], ...prev].slice(0, 100));
    });
    return () => off?.();
  }, []);

  const variants = {
    latest: { label: "Latest", version: "Resolved at install", build: "y5s4", buildName: "Neon Dawn (Y5S4)", note: "Recommended. Latest release pulled from github.com/DataCluster0/HeatedMetal." },
    legacy: { label: "0.2.3", version: "0.2.3", build: "y5s3", buildName: "Shadow Legacy (Y5S3)", note: "Final release for the older build. No further updates." },
  };
  const v = variants[variant];
  const matchingBuild = state.builds.find((b) => b.id === v.build);

  const beginInstall = () => {
    openModal({
      title: "Extract Heated Metal into target folder?",
      body: (
        <>
          DepotForge will download the official mod archive from <span className="df-mono">github.com/DataCluster0/HeatedMetal</span> and extract it into:
          <div className="df-mono" style={{ marginTop: 8, padding: 10, background: "var(--bg-2)", borderRadius: 6, fontSize: 12 }}>
            {matchingBuild?.path || `Resources\\HeatedMetal\\${v.build === "y5s3" ? "Y5S3_ShadowLegacy" : "Y5S4_NeonDawnHM"}`}
          </div>
          Existing files with the same name will be overwritten. The archive checksum is not verified against an upstream signature.
        </>
      ),
      primaryLabel: "Download & extract",
      confirm: runInstall,
    });
  };

  const runInstall = async () => {
    setInstalling(true);
    setInstalled(false);
    setError(null);
    setLogs([]);
    const r = await window.df.mod.install({ variant });
    setInstalling(false);
    if (r.ok) {
      setInstalled(true);
      refresh();
    } else {
      setError(r.error || "Install failed");
    }
  };

  return (
    <div className="df-screen">
      <div className="df-screen-head">
        <div className="df-screen-head-text">
          <h1 className="df-h1">Heated Metal installer</h1>
          <p className="df-sub">A community mod that adapts older Siege content for compatible builds. DepotForge unpacks the official release archive from GitHub into your local build folder.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
        <div className="df-col">
          <Card>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>1. Choose mod version</div>
            <div className="df-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {Object.entries(variants).map(([k, vv]) => (
                <div key={k} className="df-build" data-selected={variant === k} onClick={() => setVariant(k)} style={{ cursor: "pointer" }}>
                  <div className="df-build-head">
                    <div className="df-flex-1">
                      <div className="df-build-code">{k === "latest" ? "RECOMMENDED" : "LEGACY"}</div>
                      <div className="df-build-name">{vv.label}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--text-3)", lineHeight: 1.5 }}>{vv.note}</div>
                  <div style={{ paddingTop: 8, borderTop: "1px solid var(--border-1)" }}>
                    <div className="df-meta-k">Target build</div>
                    <div className="df-meta-v" style={{ fontSize: 12 }}>{vv.buildName}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>2. Target build</div>
            {matchingBuild ? (
              <div style={{
                padding: 16, background: "var(--success-soft)",
                borderRadius: "var(--r-3)", border: "1px solid oklch(0.74 0.13 150 / 0.3)",
                display: "flex", gap: 14, alignItems: "center",
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--success)", color: "var(--bg-0)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Icon name="check" size={18} stroke={2.5} />
                </div>
                <div className="df-flex-1">
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-1)" }}>{matchingBuild.name} is installed and ready</div>
                  <div className="df-mono" style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 2 }}>{matchingBuild.path}</div>
                </div>
              </div>
            ) : (
              <Banner tone="warn" title={`${v.buildName} not installed`}>
                The selected mod version targets {v.buildName}. The mod files will be staged into <span className="df-mono">Resources/HeatedMetal/…</span> as a holding area until the matching build is downloaded.
              </Banner>
            )}
          </Card>

          {!installing && !installed && !error && (
            <div className="df-row">
              <Btn variant="primary" size="lg" icon="package" onClick={beginInstall}>
                Install Heated Metal {variant === "latest" ? "(latest)" : "0.2.3"}
              </Btn>
              <Btn variant="ghost" icon="external" onClick={() => window.df.external.open("https://github.com/DataCluster0/HeatedMetal/releases")}>View releases</Btn>
            </div>
          )}
          {installing && (
            <Card>
              <div className="df-row" style={{ marginBottom: 12 }}>
                <Icon name="package" size={16} style={{ color: "var(--accent)" }} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>Downloading and extracting HeatedMetal.7z…</span>
              </div>
              <Progress indeterminate />
              <div style={{ marginTop: 12 }}>
                <LogView entries={logs} />
              </div>
            </Card>
          )}
          {installed && (
            <Banner tone="ok" title="Heated Metal installed" action={
              <Btn variant="ghost" size="sm" icon="folder" onClick={() => window.df.fs.openFolder(matchingBuild?.path)}>Open folder</Btn>
            }>
              The mod was extracted into your {v.buildName} folder. Launch with <span className="df-mono">LaunchR6.bat</span>, not the original executable.
              <div style={{ marginTop: 8 }}>
                <Btn variant="ghost" size="sm" onClick={() => { setInstalled(false); setError(null); }}>Install again</Btn>
              </div>
            </Banner>
          )}
          {error && (
            <Banner tone="err" title="Install failed" action={<Btn variant="ghost" size="sm" onClick={() => setError(null)}>Dismiss</Btn>}>
              {error}
            </Banner>
          )}
        </div>

        <div className="df-col">
          <Card title="Launch instructions" pad="lg">
            <div style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6, marginBottom: 14 }}>
              The mod requires a custom launch flow. After installing:
            </div>
            <div className="df-col" style={{ gap: 12 }}>
              <LaunchStep n="1" title="Use the custom launcher" body={<>Start the game with <span className="df-mono" style={{ color: "var(--text-1)" }}>LaunchR6.bat</span> from your build folder.</>} />
              <LaunchStep n="2" title="Do not launch the original .exe" body="Starting from the unmodified game executable bypasses the mod and will fail to load." />
              <LaunchStep n="3" title="Use community servers only" body="The mod runs on community-hosted servers. Do not attempt to join official matchmaking with a modded build." />
            </div>
          </Card>

          <Banner tone="info" title="Third-party loader component">
            This mod ships alongside an external loader (Helios) that is not signed by Steam and has no upstream checksum DepotForge can verify against. Review the source on its release page before launching.
            <div style={{ marginTop: 8 }}>
              <Btn variant="ghost" size="sm" onClick={() => window.df.external.open("https://github.com/JOJOVAV/r6-downloader")}>Open Helios source</Btn>
            </div>
          </Banner>
        </div>
      </div>
    </div>
  );
}

const LaunchStep = ({ n, title, body }) => (
  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
    <div style={{
      width: 22, height: 22, borderRadius: 6, background: "var(--accent-soft)",
      color: "var(--accent)", display: "grid", placeItems: "center",
      fontSize: 11, fontWeight: 600, fontFamily: "var(--font-mono)", flexShrink: 0,
    }}>{n}</div>
    <div>
      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-1)", marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 12.5, color: "var(--text-3)", lineHeight: 1.55 }}>{body}</div>
    </div>
  </div>
);

// ─── VERIFY ────────────────────────────────────────────────────────────
function Verify({ state, refresh }) {
  const [selected, setSelected] = React.useState(state.builds[0]?.id);
  const [phase, setPhase] = React.useState("idle");
  const [result, setResult] = React.useState(null);
  const [logs, setLogs] = React.useState([]);

  React.useEffect(() => {
    const off = window.df.log.onEntry((e) => {
      if (e.channel !== "verify") return;
      setLogs((prev) => [[e.time, e.level, e.message], ...prev].slice(0, 200));
    });
    return () => off?.();
  }, []);

  React.useEffect(() => {
    if (!selected && state.builds[0]) setSelected(state.builds[0].id);
  }, [state.builds, selected]);

  const run = async () => {
    setPhase("running");
    setResult(null);
    setLogs([]);
    const r = await window.df.verify.run({ buildId: selected });
    setPhase("done");
    setResult(r);
    refresh();
  };

  return (
    <div className="df-screen">
      <div className="df-screen-head">
        <div className="df-screen-head-text">
          <h1 className="df-h1">Verification & repair</h1>
          <p className="df-sub">Re-runs DepotDownloader with <span className="df-mono">-validate</span> on every depot for the selected build. Missing or mismatched chunks are re-downloaded automatically.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="df-col">
          <Card title="1. Pick a build to verify">
            {state.builds.length === 0 ? (
              <div className="df-empty">
                <div className="df-empty-icon"><Icon name="package" size={22} /></div>
                <div className="df-empty-title">No builds installed yet</div>
                <div className="df-empty-body">Download a build first, then come back here to verify or repair its files.</div>
              </div>
            ) : (
              <div className="df-col" style={{ gap: 8 }}>
                {state.builds.map((b) => (
                  <div key={b.id}
                    onClick={() => phase !== "running" && setSelected(b.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, padding: 14,
                      background: selected === b.id ? "var(--accent-soft)" : "var(--bg-2)",
                      border: "1px solid " + (selected === b.id ? "var(--accent)" : "var(--border-1)"),
                      borderRadius: "var(--r-3)", cursor: phase === "running" ? "not-allowed" : "pointer",
                      opacity: phase === "running" && selected !== b.id ? 0.5 : 1,
                    }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: "50%",
                      border: "2px solid " + (selected === b.id ? "var(--accent)" : "var(--border-2)"),
                      background: selected === b.id ? "var(--accent)" : "transparent",
                      boxShadow: selected === b.id ? "inset 0 0 0 3px var(--bg-1)" : "none",
                    }} />
                    <div className="df-flex-1">
                      <div style={{ fontSize: 13.5, fontWeight: 500 }}>{b.name}</div>
                      <div className="df-mono" style={{ fontSize: 11.5, color: "var(--text-3)" }}>{b.path}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {phase === "idle" && (
            <Btn variant="primary" size="lg" icon="shield" onClick={run} disabled={!selected}>
              Start verification
            </Btn>
          )}
          {phase === "running" && (
            <Card>
              <div className="df-row" style={{ marginBottom: 10 }}>
                <Icon name="shield" size={16} style={{ color: "var(--accent)" }} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>Validating depots against manifest…</span>
              </div>
              <Progress indeterminate />
              <div style={{ marginTop: 12 }}>
                <LogView entries={logs} />
              </div>
            </Card>
          )}
          {phase === "done" && (
            <Btn icon="refresh" onClick={() => { setPhase("idle"); setResult(null); }}>Run again</Btn>
          )}
        </div>

        <div className="df-col">
          <Card title="Result" pad="lg">
            {!result ? (
              <div className="df-empty" style={{ padding: "30px 0" }}>
                <div className="df-empty-icon"><Icon name="shield" size={22} /></div>
                <div className="df-empty-title">Awaiting verification</div>
                <div className="df-empty-body">Start a verification to see a per-depot summary here.</div>
              </div>
            ) : result.ok ? (
              <Banner tone="ok" title="Build is healthy">
                All depots passed validation. Any missing chunks were re-downloaded.
              </Banner>
            ) : (
              <Banner tone="err" title="Verification failed">
                {result.error || `Depot ${result.depotFailed} did not validate cleanly. Inspect the live log for the underlying DepotDownloader error.`}
              </Banner>
            )}
          </Card>

          <Card title="Notes" pad="lg">
            <div style={{ fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.6 }}>
              Verification runs the exact same DepotDownloader command as the initial download, but with no fresh data fetched unless a chunk fails its manifest check. Existing files are kept on disk.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── DEPENDENCIES ──────────────────────────────────────────────────────
function Dependencies({ state, dispatch, openModal, refresh }) {
  const [busy, setBusy] = React.useState(null);

  const install = async (dep) => {
    setBusy(dep.id);
    const r = await window.df.deps.install(dep.id);
    setBusy(null);
    if (r.openedExternal) {
      openModal({
        title: ".NET 9 SDK download opened in browser",
        body: "Install the .NET 9 SDK from Microsoft, then click Re-check on this screen.",
        primaryLabel: "OK",
        confirm: () => refresh(),
      });
    } else if (r.ok) {
      refresh();
    } else {
      openModal({
        title: `Install failed: ${dep.name}`,
        body: r.error || "Unknown error. Check the log panel for details.",
        primaryLabel: "Dismiss",
        confirm: () => {},
      });
    }
  };

  return (
    <div className="df-screen">
      <div className="df-screen-head">
        <div className="df-screen-head-text">
          <h1 className="df-h1">Dependencies</h1>
          <p className="df-sub">Tools DepotForge needs to download depots, extract archives, and stage mods. Each entry shows its current source and verification status.</p>
        </div>
        <Btn icon="refresh" onClick={refresh}>Re-check all</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24 }}>
        <Card pad="lg">
          <div className="df-col" style={{ gap: 0 }}>
            {state.deps.map((d) => (
              <DepRow key={d.id} dep={d} onInstall={install} busy={busy === d.id} openModal={openModal} />
            ))}
          </div>
        </Card>

        <div className="df-col">
          <Card title="Source verification" pad="lg">
            <div style={{ fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.6, marginBottom: 14 }}>
              Every dependency is fetched from the public release URL recorded in the upstream <span className="df-mono">HeatedMetal.bat</span>. DepotForge does not modify these URLs.
            </div>
            <div className="df-col" style={{ gap: 0 }}>
              <StatusRow name=".NET 9 SDK" meta="dotnet.microsoft.com" right={<Icon name="external" size={14} style={{ color: "var(--text-3)", cursor: "pointer" }} onClick={() => window.df.external.open("dotnetDownload")} />} />
              <StatusRow name="7-Zip CLI" meta="github.com/DataCluster0/R6TBBatchTool" right={<Icon name="external" size={14} style={{ color: "var(--text-3)", cursor: "pointer" }} onClick={() => window.df.external.open("https://github.com/DataCluster0/R6TBBatchTool")} />} />
              <StatusRow name="DepotDownloader" meta="github.com/SteamRE/DepotDownloader" right={<Icon name="external" size={14} style={{ color: "var(--text-3)", cursor: "pointer" }} onClick={() => window.df.external.open("https://github.com/SteamRE/DepotDownloader")} />} />
              <StatusRow name="Helios loader" meta="github.com/JOJOVAV/r6-downloader" right={<Icon name="external" size={14} style={{ color: "var(--text-3)", cursor: "pointer" }} onClick={() => window.df.external.open("https://github.com/JOJOVAV/r6-downloader")} />} />
            </div>
          </Card>

          <Banner tone="warn" title="Helios loader cannot be checksum-verified">
            The third-party loader does not publish a signed checksum. DepotForge will download it from the upstream URL on request, but cannot guarantee its integrity matches the version the project maintainer intended.
          </Banner>
        </div>
      </div>
    </div>
  );
}

function DepRow({ dep, onInstall, busy, openModal }) {
  const tone = { installed: "ok", missing: "err", outdated: "warn", review: "warn" }[dep.status];
  const label = { installed: "Installed", missing: "Missing", outdated: "Outdated", review: "Review" }[dep.status];
  return (
    <div className="df-status-row" style={{ padding: "16px 0" }}>
      <div style={{ display: "flex", gap: 14, alignItems: "center", flex: 1, minWidth: 0 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 8, flexShrink: 0,
          background: "var(--bg-2)", border: "1px solid var(--border-1)",
          display: "grid", placeItems: "center", color: "var(--text-2)",
        }}>
          <Icon name={dep.icon} size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>{dep.name}</span>
            <Badge tone={tone} dot>{label}</Badge>
            {dep.untrusted && <Badge tone="warn">Not signature-verified</Badge>}
          </div>
          <div className="df-mono" style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 3 }}>
            {dep.version} · {dep.source}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 4, lineHeight: 1.5 }}>{dep.desc}</div>
        </div>
      </div>
      <div className="df-row">
        {dep.status === "missing" && !dep.untrusted && (
          <Btn variant="primary" size="sm" icon="download" onClick={() => onInstall(dep)} disabled={busy}>
            {busy ? "Installing…" : "Install"}
          </Btn>
        )}
        {dep.status === "missing" && dep.untrusted && (
          <Btn size="sm" disabled={busy} onClick={() => openModal({
            title: `Install ${dep.name}?`,
            body: <>This component is third-party and not signed by Steam. DepotForge will fetch it from <span className="df-mono">{dep.source}</span>. There is no upstream checksum to verify against. Continue only if you trust this source.</>,
            primaryLabel: "Download component",
            confirm: () => onInstall(dep),
          })}>{busy ? "Installing…" : "Review & install"}</Btn>
        )}
      </div>
    </div>
  );
}

// ─── SETTINGS ──────────────────────────────────────────────────────────
function Settings({ state, dispatch, theme, setTheme }) {
  return (
    <div className="df-screen">
      <div className="df-screen-head">
        <div className="df-screen-head-text">
          <h1 className="df-h1">Settings</h1>
          <p className="df-sub">Folder layout, network behavior, and appearance. Settings persist in local storage and do not leave your machine.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
        <div className="df-col">
          <Card title="Folders" pad="lg">
            <Setting name="Download folder" desc="DepotForge writes builds into <root>/Downloads. This is currently fixed to the install location to match the original BAT layout." control={
              <input className="df-input df-mono" value={state.paths?.downloads || ""} readOnly />
            } />
            <Setting name="Resources folder" desc="Where dependency tools and cached archives live." control={
              <input className="df-input df-mono" value={state.paths?.resources || ""} readOnly />
            } />
            <Setting name="Open install folder" desc="Quick way to inspect downloaded builds and Resources on disk." control={
              <Btn icon="folder" onClick={() => window.df.fs.openFolder(state.paths?.root)}>Open root folder</Btn>
            } />
          </Card>

          <Card title="Downloads" pad="lg">
            <Setting name="Max parallel downloads" desc="Higher values saturate fast connections but can stress the disk. 8–12 is a safe range." control={
              <Seg value={state.settings.parallel} onChange={(v) => dispatch({ type: "SETTING", key: "parallel", value: v })}
                options={[{label:"4",value:4},{label:"8",value:8},{label:"12",value:12},{label:"16",value:16}]} />
            } />
            <Setting name="Validate after download" desc="Run a manifest verification automatically once a build finishes downloading." control={
              <Toggle value={state.settings.autoVerify} onChange={(v) => dispatch({ type: "SETTING", key: "autoVerify", value: v })} />
            } />
          </Card>

          <Card title="Steam account" pad="lg">
            <Setting name="Remember Steam login" desc="DepotDownloader always uses -remember-password, mirroring the original BAT. The token is stored under your Windows user profile and readable by software running as you. Disable elsewhere is not possible without forking DepotDownloader." control={
              <Badge tone="info">Always on (BAT-compatible)</Badge>
            } />
            <Setting name="Last username" desc="Pre-filled in the downloader. Cleared with Reset state." control={
              <input className="df-input df-mono" value={state.settings.lastUsername || ""} onChange={(e) => dispatch({ type: "SETTING", key: "lastUsername", value: e.target.value })} placeholder="—" />
            } />
          </Card>
        </div>

        <div className="df-col">
          <Card title="Appearance" pad="lg">
            <Setting name="Theme" desc="Dark is the default. Light mode is fully supported." control={
              <Seg value={theme} onChange={setTheme}
                options={[{label:"Light",value:"light"},{label:"Dark",value:"dark"},{label:"System",value:"system"}]} />
            } />
            <Setting name="Reduced motion" desc="Disable progress shimmer and decorative animations." control={
              <Toggle value={state.settings.reducedMotion} onChange={(v) => dispatch({ type: "SETTING", key: "reducedMotion", value: v })} />
            } />
          </Card>

          <Card title="Reset" pad="lg">
            <Setting name="Reset app state" desc="Clears stored settings and last-known username. Your downloaded build files and Resources folder are kept on disk." control={
              <Btn variant="danger" icon="trash" onClick={() => dispatch({ type: "RESET_SETTINGS" })}>Reset…</Btn>
            } />
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── LOGS ──────────────────────────────────────────────────────────────
function Logs({ logs, clearLogs }) {
  const [filter, setFilter] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const filters = [
    { id: "all", label: "All" },
    { id: "info", label: "Info" },
    { id: "warn", label: "Warning" },
    { id: "error", label: "Error" },
    { id: "download", label: "Download" },
    { id: "ok", label: "Success" },
  ];
  const filtered = logs.filter(([t, lvl, msg]) => {
    if (filter !== "all" && lvl !== filter) return false;
    if (query && !msg.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const copyAll = () => {
    const txt = logs.map(([t, l, m]) => `${t} [${l.toUpperCase()}] ${m}`).join("\n");
    navigator.clipboard?.writeText(txt);
  };
  const exportAll = () => {
    const txt = logs.map(([t, l, m]) => `${t} [${l.toUpperCase()}] ${m}`).join("\n");
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `depotforge-${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="df-screen">
      <div className="df-screen-head">
        <div className="df-screen-head-text">
          <h1 className="df-h1">Logs</h1>
          <p className="df-sub">A transcript of every dependency check, depot download, extraction, and verification event for this session.</p>
        </div>
        <div className="df-row">
          <Btn icon="copy" onClick={copyAll}>Copy</Btn>
          <Btn icon="export" onClick={exportAll}>Export</Btn>
          <Btn icon="trash" variant="ghost" onClick={clearLogs}>Clear</Btn>
        </div>
      </div>

      <div className="df-col">
        <Card pad="sm">
          <div className="df-row">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {filters.map((f) => (
                <button key={f.id}
                  onClick={() => setFilter(f.id)}
                  style={{
                    background: filter === f.id ? "var(--accent-soft)" : "transparent",
                    color: filter === f.id ? "var(--accent)" : "var(--text-3)",
                    border: "1px solid " + (filter === f.id ? "transparent" : "var(--border-1)"),
                    fontSize: 12, fontWeight: 500,
                    padding: "5px 10px", borderRadius: 999, cursor: "pointer",
                  }}>{f.label}</button>
              ))}
            </div>
            <div className="df-spacer" />
            <div style={{ position: "relative", width: 240 }}>
              <Icon name="search" size={14} style={{ position: "absolute", left: 10, top: 10, color: "var(--text-3)" }} />
              <input className="df-input" placeholder="Search logs…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ paddingLeft: 30 }} />
            </div>
          </div>
        </Card>

        <LogView entries={filtered} expanded />
      </div>
    </div>
  );
}

function LogView({ entries, expanded }) {
  return (
    <div className="df-log" style={{ maxHeight: expanded ? 520 : 320 }}>
      {entries.length === 0 ? (
        <div className="df-empty" style={{ padding: 40 }}>
          <div className="df-empty-title">No log entries yet</div>
          <div className="df-empty-body">Activity from downloads, dependency installs, and verification runs will appear here.</div>
        </div>
      ) : entries.map(([t, lvl, msg], i) => (
        <div key={i} className="df-log-row" data-level={lvl}>
          <span className="df-log-time">{t}</span>
          <span className="df-log-level" data-level={lvl}>{lvl.toUpperCase()}</span>
          <span className="df-log-msg">{msg}</span>
        </div>
      ))}
    </div>
  );
}

// ─── ABOUT / CREDITS ───────────────────────────────────────────────────
function About() {
  const open = (url) => window.df.external.open(url);
  return (
    <div className="df-screen">
      <div className="df-screen-head">
        <div className="df-screen-head-text">
          <h1 className="df-h1">About & credits</h1>
          <p className="df-sub">DepotForge is a UI layer over an existing community downloader. It does not own, host, or distribute any of the underlying tools — they are fetched from their original public sources at install time.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
        <div className="df-col">
          <Card title="Upstream project" pad="lg">
            <div className="df-credit-block">
              <div className="df-credit-title">HeatedMetal.bat — the original downloader</div>
              The terminal-based workflow this UI replaces. Authored by JVAV; mod project maintained by DataCluster0 / ZeroBytes.
              <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <a className="df-link" onClick={() => open("https://github.com/DataCluster0/HeatedMetal")}>github.com/DataCluster0/HeatedMetal</a>
                <span style={{ color: "var(--text-4)" }}>·</span>
                <a className="df-link" onClick={() => open("https://github.com/JOJOVAV/r6-downloader")}>github.com/JOJOVAV/r6-downloader</a>
                <span style={{ color: "var(--text-4)" }}>·</span>
                <a className="df-link" onClick={() => open("buymeacoffee")}>Support ZeroBytes</a>
              </div>
            </div>
          </Card>

          <Card title="Components fetched at install time" pad="lg">
            <div className="df-col" style={{ gap: 10 }}>
              <div className="df-credit-block">
                <div className="df-credit-title">DepotDownloader</div>
                The official Steam depot client from SteamRE. Pulls game files from the user's owned Steam library.
                <div style={{ marginTop: 6 }}>
                  <a className="df-link" onClick={() => open("https://github.com/SteamRE/DepotDownloader")}>github.com/SteamRE/DepotDownloader</a>
                </div>
              </div>
              <div className="df-credit-block">
                <div className="df-credit-title">.NET 9 SDK</div>
                Microsoft's runtime. Required to execute DepotDownloader.dll.
                <div style={{ marginTop: 6 }}>
                  <a className="df-link" onClick={() => open("dotnetDownload")}>dotnet.microsoft.com</a>
                </div>
              </div>
              <div className="df-credit-block">
                <div className="df-credit-title">7-Zip CLI</div>
                Standalone 7z.exe used to extract mod and dependency archives. Bundled in the upstream R6TBBatchTool repo.
                <div style={{ marginTop: 6 }}>
                  <a className="df-link" onClick={() => open("https://github.com/DataCluster0/R6TBBatchTool")}>github.com/DataCluster0/R6TBBatchTool</a>
                </div>
              </div>
              <div className="df-credit-block">
                <div className="df-credit-title">Helios loader (third-party)</div>
                Custom loader required by the Heated Metal mod. Not signed by Steam and no upstream checksum is published.
                <div style={{ marginTop: 6 }}>
                  <a className="df-link" onClick={() => open("https://github.com/JOJOVAV/r6-downloader")}>github.com/JOJOVAV/r6-downloader</a>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="df-col">
          <Card title="This fork" pad="lg">
            <div style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>
              DepotForge is an Electron-based UI wrapper that calls the same commands the original <span className="df-mono">HeatedMetal.bat</span> uses internally: <span className="df-mono">dotnet</span>, <span className="df-mono">curl</span>, <span className="df-mono">7z</span>, and <span className="df-mono">robocopy</span>. No URLs, manifest IDs, or external components have been changed.
              <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-3)" }}>
                The original BAT file is preserved alongside the app for users who prefer the terminal flow.
              </div>
            </div>
          </Card>

          <Banner tone="info" title="Forkable by design">
            All upstream URLs are kept verbatim in <span className="df-mono">src/main/main.js</span> under the <span className="df-mono">SOURCES</span> object. Forks adding new mods or builds should add to this map; do not replace the existing entries.
          </Banner>

          <Banner tone="warn" title="No safety guarantees">
            This project downloads code from third-party sources at runtime. The platform (Steam) has not signed these components, and DepotForge cannot verify the loader's integrity. Review the source before launching the modded game.
          </Banner>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  Dashboard, Downloader, Installer, Verify, Dependencies, Settings, Logs, About,
  BUILDS, LogView,
});
