const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "CommentVideo",
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Events",
    },
  },
  { timestamps: true }
);

module.exports = Like = mongoose.model("Like", likeSchema);
