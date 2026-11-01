import express from 'express';
import { registerHealthApi } from './api/health-api';
import { registerMoviesApi } from './api/movies-api';

// Create a new express application instance
const app = express();

// Register API routes from dedicated modules
registerHealthApi(app);
registerMoviesApi(app);

// Start the server and listen on the specified port
const port: number = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
