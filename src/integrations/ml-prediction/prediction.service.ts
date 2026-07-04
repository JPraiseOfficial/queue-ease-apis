import { prisma } from "../../common/prisma.js";
import type { GetPredictionDto } from "./prediction.schema.js";
import { ENV } from "../../config/env.js";

type PredictionApiResponse = {
  predictedWaitTime?: number;
  predicted_wait_time?: number;
  estimatedWaitRawMinutes?: number;
  estimated_wait_raw_minutes?: number;
  predictedPeopleInLine?: number;
  predicted_people_in_line?: number;
  crowd?: number;
};

// I am preparing the service function that will eventually send data to the Python server
export const processQueuePrediction = async (
  orgId: string,
  data: GetPredictionDto,
) => {
  try {
    // 1. We DEFINE the variable first
    const prophetFriendlyTime = data.timestamp.slice(0, 19).replace("T", " ");
    // I am manually translating the TypeScript camelCase keys into Python snake_case keys so the ML Engine understands the payload
    const pythonPayload = {
      timestamp: prophetFriendlyTime,
      facility_model: data.facilityModel,
      facility_name: data.facilityName,
      booking_source: data.bookingSource,
      phone_number: data.phoneNumber,
    };

    const response = await fetch(ENV.ML_ENGINE_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // I am sending the properly translated payload over the network
      body: JSON.stringify(pythonPayload),
      // signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return { error: "Error getting predictions" };
    }

    const prediction = (await response.json()) as PredictionApiResponse;

    // I am scanning the Python response for the correct wait time output
    const predictedWaitTime =
      prediction.predictedWaitTime ??
      prediction.predicted_wait_time ??
      prediction.estimatedWaitRawMinutes ??
      prediction.estimated_wait_raw_minutes;

    // I am scanning the Python response for the correct crowd count output
    const predictedPeopleInLine =
      prediction.predictedPeopleInLine ??
      prediction.predicted_people_in_line ??
      prediction.crowd;

    if (
      typeof predictedWaitTime !== "number" ||
      typeof predictedPeopleInLine !== "number"
    ) {
      return { error: "Error getting predictions" };
    }

    // I am saving the prediction directly to our unified Prisma database
    const booking = await prisma.liveQueueBooking.create({
      data: {
        scanTimestamp: new Date(data.timestamp),
        facilityModel: data.facilityModel,
        facilityName: data.facilityName,
        predictedWaitTime,
        bookingSource: data.bookingSource,
        orgId: orgId,
      },
    });

    // I am returning the compiled data to the controller
    return {
      ticketNumber: booking.id,
      predictedPeopleInLine,
      estimatedWaitRawMinutes: predictedWaitTime,
    };
  } catch (error: any) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      return { error: "Service Timeout" };
    } else {
      return { error: error.name };
    }
  }
};
