import { BaseGoogleService } from "./baseGoogleService";

class GoogleClientWeatherService extends BaseGoogleService {
  constructor() {
    super();
  }

  async getWeatherDataToday() {
    const cacheKey = "weatherDataToday";
    const cachedData = this._getCacheValue(cacheKey);
    if (cachedData) {
      console.log("Returning cached weather data");
      return cachedData;
    }
    const url = `https://weather.googleapis.com/v1/forecast/days:lookup?key=${process.env.NEXT_PUBLIC_MAPS_KEY}&location.latitude=53.532259&location.longitude=-113.5808211&days=1`;
    const data = await fetch(url);
    const json = await data.json();
    console.log("Fetched new weather data:", json);
    this._setCacheValue(cacheKey, json);
    return json.forecastDays[0];
  }
}

export const googleClientWeatherService = new GoogleClientWeatherService();
