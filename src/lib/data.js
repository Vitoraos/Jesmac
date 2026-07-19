// ═══════════════════════════════════════════════════════════════
// CONFIG: Change prices & WhatsApp number here. Nothing else.
// ═══════════════════════════════════════════════════════════════

export const WHATSAPP_NUMBER = "2348000000000";

export const PRODUCTS = {
  lemon: {
    id: "lemon",
    name: "Lemon Fresh",
    tagline: "Cuts grease. Zesty finish.",
    description:
      "Heavy-duty cleaning with a crisp lemon punch. Blasts through oil on plates, lifts dirt from fabrics, and leaves glass spotless. One soap, every surface.",
    size: "75cl",
    newBottlePrice: 2500,
    refillPrice: 1800,
    color: "lemon",
    hex: "#FFD60A",
    accentHex: "#FFF9DB",
  },
  green: {
    id: "green",
    name: "Fresh Green",
    tagline: "Deep clean. Cool finish.",
    description:
      "Powered by a fresh teal formula that attacks grime without mercy. Perfect for laundry day, kitchen deep-cleans, and washing down the ride.",
    size: "75cl",
    newBottlePrice: 2500,
    refillPrice: 1800,
    color: "teal",
    hex: "#00A896",
    accentHex: "#E0F7F5",
  },
};

export const SAVINGS_AMOUNT =
  PRODUCTS.lemon.newBottlePrice - PRODUCTS.lemon.refillPrice;

export const USE_CASES = [
  {
    icon: "Utensils",
    title: "Plates & Cookware",
    desc: "Cuts through stacked grease and dried starch in seconds.",
  },
  {
    icon: "Shirt",
    title: "Clothes & Fabrics",
    desc: "Lifts dirt and food stains without fading colors.",
  },
  {
    icon: "Car",
    title: "Cars & Surfaces",
    desc: "Washes away road grime and leaves a streak-free shine.",
  },
];
