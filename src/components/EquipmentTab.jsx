export default function EquipmentTab({ servings, isSV, sizeLabel, eq }) {
  return (
    <div className="px-5 pt-5 pb-4 animate-fade-up">

      {/* Context banner */}
      <div className="bg-sienna-pale rounded-2xl px-4 py-3.5 mb-6 font-body text-sm text-ink-2 leading-[1.6]">
        Gear for <strong className="text-sienna">{servings} servings</strong> — {sizeLabel.toLowerCase()}
        {isSV && <span className="text-violet"> · sous vide mode</span>}
      </div>

      {/* Section heading */}
      <h2 className="font-display font-bold text-2xl text-ink mb-3">Essential Equipment</h2>

      {/* Horizontal image cards */}
      <div className="flex flex-col gap-3 mb-8">
        {eq.items.map(item => (
          <div
            key={item.name}
            className="bg-card rounded-2xl overflow-hidden flex h-36 group transition-all duration-300"
            style={{ boxShadow: "0 4px 16px rgba(155,64,6,0.04)" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 32px rgba(155,64,6,0.10)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(155,64,6,0.04)"}
          >
            {/* Image or emoji fallback */}
            <div className="w-36 shrink-0 relative overflow-hidden bg-surface-low">
              {item.img ? (
                <img
                  src={item.img}
                  alt={item.name}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[36px]">
                  {item.icon}
                </div>
              )}
              {item.essential && (
                <div
                  className="absolute top-2 left-2 rounded-full flex items-center justify-center"
                  style={{ background: "var(--color-sienna)", boxShadow: "0 2px 8px rgba(155,64,6,0.3)", padding: "3px 8px" }}
                >
                  <span className="font-body font-bold text-white tracking-[0.1em] uppercase leading-none" style={{ fontSize: "8px" }}>
                    Essential
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col justify-center flex-grow min-w-0">
              <h3 className="font-display font-bold text-base text-ink mb-1 leading-tight">{item.name}</h3>
              {item.spec && (
                <p className="font-mono text-xs font-medium mb-2" style={{ color: "var(--color-sienna)" }}>
                  {item.spec}
                </p>
              )}
              <p className="font-body text-xs text-ink-3 leading-relaxed line-clamp-2">{item.note}</p>
            </div>
          </div>
        ))}
      </div>

      {eq.batchNote && (
        <div className="mb-6 px-5 py-4 rounded-2xl bg-surface-low">
          <p className="font-body text-[10px] font-semibold text-sienna uppercase tracking-[0.15em] mb-2">Batching Strategy</p>
          <p className="font-body text-[13px] text-ink-2 leading-[1.6] m-0">{eq.batchNote}</p>
        </div>
      )}

      {/* Time benchmarks — dark/primary cards matching stitch design */}
      <div className="mb-1">
        <div className="flex items-center gap-4 mb-5">
          <div className="h-px bg-border-light flex-1 opacity-60" />
          <p className="font-body text-[10px] font-semibold text-ink-3 uppercase tracking-[0.2em] shrink-0">Time Benchmarks</p>
          <div className="h-px bg-border-light flex-1 opacity-60" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Night Before — dark ink card */}
          <div
            className="rounded-2xl p-5 flex flex-col items-center justify-center text-center group"
            style={{ background: "var(--color-ink)" }}
          >
            <div
              className="mb-3 w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <span className="text-2xl">🌙</span>
            </div>
            <span className="font-body text-[9px] tracking-[0.15em] uppercase font-semibold mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
              Night Before
            </span>
            <div className="font-display font-black text-3xl leading-none text-white mb-1">
              {eq.nightTime}
            </div>
          </div>

          {/* Day Of — primary sienna card */}
          <div
            className="rounded-2xl p-5 flex flex-col items-center justify-center text-center group"
            style={{
              background: "linear-gradient(135deg, var(--color-sienna), var(--color-sienna-mid))",
              boxShadow: "0 8px 32px rgba(155,64,6,0.20)",
            }}
          >
            <div
              className="mb-3 w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <span className="text-2xl">☀️</span>
            </div>
            <span className="font-body text-[9px] tracking-[0.15em] uppercase font-semibold mb-1" style={{ color: "rgba(255,255,255,0.75)" }}>
              Day Of
            </span>
            <div className="font-display font-black text-3xl leading-none text-white mb-1">
              {eq.dayTime}
            </div>
          </div>
        </div>
      </div>

      {isSV && (
        <div className="mt-4 px-5 py-4 rounded-2xl sv-glow" style={{ background: "var(--color-violet-pale)" }}>
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "var(--color-violet)" }}>
            Sous Vide Temps
          </p>
          <div className="flex gap-7 flex-wrap">
            <div>
              <span className="block font-mono text-[22px] font-medium text-ink leading-none">138°F</span>
              <p className="font-body text-[11px] text-ink-3 mt-1">Squid · 1–2 hrs</p>
            </div>
            <div>
              <span className="block font-mono text-[22px] font-medium text-ink leading-none">135°F</span>
              <p className="font-body text-[11px] text-ink-3 mt-1">Cod 30m · Shrimp 20m</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
