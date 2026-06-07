import { prisma } from "../../common/prisma.js";
import { AppError } from "../../common/errors/appError.js";
import type { GetPredictionDto } from "./prediction.schema.js";

// I am preparing the service function that will eventually send data to the Python server
export const processQueuePrediction = async (
  orgId: string,
  data: GetPredictionDto
) => {
  // TODO: In the future, we will use axios or fetch here to call the Render URL:
  // const pythonResponse = await axios.post('https://queue-ease-ml-engine.onrender.com/predict_queue', data);
  
  // For right now, I am creating dummy variables to test the database pipeline
  const simulatedWaitTime = 24; 
  const simulatedCrowd = 6;

  // I am saving the prediction directly to our unified Prisma database
  const booking = await prisma.liveQueueBooking.create({
    data: {
      scanTimestamp: new Date(data.timestamp),
      facilityModel: data.facilityModel,
      facilityName: data.facilityName,
      predictedWaitTime: simulatedWaitTime,
      bookingSource: data.bookingSource,
      orgId: orgId
    }
  });

  // I am returning the compiled data to the controller
  return {
    ticketNumber: booking.id,
    predictedPeopleInLine: simulatedCrowd,
    estimatedWaitRawMinutes: simulatedWaitTime
  };
};