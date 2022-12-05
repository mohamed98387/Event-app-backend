const express = require("express");
const router = express.Router();
const Like = require("../../models/Likes");
const Dislike = require("../../models/Dislike");

const auth = require("../../config/auth");

router.post("/getLikes", auth, (req, res) => {
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId };
  } else if (req.body.commentId) {
    variable = { commentId: req.body.commentId };
  } else {
    variable = { eventId: req.body.eventId };
  }
  Like.find(variable).exec((err, likes) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, likes });
  });
});

router.post("/getDislikes", auth, (req, res) => {
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId };
  } else if (req.body.commentId) {
    variable = { commentId: req.body.commentId };
  } else {
    variable = { eventId: req.body.eventId };
  }
  Dislike.find(variable).exec((err, dislikes) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, dislikes });
  });
});

router.post("/upLike", auth, (req, res) => {
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else if (req.body.commentId) {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  } else {
    variable = { eventId: req.body.eventId, userId: req.body.userId };
  }
  const like = new Like(variable);
  like.save((err, likeResult) => {
    if (err) return res.status(400).json({ success: false, err });

    Dislike.findOneAndDelete(variable).exec((err, disLikeResult) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true });
    });
  });
});
router.post("/unLike", auth, (req, res) => {
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else if (req.body.commentId) {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  } else {
    variable = { eventId: req.body.eventId, userId: req.body.userId };
  }
  Like.findOneAndDelete(variable).exec((err, result) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true });
  });
});
router.post("/unDisLike", auth, (req, res) => {
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else if (req.body.commentId) {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  } else {
    variable = { eventId: req.body.eventId, userId: req.body.userId };
  }
  Dislike.findOneAndDelete(variable).exec((err, result) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

router.post("/upDisLike", auth, (req, res) => {
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else if (req.body.commentId) {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  } else {
    variable = { eventId: req.body.eventId, userId: req.body.userId };
  }
  const dislike = new Dislike(variable);
  dislike.save((err, DislikeResult) => {
    if (err) return res.status(400).json({ success: false, err });

    Like.findOneAndDelete(variable).exec((err, LikeResult) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true });
    });
  });
});
router.get("/all", (req, res) => {
  Like.find({})
    .then((Events) => res.status(200).json(Events))
    .catch((err) => console.log(err.message));
});
module.exports = router;
