import axios from "axios";
import store from "@/store";

function transferData(params) {
  return JSON.stringify({
    user: store.state.user,
    ...params,
  });
}

export default async (api, params) => {
  let res = await axios({
    baseURL: "http://localhost:5555/",
    url: api,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    dataType: "JSON",
    data: transferData(params),
  });
  return res.data;
};
