const express = require("express");
const router = express.Router();
const multer = require("multer");
const Blog = require("../../models/Blog");

const auth = require("../../config/auth");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploadBlog/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
var upload = multer({ storage: storage }).single("file");
router.post("/uploadblog", auth, (req, res) => {
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
router.post("/upload", auth, (req, res) => {
  const blog = new Blog(req.body);
  blog.save((err, blog) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});
router.get("/", (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "createdAt";
  Blog.find({})
    .sort([[sortBy, order]])
    .then((blog) => res.json(blog))
    .catch((err) => console.log(err.message));
});
router.delete("/:id", auth, (req, res) => {
  Blog.findById(req.params.id)
    .then((blog) => {
      if (!blog) {
        return res.json({ msg: "blog not find" });
      } else {
        Blog.findByIdAndDelete(
          req.params.id,
          { useFindAndModify: false },
          (err, data) => {
            res.json({ msg: "blog deleted" });
          }
        );
      }
    })
    .catch((err) => console.log(err.message));
});
module.exports = router;
