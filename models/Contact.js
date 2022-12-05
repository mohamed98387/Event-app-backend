const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let namevalid = (name) => {
  if (!name) {
    return false;
  } else {
    if (name.length > 25) {
      return false;
    } else return true;
  }
};
const nameValidators = [
  {
    validator: namevalid,
    message: "le nom ne doit contenir plus 25 caractères",
  },
];
// Create Schema
const ContactSchema = new Schema({
  name: {
    type: String,
    validate: nameValidators,
  },
  email: {
    type: String,
    required: true,
  },
  sujet: {
    type: String,
  },

  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = Contact = mongoose.model("Contact", ContactSchema);
