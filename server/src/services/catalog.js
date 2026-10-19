import { WEAPONS } from "../data/weapons.js";
import { PLAYER_CARDS } from "../data/playerCards.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const FEATURED_SKIN_COUNT = 4;
const FEATURED_CARD_COUNT = 4;

const SKINS = WEAPONS.flatMap((weapon) => weapon.skins.map((skin) => ({ ...skin, type: "skin" })));
const CARDS = PLAYER_CARDS.map((card) => ({ ...card, type: "card" }));

const ITEMS_BY_ID = new Map([...SKINS, ...CARDS].map((item) => [item.id, item]));

export const getItem = (itemId) => ITEMS_BY_ID.get(itemId);

/** Small deterministic PRNG so every server instance agrees on today's rotation. */
function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededSample(items, count, seed) {
  const random = mulberry32(seed);
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

/** The store rotates daily at 00:00 UTC, like the in-game store. */
export function getStoreRotation(now = new Date()) {
  const day = Math.floor(now.getTime() / DAY_MS);
  return {
    skins: seededSample(SKINS, FEATURED_SKIN_COUNT, day),
    cards: seededSample(CARDS, FEATURED_CARD_COUNT, day * 7919 + 17),
    refreshesAt: new Date((day + 1) * DAY_MS).toISOString(),
  };
}

export function isInRotation(itemId, now = new Date()) {
  const { skins, cards } = getStoreRotation(now);
  return [...skins, ...cards].some((item) => item.id === itemId);
}
