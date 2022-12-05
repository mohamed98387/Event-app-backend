const express = require("express");
const router = express.Router();
const Adherent = require("../../models/Adherent");
const { check, validationResult } = require("express-validator");
const auth = require("../../config/auth");
const multer = require("multer");
//save image in node server

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    }
    return cb(null, false, new Error("can not save image"));
  },
});

var upload = multer({ storage: storage }).single("file");

router.post("/uploadImage", auth, (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.json({ success: false, err });
    return res.json({
      success: true,
      image: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

// Register adherant
// protected route
router.post(
  "/",
  auth,
  [
    check("Gouvernorat", "Veuillez entrer votre Gouvernorat").not().isEmpty(),
    check("Ville", "Veuillez entrer votre ville").not().isEmpty(),
    check("Zip_Code", "S'il vous plait, entrer votre code postal")
      .not()
      .isEmpty(),
    check("userImage", "Veuillez enter votre image d'utilisateur")
      .not()
      .isEmpty(),
    check("Phone", "Veuillez entrer votre numéro de téléphone").isMobilePhone(),
    check("Age", "Veuillez entrer votre âge").not().isEmpty(),
  ],
  (req, res, next) => {
    // console.log(req.file);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    const {
      Gouvernorat,
      Ville,
      Zip_Code,
      Phone,
      userImage,
      Age,
      aPropos,
    } = req.body;

    adherent = new Adherent({
      Gouvernorat,
      Ville,
      Zip_Code,
      Phone,
      userImage,
      Age,
      aPropos,
      registred: true,
      User: req.user.id,
    });
    // Sign token

    adherent.save((err) => {
      if (err) {
        if (err.errors.Gouvernorat) {
          res.status(400).json([
            {
              sucess: false,
              message: err.errors.Gouvernorat.message,
            },
          ]);
        } else {
          if (err.errors.Ville) {
            res.status(400).json([
              {
                success: false,
                message: err.errors.Ville.message,
              },
            ]);
          } else {
            if (err.errors.Zip_Code) {
              res.status(400).json([
                {
                  success: false,
                  message: err.errors.Zip_Code.message,
                },
              ]);
            } else {
              if (err.errors.Phone) {
                res.status(400).json([
                  {
                    success: false,
                    message: err.errors.Phone.message,
                  },
                ]);
              }
            }
          }
        }
      } else {
        res.json({
          adherent,
        });
      }
    });
  }
);

//get adhearnt logged in
//protected route
router.get("/", auth, (req, res) => {
  Adherent.find({ User: req.user.id })
    .populate("User")
    .then((adherant) => res.json(adherant[0]))
    .catch((err) => console.log(err.message));
});

router.get("/all", (req, res) => {
  Adherent.find({})
    .then((adherant) => res.json(adherant))
    .catch((err) => console.log(err.message));
});

//update adhearnt
router.put(
  "/:id",
  auth,

  [
    check("Zip_Code", "Composé de 4 chiffre")
      .isLength({ min: 4, max: 4 })
      .optional(),
    check("Phone", "Composé de 8 chiffre")
      .isMobilePhone()
      .isLength({ min: 8, max: 8 })
      .optional(),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    const {
      Gouvernorat,
      Ville,
      Zip_Code,
      Phone,
      userImage,
      Age,
      nbr_events,
      aPropos,
    } = req.body;
    let updateUser = {};

    //build a user object
    if (Gouvernorat) updateUser.Gouvernorat = Gouvernorat;
    if (Ville) updateUser.Ville = Ville;
    if (Zip_Code) updateUser.Zip_Code = Zip_Code;
    if (Phone) updateUser.Phone = Phone;
    if (userImage) updateUser.userImage = userImage;
    if (Age) updateUser.Age = Age;
    if (nbr_events) updateUser.nbr_events = nbr_events;
    if (aPropos) updateUser.aPropos = aPropos;
    Adherent.findById(req.params.id)
      .then((user) => {
        if (!user) {
          return res.json({ msg: "user not find" });
        } else if (user.User.toString() !== req.user.id) {
          res.json({ msg: "not authorized" });
        } else {
          Adherent.findByIdAndUpdate(
            req.params.id,
            { $set: updateUser },
            { useFindAndModify: false },
            (err, data) => {
              res.json({ msg: "user updated" });
            }
          );
        }
      })
      .catch((err) => console.log(err.message));
  }
);
router.get("/allCreateures", (req, res) => {
  Adherent.find({})
    .populate("User")
    .then((adherant) => res.json(adherant))
    .catch((err) => console.log(err.message));
});
router.get("/:id", (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ success: false, msg: "No id Provided" });
  }
  Adherent.find({ User: req.params.id })
    .populate("User")
    .then((adherant) => res.json(adherant[0]))
    .catch((err) => console.log(err.message));
});
router.post("/getFilterAdh", (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "nbr_events";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);

  Adherent.find()
    .populate("User")
    .sort([[sortBy, order]])
    .skip(skip)
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, adherant) => {
      if (err) return res.status(400).json({ success: false }, err);
      res
        .status(200)
        .json({ success: true, adherant, postSize: adherant.length });
    });
});
router.post("/deleteUser/:id", auth, (req, res) => {
  Adherent.find({ User: req.params.id })
    .then((user) => {
      if (!user) {
        return res.json({ msg: " user not find" });
      } else {
        Adherent.deleteOne({ User: req.params.id }, (err, data) => {
          res.json({ msg: "user deleted" });
        });
      }
    })
    .catch((err) => console.log(err.message));
});
module.exports = router;
