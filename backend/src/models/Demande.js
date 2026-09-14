// models/Demande.js — a job request sent by a client to an artisan
const mongoose = require("mongoose");

const demandeSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    urgency: {
      type: String,
      enum: ["low", "normal", "high"],
      default: "normal",
    },
    desiredDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "refused", "done"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Demande", demandeSchema);
