import { Router, Request, Response } from 'express';
import WeatherService from '../../service/weatherService';
import HistoryService from '../../service/historyService';

const router = Router();
const weatherService = new WeatherService(process.env.API_KEY, process.env.API_BASE_URL);
const historyService = new HistoryService();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { cityName } = req.body;
    const weatherData = await weatherService.getWeatherByCityName(cityName);
    await historyService.saveCityToHistory(cityName);
    res.json(weatherData);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await historyService.getSearchHistory();
    res.json(history);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete('/history/:cityName', async (req: Request, res: Response) => {
  try {
    const { cityName } = req.params;
    await historyService.deleteCityFromHistory(cityName);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
