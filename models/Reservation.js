const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReservationSchema = mongoose.Schema(
  {
    eventId: {
      type: String,
    },
    userId: {
      type: String,
    },
    idCreateure: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = Reservation = mongoose.model("Reservation", ReservationSchema);
