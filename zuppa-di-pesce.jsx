import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const BASE_SERVINGS = 4;
const INGREDIENTS_BASE = [
  { id: "oil-base", name: "Extra-virgin olive oil (for base)", amount: 60, unit: "ml", category: "Pantry" },
  { id: "oil-shell", name: "Extra-virgin olive oil (for shellfish)", amount: 15, unit: "ml", category: "Pantry" },
  { id: "oil-drizzle", name: "Extra-virgin olive oil (for drizzling)", amount: 15, unit: "ml", category: "Pantry" },
  { id: "shrimp", name: "Large shrimp (26-30/lb), peeled & deveined, shells reserved", amount: 226, unit: "g", category: "Seafood" },
  { id: "onion", name: "Yellow onion, ¼-inch dice", amount: 0.5, unit: "piece", category: "Produce" },
  { id: "fennel", name: "Fennel bulb, ¼-inch dice (fronds reserved)", amount: 1, unit: "piece", category: "Produce" },
  { id: "salt", name: "Diamond Crystal kosher salt", amount: 0.5, unit: "tsp", category: "Pantry" },
  { id: "garlic", name: "Garlic cloves, minced", amount: 4, unit: "piece", category: "Produce" },
  { id: "oregano", name: "Fresh oregano, minced", amount: 2, unit: "tsp", category: "Produce" },
  { id: "pepper", name: "Red pepper flakes", amount: 0.25, unit: "tsp", category: "Pantry" },
  { id: "wine", name: "Dry white wine", amount: 240, unit: "ml", category: "Pantry" },
  { id: "saffron", name: "Saffron", amount: 1, unit: "pinch", category: "Pantry" },
  { id: "clam-juice", name: "Clam juice (bottled)", amount: 237, unit: "ml", category: "Seafood" },
  { id: "passata", name: "Tomato passata", amount: 700, unit: "g", category: "Pantry" },
  { id: "squid", name: "Squid, bodies in ½-inch rings, tentacles whole", amount: 454, unit: "g", category: "Seafood" },
  { id: "cod", name: "Skinless cod fillet (¾–1 inch thick), 2×1-inch pieces", amount: 454, unit: "g", category: "Seafood" },
  { id: "clams", name: "Littleneck clams, scrubbed & purged", amount: 454, unit: "g", category: "Seafood" },
  { id: "mussels", name: "Mussels, scrubbed & debearded", amount: 226, unit: "g", category: "Seafood" },
  { id: "parsley", name: "Flat-leaf parsley, chopped", amount: 0.25, unit: "cup", category: "Produce" },
];

const NIGHT_TRAD = [
  { title: "Purge the clams", desc: "Submerge clams in salted cold water (~3% salinity — about 1 tbsp salt per 2 cups). Let stand 30 min. Lift out. If sand remains, drain, refill, and repeat until water runs clear. Refrigerate clams.", timer: 1800, timerLabel: "30 min", burner: "prep", parallel: null },
  { title: "Prep the shrimp", desc: "Peel and devein shrimp. Reserve shells in a small bowl for the base. Cover peeled shrimp and refrigerate.", timer: null, burner: "prep", parallel: null },
  { title: "Prep the vegetables", desc: "Dice onion and fennel bulb into ¼-inch pieces, reserving fennel fronds. Mince garlic and oregano. Store in airtight containers in the fridge.", timer: null, burner: "prep", parallel: null },
  { title: "Prep squid & cod", desc: "Slice squid bodies into ½-inch rings; leave tentacles whole. Pat dry. Cut cod into 2×1-inch pieces. Cover and refrigerate separately.", timer: null, burner: "prep", parallel: null },
  { title: "Toast shrimp shells", desc: "Heat olive oil (base) in a Dutch oven over medium-high until shimmering. Add reserved shrimp shells, cook stirring frequently until bright pink and browning. Remove with slotted spoon; discard.", timer: null, burner: "main", parallel: null },
  { title: "Sauté aromatics", desc: "Add onion, fennel, and salt to pot. Cook, stirring occasionally, until softened and beginning to brown (7–9 min). Stir in garlic, oregano, and red pepper flakes until fragrant (~1 min).", timer: 540, timerLabel: "~9 min", burner: "main", parallel: null },
  { title: "Deglaze with wine & saffron", desc: "Stir in ¾ of the wine (180 ml) and saffron. Cook until reduced by about half.", timer: 300, timerLabel: "~5 min", burner: "main", parallel: null },
  { title: "Build & reduce the broth", desc: "Stir in clam juice and passata. Simmer, stirring occasionally, until reduced by about half.", timer: 1050, timerLabel: "15–20 min", burner: "main", parallel: null },
  { title: "Cool & refrigerate", desc: "Remove from heat, cool to room temperature. Transfer to an airtight container and refrigerate overnight. You're done for tonight.", timer: null, burner: "prep", parallel: null },
];

