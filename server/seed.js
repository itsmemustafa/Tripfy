import mongoose from "mongoose";
import Place from "./models/place.js";
import User from "./models/user.js";
import Review from "./models/review.js";
import ConnectsDB from "./DB/connect.js";
import config from "./config/index.js";

/**
 * We use high-quality Unsplash images representing mountains, waterfalls, historical ruins, and parks.
 * The original wikipedia hotlinks were removed as they can break or have low resolution.
 */
const iraqPlaces = [
  // ─── Erbil (Hawler) ────────────────────────────────────────────────────────
  {
    name: "Erbil Citadel (Qalat Hawler)",
    category: "Historical",
    subcategory: "Ancient Fortress",
    location: {
      city: "Erbil",
      coordinates: { lat: 36.1912, lng: 44.0092 },
    },
    description:
      "A UNESCO World Heritage Site, the Erbil Citadel is one of the oldest continuously inhabited places on Earth, dating back over 6,000 years. Perched atop a 32-metre high mound at the heart of Erbil city, it offers stunning panoramic views.",
    images: [
      "https://images.unsplash.com/photo-1560961911-ba7ef651a56c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1599833975787-5c143f373c30?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1548689816-c399f954f3dd?auto=format&fit=crop&q=80&w=1200",
    ],
    rating: 4.8,
  },
  {
    name: "Shanidar Cave",
    category: "Historical",
    subcategory: "Archaeological Site",
    location: {
      city: "Erbil",
      coordinates: { lat: 36.8369, lng: 44.2217 },
    },
    description:
      "A remarkable Paleolithic cave site in the Bradost region north of Erbil, famous for the discovery of Neanderthal skeletons dating back 60,000–80,000 years. Set inside the stunning Zagros mountains.",
    images: [
      "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&q=85&w=1400",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
    ],
    rating: 4.5,
  },
  {
    name: "Sami Abd Al Rahman Park",
    category: "Nature",
    subcategory: "Public Park",
    location: {
      city: "Erbil",
      coordinates: { lat: 36.1779, lng: 43.9985 },
    },
    description:
      "The largest public park in Erbil and one of the biggest in the Middle East, spanning over 1 million square meters. A perfect spot for families, joggers, and picnics, with beautiful fountains and green spaces.",
    images: [
      "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=1200",
    ],
    rating: 4.9,
  },
  {
    name: "Ankawa",
    category: "Cultural",
    subcategory: "District",
    location: {
      city: "Erbil",
      coordinates: { lat: 36.2284, lng: 43.9876 },
    },
    description:
      "A vibrant suburb of Erbil known for its lively café culture, restaurants, bars, and churches. It's a popular destination for nightlife, food, and cultural exchange in Iraq.",
    images: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1200",
    ],
    rating: 4.3,
  },

  // ─── Sulaymaniyah (Slemani) ─────────────────────────────────────────────────
  {
    name: "Azmar Mountain",
    category: "Nature",
    subcategory: "Mountain",
    location: {
      city: "Sulaymaniyah",
      coordinates: { lat: 35.5749, lng: 45.4429 },
    },
    description:
      "A popular mountain overlooking Sulaymaniyah city, Azmar is a beloved recreational destination offering scenic hiking trails, stunning views over the city and surrounding plains.",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1516655855035-d5215bcb5604?auto=format&fit=crop&q=80&w=1200",
    ],
    rating: 4.6,
  },
  {
    name: "Sulaymaniyah Museum",
    category: "Cultural",
    subcategory: "Museum",
    location: {
      city: "Sulaymaniyah",
      coordinates: { lat: 35.5566, lng: 45.4337 },
    },
    description:
      "One of the most important archaeological museums in Iraq, housing an extensive collection of Sumerian, Akkadian, and Babylonian artifacts.",
    images: [
      "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&q=80&w=1200",
    ],
    rating: 4.7,
  },
  {
    name: "Dukan Lake",
    category: "Nature",
    subcategory: "Lake",
    location: {
      city: "Sulaymaniyah",
      coordinates: { lat: 35.9539, lng: 44.9571 },
    },
    description:
      "A large, stunning reservoir formed by the Dukan Dam. Surrounded by mountains, this turquoise lake is a top destination for swimming, boat rides, fishing, and camping.",
    images: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200",
    ],
    rating: 4.8,
  },

  // ─── Duhok ──────────────────────────────────────────────────────────────────
  {
    name: "Zakho Ancient Bridge (Pira Dalal)",
    category: "Historical",
    subcategory: "Ancient Bridge",
    location: {
      city: "Duhok",
      coordinates: { lat: 37.1497, lng: 42.6768 },
    },
    description:
      "A magnificent ancient stone bridge spanning the Khabur River in Zakho. Remarkably well-preserved, Pira Dalal is one of the most iconic historical landmarks in Iraq.",
    images: [
      "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&q=80&w=1200",
    ],
    rating: 4.6,
  },
  {
    name: "Amadiya (Amedi)",
    category: "Historical",
    subcategory: "Ancient Town",
    location: {
      city: "Duhok",
      coordinates: { lat: 37.0913, lng: 43.4908 },
    },
    description:
      "An ancient hilltop town perched atop a flat plateau at 1,400 metres, Amadiya has been inhabited for over 3,000 years with stunning views and an ancient gate.",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&q=80&w=1200",
    ],
    rating: 4.9,
  },
  {
    name: "Lalish Temple",
    category: "Cultural",
    subcategory: "Religious Site",
    location: {
      city: "Duhok",
      coordinates: { lat: 36.9012, lng: 43.1557 },
    },
    description:
      "The holiest Yazidi sanctuary in the world, Lalish is a serene valley containing ancient temples, shrines, and sacred springs.",
    images: [
      "https://images.unsplash.com/photo-1548689816-c399f954f3dd?auto=format&fit=crop&q=85&w=1400",
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=85&w=1200",
    ],
    rating: 4.8,
  },

  // ─── Halabja ─────────────────────────────────────────────────────────────────
  {
    name: "Ahmadawa Waterfall",
    category: "Nature",
    subcategory: "Waterfall",
    location: {
      city: "Halabja",
      coordinates: { lat: 35.2854, lng: 45.9688 },
    },
    description:
      "A stunning waterfall cascading through lush green cliffs near Halabja, surrounded by picnic areas and natural springs.",
    images: [
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200",
    ],
    rating: 4.7,
  },
  // ─── Shaqlawa ────────────────────────────────────────────────────────────────
  {
    name: "Gali Ali Beg Waterfall",
    category: "Nature",
    subcategory: "Waterfall",
    location: {
      city: "Erbil",
      coordinates: { lat: 36.6781, lng: 44.5327 },
    },
    description:
      "One of the most spectacular waterfalls in Iraq, plunging through a dramatic canyon gorge. The towering cliffs make it a top natural attraction in Iraq.",
    images: [
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=85&w=1400",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=85&w=1400",
    ],
    rating: 4.9,
  },
  {
    name: "Shaqlawa Resort Town",
    category: "Nature",
    subcategory: "Mountain Town",
    location: {
      city: "Erbil",
      coordinates: { lat: 36.4058, lng: 44.3203 },
    },
    description:
      "A beloved mountain resort town in the Safeen Mountain range at 1,000 metres altitude. Famous for its cooler climate, apple orchards, and a lively market.",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=85&w=1400",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200",
    ],
    rating: 4.6,
  },
  // ─── Baghdad ──────────────────────────────────────────────────────────────────
  {
    name: "Al-Mutanabbi Street",
    category: "Cultural",
    subcategory: "Historic Street",
    location: {
      city: "Baghdad",
      coordinates: { lat: 33.3400, lng: 44.3888 },
    },
    description:
      "The historic center of Baghdad bookselling, famous for its energetic weekend markets and thriving intellectual culture. It remains the heart of literacy and culture in Iraq.",
    images: [
      "https://images.unsplash.com/photo-1560961911-ba7ef651a56c?auto=format&fit=crop&q=80&w=1200"
    ],
    rating: 4.9,
  },
  // ─── Basra ──────────────────────────────────────────────────────────────────
  {
    name: "Shatt al-Arab",
    category: "Nature",
    subcategory: "River",
    location: {
      city: "Basra",
      coordinates: { lat: 30.5258, lng: 47.8800 },
    },
    description:
      "The magnificent river formed by the confluence of the Euphrates and the Tigris, lined with palm trees and dotted with boats. A significant natural and economic lifeline of Basra.",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=85&w=1400"
    ],
    rating: 4.6,
  },
  // ─── Mosul ──────────────────────────────────────────────────────────────────
  {
    name: "Great Mosque of al-Nuri",
    category: "Historical",
    subcategory: "Mosque",
    location: {
      city: "Mosul",
      coordinates: { lat: 36.3422, lng: 43.1258 },
    },
    description:
      "Famous for its leaning minaret (Al-Hadba), this historic 12th-century mosque is one of the most remarkable landmarks of Mosul's rich history.",
    images: [
      "https://images.unsplash.com/photo-1548689816-c399f954f3dd?auto=format&fit=crop&q=80&w=1200"
    ],
    rating: 4.8,
  }
];

