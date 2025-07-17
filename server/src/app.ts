import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import type { ErrorRequestHandler } from "express";

import router from "./router";

dotenv.config();

const app = express();

/* ------------------ CORS ------------------ */
if (process.env.CLIENT_URL != null) {
  app.use(cors({ origin: [process.env.CLIENT_URL] }));
}

/* ------------------ Parsing ------------------ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(express.raw());

/* ------------------ Routes API ------------------ */
app.use(router);

/* ------------------ Static files in production ------------------ */
const publicFolderPath = path.join(__dirname, "../../server/public");
if (fs.existsSync(publicFolderPath)) {
  app.use(express.static(publicFolderPath));
}

const clientBuildPath = path.join(__dirname, "../../client/dist");
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  app.get("*", (_, res) => {
    res.sendFile("index.html", { root: clientBuildPath });
  });
}

/* ------------------ Error middleware ------------------ */
const logErrors: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  console.error("on req:", req.method, req.path);
  next(err);
};
app.use(logErrors);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(500).json({ error: "Erreur interne du serveur" });
};
app.use(errorHandler);

export default app;
