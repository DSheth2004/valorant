import { assetUrl } from "./assets.js";

export const ROLES = [
  {
    id: "duelist",
    name: "Duelist",
    description: "Self-sufficient fraggers who create space and take the first fight.",
  },
  {
    id: "controller",
    name: "Controller",
    description: "Experts at slicing up dangerous territory to set their team up for success.",
  },
  {
    id: "initiator",
    name: "Initiator",
    description: "Challengers who set up their team to enter contested ground and push defenders away.",
  },
  {
    id: "sentinel",
    name: "Sentinel",
    description: "Defensive experts who lock down areas and watch flanks on both attack and defense.",
  },
];

const ability = (agentId, key, name, description) => ({
  key: key.toUpperCase(),
  slot: key === "x" ? "ultimate" : key === "e" ? "signature" : "basic",
  name,
  description,
  icon: assetUrl(`abilities/${agentId}-${key}.webp`),
});

const agent = ({ id, abilities, ...rest }) => ({
  id,
  ...rest,
  portrait: assetUrl(`agents/${id}.webp`),
  icon: assetUrl(`agents/${id}-icon.webp`),
  background: assetUrl(`agents/${id}-bg.webp`),
  abilities: abilities.map(([key, name, description]) => ability(id, key, name, description)),
});

export const AGENTS = [
  agent({
    id: "jett",
    name: "Jett",
    role: "duelist",
    origin: "South Korea",
    accent: "#4fb4d8",
    bio: "An agile duelist whose evasive fighting style lets her take risks no one else can, slicing through skirmishes before the enemy can react.",
    abilities: [
      ["c", "Cloudburst", "Throw a projectile that expands into a brief cloud of smoke on impact. Hold to curve it toward your crosshair."],
      ["q", "Updraft", "Instantly propel yourself high into the air to reach unexpected angles."],
      ["e", "Tailwind", "Prepare a gust of wind, then dash in the direction you are moving to escape or engage."],
      ["x", "Blade Storm", "Equip a set of highly accurate throwing knives that recharge on every kill."],
    ],
  }),
  agent({
    id: "neon",
    name: "Neon",
    role: "duelist",
    origin: "Philippines",
    accent: "#3d6bff",
    bio: "A Filipina agent who channels bioelectric energy into blinding speed, surging past defenders before they can draw a bead on her.",
    abilities: [
      ["c", "Fast Lane", "Fire two energy lines forward that rise into walls of static electricity, blocking vision and damaging enemies who pass through."],
      ["q", "Relay Bolt", "Throw an energy bolt that bounces once, electrifying the ground below with a concussive blast at each impact."],
      ["e", "High Gear", "Channel your power for increased speed. When charged, slide to reposition; the slide recharges every two kills."],
      ["x", "Overdrive", "Unleash full power and speed, firing a deadly lightning beam with high movement accuracy."],
    ],
  }),
  agent({
    id: "reyna",
    name: "Reyna",
    role: "duelist",
    origin: "Mexico",
    accent: "#b04fd8",
    bio: "A vampiric duelist who snowballs off every kill, feeding on fallen enemies to heal, vanish, and keep the fight going.",
    abilities: [
      ["c", "Leer", "Cast an ethereal, destructible eye that nearsights every enemy who looks at it, even through walls."],
      ["q", "Devour", "Consume the soul orb of a recently killed enemy to rapidly heal beyond your maximum health."],
      ["e", "Dismiss", "Consume a soul orb to become intangible for a short duration, perfect for escaping a bad fight."],
      ["x", "Empress", "Enter a frenzy that increases fire rate, equip, and reload speed. Kills refresh the duration."],
    ],
  }),
  agent({
    id: "raze",
    name: "Raze",
    role: "duelist",
    origin: "Brazil",
    accent: "#f08a24",
    bio: "An explosives expert who clears tight corners and stacked defenders with a big personality and even bigger booms.",
    abilities: [
      ["c", "Boom Bot", "Deploy a bot that travels in a straight line, locks onto enemies in its path, and explodes on contact."],
      ["q", "Blast Pack", "Throw a satchel that sticks to surfaces. Re-use to detonate, damaging enemies and launching anything caught in it."],
      ["e", "Paint Shells", "Throw a cluster grenade that explodes and releases smaller sub-munitions for area damage."],
      ["x", "Showstopper", "Equip a rocket launcher that deals massive area damage on contact with anything."],
    ],
  }),
  agent({
    id: "yoru",
    name: "Yoru",
    role: "duelist",
    origin: "Japan",
    accent: "#3355dd",
    bio: "A dimensional rifter who tears holes in reality to infiltrate enemy lines unseen and strike from impossible angles.",
    abilities: [
      ["c", "Fakeout", "Send out an echo that mimics footsteps. When shot or activated, it flashes nearby enemies."],
      ["q", "Blindside", "Throw an unstable dimensional fragment that ricochets off a surface and bursts into a blinding flash."],
      ["e", "Gatecrash", "Send a rift tether forward that you can teleport to later, enabling ambushes and fast rotations."],
      ["x", "Dimensional Drift", "Phase into another dimension, becoming invisible and invulnerable to scout and reposition freely."],
    ],
  }),
  agent({
    id: "omen",
    name: "Omen",
    role: "controller",
    origin: "Unknown",
    accent: "#4a3d8f",
    bio: "A phantom of a memory who hunts in the shadows, blinding enemies and teleporting across the field to keep them guessing.",
    abilities: [
      ["c", "Shrouded Step", "Equip a shadow walk ability and teleport a short distance to a targeted location."],
      ["q", "Paranoia", "Send out a shadow projectile that nearsights every enemy it passes through, even through walls."],
      ["e", "Dark Cover", "Cast long-lasting orbs of shadow that block vision anywhere within range."],
      ["x", "From the Shadows", "Select anywhere on the map to teleport and reform there, appearing as a shade while you travel."],
    ],
  }),
  agent({
    id: "viper",
    name: "Viper",
    role: "controller",
    origin: "United States",
    accent: "#2fb36e",
    bio: "A chemist who deploys poisonous gas to control the battlefield, choking out enemies and cutting off sightlines.",
    abilities: [
      ["c", "Snake Bite", "Fire a canister that shatters into a lingering pool of acid that damages and weakens enemies."],
      ["q", "Poison Cloud", "Throw a gas emitter that releases a toxic cloud you can toggle on and off, consuming fuel."],
      ["e", "Toxic Screen", "Deploy a long line of gas emitters that rise into a tall wall of toxic gas, blocking vision."],
      ["x", "Viper's Pit", "Emit a massive toxic cloud around yourself that degrades enemies and hides you inside it."],
    ],
  }),
  agent({
    id: "fade",
    name: "Fade",
    role: "initiator",
    origin: "Turkey",
    accent: "#5e6a8f",
    bio: "A bounty hunter who uses the power of raw nightmares to seize enemy secrets and hunt them down by their deepest fears.",
    abilities: [
      ["c", "Prowler", "Send out a creature that tracks the trail of revealed enemies and nearsights them on contact."],
      ["q", "Seize", "Throw an orb that drops and creates a tether zone, holding enemies in place and deafening them."],
      ["e", "Haunt", "Throw an eye that drops and reveals enemies in its line of sight, marking their location with a trail."],
      ["x", "Nightfall", "Unleash a wave of nightmare energy that marks, deafens, and decays every enemy it catches."],
    ],
  }),
  agent({
    id: "breach",
    name: "Breach",
    role: "initiator",
    origin: "Sweden",
    accent: "#d86b2f",
    bio: "A bionic Swede who fires powerful, targeted kinetic blasts through walls to clear a path and force fights.",
    abilities: [
      ["c", "Aftershock", "Fire a fusion charge through a wall that deals heavy damage to anyone caught in the area."],
      ["q", "Flashpoint", "Fire a blinding charge through a wall that blinds everyone looking at it on the other side."],
      ["e", "Fault Line", "Unleash a seismic blast through terrain that dazes every enemy caught in its path."],
      ["x", "Rolling Thunder", "Send a cascading quake through all terrain in a large cone, dazing and knocking up enemies."],
    ],
  }),
  agent({
    id: "gekko",
    name: "Gekko",
    role: "initiator",
    origin: "United States",
    accent: "#c2e04a",
    bio: "A leader of a tight-knit crew of calamitous creatures who help him push enemies out of the way and reclaim them to go again.",
    abilities: [
      ["c", "Mosh Pit", "Throw Mosh like a grenade. It duplicates across a large area and explodes after a short delay."],
      ["q", "Wingman", "Send Wingman forward to seek enemies, concussing the first one he finds. He can also plant or defuse the Spike."],
      ["e", "Dizzy", "Send Dizzy soaring forward; she charges and launches blinding plasma at every enemy in sight."],
      ["x", "Thrash", "Steer Thrash into enemy territory, then lunge to explode and detain everyone in a small radius."],
    ],
  }),
  agent({
    id: "chamber",
    name: "Chamber",
    role: "sentinel",
    origin: "France",
    accent: "#c9a14a",
    bio: "A well-dressed weapons designer who holds the line with custom firearms and precise, long-range lethality.",
    abilities: [
      ["c", "Trademark", "Place a trap that scans for enemies and releases a slowing field when one is detected."],
      ["q", "Headhunter", "Equip a heavy pistol with an aim-down-sights mode for precise headshots."],
      ["e", "Rendezvous", "Place a teleport anchor; while near it, re-use to instantly teleport back to safety."],
      ["x", "Tour de Force", "Summon a powerful custom sniper rifle that kills with any direct hit and slows nearby enemies."],
    ],
  }),
];
