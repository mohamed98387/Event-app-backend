const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentVideoSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    reponseA: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    Text: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = CommentVideo = mongoose.model(
  "CommentVideo",
  commentVideoSchema
);
