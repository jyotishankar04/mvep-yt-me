import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './middlewares/error-middleware';
import authRoutes from './routes/auth.routes';
import swaggerUi    from 'swagger-ui-express';
import cookieParser from 'cookie-parser';

const swaggerDocument = require('./swagger-output.json');
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 6001;
const app = express();

app.use(cors(
    {
        origin: ["http://localhost:3000"],
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



app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
)
app.get("/docs-json", (req, res) => {
    res.json(swaggerDocument);
})

app.use("/api/auth", authRoutes);



app.use(errorMiddleware)


const server = app.listen(port, () => {
    console.log(`Auth Service is listening at http://${host}:${port}/api`);
    console.log(`Docs at http://${host}:${port}/api-docs`);
});
server.on('error', console.error);
