import { useState, useEffect, useRef, useCallback, useMemo } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const BASE_SERVINGS = 4;
const INGREDIENTS_BASE = [
  { id: "oil-base",    name: "Extra-virgin olive oil (for base)",                              amount: 60,   unit: "ml",    category: "Pantry" },
  { id: "oil-shell",   name: "Extra-virgin olive oil (for shellfish)",                         amount: 15,   unit: "ml",    category: "Pantry" },
  { id: "oil-drizzle", name: "Extra-virgin olive oil (for drizzling)",                         amount: 15,   unit: "ml",    category: "Pantry" },
  { id: "shrimp",      name: "Large shrimp (26-30/lb), peeled & deveined, shells reserved",   amount: 226,  unit: "g",     category: "Seafood" },
  { id: "onion",       name: "Yellow onion, ¼-inch dice",                                      amount: 0.5,  unit: "piece", category: "Produce" },
  { id: "fennel",      name: "Fennel bulb, ¼-inch dice (fronds reserved)",                    amount: 1,    unit: "piece", category: "Produce" },
  { id: "salt",        name: "Diamond Crystal kosher salt",                                    amount: 0.5,  unit: "tsp",   category: "Pantry" },
  { id: "garlic",      name: "Garlic cloves, minced",                                          amount: 4,    unit: "piece", category: "Produce" },
  { id: "oregano",     name: "Fresh oregano, minced",                                          amount: 2,    unit: "tsp",   category: "Produce" },
  { id: "pepper",      name: "Red pepper flakes",                                              amount: 0.25, unit: "tsp",   category: "Pantry" },
  { id: "wine",        name: "Dry white wine",                                                 amount: 240,  unit: "ml",    category: "Pantry" },
  { id: "saffron",     name: "Saffron",                                                        amount: 1,    unit: "pinch", category: "Pantry" },
  { id: "clam-juice",  name: "Clam juice (bottled)",                                           amount: 237,  unit: "ml",    category: "Seafood" },
  { id: "passata",     name: "Tomato passata",                                                 amount: 700,  unit: "g",     category: "Pantry" },
  { id: "squid",       name: "Squid, bodies in ½-inch rings, tentacles whole",                amount: 454,  unit: "g",     category: "Seafood" },
  { id: "cod",         name: "Skinless cod fillet (¾–1 inch thick), 2×1-inch pieces",        amount: 454,  unit: "g",     category: "Seafood" },
  { id: "clams",       name: "Littleneck clams, scrubbed & purged",                           amount: 454,  unit: "g",     category: "Seafood" },
  { id: "mussels",     name: "Mussels, scrubbed & debearded",                                 amount: 226,  unit: "g",     category: "Seafood" },
  { id: "parsley",     name: "Flat-leaf parsley, chopped",                                    amount: 0.25, unit: "cup",   category: "Produce" },
];

const NIGHT_TRAD = [
  { title: "Purge the clams",       desc: "Submerge clams in salted cold water (~3% salinity — about 1 tbsp salt per 2 cups). Let stand 30 min. Lift out. If sand remains, drain, refill, and repeat until water runs clear. Refrigerate clams.",                                                                                                              timer: 1800, timerLabel: "30 min",   burner: "prep",   parallel: null },
  { title: "Prep the shrimp",       desc: "Peel and devein shrimp. Reserve shells in a small bowl for the base. Cover peeled shrimp and refrigerate.",                                                                                                                                                                                                         timer: null, timerLabel: null,       burner: "prep",   parallel: null },
  { title: "Prep the vegetables",   desc: "Dice onion and fennel bulb into ¼-inch pieces, reserving fennel fronds. Mince garlic and oregano. Store in airtight containers in the fridge.",                                                                                                                                                                     timer: null, timerLabel: null,       burner: "prep",   parallel: null },
  { title: "Prep squid & cod",      desc: "Slice squid bodies into ½-inch rings; leave tentacles whole. Pat dry. Cut cod into 2×1-inch pieces. Cover and refrigerate separately.",                                                                                                                                                                             timer: null, timerLabel: null,       burner: "prep",   parallel: null },
  { title: "Toast shrimp shells",   desc: "Heat olive oil (base) in a Dutch oven over medium-high until shimmering. Add reserved shrimp shells, cook stirring frequently until bright pink and browning. Remove with slotted spoon; discard.",                                                                                                                  timer: null, timerLabel: null,       burner: "main",   parallel: null },
  { title: "Sauté aromatics",       desc: "Add onion, fennel, and salt to pot. Cook, stirring occasionally, until softened and beginning to brown (7–9 min). Stir in garlic, oregano, and red pepper flakes until fragrant (~1 min).",                                                                                                                         timer: 540,  timerLabel: "~9 min",   burner: "main",   parallel: null },
  { title: "Deglaze with wine & saffron", desc: "Stir in ¾ of the wine (180 ml) and saffron. Cook until reduced by about half.",                                                                                                                                                                                                                              timer: 300,  timerLabel: "~5 min",   burner: "main",   parallel: null },
  { title: "Build & reduce the broth",    desc: "Stir in clam juice and passata. Simmer, stirring occasionally, until reduced by about half.",                                                                                                                                                                                                                timer: 1050, timerLabel: "15–20 min", burner: "main",   parallel: null },
  { title: "Cool & refrigerate",    desc: "Remove from heat, cool to room temperature. Transfer to an airtight container and refrigerate overnight. You're done for tonight.",                                                                                                                                                                                   timer: null, timerLabel: null,       burner: "prep",   parallel: null },
];

