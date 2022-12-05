const express = require("express");
const router = express.Router();
const Comment = require("../../models/Comment");

const auth = require("../../config/auth");

router.post("/saveComment", auth, (req, res) => {
  const comment = new Comment(req.body);
  comment.save((err, comment) => {
    if (err) return res.json({ success: false, err });
    Comment.find({ _id: comment._id })
      .populate("userId")
      .exec((err, result) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true, result });
      });
  });
});

router.post("/getComments", (req, res) => {
  Comment.find({ eventId: req.body.eventId })
    .populate("userId")
    .exec((err, comments) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, comments });
    });
});

module.exports = router;
