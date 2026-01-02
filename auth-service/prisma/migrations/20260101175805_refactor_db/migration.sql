/*
  Warnings:

  - You are about to drop the column `userId` on the `Seller` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Seller` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Seller` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Seller` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Seller` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Seller" DROP CONSTRAINT "Seller_userId_fkey";

-- DropIndex
DROP INDEX "Seller_userId_key";

-- AlterTable
ALTER TABLE "Seller" DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Seller_email_key" ON "Seller"("email");