const DAY_TRAD = [
  { title: "Reheat the base", desc: "Transfer tomato base back into your Dutch oven. Reheat over medium heat, stirring occasionally, until it reaches a gentle simmer.", timer: null, burner: "main", parallel: null },
  { title: "Prep the mussels", desc: "Scrub mussels and pull off any beards. Discard any that are cracked or won't close when tapped.", timer: null, burner: "prep", parallel: null },
  { title: "Simmer the squid", desc: "Reduce heat to low. Nestle squid into the simmering broth, cover, and gently simmer for 15 minutes.", timer: 900, timerLabel: "15 min", burner: "main", parallel: null },
  { title: "Add the cod", desc: "Nestle cod pieces into the broth, cover, and gently simmer until just cooked through.", timer: 390, timerLabel: "5–8 min", burner: "main", parallel: null },
  { title: "Add the shrimp", desc: "Add shrimp, submerging in liquid. Cover and cook until pink and cooked through. Remove pot from heat. Start clams on 2nd burner now.", timer: 180, timerLabel: "2–4 min", burner: "main", parallel: "start" },
  { title: "Steam the clams", desc: "AT THE SAME TIME: In a 12-inch skillet, combine clams, remaining ¼ cup wine, and 1 tbsp olive oil. Cover, boil over high heat. Transfer opened clams to pot.", timer: 390, timerLabel: "5–8 min", burner: "skillet", parallel: "with-prev" },
  { title: "Steam the mussels", desc: "In same skillet with remaining liquid, add mussels. Cover, high heat until opened. Transfer with ~½ cup broth to pot.", timer: 180, timerLabel: "2–4 min", burner: "skillet", parallel: "end" },
  { title: "Finish & serve", desc: "Return stew to a gentle simmer. Stir in parsley, season with salt and pepper. Divide among warmed bowls, ladle broth over, drizzle olive oil, garnish with fennel fronds. Serve with crusty bread or linguine.", timer: null, burner: "main", parallel: null },
];

const NIGHT_SV = [
  { title: "Purge the clams", desc: "Submerge clams in salted cold water (~3% salinity). Let stand 30 min. If sand remains, repeat. Refrigerate clams.", timer: 1800, timerLabel: "30 min", burner: "prep", parallel: null },
  { title: "Prep the shrimp", desc: "Peel and devein shrimp. Reserve shells for the base. Season shrimp with a pinch of salt and a drizzle of olive oil, vacuum seal or zip-lock (water displacement method). Refrigerate the bag — you'll sous vide these tomorrow.", timer: null, burner: "prep", parallel: null },
  { title: "Prep the vegetables", desc: "Dice onion and fennel into ¼-inch pieces (reserve fronds). Mince garlic and oregano. Refrigerate in containers.", timer: null, burner: "prep", parallel: null },
  { title: "Prep squid & cod", desc: "Slice squid bodies into ½-inch rings, tentacles whole. Season with a pinch of salt and olive oil, seal in a bag — keep it simple, no acid. Cut cod into 2×1-inch pieces, season with salt and olive oil, and optionally add a small sprig of thyme and a thin sliver of garlic to the bag (go easy — raw garlic can turn sulfurous at sous vide temps). Seal in a separate bag.", timer: null, burner: "prep", parallel: null },
  { title: "Start sous vide for squid", desc: "Fill and start your sous vide bath at 138°F / 59°C. Once at temp, add the squid bag. This will cook while you build the broth — the squid needs 1–2 hours for silky-tender results.", timer: null, burner: "sv", parallel: "sv-start" },
  { title: "Toast shrimp shells", desc: "While bath heats: heat olive oil (base) in a Dutch oven over medium-high. Add shells, cook until pink and browning. Remove and discard.", timer: null, burner: "main", parallel: null },
  { title: "Sauté aromatics", desc: "Add onion, fennel, and salt. Cook until softened and browning (7–9 min). Stir in garlic, oregano, red pepper flakes until fragrant (~1 min).", timer: 540, timerLabel: "~9 min", burner: "main", parallel: null },
  { title: "Deglaze with wine & saffron", desc: "Stir in ¾ of the wine (180 ml) and saffron. Cook until reduced by about half.", timer: 300, timerLabel: "~5 min", burner: "main", parallel: null },
  { title: "Build & reduce the broth", desc: "Stir in clam juice and passata. Simmer until reduced by about half. The squid is still cooking in the bath — no action needed there.", timer: 1050, timerLabel: "15–20 min", burner: "main", parallel: null },
  { title: "Remove squid, cool everything", desc: "Pull the squid bag from the bath (it should have at least 1 hr by now). Transfer bag to an ice bath to chill rapidly. Cool the broth to room temp. Refrigerate both the squid (in bag) and broth overnight.", timer: null, burner: "sv", parallel: "sv-end" },
];

const DAY_SV = [
  { title: "Start sous vide for cod", desc: "Fill and start your sous vide bath at 135°F / 57°C. Once at temp, add the cod bag. Set a 30-minute timer.", timer: 1800, timerLabel: "30 min", burner: "sv", parallel: "sv-start" },
  { title: "Reheat the base", desc: "While cod cooks: transfer the tomato base to your Dutch oven. Reheat over medium heat to a gentle simmer.", timer: null, burner: "main", parallel: null },
  { title: "Prep the mussels", desc: "Scrub mussels and remove beards. Discard any that won't close when tapped.", timer: null, burner: "prep", parallel: null },
  { title: "Add shrimp to bath", desc: "After cod has been in for 10 min, add the shrimp bag to the same bath. Both will finish together — cod gets 30 min total, shrimp gets 20 min. 135°F works beautifully for both.", timer: 1200, timerLabel: "20 min", burner: "sv", parallel: null },
  { title: "Remove proteins from bath", desc: "Pull both bags from the bath. Cut open and gently slide the cod and shrimp into the simmering broth. Add the pre-cooked squid (from the fridge bag) too. Let everything warm through gently for 2–3 minutes — do NOT boil, just let the broth barely simmer.", timer: 150, timerLabel: "2–3 min", burner: "main", parallel: "start" },
  { title: "Steam the clams", desc: "AT THE SAME TIME: In a 12-inch skillet, combine clams, remaining ¼ cup wine, and 1 tbsp olive oil. Cover, boil over high heat. Transfer opened clams to pot.", timer: 390, timerLabel: "5–8 min", burner: "skillet", parallel: "with-prev" },
  { title: "Steam the mussels", desc: "In same skillet with remaining liquid, add mussels. Cover, high heat until opened. Transfer with ~½ cup broth to pot.", timer: 180, timerLabel: "2–4 min", burner: "skillet", parallel: "end" },
  { title: "Finish & serve", desc: "Return stew to a gentle simmer. Stir in parsley, season with salt and pepper. Divide among warmed bowls, ladle broth over, drizzle olive oil, garnish with fennel fronds. Serve with crusty bread or linguine.", timer: null, burner: "main", parallel: null },
];

