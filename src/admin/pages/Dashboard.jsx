// src/admin/pages/Dashboard.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * ===================== API CONTRACT (adjust to your backend) =====================
 * BASE: process.env.REACT_APP_API_BASE || ""
 *
 * GET  /api/admin/overview?range=7d|30d|90d
 *   {
 *     users:   { total, active, new, trend:number[] },
 *     ai:      { quizzes, tokens, avgQuizScore, trend:number[] },
 *     careers: { explores, matches, trend:number[] },
 *     files:   { uploads, storageGB, trend:number[] }
 *   }
 *
 * GET  /api/admin/traffic?range=7d|30d|90d
 *   { daily:[{date:string, sessions:number, signups:number, actives:number}] }
 *
 * GET  /api/admin/funnel?range=7d|30d|90d
 *   { steps:[{key:'visits'|'signups'|'verified'|'active'|'quiz'|'career', label:string, count:number}] }
 *
 * GET  /api/admin/retention?range=90d
 *   { series:[{ period:string, pct:number }] }  // e.g. week labels + retention %
 *
 * GET  /api/admin/trending?limit=6
 *   { items:[{ id, title, count }]}             // careers/programs used/viewed most
 *
 * GET  /api/admin/alerts?limit=6
 *   { items:[{ id, level:'info'|'warn'|'error', title, createdAt }]}
 *
 * GET  /api/admin/recent-signups?limit=6
 *   { items:[{ id, name, email, createdAt, status }]}
 *
 * GET  /api/admin/system/health
 *   { uptimePct:number, apiLatencyMs:number, errorRatePct:number, status:'ok'|'degraded'|'down' }
 *
 * CSV/PDF exports (optional):
 *   GET /api/admin/reports/overview.csv?range=...
 *   GET /api/admin/reports/dashboard.pdf?range=...
 */

const API_BASE = process.env.REACT_APP_API_BASE || "";
const RANGES = [
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
];

