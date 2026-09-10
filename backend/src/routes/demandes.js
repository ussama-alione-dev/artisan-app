// routes/demandes.js — Job request (demande) CRUD
const express = require('express');
const {
  createDemande, findDemandeById, updateDemande,
  getDemandesByClient, getDemandesByArtisan, findUserById, findArtisanByUserId,
} = require('../store');
const { requireAuth } = require('../middleware');

const router = express.Router();

// POST /api/demandes — client creates a job request
router.post('/', requireAuth, (req, res) => {
  if (req.user.role !== 'client') {
    return res.status(403).json({ error: 'Only clients can create demandes' });
  }

  const { artisanId, description, address, urgency, desiredDate } = req.body;

  if (!artisanId || !description) {
    return res.status(400).json({ error: 'artisanId and description are required' });
  }

  const demande = createDemande({
    clientId: req.user.id,
    artisanId,
    description,
    address,
    urgency: urgency || 'normal',
    desiredDate,
  });

  res.status(201).json(demande);
});

// GET /api/demandes — get current user's demandes
router.get('/', requireAuth, (req, res) => {
  let demandes;

  if (req.user.role === 'client') {
    demandes = getDemandesByClient(req.user.id);
  } else if (req.user.role === 'artisan') {
    demandes = getDemandesByArtisan(req.user.id);
  } else {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Enrich with names
  const enriched = demandes.map(d => {
    const client = findUserById(d.clientId);
    const artisanUser = findUserById(d.artisanId);
    return {
      ...d,
      clientName: client?.name || 'Unknown',
      artisanName: artisanUser?.name || 'Unknown',
    };
  });

  res.json(enriched);
});

// PATCH /api/demandes/:id — artisan updates status
router.patch('/:id', requireAuth, (req, res) => {
  const demande = findDemandeById(req.params.id);
  if (!demande) return res.status(404).json({ error: 'Demande not found' });

  if (req.user.role !== 'artisan' || demande.artisanId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const { status } = req.body;
  const allowed = ['pending', 'accepted', 'refused', 'done'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${allowed.join(', ')}` });
  }

  const updated = updateDemande(req.params.id, { status });
  res.json(updated);
});

module.exports = router;
