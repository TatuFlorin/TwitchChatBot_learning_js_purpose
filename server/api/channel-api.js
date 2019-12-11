const router = require("express").Router();
const ChannelModel = require("../database/models/channel-model");
const { Join, Part } = require("./../bot/index");
const { verifyToken } = require("../utils/jwt");

function Auth(req, res, next) {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  var data = verifyToken(token);

  if (data === undefined) {
    res.sendStatus(401);
  } else {
    req.userid = data;
  }
  next();
}

//GET: channel details from database
router.get("/", Auth, async (req, res, next) => {
  const twitchId = req.userid;

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

//PATCH: active chatBot on channel
router.patch("/act", Auth, async (req, res, next) => {
  const twitchId = req.userid;
  const { enabled } = req.body;

  if (enabled === undefined || typeof enabled != "boolean") {
    return next(new Error("Enabled must be a boolean."));
  }

  try {
    var channel = await ChannelModel.findOne({ twitchId });
    if (!channel) {
      return next();
    }

    if (enabled) {
      Join(channel.twitchId);
      res.json("RolfinBot was connected to your char room!");
    } else {
      Part(channel.twitchId);
      res.json("RolfinBot was disconnected to your char room!");
    }
  } catch (error) {
    return next(error);
  }
});

//GET: custom commands
router.get("/commands", Auth, async (req, res, next) => {
  try {
    const twitchId = req.userid;
    const channel = await ChannelModel.findOne({ twitchId });
    const commands = channel.customCommands;
    return res.json(commands);
  } catch (error) {
    return next(error);
  }
});

//POST: create a new command
router.post("/commands", Auth, async (req, res, next) => {
  const twitchId = req.userid;
  const { syntax, response, enabled } = req.body;
  try {
    const channel = await ChannelModel.findOne({ twitchId });
    const commands = channel.customCommands.find(x => x.syntax === syntax);
    if (commands) {
      res.json("This command already exist.");
    } else {
      await ChannelModel.updateOne(
        {
          twitchId
        },
        {
          $push: { customCommands: { syntax, response, enabled } }
        }
      );
      res.json("The command was added with success.");
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
