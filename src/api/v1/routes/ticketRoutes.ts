import { Router } from "express";

import {
    getTicketsController,
    getTicketByIdController,
    createTicketController,
} from "../controllers/ticketController";

const ticketRouter: Router = Router();

// Retrieve all tickets
ticketRouter.get("/", getTicketsController);

// Retrieve ticket by ID
ticketRouter.get("/:id", getTicketByIdController);

// Create ticket
ticketRouter.post("/", createTicketController);

export default ticketRouter;