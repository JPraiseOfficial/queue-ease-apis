-- DropIndex
DROP INDEX "idx_org_service_completed_tickets_today";

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "openingDays" TEXT[],
ALTER COLUMN "dailyCapacity" SET DATA TYPE TEXT,
ALTER COLUMN "maxQueueSize" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "idx_org_service_completed_tickets_today" ON "Ticket"("orgId", "serviceId", "createdAt" DESC) WHERE (status IN ('served', 'no_show'));
