const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    createureId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = Message = mongoose.model("Message", MessageSchema);
