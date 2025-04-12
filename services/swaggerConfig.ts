import { Options } from "swagger-jsdoc";

const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Food Order API",
      version: "1.0.0",
      description: "API documentation for the Food Order Backend",
    },
    servers: [
      {
        url: "http://localhost:8000", 
      },
    ],
  },
  apis: ["../routes/*.ts"],
};

export default swaggerOptions;