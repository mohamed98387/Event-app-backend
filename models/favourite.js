const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteSchema = mongoose.Schema(
  {
    userId: {
      type: String,
    },
    eventId: {
      type: String,
    },
    eventTitle: {
      type: String,
    },
    eventImage: {
      type: Array,
    },
    startDate: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = Favorite = mongoose.model("Favorite", favoriteSchema);
