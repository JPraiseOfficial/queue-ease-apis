import { AppError } from "../../common/errors/appError.js";
import { prisma } from "../../common/prisma.js";
import {
  TicketStatus,
  type TicketStatusType,
} from "../../common/types/enums.types.js";
import type { AuthTokenPayload } from "../../common/types/jwt.type.js";
import { processQueuePrediction } from "../../integrations/ml-prediction/prediction.service.js";
import type { createTicketDto, ticketCompletedDto } from "./ticket.schema.js";

export const getOrgServices = async (orgCode: string) => {
  const organization = await prisma.organization.findUnique({
    where: { orgCode },
    select: { id: true, name: true, orgCode: true, services: true },
  });

  if (!organization) {
    throw new AppError("Organization doesn't exist", 404);
  }
  if (organization.services.length === 0) {
    throw new AppError("Organization doesn't have any service", 404);
  }
  return organization
};

export const createTicket = async (data: createTicketDto) => {
  const service = await prisma.service.findUnique({
    where: { id: data.serviceId, orgId: data.orgId },
  });

  if (!service) {
    throw new AppError("Service not found for this organization", 404);
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // set to UTC midnight for consistency

  // Update queue Stats
  const result = await prisma.$transaction(async (tx) => {
    const queueStatus = await tx.queueRecord.upsert({
      where: {
        orgId_serviceId_date: {
          orgId: data.orgId,
          serviceId: data.serviceId,
          date: today,
        },
      },
      update: {
        totalTicketsDisbursed: { increment: 1 },
      },
      create: {
        orgId: data.orgId,
        serviceId: data.serviceId,
        date: today,
        totalTicketsDisbursed: 1,
      },
    });
    const queueNum = queueStatus.totalTicketsDisbursed
    const paddedNum = queueNum.toString().padStart(3, '0')
    const ticketNo = `${service.queuePrefix}-${paddedNum}`;

    // PREDICTIONS
    // const predictionPayload = {

    // }
    // const predictedWaitTime = await processQueuePrediction(data.orgId,{timestamp: new Date(), facilityModel: ""} )

    const ticket = await tx.ticket.create({
      data: {
        ...data,
        ticketNo,
        status: TicketStatus.PENDING,
      },
    });
    return { queueStatus, ticket };
  });

  // Calculate People in line
  const peopleInLine =
    result.queueStatus.totalTicketsDisbursed -
    (result.queueStatus.noOfTicketsServed +
      result.queueStatus.noOfnoShowTickets) -
    1;

  return {
    ...result.ticket,
    peopleInLine,
    // estimatedWaitTIme: , To be added after prediction is sorted.
  };
};

export const serveNext = async (staff: AuthTokenPayload) => {
  if (staff.serviceId === null) {
    return new AppError("Invalid Service Id", 400);
  }
  const ticket = await prisma.ticket.findFirst({
    where: {
      orgId: staff.orgId,
      serviceId: staff.serviceId,
      status: TicketStatus.PENDING,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!ticket) {
    throw new AppError("No pending tickets found in the queue.", 404);
  }

  const waitTime =
    Math.floor(Date.now() - new Date(ticket.createdAt!).getTime()) / (1000 * 60);

  const updatedTicket = await prisma.ticket.update({
    where: { id: ticket.id },
    data: {
      status: TicketStatus.ONGOING,
      handledByStaff: staff.id,
      handledAt: new Date(),
      waitTime,
    },
  });

  return updatedTicket;
};

export const ticketCompleted = async (
  staff: AuthTokenPayload,
  data: ticketCompletedDto,
) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: data.ticketId },
  });

  // Restricts closure of tickets out of scope of staff assignments
  if (
    !ticket ||
    ticket.orgId !== staff.orgId ||
    ticket.serviceId !== staff.serviceId
  ) {
    throw new AppError("Ticket not found", 404);
  }

  if (ticket.status !== TicketStatus.ONGOING) {
    throw new AppError(
      "Ticket must be in ONGOING status to be completed.",
      422,
    );
  }

  if (ticket.handledByStaff !== staff.id) {
    throw new AppError("You are not currently serving this ticket.", 422);
  }
  const timeSpent =
    Math.floor(Date.now() - new Date(ticket.handledAt!).getTime()) / 1000 / 60;

  const updatedTicket = await prisma.ticket.update({
    where: { id: data.ticketId },
    data: {
      status: data.status,
      completedAt: new Date(),
      timeSpent,
    },
  });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const updateField =
    data.status === TicketStatus.COMPLETED
      ? "noOfTicketsServed"
      : "noOfnoShowTickets";

  await prisma.queueRecord.update({
    where: {
      orgId_serviceId_date: {
        orgId: staff.orgId,
        serviceId: staff.serviceId,
        date: today,
      },
    },
    data: {
      [updateField]: { increment: 1 },
    },
  });

  return updatedTicket;
};
