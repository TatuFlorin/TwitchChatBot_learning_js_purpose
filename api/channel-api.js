const router = require("express").Router();
const ChannelModel = require("../database/models/channel-model");

//get channel details from database
router.get("/:twitchId", async (req, res, next) => {
  const { twitchId } = req.params;

  try {
    const channel = await ChannelModel.findOne({ twitchId });
    if (!channel) {
      return next();
    } else {
      res.json(channel);
    }
  } catch (error) {
    return next(error);
  }
});

//active chatBot on channel
router.patch("/:twitchId", async (req, res, next) => {
  const { twitchId } = req.params;
  const { enabled } = req.body;

  if (enabled === undefined || typeof enabled != "boolean") {
    return next(new Error("Enabled must be a boolean."));
  }

  try {
    var channel = await ChannelModel.findOneAndUpdate(
      { twitchId },
      { enabled },
      { new: false }
    );

    if (!channel) {
      return next();
    }

    if (enabled) {
      //joinChannel
    } else {
      //partChannel
    }
    return res.json(channel);
  } catch (error) {
    return next(error);
  }
});

//get custom commands
router.get("/:twitchId/commands", async (req, res, next) => {
  try {
    const { twitchId } = req.params;
    const channel = await ChannelModel.findOne({ twitchId });
    const commands = channel.customCommands;
    return res.json(commands);
  } catch (error) {
    return next(error);
  }
});

//create a new command
router.post("/:twitchId/commands", async (req, res, next) => {
  const { twitchId } = req.params;
  const { syntax, response, enabled } = req.body;

  try {
    const channel = await ChannelModel.findOne({ twitchId });
    const commands = channel.customCommands.find(x => x.syntax === syntax);

    if (commands) {
      res.json("This command already exist.");
    }

    var newtype = {
      syntax,
      response,
      enabled
    };

    channel.customCommands.push(newtype);
    ChannelModel.findOneAndUpdate(twitchId, channel, {
      new: true
    });
    res.json("Command was added with success.");
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
