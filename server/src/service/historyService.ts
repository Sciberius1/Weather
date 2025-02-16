import { promises as fs } from 'fs';
import * as path from 'path';

// Class representing a city with an id and name
class City {
  constructor(public id: string, public name: string) {}
}

class HistoryService {
  // Path to the JSON file where search history is stored
  private filePath = path.join(__dirname, 'searchHistory.json');

  // Read the search history from the JSON file
  private async read(): Promise<City[]> {
    try {
      // Read the file content
      const data = await fs.readFile(this.filePath, 'utf-8');
      // Parse and return the JSON data as an array of City objects
      return JSON.parse(data) as City[];
    } catch (error) {
      // If the file does not exist, return an empty array
      if (error.code === 'ENOENT') {
        return [];
      }
      // Rethrow any other errors
      throw error;
    }
  }

  // Write the search history to the JSON file
  private async write(cities: City[]): Promise<void> {
    // Convert the array of City objects to a JSON string and write it to the file
    await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2), 'utf-8');
  }

  // Get the list of cities from the search history
  async getCities(): Promise<City[]> {
    // Read and return the search history
    return await this.read();
  }

  // Add a new city to the search history
  async addCity(name: string): Promise<void> {
    // Read the current search history
    const cities = await this.read();
    // Generate a new id for the city
    const id = (cities.length + 1).toString();
    // Add the new city to the list
    cities.push(new City(id, name));
    // Write the updated search history to the file
    await this.write(cities);
  }

  // Remove a city from the search history by id
  async removeCity(id: string): Promise<void> {
    // Read the current search history
    let cities = await this.read();
    // Filter out the city with the specified id
    cities = cities.filter(city => city.id !== id);
    // Write the updated search history to the file
    await this.write(cities);
  }
}

// Export an instance of the HistoryService class
export default new HistoryService();
