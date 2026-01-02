import { _env } from "./env";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  namespace globalThis {
    var prisma: PrismaClient
  }
}

const adapter = new PrismaPg({
  connectionString: _env.DATABASE_URL
});
const prisma  = new PrismaClient({
  adapter
})


if(_env.NODE_ENV === "production") globalThis.prisma = prisma

export default prisma