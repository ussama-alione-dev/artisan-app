// routes/demandes.js
const express = require("express");
const { body, param } = require("express-validator");
const {
  createDemande,
  getMyDemandes,
  updateDemandeStatus,
} = require("../controllers/demandeController");
const { requireAuth, requireRole } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireRole("client"),
  [
    body("artisanId", "artisanId is required").isMongoId(),
    body("description", "description is required").notEmpty(),
    body("address").optional().trim(),
    body("urgency", "urgency must be low, normal or high").optional().isIn(["low", "normal", "high"]),
    body("desiredDate").optional().isISO8601(),
  ],
  validate,
  createDemande
);

router.get("/", requireAuth, getMyDemandes);

router.patch(
  "/:id",
  requireAuth,
  requireRole("artisan"),
  [
    param("id", "Invalid demande id").isMongoId(),
    body("status", "status must be pending, accepted, refused or done").isIn([
      "pending",
      "accepted",
      "refused",
      "done",
    ]),
  ],
  validate,
  updateDemandeStatus
);

module.exports = router;
