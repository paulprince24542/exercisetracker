var mongoose = require("mongoose");

var User = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
  }
});

module.exports = mongoose.model("exercises", User);
