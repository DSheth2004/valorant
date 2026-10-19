import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Gift } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useCountdown } from "../hooks/useCountdown";
import { userApi } from "../lib/api";
import { Button } from "./ui/Button";

const COOLDOWN_MS = 24 * 60 * 60 * 1000;

export function DailyRewardButton({ className, size = "md" }) {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [claiming, setClaiming] = useState(false);
  const [burst, setBurst] = useState(0);

  const availableAt = user.lastDailyRewardAt ? new Date(user.lastDailyRewardAt).getTime() + COOLDOWN_MS : null;
  const { label, isComplete } = useCountdown(availableAt);
  const available = !availableAt || isComplete;

  const claim = async () => {
    setClaiming(true);
    try {
      const { reward, user: updated } = await userApi.claimDailyReward();
      setUser(updated);
      setBurst((n) => n + 1);
      toast.success(`+${reward} VP claimed`, "Come back tomorrow for more.");
    } catch (error) {
      toast.error("Couldn't claim reward", error.message);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className={clsx("relative", className)}>
      <Button
        size={size}
        variant={available ? "primary" : "outline"}
        onClick={claim}
        disabled={!available}
        loading={claiming}
        className="w-full"
      >
        {!claiming && <Gift className="size-4" />}
        {available ? "Claim daily 500 VP" : <span className="tabular-nums">Next reward in {label}</span>}
      </Button>
      <AnimatePresence>
        {burst > 0 && (
          <motion.span
            key={burst}
            className="pointer-events-none absolute -top-2 left-1/2 font-display text-2xl text-brand"
            initial={{ opacity: 1, y: 0, x: "-50%" }}
            animate={{ opacity: 0, y: -48 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            onAnimationComplete={() => setBurst(0)}
          >
            +500 VP
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
