// controllers/demandeController.js — job request (demande) CRUD
const Demande = require("../models/Demande");
const AppError = require("../utils/AppError");

// POST /api/demandes — client creates a job request
exports.createDemande = async (req, res, next) => {
  try {
    const { artisanId, description, address, urgency, desiredDate } = req.body;

    const demande = await Demande.create({
      client: req.user.id,
      artisan: artisanId,
      description,
      address,
      urgency: urgency || "normal",
      desiredDate,
    });

    res.status(201).json({ success: true, demande });
  } catch (err) {
    next(err);
  }
};

// GET /api/demandes — get current user's demandes (as client or artisan)
exports.getMyDemandes = async (req, res, next) => {
  try {
    const filter =
      req.user.role === "client" ? { client: req.user.id } : { artisan: req.user.id };

    const demandes = await Demande.find(filter)
      .populate("client", "name")
      .populate("artisan", "name")
      .sort({ createdAt: -1 });

    const result = demandes.map((d) => ({
      id: d._id,
      clientId: d.client?._id,
      clientName: d.client?.name || "Unknown",
      artisanId: d.artisan?._id,
      artisanName: d.artisan?.name || "Unknown",
      description: d.description,
      address: d.address,
      urgency: d.urgency,
      desiredDate: d.desiredDate,
      status: d.status,
      createdAt: d.createdAt,
    }));

    res.json({ success: true, demandes: result });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/demandes/:id — artisan updates status
exports.updateDemandeStatus = async (req, res, next) => {
  try {
    const demande = await Demande.findById(req.params.id);
    if (!demande) {
      return next(new AppError("Demande not found", 404));
    }

    if (demande.artisan.toString() !== req.user.id) {
      return next(new AppError("Not authorized", 403));
    }

    demande.status = req.body.status;
    await demande.save();

    res.json({ success: true, demande });
  } catch (err) {
    next(err);
  }
};
