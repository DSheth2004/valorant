import React, { useState } from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const agentsData = [
  {name: "Neon",
    image: "neon.png",
    abilities: [

      { name: "High Gear", icon: "neon_c.png", description: "INSTANTLY channel Neon's power for Increased Speed. When charged, ALT FIRE to trigger an electric slide. Slide charge resets every two kills." },
      { name: "Fast Lane", icon: "neon_q.png", description: "FIRE two energy lines forward on the ground that extend a short distance or until they hit a surface. The lines rise into walls of static electricity that block vision." },
      { name: "Relay Bolt", icon: "neon_e.png", description: "INSTANTLY throw an energy bolt that bounces once. Upon hitting each surface, the bolt electrifies the ground below with a Concussive blast." },
      { name: "Overdrive", icon: "neon_x.png", description: "Unleash Neon's full power and speed for a short duration. FIRE to channel the power into a deadly lightning beam with high movement accuracy." },
    ],
  },
  {
    name: "Reyna",
    image: "reyna.png",
    abilities: [

      { name: "Leer", icon: "reyna_c.png", description: "Reyna can deploy an ethereal eye that moves through walls and obstructs the vision of any players it passes through." },
      { name: "Devour", icon: "reyna_q.png", description: "Reyna consumes the life force of recently defeated enemies, healing herself." },
      { name: "Dismiss", icon: "reyna_e.png", description: "Reyna can use Dismiss to briefly become invulnerable and teleport to a new location." },
      { name: "Empress", icon: "reyna_x.png", description: "When Reyna activates her ultimate ability, Empress, she gains a burst of combat stim, increasing her fire rate and movement speed." },
    ],
  },
  {
    name: "Raze",
    image: "raze.png",
    abilities: [
      { name: "Boom Bot", icon: "raze_c.png", description: "Deploys a bot that explodes upon reaching an enemy." },
      { name: "Blast Pack", icon: "raze_q.png", description: "Throws a satchel that can be detonated mid-air." },
      { name: "Paint Shells", icon: "raze_e.png", description: "Throws a grenade that explodes into smaller fragments." },
      { name: "Showstopper", icon: "raze_x.png", description: "Equips a rocket launcher dealing high explosive damage." },
    ],
  },
  {
    name: "Omen",
    image: "omen.png",
    abilities: [
      { name: "Shrouded Step", icon: "omen_c.png", description: "Teleports a short distance." },
      { name: "Paranoia", icon: "omen_q.png", description: "Sends out a blinding orb through walls." },
      { name: "Dark Cover", icon: "omen_e.png", description: "Creates a long-lasting smoke to block vision." },
      { name: "From The Shadows", icon: "omen_x.png", description: "Teleports across the map." },
    ],
  },
  {
    name: "Yoru",
    image: "yoru.png",
    abilities: [
      { name: "Fakeout", icon: "yoru_c.png", description: "Yoru can deploy an echo that mimics footsteps when activated. This can be used to create auditory distractions and mislead enemies." },
      { name: "Blindside", icon: "yoru_q.png", description: "Yoru throws an unstable dimensional fragment that bursts into a flashbang after a delay, blinding and disorienting enemies." },
      { name: "Gatecrash", icon: "yoru_e.png", description: "Yoru can place a rift tether at a location and teleport to it later, allowing quick repositioning or ambush tactics." },
      { name: "Dimensional Drift", icon: "yoru_x.png", description: "Yoru becomes invisible and invulnerable for a short duration, allowing him to scout enemy positions freely." },
    ],
  },
  {
    name: "Viper",
    image: "viper.png",
    abilities: [
      { name: "Snake Bite", icon: "viper_c.png", description: "Viper throws a canister that releases a pool of toxic chemicals, damaging and slowing enemies inside." },
      { name: "Poison Cloud", icon: "viper_q.png", description: "Viper deploys a gas emitter that emits a poisonous gas cloud, obscuring vision and damaging enemies." },
      { name: "Toxic Screen", icon: "viper_e.png", description: "Viper deploys a long wall of gas emitters that can be raised to block vision across the battlefield." },
      { name: "Viper's Pit", icon: "viper_x.png", description: "Viper creates a massive toxic zone that obscures vision and gives her an advantage in combat." },
    ],
  },
  {
    name: "Fade",
    image: "fade.png",
    abilities: [
      { name: "Prowler", icon: "fade_c.png", description: "Send out a creature to track and near-sight enemies it touches." },
      { name: "Seize", icon: "fade_q.png", description: "Throw an orb that traps enemies inside a nightmare zone." },
      { name: "Haunt", icon: "fade_e.png", description: "Launch an eye that reveals enemy locations and applies debuffs." },
      { name: "Nightfall", icon: "fade_x.png", description: "Unleash a field of nightmares that weakens and reveals enemies." },
    ],
  },
  {
    name: "Chamber",
    image: "chamber.png",
    abilities: [
      { name: "Trademark", icon: "chamber_c.png", description: "Place a trap that slows enemies upon activation." },
      { name: "Headhunter", icon: "chamber_q.png", description: "Equip a heavy pistol with ADS capability." },
      { name: "Rendezvous", icon: "chamber_e.png", description: "Set teleport anchors and reposition instantly." },
      { name: "Tour de Force", icon: "chamber_x.png", description: "Summon a powerful sniper that kills instantly on a direct hit." },
    ],
  },
  {
    name: "Breach",
    image: "breach.png",
    abilities: [
      { name: "Aftershock", icon: "breach_c.png", description: "Fire a charge that explodes through walls, dealing heavy damage." },
      { name: "Flashpoint", icon: "breach_q.png", description: "Throw a blinding charge that bounces off walls, flashing enemies in its path." },
      { name: "Fault Line", icon: "breach_e.png", description: "Send a seismic blast through terrain, concussing and knocking up enemies." },
      { name: "Rolling Thunder", icon: "breach_x.png", description: "Unleash a massive quake that dazes all enemies in a large area." },
    ],
  },
  {
    name: "Gekko",
    image: "gekko.png",
    abilities: [
      { name: "Mosh Pit", icon: "gekko_c.png", description: "Throw a globule that creates an acid pool, damaging and slowing enemies." },
      { name: "Wingman", icon: "gekko_q.png", description: "Send a bird-like creature forward to scout enemies and plant the spike." },
      { name: "Dizzy", icon: "gekko_e.png", description: "Throw a bouncing creature that blinds enemies upon impact." },
      { name: "Thrash", icon: "gekko_x.png", description: "Send a large creature charging forward, knocking back enemies." },
    ],
  },

];

