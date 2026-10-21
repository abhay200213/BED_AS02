import { Router } from "express";
import {
    getTicketsController,
    getTicketByIdController,
} from "../controllers/ticketController";

const ticketRouter: Router = Router();

// Retrieve all tickets
ticketRouter.get("/", getTicketsController);

// Retrieve ticket by ID
ticketRouter.get("/:id", getTicketByIdController);

export default ticketRouter;