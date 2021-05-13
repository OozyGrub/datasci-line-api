import { getPercentage } from "./../utils";
import { toCategory } from "../utils";
import { AirQualityCategory } from "./../enum";

type FlexData = {
  province: string;
  time: string;
  pm: number;
};

const getColor = (category: AirQualityCategory) => {
  if (category === AirQualityCategory.VERY_POOR) return "#FF7043";
  if (category === AirQualityCategory.POOR) return "#FFA726";
  if (category === AirQualityCategory.FAIR) return "#FDD835";
  if (category === AirQualityCategory.GOOD) return "#9CCC65";
  else return "#5D4037";
};

const harden = (color: string) => color + "FF";
const normal = (color: string) => color + "DD";
const lighten = (color: string) => color + "66";

export const getLineFlexMessage = (data: FlexData) => {
  const { province, time, pm } = data;

  const color = getColor(toCategory(pm));
  const percentage = getPercentage(pm);

  return {
    type: "flex",
    altText: time + " PM2.5 = " + pm,
    contents: {
      type: "carousel",
      contents: [
        {
          type: "bubble",
          size: "micro",
          header: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "PM2.5",
                color: "#FFFFFF80"
              },
              {
                type: "text",
                text: province,
                color: "#ffffff",
                align: "start",
                size: "lg",
                gravity: "center",
                weight: "bold"
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: Math.round(pm).toLocaleString(),
                    flex: 1,
                    color: "#ffffff",
                    align: "start",
                    size: "md",
                    gravity: "bottom",
                    margin: "none",
                    position: "relative"
                  },
                  {
                    type: "text",
                    flex: 3,
                    text: toCategory(pm),
                    color: "#ffffff",
                    align: "end",
                    size: "xs",
                    gravity: "bottom",
                    position: "relative"
                  }
                ]
              },
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "box",
                    layout: "vertical",
                    contents: [
                      {
                        type: "filler"
                      }
                    ],
                    width: percentage,
                    backgroundColor: "#00000033",
                    height: "6px"
                  }
                ],
                backgroundColor: lighten(color),
                height: "6px",
                margin: "sm"
              }
            ],
            backgroundColor: normal(color),
            paddingTop: "19px",
            paddingAll: "12px",
            paddingBottom: "16px"
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: time,
                    color: "#8C8C8C",
                    size: "xxs",
                    wrap: true
                  }
                ],
                flex: 1
              }
            ],
            spacing: "md",
            paddingAll: "12px"
          },
          styles: {
            footer: {
              separator: false
            }
          }
        }
      ]
    }
  };
};
