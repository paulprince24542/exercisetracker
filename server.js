const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.static("public"));

//Mongo Init
require("./config/mongoDb").initdb();

//Models
var UserModel = require("./models/user.model");
var ExerciseModel = require("./models/exercises.model");

app.get("/", (req, res) => {
  var date = new Date();
  var yyyy = date.getFullYear();
  var mm = date.getMonth();
  var dd = date.getDate();
  var currentDate = yyyy + "-" + mm + "-" + dd;
  console.log(currentDate);
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  var username = req.body.username;
  var newUser = new UserModel({
    username: username,
  });
  newUser.save((err, userSaved) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        username: userSaved.username,
        _id: userSaved._id,
      });
    }
  });
});

app.get("/api/users", async (req, res) => {
  var fullUser = await UserModel.find({});
  console.log(fullUser);
  res.status(200).json(fullUser);
});

function formatDate(dateString) {
  var a_date = new Date();
  var yyyy = 0;
  var mm = "";
  var dd = 0;
  var dy = "";
  var currentDate = "";
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  if (dateString == "") {
    yyyy = date.getFullYear();
    mm = month[date.getMonth()];
    dd = date.getDate();
    dy = days[date.getDay()];
    currentDate = dy + " " + mm + " " + dd + " " + yyyy;
    return currentDate;
  } else {
    console.log(dateString.split("-"));
    var split_Date = dateString.split("-");
    // if(split_Date[0].length === 4 && split_Date[1].length == 2){
    //   console.log("Invalid Date")
    // }
    var m_date = new Date(dateString);
    yyyy = m_date.getFullYear();
    mm = month[m_date.getMonth()];
    dd = m_date.getDate();
    dy = days[m_date.getDay()];
    currentDate = dy + " " + mm + " " + dd + " " + yyyy;
    return currentDate;
  }
  return;
}

app.post("/api/users/:_id/exercises", (req, res) => {
  try {
    UserModel.findOne(
      {
        _id: req.params._id,
      },
      (err, userfound) => {
        if (err) console.log(err);
        var newExercise = new ExerciseModel({
          description: req.body.description,
          duration: req.body.duration,
          date: formatDate(req.body.date),
          user: userfound,
        });
        newExercise.save((err, savedExercise) => {
          if (err) {
            console.log(err);
          } else {
            res.status(200).json({
              _id: savedExercise._id,
              username: savedExercise.user.username,
              date: savedExercise.date,
              duration: savedExercise.duration,
              description: savedExercise.description,
            });
          }
        });
      }
    );
  } catch (err) {
    res.status(403).json({
      err: err,
    });
  }
});

app.get("/api/users/:id/logs", async (req, res) => {
  var id = req.params.id;
  // var foundLog = await ExerciseModel.find({
  //   user: id
  // })
  var get_Username = await UserModel.findOne({
    where: {
      _id: id,
    },
  });
  console.log(get_Username.username);
  var foundLog = await ExerciseModel.find(
    {
      user: req.params.id,
    },
    { _id: false, user: false, __v: false },
    ["description", "duration", "date"]
  );
  res.status(200).json({
    _id: id,
    username: get_Username.username,
    count: foundLog.length,
    log: foundLog,
  });
  console.log(foundLog);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
