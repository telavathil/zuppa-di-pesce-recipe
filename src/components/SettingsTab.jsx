import { cn } from "../utils.js";

export default function SettingsTab({ servings, mode, onServingsChange, onModeChange, sizeLabel, eq }) {
  const isSV = mode === "sv";
  const sliderPct = ((servings - 1) / 24) * 100;

  return (
    <div className="px-5 pt-5 pb-4 animate-fade-up">

      {/* Serving Size */}
      <section className="mb-6">
        <p className="font-body text-[10px] font-semibold tracking-[0.15em] uppercase text-sienna mb-3">Serving Size</p>

        <div className="bg-card rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-5">
            <div>
              <span className="font-display text-[56px] font-bold leading-none" style={{ color: "var(--color-sienna)" }}>
                {servings}
              </span>
              <span className="block font-body text-[13px] text-ink-3 font-medium mt-1">{sizeLabel}</span>
            </div>
            <div className="font-body text-[11px] text-ink-3 text-right leading-[2] pt-1">
              <div>🌙 Night {eq.nightTime}</div>
              <div>☀️ Day-of {eq.dayTime}</div>
            </div>
          </div>

          <input
            type="range" min="1" max="25" value={servings}
            onChange={e => onServingsChange(parseInt(e.target.value, 10))}
            className="w-full h-1 rounded-sm cursor-pointer outline-none block"
            style={{ background: `linear-gradient(to right, var(--color-sienna) 0%, var(--color-sienna) ${sliderPct}%, var(--color-border) ${sliderPct}%, var(--color-border) 100%)` }}
          />
          <div className="flex justify-between font-mono text-[9px] text-ink-4 mt-1.5 mb-4">
            <span>1</span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span>
          </div>

          {/* Quick-pick chips — pill shaped */}
          <div className="flex gap-1.5 flex-wrap pt-3" style={{ borderTop: "1px solid var(--color-surface-low)" }}>
            {[2, 4, 6, 8, 12, 16, 20, 25].map(n => (
              <button
                key={n}
                className={cn(
                  "px-3.5 py-1.5 rounded-full font-mono text-xs cursor-pointer transition-all duration-150 border-none",
                  servings === n
                    ? "text-white"
                    : "bg-transparent text-ink-3 ring-1 ring-ink/[0.12] hover:text-sienna"
                )}
                style={servings === n ? { background: "linear-gradient(135deg, var(--color-sienna), var(--color-sienna-mid))" } : {}}
                onClick={() => onServingsChange(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cooking Method */}
      <section className="mb-6">
        <p className="font-body text-[10px] font-semibold tracking-[0.15em] uppercase text-sienna mb-3">Cooking Method</p>

        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          {[
            { key: "trad", label: "Traditional", sub: "Stovetop cooking", desc: "Build the base night-before, then cook seafood day-of on the stovetop." },
            { key: "sv",   label: "Sous Vide",   sub: "Precision cooking", desc: "Proteins cooked sous vide for silky-tender results. Squid night-before, cod & shrimp day-of." },
          ].map(({ key, label, sub, desc }, idx) => (
            <button
              key={key}
              className={cn(
                "w-full px-5 py-4 border-none cursor-pointer text-left transition-colors duration-200",
                idx === 0 && "border-b border-surface-low",
                mode === key ? "bg-surface-low" : "bg-transparent hover:bg-surface-low/60"
              )}
              onClick={() => onModeChange(key)}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ring-2",
                  mode === key ? "ring-sienna" : "ring-ink/[0.18]"
                )}>
                  {mode === key && (
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--color-sienna)" }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={cn("block font-body font-bold text-sm mb-0.5", mode === key ? "text-ink" : "text-ink-3")}>
                    {label}
                  </span>
                  <span className={cn("block font-body text-[10px] tracking-[0.08em] uppercase font-semibold", mode === key ? "text-sienna" : "text-ink-4")}>
                    {sub}
                  </span>
                </div>
              </div>
              {mode === key && (
                <p className="font-body text-[13px] text-ink-3 leading-[1.65] mt-3 ml-8">{desc}</p>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Sous Vide temps */}
      {isSV && (
        <div className="px-5 py-4 rounded-2xl sv-glow" style={{ background: "var(--color-violet-pale)" }}>
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "var(--color-violet)" }}>
            Sous Vide Temperatures
          </p>
          <div className="flex gap-7 flex-wrap">
            <div>
              <span className="block font-mono text-[22px] font-medium text-ink leading-none">138°F</span>
              <p className="font-body text-[11px] text-ink-3 mt-1">Squid · 1–2 hrs (night before)</p>
            </div>
            <div>
              <span className="block font-mono text-[22px] font-medium text-ink leading-none">135°F</span>
              <p className="font-body text-[11px] text-ink-3 mt-1">Cod 30 min · Shrimp 20 min</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
