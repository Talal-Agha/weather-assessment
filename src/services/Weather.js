import Network from "./Network";

export default class Form extends Network {
  constructor(data) {
    super();
    this.appId = data.appId;
    this.error = {};
  }

  clear() {
    this.error = {};
  }

  hasError() {
    return Object.keys(this.error).length > 0;
  }

  displayTemp(temp) {
    if (temp === 0) {
      return `<p class="not-found"> Data not found </p>`;
    }
    return `${parseFloat((temp * 9) / 5 - 459.67).toFixed(0)} <sup>o</sup>F`;
  }

  getLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position);
          },
          (error) => {
            this.error = {
              status: 300,
              message: error.message,
            };
            reject(error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    });
  }

  /**
   *get request to the server.
   *
   * @param  {String} url
   * @return {Promise}
   */
  get(url, data = null) {
    let queryStringData = {
      params: {
        ...data,
        appid: this.appId,
      },
    };

    return new Promise((resolve) => {
      this.api("get", url, queryStringData)
        .then((response) => resolve(response))
        .catch((error) => (this.error = error.response.data));
    });
  }
}
