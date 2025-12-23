-- CreateEnum
CREATE TYPE "SellerAccountCreationStatus" AS ENUM ('SETUP', 'CONNECT', 'COMPLETED', 'INIT');

-- AlterTable
ALTER TABLE "sellers" ADD COLUMN     "registration_status" "SellerAccountCreationStatus" NOT NULL DEFAULT 'INIT';
