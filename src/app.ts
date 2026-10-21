import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import { HttpStatus } from "./constants/httpStatus";
import ticketRouter from "./api/v1/routes/ticketRoutes";

const app: Express = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());

// Health check
app.get("/api/v1/health", (_req: Request, res: Response): void => {
    res.status(HttpStatus.OK).json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

// Ticket routes
app.use("/api/v1/tickets", ticketRouter);

export default app;