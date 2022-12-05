const express = require("express");
const router = express.Router();

const Followres = require("../../models/Followers");

const auth = require("../../config/auth");

router.post("/FollowresNumber", auth, (req, res) => {
  Followres.find({ idCreateure: req.body.idCreateure }).exec(
    (err, followres) => {
      if (err) return res.status(400).send(err);
      res
        .status(200)
        .json({ success: true, followresNumber: followres.length });
    }
  );
});

router.post("/followed", (req, res) => {
  Followres.find({
    idCreateure: req.body.idCreateure,
    userId: req.body.userId,
  }).exec((err, followres) => {
    if (err) return res.status(400).send(err);

    let result = false;
    if (followres.length !== 0) {
      result = true;
    }

    res.status(200).json({ success: true, followres: result });
  });
});

router.post("/followUser", (req, res) => {
  const follow = new Followres(req.body);
  follow.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.post("/unFollow", (req, res) => {
  Followres.findOneAndDelete({
    idCreateure: req.body.idCreateure,
    userId: req.body.userId,
  }).exec((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, doc });
  });
});
router.get("/", auth, (req, res) => {
  Reservation.find({ idCreateure: req.user.id })
    .then((reservation) => res.json(reservation))
    .catch((err) => console.log(err.message));
});
module.exports = router;
