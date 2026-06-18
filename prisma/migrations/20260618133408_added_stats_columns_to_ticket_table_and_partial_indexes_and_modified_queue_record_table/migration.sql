-- DropIndex
DROP INDEX "QueueRecord_orgId_serviceId_idx";

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "timeSpent" INTEGER,
ADD COLUMN     "waitTime" INTEGER;

-- CreateIndex
CREATE INDEX "QueueRecord_orgId_date_idx" ON "QueueRecord"("orgId", "date");

-- CreateIndex
CREATE INDEX "idx_org_service_ongoing_tickets" ON "Ticket"("orgId", "serviceId", "createdAt" ASC) WHERE (status = 'ongoing');

-- CreateIndex
CREATE INDEX "idx_org_service_completed_tickets_today" ON "Ticket"("orgId", "serviceId", "createdAt" DESC) WHERE (status IN ('served', 'no_show'));

-- RenameIndex
ALTER INDEX "Ticket_orgId_serviceId_createdAt_idx" RENAME TO "idx_org_service_pending_tickets";
