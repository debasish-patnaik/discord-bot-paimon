/*
  Warnings:

  - You are about to drop the column `notified` on the `Resins` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Resins" DROP COLUMN "notified",
ADD COLUMN     "notifiedAt" TIMESTAMP(6),
ADD COLUMN     "shouldNotify" BOOLEAN NOT NULL DEFAULT false;
