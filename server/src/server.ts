import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "../routes/index.ts";

dotenv.config({ path: '../../.env' });

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: "http://localhost:4000" }));
app.use(express.json());
app.use("/api", routes);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📱 Alert API: http://localhost:${port}/api/alerts`);
});
