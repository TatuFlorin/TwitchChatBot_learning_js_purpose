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
  },
  customCommands: {
    type: [
      {
        syntax: {
          type: String,
          required: true
        },
        response: {
          type: String,
          required: true
        },
        enabled: {
          type: Boolean,
          default: false
        }
      }
    ]
  },
  deafultCommands: {
    type: [
      {
        syntax: {
          type: String,
          required: true
        },
        response: {
          type: String,
          required: true
        },
        enabled: {
          type: Boolean,
          default: false
        }
      }
    ]
  },
  setting: { type: [{}] }
});

const ChannelModel = mongoose.model("Channel", ChannelSchema);
module.exports = ChannelModel;
