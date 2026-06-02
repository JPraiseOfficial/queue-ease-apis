// import "dotenv/config";
// import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// import { PrismaClient } from "../generated/prisma/client.js";
// import { ENV } from "../config/env.js";

// const adapter = new PrismaMariaDb({
//   host: ENV.DB_HOST,
//   user: ENV.DB_USER,
//   password: ENV.DB_PASS,
//   database: ENV.DB_NAME,
//   connectionLimit: 5,
// });
// const prisma = new PrismaClient({ adapter });

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// Connect to Database
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};

export { prisma };
