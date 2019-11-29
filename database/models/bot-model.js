const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BotSchema = new Schema({
  twitchId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  refresh_token: {
    type: String,
    required: true
  },
  channels: {
    type: [
      {
        channelId: {
          type: String,
          required: true
        },
        login: {
          type: String,
          required: true
        },
        enabled: {
          type: Boolean,
          default: false
        }
      }
    ]
  }
});

const BotModel = mongoose.model("Bot", BotSchema);
module.exports = BotModel;
