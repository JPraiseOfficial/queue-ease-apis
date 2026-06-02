/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `availability` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "availability" TEXT NOT NULL,
ADD COLUMN     "closingTime" TEXT,
ADD COLUMN     "openingTime" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");
