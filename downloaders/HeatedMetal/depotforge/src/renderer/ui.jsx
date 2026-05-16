// DepotForge — shared UI primitives (icons + small components)
// Exposes Icon, Btn, Card, Banner, Badge, Toggle, Check, Modal, Progress, Tabs, KPI, Field

const Icon = ({ name, size = 16, stroke = 1.6, style }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style,
  };
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>,
    download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
    package: <><path d="m21 8-9 4-9-4 9-4 9 4Z" /><path d="M3 8v8l9 4 9-4V8" /><path d="m12 12 0 9" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
    plug: <><path d="M9 2v6" /><path d="M15 2v6" /><path d="M5 8h14v3a5 5 0 0 1-5 5h-4a5 5 0 0 1-5-5V8Z" /><path d="M12 16v6" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></>,
    terminal: <><path d="m5 7 5 5-5 5" /><path d="M13 17h6" /></>,
    check: <path d="m5 12 5 5 9-11" />,
    x: <><path d="M6 6l12 12" /><path d="M18 6l-12 12" /></>,
    alert: <><path d="M12 9v4" /><path d="M12 17h0" /><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 8h0" /><path d="M11 12h1v5h1" /></>,
    play: <path d="M6 4v16l13-8z" fill="currentColor" stroke="none" />,
    pause: <><rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/></>,
    folder: <><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" /></>,
    refresh: <><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" /><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" /><path d="M21 3v5h-5" /><path d="M3 21v-5h5" /></>,
    chevron: <path d="m9 6 6 6-6 6" />,
    chevronDown: <path d="m6 9 6 6 6-6" />,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
    eyeOff: <><path d="M9.9 5.1A10 10 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.4 4.3" /><path d="M6.6 6.6A17 17 0 0 0 2 12s4 7 10 7a10 10 0 0 0 5.4-1.6" /><path d="m3 3 18 18" /></>,
    copy: <><rect x="9" y="9" width="11" height="11" rx="1.5" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></>,
    export: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M17 8l-5-5-5 5" /><path d="M12 3v12" /></>,
    trash: <><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M10 11v6M14 11v6" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    filter: <path d="M3 5h18l-7 9v6l-4-2v-4Z" />,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
    external: <><path d="M14 3h7v7" /><path d="M21 3 10 14" /><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /></>,
    cpu: <><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M2 10h2M2 14h2M20 10h2M20 14h2M10 2v2M14 2v2M10 20v2M14 20v2" /></>,
    activity: <path d="M3 12h4l3-9 4 18 3-9h4" />,
    zap: <path d="M13 2 3 14h7l-1 8 10-12h-7z" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    sparkle: <><path d="M12 3v5M12 16v5M3 12h5M16 12h5" /><path d="m5.6 5.6 3.5 3.5M14.9 14.9l3.5 3.5M5.6 18.4l3.5-3.5M14.9 9.1l3.5-3.5" /></>,
    book: <><path d="M4 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H4Z" /><path d="M20 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7Z" /></>,
  };
  return <svg {...common}>{paths[name] || <circle cx="12" cy="12" r="6" />}</svg>;
};

const Btn = ({ children, variant, size, icon, iconRight, onClick, disabled, type = "button", style, full }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="df-btn"
    data-variant={variant}
    data-size={size}
    style={{ width: full ? "100%" : undefined, ...style }}
  >
    {icon && <Icon name={icon} size={size === "lg" ? 16 : 14} />}
    {children}
    {iconRight && <Icon name={iconRight} size={size === "lg" ? 16 : 14} />}
  </button>
);

const Card = ({ title, action, pad, children, style }) => (
  <div className="df-card" data-pad={pad} style={style}>
    {(title || action) && (
      <div className="df-card-title">
        {title && <span>{title}</span>}
        {action && <div style={{ marginLeft: "auto" }}>{action}</div>}
      </div>
    )}
    {children}
  </div>
);

const Badge = ({ tone, dot, children }) => (
  <span className="df-badge" data-tone={tone}>
    {dot && <span className="df-dot" />}
    {children}
  </span>
);

