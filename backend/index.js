import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./libs/db.js";
import videoRoutes from "./routes/Videorouter.js";
import { fal } from "@fal-ai/client";
import * as falProxy from "@fal-ai/server-proxy/express";
dotenv.config({ path: ".env" });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
fal.config({
  credentials: process.env.FAL_KEY,
});

console.log(process.env.FAL_KEY);

connectDB();
app.all(falProxy.route, cors(), falProxy.handler);
app.use("/api/videos", videoRoutes);

app.get("/", (req, res) => {
  return res.json({
    msg: "Hello Health check",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on Port ${process.env.PORT}`);
});
