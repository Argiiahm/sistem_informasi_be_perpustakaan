/*
  Warnings:

  - You are about to drop the `Refreshtoken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `no_telp` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Refreshtoken" DROP CONSTRAINT "Refreshtoken_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "no_telp" TEXT NOT NULL;

-- DropTable
DROP TABLE "Refreshtoken";

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