function getEquipment(servings, isSV) {
  const items = [];
  if (servings <= 6) {
    items.push({ name: "Dutch Oven", spec: "5–6 quart", icon: "🍲", note: "Handles base + seafood comfortably" });
    items.push({ name: "Skillet", spec: "12-inch", icon: "🫕", note: "For steaming clams & mussels on a second burner" });
  } else if (servings <= 10) {
    items.push({ name: "Dutch Oven", spec: "7–8 quart", icon: "🍲", note: "Extra headroom for this volume" });
    items.push({ name: "Skillet", spec: "12-inch", icon: "🫕", note: "Steam shellfish in 2 batches per type" });
  } else if (servings <= 16) {
    items.push({ name: "Large Stockpot", spec: "10–12 quart", icon: "🍲", note: "Dutch oven won't cut it — go stockpot" });
    items.push({ name: "Skillets", spec: "12-inch (×2 ideal)", icon: "🫕", note: "Two skillets or 2–3 batches for shellfish" });
  } else {
    items.push({ name: "Large Stockpot", spec: "16+ quart", icon: "🍲", note: "Restaurant-size — consider two pots" });
    items.push({ name: "Skillets / Wide Pot", spec: "2 × 12-inch or rondeau", icon: "🫕", note: "Steam shellfish in parallel to stay on schedule" });
  }
  items.push({ name: "Spider Skimmer", spec: "Slotted spoon", icon: "🥄", note: "Essential for transferring seafood gently" });
  if (isSV) {
    items.push({ name: "Sous Vide Circulator", spec: "", icon: "🌡️", note: "Immersion circulator — Anova, Joule, etc." });
    items.push({ name: "Vacuum Bags or Zip-Locks", spec: `${servings <= 8 ? "3 bags" : servings <= 16 ? "5–6 bags" : "8+ bags"}`, icon: "🛍️", note: "One each for squid, cod, shrimp — double up for larger batches so bags aren't overpacked" });
    items.push({ name: "Container / Cambro", spec: servings <= 8 ? "12 qt" : "18+ qt", icon: "🫙", note: servings <= 8 ? "Standard container works" : "Larger vessel needed to fit multiple bags with good water flow" });
    if (servings > 10) items.push({ name: "Ice Bath Bowl", spec: "Large", icon: "🧊", note: "For rapid chilling of squid bags night-before" });
  }
  if (servings > 8) items.push({ name: "Sheet Tray + Oven", spec: "200°F / 95°C", icon: "♨️", note: "Keep early-cooked seafood warm while finishing batches" });
  if (servings > 12) {
    items.push({ name: "Second Cutting Board", spec: "For seafood", icon: "🔪", note: "Speeds up extended prep" });
    if (!isSV) items.push({ name: "Large Bowl (iced)", spec: "Bowl in ice", icon: "🧊", note: "Keep prepped seafood cold during long prep" });
  }
  if (servings > 6) items.push({ name: "Large Ladle", spec: "8 oz+", icon: "🫗", note: "Makes portioning much faster" });
  if (servings > 16) {
    items.push({ name: "Warmed Serving Bowls", spec: `${servings}+`, icon: "🥣", note: "Warm bowls at 200°F — keeps stew hot" });
    items.push({ name: "Bread Baskets", spec: "2–3", icon: "🍞", note: "Station at multiple spots" });
  }
  const batchNote = servings <= 6 ? null : servings <= 10 ? "Steam clams and mussels in 2 rounds each." : servings <= 16 ? "Plan 2–3 batches for shellfish." : "Event-scale: recruit a helper for shellfish, plan 3–4 batches.";
  const nightTime = servings <= 6 ? (isSV ? "~60 min" : "~45 min") : servings <= 10 ? (isSV ? "~75 min" : "~55 min") : servings <= 16 ? (isSV ? "~90 min" : "~70 min") : (isSV ? "~105 min" : "~90 min");
  const dayTime = servings <= 6 ? (isSV ? "~30 min" : "~35 min") : servings <= 10 ? (isSV ? "~40 min" : "~45 min") : servings <= 16 ? (isSV ? "~45 min" : "~55 min") : (isSV ? "~55 min" : "~70 min");
  return { items, batchNote, nightTime, dayTime };
}

