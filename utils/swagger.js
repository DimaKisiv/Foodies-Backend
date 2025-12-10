import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Foodies API",
      version: "1.0.0",
      description: "Auto-generated Swagger via swagger-jsdoc",
    },
    servers: [{ url: "/api" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: "Users" },
      { name: "Categories" },
      { name: "Ingredients" },
      { name: "Recipes" },
      { name: "Testimonials" },
      { name: "Auth" },
      { name: "All" },
    ],
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
