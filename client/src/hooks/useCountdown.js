import { useEffect, useState } from "react";

const pad = (n) => String(n).padStart(2, "0");

/** Live countdown to `target` (Date or ISO string), ticking once per second. */
export function useCountdown(target) {
  const targetTime = target ? new Date(target).getTime() : null;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!targetTime) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  const remaining = targetTime ? Math.max(0, targetTime - now) : 0;
  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    remaining,
    isComplete: targetTime !== null && remaining === 0,
    label: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
  };
}
