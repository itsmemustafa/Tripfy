const mongoose = require("mongoose");

const plannerSchema = new mongoose.Schema(
  { 
    planTitle: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    planType: {
      type: String,
      enum: [
        "leisure",
        "business",
        "adventure",
        "family",
        "solo",
        "romantic",
        "other",
      ],
      default: "leisure",
    },
    startDate: {
      type: Date,
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
    places: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place",
      },
    ],
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Plan", plannerSchema);
