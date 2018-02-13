const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const bodyParser = require("body-parser");

const app = express();
const server = http.Server(app);
const io = socketio(server);

const debug = require("debug")("danmaku-viewer:server");

const port = process.env.PORT || 3000;
const count = {
  viewer: 0,
  all: 0,
  comment: 0,
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "pug");
app.use("/static", express.static("public"));

app.get("/", (req, res) => res.render("index", { emoji_list: ["👍", "😂😂😂", "👏👏👏"] }));
app.post("/title", (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).end();
  }
  io.emit("title", title);
  res.send({ status: "OK" });
});
io.on("connection", socket => {
  debug(`connected: ${socket.id}`);
  count.viewer++;
  count.all++;
  io.emit("count", count);
  socket.on("disconnect", () => {
    debug(`disconnected: ${socket.id}`);
    count.viewer--;
    io.emit("count", count);
  });
  socket.on("chat message", msg => {
    debug(msg);
    io.emit("chat message", msg);
    count.comment++;
    io.emit("count", count);
  });
});
server.listen(port, () => {
  debug(`Server start: ${port}`);
});
