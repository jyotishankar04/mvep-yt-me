import { createServer } from "./index";
import { _env } from "./config/env";

async function bootstrap() {
  const app = await createServer();
  app.listen(_env.PORT, () =>
    console.log(`Auth service running on ${_env.PORT}`),
  );
}

bootstrap();
