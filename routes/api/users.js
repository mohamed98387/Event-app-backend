const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model

const { check, validationResult } = require("express-validator");
const auth = require("../../config/auth");
const User = require("../../models/User");
//get the Loged In user
// private route
router.get("/", auth, (req, res) => {
  User.findById(req.user.id)
    .then((user) => res.json(user))
    .catch((err) => console.log(err));
});

router.get("/all", (req, res) => {
  User.find({})
    .then((user) => res.json(user))
    .catch((err) => console.log(err.message));
});

router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then((user) => {
    User.findOne({ userName: req.body.userName }).then((userName) => {
      if (userName) {
        return res
          .status(400)
          .json({ userName: "Nom d'utilisateur est déjà existe " });
      }
    });

    if (user) {
      return res.status(400).json({ email: "Email est  déjà existé" });
    } else {
      const newUser = new User({
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save(err)
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email non trouvé" });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
          },
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Mot de passe incorrect" });
      }
    });
  });
});

//update
router.put(
  "/:id",
  auth,

  [
    check("email", "Email est invalide").isEmail().optional(),
    check("password", " Au moins de 6 caractères")
      .isLength({
        min: 6,
      })
      .optional(),
  ],

  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const { userName, firstName, lastName, email, password } = req.body;
    let updateUser = {};

    //build a user object
    if (userName) updateUser.userName = userName;
    if (firstName) updateUser.firstName = firstName;
    if (lastName) updateUser.lastName = lastName;
    if (email) updateUser.email = email;
    if (password) {
      updateUser.password = password;
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(updateUser.password, salt, (err, hash) => {
          if (err) throw err;
          updateUser.password = hash;
        });
      });
    }

    User.findOne({ email: req.body.email }).then((eamilUser) => {
      if (eamilUser) {
        if (eamilUser._id.toString() !== req.params.id) {
          return res.status(400).json([{ email: "Email est déjà existe" }]);
        } else {
          User.findOne({ userName: req.body.userName }).then((userName) => {
            User.findById(req.params.id).then((user) => {
              if (userName) {
                if (userName._id.toString() !== req.params.id) {
                  return res
                    .status(400)
                    .json([{ userName: "Nom d'utilisateur est déjà existe" }]);
                } else if (!user) {
                  return res.status(400).json({ msg: "user not find" });
                } else if (user._id.toString() !== req.user.id) {
                  res.json({ msg: "not authorized" });
                } else {
                  User.findByIdAndUpdate(
                    req.params.id,
                    { $set: updateUser },
                    { useFindAndModify: false },
                    (err, data) => {
                      res.json(data);
                    }
                  );
                }
              } else if (!user) {
                return res.status(400).json({ msg: "user not find" });
              } else if (user._id.toString() !== req.user.id) {
                res.json({ msg: "not authorized" });
              } else {
                User.findByIdAndUpdate(
                  req.params.id,
                  { $set: updateUser },
                  { useFindAndModify: false },
                  (err, data) => {
                    res.json(data);
                  }
                );
              }
            });
          });
        }
      } else if (!eamilUser) {
        User.findOne({ userName: req.body.userName }).then((userName) => {
          User.findById(req.params.id).then((user) => {
            if (userName) {
              if (userName._id.toString() !== req.params.id) {
                return res
                  .status(400)
                  .json([{ userName: "Nom d'utilisateur est déjà existe" }]);
              } else if (!user) {
                return res.status(400).json({ msg: "user not find" });
              } else if (user._id.toString() !== req.user.id) {
                res.json({ msg: "not authorized" });
              } else {
                User.findByIdAndUpdate(
                  req.params.id,
                  { $set: updateUser },
                  { useFindAndModify: false },
                  (err, data) => {
                    res.json(data);
                  }
                );
              }
            } else if (!user) {
              return res.status(400).json({ msg: "user not find" });
            } else if (user._id.toString() !== req.user.id) {
              res.json({ msg: "not authorized" });
            } else {
              User.findByIdAndUpdate(
                req.params.id,
                { $set: updateUser },
                { useFindAndModify: false },
                (err, data) => {
                  res.json(data);
                }
              );
            }
          });
        });
      }
    });
  }
);
router.delete("/deleteUser/:id", auth, (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.json({ msg: " user not find" });
      } else {
        User.findByIdAndDelete(
          req.params.id,
          { useFindAndModify: false },
          (err, data) => {
            res.json({ msg: "user deleted" });
          }
        );
      }
    })
    .catch((err) => console.log(err.message));
});

module.exports = router;
