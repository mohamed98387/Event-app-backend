const express = require("express");
const router = express.Router();

const Reservation = require("../../models/Reservation");

const auth = require("../../config/auth");

router.post("/reservationNumber", auth, (req, res) => {
  Reservation.find({ eventId: req.body.eventId }).exec((err, reservation) => {
    if (err) return res.status(400).send(err);
    res
      .status(200)
      .json({ success: true, reservationNumber: reservation.length });
  });
});

router.post("/reserved", (req, res) => {
  Reservation.find({
    eventId: req.body.eventId,
    userId: req.body.userId,
  }).exec((err, reservation) => {
    if (err) return res.status(400).send(err);

    let result = false;
    if (reservation.length !== 0) {
      result = true;
    }

    res.status(200).json({ success: true, reservation: result });
  });
});

router.post("/reserve", (req, res) => {
  const reserve = new Reservation(req.body);
  reserve.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.post("/unReserve", (req, res) => {
  Reservation.findOneAndDelete({
    eventId: req.body.eventId,
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
