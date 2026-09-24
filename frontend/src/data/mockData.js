// Comprehensive Mock Meat Data for Fresh Meat Shop

export const PREPARATION_STYLES = [
  {
    id: "sukka",
    name: "Sukka Cut",
    tagline: "Small dry-roast pieces",
    description: "Bite-sized cuts with high surface area, perfect for Tamil Nadu style chukka & dry roasts.",
    icon: "🥘",
    badge: "Popular"
  },
  {
    id: "kulambu",
    name: "Kulambu / Curry Cut",
    tagline: "Medium juicy chunks",
    description: "Even-sized pieces with bone-in marrow flavor, ideal for village-style spicy gravies and curries.",
    icon: "🍲",
    badge: "Classic"
  },
  {
    id: "fry",
    name: "Fry Cut",
    tagline: "Thin flat cuts with slits",
    description: "Thinly sliced cuts designed for quick marination and crunchy pan or deep frying.",
    icon: "🍳",
    badge: "Crispy"
  },
  {
    id: "kebab",
    name: "Kebab Cut",
    tagline: "Bite-sized boneless cubes",
    description: "Precision-cut succulent cubes, ready for skewering, tandoori, and tikka preparations.",
    icon: "🍢",
    badge: "Tender"
  },
  {
    id: "keema",
    name: "Keema / Minced",
    tagline: "Finely ground meat",
    description: "Twice-minced ultra-fresh meat for koftas, samosas, rolls, and keema curry.",
    icon: "🥩",
    badge: "Special"
  },
  {
    id: "biryani",
    name: "Biryani Cut",
    tagline: "Large royal cuts",
    description: "Generously sized juicy chunks that lock in aromatic spices during slow dum cooking.",
    icon: "🍗",
    badge: "Chef Choice"
  },
  {
    id: "soup_bones",
    name: "Soup Bones / Paya",
    tagline: "Marrow & joint cuts",
    description: "Rich cartilage and bone marrow pieces packed with natural collagen and nutrients.",
    icon: "🥣",
    badge: "Healthy"
  }
];

export const CATEGORIES = [
  {
    id: "all",
    name: "All Cuts",
    icon: "🔥",
    color: "from-red-500 to-rose-600"
  },
  {
    id: "chicken",
    name: "Fresh Chicken",
    icon: "🍗",
    color: "from-amber-500 to-orange-600"
  },
  {
    id: "mutton",
    name: "Tender Mutton",
    icon: "🥩",
    color: "from-red-600 to-rose-700"
  },
  {
    id: "seafood",
    name: "Fish & Prawns",
    icon: "🐟",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: "marinades",
    name: "Ready-to-Cook",
    icon: "🌶️",
    color: "from-orange-500 to-red-600"
  },
  {
    id: "eggs",
    name: "Farm Eggs",
    icon: "🥚",
    color: "from-yellow-400 to-amber-500"
  }
];

