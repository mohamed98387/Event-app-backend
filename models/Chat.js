const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ChatSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  Room: {
    type: String,
    required: true,
  },
  text: {
    type: String,
  },
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },

  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = Chat = mongoose.model("Chat", ChatSchema);
