import { BaseGoogleService } from "./baseGoogleService";

class GoogleClientWeatherService extends BaseGoogleService {
  private _cacheKey = "weatherData";
  constructor() {
    super();
  }

  async getWeatherDataToday() {
    const cachedData = this._getCacheValue(this._cacheKey);
    // if (cachedData) {
    //   console.log("Returning cached weather data");
    //   return cachedData;
    // }
    const url = `https://weather.googleapis.com/v1/forecast/days:lookup?key=${process.env.NEXT_PUBLIC_MAPS_KEY}&location.latitude=53.532259&location.longitude=-113.5808211&days=1`;
    const data = await fetch(url);
    const json = await data.json();
    console.log("Fetched new weather data:", json);
    this._setCacheValue(this._cacheKey, json, 60 * 1000);
    return json.forecastDays[0];
  }
}

export const googleClientWeatherService = new GoogleClientWeatherService();