const DAY_TRAD = [
  { title: "Reheat the base",       desc: "Transfer tomato base back into your Dutch oven. Reheat over medium heat, stirring occasionally, until it reaches a gentle simmer.",                                                                                                                                                                                  timer: null, timerLabel: null,       burner: "main",   parallel: null },
  { title: "Prep the mussels",      desc: "Scrub mussels and pull off any beards. Discard any that are cracked or won't close when tapped.",                                                                                                                                                                                                                   timer: null, timerLabel: null,       burner: "prep",   parallel: null },
  { title: "Simmer the squid",      desc: "Reduce heat to low. Nestle squid into the simmering broth, cover, and gently simmer for 15 minutes.",                                                                                                                                                                                                              timer: 900,  timerLabel: "15 min",   burner: "main",   parallel: null },
  { title: "Add the cod",           desc: "Nestle cod pieces into the broth, cover, and gently simmer until just cooked through.",                                                                                                                                                                                                                             timer: 390,  timerLabel: "5–8 min",  burner: "main",   parallel: null },
  { title: "Add the shrimp",        desc: "Add shrimp, submerging in liquid. Cover and cook until pink and cooked through. Remove pot from heat. Start clams on 2nd burner now.",                                                                                                                                                                              timer: 180,  timerLabel: "2–4 min",  burner: "main",   parallel: "start" },
  { title: "Steam the clams",       desc: "AT THE SAME TIME: In a 12-inch skillet, combine clams, remaining ¼ cup wine, and 1 tbsp olive oil. Cover, boil over high heat. Transfer opened clams to pot.",                                                                                                                                                     timer: 390,  timerLabel: "5–8 min",  burner: "skillet",parallel: "with-prev" },
  { title: "Steam the mussels",     desc: "In same skillet with remaining liquid, add mussels. Cover, high heat until opened. Transfer with ~½ cup broth to pot.",                                                                                                                                                                                            timer: 180,  timerLabel: "2–4 min",  burner: "skillet",parallel: "end" },
  { title: "Finish & serve",        desc: "Return stew to a gentle simmer. Stir in parsley, season with salt and pepper. Divide among warmed bowls, ladle broth over, drizzle olive oil, garnish with fennel fronds. Serve with crusty bread or linguine.",                                                                                                    timer: null, timerLabel: null,       burner: "main",   parallel: null },
];

const NIGHT_SV = [
  { title: "Purge the clams",       desc: "Submerge clams in salted cold water (~3% salinity). Let stand 30 min. If sand remains, repeat. Refrigerate clams.",                                                                                                                                                                                                 timer: 1800, timerLabel: "30 min",   burner: "prep",   parallel: null },
  { title: "Prep the shrimp",       desc: "Peel and devein shrimp. Reserve shells for the base. Season shrimp with a pinch of salt and a drizzle of olive oil, vacuum seal or zip-lock (water displacement method). Refrigerate the bag — you'll sous vide these tomorrow.",                                                                                    timer: null, timerLabel: null,       burner: "prep",   parallel: null },
  { title: "Prep the vegetables",   desc: "Dice onion and fennel into ¼-inch pieces (reserve fronds). Mince garlic and oregano. Refrigerate in containers.",                                                                                                                                                                                                  timer: null, timerLabel: null,       burner: "prep",   parallel: null },
  { title: "Prep squid & cod",      desc: "Slice squid bodies into ½-inch rings, tentacles whole. Season with a pinch of salt and olive oil, seal in a bag — keep it simple, no acid. Cut cod into 2×1-inch pieces, season with salt and olive oil, and optionally add a small sprig of thyme and a thin sliver of garlic to the bag (go easy — raw garlic can turn sulfurous at sous vide temps). Seal in a separate bag.", timer: null, timerLabel: null, burner: "prep", parallel: null },
  { title: "Start sous vide for squid", desc: "Fill and start your sous vide bath at 138°F / 59°C. Once at temp, add the squid bag. This will cook while you build the broth — the squid needs 1–2 hours for silky-tender results.",                                                                                                                           timer: null, timerLabel: null,       burner: "sv",     parallel: "sv-start" },
  { title: "Toast shrimp shells",   desc: "While bath heats: heat olive oil (base) in a Dutch oven over medium-high. Add shells, cook until pink and browning. Remove and discard.",                                                                                                                                                                            timer: null, timerLabel: null,       burner: "main",   parallel: null },
  { title: "Sauté aromatics",       desc: "Add onion, fennel, and salt. Cook until softened and browning (7–9 min). Stir in garlic, oregano, red pepper flakes until fragrant (~1 min).",                                                                                                                                                                      timer: 540,  timerLabel: "~9 min",   burner: "main",   parallel: null },
  { title: "Deglaze with wine & saffron", desc: "Stir in ¾ of the wine (180 ml) and saffron. Cook until reduced by about half.",                                                                                                                                                                                                                              timer: 300,  timerLabel: "~5 min",   burner: "main",   parallel: null },
  { title: "Build & reduce the broth",    desc: "Stir in clam juice and passata. Simmer until reduced by about half. The squid is still cooking in the bath — no action needed there.",                                                                                                                                                                       timer: 1050, timerLabel: "15–20 min", burner: "main",   parallel: null },
  { title: "Remove squid, cool everything", desc: "Pull the squid bag from the bath (it should have at least 1 hr by now). Transfer bag to an ice bath to chill rapidly. Cool the broth to room temp. Refrigerate both the squid (in bag) and broth overnight.",                                                                                               timer: null, timerLabel: null,       burner: "sv",     parallel: "sv-end" },
];

