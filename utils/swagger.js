import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Foodies API",
      version: "1.0.0",
      description: "Auto-generated Swagger via swagger-jsdoc",
    },
    servers: [{ url: "https://foodies-backend-m3dk.onrender.com/api/" }],
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
      { name: "Auth" },
      { name: "Users" },
      { name: "Categories" },
      { name: "Ingredients" },
      { name: "Recipes" },
      { name: "Testimonials" },
    ],
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
