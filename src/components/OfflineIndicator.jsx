import { useOnlineStatus } from "../lib/pwa.js";

export default function OfflineIndicator() {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center gap-2 py-2 font-body text-xs font-semibold text-white tracking-[0.08em]"
      style={{ background: "var(--color-ink-2)" }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
      You're offline — recipe content still available
    </div>
  );
}
