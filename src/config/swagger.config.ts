import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "QueueEase API Documentation",
      version: "1.0.0",
      description: "API documentation for the QueueEase project.",
    },
    servers: [
      {
        url: "/api",
        description: "Base API Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/modules/**/*.routes.ts",
    "./src/modules/**/*.routes.js",
    "./src/**/*.routes.ts",
    "./src/**/*.routes.js",
  ],
};

export const swaggerSpec = swaggerJSDoc(options);