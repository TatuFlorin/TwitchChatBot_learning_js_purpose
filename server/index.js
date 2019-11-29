require("dotenv").config({ path: "./../.env" });
const db = require("../database");
const express = require("express");
const app = express();
const bot = require("./../bot/index");
const botModel = require("./../database/models/bot-model");

const port = process.env.PORT || 3001;

app.use(express.json());

app.use("/dashboard", require("./routes/dashboard-route"));
app.use("/auth", require("./routes/auth-routes"));
app.use("/api/channel", require("../api/channel-api"));

bot.init();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
