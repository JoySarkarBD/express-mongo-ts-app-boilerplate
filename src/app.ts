// External imports
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// Security Middleware Import
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import config from './config/config';
import PathNotFound from './helpers/responses/path-not-found';

// Express app initialization
const app: Application = express();

// Define the path to the public directory
const publicDirPath = path.join(__dirname, '..', 'public');

// Middleware setup
app.use(express.json({ limit: config.MAX_JSON_SIZE }));
app.use(express.urlencoded({ extended: config.URL_ENCODED }));
app.use(cookieParser());

// Security middleware initialization
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());
app.use(morgan('dev'));

// Request Rate Limiting
const limiter = rateLimit({
  windowMs: config.REQUEST_LIMIT_TIME,
  max: process.env.NODE_ENV === 'production' ? config.REQUEST_LIMIT_NUMBER : Infinity, // unlimited in development
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

// Serve static files from the public directory
app.use(express.static(publicDirPath));

// Dynamically load routes
const routesPath = path.join(__dirname, 'routes');

fs.readdirSync(routesPath).forEach((folder) => {
  const folderPath = path.join(routesPath, folder);

  if (fs.statSync(folderPath).isDirectory()) {
    const routePrefix = `/api/v1/${folder}`;
    const routeFile = path.join(folderPath, 'index.ts');

    // Load the route file dynamically
    app.use(routePrefix, require(routeFile));
  }
});

// Serve an image file on the root route
app.get('/', (req: Request, res: Response) => {
  // Path to the image file
  const imagePath = path.join(publicDirPath, 'images', 'index.png');

  // Send the image file as a response
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error(`Failed to send image file: ${err.message}`);
      res.status(500).send('Failed to send image.');
    }
  });
});

// Use the "Path not found" handler after all routes
app.use(PathNotFound);

// Module exports
export default app;
