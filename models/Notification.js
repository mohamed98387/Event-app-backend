const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = mongoose.Schema(
  {
    Titre: {
      type: String,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    text: {
      type: String,
    },
    to: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = Notification = mongoose.model(
  "Notification",
  NotificationSchema
);
