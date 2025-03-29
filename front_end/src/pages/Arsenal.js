import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Arsenal.css";

const weaponSkins = [
  ["Classic", "Bulldog", "Marshal"],
  ["Shorty", "Guardian", "Outlaw"],
  ["Frenzy", "Phantom", "Operator"],
  ["Ghost", "Vandal", "Ares"],
  ["Sheriff", "Knife", "Odin"],
];

const skinImages = {
  Classic: ["Classic.png", "Classic_glitchpop.png", "Classic_prime.png", "Classic_reverie.png"],
  Shorty: ["Shorty.png", "shorty_Arraxys.png", "shorty_Sentinals_of_light.png", "shorty_Primodium.png"],
  Frenzy: ["Frenzy.png", "Frenzy_Prime.png", "Frenzy_ElderFlame.png", "Frenzy_GlitchPop.png"],
  Ghost: ["Ghost.png", "Ghost_Reaver.png", "Ghost_Gia's_Vengence.png", "Ghost_Ruination.png"],
  Sheriff: ["Sheriff.png", "sheriff_Reaver.png", "sheriff_Ion.png", "sherif_Sentinals_of_Light.png"],
  Bulldog: ["Bulldog.png", "Bulldog_arraxys.png", "Bulldog_ktac.png"],
  Guardian: ["Guardian.png", "Guardian_prime.png", "Guardian_soulstrife.png", "Guardian_spitfire.png"],
  Phantom: ["Phantom.png", "Phantom_reaver.png", "Phantom_sarmad.png", "Phantom_tigris.png"],
  Vandal: ["Vandal.png", "Vandal_champions.png", "Vandal_sentinels_of_light.png", "Vandal_crimson_beast.png"],
  Marshal: ["Marshal.png", "Marshal_artisan.png", "Marshal_doodle_buds.png", "Marshal_ruin.png"],
  Outlaw: ["Outlaw.png", "outlaw_RGX.png", "outlaw_Arraxys.png", "outlaw_EX.O.png"],
  Operator: ["Operator.png", "Operator_elderflame.png", "Operator_ion.png", "Operator_arraxys.png"],
  Ares: ["Ares.png", "Ares_hivemind.png", "Ares_nebula.png", "Ares_singularity.png"],
  Odin: ["Odin.png", "Odin_prime.png", "Odin_reaver.png", "Odin_sentinels_of_light.png"],
  Knife: ["Knife.png", "Knife_blade_of_chaos.png", "Knife_soulstrife_scythe.png", "Knife_sys_melee.png"],
};

const Arsenal = () => {
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [selectedSkins, setSelectedSkins] = useState([]);
  const skinsSectionRef = useRef(null); // Reference to skins section

  // Function to handle weapon click
  const handleWeaponClick = (weapon) => {
    setSelectedWeapon(weapon);
    const skins = skinImages[weapon]?.slice(1) || [];
    setSelectedSkins(skins);

    // Scroll smoothly to the skins section
    skinsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container text-center my-5">
      <h2 className="text-warning">Arsenal</h2>
      <p>Select a weapon to view its skins</p>

      {/* Weapon Grid */}
      <div className="d-flex flex-column align-items-center">
        {weaponSkins.map((row, rowIndex) => (
          <div key={rowIndex} className="d-flex justify-content-between w-100">
            {row.map((weapon, index) =>
              weapon ? (
                <motion.div
                  key={weapon}
                  className="card bg-dark text-white p-4 mx-3 my-3 weapon-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleWeaponClick(weapon)}
                >
                  <motion.img
                    src={skinImages[weapon][0] || "default_weapon.png"}
                    alt={weapon}
                    className="img-fluid rounded weapon-img"
                    whileHover={{ scale: 1.4 }}
                    transition={{ duration: 0.2 }}
                  />
                  <h6 className="mt-3">{weapon.toUpperCase()}</h6>
                </motion.div>
              ) : (
                <div key={index} style={{ width: "220px", height: "260px" }}></div>
              )
            )}
          </div>
        ))}
      </div>

      {/* Skins Display Container */}
      {selectedWeapon && (
        <div className="container mt-5" ref={skinsSectionRef}>
          <h3 className="text-light">Skins for {selectedWeapon}:</h3>
          <div className="d-flex flex-wrap justify-content-center">
            {selectedSkins.length > 0 ? (
              selectedSkins.map((skin) => (
                <motion.div
                  key={skin}
                  className="card bg-dark text-white p-4 m-3 skin-card"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.img
                    src={skin}
                    alt={skin}
                    className="img-fluid rounded skin-img"
                    whileHover={{ scale: 1.5 }}
                    transition={{ duration: 0.2 }}
                  />
                  <h6 className="mt-3">
                    {skin
                      .split("_")[1]
                      ?.replace(".png", "")
                      .replace(/_/g, " ")
                      .toUpperCase()}
                  </h6>
                </motion.div>
              ))
            ) : (
              <p className="text-light">No additional skins available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Arsenal;
