require("dotenv").config({ path: __dirname + "./../.env" });
const tmi = require("tmi.js");
const botModel = require("./../database/models/bot-model");
const twitchAPI = require("../utils/twitch-api");
const channelModel = require("./../database/models/channel-model");

let client;

async function getClient() {
  if (client) {
    return client;
  } else {
    try {
      const bot = botModel.findOne({}, {}, async (error, post) => {
        if (!bot) {
          throw new Error("No one bot was found!");
        }

        //const data = await twitchAPI.getAccessToken(post.refresh_token);
        //const channelBot = await twitchAPI.getUser(data.access_token);

        client = new tmi.client({
          connection: {
            secure: true,
            reconnect: true
          },
          identity: {
            username: post.name,
            password: process.env.BOT_PASSWORD
          },
          options: { debug: true }
        });

        client.on("message", (channel, tags, message, self) => {
          if (self) return;
          if (message.toLowerCase() === "!bot") {
            client.say(
              channel,
              `Hello ${tags.username}, my name is ${post.name}.`
            );
          }
        });

        client.on("message", messageHandler);

        await client.connect();
      });
    } catch (error) {
      console.log("Error connected to twitch....", error);
    }
  }
}

async function init() {
  await getClient();
  await Join();
}

async function Join(id) {
  if (id === undefined || id === null) {
    botModel.findOne({}, {}, async (error, bot) => {
      for (const channel of bot.channels.filter(x => x.enabled === true)) {
        await Promise.all([client.join(channel.login)]);
      }
    });
  } else {
    botModel.findOne({}, {}, async (error, bot) => {
      var channel = await bot.channels.find(x => x.channelId === id.toString());

      client.join(channel.login);

      const modify = await botModel.updateOne(
        { "channels.channelId": id },
        { $set: { "channels.$.enabled": true } }
      );
    });
  }
}

async function Part(id) {
  if (id === undefined || id === null) {
    console.log("You need to pass an id.");
  } else {
    botModel.findOne({}, {}, async (error, bot) => {
      var channel = await bot.channels.find(x => x.channelId === id.toString());
      client.part(channel.login);

      const modify = await botModel.updateOne(
        {
          "channels.channelId": id
        },
        { $set: { "channels.$.enabled": false } }
      );
    });
  }
}

async function messageHandler(channel, tags, message, self) {
  if (self || tags["message-type"] === "whisper") return;
  if (message.startsWith("!")) {
    const args = message.slice(1).split(" ");
    const commandName = args.shift().toLowerCase();
    const channelId = tags["room-id"];
    const context = { commandName, channelId, channel, args };

    const reply = async msg => {
      if (msg.startsWith("/") || msg.startsWith(".")) {
        msg = "Nice try!";
      }
      await client.say(channel, msg);
    };

    await commandHandler({ reply, ...context });
  }
}

async function commandHandler(context) {
  const { reply, channelId, commandName } = context;
  const channel = await channelModel.findOne({ twitchId: channelId });
  const command = await channel.customCommands.find(
    x => x.syntax === `!${commandName}`
  );

  if (!command) {
    return;
  }

  if (command.syntax) {
    reply(command.response);
  }
}

module.exports = {
  getClient,
  init,
  Join,
  Part
};
