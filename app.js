import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { sequelize } from "./db/sequelize.js";
import "./models/index.js";
import { runSeed } from "./db/seed.js";
import apiRouter from "./routes/api.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utils/swagger.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use(express.static(path.join(process.cwd(), "public")));

app.get("/", (req, res) => {
  res.json({ docs: "/swagger", api: "/api" });
});
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", apiRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");
    if (process.env.SYNC === "true") {
      await sequelize.sync({ alter: true });
    }
    if (process.env.SEED === "true") {
      console.log("Running seed...");
      await runSeed();
      console.log("Seed finished.");
    }
    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    });
  } catch (error) {
    console.error(error.message || error);
    process.exit(1);
  }
};

start();