export default function Dashboard() {
  const [range, setRange] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [overview, setOverview] = useState(null);
  const [traffic, setTraffic] = useState(null);
  const [funnel, setFunnel] = useState(null);
  const [retention, setRetention] = useState(null);
  const [trending, setTrending] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [signups, setSignups] = useState([]);
  const [health, setHealth] = useState(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const autoRef = useRef(null);
  const navigate = useNavigate();

  // auto refresh timer
  useEffect(() => {
    if (autoRefresh) {
      autoRef.current = setInterval(() => setRefreshKey((n) => n + 1), 30000); // 30s
    } else if (autoRef.current) {
      clearInterval(autoRef.current);
      autoRef.current = null;
    }
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [autoRefresh]);

  // data fetch
  useEffect(() => {
    const ac = new AbortController();
    const q = new URLSearchParams({ range }).toString();
    setLoading(true);
    setErr("");

    Promise.all([
      fetch(`${API_BASE}/api/admin/overview?${q}`, { signal: ac.signal }).then(jsonStrict),
      fetch(`${API_BASE}/api/admin/traffic?${q}`, { signal: ac.signal }).then(jsonStrict),
      fetch(`${API_BASE}/api/admin/funnel?${q}`, { signal: ac.signal }).then(jsonStrict),
      fetch(`${API_BASE}/api/admin/retention?range=90d`, { signal: ac.signal }).then(jsonStrict),
      fetch(`${API_BASE}/api/admin/trending?limit=6`, { signal: ac.signal }).then(jsonStrict),
      fetch(`${API_BASE}/api/admin/alerts?limit=6`, { signal: ac.signal }).then(jsonStrict),
      fetch(`${API_BASE}/api/admin/recent-signups?limit=6`, { signal: ac.signal }).then(jsonStrict),
      fetch(`${API_BASE}/api/admin/system/health`, { signal: ac.signal }).then(jsonStrict),
    ])
      .then(([ov, tr, fu, re, trn, al, su, he]) => {
        setOverview(ov || null);
        setTraffic(tr || null);
        setFunnel(fu || null);
        setRetention(re || null);
        setTrending(Array.isArray(trn?.items) ? trn.items : []);
        setAlerts(Array.isArray(al?.items) ? al.items : []);
        setSignups(Array.isArray(su?.items) ? su.items : []);
        setHealth(he || null);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setErr(e.message || "Failed to load dashboard.");
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [range, refreshKey]);

  const kpis = useMemo(() => buildKpis(overview), [overview]);

  return (
    <div className="space-y-8">
      {/* Header / Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-300">Live operational and product analytics for EduPath</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-3 py-2 rounded-lg bg-black/30 border border-white/20 text-white"
            aria-label="Date range"
          >
            {RANGES.map((r) => (
              <option value={r.id} key={r.id}>{r.label}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-gray-200">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto refresh
          </label>
          <button
            onClick={() => setRefreshKey((n) => n + 1)}
            className="px-3 py-2 rounded-lg bg-white/10 text-gray-200 hover:bg-white/20 transition"
          >
            Refresh
          </button>
          <a
            href={`${API_BASE}/api/admin/reports/overview.csv?range=${range}`}
            className="px-3 py-2 rounded-lg bg-white/10 text-gray-200 hover:bg-white/20"
          >
            Download CSV
          </a>
          <a
            href={`${API_BASE}/api/admin/reports/dashboard.pdf?range=${range}`}
            className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
          >
            Export PDF
          </a>
        </div>
      </div>

      {/* Global error */}
      {err && (
        <div className="p-4 rounded-lg border border-red-400/30 bg-red-500/10 text-red-200">
          {err}
        </div>
      )}

      {/* KPI Row */}
      <section className="grid md:grid-cols-4 gap-6">
        {kpis.map((k) => (
          <KpiCard key={k.key} title={k.title} value={k.value} sub={k.sub} tone={k.tone} data={k.trend} />
        ))}
        {loading && kpis.length === 0 && (
          <>
            <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
          </>
        )}
      </section>

      {/* Main content grid */}
      <section className="grid xl:grid-cols-3 gap-6">
        {/* Left: Traffic + Funnel + Retention */}
        <div className="xl:col-span-2 space-y-6">
          <Panel title="Traffic & Engagement">
            {!traffic?.daily?.length && !loading ? (
              <EmptyState message="No traffic in this range." />
            ) : (
              <TrafficChart data={traffic?.daily || []} />
            )}
          </Panel>

          <Panel title="Conversion Funnel">
            {!funnel?.steps?.length && !loading ? (
              <EmptyState message="No funnel data." />
            ) : (
              <Funnel steps={funnel?.steps || []} />
            )}
          </Panel>

          <Panel title="Retention">
            {!retention?.series?.length && !loading ? (
              <EmptyState message="No retention yet." />
            ) : (
              <RetentionChart points={retention?.series || []} />
            )}
          </Panel>
        </div>

        {/* Right: Health + Alerts + Trending + Signups + Quick Actions */}
        <div className="space-y-6">
          <Panel title="System Health">
            {!health && !loading ? (
              <EmptyState message="No health data." />
            ) : (
              <div className="space-y-3">
                <HealthRow label="Status" value={health?.status || "unknown"} />
                <HealthRow label="Uptime" value={fmtPct(health?.uptimePct)} />
                <HealthRow label="API Latency" value={health?.apiLatencyMs != null ? `${health.apiLatencyMs} ms` : "—"} />
                <HealthRow label="Error Rate" value={fmtPct(health?.errorRatePct)} />
              </div>
            )}
          </Panel>

          <Panel title="Alerts">
            {!alerts.length && !loading ? (
              <EmptyState message="No alerts." />
            ) : (
              <ul className="space-y-2">
                {alerts.map((a) => (
                  <li key={a.id} className={`p-3 rounded-lg border ${alertCls(a.level)}`}>
                    <div className="flex items-center justify-between">
                      <div className="text-white">{a.title}</div>
                      <div className="text-xs text-gray-400">{fmtWhen(a.createdAt)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Trending Careers / Programs">
            {!trending.length && !loading ? (
              <EmptyState message="No trending items." />
            ) : (
              <ul className="space-y-2">
                {trending.map((t) => (
                  <li key={t.id} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="text-gray-200">{t.title}</span>
                    <span className="text-gray-400 text-sm">{num(t.count)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Recent Signups">
            {!signups.length && !loading ? (
              <EmptyState message="No signups yet." />
            ) : (
              <ul className="space-y-2">
                {signups.map((s) => (
                  <li key={s.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="text-white font-medium">{s.name || "—"}</div>
                      <div className="text-xs text-gray-400">{fmtWhen(s.createdAt)}</div>
                    </div>
                    <div className="text-gray-300 text-sm">{s.email}</div>
                    <div className="mt-1">
                      <StatusBadge status={s.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3">
              <button
                onClick={() => navigate("/admin/users")}
                className="text-sm text-cyan-300 hover:text-cyan-200"
              >
                Manage users →
              </button>
            </div>
          </Panel>

          <Panel title="Quick Actions">
            <div className="grid grid-cols-2 gap-3">
              <ActionButton label="Invite User" onClick={() => navigate("/admin/users?invite=1")} />
              <ActionButton label="Create Announcement" onClick={() => navigate("/admin/settings#announcements")} />
              <ActionButton label="Manage Events" onClick={() => navigate("/admin/settings#events")} />
              <ActionButton label="Security Center" onClick={() => navigate("/admin/settings#security")} />
              <ActionButton label="Integrations" onClick={() => navigate("/admin/settings#integrations")} />
              <ActionButton label="Branding" onClick={() => navigate("/admin/settings#branding")} />
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}

/* ===================== UI / helpers ===================== */

async function jsonStrict(res) {
  if (!res.ok) {
    const t = await res.text().catch(() => `${res.status} ${res.statusText}`);
    throw new Error(t || `${res.status} ${res.statusText}`);
  }
  try { return await res.json(); } catch { return null; }
}

function buildKpis(ov) {
  if (!ov) return [];
  return [
    {
      key: "users",
      title: "Users",
      value: num(ov?.users?.total),
      sub: `${num(ov?.users?.active)} active · ${num(ov?.users?.new)} new`,
      trend: ov?.users?.trend || [],
      tone: "from-cyan-500/20 to-blue-500/20",
    },
    {
      key: "ai",
      title: "AI Usage",
      value: `${num(ov?.ai?.quizzes)} quizzes`,
      sub: `${num(ov?.ai?.tokens)} tokens · Avg score ${pct(ov?.ai?.avgQuizScore)}`,
      trend: ov?.ai?.trend || [],
      tone: "from-purple-500/20 to-pink-500/20",
    },
    {
      key: "careers",
      title: "Career Explorer",
      value: `${num(ov?.careers?.explores)} explores`,
      sub: `${num(ov?.careers?.matches)} matches`,
      trend: ov?.careers?.trend || [],
      tone: "from-emerald-500/20 to-green-500/20",
    },
    {
      key: "files",
      title: "Files",
      value: `${num(ov?.files?.uploads)} uploads`,
      sub: `${(ov?.files?.storageGB ?? 0).toFixed(2)} GB stored`,
      trend: ov?.files?.trend || [],
      tone: "from-orange-500/20 to-amber-500/20",
    },
  ];
}

function num(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat().format(n);
}
function pct(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return `${(n * 100).toFixed(0)}%`;
}
function fmtPct(n) {
  if (n == null || Number.isNaN(n)) return "—";
  // support both 0-1 and 0-100 inputs
  const v = n <= 1 ? n * 100 : n;
  return `${v.toFixed(2)}%`;
}
function fmtWhen(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString();
}

function Panel({ title, children }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 animate-pulse">
      <div className="h-4 w-24 bg-white/20 rounded mb-3" />
      <div className="h-8 w-32 bg-white/20 rounded" />
      <div className="mt-4 h-10 w-full bg-white/10 rounded" />
    </div>
  );
}

function EmptyState({ message }) {
  return <div className="text-gray-400 text-sm">{message}</div>;
}

function KpiCard({ title, value, sub, tone, data }) {
  return (
    <div className={`bg-gradient-to-br ${tone} p-6 rounded-xl border border-white/20`}>
      <div className="text-gray-300">{title}</div>
      <div className="text-3xl md:text-4xl font-bold text-white mt-1">{value ?? "—"}</div>
      <div className="text-gray-300 text-sm">{sub || "—"}</div>
      <div className="mt-4">
        <LineSparkline values={Array.isArray(data) ? data : []} height={40} />
      </div>
    </div>
  );
}

/* --- Tiny SVG charts (no external libs) --- */

function LineSparkline({ values = [], height = 40 }) {
  const width = 240;
  const pad = 4;
  if (!values.length) return <div className="h-10 bg-black/20 rounded" />;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = Math.max(max - min, 1);
  const stepX = (width - pad * 2) / (values.length - 1);
  const pts = values.map((v, i) => {
    const x = pad + i * stepX;
    const y = pad + (1 - (v - min) / span) * (height - pad * 2);
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-10">
      <polyline fill="none" stroke="currentColor" className="text-cyan-300/80" strokeWidth="2" points={pts.join(" ")} />
    </svg>
  );
}

function TrafficChart({ data }) {
  // bars for sessions, line for signups, thin line for actives
  const width = 700, height = 180, pad = 24;
  const sessions = data.map(d => d.sessions || 0);
  const signups = data.map(d => d.signups || 0);
  const actives = data.map(d => d.actives || 0);
  const max = Math.max(...sessions, ...signups, ...actives, 1);
  const n = data.length;
  const barW = Math.max(4, (width - pad * 2) / Math.max(1, n) - 6);

  const x = (i) => pad + i * (barW + 6);
  const y = (v) => pad + (1 - v / max) * (height - pad * 2);

  const path = (arr) =>
    arr.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i) + barW / 2} ${y(v)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[180px]">
      {/* Sessions (bars) */}
      {sessions.map((v, i) => (
        <rect key={i} x={x(i)} y={y(v)} width={barW} height={Math.max(0, height - pad - y(v))} className="fill-purple-300/70" rx="3" />
      ))}
      {/* Signups (line) */}
      <path d={path(signups)} className="fill-none stroke-cyan-300/90" strokeWidth="2.5" />
      {/* Actives (thin line) */}
      <path d={path(actives)} className="fill-none stroke-emerald-300/80" strokeWidth="1.5" />
    </svg>
  );
}

function Funnel({ steps = [] }) {
  if (!steps.length) return <div className="h-24 bg-black/20 rounded" />;
  const max = Math.max(...steps.map(s => s.count || 0), 1);
  return (
    <div className="space-y-2">
      {steps.map((s, i) => {
        const pct = (100 * (s.count || 0)) / max;
        return (
          <div key={s.key || i}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-gray-200">{s.label}</div>
              <div className="text-gray-400 text-sm">{num(s.count)}</div>
            </div>
            <div className="h-3 rounded-lg bg-white/10 overflow-hidden border border-white/10">
              <div
                className={`h-full bg-gradient-to-r ${i % 2 ? "from-cyan-600 to-blue-600" : "from-purple-600 to-pink-600"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RetentionChart({ points = [] }) {
  if (!points.length) return <div className="h-24 bg-black/20 rounded" />;
  const width = 700, height = 160, pad = 20;
  const vals = points.map(p => p.pct ?? 0);
  const max = Math.max(...vals, 1);
  const min = Math.min(...vals, 0);
  const span = Math.max(max - min, 1);
  const stepX = (width - pad * 2) / Math.max(1, points.length - 1);
  const pts = points.map((p, i) => {
    const x = pad + i * stepX;
    const y = pad + (1 - (p.pct - min) / span) * (height - pad * 2);
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[160px]">
      <polyline points={pts.join(" ")} className="fill-none stroke-amber-300/90" strokeWidth="2.5" />
    </svg>
  );
}

function StatusBadge({ status }) {
  const map = {
    active: "text-green-300 bg-green-500/15 border-green-500/30",
    invited: "text-blue-300 bg-blue-500/15 border-blue-500/30",
    pending: "text-yellow-300 bg-yellow-500/15 border-yellow-500/30",
    disabled: "text-red-300 bg-red-500/15 border-red-500/30",
  };
  const cls = map[status] || "text-gray-300 bg-white/10 border-white/20";
  return <span className={`px-2 py-1 rounded border text-xs ${cls}`}>{title(status) || "Unknown"}</span>;
}

function ActionButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-2 rounded-lg bg-white/10 text-gray-200 hover:bg-white/20 transition text-sm"
    >
      {label}
    </button>
  );
}

function HealthRow({ label, value }) {
  const color =
    typeof value === "string"
      ? value === "ok"
        ? "text-green-400"
        : value === "degraded"
        ? "text-yellow-400"
        : value === "down"
        ? "text-red-400"
        : "text-gray-300"
      : "text-gray-300";
  return (
    <div className="flex items-center justify-between">
      <div className="text-gray-300">{label}</div>
      <div className={`font-medium ${color}`}>{value ?? "—"}</div>
    </div>
  );
}

function alertCls(level) {
  if (level === "error") return "bg-red-500/10 border-red-400/30";
  if (level === "warn")  return "bg-yellow-500/10 border-yellow-400/30";
  return "bg-white/5 border-white/10";
}

function title(s) {
  if (!s) return "";
  return String(s).replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}
