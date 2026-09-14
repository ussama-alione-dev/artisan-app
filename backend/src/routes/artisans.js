// routes/artisans.js
const express = require("express");
const { body, param } = require("express-validator");
const {
  getAllArtisans,
  getArtisanByUserId,
  upsertOwnProfile,
} = require("../controllers/artisanController");
const { requireAuth, requireRole } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/", getAllArtisans);

router.put(
  "/profile",
  requireAuth,
  requireRole("artisan"),
  [
    body("specialty").optional().trim(),
    body("city").optional().trim(),
    body("phone").optional().trim(),
    body("description").optional().trim(),
    body("hourlyRate", "hourlyRate must be a positive number").optional().isFloat({ min: 0 }),
    body("available", "available must be true or false").optional().isBoolean(),
  ],
  validate,
  upsertOwnProfile
);

router.get(
  "/:userId",
  [param("userId", "Invalid user id").isMongoId()],
  validate,
  getArtisanByUserId
);

module.exports = router;
