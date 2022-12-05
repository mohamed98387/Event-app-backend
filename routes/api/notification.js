const express = require("express");
const router = express.Router();
const Notification = require("../../models/Notification");

const auth = require("../../config/auth");

router.post("/saveNotification", auth, (req, res) => {
  const notification = new Notification(req.body);
  notification.save((err, notification) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true, notification });
  });
});
router.post("/getNotification", (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "createdAt";
  Notification.find({ to: "admin" })
    .populate("userId")
    .sort([[sortBy, order]])
    .exec((err, notification) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({
        success: true,
        notification: notification,
        nbr: notification.length,
      });
    });
});
router.post("/getnotifications", auth, (req, res) => {
  let order = req.body.order ? req.body.order : "1";
  let sortBy = req.body.sortBy ? req.body.sortBy : "createdAt";
  Notification.find({ userId: req.user.id })
    .populate("userId")
    .sort([[sortBy, order]])
    .exec((err, notification) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({
        success: true,
        notification: notification,
        nbr: notification.length,
      });
    });
});
router.delete("/delete/:id", (req, res) => {
  Notification.findById(req.params.id)
    .then((notfication) => {
      if (!notfication) {
        return res.json({ msg: "notfication not find" });
      } else {
        Notification.findByIdAndDelete(
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
module.exports = router;
