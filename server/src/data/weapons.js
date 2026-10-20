import { assetUrl } from "./assets.js";
import { SKIN_MEDIA } from "./skinMedia.js";

export const WEAPON_CATEGORIES = [
  { id: "sidearm", name: "Sidearms" },
  { id: "smg", name: "SMGs" },
  { id: "shotgun", name: "Shotguns" },
  { id: "rifle", name: "Rifles" },
  { id: "sniper", name: "Sniper Rifles" },
  { id: "machine-gun", name: "Machine Guns" },
  { id: "melee", name: "Melee" },
];

/** Store price (in VP) for each skin tier. Melee skins cost double. */
export const SKIN_TIERS = {
  select: { name: "Select", price: 875 },
  deluxe: { name: "Deluxe", price: 1275 },
  premium: { name: "Premium", price: 1775 },
  exclusive: { name: "Exclusive", price: 2175 },
  ultra: { name: "Ultra", price: 2475 },
};

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const weapon = ({ id, name, category, stats, skins = [] }) => ({
  id,
  name,
  category,
  stats,
  image: assetUrl(`weapons/${id}.webp`),
  skins: skins.map(([skinName, tier, slug = slugify(skinName)]) => {
    const skinId = `${id}-${slug}`;
    const basePrice = SKIN_TIERS[tier].price;
    return {
      id: skinId,
      weaponId: id,
      name: category === "melee" ? skinName : `${skinName} ${name}`,
      collection: skinName,
      tier,
      price: category === "melee" ? basePrice * 2 : basePrice,
      image: assetUrl(`skins/${skinId}.webp`),
      // In-game showcase per upgrade level (VFX, animations, finisher…)
      videos: SKIN_MEDIA[skinId] ?? [],
    };
  }),
});

// Stats are approximate close-range values and change between game patches.
const stats = (cost, magazine, fireRate, head, body, leg, penetration) => ({
  cost,
  magazine,
  fireRate,
  damage: { head, body, leg },
  penetration,
});

