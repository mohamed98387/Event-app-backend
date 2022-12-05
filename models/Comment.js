const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },

    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Events",
    },
  
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = Comment = mongoose.model("Comment", commentSchema);
