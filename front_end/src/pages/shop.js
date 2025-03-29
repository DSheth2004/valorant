import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const gunCategories = {
  Vandal: [
    { name: "Vandal Sentinels of Light", image: "vandal_sentinels_of_light.png", price: 2175 },
    { name: "Vandal Champions", image: "vandal_champions.png", price: 2675 },
    { name: "Vandal Crimson Beast", image: "vandal_crimson_beast.png", price: 2175 },
  ],
  Phantom: [
    { name: "Phantom Reaver", image: "phantom_reaver.png", price: 2175 },
    { name: "Phantom Sarmad", image: "phantom_sarmad.png", price: 1775 },
    { name: "Phantom Tigris", image: "phantom_tigris.png", price: 1275 },
  ],
  Operator: [
    { name: "Operator Ion", image: "operator_ion.png", price: 2475 },
    { name: "Operator Arraxys", image: "operator_arraxys.png", price: 2975 },
    { name: "Operator Elderflame", image: "operator_elderflame.png", price: 2475 },
  ],
};

// Game Cards
const gameCards = [
  { name: "At The Seams", image: "card_at_the_seams.png", price: 500 },
  { name: "Champions 2024", image: "card_champions_2024.png", price: 750 },
  { name: "Boba Break", image: "card_boba_break.png", price: 600 },
  { name: "Cyrax", image: "card_cyrax.png", price: 700 },
  { name: "Ignition", image: "card_ignition.png", price: 650 },
  { name: "VCT 25 x T1", image: "card_VCT25xT1.png", price: 800 },
];

// Function to get random items
const getRandomItems = (items, count) => {
  return [...items].sort(() => Math.random() - 0.5).slice(0, count);
};

const Shop = () => {
  const [randomSkins, setRandomSkins] = useState([]);
  const [randomCards, setRandomCards] = useState([]);
  const [userVP, setUserVP] = useState(5000); // Initial VP balance

  useEffect(() => {
    // Pick 4 random weapons and 4 random cards
    const allGuns = Object.values(gunCategories).flat();
    setRandomSkins(getRandomItems(allGuns, 4));
    setRandomCards(getRandomItems(gameCards, 4));
  }, []);

  const handlePurchase = (price) => {
    if (userVP >= price) {
      setUserVP(userVP - price); // Deduct VP
    } else {
      alert("Not enough VP!");
    }
  };

  return (
    <div className="container my-5 text-center">
      <h2 className="text-warning">Valorant Store</h2>
      <h4 className="text-light">
        Your VP:{" "}
        <span className="text-success">
          <img
            src="valo_vp.png"
            alt="VP Logo"
            style={{ width: "24px", height: "24px", marginRight: "5px" }}
          />
          {userVP}
        </span>
      </h4>

      {/* Weapons Section */}
      <h3 className="text-white mt-4">Weapon Skins</h3>
      <div className="d-flex flex-wrap justify-content-center gap-4 mt-3">
        {randomSkins.map((gun, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="position-relative"
            style={{
              width: "250px",
              height: "250px",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
            }}
          >
            <motion.img
              src={gun.image}
              alt={gun.name}
              className="img-fluid"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
            <motion.div
              className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "rgba(0, 0, 0, 0.8)",
                color: "white",
                textAlign: "center",
                borderRadius: "10px",
              }}
            >
              <h5 className="mb-1">{gun.name}</h5>
              <p className="fw-bold">
                <span className="text-success">
                  <img
                    src="valo_vp.png"
                    alt="VP Logo"
                    style={{ width: "24px", height: "24px", marginRight: "5px" }}
                  />
                </span>{" "}
                {gun.price}
              </p>
              <motion.button
                className="btn btn-success"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={userVP < gun.price}
                onClick={() => handlePurchase(gun.price)}
              >
                {userVP >= gun.price ? "Purchase" : "Not Enough VP"}
              </motion.button>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Game Cards Section */}
      <h3 className="text-white mt-5">Game Cards</h3>
      <div className="d-flex flex-wrap justify-content-center gap-4 mt-3">
        {randomCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="position-relative"
            style={{
              width: "250px",
              height: "250px",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
            }}
          >
            <motion.img
              src={card.image}
              alt={card.name}
              className="img-fluid"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
            <motion.div
              className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "rgba(0, 0, 0, 0.8)",
                color: "white",
                textAlign: "center",
                borderRadius: "10px",
              }}
            >
              <h5 className="mb-1">{card.name}</h5>
              <p className="fw-bold">
                <span className="text-success">
                  <img
                    src="valo_vp.png"
                    alt="VP Logo"
                    style={{ width: "24px", height: "24px", marginRight: "5px" }}
                  />
                </span>{" "}
                {card.price}
              </p>
              <motion.button
                className="btn btn-success"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={userVP < card.price}
                onClick={() => handlePurchase(card.price)}
              >
                {userVP >= card.price ? "Purchase" : "Not Enough VP"}
              </motion.button>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
