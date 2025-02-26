class WeatherService {
    private apiKey: string;
    private apiUrl: string;

    constructor() {
        this.apiKey = process.env.API_KEY || '';
        this.apiUrl = process.env.API_BASE_URL || '';
    }

    async getWeatherByCityName(cityName: string): Promise<any> {
        const response = await fetch(`${this.apiUrl}?q=${cityName}&appid=${this.apiKey}`);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        return response.json();
    }
}

export default WeatherService;
