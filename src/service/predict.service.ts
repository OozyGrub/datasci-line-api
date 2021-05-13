import axios from "axios";
import moment from "moment";
import { getLineFlexMessage } from "../views/template";

type ModelData = {
  predict: number[];
  actual: number[];
};

export class ModelService {
  predict = async () => {
    const province = "Bangkok";
    const currentMoment = moment().add(3, "days");
    const time = currentMoment.format("2018-MM-DD hh:00:00");

    const response = await axios.post(process.env.MODEL_API + "/predict/", {
      province,
      time
    });
    const data: ModelData = JSON.parse(response.data);

    const pm = data.predict[0];

    const message = getLineFlexMessage({
      province,
      time: currentMoment.format("[predict] MMM DD, hh:00"),
      pm
    });

    return message;
  };
}
