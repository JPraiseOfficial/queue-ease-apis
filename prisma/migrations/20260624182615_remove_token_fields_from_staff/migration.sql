/*
  Warnings:

  - You are about to drop the column `emailVerifyExpiry` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerifyToken` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetExpiry` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetToken` on the `Staff` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "idx_org_service_completed_tickets_today";

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "emailVerifyExpiry",
DROP COLUMN "emailVerifyToken",
DROP COLUMN "passwordResetExpiry",
DROP COLUMN "passwordResetToken";

-- CreateIndex
CREATE INDEX "idx_org_service_completed_tickets_today" ON "Ticket"("orgId", "serviceId", "createdAt" DESC) WHERE (status IN ('served', 'no_show'));
