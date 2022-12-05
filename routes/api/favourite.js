const express = require("express");
const router = express.Router();

const Favorite = require("../../models/favourite");

const auth = require("../../config/auth");

router.post("/favoriteNumber", auth, (req, res) => {
  Favorite.find({ eventId: req.body.eventId }).exec((err, favoriteNumber) => {
    if (err) return res.status(400).send(err);

    res
      .status(200)
      .json({ success: true, favoriteNumber: favoriteNumber.length });
  });
});

router.post("/favorited", auth, (req, res) => {
  Favorite.find({
    eventId: req.body.eventId,
    userId: req.body.userId,
  }).exec((err, favorited) => {
    if (err) return res.status(400).send(err);

    let result = false;
    if (favorited.length !== 0) {
      result = true;
    }

    res.status(200).json({ success: true, favorited: result });
  });
});

router.post("/addToFavorite", auth, (req, res) => {
  const favorite = new Favorite(req.body);
  favorite.save((err, doc) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.status(200).json({ success: true });
  });
});

router.post("/removeFromFavorite", auth, (req, res) => {
  Favorite.findOneAndDelete({
    eventId: req.body.eventId,
    userId: req.body.userId,
  }).exec((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    res.json({ success: true, doc });
  });
});

router.post("/getFavoreEvent", (req, res) => {
  //Need to find all of the Users that I am subscribing to From Subscriber Collection
  Favorite.find({ userId: req.body.userId }).exec((err, favorites) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, favorites });
  });
});

module.exports = router;
