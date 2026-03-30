import { cn } from "../utils.js";

const NAV_ITEMS = [
  {
    key: "recipe",
    label: "Recipe",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    key: "equip",
    label: "Equipment",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10h18M5 10V19a1 1 0 001 1h12a1 1 0 001-1V10M8 10V7a4 4 0 018 0v3" />
        <path d="M10 5h4" />
      </svg>
    ),
  },
  {
    key: "shop",
    label: "Shopping",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        <path d="M9 14l2 2 4-4" />
      </svg>
    ),
  },
  {
    key: "settings",
    label: "Settings",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    ),
  },
];

export default function BottomNav({ tab, onTabChange }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "rgba(254, 249, 242, 0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
      }}
    >
      <div className="flex max-w-lg mx-auto">
        {NAV_ITEMS.map(({ key, label, icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 pt-2.5 pb-1 border-none bg-transparent cursor-pointer transition-colors duration-150",
                active ? "text-sienna" : "text-ink-4"
              )}
              onClick={() => onTabChange(key)}
            >
              <span className={cn("transition-transform duration-150", active && "scale-110")}>
                {icon(active)}
              </span>
              <span className={cn(
                "font-body text-[9px] tracking-[0.08em] uppercase font-semibold transition-colors duration-150",
                active ? "text-sienna" : "text-ink-4"
              )}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
