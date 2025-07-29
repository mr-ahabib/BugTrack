import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import { createServer } from 'http';
import compression from 'compression';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import hpp from 'hpp';
import db from './config/sequelize'; // Adjust path
import routes from './routes/index';
import { errorMiddleware } from "./middleware/error";
import morganMiddleware from './logger/morganLogger';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '8080', 10);
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

// Define uploads path consistently (adjust to your multer folder)
const uploadsPath = path.join(__dirname, '..', 'uploads');
console.log('Serving uploads from:', uploadsPath);

// Ensure uploads folder exists
if (!fs.existsSync(uploadsPath)) {
  console.log('Uploads folder missing, creating now...');
  fs.mkdirSync(uploadsPath);
  console.log('Uploads folder created.');
} else {
  console.log('Uploads folder already exists.');
}

// Middleware setup
app.use(morganMiddleware);
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());
app.use(hpp());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads folder once, using the consistent path
app.use('/uploads', express.static(uploadsPath));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret', // Use a secure secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);

// Define the routes
app.use("", routes);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

// Error-handling middleware
app.use(errorMiddleware);

// Create HTTP server
const server = createServer(app);

// Connect to database
db.authenticate()
  .then(() => console.log('Database connected successfully!'))
  .catch(err => console.error('Database connection failed:', err));

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
