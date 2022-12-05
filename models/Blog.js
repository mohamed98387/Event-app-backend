const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const BlogSchema = new Schema(
  {
    Titre: {
      type: String,
    },
    filePath: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = Blog = mongoose.model("Blog", BlogSchema);
