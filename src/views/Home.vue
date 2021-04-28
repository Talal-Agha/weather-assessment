<template>
  <div>
    <div class="site-content">
      <section class="find-area">
        <div class="container">
          <form
            @submit.prevent="onSubmit"
            class="find-location"
            @keydown="weatherObject.clear()"
          >
            <city-input v-model="form.city" :items="cities" />
            <input type="submit" value="Find" />
          </form>
        </div>
      </section>
      <section>
        <div class="container">
          <div class="forecast-container">
            <div class="today forecast">
              <div class="forecast-header">
                <template v-if="weatherObject.hasError()">
                  <div class="message-area">
                    <img src="images/icons/info.svg" alt="" width="18" />
                    <div class="error-message px-2">
                      {{ weatherObject.error.message }}
                    </div>
                  </div>
                </template>
              </div>
              <!-- .forecast-header -->
              <div class="forecast-content">
                <div class="location">
                  <h3>{{ weather.name }} {{ weather.country }}</h3>
                </div>
                <div class="degree">
                  <div
                    class="num"
                    v-html="weatherObject.displayTemp(weather.temperature)"
                  ></div>
                  <div v-if="weather.temperature != 0" class="forecast-icon">
                    <img :src="weatherIcon(weather.type)" alt="" width="90" />
                  </div>
                </div>
                <span
                  ><img src="images/icons/umberella.png" alt="" />Humidity :
                  {{ weather.humidity }}</span
                >
                <span
                  ><img src="images/icons/wind.png" alt="" />Wind:
                  {{ weather.wind }} km/h</span
                >
                <span
                  ><img src="images/icons/compass.png" alt="" />Pressure:
                  {{ weather.pressure }}</span
                >
                <span
                  ><img src="images/icons/compass.png" alt="" />Type:
                  {{ weather.type }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Weather from "@/services/Weather";
import CityInput from "@/components/CityInput";
import cities from "@/data/city.list.json";
const appId = process.env.VUE_APP_WEATHER_SECRET;

export default {
  name: "Home",
  components: {
    CityInput,
  },
  data() {
    return {
      weatherObject: new Weather({
        appId: appId,
      }),
      cities: cities,
      weatherInfo: {},
      form: {
        city: ''
      }
    };
  },
  computed: {
    weather() {
      let { name, sys, main, wind, weather } = this.weatherInfo;
      return {
        name,
        country: sys?.country,
        sunrise: sys?.sunrise,
        temperature: main?.temp || 0,
        humidity: main?.humidity,
        pressure: main?.pressure,
        wind: wind?.speed,
        type: weather ? weather[0]?.main : "",
      };
    },
  },
  methods: {
    onSubmit() {
      if (!this.form.city) {
        this.weatherObject.error = {
          message: "Field is required",
        };
        return;
      }
      this.getWeatherInfo({
        q: this.form.city
      });
    },
    async getWeatherInfo(input) {
      let { data: weatherInfo } = await this.weatherObject.get("weather",input);
      this.weatherInfo = weatherInfo;
    },

    weatherIcon(type) {
      return `images/icons/${type}.svg`;
    },
  },
  created() {
    this.weatherObject.getLocation().then(({ coords }) => {
      this.getWeatherInfo({
        lat: coords.latitude,
        lon: coords.longitude,
      });
    });
  },
};
</script>
