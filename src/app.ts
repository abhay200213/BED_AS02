import express, {Express, Request, Response} from "express";

const app: Express = express ()

// Middleware to parse incoming JSON requests
app.use(express.json());

//Health check endpoint
app.get("/health", (_req: Request, res: Response): void => {
    res.status(200).json({
        status: "ok",
        message: "Support Ticket API is running",
    });
});

export default app;