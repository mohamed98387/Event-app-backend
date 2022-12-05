const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followres = Schema(
  {
    idCreateure: {
      type: String,
    },
    userId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = Followres = mongoose.model("Followres", followres);
