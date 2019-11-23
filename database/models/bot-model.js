const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BotSchema = new Schema({
  twitchId: {
    type: String,
    required: true
  },
  enabled: {
    type: Boolean,
    default: false
  }
});

const BotModel = mongoose.model("Bot", BotSchema);
module.exports = BotModel;
