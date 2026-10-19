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
  image: `/assets/weapons/${id}.webp`,
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
      image: `/assets/skins/${skinId}.webp`,
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
      ["Glitchpop", "exclusive"],
      ["Prime", "premium"],
      ["Reverie", "premium"],
      ["Spectrum", "exclusive"],
      ["Forsaken", "premium"],
      ["Nocturnum", "premium"],
      ["RGX 11z Pro", "exclusive", "rgx"],
    ],
  }),
  weapon({
    id: "shorty",
    name: "Shorty",
    category: "sidearm",
    stats: stats(300, 2, 3.33, 36, 12, 10, "low"),
    skins: [
      ["Araxys", "ultra"],
      ["Sentinels of Light", "exclusive"],
      ["Primordium", "premium"],
      ["Oni", "premium"],
      ["Prelude to Chaos", "ultra"],
    ],
  }),
  weapon({
    id: "frenzy",
    name: "Frenzy",
    category: "sidearm",
    stats: stats(450, 13, 10, 78, 26, 22, "low"),
    skins: [
      ["Prime//2.0", "premium", "prime"],
      ["Elderflame", "ultra"],
      ["Glitchpop", "exclusive"],
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
      ["Gaia's Vengeance", "premium", "gaias-vengeance"],
      ["Ruination", "premium"],
      ["Singularity", "premium"],
      ["Radiant Entertainment System", "exclusive", "radiant-entertainment"],
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
      ["Sentinels of Light", "exclusive"],
      ["Araxys", "ultra"],
      ["Neo Frontier", "premium"],
      ["Kuronami", "exclusive"],
    ],
  }),
  weapon({ id: "stinger", name: "Stinger", category: "smg", stats: stats(1100, 20, 16, 67, 27, 22, "low") }),
  weapon({ id: "spectre", name: "Spectre", category: "smg", stats: stats(1600, 30, 13.33, 78, 26, 22, "medium") }),
  weapon({ id: "bucky", name: "Bucky", category: "shotgun", stats: stats(850, 5, 1.1, 44, 22, 19, "low") }),
  weapon({ id: "judge", name: "Judge", category: "shotgun", stats: stats(1850, 7, 3.5, 34, 17, 14, "medium") }),
  weapon({
    id: "bulldog",
    name: "Bulldog",
    category: "rifle",
    stats: stats(2050, 24, 10, 116, 35, 29, "medium"),
    skins: [
      ["Araxys", "ultra"],
      ["K/TAC", "premium", "ktac"],
    ],
  }),
  weapon({
    id: "guardian",
    name: "Guardian",
    category: "rifle",
    stats: stats(2250, 12, 5.25, 195, 65, 49, "high"),
    skins: [
      ["Prime", "premium"],
      ["Soulstrife", "exclusive"],
      ["Spitfire", "deluxe"],
    ],
  }),
  weapon({
    id: "phantom",
    name: "Phantom",
    category: "rifle",
    stats: stats(2900, 30, 11, 156, 39, 33, "medium"),
    skins: [
      ["Reaver", "premium"],
      ["Sarmad", "premium"],
      ["Tigris", "premium"],
    ],
  }),
  weapon({
    id: "vandal",
    name: "Vandal",
    category: "rifle",
    stats: stats(2900, 25, 9.75, 160, 40, 34, "medium"),
    skins: [
      ["Champions 2021", "ultra", "champions"],
      ["Sentinels of Light", "exclusive"],
      ["Crimsonbeast", "premium", "crimson-beast"],
    ],
  }),
  weapon({
    id: "marshal",
    name: "Marshal",
    category: "sniper",
    stats: stats(950, 5, 1.5, 202, 101, 85, "medium"),
    skins: [
      ["Artisan", "premium"],
      ["Doodle Buds", "deluxe"],
      ["Ruin", "premium", "ruination"],
    ],
  }),
  weapon({
    id: "outlaw",
    name: "Outlaw",
    category: "sniper",
    stats: stats(2400, 2, 2.75, 238, 140, 119, "high"),
    skins: [
      ["RGX 11z Pro", "exclusive", "rgx"],
      ["Araxys", "ultra"],
      ["EX.O", "premium", "exo"],
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
      ["Araxys", "ultra"],
    ],
  }),
  weapon({
    id: "ares",
    name: "Ares",
    category: "machine-gun",
    stats: stats(1600, 50, 10, 72, 30, 25, "high"),
    skins: [
      ["Hivemind", "exclusive"],
      ["Nebula", "deluxe"],
      ["Singularity", "premium"],
    ],
  }),
  weapon({
    id: "odin",
    name: "Odin",
    category: "machine-gun",
    stats: stats(3200, 100, 12, 95, 38, 32, "high"),
    skins: [
      ["Prime//2.0", "premium", "prime"],
      ["Reaver", "premium"],
      ["Sentinels of Light", "exclusive"],
    ],
  }),
  weapon({
    id: "knife",
    name: "Melee",
    category: "melee",
    stats: null,
    skins: [
      ["Blade of Chaos", "ultra"],
      ["Soulstrife Scythe", "exclusive"],
    ],
  }),
];
