/*
  Warnings:

  - Added the required column `updated_at` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RefreshToken_userId_idx";

-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