const DAY_SV = [
  { title: "Start sous vide for cod",   desc: "Fill and start your sous vide bath at 135°F / 57°C. Once at temp, add the cod bag. Set a 30-minute timer.",                                                                                                                                                                                                     timer: 1800, timerLabel: "30 min",   burner: "sv",     parallel: "sv-start" },
  { title: "Reheat the base",           desc: "While cod cooks: transfer the tomato base to your Dutch oven. Reheat over medium heat to a gentle simmer.",                                                                                                                                                                                                     timer: null, timerLabel: null,       burner: "main",   parallel: null },
  { title: "Prep the mussels",          desc: "Scrub mussels and remove beards. Discard any that won't close when tapped.",                                                                                                                                                                                                                                    timer: null, timerLabel: null,       burner: "prep",   parallel: null },
  { title: "Add shrimp to bath",        desc: "After cod has been in for 10 min, add the shrimp bag to the same bath. Both will finish together — cod gets 30 min total, shrimp gets 20 min. 135°F works beautifully for both.",                                                                                                                               timer: 1200, timerLabel: "20 min",   burner: "sv",     parallel: null },
  { title: "Remove proteins from bath", desc: "Pull both bags from the bath. Cut open and gently slide the cod and shrimp into the simmering broth. Add the pre-cooked squid (from the fridge bag) too. Let everything warm through gently for 2–3 minutes — do NOT boil, just let the broth barely simmer.",                                                  timer: 150,  timerLabel: "2–3 min",  burner: "main",   parallel: "start" },
  { title: "Steam the clams",           desc: "AT THE SAME TIME: In a 12-inch skillet, combine clams, remaining ¼ cup wine, and 1 tbsp olive oil. Cover, boil over high heat. Transfer opened clams to pot.",                                                                                                                                                  timer: 390,  timerLabel: "5–8 min",  burner: "skillet",parallel: "with-prev" },
  { title: "Steam the mussels",         desc: "In same skillet with remaining liquid, add mussels. Cover, high heat until opened. Transfer with ~½ cup broth to pot.",                                                                                                                                                                                        timer: 180,  timerLabel: "2–4 min",  burner: "skillet",parallel: "end" },
  { title: "Finish & serve",            desc: "Return stew to a gentle simmer. Stir in parsley, season with salt and pepper. Divide among warmed bowls, ladle broth over, drizzle olive oil, garnish with fennel fronds. Serve with crusty bread or linguine.",                                                                                                timer: null, timerLabel: null,       burner: "main",   parallel: null },
];

function getEquipment(servings, isSV) {
  const items = [];
  if (servings <= 6) {
    items.push({ name: "Dutch Oven",   spec: "5–6 quart",          icon: "🍲", note: "Handles base + seafood comfortably" });
    items.push({ name: "Skillet",      spec: "12-inch",             icon: "🫕", note: "For steaming clams & mussels on a second burner" });
  } else if (servings <= 10) {
    items.push({ name: "Dutch Oven",   spec: "7–8 quart",          icon: "🍲", note: "Extra headroom for this volume" });
    items.push({ name: "Skillet",      spec: "12-inch",             icon: "🫕", note: "Steam shellfish in 2 batches per type" });
  } else if (servings <= 16) {
    items.push({ name: "Large Stockpot", spec: "10–12 quart",      icon: "🍲", note: "Dutch oven won't cut it — go stockpot" });
    items.push({ name: "Skillets",     spec: "12-inch (×2 ideal)", icon: "🫕", note: "Two skillets or 2–3 batches for shellfish" });
  } else {
    items.push({ name: "Large Stockpot", spec: "16+ quart",        icon: "🍲", note: "Restaurant-size — consider two pots" });
    items.push({ name: "Skillets / Wide Pot", spec: "2 × 12-inch or rondeau", icon: "🫕", note: "Steam shellfish in parallel to stay on schedule" });
  }
  items.push({ name: "Spider Skimmer", spec: "Slotted spoon",      icon: "🥄", note: "Essential for transferring seafood gently" });
  if (isSV) {
    items.push({ name: "Sous Vide Circulator", spec: "",            icon: "🌡️", note: "Immersion circulator — Anova, Joule, etc." });
    items.push({ name: "Vacuum Bags or Zip-Locks", spec: `${servings <= 8 ? "3 bags" : servings <= 16 ? "5–6 bags" : "8+ bags"}`, icon: "🛍️", note: "One each for squid, cod, shrimp — double up for larger batches so bags aren't overpacked" });
    items.push({ name: "Container / Cambro", spec: servings <= 8 ? "12 qt" : "18+ qt", icon: "🫙", note: servings <= 8 ? "Standard container works" : "Larger vessel needed to fit multiple bags with good water flow" });
    if (servings > 10) items.push({ name: "Ice Bath Bowl", spec: "Large", icon: "🧊", note: "For rapid chilling of squid bags night-before" });
  }
  if (servings > 8)  items.push({ name: "Sheet Tray + Oven", spec: "200°F / 95°C", icon: "♨️", note: "Keep early-cooked seafood warm while finishing batches" });
  if (servings > 12) {
    items.push({ name: "Second Cutting Board", spec: "For seafood", icon: "🔪", note: "Speeds up extended prep" });
    if (!isSV) items.push({ name: "Large Bowl (iced)", spec: "Bowl in ice", icon: "🧊", note: "Keep prepped seafood cold during long prep" });
  }
  if (servings > 6)  items.push({ name: "Large Ladle", spec: "8 oz+", icon: "🫗", note: "Makes portioning much faster" });
  if (servings > 16) {
    items.push({ name: "Warmed Serving Bowls", spec: `${servings}+`, icon: "🥣", note: "Warm bowls at 200°F — keeps stew hot" });
    items.push({ name: "Bread Baskets",        spec: "2–3",          icon: "🍞", note: "Station at multiple spots" });
  }
  const batchNote = servings <= 6  ? null
    : servings <= 10 ? "Steam clams and mussels in 2 rounds each."
    : servings <= 16 ? "Plan 2–3 batches for shellfish."
    : "Event-scale: recruit a helper for shellfish, plan 3–4 batches.";
  const nightTime = servings <= 6  ? (isSV ? "~60 min" : "~45 min")
    : servings <= 10 ? (isSV ? "~75 min" : "~55 min")
    : servings <= 16 ? (isSV ? "~90 min" : "~70 min")
    : (isSV ? "~105 min" : "~90 min");
  const dayTime = servings <= 6  ? (isSV ? "~30 min" : "~35 min")
    : servings <= 10 ? (isSV ? "~40 min" : "~45 min")
    : servings <= 16 ? (isSV ? "~45 min" : "~55 min")
    : (isSV ? "~55 min" : "~70 min");
  return { items, batchNote, nightTime, dayTime };
}

