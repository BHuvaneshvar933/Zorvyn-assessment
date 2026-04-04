import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finance Backend API",
      version: "1.0.0",
      description: "Finance Data Processing and Access Control Backend"
    },
    tags: [
      { name: "Auth" },
      { name: "Users" },
      { name: "Records" },
      { name: "Dashboard" },
      { name: "Misc" }
    ],
    servers: [
  { url: "http://localhost:5000", description: "Local" },
  { url: "https://zorvyn-assessment-jcl3.onrender.com", description: "Render" }
],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              properties: {
                message: { type: "string", example: "Invalid request" },
                code: { type: "string", example: "INVALID_REQUEST" },
                details: { type: "object" }
              }
            },
            requestId: { type: "string", example: "8b21a0d7-0e44-4f10-8e82-cf4e16b4e1a1" }
          }
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {},
            meta: { type: "object" }
          }
        },
        FinancialRecord: {
          type: "object",
          properties: {
            _id: { type: "string" },
            amount: { type: "number" },
            type: { type: "string", enum: ["INCOME", "EXPENSE"] },
            category: { type: "string" },
            date: { type: "string", format: "date-time" },
            notes: { type: "string" },
            createdBy: { type: "string" },
            isDeleted: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["VIEWER", "ANALYST", "ADMIN"] },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        }
      }
    }
  },
  apis: [
    "./src/routes/*.js",
    "./src/controllers/*.js",
    "./server.js",
    "./src/app.js"
  ]
};

const swaggerSpec = swaggerJsDoc(options);

export default swaggerSpec;