const additionalIraqPlaces = [
  {
    name: "Ancient City of Babylon",
    category: "Historical",
    subcategory: "UNESCO Archaeological Site",
    location: { city: "Babylon", coordinates: { lat: 32.542, lng: 44.421 } },
    description:
      "The monumental remains of ancient Babylon, capital of Hammurabi and Nebuchadnezzar II, include reconstructed processional ways, temple foundations, and sweeping views across one of Mesopotamia's most influential cities.",
    images: [
      "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&q=85&w=1400",
      "https://images.unsplash.com/photo-1599833975787-5c143f373c30?auto=format&fit=crop&q=85&w=1200",
    ],
    rating: 4.9,
  },
  {
    name: "Hatra Archaeological City",
    category: "Historical",
    subcategory: "UNESCO Archaeological Site",
    location: { city: "Mosul", coordinates: { lat: 35.588, lng: 42.718 } },
    description:
      "A fortified desert city whose temples blend Parthian, Hellenistic, Roman, and eastern architectural traditions. Its immense stone iwans and carved façades make it one of Iraq's most dramatic ancient sites.",
    images: [
      "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&q=85&w=1400",
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=85&w=1200",
    ],
    rating: 4.8,
  },
  {
    name: "Great Mosque of Samarra",
    category: "Historical",
    subcategory: "Abbasid Architecture",
    location: { city: "Samarra", coordinates: { lat: 34.208, lng: 43.881 } },
    description:
      "The vast ninth-century mosque complex is celebrated for the Malwiya, its unmistakable spiral minaret. The surrounding archaeological city preserves the scale and ambition of the Abbasid capital.",
    images: [
      "https://images.unsplash.com/photo-1548689816-c399f954f3dd?auto=format&fit=crop&q=85&w=1400",
      "https://images.unsplash.com/photo-1548689816-c399f954f3dd?auto=format&fit=crop&q=85&w=1200",
    ],
    rating: 4.9,
  },
  {
    name: "Ziggurat of Ur",
    category: "Historical",
    subcategory: "Sumerian Monument",
    location: { city: "Nasiriyah", coordinates: { lat: 30.9625, lng: 46.1031 } },
    description:
      "A remarkably preserved stepped temple platform at ancient Ur, built more than four thousand years ago. Its monumental staircases offer a vivid introduction to Sumerian urban life and belief.",
    images: [
      "https://images.unsplash.com/photo-1599833975787-5c143f373c30?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&q=85&w=1200",
    ],
    rating: 4.9,
  },
  {
    name: "The Ahwar of Southern Iraq",
    category: "Nature",
    subcategory: "UNESCO Wetlands",
    location: { city: "Dhi Qar", coordinates: { lat: 30.965, lng: 47.005 } },
    description:
      "A vast mosaic of reed beds, open lagoons, wildlife habitat, and traditional Marsh Arab communities. Canoe trips through the waterways reveal one of the Middle East's most distinctive cultural landscapes.",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=85&w=1400",
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=85&w=1200",
    ],
    rating: 4.9,
  },
  {
    name: "Iraq National Museum",
    category: "Cultural",
    subcategory: "Museum",
    location: { city: "Baghdad", coordinates: { lat: 33.3284, lng: 44.3853 } },
    description:
      "Iraq's flagship museum presents treasures from Sumer, Akkad, Babylon, Assyria, and the Islamic era across galleries that tell the story of Mesopotamia and the origins of urban civilization.",
    images: [
      "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&q=85&w=1400",
      "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&q=85&w=1200",
    ],
    rating: 4.9,
  },
  {
    name: "Al-Shaheed Monument",
    category: "Cultural",
    subcategory: "Modern Monument",
    location: { city: "Baghdad", coordinates: { lat: 33.2894, lng: 44.4551 } },
    description:
      "Baghdad's iconic turquoise split dome rises above gardens, water, and a museum. The bold modern composition is among the city's most recognizable works of public architecture.",
    images: [
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=85&w=1400",
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=85&w=1200",
    ],
    rating: 4.7,
  },
  {
    name: "Al-Mustansiriya School",
    category: "Historical",
    subcategory: "Abbasid Madrasa",
    location: { city: "Baghdad", coordinates: { lat: 33.3464, lng: 44.3893 } },
    description:
      "A beautifully restored Abbasid-era scholarly complex on the Tigris, admired for its brickwork, carved inscriptions, arcaded courtyard, and central place in Baghdad's intellectual history.",
    images: [
      "https://images.unsplash.com/photo-1548689816-c399f954f3dd?auto=format&fit=crop&q=85&w=1400",
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=85&w=1200",
    ],
    rating: 4.8,
  },
  {
    name: "Korek Mountain Resort",
    category: "Adventure",
    subcategory: "Mountain Resort",
    location: { city: "Erbil", coordinates: { lat: 36.596, lng: 44.451 } },
    description:
      "A high-altitude mountain destination reached by cable car, with broad Zagros views, cool summer air, hiking routes, winter snow, restaurants, and activities for families and adventure travelers.",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=85&w=1400",
      "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&q=85&w=1200",
    ],
    rating: 4.8,
  },
  {
    name: "Bekhal Waterfall",
    category: "Nature",
    subcategory: "Waterfall",
    location: { city: "Erbil", coordinates: { lat: 36.625, lng: 44.448 } },
    description:
      "A lively mountain waterfall and roadside retreat near Rawanduz, surrounded by steep green slopes, cafés, terraces, and the spectacular drive toward Korek Mountain.",
    images: [
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=85&w=1400",
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=85&w=1400",
    ],
    rating: 4.7,
  },
  {
    name: "Duhok Dam and Lake",
    category: "Nature",
    subcategory: "Lake",
    location: { city: "Duhok", coordinates: { lat: 36.872, lng: 42.988 } },
    description:
      "A calm reservoir immediately north of Duhok, popular for scenic drives, evening walks, picnics, and photographs of the lake framed by the surrounding dry mountain ridges.",
    images: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=85&w=1400",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=85&w=1200",
    ],
    rating: 4.6,
  },
  {
    name: "Basrah Cultural Museum",
    category: "Cultural",
    subcategory: "Museum",
    location: { city: "Basra", coordinates: { lat: 30.503, lng: 47.817 } },
    description:
      "Set inside a restored palace, this museum connects southern Iraq to the civilizations of Ur, Babylon, Assyria, and the Gulf through archaeological galleries and a memorable riverside setting.",
    images: [
      "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&q=85&w=1400",
      "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&q=80&w=1200",
    ],
    rating: 4.7,
  },
  {
    name: "Imam Hussein Shrine",
    category: "Cultural",
    subcategory: "Religious Site",
    location: { city: "Karbala", coordinates: { lat: 32.6163, lng: 44.0324 } },
    description:
      "One of the world's most important Shia pilgrimage destinations, centered on a luminous shrine complex whose courtyards, tilework, calligraphy, and evening atmosphere define the heart of Karbala.",
    images: [
      "https://images.unsplash.com/photo-1548689816-c399f954f3dd?auto=format&fit=crop&q=85&w=1400",
      "https://images.unsplash.com/photo-1548689816-c399f954f3dd?auto=format&fit=crop&q=85&w=1200",
    ],
    rating: 5.0,
  },
  {
    name: "Imam Ali Shrine",
    category: "Cultural",
    subcategory: "Religious Site",
    location: { city: "Najaf", coordinates: { lat: 32.0006, lng: 44.314 } },
    description:
      "The spiritual and architectural center of Najaf, recognized by its golden dome and expansive courtyards. The surrounding old-city lanes are filled with schools, bookshops, markets, and pilgrims.",
    images: [
      "https://images.unsplash.com/photo-1548689816-c399f954f3dd?auto=format&fit=crop&q=85&w=1400",
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=85&w=1200",
    ],
    rating: 5.0,
  },
];

