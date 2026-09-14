// seed.js — loads demo users and artisan profiles into MongoDB
// run with: npm run seed
require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Artisan = require("./models/Artisan");

const artisansData = [
  {
    name: "Alexandre Martin",
    email: "plombier@demo.fr",
    specialty: "Plomberie",
    city: "Paris",
    phone: "06 11 22 33 44",
    description: "Expert plombier avec 15 ans d'experience. Depannage rapide, fuite, robinetterie.",
    hourlyRate: 65,
    available: true,
  },
  {
    name: "Sophie Leclerc",
    email: "elec@demo.fr",
    specialty: "Electricite",
    city: "Lyon",
    phone: "06 55 44 33 22",
    description: "Electricienne certifiee. Mise aux normes, tableau electrique, domotique.",
    hourlyRate: 70,
    available: true,
  },
  {
    name: "Marc Dupont",
    email: "serrurier@demo.fr",
    specialty: "Serrurerie",
    city: "Paris",
    phone: "06 77 88 99 00",
    description: "Serrurier 24h/24. Ouverture de porte, remplacement de serrure, blindage.",
    hourlyRate: 80,
    available: false,
  },
  {
    name: "Isabelle Rousseau",
    email: "clim@demo.fr",
    specialty: "Climatisation",
    city: "Marseille",
    phone: "06 12 34 56 78",
    description: "Installation et entretien de climatiseurs toutes marques. Devis gratuit.",
    hourlyRate: 75,
    available: true,
  },
  {
    name: "Pierre Moreau",
    email: "peintre@demo.fr",
    specialty: "Peinture",
    city: "Bordeaux",
    phone: "06 98 76 54 32",
    description: "Peintre en batiment. Interieur, exterieur, decoration, enduits.",
    hourlyRate: 50,
    available: true,
  },
  {
    name: "Nathalie Bernard",
    email: "menuisier@demo.fr",
    specialty: "Menuiserie",
    city: "Nantes",
    phone: "06 45 67 89 01",
    description: "Menuisiere artisanale. Pose de parquet, fenetres, portes, sur mesure.",
    hourlyRate: 60,
    available: true,
  },
];

async function seed() {
  const hash = await bcrypt.hash("password123", 10);

  // wipe existing demo data
  await User.deleteMany({});
  await Artisan.deleteMany({});

  // demo client
  await User.create({
    name: "Thomas Dubois",
    email: "client@demo.fr",
    password: hash,
    role: "client",
  });

  // demo artisans
  for (const data of artisansData) {
    const { name, email, specialty, city, phone, description, hourlyRate, available } = data;
    const user = await User.create({ name, email, password: hash, role: "artisan" });
    await Artisan.create({ user: user._id, specialty, city, phone, description, hourlyRate, available });
  }

  console.log(`Seeded ${artisansData.length} artisans + 1 demo client`);
  console.log("Client:  client@demo.fr / password123");
  console.log("Artisan: plombier@demo.fr / password123");
}

// allow running standalone: node src/seed.js / npm run seed
if (require.main === module) {
  connectDB()
    .then(seed)
    .then(() => mongoose.connection.close())
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seed;
