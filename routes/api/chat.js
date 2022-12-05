const express = require("express");
const router = express.Router();
const Chat = require("../../models/Chat");
router.post(
  "/",
  auth,

  (req, res) => {
    // console.log(req.file);
    const { userName, Room } = req.body;

    chat = new Chat({
      Room,
      userName,
      User: req.user.id,
    });
    chat
      .save()
      .then((chat) => res.json(chat))
      .catch((err) => console.log(err));
  }
);
module.exports;
