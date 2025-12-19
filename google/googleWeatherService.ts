import { BaseGoogleService } from "./baseGoogleService";

class GoogleClientWeatherService extends BaseGoogleService {
  constructor() {
    super();
  }

  async getWeatherDataToday(lat: number, long: number) {
    const url = `https://weather.googleapis.com/v1/forecast/days:lookup?key=${process.env.NEXT_PUBLIC_MAPS_KEY}&location.latitude=${lat}&location.longitude=${long}&days=1`;
    const data = await fetch(url);
    const json = await data.json();
    console.log("Fetched new weather data:", json);
    return json.forecastDays[0];
  }
}

export const googleClientWeatherService = new GoogleClientWeatherService();
