/// <reference path="./types/express.d.ts" />
import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './middlewares/error-middleware';
import cookieParser from 'cookie-parser';
import { _env } from './config';
import categoryRoutes from './routes/category.routes';
import productRoutes from './routes/product.routes';
const host = process.env.HOST ?? 'localhost';
const port = _env.PORT ? Number(_env.PORT) : 6001;
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
app.use(cookieParser());
app.use(express.json({
    limit: '100mb'
}));
app.use(express.urlencoded({
    limit: '100mb',
    extended: true
}));

app.use('/api/products/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use(errorMiddleware);


const server = app.listen(port, () => {
    console.log(`Auth Service is listening at http://${host}:${port}/api`);
    console.log(`Docs at http://${host}:${port}/api-docs`);
});
server.on('error', console.error);
