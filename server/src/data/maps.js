const map = ({ id, ...rest }) => ({ id, ...rest, image: `/assets/maps/${id}.webp` });

export const MAPS = [
  map({
    id: "ascent",
    name: "Ascent",
    location: "Venice, Italy",
    sites: ["A", "B"],
    feature: "Mechanical doors",
    description:
      "An open playground for small wars of position and attrition. A large courtyard dominates mid, and both sites can be sealed off with mechanical doors.",
    recommendedAgents: ["jett", "omen", "chamber", "fade"],
  }),
  map({
    id: "bind",
    name: "Bind",
    location: "Rabat, Morocco",
    sites: ["A", "B"],
    feature: "One-way teleporters",
    description:
      "Two sites, no middle. Teleporters let teams rotate in an instant, making it ideal for defenders like Chamber and Cypher and initiators like Breach.",
    recommendedAgents: ["raze", "viper", "breach", "chamber"],
  }),
  map({
    id: "breeze",
    name: "Breeze",
    location: "Bermuda Triangle",
    sites: ["A", "B"],
    feature: "Wide-open sightlines",
    description:
      "Take in the sights of historic ruins on a tropical island. Long lanes reward Operator players, while teleporting agents like Yoru and Omen can rotate quickly.",
    recommendedAgents: ["jett", "viper", "chamber", "yoru"],
  }),
  map({
    id: "fracture",
    name: "Fracture",
    location: "Santa Fe, USA",
    sites: ["A", "B"],
    feature: "Split attacker spawn",
    description:
      "A top-secret research facility split apart by a failed experiment. Attackers spawn on both sides, so flash-heavy agents like Breach help secure bomb sites.",
    recommendedAgents: ["neon", "raze", "breach", "fade"],
  }),
  map({
    id: "icebox",
    name: "Icebox",
    location: "Bennett Island, Russia",
    sites: ["A", "B"],
    feature: "Ziplines & verticality",
    description:
      "A secret base hidden in the Arctic. Ziplines and stacked containers create sharp vertical angles that duelists like Yoru, Reyna and Raze exploit.",
    recommendedAgents: ["jett", "reyna", "viper", "chamber"],
  }),
  map({
    id: "lotus",
    name: "Lotus",
    location: "Western Ghats, India",
    sites: ["A", "B", "C"],
    feature: "Rotating doors",
    description:
      "A mysterious temple with three bomb sites, rotating doors, and a destructible wall. Smoke agents like Omen and Viper thrive on its tight chokes.",
    recommendedAgents: ["raze", "omen", "fade", "neon"],
  }),
  map({
    id: "split",
    name: "Split",
    location: "Tokyo, Japan",
    sites: ["A", "B"],
    feature: "Ropes & elevation",
    description:
      "If you want to go far, you'll have to go up. Ropes connect two sites through a central elevated area, giving controllers strong map control.",
    recommendedAgents: ["raze", "omen", "viper", "reyna"],
  }),
];
