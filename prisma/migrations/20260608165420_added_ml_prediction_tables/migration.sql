-- CreateTable
CREATE TABLE "LiveQueueBooking" (
    "id" SERIAL NOT NULL,
    "scanTimestamp" TIMESTAMP(3) NOT NULL,
    "facilityModel" TEXT NOT NULL,
    "facilityName" TEXT NOT NULL,
    "predictedWaitTime" INTEGER NOT NULL,
    "bookingSource" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orgId" TEXT NOT NULL,

    CONSTRAINT "LiveQueueBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueHourlyMetric" (
    "id" BIGSERIAL NOT NULL,
    "metricTimestamp" TIMESTAMPTZ NOT NULL,
    "hourlyQueueCount" INTEGER NOT NULL DEFAULT 0,
    "facilityModel" TEXT NOT NULL,
    "facilityName" TEXT NOT NULL,
    "isOverride" BOOLEAN NOT NULL DEFAULT false,
    "noShowRate" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "ticketsWhatsapp" INTEGER NOT NULL DEFAULT 0,
    "ticketsWeb" INTEGER NOT NULL DEFAULT 0,
    "ticketsSms" INTEGER NOT NULL DEFAULT 0,
    "ticketsUssd" INTEGER NOT NULL DEFAULT 0,
    "avgServiceTimeDesk1" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "avgServiceTimeDesk2" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "avgServiceTimeDesk3" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "orgId" TEXT NOT NULL,

    CONSTRAINT "QueueHourlyMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QueueHourlyMetric_metricTimestamp_idx" ON "QueueHourlyMetric"("metricTimestamp");

-- CreateIndex
CREATE INDEX "QueueHourlyMetric_facilityModel_idx" ON "QueueHourlyMetric"("facilityModel");

-- CreateIndex
CREATE INDEX "QueueHourlyMetric_facilityName_idx" ON "QueueHourlyMetric"("facilityName");

-- CreateIndex
CREATE UNIQUE INDEX "QueueHourlyMetric_metricTimestamp_facilityName_key" ON "QueueHourlyMetric"("metricTimestamp", "facilityName");

-- AddForeignKey
ALTER TABLE "LiveQueueBooking" ADD CONSTRAINT "LiveQueueBooking_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueHourlyMetric" ADD CONSTRAINT "QueueHourlyMetric_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
