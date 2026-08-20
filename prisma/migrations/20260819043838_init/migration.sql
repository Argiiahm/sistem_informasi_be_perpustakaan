/*
  Warnings:

  - Added the required column `returnDate` to the `returnBook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "returnBook" ADD COLUMN     "returnDate" TIMESTAMP(3) NOT NULL;
