const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//validate inputs

let cityLengthCheker = (City) => {
  if (!City) {
    return false;
  } else {
    if (City.length > 25) {
      return false;
    } else return true;
  }
};

const cityValidators = [
  {
    validator: cityLengthCheker,
    message: "la ville ne doit contenir plus 25 caractères",
  },
];
let TitreLengthCheker = (Titre) => {
  if (!Titre) {
    return false;
  } else {
    if (Titre.length > 25) {
      return false;
    } else return true;
  }
};

const TitreValidator = [
  {
    validator: TitreLengthCheker,
    message: "L'événement titre ne doit plus avoir 25 caractères",
  },
];

let DescriptionLengthCheker = (Description) => {
  if (!Description) {
    return false;
  } else {
    if (Description.length > 5000) {
      return false;
    } else return true;
  }
};

const DescriptionValidator = [
  {
    validator: DescriptionLengthCheker,
    message: "La description ne doit pas plus de 5000",
  },
];
let countryLengthCheker = (Country) => {
  if (!Country) {
    return false;
  } else {
    if (Country.length > 25) {
      return false;
    } else return true;
  }
};

const countryValidators = [
  {
    validator: countryLengthCheker,
    message: "Le pays ne doit pas contenir plus de 25 caractères",
  },
];

let ZipCodeCheker = (Zip_Code) => {
  if (!Zip_Code) {
    return false;
  } else {
    if (Zip_Code.toString().length !== 4) {
      return false;
    } else return true;
  }
};
const Zip_CodeValidators = [
  {
    validator: ZipCodeCheker,
    message: "Veuillez entrer un code postal valide = 4 chiffres //",
  },
];

// Create Schema
const EventSchema = Schema(
  {
    Type_event: {
      type: Number,
      default: 1,
      required: true,
    },

    City: {
      type: String,
      required: true,
      validate: cityValidators,
    },
    Country: {
      type: String,
      required: true,
      validate: countryValidators,
    },
    Titre: {
      type: String,
      required: true,
      validate: TitreValidator,
    },

    EventImage: {
      type: Array,
      default: [],
    },

    Description: {
      type: String,
      required: true,
      validate: DescriptionValidator,
    },
    id: {
      type: String,
    },
    Zip_Code: {
      type: Number,
      required: true,
      validate: Zip_CodeValidators,
    },

    Start_date: {
      type: Number,
      default: Date.now,
      required: true,
    },
    Validation: {
      type: Boolean,
      default: false,
    },
    End_date: {
      type: Number,
      default: Date.now,
      required: true,
    },
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = Events = mongoose.model("Events", EventSchema);
