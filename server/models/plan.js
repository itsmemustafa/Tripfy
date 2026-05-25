import mongoose from "mongoose";

const dayPlaceSchema = new mongoose.Schema({
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Place",
    required: true,
  },
  order: Number,
  visitTime: String,
  note: String,
});

const daySchema = new mongoose.Schema({
  dayNumber: {
    type: Number,
    required: true,
  },
  date: Date,
  places: [dayPlaceSchema],
});

const planSchema = new mongoose.Schema(
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
    },

    startDate: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    planType: {
      type: String,
      enum: ["leisure", "adventure", "family", "solo", "romantic", "business"],
      default: "leisure",
    },

    days: [daySchema],

    budget: {
      amount: {
        type: Number,
        min: 0,
      },
      currency: {
        type: String,
        enum: ["USD", "EUR", "GBP", "JPY", "CNY"],
        default: "USD",
      },
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    note: String,
  },
  { timestamps: true }
); // <-- This parenthesis was missing

planSchema.virtual('endDate').get(function () {
  const end = new Date(this.startDate);
  end.setDate(end.getDate() + this.duration - 1);
  return end;
});

planSchema.pre('save', function (next) {
  // Only enforce days.length === duration for published plans
  // Draft plans can have empty or incomplete days arrays
  if (this.status === 'published' && this.days.length > 0 && this.days.length !== this.duration) {
    return next(new Error('Number of days must match duration for published plans'));
  }
  next();
});

const Plan = mongoose.model("Plan", planSchema);
export default Plan;