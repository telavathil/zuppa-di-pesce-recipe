import { useEffect, useState } from "react";
import { useInstallPrompt } from "../lib/pwa.js";

const DISMISSED_KEY = "pwa-install-dismissed";

export default function InstallBanner() {
  const { canInstall, install, dismiss } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISSED_KEY) === "true"
  );

  useEffect(() => {
    if (dismissed) localStorage.setItem(DISMISSED_KEY, "true");
  }, [dismissed]);

  if (!canInstall || dismissed) return null;

  return (
    <div
      className="fixed bottom-20 left-4 right-4 z-[55] rounded-2xl px-4 py-3.5 flex items-center gap-3 max-w-lg mx-auto"
      style={{
        background: "var(--color-card)",
        boxShadow: "0 8px 40px rgba(155,64,6,0.15)",
      }}
    >
      <img src="/icon.png" alt="" className="w-10 h-10 rounded-xl shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-body font-bold text-sm text-ink leading-none mb-0.5">Add to Home Screen</p>
        <p className="font-body text-xs text-ink-3">Install for quick access & offline use</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          className="font-body text-xs font-semibold text-ink-4 cursor-pointer bg-transparent border-none px-2 py-1"
          onClick={() => setDismissed(true)}
        >
          Not now
        </button>
        <button
          className="font-body text-xs font-bold text-white rounded-full px-3.5 py-1.5 border-none cursor-pointer"
          style={{ background: "linear-gradient(135deg, var(--color-sienna), var(--color-sienna-mid))" }}
          onClick={() => { install(); setDismissed(true); }}
        >
          Install
        </button>
      </div>
    </div>
  );
}
