-- CreateEnum
CREATE TYPE "StatusborrowBook" AS ENUM ('pending', 'accepted', 'rejected', 'returned');

-- CreateTable
CREATE TABLE "borrowBook" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "loanDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "StatusborrowBook" NOT NULL DEFAULT 'pending',

    CONSTRAINT "borrowBook_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "borrowBook" ADD CONSTRAINT "borrowBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrowBook" ADD CONSTRAINT "borrowBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
