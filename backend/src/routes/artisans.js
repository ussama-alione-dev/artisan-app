// routes/artisans.js — Artisan profile CRUD + search
const express = require('express');
const { getAllArtisans, findArtisanByUserId, upsertArtisan, findUserById } = require('../store');
const { requireAuth } = require('../middleware');

const router = express.Router();

// GET /api/artisans?specialty=&city=&available=
router.get('/', (req, res) => {
  const { specialty, city, available } = req.query;

  let results = getAllArtisans();

  if (specialty) {
    results = results.filter(a => a.specialty?.toLowerCase() === specialty.toLowerCase());
  }
  if (city) {
    results = results.filter(a => a.city?.toLowerCase().includes(city.toLowerCase()));
  }
  if (available === 'true') {
    results = results.filter(a => a.available === true);
  }

  // Attach user name to each artisan
  const withNames = results.map(a => {
    const user = findUserById(a.userId);
    return { ...a, name: user?.name || 'Unknown' };
  });

  res.json(withNames);
});

// GET /api/artisans/:id
router.get('/:id', (req, res) => {
  const artisan = findArtisanByUserId(req.params.id);
  if (!artisan) return res.status(404).json({ error: 'Artisan not found' });

  const user = findUserById(artisan.userId);
  res.json({ ...artisan, name: user?.name || 'Unknown' });
});

// PUT /api/artisans/profile — update own artisan profile
router.put('/profile', requireAuth, (req, res) => {
  if (req.user.role !== 'artisan') {
    return res.status(403).json({ error: 'Only artisans can update a profile' });
  }

  const { specialty, city, phone, description, hourlyRate, available } = req.body;
  const updated = upsertArtisan(req.user.id, { specialty, city, phone, description, hourlyRate, available });
  res.json(updated);
});

module.exports = router;
