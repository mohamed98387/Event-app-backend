const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateRegisterInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.userName = !isEmpty(data.userName) ? data.userName : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  //userName cheks
  if (Validator.isEmpty(data.userName)) {
    errors.userName = "Le champ du username est obligatoire";
  }
  // firstName checks
  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = "Le champ du prénom est obligatoire";
  } // lastName checks
  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = "Le champ du nom est obligatoire";
  }
  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Le champ du email est obligatoire";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email est invalide";
  }
  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Le champ du mot de passe est obligatoire";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Le champ confirme mot de passe est obligatoire";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Le mot de passe doit être au moins de 6 caractères";
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "les mots de passe doivent correspondre";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
