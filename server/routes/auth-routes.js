const express = require("express");
const axios = require("axios");
const api = require("../../api/twitch-api");
const channelModel = require("./../../database/models/channel-model");
require("dotenv").config({ path: "./../.env" });

const router = express.Router();

const baseURL = "https://id.twitch.tv/oauth2";
const redirectLocalPage = `${process.env.REDIRECT_HOST}/auth/callback`;

const axiosInstance = axios.create({
  baseURL: baseURL
});

router.get("/twitch", (req, res) => {
  const sp = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    redirect_uri: redirectLocalPage,
    response_type: "code",
    scope: req.query.scope
  });
  const redirectURL = `${baseURL}/authorize?${sp}`;
  res.redirect(redirectURL);
});

router.get("/callback", async (req, res) => {
  const { code } = req.query;
  const sp = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectLocalPage
  });
  try {
    const data = await axiosInstance.post(`/token?${sp}`);
    const userData = await api.getUser(data.data.access_token);
    const refreshToken = data.data.refresh_token;
    const userId = userData.id;

    var options = {
      new: true,
      upsert: true
    };

    await channelModel.findOneAndUpdate(
      userId,
      {
        twitchId: userId,
        refresh_token: refreshToken
      },
      options
    );
    res.redirect("/dashboard");
  } catch (error) {
    res.json({
      message: error.message
    });
  }
});

module.exports = router;
