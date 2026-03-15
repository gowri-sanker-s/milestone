/*
  Warnings:

  - You are about to alter the column `itemsPrice` on the `Cart` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `taxPrice` on the `Cart` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `shippingPrice` on the `Cart` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `totalPrice` on the `Cart` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "itemsPrice" SET DATA TYPE INTEGER,
ALTER COLUMN "taxPrice" SET DATA TYPE INTEGER,
ALTER COLUMN "shippingPrice" SET DATA TYPE INTEGER,
ALTER COLUMN "totalPrice" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "price" SET DATA TYPE INTEGER;