function formatAmount(val) {
  if (val === 0) return "0";
  if (val < 0.15) return "⅛"; if (val < 0.29) return "¼"; if (val < 0.4) return "⅓";
  if (val < 0.6) return "½"; if (val < 0.7) return "⅔"; if (val < 0.85) return "¾";
  const w = Math.floor(val), f = val - w;
  if (f < 0.15) return `${w}`; if (f < 0.29) return `${w > 0 ? w : ""}¼`.trim();
  if (f < 0.4) return `${w > 0 ? w : ""}⅓`.trim(); if (f < 0.6) return `${w > 0 ? w : ""}½`.trim();
  if (f < 0.7) return `${w > 0 ? w : ""}⅔`.trim(); if (f < 0.85) return `${w > 0 ? w : ""}¾`.trim();
  return `${w + 1}`;
}
function scaleAmount(a, s) { const v = (a / BASE_SERVINGS) * s; if (Number.isInteger(v)) return v.toString(); if (v >= 10) return Math.round(v).toString(); return formatAmount(v); }
function fmtTimer(s) { return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`; }

function Timer({ duration, stepKey }) {
  const [rem, setRem] = useState(duration);
  const [on, setOn] = useState(false);
  const ref = useRef(null);
  useEffect(() => { setRem(duration); setOn(false); if (ref.current) clearInterval(ref.current); }, [duration, stepKey]);
  useEffect(() => {
    if (!on || rem <= 0) return;
    ref.current = setInterval(() => setRem(r => {
      if (r <= 1) { clearInterval(ref.current); setOn(false); return 0; }
      return r - 1;
    }), 1000);
    return () => clearInterval(ref.current);
  }, [on]); // eslint-disable-line react-hooks/exhaustive-deps
  const pct = ((duration - rem) / duration) * 100, done = rem === 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, background: done ? "#2d5a3d" : "rgba(255,255,255,0.06)", borderRadius: 10, padding: "8px 14px", flexWrap: "wrap" }}>
      <div style={{ position: "relative", width: 40, height: 40, flexShrink: 0 }}>
        <svg width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="17" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
          <circle cx="20" cy="20" r="17" fill="none" stroke={done ? "#7dcea0" : "#e8a87c"} strokeWidth="3" strokeDasharray={`${(pct / 100) * 106.8} 106.8`} strokeLinecap="round" transform="rotate(-90 20 20)" style={{ transition: "stroke-dasharray 0.5s ease" }} />
        </svg>
      </div>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color: done ? "#7dcea0" : "#f5e6d3", fontWeight: 500, minWidth: 56 }}>{done ? "Done!" : fmtTimer(rem)}</span>
      {!done && <div style={{ display: "flex", gap: 6 }}>
        <button onClick={e => { e.stopPropagation(); setOn(!on); }} style={{ background: on ? "rgba(232,168,124,0.2)" : "rgba(232,168,124,0.3)", border: "1px solid rgba(232,168,124,0.4)", borderRadius: 6, color: "#e8a87c", padding: "4px 12px", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>{on ? "Pause" : "Start"}</button>
        <button onClick={e => { e.stopPropagation(); setRem(duration); setOn(false); }} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#a89080", padding: "4px 10px", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>Reset</button>
      </div>}
    </div>
  );
}

const BURNER_COLORS = { main: "#e8a87c", skillet: "#7db8e8", prep: "#a8c97d", sv: "#d4a0e8" };
const BURNER_LABELS = { main: "MAIN POT", skillet: "SKILLET", prep: "PREP", sv: "SOUS VIDE" };

function StepCard({ step, globalIndex, isActive, onToggle }) {
  const isP = step.parallel === "with-prev" || step.parallel === "end";
  const isPStart = step.parallel === "start";
  const isSVStart = step.parallel === "sv-start";
  const isSVEnd = step.parallel === "sv-end";
  const bc = BURNER_COLORS[step.burner] || "#e8a87c";
  const bl = BURNER_LABELS[step.burner] || "";
  const showTag = isP || isPStart || isSVStart || isSVEnd || step.burner === "prep" || step.burner === "sv";

  return (
    <div style={{ display: "flex", gap: 0 }}>
      <div style={{ width: 28, flexShrink: 0, position: "relative" }}>
        {isPStart && <><div style={{ position: "absolute", top: 18, left: 14, width: 2, height: "calc(100% - 18px)", background: "rgba(125,184,232,0.3)" }} /><div style={{ position: "absolute", top: 18, left: 8, width: 12, height: 12, borderLeft: "2px solid rgba(125,184,232,0.4)", borderBottom: "2px solid rgba(125,184,232,0.4)", borderRadius: "0 0 0 6px" }} /></>}
        {isP && <><div style={{ position: "absolute", top: 0, left: 14, width: 2, height: step.parallel === "end" ? "50%" : "100%", background: "rgba(125,184,232,0.3)" }} /><div style={{ position: "absolute", top: "50%", left: 6, width: 10, height: 2, background: "rgba(125,184,232,0.3)", transform: "translateY(-1px)" }} /></>}
        {isSVStart && <div style={{ position: "absolute", top: 14, left: 10, width: 10, height: 10, borderRadius: "50%", border: "2px solid rgba(212,160,232,0.5)", background: "rgba(212,160,232,0.15)" }} />}
        {isSVEnd && <div style={{ position: "absolute", top: 14, left: 10, width: 10, height: 10, borderRadius: "50%", border: "2px solid rgba(212,160,232,0.5)", background: "rgba(212,160,232,0.4)" }} />}
      </div>
      <div onClick={onToggle} style={{
        flex: 1, background: isActive ? `${bc}10` : "rgba(255,255,255,0.02)", borderRadius: 14,
        border: isActive ? `1px solid ${bc}40` : "1px solid rgba(255,255,255,0.05)",
        padding: "14px 16px", marginBottom: 8, cursor: "pointer", transition: "all 0.2s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: isActive ? bc : "rgba(255,255,255,0.06)", color: isActive ? "#1a1210" : "#a89080", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{globalIndex + 1}</div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: isActive ? "#f5e6d3" : "#c4a882" }}>{step.title}</p>
            {showTag && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
                {isP && <span style={{ fontSize: 9, fontFamily: "'DM Mono',monospace", fontWeight: 600, color: "#7db8e8", background: "rgba(125,184,232,0.12)", padding: "2px 6px", borderRadius: 4, letterSpacing: 1 }}>⟷ PARALLEL</span>}
                {isPStart && <span style={{ fontSize: 9, fontFamily: "'DM Mono',monospace", fontWeight: 600, color: "#e8a87c", background: "rgba(232,168,124,0.12)", padding: "2px 6px", borderRadius: 4, letterSpacing: 1 }}>↓ START 2ND BURNER</span>}
                {(isSVStart || isSVEnd) && <span style={{ fontSize: 9, fontFamily: "'DM Mono',monospace", fontWeight: 600, color: "#d4a0e8", background: "rgba(212,160,232,0.1)", padding: "2px 6px", borderRadius: 4, letterSpacing: 1 }}>{isSVStart ? "◉ SOUS VIDE START" : "◉ SOUS VIDE END"}</span>}
                {step.burner === "prep" && !isP && <span style={{ fontSize: 9, fontFamily: "'DM Mono',monospace", fontWeight: 600, color: "#a8c97d", background: "rgba(168,201,125,0.1)", padding: "2px 6px", borderRadius: 4, letterSpacing: 1 }}>PREP</span>}
                {step.burner === "sv" && !isSVStart && !isSVEnd && <span style={{ fontSize: 9, fontFamily: "'DM Mono',monospace", fontWeight: 600, color: "#d4a0e8", background: "rgba(212,160,232,0.1)", padding: "2px 6px", borderRadius: 4, letterSpacing: 1 }}>SOUS VIDE</span>}
                <span style={{ fontSize: 11, color: "#8a7a6a", fontFamily: "'DM Mono',monospace" }}>{bl}</span>
              </div>
            )}
          </div>
          {step.timerLabel && <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#a89080", whiteSpace: "nowrap" }}>{step.timerLabel}</span>}
        </div>
        {isActive && (
          <div style={{ marginTop: 12, paddingLeft: 38 }}>
            <p style={{ margin: 0, fontSize: 14, color: "#c4a882", lineHeight: 1.6 }}>{step.desc}</p>
            {step.timer && <Timer duration={step.timer} stepKey={`${globalIndex}`} />}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [servings, setServings] = useState(4);
  const [mode, setMode] = useState("trad");
  const [tab, setTab] = useState("recipe");
  const [checked, setChecked] = useState({});
  const [active, setActive] = useState(null);
  const toggle = useCallback(id => setChecked(p => ({ ...p, [id]: !p[id] })), []);
  const isSV = mode === "sv";
  const nightSteps = isSV ? NIGHT_SV : NIGHT_TRAD;
  const daySteps = isSV ? DAY_SV : DAY_TRAD;
  const eq = useMemo(() => getEquipment(servings, isSV), [servings, isSV]);
  const shop = useMemo(() => {
    const cats = ["Seafood", "Produce", "Pantry"];
    return cats.map(c => ({ category: c, items: INGREDIENTS_BASE.filter(i => i.category === c).map(i => ({ ...i, scaled: scaleAmount(i.amount, servings) })) }));
  }, [servings]);
  const sizeLabel = servings <= 6 ? "Intimate dinner" : servings <= 10 ? "Dinner party" : servings <= 16 ? "Large gathering" : "Event-scale feast";
  const legendItems = [
    { color: "#a8c97d", label: "Prep" }, { color: "#e8a87c", label: "Main pot" }, { color: "#7db8e8", label: "Skillet" },
    ...(isSV ? [{ color: "#d4a0e8", label: "Sous vide" }] : []),
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(170deg, #1a1210 0%, #2a1f1a 40%, #1e1612 100%)", color: "#f5e6d3", fontFamily: "'DM Sans',sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "40px 24px 20px", background: "linear-gradient(180deg, rgba(232,168,124,0.08) 0%, transparent 100%)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#e8a87c", margin: "0 0 8px" }}>Serious Eats • Italian-American</p>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, margin: "0 0 6px", lineHeight: 1.15 }}>Zuppa di Pesce</h1>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontStyle: "italic", color: "#c4a882", margin: "0 0 16px" }}>Hearty Italian-American Seafood Stew</p>

          {/* Mode toggle */}
          <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 3 }}>
            {[{ key: "trad", label: "🍲 Traditional", sub: "Stovetop" }, { key: "sv", label: "🌡️ Sous Vide", sub: "Precision" }].map(({ key, label, sub }) => (
              <button key={key} onClick={() => { setMode(key); setActive(null); }} style={{
                flex: 1, padding: "10px 12px", borderRadius: 8, cursor: "pointer", transition: "all 0.2s ease",
                background: mode === key ? (key === "sv" ? "rgba(212,160,232,0.15)" : "rgba(232,168,124,0.15)") : "transparent",
                border: mode === key ? `1px solid ${key === "sv" ? "rgba(212,160,232,0.3)" : "rgba(232,168,124,0.25)"}` : "1px solid transparent",
                color: mode === key ? "#f5e6d3" : "#a89080", fontFamily: "'DM Sans',sans-serif", textAlign: "left",
              }}>
                <span style={{ fontWeight: 600, fontSize: 14, display: "block" }}>{label}</span>
                <span style={{ fontSize: 11, color: mode === key ? (key === "sv" ? "#d4a0e8" : "#e8a87c") : "#6b5d52", fontFamily: "'DM Mono',monospace" }}>{sub}</span>
              </button>
            ))}
          </div>

          {/* Servings */}
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "16px 20px", border: "1px solid rgba(232,168,124,0.12)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, fontSize: 12, color: "#a89080", textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'DM Mono',monospace" }}>Servings</p>
                <p style={{ margin: "4px 0 0", fontSize: 28, fontWeight: 600, color: "#e8a87c", fontFamily: "'DM Mono',monospace" }}>{servings}<span style={{ fontSize: 13, color: "#a89080", fontWeight: 400, marginLeft: 10 }}>{sizeLabel}</span></p>
              </div>
            </div>
            <input type="range" min="1" max="25" value={servings} onChange={e => setServings(parseInt(e.target.value, 10))} style={{ width: "100%", height: 6, appearance: "none", WebkitAppearance: "none", background: `linear-gradient(to right, #e8a87c 0%, #e8a87c ${((servings - 1) / 24) * 100}%, rgba(255,255,255,0.1) ${((servings - 1) / 24) * 100}%, rgba(255,255,255,0.1) 100%)`, borderRadius: 3, outline: "none", cursor: "pointer" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#6b5d52" }}><span>1</span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span></div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 10 }}>
              {[2, 4, 6, 8, 12, 16, 20, 25].map(n => (
                <button key={n} onClick={() => setServings(n)} style={{ padding: "5px 10px", borderRadius: 7, background: servings === n ? "#e8a87c" : "rgba(255,255,255,0.06)", color: servings === n ? "#1a1210" : "#c4a882", border: servings === n ? "none" : "1px solid rgba(255,255,255,0.1)", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'DM Mono',monospace" }}>{n}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 12, color: "#a89080", fontFamily: "'DM Mono',monospace", flexWrap: "wrap" }}>
              <span>🌙 Night {eq.nightTime}</span><span>•</span><span>☀️ Day-of {eq.dayTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", maxWidth: 640, margin: "0 auto", padding: "16px 24px 0", gap: 4 }}>
        {[{ key: "recipe", label: "Recipe" }, { key: "equip", label: "Equipment" }, { key: "shop", label: "Shopping List" }].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, background: tab === key ? "rgba(232,168,124,0.15)" : "transparent", color: tab === key ? "#e8a87c" : "#a89080", border: tab === key ? "1px solid rgba(232,168,124,0.25)" : "1px solid transparent", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 24px 60px" }}>

        {/* RECIPE */}
        {tab === "recipe" && (<>
          {/* Sous vide benefit callout */}
          {isSV && (
            <div style={{ padding: "14px 16px", borderRadius: 12, marginBottom: 16, background: "rgba(212,160,232,0.06)", border: "1px solid rgba(212,160,232,0.15)" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#c4a882", lineHeight: 1.6 }}>
                <strong style={{ color: "#d4a0e8" }}>Sous vide advantage:</strong> Squid cooks night-before at 138°F for 1–2 hrs → silky-tender every time. Cod and shrimp cook day-of at 135°F in parallel with the base reheating. Day-of becomes mostly assembly — just warm proteins in the broth and steam shellfish.
              </p>
            </div>
          )}

          {/* Ingredients */}
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", padding: "20px", marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, margin: "0 0 16px", color: "#e8a87c" }}>Ingredients <span style={{ fontSize: 13, fontFamily: "'DM Mono',monospace", color: "#a89080", marginLeft: 10 }}>for {servings}</span></h2>
            {INGREDIENTS_BASE.map(ing => (
              <div key={ing.id} style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 14, fontWeight: 500, color: "#e8a87c", minWidth: 52, textAlign: "right", flexShrink: 0 }}>{scaleAmount(ing.amount, servings)}</span>
                <span style={{ fontSize: 12, color: "#a89080", minWidth: 36, flexShrink: 0 }}>{ing.unit}</span>
                <span style={{ fontSize: 14, color: "#d4c4b0" }}>{ing.name}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 14, marginBottom: 10, fontSize: 11, fontFamily: "'DM Mono',monospace", color: "#a89080", flexWrap: "wrap" }}>
            {legendItems.map(l => <span key={l.label}><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: l.color, marginRight: 4, verticalAlign: "middle" }} />{l.label}</span>)}
          </div>

          {/* Night Before */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, marginTop: 8 }}>
            <div style={{ fontSize: 20 }}>🌙</div>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, margin: 0 }}>Night Before</h2>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#a89080", fontFamily: "'DM Mono',monospace" }}>
                {isSV ? "Prep + base + sous vide squid" : "Prep + build the base"} • {eq.nightTime}
              </p>
            </div>
          </div>

          {eq.batchNote && servings > 12 && (
            <div style={{ padding: "12px 16px", borderRadius: 10, marginBottom: 10, background: "rgba(168,201,125,0.06)", border: "1px solid rgba(168,201,125,0.15)", fontSize: 13, color: "#c4a882", lineHeight: 1.5 }}>
              🔪 <strong>Big batch tip:</strong> With {servings} servings, prep steps take longer. An extra pair of hands helps a lot.
            </div>
          )}

          {nightSteps.map((step, i) => (
            <StepCard key={`n-${i}`} step={step} globalIndex={i} isActive={active === `n-${i}`} onToggle={() => setActive(active === `n-${i}` ? null : `n-${i}`)} />
          ))}

          {/* Day Of */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, marginTop: 24 }}>
            <div style={{ fontSize: 20 }}>☀️</div>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, margin: 0 }}>Day Of</h2>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#a89080", fontFamily: "'DM Mono',monospace" }}>
                {isSV ? "Sous vide cod & shrimp + reheat + assemble" : "Reheat base + cook the seafood"} • {eq.dayTime}
              </p>
            </div>
          </div>

          {eq.batchNote && (
            <div style={{ padding: "12px 16px", borderRadius: 10, marginBottom: 10, background: "rgba(232,168,124,0.06)", border: "1px solid rgba(232,168,124,0.15)", fontSize: 13, color: "#c4a882", lineHeight: 1.5 }}>
              ⚡ <strong>Scaling tip:</strong> {eq.batchNote}
            </div>
          )}

          {daySteps.map((step, i) => (
            <StepCard key={`d-${i}`} step={step} globalIndex={nightSteps.length + i} isActive={active === `d-${i}`} onToggle={() => setActive(active === `d-${i}` ? null : `d-${i}`)} />
          ))}

          {/* Notes */}
          <div style={{ marginTop: 20, padding: "16px 18px", borderRadius: 14, background: "rgba(232,168,124,0.04)", border: "1px solid rgba(232,168,124,0.1)" }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#e8a87c", textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'DM Mono',monospace", marginBottom: 8 }}>Notes</p>
            {isSV ? (<>
              <p style={{ margin: "0 0 8px", fontSize: 13, color: "#c4a882", lineHeight: 1.6 }}><strong>Squid (138°F / 59°C, 1–2 hrs):</strong> The long gentle cook breaks down collagen without toughening. Consistent silky texture every time — no more guessing.</p>
              <p style={{ margin: "0 0 8px", fontSize: 13, color: "#c4a882", lineHeight: 1.6 }}><strong>Cod & shrimp (135°F / 57°C):</strong> Cod gets 30 min for flaky, moist fillets that hold shape. A small thyme sprig and garlic sliver in the cod bag adds a subtle aromatic layer. Shrimp gets just salt and olive oil for 20 min — snappy, perfectly-set texture. Start cod first, add shrimp 10 min later.</p>
              <p style={{ margin: "0 0 8px", fontSize: 13, color: "#c4a882", lineHeight: 1.6 }}><strong>Why one temp for cod & shrimp?</strong> Ideal cod is 130°F, ideal shrimp is 135°F. At 135°F, cod is slightly firmer but still excellent — and one bath to manage is much simpler, especially at scale.</p>
              <p style={{ margin: 0, fontSize: 13, color: "#c4a882", lineHeight: 1.6 }}><strong>Bagging tip:</strong> Don't overpack bags. Single layer of protein with a drizzle of olive oil and pinch of salt. For large batches, use multiple bags.</p>
            </>) : (<>
              <p style={{ margin: "0 0 8px", fontSize: 13, color: "#c4a882", lineHeight: 1.6 }}><strong>Why split?</strong> Building the base night-before means day-of is just reheating and staging seafood — about {eq.dayTime} of mostly hands-off time.</p>
              <p style={{ margin: "0 0 8px", fontSize: 13, color: "#c4a882", lineHeight: 1.6 }}><strong>Seafood storage:</strong> Prepped proteins keep well overnight sealed in the fridge. Purged clams can sit overnight uncovered — don't submerge.</p>
              <p style={{ margin: 0, fontSize: 13, color: "#c4a882", lineHeight: 1.6 }}><strong>Swaps:</strong> Haddock, monkfish, razor clams, scallops all work. Adjust cook times accordingly.</p>
            </>)}
          </div>
        </>)}

        {/* EQUIPMENT */}
        {tab === "equip" && (<>
          <div style={{ padding: "14px 16px", borderRadius: 12, marginBottom: 16, background: "rgba(232,168,124,0.06)", border: "1px solid rgba(232,168,124,0.15)" }}>
            <p style={{ margin: 0, fontSize: 14, color: "#c4a882", lineHeight: 1.5 }}>
              Gear for <strong style={{ color: "#e8a87c" }}>{servings} servings</strong> — {sizeLabel.toLowerCase()}
              {isSV && <span style={{ color: "#d4a0e8" }}> • sous vide mode</span>}
            </p>
          </div>
          {eq.items.map((item) => (
            <div key={item.name} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 16px", marginBottom: 8, borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(232,168,124,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: "#f5e6d3" }}>{item.name}{item.spec && <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#e8a87c", marginLeft: 8, fontWeight: 500 }}>{item.spec}</span>}</p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#a89080", lineHeight: 1.5 }}>{item.note}</p>
              </div>
            </div>
          ))}
          {eq.batchNote && (
            <div style={{ marginTop: 16, padding: "14px 18px", borderRadius: 12, background: "rgba(232,168,124,0.04)", border: "1px solid rgba(232,168,124,0.1)" }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#e8a87c", textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'DM Mono',monospace", marginBottom: 6 }}>Batching strategy</p>
              <p style={{ margin: 0, fontSize: 13, color: "#c4a882", lineHeight: 1.6 }}>{eq.batchNote}</p>
            </div>
          )}
          <div style={{ marginTop: 16, padding: "14px 18px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#e8a87c", textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'DM Mono',monospace", marginBottom: 6 }}>Time estimates</p>
            <div style={{ display: "flex", gap: 24 }}>
              <div><p style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "#f5e6d3", fontFamily: "'DM Mono',monospace" }}>{eq.nightTime}</p><p style={{ margin: "2px 0 0", fontSize: 11, color: "#a89080" }}>🌙 Night before</p></div>
              <div><p style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "#f5e6d3", fontFamily: "'DM Mono',monospace" }}>{eq.dayTime}</p><p style={{ margin: "2px 0 0", fontSize: 11, color: "#a89080" }}>☀️ Day of</p></div>
            </div>
          </div>
          {isSV && (
            <div style={{ marginTop: 16, padding: "14px 18px", borderRadius: 12, background: "rgba(212,160,232,0.04)", border: "1px solid rgba(212,160,232,0.12)" }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#d4a0e8", textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'DM Mono',monospace", marginBottom: 6 }}>Sous vide temps</p>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                <div><p style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#f5e6d3", fontFamily: "'DM Mono',monospace" }}>138°F</p><p style={{ margin: "2px 0 0", fontSize: 11, color: "#a89080" }}>Squid • 1–2 hrs</p></div>
                <div><p style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#f5e6d3", fontFamily: "'DM Mono',monospace" }}>135°F</p><p style={{ margin: "2px 0 0", fontSize: 11, color: "#a89080" }}>Cod 30m • Shrimp 20m</p></div>
              </div>
            </div>
          )}
        </>)}

        {/* SHOPPING LIST */}
        {tab === "shop" && (<>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 13, color: "#a89080", fontFamily: "'DM Mono',monospace" }}>{Object.values(checked).filter(Boolean).length} / {INGREDIENTS_BASE.length} — for {servings}</p>
            <button onClick={() => setChecked({})} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#a89080", padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Clear all</button>
          </div>
          {shop.map(({ category, items }) => (
            <div key={category} style={{ marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: "#e8a87c", margin: "0 0 10px", paddingBottom: 6, borderBottom: "1px solid rgba(232,168,124,0.15)" }}>
                {category === "Seafood" ? "🐟 " : category === "Produce" ? "🌿 " : "🫙 "}{category}
              </h3>
              {items.map(item => {
                const ch = checked[item.id];
                return (
                  <div key={item.id} onClick={() => toggle(item.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", marginBottom: 4, borderRadius: 10, background: ch ? "rgba(45,90,61,0.15)" : "rgba(255,255,255,0.02)", border: ch ? "1px solid rgba(125,206,160,0.15)" : "1px solid rgba(255,255,255,0.04)", cursor: "pointer", opacity: ch ? 0.5 : 1 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: ch ? "#2d5a3d" : "rgba(255,255,255,0.06)", border: ch ? "1px solid #7dcea0" : "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#7dcea0", fontSize: 13 }}>{ch && "✓"}</div>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 14, fontWeight: 500, color: "#e8a87c", minWidth: 52, textAlign: "right", flexShrink: 0 }}>{item.scaled}</span>
                    <span style={{ fontSize: 12, color: "#a89080", minWidth: 36, flexShrink: 0 }}>{item.unit}</span>
                    <span style={{ fontSize: 14, color: "#d4c4b0", textDecoration: ch ? "line-through" : "none" }}>{item.name.split(",")[0]}</span>
                  </div>
                );
              })}
            </div>
          ))}
          {isSV && (
            <div style={{ marginBottom: 10, padding: "14px 18px", borderRadius: 14, background: "rgba(212,160,232,0.04)", border: "1px solid rgba(212,160,232,0.12)" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#c4a882", lineHeight: 1.6 }}>
                <strong style={{ color: "#d4a0e8" }}>Sous vide extras:</strong> Vacuum seal bags or heavy zip-locks ({servings <= 8 ? "3 bags" : servings <= 16 ? "5–6 bags" : "8+ bags"} — one set each for squid, cod, shrimp).
              </p>
            </div>
          )}
          <div style={{ marginTop: 4, padding: "14px 18px", borderRadius: 14, background: "rgba(232,168,124,0.04)", border: "1px solid rgba(232,168,124,0.1)" }}>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: "#c4a882", lineHeight: 1.6 }}>
              <strong>Also grab:</strong> Crusty bread or linguine ({servings <= 4 ? "1 loaf / 1 lb pasta" : servings <= 8 ? "2 loaves / 1½ lbs" : servings <= 14 ? "3 loaves / 2½ lbs" : servings <= 20 ? "4 loaves / 3½ lbs" : "5+ loaves / 4½ lbs"}).
            </p>
            <p style={{ margin: 0, fontSize: 13, color: "#c4a882", lineHeight: 1.6 }}>
              <strong>Wine:</strong> Pinot Grigio or Vermentino — {servings <= 4 ? "1 bottle" : servings <= 8 ? "2 bottles" : servings <= 14 ? "3 bottles" : servings <= 20 ? "4 bottles" : "5+ bottles"}.
            </p>
          </div>
        </>)}
      </div>
    </div>
  );
}
