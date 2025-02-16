import fs from 'fs';
import path from 'path';

class HistoryService {
    private filePath = path.join(__dirname, 'searchHistory.json');

    async saveCityToHistory(cityName: string): Promise<void> {
        try {
            const history = await this.read();
            history.push(cityName);
            await fs.promises.writeFile(this.filePath, JSON.stringify(history, null, 2));
        } catch (error) {
            this.handleError(error);
        }
    }

    async getSearchHistory(): Promise<string[]> {
        try {
            const history = await this.read();
            return history;
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    async deleteCityFromHistory(cityName: string): Promise<void> {
        try {
            const history = await this.read();
            const updatedHistory = history.filter(city => city !== cityName);
            await fs.promises.writeFile(this.filePath, JSON.stringify(updatedHistory, null, 2));
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: unknown): void {
        if (error instanceof Error && error.message.includes('ENOENT')) {
            console.error('File not found, initializing with an empty history.');
            fs.promises.writeFile(this.filePath, JSON.stringify([], null, 2));
        } else {
            throw error;
        }
    }

    private async read(): Promise<string[]> {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }
}

export default HistoryService;
