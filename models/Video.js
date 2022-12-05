const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const VideoSchema = new Schema(
  {
    createure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },

    Titre: {
      type: String,
      maxlength: 50,
    },
    categorie: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    Validation: {
      type: Boolean,
      default: false,
    },
    durée: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = Video = mongoose.model("Video", VideoSchema);
