/*
  Warnings:

  - A unique constraint covering the columns `[orgCode]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orgCode` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- -- AlterTable
-- ALTER TABLE "Organization" ADD COLUMN     "orgCode" TEXT NOT NULL;

-- -- AlterTable
-- ALTER TABLE "Service" ADD COLUMN     "code" TEXT NOT NULL;

ALTER TABLE "Organization" ADD COLUMN "orgCode" TEXT;
ALTER TABLE "Service" ADD COLUMN "code" TEXT;

-- 2. Update Organization using a pure incremental row number (1, 2, 3...)
UPDATE "Organization"
SET "orgCode" = CAST(seq.row_num AS TEXT)
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "createdAt" ASC) as row_num 
  FROM "Organization"
) seq
WHERE "Organization".id = seq.id;

-- 3. Update Service using a pure incremental row number (1, 2, 3...)
UPDATE "Service"
SET "code" = CAST(seq.row_num AS TEXT)
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "id" ASC) as row_num 
  FROM "Service"
) seq
WHERE "Service".id = seq.id;

-- 4. Now that every row has a clean unique value, safely enforce NOT NULL
ALTER TABLE "Organization" ALTER COLUMN "orgCode" SET NOT NULL;
ALTER TABLE "Service" ALTER COLUMN "code" SET NOT NULL;

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "ticketNo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "handledByStaff" TEXT,
    "handledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueRecord" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orgId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "totalTicketsDisbursed" INTEGER NOT NULL DEFAULT 0,
    "noOfTicketsServed" INTEGER NOT NULL DEFAULT 0,
    "noOfnoShowTickets" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "QueueRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Ticket_orgId_serviceId_createdAt_idx" ON "Ticket"("orgId", "serviceId", "createdAt" ASC) WHERE (status = 'pending');

-- CreateIndex
CREATE INDEX "QueueRecord_orgId_serviceId_idx" ON "QueueRecord"("orgId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "QueueRecord_orgId_serviceId_date_key" ON "QueueRecord"("orgId", "serviceId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_orgCode_key" ON "Organization"("orgCode");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_handledByStaff_fkey" FOREIGN KEY ("handledByStaff") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueRecord" ADD CONSTRAINT "QueueRecord_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueRecord" ADD CONSTRAINT "QueueRecord_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
