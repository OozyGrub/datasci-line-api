import "dotenv/config";

import { get } from "lodash";

import { Client } from "@line/bot-sdk";
import bodyParser from "body-parser";
import express from "express";
import axios from "axios";
import { getFlex } from "./views/template";
import moment from "moment";

// Init Express
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

// Init LINE SDK
const lineClient = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});

// Webhook
app.post("/webhook", async (req, res) => {
  const event = get(req, ["body", "events", "0"]);
  const eventType = get(event, ["message", "type"]);
  const message = get(event, ["message", "text"]);
  const replyToken = get(event, "replyToken") as string;

  try {
    await lineClient.replyMessage(replyToken, {
      type: "text",
      text: "It works!"
    });
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(200);
  }
});

app.get("/", (req, res) => {
  return res.send("Hello World");
});

type ModelData = {
  predict: number[];
  actual: number[];
};
app.post("/predict", async (req, res) => {
  const province = "Bangkok";

  const currentMoment = moment().add(3, "days");
  const time = currentMoment.format("2018-MM-DD hh:00:00");

  try {
    const response = await axios.post(process.env.MODEL_API + "/predict/", {
      province,
      time
    });
    const data: ModelData = JSON.parse(response.data);

    const pm = data.predict[0];

    const flex = getFlex({
      province,
      time: currentMoment.format("[predict] MMM DD, hh:00"),
      pm
    });

    await lineClient.broadcast(flex as any);

    return res.sendStatus(200);
  } catch (e) {
    console.error(e);
    await lineClient.broadcast({
      type: "text",
      text: "ERROR"
    });
    return res.sendStatus(400).send(e);
  }
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
