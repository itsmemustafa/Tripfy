import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    trim: true,
  },
  coordinates: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
});

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subcategory: {
      type: String,
      trim: true,
    },
    location: {
      type: locationSchema,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.every((url) => /^https?:\/\/.+/i.test(url));
        },
        message: "Each image must be a valid URL.",
      },
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true, collection: 'Place' }
);
const Place = mongoose.model("Place", placeSchema);

export default Place;
