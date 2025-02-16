class WeatherService {
    private apiKey: string;
    private apiUrl: string;

    constructor(apiKey: string, apiUrl: string) {
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
    }

    async getWeatherByCityName(cityName: string): Promise<any> {
        const response = await fetch(`${this.apiUrl}?q=${cityName}&appid=${this.apiKey}`);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        return response.json();
    }

    // Remove unused methods
    // private buildGeocodeQuery(): string { ... }
    // private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] { ... }
}

export default WeatherService;
