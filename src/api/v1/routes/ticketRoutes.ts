import { Router } from "express";

import {
    getTicketsController,
    getTicketByIdController,
    createTicketController,
    updateTicketController,
    deleteTicketController,
    getTicketUrgencyController,
} from "../controllers/ticketController";

const ticketRouter: Router = Router();

// Retrieve all tickets
ticketRouter.get("/", getTicketsController);

// Retrieve ticket by ID
ticketRouter.get("/:id", getTicketByIdController);

// Create ticket
ticketRouter.post("/", createTicketController);

// Update an existing ticket
ticketRouter.put("/:id", updateTicketController);

// Delete an existing ticket
ticketRouter.delete("/:id", deleteTicketController);

// Calculate ticket urgency
ticketRouter.get("/:id/urgency", getTicketUrgencyController);

export default ticketRouter;