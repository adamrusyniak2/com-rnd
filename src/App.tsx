import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import {
  Rocket,
  Sparkles,
  Gauge,
  Cpu,
  Database,
  Network,
  GraduationCap,
  CalendarClock,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

const Section = ({ id, label, subtitle, children }: { id?: string; label: string; subtitle?: string; children: React.ReactNode }) => (
  <section id={id} className="relative py-16 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 ring-1 ring-rose-500/40 px-3 py-1 text-rose-200 text-xs tracking-wide">
          <Sparkles size={14} className="opacity-80" /> {label}
        </div>
        {subtitle && (
          <h2 className="mt-4 text-3xl sm:text-4xl font-semibold text-white">
            {subtitle}
          </h2>
        )}
      </motion.div>
      {children}
    </div>
  </section>
);

function useWeightLossData(k: number, tMax: number, noise = 0) {
  return useMemo(() => {
    const pts: { t: number; y: number; yLo: number; yHi: number }[] = [];
    const step = Math.max(1, Math.floor(tMax / 60));
    for (let t = 0; t <= tMax; t += step) {
      const ideal = Math.exp(-k * t);
      const eps = noise ? (Math.random() - 0.5) * 2 * noise * ideal : 0;
      const y = Math.max(0, ideal + eps);
      pts.push({ t, y, yLo: Math.max(0, y * 0.9), yHi: Math.min(1, y * 1.1) });
    }
    return pts;
  }, [k, tMax, noise]);
}

const WeightLossProjection: React.FC = () => {
  const [k, setK] = useState(0.03);
  const [noise, setNoise] = useState(0.02);
  const t90 = useMemo(() => Math.log(10) / k, [k]);
  const tMax = Math.ceil(t90 * 1.2);
  const data = useWeightLossData(k, tMax, noise);

  return (
    <div className="grid lg:grid-cols-5 gap-8 items-start">
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl bg-slate-900/70 ring-1 ring-white/10 p-6">
          <h3 className="text-xl font-semibold text-white">Weight Loss Projection</h3>
          <p className="mt-2 text-slate-300 text-sm">
            Predict EOL at <span className="text-rose-300">90% weight loss</span>. This
            interactive model uses an exponential decay approximation for demo
            purposes and showcases uncertainty bands and latency-free updates.
          </p>
          <div className="mt-6 space-y-5">
            <div>
              <label className="text-slate-200 text-sm">Decay rate (k)</label>
              <input
                type="range"
                min={0.005}
                max={0.1}
                step={0.001}
                value={k}
                onChange={(e) => setK(parseFloat(e.target.value))}
                className="w-full accent-rose-500"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>0.005</span>
                <span>{k.toFixed(3)}</span>
                <span>0.100</span>
              </div>
            </div>
            <div>
              <label className="text-slate-200 text-sm">Noise</label>
              <input
                type="range"
                min={0}
                max={0.1}
                step={0.005}
                value={noise}
                onChange={(e) => setNoise(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>0</span>
                <span>{noise.toFixed(3)}</span>
                <span>0.100</span>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl bg-black/30 p-4 ring-1 ring-white/10">
              <div className="text-slate-400">T(EOL @ 90%)</div>
              <div className="text-2xl font-semibold text-rose-300">
                {t90.toFixed(1)}
                <span className="text-slate-400 text-sm ml-1">units</span>
              </div>
            </div>
            <div className="rounded-xl bg-black/30 p-4 ring-1 ring-white/10">
              <div className="text-slate-400">Coverage SLO</div>
              <div className="text-2xl font-semibold text-emerald-300">95% ±5%</div>
            </div>
          </div>
        </div>
        <ul className="grid gap-3 text-sm text-slate-300">
          <li className="flex gap-2 items-start"><ShieldCheck className="mt-0.5" size={16}/> Azure App Service / Static Web Apps ready</li>
          <li className="flex gap-2 items-start"><ShieldCheck className="mt-0.5" size={16}/> OAuth/Entra ID integration path</li>
          <li className="flex gap-2 items-start"><ShieldCheck className="mt-0.5" size={16}/> SharePoint Excel templates supported</li>
        </ul>
      </div>
      <div className="lg:col-span-3 rounded-2xl bg-slate-900/70 ring-1 ring-white/10 p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="pi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF12" />
              <XAxis dataKey="t" stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
              <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} domain={[0, 1]} />
              <Tooltip contentStyle={{ background: "#0b1020", border: "1px solid #ffffff20", borderRadius: 12, color: "white" }} />
              <Area type="monotone" dataKey="yHi" stroke="none" fill="url(#pi)" />
              <Area type="monotone" dataKey="yLo" stroke="none" fill="url(#pi)" />
              <Line type="monotone" dataKey="y" stroke="#ef4444" dot={false} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-xs text-slate-400">
          Demo: exponential decay with synthetic noise. Full solution uses ensemble modeling (SciPy + GBM), auto-calibration and parity checks vs legacy outputs.
        </div>
      </div>
    </div>
  );
};

const SAMPLE_FEATURES: Record<string, Record<string, number>> = {
  "Day 1": { Freshness: 0.24, Sillage: 0.18, Longevity: 0.12, Price: 0.06, Brand: 0.05, "Eco Score": 0.08, Package: 0.10, Texture: 0.17 },
  "Day 7": { Freshness: 0.18, Sillage: 0.22, Longevity: 0.16, Price: 0.05, Brand: 0.04, "Eco Score": 0.09, Package: 0.08, Texture: 0.18 },
  "Day 14": { Freshness: 0.15, Sillage: 0.25, Longevity: 0.19, Price: 0.04, Brand: 0.03, "Eco Score": 0.10, Package: 0.07, Texture: 0.17 },
};

const DriversOfLiking: React.FC = () => {
  const [tp, setTp] = useState<keyof typeof SAMPLE_FEATURES>("Day 1");
  const [noise, setNoise] = useState(0);
  const features = useMemo(() => {
    const base = SAMPLE_FEATURES[tp];
    return Object.entries(base).map(([k, v]) => ({ name: k, value: Math.max(0, v + (Math.random() - 0.5) * 2 * noise) }));
  }, [tp, noise]);

  const stability = useMemo(() => {
    const ref = Object.entries(SAMPLE_FEATURES["Day 1"]).sort((a, b) => b[1] - a[1]).map(([n]) => n);
    const order = [...features].sort((a, b) => b.value - a.value).map((f) => f.name);
    let matches = 0;
    for (let i = 0; i < order.length; i++) {
      if (order[i] === ref[i]) { matches += 1; }
    }
    return (matches / order.length) * 0.3 + 0.7 - noise * 0.5;
  }, [features, noise]);

  return (
    <div className="grid lg:grid-cols-5 gap-8 items-start">
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl bg-slate-900/70 ring-1 ring-white/10 p-6">
          <h3 className="text-xl font-semibold text-white">Drivers of Liking</h3>
          <p className="mt-2 text-slate-300 text-sm">
            Explore SHAP-style feature importance across timepoints. Toggle noise to simulate sampling variance and track a stability indicator.
          </p>
          <div className="mt-6 space-y-5">
            <div>
              <label className="text-slate-200 text-sm">Timepoint</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(["Day 1", "Day 7", "Day 14"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setTp(d)}
                    className={`rounded-xl px-3 py-2 text-sm ring-1 transition ${tp === d ? "bg-indigo-500/30 ring-indigo-400 text-white" : "bg-black/30 ring-white/10 text-slate-300 hover:bg-white/5"}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-slate-200 text-sm">Noise</label>
              <input
                type="range"
                min={0}
                max={0.08}
                step={0.005}
                value={noise}
                onChange={(e) => setNoise(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>0</span>
                <span>{noise.toFixed(3)}</span>
                <span>0.080</span>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl bg-black/30 p-4 ring-1 ring-white/10">
              <div className="text-slate-400">Stability (τ proxy)</div>
              <div className="text-2xl font-semibold text-indigo-300">{Math.max(0.5, Math.min(1, stability)).toFixed(2)}</div>
            </div>
            <div className="rounded-xl bg-black/30 p-4 ring-1 ring-white/10">
              <div className="text-slate-400">Users Enabled</div>
              <div className="text-2xl font-semibold text-emerald-300">100+</div>
            </div>
          </div>
        </div>
        <ul className="grid gap-3 text-sm text-slate-300">
          <li className="flex gap-2 items-start"><ShieldCheck className="mt-0.5" size={16}/> Auto-ingest → SHAP → uplift pipeline</li>
          <li className="flex gap-2 items-start"><ShieldCheck className="mt-0.5" size={16}/> Golden dataset parity harness</li>
          <li className="flex gap-2 items-start"><ShieldCheck className="mt-0.5" size={16}/> Optional LIME / counterfactuals</li>
        </ul>
      </div>
      <div className="lg:col-span-3 rounded-2xl bg-slate-900/70 ring-1 ring-white/10 p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[...features].sort((a, b) => b.value - a.value)} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF12" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
              <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ background: "#0b1020", border: "1px solid #ffffff20", borderRadius: 12, color: "white" }} />
              <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-xs text-slate-400">
          Demo: synthetic importances. Full solution runs CatBoost/LightGBM with SHAP stability targets (Kendall τ ≥ 0.7 across CV folds).
        </div>
      </div>
    </div>
  );
};

const CapabilityRow: React.FC<{ name: string; classic: boolean; fabric: boolean }> = ({ name, classic, fabric }) => (
  <div className="grid grid-cols-3 items-center py-2 px-3 rounded-xl hover:bg-white/5 transition">
    <div className="text-slate-200 text-sm">{name}</div>
    <div className="text-center text-xs">
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ring-1 ${classic ? "bg-rose-500/15 ring-rose-400/30 text-rose-200" : "bg-slate-800 ring-white/10 text-slate-400"}`}>{classic ? "Yes" : "—"}</span>
    </div>
    <div className="text-center text-xs">
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ring-1 ${fabric ? "bg-indigo-500/20 ring-indigo-400/30 text-indigo-200" : "bg-slate-800 ring-white/10 text-slate-400"}`}>{fabric ? "Yes" : "—"}</span>
    </div>
  </div>
);

const AzureComparison: React.FC = () => {
  const rows = [
    { name: "OneLake (unified storage)", classic: false, fabric: true },
    { name: "Delta / Lakehouse", classic: true, fabric: true },
    { name: "Pipelines / ADF", classic: true, fabric: true },
    { name: "AutoML / MLflow", classic: true, fabric: true },
    { name: "Real‑Time Intelligence (KQL)", classic: false, fabric: true },
    { name: "Embedded Analytics (PBI)", classic: true, fabric: true },
    { name: "Shortcuts (no-copy links)", classic: false, fabric: true },
    { name: "MLOps registry", classic: true, fabric: true },
  ];
  return (
    <div className="rounded-2xl bg-slate-900/70 ring-1 ring-white/10 p-6">
      <div className="grid grid-cols-3 text-xs text-slate-400 uppercase tracking-wider pb-2 mb-2 border-b border-white/10">
        <div>Capability</div>
        <div className="text-center">Azure Classic</div>
        <div className="text-center">Microsoft Fabric</div>
      </div>
      <div className="space-y-1">
        {rows.map((r) => (
          <CapabilityRow key={r.name} {...r} />
        ))}
      </div>
      <div className="mt-4 text-xs text-slate-400">
        Note: Fabric unifies storage and governance, while Classic offers modular services. We implement the best-fit path and ensure parity before cutover.
      </div>
    </div>
  );
};

const MILESTONES = [
  { title: "Kick‑off & Discovery", weeks: 2, done: 1 },
  { title: "Data Engineering", weeks: 5, done: 2 },
  { title: "Orchestration & QA", weeks: 3, done: 1 },
  { title: "Weight Loss App", weeks: 3, done: 0 },
  { title: "DOL App", weeks: 3, done: 0 },
  { title: "Governance & Handover", weeks: 2, done: 0 },
];

const Timeline: React.FC = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    {MILESTONES.map((m, i) => {
      const pct = Math.min(100, Math.round((m.done / m.weeks) * 100));
      return (
        <motion.div
          key={m.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="rounded-2xl bg-slate-900/70 ring-1 ring-white/10 p-5"
        >
          <div className="flex items-center gap-3 text-white">
            <CalendarClock className="text-rose-300" />
            <div>
              <div className="font-semibold">{m.title}</div>
              <div className="text-xs text-slate-400">{m.weeks} weeks</div>
            </div>
          </div>
          <div className="mt-4 h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-400"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-slate-400">Progress {pct}%</div>
        </motion.div>
      );
    })}
  </div>
);

const CTA: React.FC = () => (
  <div className="relative rounded-3xl overflow-hidden ring-1 ring-white/10 bg-gradient-to-br from-rose-500/20 via-indigo-600/10 to-black p-[1px]">
    <div className="rounded-3xl bg-[#0B1020]/80 p-8 md:p-12">
      <div className="grid md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-2">
          <h3 className="text-2xl md:text-3xl font-semibold text-white">Ready for a sandbox or pilot?</h3>
          <p className="mt-2 text-slate-300 max-w-2xl">
            We can spin up a secure, Entra‑integrated demo in your tenant, validate parity with your legacy outputs, and hand you a roadmap to production.
          </p>
        </div>
        <div className="flex justify-start md:justify-end">
          <a
            href="https://cloudsonmars.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-lg shadow-rose-900/30 transition"
          >
            Open website <ChevronRight size={18} />
          </a>
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-200 relative">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-96 w-96 bg-rose-500/20 blur-3xl rounded-full" />
        <div className="absolute top-1/3 -left-40 h-96 w-96 bg-indigo-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-1/3 h-64 w-64 bg-amber-400/10 blur-3xl rounded-full" />
      </div>

      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-[#0B1020]/70 bg-[#0B1020]/80 ring-1 ring-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="text-rose-400" />
            <span className="font-semibold text-white">Clouds on Mars</span>
            <span className="text-slate-400 hidden sm:inline">· R&D Advanced Analytics</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#apps" className="hover:text-white/90">Apps</a>
            <a href="#platform" className="hover:text-white/90">Platform</a>
            <a href="#timeline" className="hover:text-white/90">Timeline</a>
          </nav>
        </div>
      </header>

      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-6xl font-semibold text-white tracking-tight"
          >
            Launch your data into a new orbit
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="mt-4 text-lg text-slate-300 max-w-3xl"
          >
            From migration to AI‑ready apps: Weight Loss Projection and Drivers of Liking—rebuilt for Azure & Fabric with governance, parity, and scale.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a href="#apps" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-lg shadow-rose-900/30 transition">
              Explore interactive demos
            </a>
            <a href="#platform" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-medium ring-1 ring-white/20 transition">
              See the platform
            </a>
          </motion.div>
          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {[{ label: "Solutions delivered", value: "600+" }, { label: "Data & AI experts", value: "100+" }, { label: "Global customers", value: "50+" }].map((s) => (
              <div key={s.label} className="rounded-2xl bg-black/30 ring-1 ring-white/10 p-5">
                <div className="text-3xl font-semibold text-white">{s.value}</div>
                <div className="text-sm text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Section id="apps" label="Interactive" subtitle="Apps, extended beyond the deck">
        <div className="grid lg:grid-cols-2 gap-10">
          <WeightLossProjection />
          <DriversOfLiking />
        </div>
      </Section>

      <Section id="platform" label="Architecture" subtitle="Azure today, Fabric tomorrow—your data, one platform">
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          <div className="rounded-2xl bg-slate-900/70 ring-1 ring-white/10 p-6 space-y-5">
            <div className="flex items-center gap-3 text-white">
              <Database className="text-rose-300" />
              <div>
                <div className="font-semibold">Azure Classic</div>
                <div className="text-xs text-slate-400">ADF · Databricks · MLflow · App Service · API Mgmt</div>
              </div>
            </div>
            <AzureComparison />
          </div>
          <div className="rounded-2xl bg-slate-900/70 ring-1 ring-white/10 p-6 space-y-5">
            <div className="flex items-center gap-3 text-white">
              <Network className="text-indigo-300" />
              <div>
                <div className="font-semibold">Microsoft Fabric</div>
                <div className="text-xs text-slate-400">OneLake · Lakehouse · Data Pipelines · RTI · PBI</div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: <ShieldCheck className="text-emerald-300" />, t: "Unified governance" },
                { icon: <Cpu className="text-rose-300" />, t: "Built‑in Spark & ML" },
                { icon: <Gauge className="text-amber-300" />, t: "Performance at scale" },
                { icon: <GraduationCap className="text-indigo-300" />, t: "Self‑service + pro‑dev" },
              ].map((b, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl bg-black/30 ring-1 ring-white/10 p-4 flex items-center gap-3">
                  {b.icon}
                  <div className="text-sm text-slate-200">{b.t}</div>
                </motion.div>
              ))}
            </div>
            <div className="text-xs text-slate-400">
              We meet you where you are—migrate apps, validate outputs, and enable BI & AI with a secure foundation.
            </div>
          </div>
        </div>
      </Section>

      <Section id="timeline" label="Delivery" subtitle="A pragmatic, milestone‑driven plan">
        <Timeline />
      </Section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <CTA />
      </div>

      <footer className="py-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} Clouds on Mars · Advanced Analytics</div>
          <div className="flex gap-4">
            <a href="#apps" className="hover:text-white/80">Apps</a>
            <a href="#platform" className="hover:text-white/80">Platform</a>
            <a href="#timeline" className="hover:text-white/80">Timeline</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