export const WEAPONS = [
  weapon({
    id: "classic",
    name: "Classic",
    category: "sidearm",
    stats: stats(0, 12, 6.75, 78, 26, 22, "low"),
    skins: [
      ["Prime", "premium"],
      ["Glitchpop", "exclusive"],
      ["RGX 11z Pro", "exclusive"],
      ["Blackthorn", "exclusive"],
    ],
  }),
  weapon({
    id: "shorty",
    name: "Shorty",
    category: "sidearm",
    stats: stats(300, 2, 3.33, 36, 12, 10, "low"),
    skins: [
      ["Prelude to Chaos", "exclusive"],
      ["Oni", "premium"],
      ["Sentinels of Light", "exclusive"],
      ["Araxys", "exclusive"],
    ],
  }),
  weapon({
    id: "frenzy",
    name: "Frenzy",
    category: "sidearm",
    stats: stats(450, 13, 10, 78, 26, 22, "low"),
    skins: [
      ["Elderflame", "ultra"],
      ["Glitchpop", "exclusive"],
      ["Prime//2.0", "premium"],
      ["BlastX", "exclusive"],
    ],
  }),
  weapon({
    id: "ghost",
    name: "Ghost",
    category: "sidearm",
    stats: stats(500, 15, 6.75, 105, 30, 25, "medium"),
    skins: [
      ["Reaver", "premium"],
      ["Singularity", "exclusive"],
      ["Kuronami", "exclusive"],
      ["Ayakashi", "exclusive"],
    ],
  }),
  weapon({
    id: "sheriff",
    name: "Sheriff",
    category: "sidearm",
    stats: stats(800, 6, 4, 159, 55, 46, "high"),
    skins: [
      ["Reaver", "premium"],
      ["Ion", "premium"],
      ["Protocol 781-A", "ultra"],
      ["Arcane", "exclusive"],
    ],
  }),
  weapon({
    id: "stinger",
    name: "Stinger",
    category: "smg",
    stats: stats(1100, 20, 16, 67, 27, 22, "low"),
    skins: [
      ["Prelude to Chaos", "exclusive"],
      ["Sovereign", "premium"],
      ["Overdrive", "exclusive"],
      ["CYRAX", "exclusive"],
    ],
  }),
  weapon({
    id: "spectre",
    name: "Spectre",
    category: "smg",
    stats: stats(1600, 30, 13.33, 78, 26, 22, "medium"),
    skins: [
      ["Prime", "premium"],
      ["Singularity", "exclusive"],
      ["Protocol 781-A", "ultra"],
      ["Blackspyre", "exclusive"],
    ],
  }),
  weapon({
    id: "bucky",
    name: "Bucky",
    category: "shotgun",
    stats: stats(850, 5, 1.1, 44, 22, 19, "low"),
    skins: [
      ["Oni", "premium"],
      ["Ion", "premium"],
      ["Overdrive", "exclusive"],
      ["Rogue", "exclusive"],
    ],
  }),
  weapon({
    id: "judge",
    name: "Judge",
    category: "shotgun",
    stats: stats(1850, 7, 3.5, 34, 17, 14, "medium"),
    skins: [
      ["Elderflame", "ultra"],
      ["Glitchpop", "exclusive"],
      ["Sovereign", "premium"],
      ["Mystbloom", "exclusive"],
    ],
  }),
  weapon({
    id: "bulldog",
    name: "Bulldog",
    category: "rifle",
    stats: stats(2050, 24, 10, 116, 35, 29, "medium"),
    skins: [
      ["Glitchpop", "exclusive"],
      ["Prelude to Chaos", "exclusive"],
      ["Radiant Entertainment System", "ultra"],
      ["Protocol 781-A", "ultra"],
    ],
  }),
  weapon({
    id: "guardian",
    name: "Guardian",
    category: "rifle",
    stats: stats(2250, 12, 5.25, 195, 65, 49, "high"),
    skins: [
      ["Prime", "premium"],
      ["Reaver", "premium"],
      ["Sovereign", "premium"],
      ["CYRAX", "exclusive"],
    ],
  }),
  weapon({
    id: "phantom",
    name: "Phantom",
    category: "rifle",
    stats: stats(2900, 30, 11, 156, 39, 33, "medium"),
    skins: [
      ["Oni", "premium"],
      ["Reaver", "premium"],
      ["Glitchpop", "exclusive"],
      ["Champions 2026", "exclusive"],
    ],
  }),
  weapon({
    id: "vandal",
    name: "Vandal",
    category: "rifle",
    stats: stats(2900, 25, 9.75, 160, 40, 34, "medium"),
    skins: [
      ["Prime", "premium"],
      ["Reaver", "premium"],
      ["Elderflame", "ultra"],
      ["Champions 2025", "exclusive"],
    ],
  }),
  weapon({
    id: "marshal",
    name: "Marshal",
    category: "sniper",
    stats: stats(950, 5, 1.5, 202, 101, 85, "medium"),
    skins: [
      ["Kuronami", "exclusive"],
      ["Sovereign", "premium"],
      ["Magepunk", "premium"],
      ["Blackthorn", "exclusive"],
    ],
  }),
  weapon({
    id: "outlaw",
    name: "Outlaw",
    category: "sniper",
    stats: stats(2400, 2, 2.75, 238, 140, 119, "high"),
    skins: [
      ["RGX 11z Pro", "exclusive"],
      ["Araxys", "exclusive"],
      ["Phaseguard", "ultra"],
      ["Mystbloom", "exclusive"],
    ],
  }),
  weapon({
    id: "operator",
    name: "Operator",
    category: "sniper",
    stats: stats(4700, 5, 0.6, 255, 150, 127, "high"),
    skins: [
      ["Elderflame", "ultra"],
      ["Ion", "premium"],
      ["Reaver", "premium"],
      ["SplashX", "exclusive"],
    ],
  }),
  weapon({
    id: "ares",
    name: "Ares",
    category: "machine-gun",
    stats: stats(1600, 50, 10, 72, 30, 25, "high"),
    skins: [
      ["Singularity", "exclusive"],
      ["Ion", "premium"],
      ["Magepunk", "premium"],
      ["Blackspyre", "exclusive"],
    ],
  }),
  weapon({
    id: "odin",
    name: "Odin",
    category: "machine-gun",
    stats: stats(3200, 100, 12, 95, 38, 32, "high"),
    skins: [
      ["Prime//2.0", "premium"],
      ["Reaver", "premium"],
      ["Glitchpop", "exclusive"],
      ["Evori Dreamwings", "ultra"],
    ],
  }),
  weapon({
    id: "knife",
    name: "Melee",
    category: "melee",
    stats: null,
    skins: [
      ["Reaver Karambit", "exclusive"],
      ["Prime//2.0 Karambit", "exclusive"],
      ["Kuronami no Yaiba", "exclusive"],
      ["Champions 2025 Butterfly Knife", "exclusive"],
    ],
  }),
];
