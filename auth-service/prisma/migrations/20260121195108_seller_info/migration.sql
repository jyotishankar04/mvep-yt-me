-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ShopInfo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "bannerImage" TEXT,
    "logoImage" TEXT,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopInfo_sellerId_key" ON "ShopInfo"("sellerId");

-- AddForeignKey
ALTER TABLE "ShopInfo" ADD CONSTRAINT "ShopInfo_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;
