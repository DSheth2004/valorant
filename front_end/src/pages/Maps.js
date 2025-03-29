import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const mapsData = [
  {
    name: "Lotus",
    image: "lotus.avif",
    description:
      "Lotus has 3 bomb sites: A, B, and C. Smoke agents like Omen, Brimstone, and Viper have an advantage. Duelists like Raze, Reyna, Jett, and Neon are also useful.",
  },
  {
    name: "Breeze",
    image: "breeze.avif",
    description:
      "Breeze has 2 bomb sites: A and B. Teleporting agents like Yoru and Omen are useful. Defending agents like Killjoy and Viper are strong choices.",
  },
  {
    name: "Icebox",
    image: "icebox.avif",
    description:
      "Icebox has 2 bomb sites: A and B. Duelists like Yoru, Reyna, Neon, and Raze are great picks. Operator players like Chamber and Jett are also effective.",
  },
  {
    name: "Split",
    image: "split.avif",
    description:
      "Split has 2 bomb sites: A and B. Smoke agents like Omen, Brimstone, and Viper provide strong map control. Defenders like Killjoy and Cypher are useful.",
  },
  {
    name: "Bind",
    image: "bind.avif",
    description:
      "Bind has 2 bomb sites: A and B. Defenders like Chamber, Cypher, and Killjoy excel here. Initiators like Skye and Breach can be game-changers.",
  },
  {
    name: "Fracture",
    image: "fracture.avif",
    description:
      "Fracture has 2 bomb sites: A and B. Duelists like Phoenix, Neon, and Jett are useful. Blinding agents like Skye and Breach help secure bomb sites.",
  },
];

// Separate MapItem component (Fixes the Hook issue)
const MapItem = ({ map, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { triggerOnce: false, margin: "-50px" });

  return (
    <motion.div
      className="row align-items-center my-4"
      initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      ref={ref}
    >
      {/* Map Image */}
      <motion.div
        className={`col-md-6 ${index % 2 === 0 ? "order-md-1" : "order-md-2"}`}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={map.image}
          alt={map.name}
          className="img-fluid rounded shadow"
          style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
        />
      </motion.div>

      {/* Map Details */}
      <motion.div className={`col-md-6 ${index % 2 === 0 ? "order-md-2" : "order-md-1"}`} ref={ref}>
        <motion.h3
          className="text-center text-primary"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {map.name}
        </motion.h3>

        <motion.p
          className="text-center"
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {map.description}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

const Maps = () => {
  return (
    <div className="container my-5">
      <h2 className="text-warning text-center">Valorant Maps</h2>
      <p className="text-center">Explore different maps and find the best agent strategies.</p>

      {mapsData.map((map, index) => (
        <MapItem key={index} map={map} index={index} />
      ))}
    </div>
  );
};

export default Maps;
