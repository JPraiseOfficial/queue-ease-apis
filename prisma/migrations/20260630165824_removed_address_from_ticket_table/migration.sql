/*
  Warnings:

  - You are about to drop the column `address` on the `Ticket` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "idx_org_service_completed_tickets_today";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "address";

-- CreateIndex
CREATE INDEX "idx_org_service_completed_tickets_today" ON "Ticket"("orgId", "serviceId", "createdAt" DESC) WHERE (status IN ('served', 'no_show'));
