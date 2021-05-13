import "dotenv/config";

import { get } from "lodash";

import { Client } from "@line/bot-sdk";
import bodyParser from "body-parser";
import express from "express";
import axios from "axios";
import { getFlex } from "./flex";
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
    // res.sendStatus(400).send(e);
  }

  //   // Validate input message
  //   if (eventType !== "text" || !isValidAddress(message)) {
  //     await lineClient.replyMessage(replyToken, {
  //       type: "text",
  //       text: "Please input valid BSC address. For example, 0x3c74c735b5863c0baf52598d8fd2d59611c8320f 🐳"
  //     } as any);
  //   }

  // Get poolInfos and store it to fetch faster
  // const pools = await masterchef.getPoolInfos();

  //   const positions = sortBy(
  //     stakings.map((stake) => getPositions(stake)),
  //     ["totalValue"]
  //   ).reverse();

  //   const totalValue = positions.reduce(
  //     (sum, position) => sum + position.totalValue,
  //     0
  //   );

  //   try {
  //     await lineClient.replyMessage(replyToken, {
  //       type: "flex",
  //       altText: "Crow Staking",
  //       contents: {
  //         type: "bubble",
  //         body: {
  //           type: "box",
  //           layout: "vertical",
  //           contents: [
  //             addressBar(shortenAddress(address)),
  //             tableHeader(),
  //             ...positions.map((position) => poolLine(position)),
  //             summary(totalValue)
  //           ]
  //         }
  //       }
  //     } as any);
  //     return res.sendStatus(200);
  //   } catch (e) {
  //     return res.status(400).send(e);
  //   }
});

app.get("/", (req, res) => {
  return res.send("Hello World");
});

app.post("/predict", async () => {
  const province = "Bangkok";
  const time = "2018-01-01 07:00:00";
  const timeString = moment(time, "YYYY-MM-DD hh:mm:ss").format("llll");

  try {
    const { data } = await axios.post<{ actual: string; predict: string }>(
      process.env.MODEL_API + "/predict",
      { province, time }
    );
    await lineClient.broadcast({
      type: "text",
      text: JSON.stringify(data)
    });
    const flex = getFlex({
      province,
      time: timeString,
      pm: data.predict
    });
    await lineClient.broadcast(flex as any);
  } catch (e) {
    await lineClient.broadcast({
      type: "text",
      text: JSON.stringify(e)
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
