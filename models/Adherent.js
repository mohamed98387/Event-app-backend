const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

let GouvernoratLengthCheker = (Gouvernorat) => {
  if (!Gouvernorat) {
    return false;
  } else {
    if (Gouvernorat.length > 25) {
      return false;
    } else return true;
  }
};

let countryLengthCheker = (Country) => {
  if (!Country) {
    return false;
  } else {
    if (Country.length > 25) {
      return false;
    } else return true;
  }
};

let ZipCodeCheker = (Zip_Code) => {
  if (!Zip_Code) {
    return false;
  } else {
    if (Zip_Code.toString().length !== 4) {
      return false;
    } else return true;
  }
};
let PhoneCheker = (Phone) => {
  if (!Phone) {
    return false;
  } else {
    if (Phone.toString().length !== 8) {
      return false;
    } else return true;
  }
};

const GouvernoratValidators = [
  {
    validator: GouvernoratLengthCheker,
    message: "Les caractères limités sont 25",
  },
];

const countryValidators = [
  {
    validator: countryLengthCheker,
    message: "Les caractères limités sont 25",
  },
];
const Zip_CodeValidators = [
  {
    validator: ZipCodeCheker,
    message: "Veuillez entrer un code postal valide",
  },
];
const PhoneValidators = [
  {
    validator: PhoneCheker,
    message: "S'il vous plaît entrer un numéro de téléphone valide",
  },
];

// Create Schema

var UserSchema = Schema({
  Gouvernorat: {
    type: String,
    required: true,
    validate: GouvernoratValidators,
  },
  Ville: {
    type: String,
    required: true,
    validate: countryValidators,
  },
  Zip_Code: {
    type: Number,
    required: true,
    validate: Zip_CodeValidators,
  },
  Phone: {
    type: Number,
    required: true,
    validate: PhoneValidators,
  },
  Age: {
    type: String,
    required: true,
  },
  aPropos: {
    type: String,
  },
  userImage: {
    type: String,
    required: true,
  },
  nbr_events: {
    type: Number,
    default: 0,
  },
  registred: {
    type: Boolean,
    default: false,
  },

  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },

  upadated_at: {
    type: Date,
    default: Date.now,
  },
});
module.exports = Adherent = mongoose.model("Adherent", UserSchema);
