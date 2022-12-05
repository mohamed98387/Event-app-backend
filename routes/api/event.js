const express = require("express");
const router = express.Router();
const Events = require("../../models/Event");
const { check, validationResult } = require("express-validator");
const auth = require("../../config/auth");
const User = require("../../models/User");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const Reservation = require("../../models/Reservation");
//save image in node server

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploadsEvent/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    }
    return cb(null, false, new Error("fjzefzfze"));
  },
});

var upload = multer({ storage: storage }).single("file");

router.post("/uploadImage", auth, (req, res) => {
  upload(req, res, (err) => {
    if (err) returnres.json({ success: false, err });
    return res.json({
      success: true,
      image: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});
router.post("/uploadEvent", auth, (req, res) => {
  const events = new Events(req, body);
  events.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});
router.post(
  "/",
  auth,
  [
    check("Type_event", "veuillez saisir votre Type_évènement").not().isEmpty(),
    check("City", "veuillez entrer le nom de votre ville").not().isEmpty(),
    check("Country", "veuillez entrer le nom de votre pays").not().isEmpty(),
    check("Zip_Code", "S'il vous plait, entrer votre code postal")
      .not()
      .isEmpty(),
    check("Titre", "veuillez saisir le titre").not().isEmpty(),
    check("Description", "veuillez saisir la description").not().isEmpty(),
    check("Start_date", "veuillez entrer la date de début").not().isEmpty(),
    check("End_date", "veuillez entrer la date de fin").not().isEmpty(),
    check("EventImage", "veuillez entrer les images").not().isEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    const {
      Type_event,
      City,
      Country,
      Zip_Code,
      Titre,
      Description,
      Start_date,
      EventImage,
      End_date,
      Validation,
    } = req.body;

    event = new Events({
      Type_event,
      City,
      Country,
      Zip_Code,
      Description,
      Validation,
      Start_date,
      EventImage,
      End_date,
      Titre,
      id: uuidv4(),
      User: req.user.id,
    });
    event.save((err) => {
      if (err) {
        if (err.errors.EventImage) {
          res
            .status(400)
            .json([{ sucess: false, message: err.errors.EventImage.message }]);
        }
        if (err.errors.Type_event) {
          res
            .status(400)
            .json([{ sucess: false, message: err.errors.Type_event.message }]);
        } else {
          if (err.errors.City) {
            res
              .status(400)
              .json([{ success: false, message: err.errors.City.message }]);
          } else {
            if (err.errors.Country) {
              res.status(400).json([
                {
                  success: false,
                  message: err.errors.Country.message,
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
                if (err.errors.Titre) {
                  res.status(400).json([
                    {
                      success: false,
                      message: err.errors.Titre.message,
                    },
                  ]);
                } else {
                  res.status(400).json([
                    {
                      success: false,
                      message: "could not save event. Error",
                    },
                  ]);
                }
              }
            }
          }
        }
      } else {
        res.json({ event });
      }
    });
  }
);

//get  events filterd by adherent
//protected route
router.get("/", auth, (req, res) => {
  Events.find({ User: req.user.id })
    .then((Events) => res.json(Events))
    .catch((err) => console.log(err.message));
});
router.get("/events/:id", (req, res) => {
  console.log(req.params.id);
  Events.find({ User: req.params.id })
    .then((Events) => res.json(Events))
    .catch((err) => console.log(err.message));
});
router.get("/id/:id", (req, res) => {
  let order = req.body.order ? req.body.order : "1";
  let sortBy = req.body.sortBy ? req.body.sortBy : "Start_date";

  if (!req.params.id) {
    res.status(400).json({ success: false, msg: "No id Provided" });
  }
  Events.find({ User: req.params.id })
    .populate("User")
    .sort([[sortBy, order]])
    .then((Events) => res.json(Events))
    .catch((err) => console.log(err.message));
});

//get all events

router.get("/all", (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "createdAt";
  Events.find({})
    .sort([[sortBy, order]])
    .populate("User")
    .then((Events) => res.status(200).json(Events))
    .catch((err) => console.log(err.message));
});

router.get("/singleEvent/:id", (req, res) => {
  if (!req.params.id) {
    res.json({ success: false, message: "No event id was provided" });
  } else {
    Events.find({ id: req.params.id.toString() }, (err, event) => {
      if (err) {
        res.json({ sucess: false, message: err });
      } else {
        if (!event) {
          res.json({ sucess: false, message: "Event not found. " });
        } else {
          res.json(event[0]);
        }
      }
    });
  }
});

//update event
router.put(
  "/:id",
  auth,

  [
    check("Zip_Code", "Composé de 4 chiffre")
      .isLength({ min: 4, max: 4 })
      .optional(),
    check("Country", "max 25").isLength({ max: 25 }).optional(),
    check("City", "max 25").isLength({ max: 25 }).optional(),
    check("Titre", "max 25").isLength({ max: 25 }).optional(),
  ],

  (req, res) => {
    const {
      Type_event,
      City,
      Country,
      Zip_Code,
      Titre,
      Description,
      Start_date,
      EventImage,
      End_date,
      Likes,
      DisLikes,
      Sponsor,
    } = req.body;
    let updateEvent = {};

    //build a event object
    if (Type_event) updateEvent.Type_event = Type_event;
    if (City) updateEvent.City = City;
    if (Country) updateEvent.Country = Country;
    if (Zip_Code) updateEvent.Zip_Code = Zip_Code;
    if (Titre) updateEvent.Titre = Titre;
    if (Description) updateEvent.Description = Description;
    if (Start_date) updateEvent.Start_date = Start_date;
    if (EventImage) updateEvent.EventImage = EventImage;
    if (End_date) updateEvent.End_date = End_date;
    if (Likes) updateEvent.Likes = Likes;
    if (DisLikes) updateEvent.DisLikes = DisLikes;
    if (Sponsor) updateEvent.Sponsor = Sponsor;

    Events.findById(req.params.id)
      .then((event) => {
        if (!event) {
          return res.json({ msg: "event not find" });
        } else if (event.User.toString() !== req.user.id) {
          res.json({ msg: "not authorized" });
        } else {
          Events.findByIdAndUpdate(
            req.params.id,
            { $set: updateEvent },
            { useFindAndModify: false },
            (err, data) => {
              res.json({ msg: "event updated" });
            }
          );
        }
      })
      .catch((err) => console.log(err.message));
  }
);

router.put(
  "/validation/:id",
  auth,

  (req, res) => {
    const { Validation } = req.body;
    let updateEvent = {};
    //build a event object
    updateEvent.Validation = Validation;
    Events.findById(req.params.id)
      .then((event) => {
        if (!event) {
          return res.json({ msg: "event not find" });
        } else {
          Events.findByIdAndUpdate(
            req.params.id,
            { $set: updateEvent },
            { useFindAndModify: false },
            (err, data) => {
              res.json({ msg: "event updated" });
            }
          );
        }
      })
      .catch((err) => console.log(err.message));
  }
);

//delete event
//private route
router.delete("/:id", auth, (req, res) => {
  Events.findById(req.params.id)
    .then((event) => {
      if (!event) {
        return res.json({ msg: "event not find" });
      } else if (event.User.toString() !== req.user.id) {
        res.json({ msg: "not authorized" });
      } else {
        Events.findByIdAndDelete(
          req.params.id,

          { useFindAndModify: false },
          (err, data) => {
            res.json({ msg: "event deleted" });
          }
        );
      }
    })
    .catch((err) => console.log(err.message));
});

router.post("/getReservedEvent", auth, (req, res) => {
  Reservation.find({ userId: req.body.userId }).exec((err, reservations) => {
    if (err) {
      return res.status(400).send(err);
    }
    let resdervedUser = [];

    reservations.map((reservation, i) => {
      resdervedUser.push(reservation.eventId);
    });

    Events.find({ _id: { $in: resdervedUser } }).exec((err, events) => {
      if (err) {
        return res.status(400).send(err);
      }
      res.status(200).json({ success: true, events });
    });
  });
});
router.delete("/admin/:id", (req, res) => {
  Events.findById(req.params.id)
    .then((event) => {
      if (!event) {
        return res.json({ msg: "event not find" });
      } else {
        Events.findByIdAndDelete(
          req.params.id,
          { useFindAndModify: false },
          (err, data) => {
            res.json({ msg: "event deleted" });
          }
        );
      }
    })
    .catch((err) => console.log(err.message));
});
router.post("/getMyReservedEvent", auth, (req, res) => {
  Reservation.find({ idCreateure: req.user.id }).exec((err, reservations) => {
    if (err) {
      return res.status(400).send(err);
    }
    let resdervedUser = [];

    reservations.map((reservation, i) => {
      resdervedUser.push(reservation.eventId);
    });

    Events.find({ _id: { $in: resdervedUser } }).exec((err, events) => {
      if (err) {
        return res.status(400).send(err);
      }
      res.status(200).json(events);
    });
  });
});

router.post("/getEvent", (req, res) => {
  let order = req.body.order ? req.body.order : "1";
  let sortBy = req.body.sortBy ? req.body.sortBy : "Start_date";

  let limit = req.body.limit ? parseInt(req.body.limit) : 200;
  let skip = parseInt(req.body.skip);

  let findArgs = {};

  let term = req.body.searchTerm;
  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "Start_date") {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  if (term) {
    Events.find({
      $or: [
        { Titre: new RegExp(term, "i") },
        { City: new RegExp(term, "i") },
        { Country: new RegExp(term, "i") },
      ],
    })

      .populate("User")
      .sort([[sortBy, order]])
      .limit(limit)
      .skip(skip)
      .exec((err, event) => {
        if (err) return res.status(400).json({ success: false }, err);
        res.status(200).json({ success: true, event, postSize: event.length });
      });
  } else {
    Events.find(findArgs)
      .populate("User")
      .sort([[sortBy, order]])
      .limit(limit)
      .skip(skip)
      .exec((err, event) => {
        if (err) return res.status(400).json({ success: false }, err);
        res.status(200).json({ success: true, event, postSize: event.length });
      });
  }
});

router.delete("/delete/:id", auth, (req, res) => {
  Events.find({ User: req.params.id })
    .then((event) => {
      if (!event) {
        return res.json({ msg: "event not find" });
      } else {
        Events.deleteMany({ User: req.params.id }, function (err, result) {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        });
      }
    })
    .catch((err) => console.log(err.message));
});

router.post("/getEventProche", (req, res) => {
  let order = req.body.order ? req.body.order : "1";
  let sortBy = req.body.sortBy ? req.body.sortBy : "Start_date";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};
  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "Start_date") {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      }
    }
  }

  Events.find(findArgs)
    .populate("User")
    .sort([[sortBy, order]])
    .skip(skip)
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, event) => {
      if (err) return res.status(400).json({ success: false }, err);
      res.status(200).json({ success: true, event, postSize: event.length });
    });
});

module.exports = router;
