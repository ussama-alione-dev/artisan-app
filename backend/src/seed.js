// seed.js — Loads demo users and artisan profiles into the in-memory store on startup
const bcrypt = require('bcryptjs');
const { createUser, upsertArtisan } = require('./store');

async function seed() {
  const hash = await bcrypt.hash('password123', 10);

  // --- Demo client ---
  const client = createUser({
    name: 'Thomas Dubois',
    email: 'client@demo.fr',
    password: hash,
    role: 'client',
  });

  // --- Demo artisans ---
  const artisansData = [
    {
      name: 'Alexandre Martin',
      email: 'plombier@demo.fr',
      specialty: 'Plomberie',
      city: 'Paris',
      phone: '06 11 22 33 44',
      description: 'Expert plombier avec 15 ans d\'expérience. Dépannage rapide, fuite, robinetterie.',
      hourlyRate: 65,
      available: true,
    },
    {
      name: 'Sophie Leclerc',
      email: 'elec@demo.fr',
      specialty: 'Électricité',
      city: 'Lyon',
      phone: '06 55 44 33 22',
      description: 'Électricienne certifiée. Mise aux normes, tableau électrique, domotique.',
      hourlyRate: 70,
      available: true,
    },
    {
      name: 'Marc Dupont',
      email: 'serrurier@demo.fr',
      specialty: 'Serrurerie',
      city: 'Paris',
      phone: '06 77 88 99 00',
      description: 'Serrurier 24h/24. Ouverture de porte, remplacement de serrure, blindage.',
      hourlyRate: 80,
      available: false,
    },
    {
      name: 'Isabelle Rousseau',
      email: 'clim@demo.fr',
      specialty: 'Climatisation',
      city: 'Marseille',
      phone: '06 12 34 56 78',
      description: 'Installation et entretien de climatiseurs toutes marques. Devis gratuit.',
      hourlyRate: 75,
      available: true,
    },
    {
      name: 'Pierre Moreau',
      email: 'peintre@demo.fr',
      specialty: 'Peinture',
      city: 'Bordeaux',
      phone: '06 98 76 54 32',
      description: 'Peintre en bâtiment. Intérieur, extérieur, décoration, enduits.',
      hourlyRate: 50,
      available: true,
    },
    {
      name: 'Nathalie Bernard',
      email: 'menuisier@demo.fr',
      specialty: 'Menuiserie',
      city: 'Nantes',
      phone: '06 45 67 89 01',
      description: 'Menuisière artisanale. Pose de parquet, fenêtres, portes, sur mesure.',
      hourlyRate: 60,
      available: true,
    },
  ];

  for (const data of artisansData) {
    const { name, email, specialty, city, phone, description, hourlyRate, available } = data;
    const user = createUser({ name, email, password: hash, role: 'artisan' });
    upsertArtisan(user.id, { specialty, city, phone, description, hourlyRate, available });
  }

  console.log(`✅ Seeded ${artisansData.length} artisans + 1 demo client`);
  console.log('   Client:  client@demo.fr / password123');
  console.log('   Artisan: plombier@demo.fr / password123');
}

module.exports = seed;
