import { AGENTS, ROLES } from "../data/agents.js";
import { MAPS } from "../data/maps.js";
import { WEAPONS, WEAPON_CATEGORIES, SKIN_TIERS } from "../data/weapons.js";
import { HttpError } from "../utils/HttpError.js";

const findOr404 = (collection, id, label) => {
  const item = collection.find((entry) => entry.id === id);
  if (!item) throw new HttpError(404, `${label} "${id}" not found`, { code: "NOT_FOUND" });
  return item;
};

export const listAgents = (_req, res) => res.json({ roles: ROLES, agents: AGENTS });
export const getAgent = (req, res) => res.json({ agent: findOr404(AGENTS, req.params.id, "Agent") });

export const listMaps = (_req, res) => res.json({ maps: MAPS });
export const getMap = (req, res) => res.json({ map: findOr404(MAPS, req.params.id, "Map") });

export const listWeapons = (_req, res) =>
  res.json({ categories: WEAPON_CATEGORIES, tiers: SKIN_TIERS, weapons: WEAPONS });
export const getWeapon = (req, res) => res.json({ weapon: findOr404(WEAPONS, req.params.id, "Weapon") });
