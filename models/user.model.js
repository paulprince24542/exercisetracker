var mongoose = require("mongoose");

var User = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
});


module.exports = mongoose.model("users", User)