/*
  Warnings:

  - Added the required column `avgTime` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `closingTime` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dailyCapacity` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxQueueSize` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openingTime` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `queuePrefix` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "idx_org_service_completed_tickets_today";

-- Add the new columns as NULLABLE first
ALTER TABLE "Service" ADD COLUMN "avgTime" INTEGER;
ALTER TABLE "Service" ADD COLUMN "closingTime" TEXT;
ALTER TABLE "Service" ADD COLUMN "dailyCapacity" INTEGER;
ALTER TABLE "Service" ADD COLUMN "department" TEXT;
ALTER TABLE "Service" ADD COLUMN "maxQueueSize" INTEGER;
ALTER TABLE "Service" ADD COLUMN "openingTime" TEXT;
ALTER TABLE "Service" ADD COLUMN "queuePrefix" TEXT;

-- Mirror the existing "code" column into "queuePrefix"
UPDATE "Service" 
SET 
    "avgTime" = 900,
    "openingTime" = '08:00',
    "closingTime" = '17:00',
    "dailyCapacity" = 100,
    "maxQueueSize" = 30,
    "department" = 'General',
    -- UPPER("code") copies the string directly and forces it into capital letters
    "queuePrefix" = UPPER("code");

-- Safely enforce the NOT NULL constraint now that everything is populated
ALTER TABLE "Service" ALTER COLUMN "avgTime" SET NOT NULL;
ALTER TABLE "Service" ALTER COLUMN "closingTime" SET NOT NULL;
ALTER TABLE "Service" ALTER COLUMN "dailyCapacity" SET NOT NULL;
ALTER TABLE "Service" ALTER COLUMN "department" SET NOT NULL;
ALTER TABLE "Service" ALTER COLUMN "maxQueueSize" SET NOT NULL;
ALTER TABLE "Service" ALTER COLUMN "openingTime" SET NOT NULL;
ALTER TABLE "Service" ALTER COLUMN "queuePrefix" SET NOT NULL;

-- CreateIndex
CREATE INDEX "idx_org_service_completed_tickets_today" ON "Ticket"("orgId", "serviceId", "createdAt" DESC) WHERE (status IN ('served', 'no_show'));
