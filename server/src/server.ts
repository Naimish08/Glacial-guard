import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "../routes/index.ts";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically
app.use('/api/uploads', express.static('uploads'));

app.use("/api", routes);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📱 Alert API: http://localhost:${port}/api/alerts`);
});
