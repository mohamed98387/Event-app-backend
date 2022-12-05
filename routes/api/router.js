const express = require("express");
const router = express.Router();
const auth = require("../../config/auth");

const Chat = require("../../models/Chat");
router.post(
  "/",
  auth,

  (req, res) => {
    const { userName, Room, text } = req.body;

    chat = new Chat({
      Room,
      text,
      userName,
      User: req.user.id,
    });
    chat
      .save()
      .then((chat) => res.json(chat))
      .catch((err) => console.log(err));
  }
);

module.exports = router;
