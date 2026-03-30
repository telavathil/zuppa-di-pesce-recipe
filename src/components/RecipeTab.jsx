import { useState } from "react";
import { cn, scaleAmount } from "../utils.js";
import { INGREDIENTS_BASE } from "../data.js";
import StepCard from "./StepCard.jsx";

const LEGEND_ITEMS_TRAD = [
  { color: "var(--color-sage)",   label: "Prep" },
  { color: "var(--color-sienna)", label: "Main pot" },
  { color: "var(--color-ocean)",  label: "Skillet" },
];
const LEGEND_ITEMS_SV = [
  ...LEGEND_ITEMS_TRAD,
  { color: "var(--color-violet)", label: "Sous vide" },
];

export default function RecipeTab({ servings, isSV, nightSteps, daySteps, eq }) {
  const [view, setView]         = useState("ingredients");
  const [active, setActive]     = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const legendItems = isSV ? LEGEND_ITEMS_SV : LEGEND_ITEMS_TRAD;

  return (
    <div className="animate-fade-up">

      {/* Sub-toggle: Ingredients / Steps — sticky */}
      <div className="px-5 pt-4 pb-3 sticky top-0 bg-ivory/90 z-10" style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
        <div className="flex bg-surface-low rounded-2xl overflow-hidden p-1 gap-1">
          {[
            { key: "ingredients", label: "Ingredients" },
            { key: "steps",       label: "Steps" },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={cn(
                "flex-1 py-2 rounded-xl border-none cursor-pointer font-body text-sm font-semibold transition-all duration-200",
                view === key
                  ? "bg-card text-ink shadow-card"
                  : "bg-transparent text-ink-4 hover:text-ink-2"
              )}
              onClick={() => setView(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-2 pb-6">

        {/* Sous Vide banner */}
        {isSV && (
          <div className="rounded-2xl px-4 py-4 mb-4 sv-glow" style={{ background: "var(--color-violet-pale)" }}>
            <p className="font-body text-[13.5px] text-ink-2 leading-[1.7] m-0">
              <strong style={{ color: "var(--color-violet)" }}>Sous vide advantage:</strong>{" "}
              {view === "ingredients"
                ? "Squid cooks night-before at 138°F for 1–2 hrs → silky-tender every time. Cod and shrimp cook day-of at 135°F in parallel with the base reheating. Day-of becomes mostly assembly."
                : "Squid cooks night-before at 138°F for 1–2 hrs. Day-of becomes mostly assembly — warm proteins in the broth and steam shellfish."}
            </p>
          </div>
        )}

        {/* ── INGREDIENTS ── */}
        {view === "ingredients" && (
          <div className="bg-card rounded-2xl px-5 py-5 shadow-card">
            <h2 className="font-display text-2xl font-bold text-ink mb-4 flex items-baseline gap-2.5">
              Ingredients
              <span className="font-mono text-xs text-ink-4 font-normal">for {servings}</span>
            </h2>
            {INGREDIENTS_BASE.map((ing, idx) => (
              <div
                key={ing.id}
                className={cn(
                  "flex items-baseline gap-3 py-2.5",
                  idx < INGREDIENTS_BASE.length - 1 && "border-b border-surface-low"
                )}
              >
                <span className="font-mono text-[13px] font-medium text-sienna min-w-[46px] text-right shrink-0">
                  {scaleAmount(ing.amount, servings)}
                </span>
                <span className="font-mono text-[11px] text-ink-4 min-w-[34px] shrink-0">{ing.unit}</span>
                <span className="font-body text-sm text-ink-2 leading-snug">{ing.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── STEPS ── */}
        {view === "steps" && (
          <>
            {/* Legend + reset */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-4 flex-wrap">
                {legendItems.map(l => (
                  <span key={l.label} className="flex items-center gap-1.5 font-body text-[10px] text-ink-3 tracking-[0.08em] uppercase font-semibold">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color }} />
                    {l.label}
                  </span>
                ))}
              </div>
              <button
                className="font-body text-[10px] font-semibold text-ink-4 rounded-full px-3 py-1.5 bg-transparent cursor-pointer ring-1 ring-ink/[0.12] hover:text-sienna transition-colors tracking-[0.08em] uppercase"
                onClick={() => setResetKey(k => k + 1)}
              >
                Reset timers
              </button>
            </div>

            {/* Night Before */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[20px] leading-none">🌙</span>
              <div>
                <h2 className="font-display text-xl font-bold text-ink m-0 leading-none mb-0.5">Night Before</h2>
                <p className="font-body text-[10px] tracking-[0.08em] uppercase font-semibold text-ink-3 m-0">
                  {isSV ? "Prep + base + sous vide squid" : "Prep + build the base"} · {eq.nightTime}
                </p>
              </div>
            </div>

            {eq.batchNote && servings > 12 && (
              <div className="bg-sage-pale rounded-2xl px-4 py-3 mb-3 text-[13px] text-ink-2 leading-[1.65]">
                🔪 <strong>Big batch tip:</strong> With {servings} servings, prep steps take longer. An extra pair of hands helps a lot.
              </div>
            )}

            {nightSteps.map((step, i) => (
              <StepCard
                key={`n-${i}`}
                step={step}
                globalIndex={i}
                isActive={active === `n-${i}`}
                onToggle={() => setActive(active === `n-${i}` ? null : `n-${i}`)}
                resetKey={resetKey}
              />
            ))}

            {/* Day Of */}
            <div className="flex items-center gap-3 mt-7 mb-3">
              <span className="text-[20px] leading-none">☀️</span>
              <div>
                <h2 className="font-display text-xl font-bold text-ink m-0 leading-none mb-0.5">Day Of</h2>
                <p className="font-body text-[10px] tracking-[0.08em] uppercase font-semibold text-ink-3 m-0">
                  {isSV ? "Sous vide cod & shrimp + reheat + assemble" : "Reheat base + cook the seafood"} · {eq.dayTime}
                </p>
              </div>
            </div>

            {eq.batchNote && (
              <div className="bg-sienna-pale rounded-2xl px-4 py-3 mb-3 text-[13px] text-ink-2 leading-[1.65]">
                ⚡ <strong>Scaling tip:</strong> {eq.batchNote}
              </div>
            )}

            {daySteps.map((step, i) => (
              <StepCard
                key={`d-${i}`}
                step={step}
                globalIndex={nightSteps.length + i}
                isActive={active === `d-${i}`}
                onToggle={() => setActive(active === `d-${i}` ? null : `d-${i}`)}
                resetKey={resetKey}
              />
            ))}

            {/* Notes */}
            <div className="mt-5 px-5 py-5 rounded-2xl bg-surface-low">
              <p className="font-body text-[10px] font-semibold text-sienna uppercase tracking-[0.15em] mb-3">Notes</p>
              {isSV ? (
                <>
                  <p className="font-body text-[13px] text-ink-2 leading-[1.75] mb-2"><strong>Squid (138°F / 59°C, 1–2 hrs):</strong> The long gentle cook breaks down collagen without toughening. Consistent silky texture every time.</p>
                  <p className="font-body text-[13px] text-ink-2 leading-[1.75] mb-2"><strong>Cod & shrimp (135°F / 57°C):</strong> Cod gets 30 min for flaky, moist fillets. Shrimp gets just salt and olive oil for 20 min. Start cod first, add shrimp 10 min later.</p>
                  <p className="font-body text-[13px] text-ink-2 leading-[1.75] mb-2"><strong>Why one temp?</strong> Ideal cod is 130°F, ideal shrimp is 135°F. At 135°F, cod is slightly firmer but excellent — one bath is much simpler.</p>
                  <p className="font-body text-[13px] text-ink-2 leading-[1.75]"><strong>Bagging tip:</strong> Single layer of protein with a drizzle of olive oil and pinch of salt. Use multiple bags for large batches.</p>
                </>
              ) : (
                <>
                  <p className="font-body text-[13px] text-ink-2 leading-[1.75] mb-2"><strong>Why split?</strong> Building the base night-before means day-of is just reheating and staging seafood — about {eq.dayTime} of mostly hands-off time.</p>
                  <p className="font-body text-[13px] text-ink-2 leading-[1.75] mb-2"><strong>Seafood storage:</strong> Prepped proteins keep well overnight sealed in the fridge. Purged clams can sit overnight uncovered — don't submerge.</p>
                  <p className="font-body text-[13px] text-ink-2 leading-[1.75]"><strong>Swaps:</strong> Haddock, monkfish, razor clams, scallops all work. Adjust cook times accordingly.</p>
                </>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
