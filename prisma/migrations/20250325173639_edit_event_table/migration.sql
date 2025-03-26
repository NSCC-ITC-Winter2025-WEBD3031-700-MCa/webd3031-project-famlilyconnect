/*
  Warnings:

  - You are about to drop the column `assignedTo` on the `Event` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_assignedTo_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "assignedTo",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "place" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
