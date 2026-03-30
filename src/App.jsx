import { useState, useMemo } from "react";
import { getEquipment } from "./utils.js";
import { NIGHT_TRAD, DAY_TRAD, NIGHT_SV, DAY_SV } from "./data.js";
import BottomNav from "./components/BottomNav.jsx";
import RecipeTab from "./components/RecipeTab.jsx";
import EquipmentTab from "./components/EquipmentTab.jsx";
import ShoppingTab from "./components/ShoppingTab.jsx";
import SettingsTab from "./components/SettingsTab.jsx";

export default function App() {
  const [servings, setServings] = useState(4);
  const [mode, setMode]         = useState("trad");
  const [tab, setTab]           = useState("recipe");

  const isSV       = mode === "sv";
  const nightSteps = isSV ? NIGHT_SV : NIGHT_TRAD;
  const daySteps   = isSV ? DAY_SV   : DAY_TRAD;
  const eq         = useMemo(() => getEquipment(servings, isSV), [servings, isSV]);

  const sizeLabel = servings <= 6  ? "Intimate dinner"
    : servings <= 10 ? "Dinner party"
    : servings <= 16 ? "Large gathering"
    : "Event-scale feast";

  return (
    <div className="min-h-screen bg-ivory font-body antialiased">

      {/* ── Header ── */}
      <header className="px-5 pt-10 pb-5 relative overflow-hidden bg-ivory">
        {/* Ambient bottom shadow — no hard border */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(155,64,6,0.08), transparent)" }} />

        {/* Decorative watermark */}
        <div
          className="absolute bottom-[-14px] right-[-12px] font-display text-[100px] font-black italic leading-none pointer-events-none select-none opacity-[0.045] tracking-[-4px]"
          style={{ color: "var(--color-sienna)" }}
          aria-hidden="true"
        >
          PESCE
        </div>

        <div className="max-w-lg mx-auto relative animate-fade-up">
          <p className="font-body text-[10px] tracking-[0.2em] uppercase font-semibold mb-2" style={{ color: "var(--color-sienna)" }}>
            Serious Eats · Italian-American
          </p>
          {/* Duotone headline — Epilogue bold */}
          <h1 className="font-display text-[clamp(38px,9vw,58px)] font-extrabold leading-[0.92] text-ink tracking-[-1.5px]">
            Zuppa di{" "}
            <em className="not-italic" style={{ color: "var(--color-sienna)" }}>Pesce</em>
          </h1>
          <p className="font-body text-base text-ink-3 font-medium mt-2">
            Hearty Italian-American Seafood Stew
          </p>
        </div>
      </header>

      {/* ── Scrollable content ── */}
      <main className="max-w-lg mx-auto pb-28">
        {tab === "recipe" && (
          <RecipeTab
            servings={servings}
            isSV={isSV}
            nightSteps={nightSteps}
            daySteps={daySteps}
            eq={eq}
          />
        )}
        {tab === "equip" && (
          <EquipmentTab
            servings={servings}
            isSV={isSV}
            sizeLabel={sizeLabel}
            eq={eq}
          />
        )}
        {tab === "shop" && (
          <ShoppingTab servings={servings} isSV={isSV} />
        )}
        {tab === "settings" && (
          <SettingsTab
            servings={servings}
            mode={mode}
            onServingsChange={setServings}
            onModeChange={setMode}
            sizeLabel={sizeLabel}
            eq={eq}
          />
        )}
      </main>

      {/* ── Bottom Nav — glassmorphism ── */}
      <BottomNav tab={tab} onTabChange={setTab} />
    </div>
  );
}
