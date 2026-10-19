const card = (id, name, price) => ({ id: `card-${id}`, name, price, image: `/assets/cards/${id}.webp` });

export const PLAYER_CARDS = [
  card("at-the-seams", "At The Seams", 500),
  card("champions-2024", "Champions 2024", 750),
  card("boba-break", "Boba Break", 600),
  card("cyrax", "Cyrax", 700),
  card("ignition", "Ignition", 650),
  card("vct25-t1", "VCT 25 × T1", 800),
  card("arcane-sisters", "Arcane Sisters", 750),
  card("kuronami", "Kuronami", 700),
  card("reaver", "Reaver", 650),
  card("glitchpop", "Glitchpop", 650),
  card("elderflame", "Elderflame", 750),
  card("rgx-11z-pro", "RGX 11z Pro", 700),
  card("spectrum", "Spectrum", 700),
];