const Banner = ({ tone = "info", title, children, action }) => {
  const iconName = { warn: "alert", err: "alert", ok: "check", info: "info" }[tone] || "info";
  return (
    <div className="df-banner" data-tone={tone}>
      <div className="df-banner-icon"><Icon name={iconName} size={18} /></div>
      <div className="df-banner-text">
        {title && <div className="df-banner-title">{title}</div>}
        <div className="df-banner-body">{children}</div>
      </div>
      {action && <div style={{ marginLeft: 8 }}>{action}</div>}
    </div>
  );
};

const Toggle = ({ value, onChange }) => (
  <button
    type="button"
    className="df-toggle"
    data-on={value}
    onClick={() => onChange(!value)}
    aria-pressed={value}
  />
);

const Check = ({ checked, onChange, children }) => (
  <label className="df-check">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span className="df-check-box" />
    <span>{children}</span>
  </label>
);

const Field = ({ label, hint, children, after }) => (
  <div>
    {label && <label className="df-label">{label}</label>}
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <div style={{ flex: 1 }}>{children}</div>
      {after}
    </div>
    {hint && <div className="df-hint">{hint}</div>}
  </div>
);

const Progress = ({ value, tone, indeterminate }) => (
  <div className="df-prog" data-tone={tone}>
    <div className="df-prog-fill" style={{ width: indeterminate ? "40%" : `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
);

const KPI = ({ label, value, meta, tone }) => (
  <div className="df-kpi">
    <div className="df-kpi-label">{label}</div>
    <div className="df-kpi-value" style={tone ? { color: `var(--${tone})` } : undefined}>{value}</div>
    {meta && <div className="df-kpi-meta">{meta}</div>}
  </div>
);

const Tabs = ({ tabs, active, onChange }) => (
  <div className="df-tabs">
    {tabs.map((t) => (
      <button
        key={t.id || t}
        className="df-tab"
        data-active={(t.id || t) === active}
        onClick={() => onChange(t.id || t)}
      >
        {t.label || t}
      </button>
    ))}
  </div>
);

const Modal = ({ title, children, primary, primaryLabel = "Continue", primaryVariant = "primary", onClose, danger, dismissLabel = "Cancel" }) => (
  <div className="df-modal-backdrop" onClick={onClose}>
    <div className="df-modal" onClick={(e) => e.stopPropagation()}>
      <div className="df-modal-head">
        <h3 className="df-modal-title">{title}</h3>
      </div>
      <div className="df-modal-body">{children}</div>
      <div className="df-modal-foot">
        <Btn variant="ghost" onClick={onClose}>{dismissLabel}</Btn>
        {primary && (
          <Btn variant={danger ? "danger" : primaryVariant} onClick={primary}>
            {primaryLabel}
          </Btn>
        )}
      </div>
    </div>
  </div>
);

const Seg = ({ value, options, onChange }) => (
  <div className="df-seg">
    {options.map((o) => (
      <button
        key={o.value}
        data-on={value === o.value}
        onClick={() => onChange(o.value)}
      >
        {o.label}
      </button>
    ))}
  </div>
);

const StatusRow = ({ name, meta, right }) => (
  <div className="df-status-row">
    <div className="df-row-text df-flex-1">
      <span className="df-row-name">{name}</span>
      {meta && <span className="df-row-meta">{meta}</span>}
    </div>
    <div>{right}</div>
  </div>
);

const Setting = ({ name, desc, control }) => (
  <div className="df-setting">
    <div className="df-setting-text">
      <div className="df-setting-name">{name}</div>
      {desc && <div className="df-setting-desc">{desc}</div>}
    </div>
    <div className="df-setting-control">{control}</div>
  </div>
);

// Format helpers
const fmtBytes = (gb) => `${gb.toFixed(1)} GB`;
const fmtSpeed = (mbps) => `${mbps.toFixed(1)} MiB/s`;
const fmtTime = (secs) => {
  if (!isFinite(secs) || secs < 0) return "—";
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = Math.floor(secs % 60);
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m ${s}s`;
  return `${s}s`;
};

Object.assign(window, {
  Icon, Btn, Card, Badge, Banner, Toggle, Check, Field, Progress, KPI, Tabs, Modal, Seg, StatusRow, Setting,
  fmtBytes, fmtSpeed, fmtTime,
});
