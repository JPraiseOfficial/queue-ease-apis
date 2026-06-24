-- DropIndex
DROP INDEX "idx_org_service_completed_tickets_today";

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "emailVerifyExpiry" TIMESTAMP(3),
ADD COLUMN     "emailVerifyToken" TEXT,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordResetExpiry" TIMESTAMP(3),
ADD COLUMN     "passwordResetToken" TEXT;

-- CreateIndex
CREATE INDEX "idx_org_service_completed_tickets_today" ON "Ticket"("orgId", "serviceId", "createdAt" DESC) WHERE (status IN ('served', 'no_show'));
