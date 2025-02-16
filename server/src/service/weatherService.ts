import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from a .env file

interface Coordinates {
  latitude: number;
  longitude: number;
}

// Class representing weather data
class Weather {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;

  constructor(temperature: number, description: string, humidity: number, windSpeed: number) {
    this.temperature = temperature;
    this.description = description;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}

// Service class to interact with the weather API
class WeatherService {
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5'; // Base URL for the weather API
    this.apiKey = process.env.WEATHER_API_KEY || ''; // API key from environment variables
    this.cityName = ''; // City name to fetch weather for
  }

  // Fetch location data (latitude and longitude) for a given city name
  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`);
    return response.json();
  }

  // Extract latitude and longitude from the location data
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData[0];
    return { latitude: lat, longitude: lon };
  }

  // Build the query URL for geocoding API
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
  }

  // Build the query URL for weather API using coordinates
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}&units=metric`;
  }

  // Fetch and extract coordinates for the current city
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.cityName);
    return this.destructureLocationData(locationData);
  }

  // Fetch weather data using coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    return response.json();
  }

  // Parse the weather data into a Weather object
  private parseCurrentWeather(response: any): Weather {
    const { main, weather, wind } = response;
    return new Weather(main.temp, weather[0].description, main.humidity, wind.speed);
  }

  // Build an array of Weather objects from forecast data
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    return weatherData.map((data: any) => {
      const { main, weather, wind } = data;
      return new Weather(main.temp, weather[0].description, main.humidity, wind.speed);
    });
  }

  // Public method to get weather for a given city
  async getWeatherForCity(city: string): Promise<Weather> {
    this.cityName = city; // Set the city name
    const coordinates = await this.fetchAndDestructureLocationData(); // Get coordinates for the city
    const weatherData = await this.fetchWeatherData(coordinates); // Fetch weather data using coordinates
    return this.parseCurrentWeather(weatherData); // Parse and return the weather data
  }
}

export default new WeatherService(); // Export an instance of WeatherService
