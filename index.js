require("dotenv").config();

var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var http = require("http").createServer(app);

app.use(express.static(path.join(__dirname, "public")));

const fileUpload = require("express-fileupload");
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_KEY,
  region: process.env.AWS_REGION, //Region
});

app.use(fileUpload());

const s3 = new AWS.S3({});

var port = process.env.PORT || 3000;

//Set view engine to ejs
app.set("view engine", "ejs");

//Tell Express where we keep our index.ejs
app.set("views", __dirname + "/views");

//Use body-parser
app.use(bodyParser.urlencoded({ extended: true }));

//Instead of sending Hello World, we render index.ejs
app.get("/(:room_id)?", (req, res) => {
  res.render("index");
});

app.get("/chat/:room_id/(:user_id)?", (req, res) => {
  res.render("chat", {
    room_id: req.params.room_id,
    user_id: req.params.user_id,
  });
});

app.get("/boards/:room_id/(:user_id)?", (req, res) => {
  res.render("board", {
    room_id: req.params.room_id,
    user_id: req.params.user_id,
  });
});

app.get("/notes/:room_id/(:user_id)?", (req, res) => {
  res.render("notes", {
    room_id: req.params.room_id,
    user_id: req.params.user_id,
  });
});

app.post("/upload", (req, res) => {
  const fileContent = Buffer.from(req.files.image.data, "binary");
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: req.files.image.name, // File name you want to save as in S3
    Body: fileContent,
  };

  // Uploading files to the bucket
  s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }
    res.send({
      response_code: 200,
      response_message: "Success",
      response_data: data,
    });
  });
});

http.listen(port, function () {
  console.log("listening on *:3000");
});
