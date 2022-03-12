var mongoose = require("mongoose");

async function initdb() {
  var db_name = process.env.db_name;
  var db_user = process.env.db_user;
  var db_password = process.env.db_password;
  var uri = `mongodb+srv://${db_user}:${db_password}@cluster0.wl37o.mongodb.net/${db_name}?retryWrites=true&w=majority`;
  try {
    await mongoose.connect(uri, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Database Connected");
      }
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports.initdb = initdb;
