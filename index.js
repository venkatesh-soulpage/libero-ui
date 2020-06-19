var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
app.use(express.static(path.join(__dirname, "public")));

//Set view engine to ejs
app.set("view engine", "ejs");

//Tell Express where we keep our index.ejs
app.set("views", __dirname + "/views");

//Use body-parser
app.use(bodyParser.urlencoded({ extended: false }));

//Instead of sending Hello World, we render index.ejs

app.get("/chat/:room_id", (req, res) => {
  res.render("chat", { room_id: req.params.room_id });
});

app.get("/boards/:room_id", (req, res) => {
  res.render("board", { room_id: req.params.room_id });
});

app.get("/notes/:room_id", (req, res) => {
  res.render("notes", { room_id: req.params.room_id });
});

app.listen(3000, () => {});
