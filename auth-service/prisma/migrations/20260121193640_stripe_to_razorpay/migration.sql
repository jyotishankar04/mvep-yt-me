/*
  Warnings:

  - You are about to drop the column `stripeId` on the `Seller` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Seller" DROP COLUMN "stripeId",
ADD COLUMN     "razorpayId" TEXT;
