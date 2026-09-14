// controllers/artisanController.js — artisan profile CRUD + search
const Artisan = require("../models/Artisan");
const AppError = require("../utils/AppError");

function formatArtisan(a) {
  return {
    id: a._id,
    userId: a.user?._id,
    name: a.user?.name || "Unknown",
    email: a.user?.email,
    specialty: a.specialty,
    city: a.city,
    phone: a.phone,
    description: a.description,
    hourlyRate: a.hourlyRate,
    available: a.available,
    createdAt: a.createdAt,
  };
}

// GET /api/artisans?specialty=&city=&available=
exports.getAllArtisans = async (req, res, next) => {
  try {
    const { specialty, city, available } = req.query;
    const filter = {};

    if (specialty) filter.specialty = new RegExp(`^${specialty}$`, "i");
    if (city) filter.city = new RegExp(city, "i");
    if (available === "true") filter.available = true;

    const artisans = await Artisan.find(filter).populate("user", "name email");

    res.json({ success: true, artisans: artisans.map(formatArtisan) });
  } catch (err) {
    next(err);
  }
};

// GET /api/artisans/:userId
exports.getArtisanByUserId = async (req, res, next) => {
  try {
    const artisan = await Artisan.findOne({ user: req.params.userId }).populate(
      "user",
      "name email"
    );

    if (!artisan) {
      return next(new AppError("Artisan not found", 404));
    }

    res.json({ success: true, artisan: formatArtisan(artisan) });
  } catch (err) {
    next(err);
  }
};

// PUT /api/artisans/profile — create or update own artisan profile
exports.upsertOwnProfile = async (req, res, next) => {
  try {
    const { specialty, city, phone, description, hourlyRate, available } = req.body;

    const updated = await Artisan.findOneAndUpdate(
      { user: req.user.id },
      { specialty, city, phone, description, hourlyRate, available },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).populate("user", "name email");

    res.json({ success: true, artisan: formatArtisan(updated) });
  } catch (err) {
    next(err);
  }
};
