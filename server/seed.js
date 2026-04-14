import mongoose from "mongoose";
import dotenv from "dotenv";
import Place from "./models/place.js";
import ConnectsDB from "./DB/connect.js";

dotenv.config();

/**
 * We use high-quality Unsplash images representing mountains, waterfalls, historical ruins, and parks.
 * The original wikipedia hotlinks were removed as they can break or have low resolution.
 */
const kurdistanPlaces = [
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
      "https://images.unsplash.com/photo-1549474768-bd885af50def?auto=format&fit=crop&q=80&w=1200",
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
      "https://images.unsplash.com/photo-1502581896898-052062dd30fb?auto=format&fit=crop&q=80&w=1200",
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
      "A vibrant suburb of Erbil known for its lively café culture, restaurants, bars, and churches. It's a popular destination for nightlife, food, and cultural exchange in Kurdistan.",
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
      "https://images.unsplash.com/photo-1518998053401-a41d24dc1c5a?auto=format&fit=crop&q=80&w=1200",
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
      "https://images.unsplash.com/photo-1506514333465-02fc2249e9c3?auto=format&fit=crop&q=80&w=1200",
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
      "A magnificent ancient stone bridge spanning the Khabur River in Zakho. Remarkably well-preserved, Pira Dalal is one of the most iconic historical landmarks in Kurdistan.",
    images: [
      "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1520686665-27a33a39e832?auto=format&fit=crop&q=80&w=1200",
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
      "https://images.unsplash.com/photo-1599824651381-06be5ddfb9ce?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1601243178726-2591605342a7?auto=format&fit=crop&q=80&w=1200",
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
      "https://images.unsplash.com/photo-1533246755452-f1df29606869?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1506514333465-02fc2249e9c3?auto=format&fit=crop&q=80&w=1200",
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
      "One of the most spectacular waterfalls in Iraq, plunging through a dramatic canyon gorge. The towering cliffs make it a top natural attraction in Kurdistan.",
    images: [
      "https://images.unsplash.com/photo-1517409259837-128caff156cd?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1482845622037-ee11ad9ad0e0?auto=format&fit=crop&q=80&w=1200",
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
      "https://images.unsplash.com/photo-1518182170546-076616fdcbaf?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200",
    ],
    rating: 4.6,
  },
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URL;
    if (!mongoUri) {
      throw new Error("MONGO_URL is not defined in your .env file");
    }

    await ConnectsDB(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Count existing places to avoid duplication
    const existingCount = await Place.countDocuments();
    if (existingCount > 0) {
      console.log(
        `⚠️  Found ${existingCount} existing place(s). Clearing before re-seeding...`
      );
      await Place.deleteMany({});
      console.log("🗑️  Cleared existing places.");
    }

    const inserted = await Place.insertMany(kurdistanPlaces);
    console.log(`\n🌱 Seeded ${inserted.length} Kurdistan places successfully!\n`);

    inserted.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} — ${p.location.city} (${p.category})`);
    });

    console.log("\n✅ Seeding complete. You can now test the app with real data.");
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
  }
}

seedDatabase();
