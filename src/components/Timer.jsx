import { useState, useEffect, useRef } from "react";
import { cn, fmtTimer } from "../utils.js";

const CIRCUMFERENCE = 106.8;

export default function Timer({ duration, stepKey }) {
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
      "flex items-center gap-3 mt-3 rounded-2xl px-4 py-3 flex-wrap",
      done ? "bg-sage-pale" : "bg-surface-low"
    )}>
      <svg className="shrink-0" width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="17" fill="none" stroke="var(--color-border)" strokeWidth="2.5" />
        <circle cx="20" cy="20" r="17" fill="none"
          stroke={done ? "var(--color-sage)" : "var(--color-sienna)"}
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
        <div className="flex gap-2">
          {/* Primary pill — gradient */}
          <button
            className="px-4 py-1.5 rounded-full font-body text-xs font-bold cursor-pointer border-none text-white transition-all"
            style={{ background: "linear-gradient(135deg, var(--color-sienna), var(--color-sienna-mid))", boxShadow: "0 2px 12px rgba(155,64,6,0.25)" }}
            onClick={e => { e.stopPropagation(); setOn(!on); }}
          >
            {on ? "Pause" : "Start"}
          </button>
          {/* Ghost pill */}
          <button
            className="px-4 py-1.5 rounded-full font-body text-xs font-semibold cursor-pointer bg-transparent text-ink-3 ring-1 ring-ink/[0.12] hover:text-ink-2 transition-colors"
            onClick={e => { e.stopPropagation(); setRem(duration); setOn(false); }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
