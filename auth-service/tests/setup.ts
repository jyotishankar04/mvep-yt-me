import { afterAll, beforeAll, beforeEach } from "vitest";
import prisma from "../src/config/prismaclient.config";

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.refreshToken.deleteMany();
  await prisma.deviceSession.deleteMany();
  await prisma.userSession.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