export const PRODUCTS = [
  {
    id: "chk-01",
    name: "Country Chicken (Naatu Kozhi)",
    tamilName: "நாட்டுக்கோழி",
    category: "chicken",
    tagline: "Free-range, high protein & authentic native taste",
    basePricePerKg: 460,
    bonelessPricePerKg: 620,
    supportsBoneless: true,
    rating: 4.9,
    reviewsCount: 342,
    deliveryTime: "30-40 mins",
    grossNetRatio: "Gross 1kg ≈ Net 780g-820g cleaned",
    badge: "Heritage Native",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80",
    description: "Free-range authentic native country chicken, fed on natural grains. Known for deep flavor, firm texture, and rich nutrient profile. Ideal for authentic Sunday village kulambu.",
    allowedPreparations: ["sukka", "kulambu", "fry", "biryani", "soup_bones"]
  },
  {
    id: "chk-02",
    name: "Tender Broiler Chicken (Farm Fresh)",
    tamilName: "பிராய்லர் சிக்கன்",
    category: "chicken",
    tagline: "Antibiotic-free, soft, juicy & fresh cut",
    basePricePerKg: 240,
    bonelessPricePerKg: 360,
    supportsBoneless: true,
    rating: 4.8,
    reviewsCount: 890,
    deliveryTime: "25-30 mins",
    grossNetRatio: "Gross 1kg ≈ Net 850g cleaned",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80",
    description: "Freshly cut tender young chicken, 100% antibiotic residue-free. Dressed with cold RO water wash for maximum hygiene.",
    allowedPreparations: ["sukka", "kulambu", "fry", "kebab", "keema", "biryani"]
  },
  {
    id: "chk-03",
    name: "Premium Chicken Breast (Boneless)",
    tamilName: "சிக்கன் பிரெஸ்ட் ஃபில்லெட்",
    category: "chicken",
    tagline: "Zero fat, 100% lean protein fillet cuts",
    basePricePerKg: 380,
    bonelessPricePerKg: 380,
    supportsBoneless: true,
    rating: 4.9,
    reviewsCount: 520,
    deliveryTime: "25-30 mins",
    grossNetRatio: "100% Net Usable Weight",
    badge: "Gym & High Protein",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80",
    description: "Pure lean, supple chicken breast fillets. Perfect for gym diets, chicken salads, skewers, nuggets, and kebabs.",
    allowedPreparations: ["kebab", "keema", "fry", "sukka"]
  },
  {
    id: "mut-01",
    name: "Prime Goat / Mutton (Curry Cut)",
    tamilName: "ஆட்டுக்கறி குழம்பு வெட்டு",
    category: "mutton",
    tagline: "Young tender kid goat, naturally grass-fed",
    basePricePerKg: 860,
    bonelessPricePerKg: 1180,
    supportsBoneless: true,
    rating: 4.95,
    reviewsCount: 630,
    deliveryTime: "35-45 mins",
    grossNetRatio: "Gross 1kg ≈ Net 820g cleaned",
    badge: "Sunday Special",
    image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80",
    description: "Selected young kid goat meat with ideal fat-to-meat ratio. Tender cuts from shoulder and rib cage that melt into flavor when slow-cooked.",
    allowedPreparations: ["sukka", "kulambu", "fry", "biryani", "soup_bones"]
  },
  {
    id: "mut-02",
    name: "Tender Mutton Keema (Minced)",
    tamilName: "மட்டன் கொத்துக்கறி",
    category: "mutton",
    tagline: "Machine minced with zero sinew, pure boneless meat",
    basePricePerKg: 1100,
    bonelessPricePerKg: 1100,
    supportsBoneless: false,
    rating: 4.9,
    reviewsCount: 290,
    deliveryTime: "30-40 mins",
    grossNetRatio: "100% Pure Minced Meat",
    badge: "Melt In Mouth",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    description: "Twice-minced tender goat meat. Zero hard fibers or gristle. Best for Chettinad Kola Urundai, stuffed parottas, and spicy keema dry fry.",
    allowedPreparations: ["keema", "sukka"]
  },
  {
    id: "mut-03",
    name: "Mutton Paya (Goat Trotters / Legs)",
    tamilName: "ஆட்டுக்கால் பாயா",
    category: "mutton",
    tagline: "Flame charred & cleaned, rich bone collagen",
    basePricePerKg: 650,
    bonelessPricePerKg: 650,
    supportsBoneless: false,
    rating: 4.85,
    reviewsCount: 180,
    deliveryTime: "35-45 mins",
    grossNetRatio: "4 pieces cleaned & ready to cook",
    badge: "Immunity Booster",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    description: "Traditional flame-roasted goat trotters, thoroughly scraped, cleaned, and joint-cut for authentic spicy Sunday breakfast Paya soup.",
    allowedPreparations: ["soup_bones", "kulambu"]
  },
  {
    id: "sea-01",
    name: "Fresh Seer Fish / Vanjaram Steaks",
    tamilName: "வஞ்சிரம் மீன் துண்டுகள்",
    category: "seafood",
    tagline: "Catch of the day, neat round cut steaks",
    basePricePerKg: 980,
    bonelessPricePerKg: 980,
    supportsBoneless: false,
    rating: 4.9,
    reviewsCount: 410,
    deliveryTime: "30-40 mins",
    grossNetRatio: "Gross 1kg ≈ Net 750g neat steaks",
    badge: "Catch Of The Day",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
    description: "The King of South Indian fish! Cleaned, descaled, and sliced into neat circular steaks. Juicy, meaty texture with single central bone.",
    allowedPreparations: ["fry", "kulambu"]
  },
  {
    id: "sea-02",
    name: "Tiger Prawns (Cleaned & Deveined)",
    tamilName: "இறால் - தோல் உரிக்கப்பட்டது",
    category: "seafood",
    tagline: "Tail-on, deshelled & deveined, zero smell",
    basePricePerKg: 620,
    bonelessPricePerKg: 620,
    supportsBoneless: false,
    rating: 4.88,
    reviewsCount: 315,
    deliveryTime: "25-35 mins",
    grossNetRatio: "100% Ready-to-pan cleaned weight",
    badge: "100% Deveined",
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80",
    description: "Sweet, crunchy coastal prawns. Tail-on for gourmet presentation, black digestive tract completely removed.",
    allowedPreparations: ["sukka", "fry", "kulambu", "biryani"]
  },
  {
    id: "mar-01",
    name: "Chettinad Spicy Sukka Chicken (Marinated)",
    tamilName: "செட்டிநாடு சுக்கா மேரினேஷன்",
    category: "marinades",
    tagline: "Stone-ground shallots, fennel, black pepper & curry leaf",
    basePricePerKg: 340,
    bonelessPricePerKg: 440,
    supportsBoneless: true,
    rating: 4.92,
    reviewsCount: 220,
    deliveryTime: "20-30 mins",
    grossNetRatio: "500g Pack (Serves 2-3)",
    badge: "Ready in 10 Mins",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
    description: "Marinated with traditional Karaikudi freshly roasted spices, ginger garlic paste, and cold-pressed sesame oil. Simply toss in a pan for 10 minutes.",
    allowedPreparations: ["sukka", "fry"]
  },
  {
    id: "egg-01",
    name: "Free-Range Country Chicken Eggs (Pack of 10)",
    tamilName: "நாட்டுக்கோழி முட்டை",
    category: "eggs",
    tagline: "Natural golden yolk, rich in Omega-3 & B12",
    basePricePerKg: 130, // Per pack
    bonelessPricePerKg: 130,
    supportsBoneless: false,
    rating: 4.95,
    reviewsCount: 740,
    deliveryTime: "20-25 mins",
    grossNetRatio: "10 Brown Eggs in safe pulp tray",
    badge: "Farm Fresh",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
    description: "Authentic brown country eggs from free-roaming hens. Deep yellow yolks rich in protein and micronutrients.",
    allowedPreparations: []
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ORD-9421",
    customerName: "Karthik Subramanian",
    customerPhone: "+91 98401 23456",
    deliveryAddress: "Flat 4B, Ruby Towers, 2nd Main Road, Anna Nagar, Chennai",
    placedAt: "10 mins ago",
    status: "prepping", // "placed", "prepping", "packed", "out_for_delivery", "delivered"
    items: [
      {
        productId: "chk-01",
        productName: "Country Chicken (Naatu Kozhi)",
        weightKg: 1.5,
        bonePreference: "with_bone",
        preparationId: "sukka",
        preparationName: "Sukka Cut",
        cleaningPreferences: ["Skin-off", "Turmeric & Salt Washed"],
        specialInstructions: "Cut into small, even pieces for dry roast.",
        unitPrice: 460,
        itemTotal: 690
      },
      {
        productId: "mut-01",
        productName: "Prime Goat / Mutton (Curry Cut)",
        weightKg: 1.0,
        bonePreference: "with_bone",
        preparationId: "kulambu",
        preparationName: "Kulambu / Curry Cut",
        cleaningPreferences: ["Extra Clean"],
        specialInstructions: "Include nice marrow bone pieces.",
        unitPrice: 860,
        itemTotal: 860
      }
    ],
    deliverySlot: "Instant Delivery (35 Mins)",
    paymentMethod: "UPI (Google Pay)",
    totalAmount: 1550,
    deliveryBoy: {
      name: "Murugan Selvam",
      phone: "+91 97890 54321",
      bikeModel: "Honda Activa (TN 02 BX 4412)",
      currentLat: 13.0845,
      currentLng: 80.2185,
      etaMinutes: 18,
      distanceKm: 2.8
    }
  }
];
