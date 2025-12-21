/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express, { type Request } from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';
import margan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';


dotenv.config();


const app = express();


app.use(cors(
  {
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5173"
      ]
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  }
));


app.use(margan('dev'));
app.use(express.json({
  limit: '100mb'
}));
app.use(express.urlencoded({
  limit: '100mb',
  extended: true
}))
app.use(cookieParser());
app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req: any) => (req.user ? 1000 : 100),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: true,
  keyGenerator: (req: any) => req.ip
});
app.use(limiter);


app.get('/gateway/health', (req, res) => {
  res.send({ message: 'Welcome to api-gateway!' });
});


// Redirect all requests with prefix to the services
app.use('/api/auth', proxy('http://localhost:6001/api/auth', {
  proxyReqPathResolver: (req: Request) => {
    return `/api/auth${req.url}`
  }
}));

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);