const Agents = () => {
  const [selectedAgent, setSelectedAgent] = useState(agentsData[0]);
  const [abilityDescription, setAbilityDescription] = useState(selectedAgent.abilities[0].description);

  return (
    <div className="container my-5">
      <h2 className="text-warning text-center">Choose Your Agent</h2>
      <p className="text-center">Hover over an agent to view their details.</p>

 {/* Small Agent Icons Grid (All in One Line) */}
<div
  className="d-flex justify-content-between align-items-center flex-wrap p-3"
  style={{ width: "100%", flexWrap: "nowrap" }}
>
  {agentsData.map((agent, index) => (
    <motion.div
      key={index}
      className="text-center"
      style={{ flex: "1 1 auto", minWidth: "80px" }} // Ensure spacing across the line
      whileHover={{ scale: 1.2 }}
      transition={{ type: "spring", stiffness: 300 }}
      onMouseEnter={() => {
        setSelectedAgent(agent);
        setAbilityDescription(agent.abilities[0].description);
      }}
    >
      <img
        src={agent.image}
        alt={agent.name}
        className="img-fluid rounded-circle border border-light shadow"
        style={{ width: "80px", height: "80px", cursor: "pointer", objectFit: "cover" }}
      />
      <p className="text-white small mt-2">{agent.name}</p>
    </motion.div>
  ))}
</div>








      {/* Display Selected Agent Details */}
      <motion.div
        key={selectedAgent.name}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="row align-items-center mt-4 bg-dark p-4 rounded"
      >
        {/* Left Side: Agent Image */}
        <div className="col-md-6 text-center">
          <motion.img
            src={selectedAgent.image}
            alt={selectedAgent.name}
            className="img-fluid rounded shadow-lg"
            style={{ width: "100%", maxWidth: "400px", height: "500px", objectFit: "cover" }}
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Right Side: Agent Info */}
        <div className="col-md-6 text-center">
          <motion.h3 className="text-warning">{selectedAgent.name}</motion.h3>

          {/* Animated Ability Description */}
          <motion.p
            key={abilityDescription}
            className="text-white mt-3"
            style={{ fontSize: "18px", minHeight: "80px" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {abilityDescription}
          </motion.p>

          {/* Ability Icons with Hover Effect */}
          <div className="d-flex justify-content-center gap-4 mt-4">
            {selectedAgent.abilities.map((ability, i) => (
              <motion.div
                key={i}
                className="text-center"
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.3 }}
                onMouseEnter={() => setAbilityDescription(ability.description)}
              >
                <img
                  src={ability.icon}
                  alt={ability.name}
                  className="shadow-lg"
                  style={{ width: "80px", height: "80px", cursor: "pointer" }}
                />
                <p className="text-white mt-2">{ability.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Agents;

// explain the tailwind part