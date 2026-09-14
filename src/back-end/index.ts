import express from 'express';
import { tmdbAccessToken } from './config';

// Create a new express application instance
const app = express();

// Define the port number for the server to listen on
const port: number = 3000;

// Define a route handler for the root URL ('/')
app.get('/', (_req: express.Request, res: express.Response) => {
  res.send('Hello World from TypeScript!');
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Example app in TypeScript listening on port ${port}`);
});

// Define a route handler for fetching popular movies from TMDB API
app.get('/api/movies/popular', async (_req: express.Request, res: express.Response) => {
  try {
    const response = await fetch('https://api.themoviedb.org/3/movie/popular', {
      headers: {
        Authorization: `Bearer ${tmdbAccessToken}`,
        'Content-Type': 'application/json;charset=utf-8'
      }
    });

    if (!response.ok) {
      throw new Error(`TMDB API request failed with status ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular movies' });
  }
});