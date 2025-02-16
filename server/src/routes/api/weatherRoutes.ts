import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const { cityName } = req.body;
    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }

    // GET weather data from city name
    const weatherData = await WeatherService.getWeatherByCityName(cityName);

    // Save city to search history
    await HistoryService.saveCityToHistory(cityName);

    res.status(200).json(weatherData);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving weather data' });
  }
});

// GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const history = await HistoryService.getSearchHistory();
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    // DELETE city from search history by ID
    await HistoryService.deleteCityFromHistory(id);

    res.status(200).json({ message: 'City deleted from search history' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting city from search history' });
  }
});

export default router;
