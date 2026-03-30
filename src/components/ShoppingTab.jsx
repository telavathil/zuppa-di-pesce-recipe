import { useCallback, useMemo, useState } from "react";
import { cn, scaleAmount } from "../utils.js";
import { INGREDIENTS_BASE } from "../data.js";

const CATEGORIES = ["Seafood", "Produce", "Pantry"];
const CAT_ICON = { Seafood: "🐟", Produce: "🌿", Pantry: "🫙" };

export default function ShoppingTab({ servings, isSV }) {
  const [checked, setChecked] = useState({});

  const toggle = useCallback(id => setChecked(p => ({ ...p, [id]: !p[id] })), []);

  const shop = useMemo(() => CATEGORIES.map(c => ({
    category: c,
    items: INGREDIENTS_BASE
      .filter(i => i.category === c)
      .map(i => ({ ...i, scaled: scaleAmount(i.amount, servings) })),
  })), [servings]);

  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="px-5 pt-5 pb-4 animate-fade-up">
      <div className="flex justify-between items-center mb-5">
        <p className="font-body text-xs font-semibold text-ink-3 tracking-[0.08em] uppercase">
          {checkedCount} / {INGREDIENTS_BASE.length} checked · {servings} servings
        </p>
        <button
          className="bg-transparent rounded-full font-body text-xs font-semibold text-ink-4 cursor-pointer ring-1 ring-ink/[0.12] px-3 py-1.5 hover:text-sienna transition-colors"
          onClick={() => setChecked({})}
        >
          Clear all
        </button>
      </div>

      {shop.map(({ category, items }) => (
        <div key={category} className="mb-5">
          {/* Category header — no divider, spacing does the work */}
          <p className="font-body text-[10px] font-semibold tracking-[0.15em] uppercase text-sienna m-0 mb-2">
            {CAT_ICON[category]} {category}
          </p>

          <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150",
                  idx < items.length - 1 && "border-b border-surface-low",
                  checked[item.id] ? "opacity-50" : "hover:bg-surface-low"
                )}
                onClick={() => toggle(item.id)}
              >
                {/* Checkbox — ghost border fallback for control affordance */}
                <div className={cn(
                  "w-5 h-5 rounded-md flex items-center justify-center text-[11px] shrink-0 transition-all",
                  checked[item.id]
                    ? "bg-sage text-white"
                    : "bg-transparent ring-1 ring-ink/[0.15]"
                )}>
                  {checked[item.id] && "✓"}
                </div>
                <span className="font-mono text-[13px] font-medium text-sienna min-w-[46px] text-right shrink-0">{item.scaled}</span>
                <span className="font-mono text-[11px] text-ink-4 min-w-[34px] shrink-0">{item.unit}</span>
                <span className={cn("font-body text-sm text-ink-2", checked[item.id] && "line-through")}>
                  {item.name.split(",")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {isSV && (
        <div className="mb-3 px-5 py-4 rounded-2xl sv-glow font-body text-[13px] text-ink-2 leading-[1.7]" style={{ background: "var(--color-violet-pale)" }}>
          <strong style={{ color: "var(--color-violet)" }}>Sous vide extras:</strong>{" "}
          Vacuum seal bags or heavy zip-locks ({servings <= 8 ? "3 bags" : servings <= 16 ? "5–6 bags" : "8+ bags"} — one set each for squid, cod, shrimp).
        </div>
      )}

      <div className="px-5 py-4 rounded-2xl bg-surface-low font-body text-[13px] text-ink-2 leading-[1.75]">
        <p className="mb-1.5">
          <strong>Also grab:</strong> Crusty bread or linguine ({servings <= 4 ? "1 loaf / 1 lb pasta" : servings <= 8 ? "2 loaves / 1½ lbs" : servings <= 14 ? "3 loaves / 2½ lbs" : servings <= 20 ? "4 loaves / 3½ lbs" : "5+ loaves / 4½ lbs"}).
        </p>
        <p>
          <strong>Wine:</strong> Pinot Grigio or Vermentino — {servings <= 4 ? "1 bottle" : servings <= 8 ? "2 bottles" : servings <= 14 ? "3 bottles" : servings <= 20 ? "4 bottles" : "5+ bottles"}.
        </p>
      </div>
    </div>
  );
}
