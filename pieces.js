// ─────────────────────────────────────────────────────────────────────────
// Dizzy Toad Woodworks — piece catalog
// Built from Victor's real pieces and photos. Edit in the on-site Admin panel
// (🐸 Admin → Edit) or here. Prices are placeholders until set in the app.
//
// Each piece: id, name, category, species, dimensions, price (0 → "Ask"),
//   status ("available"|"sold"|"reserved"), photos (array, first = cover),
//   description (Victor's voice), care.
// ─────────────────────────────────────────────────────────────────────────
window.PIECES = [

  // ── Show-stoppers ──────────────────────────────────────────────────────
  {
    id: 1,
    name: "Live-Edge Burl Bowl with Turquoise Inlay",
    category: "bowl",
    species: "Maple Burl",
    dimensions: "13\" × 5\"",
    price: 225,
    status: "available",
    photos: ["photos/burl-turquoise.jpg"],
    description: "The showpiece of the bench. Turned from a wild burl with the natural bark edge left intact, and the bark voids filled with a band of turquoise inlay that catches the light. There is exactly one of these — there can only ever be one.",
    care: "Decorative or light dry use. Dust with a soft cloth; keep out of direct sun. A little paste wax keeps the figure and inlay glowing."
  },
  {
    id: 2,
    name: "Black Walnut Live-Edge Bowl",
    category: "bowl",
    species: "Black Walnut",
    dimensions: "12\" × 4\"",
    price: 150,
    status: "available",
    photos: ["photos/walnut-liveedge-1.jpg","photos/walnut-liveedge-2.jpg","photos/walnut-liveedge-3.jpg","photos/walnut-liveedge-stamp.jpg"],
    description: "Deep, dark walnut with the natural live edge and bark inclusions left wild around the rim, and dramatic grain swirling in the bottom. Signed on the base with the Dizzy Toad stamp. A true statement piece.",
    care: "Hand wash and dry immediately. Re-oil with food-safe mineral oil when the wood looks dry. Never the dishwasher."
  },
  {
    id: 3,
    name: "Walnut Bowl with Turquoise Vein",
    category: "bowl",
    species: "Black Walnut",
    dimensions: "9\" × 3\"",
    price: 140,
    status: "available",
    photos: ["photos/walnut-turquoise.jpg"],
    description: "A smooth walnut bowl with a natural crack reclaimed as a feature — filled with a vein of turquoise inlay that runs across the wall like a little river. Dark wood, bright stone, no two ever the same.",
    care: "Decorative or light dry use. Wipe clean and dry; keep out of standing water. A touch of oil now and then keeps the walnut rich."
  },

  // ── Bowls ──────────────────────────────────────────────────────────────
  {
    id: 4,
    name: "Spalted Maple Bowl",
    category: "bowl",
    species: "Spalted Maple",
    dimensions: "11\" × 4\"",
    price: 120,
    status: "available",
    photos: ["photos/spalted-bowl-1.jpg","photos/spalted-bowl-2.jpg","photos/spalted-bowl-3.jpg"],
    description: "Black spalting lines wander through pale maple like ink — nature drew every one. Wide and welcoming, equally at home holding fruit or sitting empty as a centerpiece. No two alike.",
    care: "Hand wash with warm water and mild soap, dry right away. Feed with food-safe mineral oil every few weeks."
  },
  {
    id: 5,
    name: "Nested Spalted Bowl Set",
    category: "bowl",
    species: "Spalted Maple",
    dimensions: "set of three, to ~13\"",
    price: 165,
    status: "available",
    photos: ["photos/nested-set-1.jpg","photos/nested-set-2.jpg"],
    description: "Three spalted maple bowls turned to nest inside one another — a big serving bowl, a middle, and a little one, all cut from the same character-rich board so the figure carries through the set.",
    care: "Hand wash and dry immediately. Oil regularly with food-safe mineral oil. Store nested with a cloth between to protect the rims."
  },
  {
    id: 6,
    name: "Ash Bowl",
    category: "bowl",
    species: "Ash",
    dimensions: "10\" × 3.5\"",
    price: 85,
    status: "available",
    photos: ["photos/ash-bowl-1.jpg","photos/ash-bowl-2.jpg"],
    description: "Clean, pale ash with bold cathedral grain sweeping around the bowl. Light, bright, and built for everyday — the bowl that ends up holding everything.",
    care: "Hand wash only, dry immediately. Re-oil with food-safe mineral oil when it looks dry."
  },
  {
    id: 7,
    name: "Black Walnut Salad Bowl",
    category: "bowl",
    species: "Black Walnut",
    dimensions: "11\" × 4.5\"",
    price: 130,
    status: "available",
    photos: ["photos/walnut-salad-1.jpg","photos/walnut-salad-2.jpg"],
    description: "A big, rich walnut salad bowl with a smooth sweep and deep chocolate grain. The centerpiece your table has been waiting for.",
    care: "Hand wash only, dry immediately. Oil regularly with food-safe mineral oil. Not for the dishwasher or microwave."
  },
  {
    id: 8,
    name: "Smooth Black Walnut Bowl",
    category: "bowl",
    species: "Black Walnut",
    dimensions: "8\" × 3.5\"",
    price: 90,
    status: "sold",
    photos: ["photos/walnut-bowl-1.jpg","photos/walnut-bowl-2.jpg"],
    description: "Clean and classic — no live edge, just flawless dark walnut grain and a smooth sweep to the rim. The everyday bowl you'll reach for without thinking.",
    care: "Hand wash only, dry immediately. Oil regularly with food-safe mineral oil."
  },

  // ── Vases ──────────────────────────────────────────────────────────────
  {
    id: 9,
    name: "Spalted Maple Vase",
    category: "vase",
    species: "Spalted Maple",
    dimensions: "4\" × 10\"",
    price: 110,
    status: "available",
    photos: ["photos/vase-curvy-1.jpg","photos/vase-curvy-2.jpg","photos/vase-curvy-3.jpg"],
    description: "A graceful curved vase in spalted maple, with figure running top to bottom. Shown here with hydrangeas — beautiful with a few stems or standing on its own.",
    care: "For decorative use. Wipe with a soft dry cloth; keep out of direct sun. Use a liner or dried stems rather than standing water."
  },
  {
    id: 10,
    name: "Tall Spalted Vase",
    category: "vase",
    species: "Spalted Maple",
    dimensions: "4\" × 11\"",
    price: 95,
    status: "available",
    photos: ["photos/vase-tall-1.jpg","photos/vase-tall-2.jpg"],
    description: "A taller, straighter take with a flared lip and bold spalting streaks. Statuesque on a mantel or an entry table.",
    care: "For decorative use. Dust with a soft cloth; keep out of direct sun and away from heat."
  },
  {
    id: 11,
    name: "Dark Spalted Vase",
    category: "vase",
    species: "Spalted Hardwood",
    dimensions: "4\" × 10\"",
    price: 105,
    status: "available",
    photos: ["photos/vase-dark.jpg"],
    description: "A darker vessel with dramatic black spalt lines and a live-edge collar at the rim. Brooding and beautiful.",
    care: "For decorative use. Wipe with a soft dry cloth; keep out of direct sun."
  },

  // ── Christmas trees ────────────────────────────────────────────────────
  {
    id: 12,
    name: "Cherry Christmas Tree",
    category: "christmas_tree",
    species: "Cherry",
    dimensions: "4\" × 9\"",
    price: 38,
    status: "available",
    photos: ["photos/tree-cherry.jpg"],
    description: "Hand-turned tabletop tree with tiered, swept boughs and a slender turned finial on top, in warm cherry that only deepens with age. A keepsake that comes back out every December.",
    care: "Dust with a soft cloth. No water needed. Store cool and dry off-season."
  },
  {
    id: 13,
    name: "Walnut Christmas Tree",
    category: "christmas_tree",
    species: "Black Walnut",
    dimensions: "4\" × 10\"",
    price: 42,
    status: "available",
    photos: ["photos/tree-walnut-1.jpg","photos/tree-walnut-2.jpg"],
    description: "Tiered turned tree in dark walnut, layered rings climbing to a fine finial. Striking against a string of lights.",
    care: "Dust with a soft cloth. No water needed. Store cool and dry off-season."
  },

  // ── Mushrooms (a Dizzy Toad signature) ─────────────────────────────────
  {
    id: 14,
    name: "Garden Mushroom — Tall",
    category: "mushroom",
    species: "Mixed Hardwood",
    dimensions: "≈ 7\" tall",
    price: 34,
    status: "available",
    photos: ["photos/mushroom-light-1.jpg","photos/mushroom-light-2.jpg","photos/mushroom-light-3.jpg"],
    description: "A long-stemmed toadstool with the natural bark left as a band beneath the cap — a little woodland magic for a flower bed, a planter, or a shelf. No two caps are ever alike.",
    care: "Wipe with a soft cloth. Happy indoors or for a spell in the garden; bring it in for winter and a coat of wax now and then keeps it good."
  },
  {
    id: 15,
    name: "Walnut Garden Mushroom",
    category: "mushroom",
    species: "Black Walnut",
    dimensions: "≈ 7\" tall",
    price: 38,
    status: "available",
    photos: ["photos/mushroom-dark-1.jpg","photos/mushroom-dark-2.jpg"],
    description: "Same woodland charm in dark walnut, with a rugged bark band rimming the cap. Rich and moody tucked among the greenery.",
    care: "Wipe with a soft cloth. Bring it indoors for winter; a little wax keeps the walnut deep and dark."
  },
  {
    id: 16,
    name: "Toadstool Cluster",
    category: "mushroom",
    species: "Mixed Hardwood",
    dimensions: "set of small toadstools",
    price: 28,
    status: "available",
    photos: ["photos/mushroom-cluster.jpg"],
    description: "A little family of turned toadstools in different woods and sizes — they look right at home nestled in the garden or grouped on a windowsill. Collect a few.",
    care: "Wipe with a soft cloth. A little wax keeps the shine; bring them in for the winter."
  },

  // ── Plates, boxes & the kitchen ────────────────────────────────────────
  {
    id: 17,
    name: "Ash Plate",
    category: "platter",
    species: "Ash",
    dimensions: "9\" × 1\"",
    price: 45,
    status: "available",
    photos: ["photos/ash-plate.jpg"],
    description: "A wide, shallow plate in pale ash with a gentle rim and beautiful ring grain. Lovely under candles, as a catch-all, or holding bread at the table.",
    care: "Hand wash and dry. Oil occasionally with food-safe mineral oil to keep it bright."
  },
  {
    id: 18,
    name: "Lidded Keepsake Box",
    category: "box",
    species: "Maple & Walnut",
    dimensions: "4\" × 5\"",
    price: 55,
    status: "available",
    photos: ["photos/lidded-box-1.jpg","photos/lidded-box-2.jpg"],
    description: "A turned box with a snug fitted lid and a slender dark finial for a handle. Just right for rings, earrings, or small keepsakes — a little treasure that holds treasures.",
    care: "Dust with a soft cloth. Keep dry and out of direct sun."
  },
  {
    id: 19,
    name: "Wooden Snowman",
    category: "snowman",
    species: "Maple",
    dimensions: "≈ 6\" tall",
    price: 35,
    status: "available",
    photos: ["photos/snowman-1.jpg","photos/snowman-2.jpg"],
    description: "A stacked, hand-turned snowman with a burned-in face, buttons, and a top hat. A keepsake that comes back out every winter for a lifetime.",
    care: "Dust with a soft cloth. No water needed. Store cool and dry off-season."
  },

  // ── Small goods & gifts ────────────────────────────────────────────────
  {
    id: 20,
    name: "Wine Bottle Stopper",
    category: "bottle_stopper",
    species: "Cherry",
    dimensions: "≈ 4\" tall",
    price: 22,
    status: "available",
    photos: ["photos/stopper.jpg"],
    description: "Hand-turned hardwood top on a food-safe stainless stopper. Seals any standard wine or oil bottle, and every grain pattern is one of a kind.",
    care: "Wipe the wood with a dry cloth. Hand wash the stainless base only; keep the wood out of standing water."
  },
  {
    id: 21,
    name: "Wooden Scoop",
    category: "other",
    species: "Spalted Maple",
    dimensions: "≈ 6\" long",
    price: 26,
    status: "available",
    photos: ["photos/scoop.jpg"],
    description: "A hand-shaped scoop carved from a single piece of spalted maple — perfect for coffee, salts, or flour, and pretty enough to leave out on the counter.",
    care: "Hand wash and dry right away. Oil with food-safe mineral oil now and then; never soak or dishwash."
  },
  {
    id: 22,
    name: "Pepper Mill",
    category: "peppermill",
    species: "Spalted Maple",
    dimensions: "≈ 8\" tall",
    price: 45,
    status: "available",
    photos: ["photos/peppermill.jpg"],
    description: "A turned spalted-maple mill with a quality grinding mechanism inside. Grinds pepper or salt, and looks the part on any table.",
    care: "Wipe with a dry cloth. Keep dry; refill through the top. Do not immerse."
  }
];
