import express from "express";
import cors from "cors";
import routes from "../routes"; // Corrected path

const app = express();
const port = process.env.PORT || 3000;

// Middleware to allow requests from our React client
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Main API routes
app.use("/api", routes);

app.listen(port, () =>
  console.log(`🚀 Server running on http://localhost:${port}`)
);