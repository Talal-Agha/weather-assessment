import axios from "axios";
const weatherBaseUrl = process.env.VUE_APP_WEATHER_BASE_URL;
export default class Network {
  constructor() {
    axios.defaults.baseURL = weatherBaseUrl;
  }
  async api(method, url, data = null) {
    return new Promise((resolve, reject) => {
      axios[method.toLowerCase()](url, data)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }
}
