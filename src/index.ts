import { ModelService } from "./service/predict.service";
import "dotenv/config";

import { get } from "lodash";

import { Client } from "@line/bot-sdk";
import bodyParser from "body-parser";
import express from "express";

// Init Express
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

// Init LINE SDK
const lineClient = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});

const modelService = new ModelService();

// Webhook
app.post("/webhook", async (req, res) => {
  const event = get(req, ["body", "events", "0"]);
  const eventType = get(event, ["message", "type"]);
  const message = get(event, ["message", "text"]);
  const replyToken = get(event, "replyToken") as string;

  try {
    const message = await modelService.predict();
    await lineClient.replyMessage(replyToken, message as any);
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(200);
  }
});

app.get("/", (req, res) => {
  return res.send("Hello World");
});

app.post("/predict/group", async (rea, res) => {
  try {
    const message = await modelService.predict();
    await lineClient.pushMessage(process.env.ROOM_ID, message as any);
    return res.sendStatus(200);
  } catch (e) {
    console.error(e);
    // await lineClient.broadcast({
    //   type: "text",
    //   text: "ERROR"
    // });
    return res.sendStatus(400).send(e);
  }
});

app.post("/predict", async (req, res) => {
  try {
    const message = await modelService.predict();
    await lineClient.broadcast(message as any);
    return res.sendStatus(200);
  } catch (e) {
    console.error(e);
    // await lineClient.broadcast({
    //   type: "text",
    //   text: "ERROR"
    // });
    return res.sendStatus(400).send(e);
  }
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
