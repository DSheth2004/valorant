import { User } from "../models/User.js";
import { AGENTS } from "../data/agents.js";
import { getItem } from "../services/catalog.js";
import { HttpError } from "../utils/HttpError.js";

export const DAILY_REWARD_VP = 500;
export const DAILY_REWARD_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export function getCollection(req, res) {
  const items = req.user.inventory
    .map(({ itemId, pricePaid, purchasedAt }) => {
      const item = getItem(itemId);
      return item && { ...item, pricePaid, purchasedAt };
    })
    .filter(Boolean)
    .sort((a, b) => b.purchasedAt - a.purchasedAt);

  const totalSpent = items.reduce((sum, item) => sum + item.pricePaid, 0);
  res.json({ items, totalSpent });
}

export async function claimDailyReward(req, res) {
  const now = new Date();
  const eligibleBefore = new Date(now.getTime() - DAILY_REWARD_COOLDOWN_MS);

  const updated = await User.findOneAndUpdate(
    {
      _id: req.user._id,
      $or: [{ lastDailyRewardAt: null }, { lastDailyRewardAt: { $lte: eligibleBefore } }],
    },
    { $inc: { valorantPoints: DAILY_REWARD_VP }, $set: { lastDailyRewardAt: now } },
    { returnDocument: "after" },
  );

  if (!updated) {
    // Re-read rather than trusting req.user, which may predate a concurrent claim.
    const { lastDailyRewardAt } = await User.findById(req.user._id).lean();
    const availableAt = new Date((lastDailyRewardAt ?? now).getTime() + DAILY_REWARD_COOLDOWN_MS);
    throw new HttpError(429, "You've already claimed today's reward", {
      code: "REWARD_ON_COOLDOWN",
      meta: { availableAt: availableAt.toISOString() },
    });
  }

  res.json({ reward: DAILY_REWARD_VP, user: updated });
}

function assertAgentExists(agentId) {
  if (!AGENTS.some((agent) => agent.id === agentId)) {
    throw new HttpError(404, `Agent "${agentId}" not found`, { code: "NOT_FOUND" });
  }
}

export async function addFavoriteAgent(req, res) {
  assertAgentExists(req.params.agentId);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { favoriteAgents: req.params.agentId } },
    { returnDocument: "after" },
  );
  res.json({ user });
}

export async function removeFavoriteAgent(req, res) {
  assertAgentExists(req.params.agentId);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { favoriteAgents: req.params.agentId } },
    { returnDocument: "after" },
  );
  res.json({ user });
}
