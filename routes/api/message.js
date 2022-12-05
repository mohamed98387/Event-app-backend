const express = require("express");
const router = express.Router();
const Message = require("../../models/Message");

const auth = require("../../config/auth");

router.post("/saveMessage", auth, (req, res) => {
  const message = new Message(req.body);
  message.save((err, msg) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true, msg });
  });
});
router.post("/getMessage", auth, (req, res) => {
  let order = req.body.order ? req.body.order : "1";
  let sortBy = req.body.sortBy ? req.body.sortBy : "createdAt";
  Message.find({ createureId: req.user.id })
    .populate("userId")
    .sort([[sortBy, order]])
    .exec((err, message) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({
        success: true,
        message: message,
        nbr: message.length,
      });
    });
});
router.delete("/delete/:id", (req, res) => {
  Message.findById(req.params.id)
    .then((notfication) => {
      if (!notfication) {
        return res.json({ msg: "message not find" });
      } else {
        Message.findByIdAndDelete(
          req.params.id,
          { useFindAndModify: false },
          (err, data) => {
            res.json({ msg: "message deleted" });
          }
        );
      }
    })
    .catch((err) => console.log(err.message));
});
module.exports = router;
