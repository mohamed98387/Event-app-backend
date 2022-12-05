const express = require("express");
const router = express.Router();
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");
const Video = require("../../models/Video");

const auth = require("../../config/auth");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploadsVideo/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".mp4") {
      return cb(res.status(400).end("only mp4 is allowed"), false);
    }
    cb(null, true);
  },
});

var upload = multer({ storage: storage }).single("file");

router.post("/uploadfiles", auth, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});
router.post("/thumbnail", auth, (req, res) => {
  let thumbsFilePath = "";
  let fileDuration = "";
  ffmpeg.ffprobe(req.body.filePath, function (err, metadata) {
    fileDuration = metadata.format.duration;
  });
  ffmpeg(req.body.filePath)
    .on("filenames", function (filenames) {
      thumbsFilePath = "uploadsVideo/thumbnails/" + filenames[0];
    })
    .on("end", function () {
      return res.json({
        success: true,
        thumbsFilePath: thumbsFilePath,
        fileDuration: fileDuration,
      });
    })
    .screenshots({
      count: 3,
      folder: "uploadsVideo/thumbnails",
      size: "320x240",
      filename: "thumbnail-4%b.png",
    });
});
router.post("/uploadVideo", auth, (req, res) => {
  const video = new Video(req.body);
  video.save((err, video) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});
router.get("/", auth, (req, res) => {
  if (!req.user.id) {
    res.status(400).json({ success: false, msg: "No id provided" });
  }
  Video.find({ createure: req.user.id })
    .populate("createure")
    .then((videos) => res.json(videos))
    .catch((err) => console.log(err.message));
});
router.get("/allVideo", (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "createdAt";
  Video.find({})
    .sort([[sortBy, order]])
    .populate("createure")
    .then((videos) => res.json({ success: true, videos: videos }))
    .catch((err) => console.log(err.message));
});
router.post("/allUserVideo", (req, res) => {
  Video.find({ createure: req.body.createure })
    .populate("createure")
    .then((videos) => res.json({ success: true, videos: videos }))
    .catch((err) => console.log(err.message));
});
router.post("/getVideo", (req, res) => {
  Video.findOne({ _id: req.body.videoId })

    .populate("createure")
    .exec((err, video) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, video });
    });
});

router.delete("/:id", auth, (req, res) => {
  Video.findById(req.params.id)
    .then((video) => {
      if (!video) {
        return res.json({ msg: "video not find" });
      } else {
        Video.findByIdAndDelete(
          req.params.id,

          { useFindAndModify: false },
          (err, data) => {
            res.json({ msg: "video deleted" });
          }
        );
      }
    })
    .catch((err) => console.log(err.message));
});
router.put(
  "/validation/:id",
  auth,

  (req, res) => {
    const { Validation } = req.body;
    let updateEvent = {};
    //build a event object
    updateEvent.Validation = Validation;
    Video.findById(req.params.id)
      .then((video) => {
        if (!video) {
          return res.json({ msg: "video not find" });
        } else {
          Video.findByIdAndUpdate(
            req.params.id,
            { $set: updateEvent },
            { useFindAndModify: false },
            (err, data) => {
              res.json({ msg: "event updated" });
            }
          );
        }
      })
      .catch((err) => console.log(err.message));
  }
);
router.delete("/delete/:id", auth, (req, res) => {
  Video.find({ createure: req.params.id })
    .then((video) => {
      if (!video) {
        return res.json({ msg: "video not find" });
      } else {
        Video.deleteMany({ createure: req.params.id }, function (err, result) {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        });
      }
    })
    .catch((err) => console.log(err.message));
});

module.exports = router;