function formatAmount(val) {
  if (val === 0) return "0";
  if (val < 0.15) return "⅛";
  if (val < 0.29) return "¼";
  if (val < 0.40) return "⅓";
  if (val < 0.60) return "½";
  if (val < 0.70) return "⅔";
  if (val < 0.85) return "¾";
  const w = Math.floor(val), f = val - w;
  if (f < 0.15) return `${w}`;
  if (f < 0.29) return `${w > 0 ? w : ""}¼`.trim();
  if (f < 0.40) return `${w > 0 ? w : ""}⅓`.trim();
  if (f < 0.60) return `${w > 0 ? w : ""}½`.trim();
  if (f < 0.70) return `${w > 0 ? w : ""}⅔`.trim();
  if (f < 0.85) return `${w > 0 ? w : ""}¾`.trim();
  return `${w + 1}`;
}

function scaleAmount(a, s) {
  const v = (a / BASE_SERVINGS) * s;
  if (Number.isInteger(v)) return v.toString();
  if (v >= 10) return Math.round(v).toString();
  return formatAmount(v);
}

function fmtTimer(s) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

const CIRCUMFERENCE = 106.8;

// Per-burner active-state classes for step cards
const BURNER = {
  main:    { border: "border-sienna-mid/35", bg: "bg-sienna-mid/[0.025]", bar: "bg-sienna-mid", num: "bg-sienna-mid border-sienna-mid text-white" },
  skillet: { border: "border-ocean/35",      bg: "bg-ocean/[0.025]",      bar: "bg-ocean",      num: "bg-ocean border-ocean text-white" },
  prep:    { border: "border-sage/35",       bg: "bg-sage/[0.025]",       bar: "bg-sage",       num: "bg-sage border-sage text-white" },
  sv:      { border: "border-violet/35",     bg: "bg-violet/[0.025]",     bar: "bg-violet",     num: "bg-violet border-violet text-white" },
};

const BURNER_LABELS = { main: "MAIN POT", skillet: "SKILLET", prep: "PREP", sv: "SOUS VIDE" };

