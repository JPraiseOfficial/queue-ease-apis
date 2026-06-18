-- DropIndex
DROP INDEX "Staff_phone_key";

-- DropIndex
DROP INDEX "idx_org_service_completed_tickets_today";

-- CreateIndex
CREATE INDEX "idx_org_service_completed_tickets_today" ON "Ticket"("orgId", "serviceId", "createdAt" DESC) WHERE (status IN ('served', 'no_show'));
