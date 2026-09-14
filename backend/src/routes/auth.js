// routes/auth.js
const express = require("express");
const { body } = require("express-validator");
const { register, login, me } = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

router.post(
  "/register",
  [
    body("name", "Name is required").notEmpty(),
    body("email", "A valid email is required").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    body("role", "Role must be 'client' or 'artisan'").isIn(["client", "artisan"]),
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("email", "A valid email is required").isEmail(),
    body("password", "Password is required").notEmpty(),
  ],
  validate,
  login
);

router.get("/me", requireAuth, me);

module.exports = router;
