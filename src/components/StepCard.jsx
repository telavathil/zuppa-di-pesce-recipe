import { cn } from "../utils.js";
import Timer from "./Timer.jsx";

const BURNER = {
  main:    { bg: "bg-sienna-pale",   bar: "bg-sienna",     num: "bg-sienna text-white",     tag: "text-sienna bg-sienna-pale" },
  skillet: { bg: "bg-ocean-pale",    bar: "bg-ocean",      num: "bg-ocean text-white",       tag: "text-ocean bg-ocean-pale" },
  prep:    { bg: "bg-sage-pale",     bar: "bg-sage",       num: "bg-sage text-white",        tag: "text-sage bg-sage-pale" },
  sv:      { bg: "bg-violet-pale",   bar: "bg-violet",     num: "bg-violet text-white",      tag: "text-violet bg-violet-pale" },
};

const BURNER_LABELS = { main: "MAIN POT", skillet: "SKILLET", prep: "PREP", sv: "SOUS VIDE" };

export default function StepCard({ step, globalIndex, isActive, onToggle, resetKey }) {
  const isP       = step.parallel === "with-prev" || step.parallel === "end";
  const isPStart  = step.parallel === "start";
  const isSVStart = step.parallel === "sv-start";
  const isSVEnd   = step.parallel === "sv-end";
  const showTag   = isP || isPStart || isSVStart || isSVEnd || step.burner === "prep" || step.burner === "sv";
  const bs = BURNER[step.burner] || BURNER.main;

  return (
    <div className="flex mb-2">
      {/* Parallel connector lines */}
      <div className="w-7 shrink-0 relative">
        {isPStart && (
          <div className="absolute left-[13px] w-px bg-ocean/35 top-1/2 bottom-[-8px]" />
        )}
        {isP && (
          <>
            <div className={cn(
              "absolute left-[13px] w-px bg-ocean/35 top-0",
              step.parallel === "end" ? "h-1/2" : "h-full"
            )} />
            <div className="absolute left-[13px] w-[11px] h-px bg-ocean/35 top-1/2" />
          </>
        )}
        {isSVStart && <div className="absolute top-3.5 left-2.5 w-2.5 h-2.5 rounded-full border-2 border-violet/40 bg-violet/10" />}
        {isSVEnd   && <div className="absolute top-3.5 left-2.5 w-2.5 h-2.5 rounded-full border-2 border-violet/40 bg-violet/35" />}
      </div>

      {/* Card — no border, depth via shadow + bg */}
      <div
        className={cn(
          "flex-1 rounded-2xl px-4 py-3.5 cursor-pointer transition-all duration-200 relative overflow-hidden",
          isActive ? cn(bs.bg, "shadow-hover") : "bg-card shadow-card hover:shadow-hover"
        )}
        onClick={onToggle}
      >
        {isActive && (
          <div className={cn("absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full", bs.bar)} />
        )}

        <div className="flex items-center gap-3">
          <div className={cn(
            "w-7 h-7 rounded-xl flex items-center justify-center font-mono text-[11px] font-medium shrink-0 transition-colors duration-200",
            isActive ? bs.num : "bg-surface-low text-ink-3"
          )}>
            {globalIndex + 1}
          </div>

          <div className="flex-1 min-w-0">
            <p className={cn("font-body font-bold text-sm m-0 leading-snug", isActive ? "text-ink" : "text-ink-2")}>
              {step.title}
            </p>
            {showTag && (
              <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                {isP       && <span className="font-mono text-[9px] font-medium px-1.5 py-0.5 rounded-full tracking-[0.08em] uppercase text-ocean bg-ocean-pale">⟷ Parallel</span>}
                {isPStart  && <span className="font-mono text-[9px] font-medium px-1.5 py-0.5 rounded-full tracking-[0.08em] uppercase text-sienna bg-sienna-pale">↓ Start 2nd Burner</span>}
                {isSVStart && <span className="font-mono text-[9px] font-medium px-1.5 py-0.5 rounded-full tracking-[0.08em] uppercase text-violet bg-violet-pale">◉ Sous Vide Start</span>}
                {isSVEnd   && <span className="font-mono text-[9px] font-medium px-1.5 py-0.5 rounded-full tracking-[0.08em] uppercase text-violet bg-violet-pale">◉ Sous Vide End</span>}
                {step.burner === "prep" && !isP && <span className="font-mono text-[9px] font-medium px-1.5 py-0.5 rounded-full tracking-[0.08em] uppercase text-sage bg-sage-pale">Prep</span>}
                {step.burner === "sv" && !isSVStart && !isSVEnd && <span className="font-mono text-[9px] font-medium px-1.5 py-0.5 rounded-full tracking-[0.08em] uppercase text-violet bg-violet-pale">Sous Vide</span>}
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
          </div>
        )}
        {/* Timer stays mounted so it keeps running when card is collapsed */}
        {step.timer && (
          <div className={isActive ? "pl-10 mt-2" : "hidden"}>
            <Timer duration={step.timer} stepKey={`${globalIndex}-${resetKey}`} />
          </div>
        )}
      </div>
    </div>
  );
}