const allPlaces = [...iraqPlaces, ...additionalIraqPlaces];

const demoUsers = [
  {
    name: "Layla Hassan",
    email: "layla.seed@tripfy.local",
    password: "Travel123!",
    role: "user",
  },
  {
    name: "Omar Kareem",
    email: "omar.seed@tripfy.local",
    password: "Explore123!",
    role: "user",
  },
];

const demoReviews = [
  ["layla.seed@tripfy.local", "Ancient City of Babylon", 5, "Walking through Babylon at golden hour was the highlight of my trip. A local guide makes the layers of history much easier to understand."],
  ["omar.seed@tripfy.local", "Ancient City of Babylon", 5, "Huge, atmospheric, and full of stories. Bring water and allow at least two hours for the main route."],
  ["layla.seed@tripfy.local", "The Ahwar of Southern Iraq", 5, "The reed houses, birds, and quiet canoe ride felt unlike anywhere else in Iraq. Go early for softer light and cooler weather."],
  ["omar.seed@tripfy.local", "Ziggurat of Ur", 5, "Seeing the monumental staircase in person is extraordinary. The open desert setting makes the site even more powerful."],
  ["layla.seed@tripfy.local", "Iraq National Museum", 5, "Excellent galleries and an essential stop before visiting the archaeological sites. I could easily spend half a day here."],
  ["omar.seed@tripfy.local", "Al-Mutanabbi Street", 5, "Books, tea, copperwork, and nonstop street life. Friday morning had the best atmosphere."],
  ["layla.seed@tripfy.local", "Al-Mustansiriya School", 5, "Beautiful brick details and a peaceful courtyard beside the Tigris. It pairs perfectly with Mutanabbi Street."],
  ["omar.seed@tripfy.local", "Korek Mountain Resort", 5, "The cable-car views are fantastic and the temperature is much cooler than Erbil. Take a jacket near sunset."],
  ["layla.seed@tripfy.local", "Bekhal Waterfall", 4, "A fun, energetic stop on the mountain road. It gets busy, so arriving before lunch is worth it."],
  ["omar.seed@tripfy.local", "Duhok Dam and Lake", 4, "Easy to reach from the city and especially nice in the evening when the mountains reflect on the water."],
  ["layla.seed@tripfy.local", "Dukan Lake", 5, "Blue water, dramatic hills, and a relaxing boat trip made this a perfect day away from the city."],
  ["omar.seed@tripfy.local", "Amadiya (Amedi)", 5, "The plateau setting is unforgettable. Walk to the old gate and take time to explore the town rather than only stopping for photos."],
  ["layla.seed@tripfy.local", "Basrah Cultural Museum", 5, "A thoughtful collection in a beautiful building. Combine it with an evening walk beside Shatt al-Arab."],
  ["omar.seed@tripfy.local", "Great Mosque of Samarra", 5, "The spiral minaret is even more impressive in person, and the scale of the archaeological city is remarkable."],
  ["layla.seed@tripfy.local", "Erbil Citadel (Qalat Hawler)", 5, "The views, old lanes, and surrounding bazaar make this the best introduction to Erbil."],
  ["omar.seed@tripfy.local", "Sulaymaniyah Museum", 5, "A compact museum with outstanding objects and clear historical context. Do not skip it while visiting Sulaymaniyah."],
];

