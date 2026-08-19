/*
  Warnings:

  - You are about to alter the column `fineAmount` on the `returnBook` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "returnBook" ALTER COLUMN "fineAmount" SET DATA TYPE INTEGER;
