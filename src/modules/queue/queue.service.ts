import { AppError } from "../../common/errors/appError.js";
import { prisma } from "../../common/prisma.js";
import { TicketStatus } from "../../common/types/enums.types.js";

type queueMetricsType = {
  orgId: string;
  serviceId: string;
  date: Date;
  totalTicketsDisbursed: number;
  noOfTicketsServed: number;
  noOfnoShowTickets: number;
  totalInQueue: number;
  peopleWaiting: number;
  avgWaitTimeInMins: number;
};

type queueSnapshot = {
  serviceName: string;
  waitingCount: number;
  completedCount: number;
  status: string;
};

export const serviceQueueLiveStatus = async (
  orgId: string,
  serviceId: string,
) => {
  // Verify Service belongs to organization
  const service = await prisma.service.findUnique({
    where: { id: serviceId }
  });

  if (!service || service?.orgId !== orgId) {
    throw new AppError("Service not found for this organization", 404);
  }

  const pendingTickets = await prisma.ticket.findMany({
    where: {
      AND: [{ orgId }, { serviceId }, { status: TicketStatus.PENDING }],
    },
    orderBy: { createdAt: "asc" },
    select: { id: true, ticketNo: true, source: true, createdAt: true },
  });

  const ongoingTicket = await prisma.ticket.findMany({
    where: {
      AND: [{ orgId }, { serviceId }, { status: TicketStatus.ONGOING }],
    },
    orderBy: { createdAt: "asc" },
    select: { id: true, ticketNo: true, createdAt: true, handledAt: true },
  });

  const completedTickets = await prisma.ticket.findMany({
    where: {
      AND: [
        { orgId },
        { serviceId },
        { status: { in: [TicketStatus.COMPLETED || TicketStatus.NO_SHOW] } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      ticketNo: true,
      waitTime: true,
      createdAt: true,
      completedAt: true,
    },
  });

  // ==== QUEUE STATUS ====
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const queueStatus = await prisma.queueRecord.findUnique({
    where: {
      orgId_serviceId_date: { orgId, serviceId, date: today },
    },
  });

  let queueMetrics: queueMetricsType = {
    orgId,
    serviceId,
    date: today,
    totalTicketsDisbursed: 0,
    noOfTicketsServed: 0,
    noOfnoShowTickets: 0,
    totalInQueue: 0,
    peopleWaiting: 0,
    avgWaitTimeInMins: 0,
  };

  if (queueStatus) {
    const totalInQueue =
      queueStatus.totalTicketsDisbursed -
      (queueStatus.noOfTicketsServed + queueStatus.noOfnoShowTickets);
    const peopleWaiting = totalInQueue - ongoingTicket.length;

    // Calculate Average Wait Time (in mins)
    let avgWaitTimeInMins: number;
    if (completedTickets.length === 0) {
      avgWaitTimeInMins = 0;
    } else {
      const totalWaitTime = completedTickets.reduce((accumulator, ticket) => {
        return accumulator + (ticket.waitTime || 0);
      }, 0);

      avgWaitTimeInMins = Math.round(totalWaitTime / completedTickets.length);

      queueMetrics = {
        ...queueStatus,
        totalInQueue,
        peopleWaiting,
        avgWaitTimeInMins,
      };
    }
  }

  return {
    queueMetrics,
    pendingTickets,
    ongoingTicket,
    completedTickets,
  };
};

export const overallQueueLiveStatus = async (orgId: string) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const queueStatus = await prisma.queueRecord.findMany({
    where: {
      orgId,
      date: today,
    },
    include: { service: { select: { name: true } } },
  });

  const activeQueue = queueStatus.length;
  const completedToday = queueStatus.reduce((accumulator, service) => {
    return accumulator + (service.noOfTicketsServed || 0);
  }, 0);
  const waitingCustomers = queueStatus.reduce((accumulator, service) => {
    let waiting =
      service.totalTicketsDisbursed -
      (service.noOfTicketsServed + service.noOfnoShowTickets);
    return accumulator + (waiting || 0);
  }, 0);

  const mappedQueueMetrics: queueSnapshot[] = queueStatus.map((item) => {
    const serviceName = item.service.name;
    const completedCount = item.noOfTicketsServed + item.noOfnoShowTickets;
    const waitingCount = item.totalTicketsDisbursed - completedCount;

    return {
      serviceName,
      waitingCount,
      completedCount,
      status: (waitingCount !== 0 ? "active" : "Inactive"),
    };
  });

  const res = {
    stats: { activeQueue, completedToday, waitingCustomers },
    queueSnapshot: mappedQueueMetrics,
  };
  return res;
};