async function seedDatabase() {
  try {
    // Never allow this demo-data command to modify a remote database.
    const mongoUri = config.db.url;
    if (!mongoUri) {
      throw new Error("MONGO_URL is not defined in your .env file");
    }

    if (!/^mongodb:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?\//i.test(mongoUri)) {
      throw new Error("Seed refused: MONGO_URL must use a local MongoDB instance.");
    }

    await ConnectsDB(mongoUri);
    console.log("✅ Connected to MongoDB");

    const result = await Place.bulkWrite(
      allPlaces.map((place) => ({
        updateOne: {
          filter: { name: place.name },
          update: { $set: place },
          upsert: true,
        },
      }))
    );
    const seeded = await Place.find({
      name: { $in: allPlaces.map((place) => place.name) },
    }).sort({ name: 1 });

    const users = new Map();
    for (const demoUser of demoUsers) {
      let user = await User.findOne({ email: demoUser.email });
      if (!user) user = await new User(demoUser).save();
      users.set(user.email, user);
    }

    const places = new Map(seeded.map((place) => [place.name, place]));
    const reviewResult = await Review.bulkWrite(
      demoReviews.map(([email, placeName, rating, text]) => ({
        updateOne: {
          filter: {
            user: users.get(email)._id,
            place: places.get(placeName)._id,
          },
          update: { $set: { rating, text } },
          upsert: true,
        },
      }))
    );
    const demoReviewTotal = await Review.countDocuments({
      user: { $in: [...users.values()].map((user) => user._id) },
    });

    console.log(
      `\nPlaces: ${result.upsertedCount} added, ${result.modifiedCount} updated, ${seeded.length} available.`
    );
    console.log(
      `Reviews: ${reviewResult.upsertedCount} added, ${reviewResult.modifiedCount} updated, ${demoReviewTotal} demo comments available.\n`
    );

    seeded.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} — ${p.location.city} (${p.category})`);
    });

    console.log("\n✅ Seeding complete. You can now test the app with real data.");
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
  }
}

seedDatabase();
