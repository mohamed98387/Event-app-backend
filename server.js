const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const cookieParser = require("cookie-parser");
const socketio = require("socket.io");
// const passport = require("passport");
const users = require("./routes/api/users");
const adherent = require("./routes/api/Adherent");
const event = require("./routes/api/event");
const chat = require("./routes/api/router");
const fav = require("./routes/api/favourite");
const reservation = require("./routes/api/reservation");
const followres = require("./routes/api/followres");
const comment = require("./routes/api/comment");
const video = require("./routes/api/video");
const abonne = require("./routes/api/abonne");
const commentVideo = require("./routes/api/commentVideo");
const like = require("./routes/api/likes");
const contact = require("./routes/api/contact");
const blog = require("./routes/api/blog");
const notification = require("./routes/api/notification");
const message = require("./routes/api/message");
const app = express();
const { addUser, getUser, removeUser, getUsersInRoom } = require("./UserChat");
const router = require("./routes/api/blog");

// const cors = require("cors");

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(__dirname + "/public"));

app.use(
  router.post("/newsLetter", (req, res) => {
    addEmailToMailChimp(req.body.email);
    res.end("success");
  })
);

// auto send email newsletter
function addEmailToMailChimp(email) {
  var request = require("request");
  var options = {
    method: "POST",
    url: "https://us10.api.mailchimp.com/3.0/lists/8ae5ba8708/members",
    headers: {
      Authorization:
        "Basic YW55c3RyaW5nOjU4ZTAxMjI5NzMzYzFmNTc5OWE2OGM3OTdlNDgwODhjLXVzMTA=",
      "Content-Type": "application/json",
      Cookie:
        "bm_sz=2E34EB4F739AD5115DBC606F9BF490D2~YAAQBmR7XJ8ytchyAQAAwFKb1ggYhrOf/FOAejL0dhXvzQHJrjC+3CIrBgVFrm3UySEMTBnfrSbbHRCtFyqdCueHnBnSYXrWBLLFqUFvspN1w1gJYYOBbSuvm2O5T7QbYoPoJnOELI2i1mLy1W1+yaQk7RnC8fjcxtwBUM5aeyRrP8bYQjPH4qHm0PU8BStEA0IW; _abck=42C40C42F125D48E20C026B3B6207728~-1~YAAQBmR7XKAytchyAQAAwFKb1gTawGVlVl1+tPDayrt//LZntQN16HfdxoIQJy7h8NytovjcS8/bOS8puYpEzzywWsi6TvaPAWJUJUnu7blCiH3ocw7ve71g5+3BSEvX9OTmhR92tpINNratzpU3Zx8vOA0Eb8sSHSh1RIl8EJHJ15Hp69yW31MGr0rGRhZ9Wrce44VnVD0UH++im/cpxp8lhc9ZCn4+OOMT2YncyqdULLFHiziG6DWIYq1AgSGnh+89AuBC0I57N/yZBEZ0KutcJb0Rqit/RGIARoYm43CrXbR3mWYGDtjnuuW5~-1~-1~-1; _mcid=1.a261373e430e43961aa7e95b53c835b1.03c776cbe1fceb3f6dcccaebbe0a80ff567f6846344a2c6e523faea8d2c42658; ak_bmsc=8C33AE520EEA036844F2F654D768DD8F5C7B64360B7C00008E6DEF5E9B68A95E~plf4WDjclgDZEROavZTF41EdBKAUNR6E2OlCG1LXMnHmnY6GTmG8K7mLL82khxkm28V5jLIUvbObx+HljMQAtQ6KekGWTp2ZdKR0cruS9vjW26bOx6wKBxJm2aqGDapscl88nEq0x/B1n+LIShMV77UTuirHkSBeIW7JRf+Q/MvK95hbWhy/sSjxP7/ZjV9qY6x+bIfchhffRkoR8iP8fiG5HAEwAfCszikpVJw7K/wVw=; bm_sv=C76AA1BFAD324AAFB638E4F00E49CFD7~o8JO5hUfrs48ZT7qN4M35BYqLRlxDkS+TORbnrAsQ+Oj0Y67QVhHFZm9WY+LdI4u90ly6cV+d/gQzeGQrEMyqlNXZBFjPyg7d/9v1q6uSTGy6aEdFWsxUVPoRh6el1DMMgKBRiemCOAOF5QO2BbG4wchezE9gOGtW77Y3Y10ReM=",
    },
    body: JSON.stringify({ email_address: email, status: "subscribed" }),
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
  });
}
// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

const server = http.createServer(app);
const io = socketio(server);
io.on("connect", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to room ${user.room}.`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!` });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});
app.use("/uploadBlog", express.static("uploadBlog"));
app.use("/uploadsVideo", express.static("uploadsVideo"));
app.use("/uploadsEvent", express.static("uploadsEvent"));
app.use("/uploads", express.static("uploads"));
app.use("/api/users", users);
app.use("/api/adherent", adherent);
app.use("/api/event", event);
app.use("/api/chat", chat);
app.use("/api/fav", fav);
app.use("/api/comment", comment);
app.use("/api/reservation", reservation);
app.use("/api/follow", followres);
app.use("/api/video", video);
app.use("/api/abonne", abonne);
app.use("/api/commentVideo", commentVideo);
app.use("/api/like", like);
app.use("/api/contact", contact);
app.use("/api/notification", notification);
app.use("/api/blog", blog);
app.use("/api/message", message);
message;
const port = process.env.PORT || 5000;
server.listen(port, () =>
  console.log(`Server up and running on port ${port} !`)
);
