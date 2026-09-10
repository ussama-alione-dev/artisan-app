// store.js — In-memory data store (no database needed)
// All data lives here as plain JS Maps. Seeded on startup.

const { v4: uuid } = require('uuid');

const users = new Map();       // userId -> user object
const artisans = new Map();    // userId -> artisan profile object
const demandes = new Map();    // demandeId -> demande object
const messages = new Map();    // roomId -> [message, ...]

// ---------- USER helpers ----------

function createUser(data) {
  const id = uuid();
  const user = { id, ...data, createdAt: new Date().toISOString() };
  users.set(id, user);
  return user;
}

function findUserByEmail(email) {
  for (const u of users.values()) {
    if (u.email === email) return u;
  }
  return null;
}

function findUserById(id) {
  return users.get(id) || null;
}

// ---------- ARTISAN helpers ----------

function upsertArtisan(userId, data) {
  const existing = artisans.get(userId) || {};
  const updated = { userId, ...existing, ...data };
  artisans.set(userId, updated);
  return updated;
}

function findArtisanByUserId(userId) {
  return artisans.get(userId) || null;
}

function getAllArtisans() {
  return [...artisans.values()];
}

// ---------- DEMANDE helpers ----------

function createDemande(data) {
  const id = uuid();
  const demande = { id, status: 'pending', createdAt: new Date().toISOString(), ...data };
  demandes.set(id, demande);
  return demande;
}

function findDemandeById(id) {
  return demandes.get(id) || null;
}

function updateDemande(id, patch) {
  const demande = demandes.get(id);
  if (!demande) return null;
  const updated = { ...demande, ...patch };
  demandes.set(id, updated);
  return updated;
}

function getDemandesByClient(clientId) {
  return [...demandes.values()].filter(d => d.clientId === clientId);
}

function getDemandesByArtisan(artisanId) {
  return [...demandes.values()].filter(d => d.artisanId === artisanId);
}

// ---------- MESSAGE helpers ----------

function addMessage(roomId, msg) {
  const list = messages.get(roomId) || [];
  const message = { id: uuid(), roomId, ...msg, createdAt: new Date().toISOString() };
  list.push(message);
  messages.set(roomId, list);
  return message;
}

function getMessages(roomId) {
  return messages.get(roomId) || [];
}

module.exports = {
  createUser, findUserByEmail, findUserById,
  upsertArtisan, findArtisanByUserId, getAllArtisans,
  createDemande, findDemandeById, updateDemande, getDemandesByClient, getDemandesByArtisan,
  addMessage, getMessages,
};
