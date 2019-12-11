const mongoose = require("mongoose");
require("dotenv").config({ path: __dirname + "./../.env" });
require("./models/channel-model");
require("./models/bot-model");

mongoose.connect(`mongodb://${process.env.MONGO_HOST}/`, {
  dbName: "TwitchBotDB",
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const connection = mongoose.connection;

connection.once("connected", () => {
  console.log("This Application it's connected to the database.");
});

connection.once("disconnected", () => {
  console.log("This Application was disconnected to the database.");
});

connection.once("error", error => {
  console.error(error);
});
