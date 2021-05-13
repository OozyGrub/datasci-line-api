type FlexData = {
  province: string;
  time: string;
  pm: number;
};
export const getFlex = (data: FlexData) => {
  const { province, time, pm } = data;
  return {
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
              text: province,
              color: "#ffffff",
              align: "start",
              size: "lg",
              gravity: "center",
              weight: "bold"
            },
            {
              type: "text",
              text: pm,
              color: "#ffffff",
              align: "start",
              size: "lg",
              gravity: "center",
              margin: "lg"
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
                  width: "70%",
                  backgroundColor: "#DE5658",
                  height: "6px"
                }
              ],
              backgroundColor: "#FAD2A76E",
              height: "6px",
              margin: "sm"
            }
          ],
          backgroundColor: "#FF6B6E",
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
  };
};
