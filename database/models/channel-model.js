const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChannelSchema = new Schema({
  twitchId: {
    type: String,
    required: true
  },
  refresh_token: {
    type: String,
    required: true
  }
});

const ChannelModel = mongoose.model("Chanel", ChannelSchema);
module.exports = ChannelModel;
