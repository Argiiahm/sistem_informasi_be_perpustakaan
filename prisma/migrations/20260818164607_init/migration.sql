-- CreateEnum
CREATE TYPE "StatusReturnBook" AS ENUM ('ontime', 'duedate');

-- CreateTable
CREATE TABLE "returnBook" (
    "id" TEXT NOT NULL,
    "fineAmount" BIGINT NOT NULL DEFAULT 0,
    "status" "StatusReturnBook" NOT NULL DEFAULT 'ontime',
    "borrowId" TEXT NOT NULL,

    CONSTRAINT "returnBook_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "returnBook" ADD CONSTRAINT "returnBook_borrowId_fkey" FOREIGN KEY ("borrowId") REFERENCES "borrowBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