function Timer({ duration, stepKey }) {
  const [rem, setRem] = useState(duration);
  const [on, setOn]   = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setRem(duration);
    setOn(false);
    if (ref.current) clearInterval(ref.current);
  }, [duration, stepKey]);

  useEffect(() => {
    if (!on || rem <= 0) return;
    ref.current = setInterval(() => setRem(r => {
      if (r <= 1) { clearInterval(ref.current); setOn(false); return 0; }
      return r - 1;
    }), 1000);
    return () => clearInterval(ref.current);
  }, [on]); // eslint-disable-line react-hooks/exhaustive-deps

  const pct  = ((duration - rem) / duration) * 100;
  const done = rem === 0;

  return (
    <div className={cn(
      "flex items-center gap-3 mt-3 rounded-lg px-[13px] py-[9px] flex-wrap border",
      done ? "bg-sage-pale border-sage/20" : "bg-parchment border-border"
    )}>
      <svg className="shrink-0" width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="17" fill="none" stroke="var(--color-border)" strokeWidth="2.5" />
        <circle cx="20" cy="20" r="17" fill="none"
          stroke={done ? "var(--color-sage)" : "var(--color-sienna-mid)"}
          strokeWidth="2.5"
          strokeDasharray={`${(pct / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeLinecap="round"
          transform="rotate(-90 20 20)"
          style={{ transition: "stroke-dasharray 0.5s ease" }}
        />
      </svg>
      <span className={cn("font-mono text-[21px] font-medium min-w-[54px] leading-none", done ? "text-sage" : "text-ink")}>
        {done ? "Done!" : fmtTimer(rem)}
      </span>
      {!done && (
        <div className="flex gap-1.5">
          <button
            className="px-3 py-1 rounded-[5px] font-body text-xs font-bold cursor-pointer border transition-all bg-sienna-pale border-sienna-mid/30 text-sienna hover:bg-sienna-mid hover:border-sienna-mid hover:text-white"
            onClick={e => { e.stopPropagation(); setOn(!on); }}
          >
            {on ? "Pause" : "Start"}
          </button>
          <button
            className="px-3 py-1 rounded-[5px] font-body text-xs font-bold cursor-pointer border border-border bg-transparent text-ink-3 hover:text-ink-2"
            onClick={e => { e.stopPropagation(); setRem(duration); setOn(false); }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

function StepCard({ step, globalIndex, isActive, onToggle }) {
  const isP       = step.parallel === "with-prev" || step.parallel === "end";
  const isPStart  = step.parallel === "start";
  const isSVStart = step.parallel === "sv-start";
  const isSVEnd   = step.parallel === "sv-end";
  const showTag   = isP || isPStart || isSVStart || isSVEnd || step.burner === "prep" || step.burner === "sv";
  const bs = BURNER[step.burner] || BURNER.main;

  return (
    <div className="flex mb-1.5">
      {/* Parallel connector lines */}
      <div className="w-7 shrink-0 relative">
        {isPStart && (
          <>
            <div className="absolute left-[14px] w-0.5 bg-ocean/22 top-[18px]" style={{ height: "calc(100% - 18px)" }} />
            <div className="absolute top-[18px] left-2 w-3 h-3 border-l-2 border-b-2 border-ocean/28 rounded-bl-md" />
          </>
        )}
        {isP && (
          <>
            <div className={cn("absolute left-[14px] w-0.5 bg-ocean/22 top-0", step.parallel === "end" ? "h-1/2" : "h-full")} />
            <div className="absolute top-1/2 left-1.5 w-2.5 h-0.5 bg-ocean/22 -translate-y-px" />
          </>
        )}
        {isSVStart && <div className="absolute top-3.5 left-2.5 w-2.5 h-2.5 rounded-full border-2 border-violet/40 bg-violet/10" />}
        {isSVEnd   && <div className="absolute top-3.5 left-2.5 w-2.5 h-2.5 rounded-full border-2 border-violet/40 bg-violet/35" />}
      </div>

      <div
        className={cn(
          "flex-1 bg-card rounded-xl border px-4 py-3.5 cursor-pointer transition-all duration-200 relative overflow-hidden",
          "hover:border-border hover:shadow-card",
          isActive ? cn(bs.border, bs.bg, "shadow-hover") : "border-border-light"
        )}
        onClick={onToggle}
      >
        {/* Left accent bar — real element instead of ::before */}
        {isActive && (
          <div className={cn("absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r-sm", bs.bar)} />
        )}

        <div className="flex items-center gap-3">
          <div className={cn(
            "w-7 h-7 rounded-[7px] flex items-center justify-center font-mono text-[11px] font-medium shrink-0 border transition-colors duration-200",
            isActive ? bs.num : "bg-parchment text-ink-3 border-border-light"
          )}>
            {globalIndex + 1}
          </div>

          <div className="flex-1 min-w-0">
            <p className={cn("font-body font-bold text-sm m-0 leading-snug", isActive ? "text-ink" : "text-ink-2")}>
              {step.title}
            </p>
            {showTag && (
              <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                {isP       && <span className="font-mono text-[9px] font-medium px-1.5 py-0.5 rounded-[3px] tracking-[0.8px] uppercase text-ocean bg-ocean-pale">⟷ Parallel</span>}
                {isPStart  && <span className="font-mono text-[9px] font-medium px-1.5 py-0.5 rounded-[3px] tracking-[0.8px] uppercase text-sienna-mid bg-sienna-pale">↓ Start 2nd Burner</span>}
                {isSVStart && <span className="font-mono text-[9px] font-medium px-1.5 py-0.5 rounded-[3px] tracking-[0.8px] uppercase text-violet bg-violet-pale">◉ Sous Vide Start</span>}
                {isSVEnd   && <span className="font-mono text-[9px] font-medium px-1.5 py-0.5 rounded-[3px] tracking-[0.8px] uppercase text-violet bg-violet-pale">◉ Sous Vide End</span>}
                {step.burner === "prep" && !isP && <span className="font-mono text-[9px] font-medium px-1.5 py-0.5 rounded-[3px] tracking-[0.8px] uppercase text-sage bg-sage-pale">Prep</span>}
                {step.burner === "sv" && !isSVStart && !isSVEnd && <span className="font-mono text-[9px] font-medium px-1.5 py-0.5 rounded-[3px] tracking-[0.8px] uppercase text-violet bg-violet-pale">Sous Vide</span>}
                <span className="font-mono text-[9px] text-ink-4">{BURNER_LABELS[step.burner]}</span>
              </div>
            )}
          </div>

          {step.timerLabel && (
            <span className="font-mono text-[11px] text-ink-3 whitespace-nowrap shrink-0">{step.timerLabel}</span>
          )}
        </div>

        {isActive && (
          <div className="mt-3 pl-10">
            <p className="font-body text-sm text-ink-2 leading-[1.75] m-0">{step.desc}</p>
            {step.timer && <Timer duration={step.timer} stepKey={`${globalIndex}`} />}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [servings, setServings] = useState(4);
  const [mode, setMode]         = useState("trad");
  const [tab, setTab]           = useState("recipe");
  const [checked, setChecked]   = useState({});
  const [active, setActive]     = useState(null);

  const toggle = useCallback(id => setChecked(p => ({ ...p, [id]: !p[id] })), []);

  const isSV      = mode === "sv";
  const nightSteps = isSV ? NIGHT_SV : NIGHT_TRAD;
  const daySteps   = isSV ? DAY_SV   : DAY_TRAD;

  const eq = useMemo(() => getEquipment(servings, isSV), [servings, isSV]);

  const shop = useMemo(() => {
    const cats = ["Seafood", "Produce", "Pantry"];
    return cats.map(c => ({
      category: c,
      items: INGREDIENTS_BASE
        .filter(i => i.category === c)
        .map(i => ({ ...i, scaled: scaleAmount(i.amount, servings) })),
    }));
  }, [servings]);

  const sizeLabel = servings <= 6  ? "Intimate dinner"
    : servings <= 10 ? "Dinner party"
    : servings <= 16 ? "Large gathering"
    : "Event-scale feast";

  const legendItems = [
    { color: "var(--color-sage)",       label: "Prep" },
    { color: "var(--color-sienna-mid)", label: "Main pot" },
    { color: "var(--color-ocean)",      label: "Skillet" },
    ...(isSV ? [{ color: "var(--color-violet)", label: "Sous vide" }] : []),
  ];

  const sliderPct = ((servings - 1) / 24) * 100;

  return (
    <div className="min-h-screen bg-ivory font-body antialiased">

      {/* ── Header ── */}
      <header className="px-6 pt-11 pb-7 border-b border-border relative overflow-hidden">
        {/* Decorative watermark */}
        <div
          className="absolute bottom-[-18px] right-[-16px] font-display text-[130px] font-bold italic leading-none pointer-events-none select-none text-sienna-mid opacity-[0.055] tracking-[-4px]"
          aria-hidden="true"
        >
          PESCE
        </div>

        <div className="max-w-[640px] mx-auto relative animate-fade-up">
          <p className="font-mono text-[10px] tracking-[3px] uppercase text-sienna-mid mb-2.5">
            Serious Eats · Italian-American
          </p>
          <h1 className="font-display text-[clamp(44px,9vw,68px)] font-bold leading-[0.92] text-ink mb-2 tracking-[-1.5px]">
            Zuppa di <em className="italic text-sienna-mid">Pesce</em>
          </h1>
          <p className="font-display text-lg italic text-ink-3 mb-7">
            Hearty Italian-American Seafood Stew
          </p>

          {/* Mode toggle */}
          <div className="flex mb-5 bg-card border border-border rounded-xl overflow-hidden divide-x divide-border">
            {[
              { key: "trad", label: "🍲 Traditional", sub: "Stovetop" },
              { key: "sv",   label: "🌡️ Sous Vide",  sub: "Precision" },
            ].map(({ key, label, sub }) => (
              <button
                key={key}
                className={cn(
                  "flex-1 px-4 py-3 border-none cursor-pointer text-left transition-colors duration-200 relative",
                  mode === key
                    ? "bg-parchment after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-sienna-mid"
                    : "bg-transparent hover:bg-parchment/50"
                )}
                onClick={() => { setMode(key); setActive(null); }}
              >
                <span className={cn("block font-body font-bold text-sm mb-0.5", mode === key ? "text-ink" : "text-ink-3")}>
                  {label}
                </span>
                <span className={cn("block font-mono text-[10px] tracking-[1px] uppercase", mode === key ? "text-sienna-mid" : "text-ink-4")}>
                  {sub}
                </span>
              </button>
            ))}
          </div>

          {/* Servings */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="block font-mono text-[10px] tracking-[2px] uppercase text-ink-3 mb-1">Servings</span>
                <span className="font-display text-[42px] font-bold text-sienna-mid leading-none">
                  {servings}
                  <span className="font-body italic text-[13px] text-ink-3 font-normal ml-2.5">{sizeLabel}</span>
                </span>
              </div>
              <div className="font-mono text-[11px] text-ink-3 text-right leading-loose pt-1">
                <div>🌙 Night {eq.nightTime}</div>
                <div>☀️ Day-of {eq.dayTime}</div>
              </div>
            </div>
            <input
              type="range" min="1" max="25" value={servings}
              onChange={e => setServings(parseInt(e.target.value, 10))}
              className="w-full h-1 rounded-sm cursor-pointer outline-none block"
              style={{ background: `linear-gradient(to right, var(--color-sienna-mid) 0%, var(--color-sienna-mid) ${sliderPct}%, var(--color-border) ${sliderPct}%, var(--color-border) 100%)` }}
            />
            <div className="flex justify-between font-mono text-[9px] text-ink-4 mt-1.5">
              <span>1</span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span>
            </div>
            <div className="flex gap-1 flex-wrap mt-3 pt-3 border-t border-border-light">
              {[2, 4, 6, 8, 12, 16, 20, 25].map(n => (
                <button
                  key={n}
                  className={cn(
                    "px-[11px] py-1 rounded-md border font-mono text-xs cursor-pointer transition-all duration-150",
                    servings === n
                      ? "bg-sienna-mid text-white border-sienna-mid"
                      : "bg-transparent text-ink-3 border-border hover:border-sienna-light hover:text-sienna-mid"
                  )}
                  onClick={() => setServings(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── Tabs ── */}
      <nav
        className="max-w-[640px] mx-auto px-6 flex border-b border-border animate-fade-up"
        style={{ animationDelay: "0.08s" }}
      >
        {[
          { key: "recipe", label: "Recipe" },
          { key: "equip",  label: "Equipment" },
          { key: "shop",   label: "Shopping List" },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={cn(
              "px-5 py-3.5 bg-transparent border-none cursor-pointer font-body text-[13px] font-bold transition-colors duration-200 relative tracking-[0.2px]",
              tab === key
                ? "text-sienna-mid after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-0.5 after:bg-sienna-mid"
                : "text-ink-4 hover:text-ink-2"
            )}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* ── Content ── */}
      <div
        className="max-w-[640px] mx-auto px-6 pt-6 pb-20 animate-fade-up"
        style={{ animationDelay: "0.14s" }}
      >

        {/* ── RECIPE ── */}
        {tab === "recipe" && (
          <>
            {isSV && (
              <div className="bg-violet-pale border border-violet/20 border-l-[3px] border-l-violet rounded-lg px-4 py-3.5 mb-5 text-[13.5px] text-ink-2 leading-[1.7]">
                <strong className="text-violet">Sous vide advantage:</strong> Squid cooks night-before at 138°F for 1–2 hrs → silky-tender every time. Cod and shrimp cook day-of at 135°F in parallel with the base reheating. Day-of becomes mostly assembly — just warm proteins in the broth and steam shellfish.
              </div>
            )}

            {/* Ingredients */}
            <div className="bg-card border border-border rounded-xl px-6 py-5 mb-7 shadow-card">
              <h2 className="font-display text-2xl font-bold text-ink mb-4 flex items-baseline gap-2.5">
                Ingredients
                <span className="font-mono text-xs text-ink-4 font-normal">for {servings}</span>
              </h2>
              {INGREDIENTS_BASE.map(ing => (
                <div key={ing.id} className="flex items-baseline gap-3 py-2 border-b border-border-light last:border-0">
                  <span className="font-mono text-[13px] font-medium text-sienna-mid min-w-[46px] text-right shrink-0">
                    {scaleAmount(ing.amount, servings)}
                  </span>
                  <span className="font-mono text-[11px] text-ink-4 min-w-[34px] shrink-0">{ing.unit}</span>
                  <span className="text-sm text-ink-2 leading-snug">{ing.name}</span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex gap-4 flex-wrap mb-2.5">
              {legendItems.map(l => (
                <span key={l.label} className="flex items-center gap-1.5 font-mono text-[10px] text-ink-3 tracking-[0.5px]">
                  <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: l.color }} />
                  {l.label}
                </span>
              ))}
            </div>

            {/* Night Before */}
            <div className="flex items-center gap-3.5 mt-2.5 mb-3.5">
              <span className="text-[22px] leading-none">🌙</span>
              <div>
                <h2 className="font-display text-2xl font-bold text-ink m-0 leading-none mb-0.5">Night Before</h2>
                <p className="font-mono text-[10px] tracking-[0.5px] text-ink-3 m-0">
                  {isSV ? "Prep + base + sous vide squid" : "Prep + build the base"} · {eq.nightTime}
                </p>
              </div>
            </div>

            {eq.batchNote && servings > 12 && (
              <div className="bg-sage-pale border border-sage/22 border-l-[3px] border-l-sage rounded-lg px-4 py-3 mb-2.5 text-[13px] text-ink-2 leading-[1.65]">
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
              />
            ))}

            {/* Day Of */}
            <div className="flex items-center gap-3.5 mt-8 mb-3.5">
              <span className="text-[22px] leading-none">☀️</span>
              <div>
                <h2 className="font-display text-2xl font-bold text-ink m-0 leading-none mb-0.5">Day Of</h2>
                <p className="font-mono text-[10px] tracking-[0.5px] text-ink-3 m-0">
                  {isSV ? "Sous vide cod & shrimp + reheat + assemble" : "Reheat base + cook the seafood"} · {eq.dayTime}
                </p>
              </div>
            </div>

            {eq.batchNote && (
              <div className="bg-sienna-pale border border-sienna-mid/18 border-l-[3px] border-l-sienna-mid rounded-lg px-4 py-3 mb-2.5 text-[13px] text-ink-2 leading-[1.65]">
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
              />
            ))}

            {/* Notes */}
            <div className="mt-5 px-5 py-[18px] rounded-xl bg-parchment border border-border">
              <p className="font-mono text-[10px] font-medium text-sienna-mid uppercase tracking-[2px] mb-3">Notes</p>
              {isSV ? (
                <>
                  <p className="text-[13px] text-ink-2 leading-[1.75] mb-2"><strong>Squid (138°F / 59°C, 1–2 hrs):</strong> The long gentle cook breaks down collagen without toughening. Consistent silky texture every time — no more guessing.</p>
                  <p className="text-[13px] text-ink-2 leading-[1.75] mb-2"><strong>Cod & shrimp (135°F / 57°C):</strong> Cod gets 30 min for flaky, moist fillets that hold shape. A small thyme sprig and garlic sliver in the cod bag adds a subtle aromatic layer. Shrimp gets just salt and olive oil for 20 min — snappy, perfectly-set texture. Start cod first, add shrimp 10 min later.</p>
                  <p className="text-[13px] text-ink-2 leading-[1.75] mb-2"><strong>Why one temp for cod & shrimp?</strong> Ideal cod is 130°F, ideal shrimp is 135°F. At 135°F, cod is slightly firmer but still excellent — and one bath to manage is much simpler, especially at scale.</p>
                  <p className="text-[13px] text-ink-2 leading-[1.75]"><strong>Bagging tip:</strong> Don't overpack bags. Single layer of protein with a drizzle of olive oil and pinch of salt. For large batches, use multiple bags.</p>
                </>
              ) : (
                <>
                  <p className="text-[13px] text-ink-2 leading-[1.75] mb-2"><strong>Why split?</strong> Building the base night-before means day-of is just reheating and staging seafood — about {eq.dayTime} of mostly hands-off time.</p>
                  <p className="text-[13px] text-ink-2 leading-[1.75] mb-2"><strong>Seafood storage:</strong> Prepped proteins keep well overnight sealed in the fridge. Purged clams can sit overnight uncovered — don't submerge.</p>
                  <p className="text-[13px] text-ink-2 leading-[1.75]"><strong>Swaps:</strong> Haddock, monkfish, razor clams, scallops all work. Adjust cook times accordingly.</p>
                </>
              )}
            </div>
          </>
        )}

        {/* ── EQUIPMENT ── */}
        {tab === "equip" && (
          <>
            <div className="bg-sienna-pale border border-sienna-mid/14 rounded-xl px-4 py-3.5 mb-4 text-sm text-ink-2 leading-[1.6]">
              Gear for <strong className="text-sienna-mid">{servings} servings</strong> — {sizeLabel.toLowerCase()}
              {isSV && <span className="text-violet"> · sous vide mode</span>}
            </div>

            {eq.items.map(item => (
              <div key={item.name} className="flex gap-3.5 items-start px-4 py-3.5 mb-2 rounded-xl bg-card border border-border-light shadow-card">
                <div className="w-11 h-11 rounded-xl bg-parchment border border-border flex items-center justify-center text-[22px] shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-body font-bold text-sm text-ink m-0 mb-1">
                    {item.name}
                    {item.spec && <span className="font-mono text-[11px] text-sienna-mid font-normal ml-2">{item.spec}</span>}
                  </p>
                  <p className="text-[13px] text-ink-3 leading-[1.6] m-0">{item.note}</p>
                </div>
              </div>
            ))}

            {eq.batchNote && (
              <div className="mt-3 px-[18px] py-4 rounded-xl bg-parchment border border-border">
                <p className="font-mono text-[10px] font-medium text-sienna-mid uppercase tracking-[2px] mb-2.5">Batching strategy</p>
                <p className="text-[13px] text-ink-2 leading-[1.6] m-0">{eq.batchNote}</p>
              </div>
            )}

            <div className="mt-3 px-[18px] py-4 rounded-xl bg-card border border-border-light">
              <p className="font-mono text-[10px] font-medium text-sienna-mid uppercase tracking-[2px] mb-2.5">Time estimates</p>
              <div className="flex gap-7">
                <div>
                  <span className="block font-display text-[28px] font-bold text-ink leading-none">{eq.nightTime}</span>
                  <p className="font-mono text-[11px] text-ink-3 mt-1">🌙 Night before</p>
                </div>
                <div>
                  <span className="block font-display text-[28px] font-bold text-ink leading-none">{eq.dayTime}</span>
                  <p className="font-mono text-[11px] text-ink-3 mt-1">☀️ Day of</p>
                </div>
              </div>
            </div>

            {isSV && (
              <div className="mt-3 px-[18px] py-4 rounded-xl bg-violet-pale border border-violet/14">
                <p className="font-mono text-[10px] font-medium text-violet uppercase tracking-[2px] mb-2.5">Sous vide temps</p>
                <div className="flex gap-7 flex-wrap">
                  <div>
                    <span className="block font-mono text-[20px] font-medium text-ink leading-none">138°F</span>
                    <p className="font-mono text-[11px] text-ink-3 mt-1">Squid · 1–2 hrs</p>
                  </div>
                  <div>
                    <span className="block font-mono text-[20px] font-medium text-ink leading-none">135°F</span>
                    <p className="font-mono text-[11px] text-ink-3 mt-1">Cod 30m · Shrimp 20m</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── SHOPPING LIST ── */}
        {tab === "shop" && (
          <>
            <div className="flex justify-between items-center mb-[18px]">
              <p className="font-mono text-xs text-ink-3">
                {Object.values(checked).filter(Boolean).length} / {INGREDIENTS_BASE.length} — for {servings}
              </p>
              <button
                className="bg-transparent border border-border rounded-md text-ink-3 px-3 py-1.5 font-body text-xs cursor-pointer transition-all hover:border-sienna-mid hover:text-sienna-mid"
                onClick={() => setChecked({})}
              >
                Clear all
              </button>
            </div>

            {shop.map(({ category, items }) => (
              <div key={category} className="mb-[22px]">
                <h3 className="font-mono text-[10px] tracking-[2.5px] uppercase text-sienna-mid m-0 mb-2 pb-1.5 border-b border-sienna-mid/18">
                  {category === "Seafood" ? "🐟 " : category === "Produce" ? "🌿 " : "🫙 "}{category}
                </h3>
                {items.map(item => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-3 px-2.5 py-2.5 mb-0.5 rounded-lg border cursor-pointer transition-all duration-150",
                      checked[item.id]
                        ? "bg-sage-pale border-sage/14 opacity-50"
                        : "border-transparent hover:bg-parchment hover:border-border-light"
                    )}
                    onClick={() => toggle(item.id)}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-[5px] border-[1.5px] flex items-center justify-center text-[11px] shrink-0 transition-all",
                      checked[item.id] ? "bg-sage border-sage text-white" : "border-border bg-transparent"
                    )}>
                      {checked[item.id] && "✓"}
                    </div>
                    <span className="font-mono text-[13px] font-medium text-sienna-mid min-w-[46px] text-right shrink-0">{item.scaled}</span>
                    <span className="font-mono text-[11px] text-ink-4 min-w-[34px] shrink-0">{item.unit}</span>
                    <span className={cn("text-sm text-ink-2", checked[item.id] && "line-through")}>
                      {item.name.split(",")[0]}
                    </span>
                  </div>
                ))}
              </div>
            ))}

            {isSV && (
              <div className="mb-2.5 px-[18px] py-3.5 rounded-xl bg-violet-pale border border-violet/14 text-[13px] text-ink-2 leading-[1.7]">
                <strong className="text-violet">Sous vide extras:</strong> Vacuum seal bags or heavy zip-locks ({servings <= 8 ? "3 bags" : servings <= 16 ? "5–6 bags" : "8+ bags"} — one set each for squid, cod, shrimp).
              </div>
            )}

            <div className="px-[18px] py-3.5 rounded-xl bg-parchment border border-border text-[13px] text-ink-2 leading-[1.75]">
              <p className="mb-1.5">
                <strong>Also grab:</strong> Crusty bread or linguine ({servings <= 4 ? "1 loaf / 1 lb pasta" : servings <= 8 ? "2 loaves / 1½ lbs" : servings <= 14 ? "3 loaves / 2½ lbs" : servings <= 20 ? "4 loaves / 3½ lbs" : "5+ loaves / 4½ lbs"}).
              </p>
              <p>
                <strong>Wine:</strong> Pinot Grigio or Vermentino — {servings <= 4 ? "1 bottle" : servings <= 8 ? "2 bottles" : servings <= 14 ? "3 bottles" : servings <= 20 ? "4 bottles" : "5+ bottles"}.
              </p>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
