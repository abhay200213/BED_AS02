import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import { HttpStatus } from "./constants/httpStatus";

const app: Express = express();

// Log incoming HTTP requests
app.use(morgan("dev"));

// Parse incoming JSON requests
app.use(express.json());

// API health check endpoint
app.get("/api/v1/health", (_req: Request, res: Response): void => {
    res.status(HttpStatus.OK).json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

export default app;