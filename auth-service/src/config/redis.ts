import { Redis } from "ioredis";
import { _env } from ".";

const redis = new Redis({
    host: _env.REDIS_HOST,
    port: Number(_env.REDIS_PORT),
});

export default redis