const express = require("express");
const router = express.Router();

const Abonne = require("../../models/Abonne");

const auth = require("../../config/auth");

router.post("/abonneNumber", auth, (req, res) => {
  Abonne.find({ videoId: req.body.videoId }).exec((err, abonne) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, abonneNumber: abonne.length });
  });
});

router.post("/abonned", (req, res) => {
  Abonne.find({
    videoId: req.body.videoId,
    userId: req.body.userId,
  }).exec((err, abonne) => {
    if (err) return res.status(400).send(err);

    let result = false;
    if (abonne.length !== 0) {
      result = true;
    }

    res.status(200).json({ success: true, abonne: result });
  });
});

router.post("/sAbonne", (req, res) => {
  const abonne = new Abonne(req.body);
  abonne.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.post("/deSabonne", (req, res) => {
  Abonne.findOneAndDelete({
    videoId: req.body.videoId,
    userId: req.body.userId,
  }).exec((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, doc });
  });
});
router.get("/", auth, (req, res) => {
  Abonne.find({ userId: req.user.id })
    .populate("videoId")
    .then((abonne) => res.json(abonne))
    .catch((err) => console.log(err.message));
});
module.exports = router;
