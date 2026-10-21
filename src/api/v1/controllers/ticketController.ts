import { Request, Response } from "express";
import { HttpStatus } from "../../../constants/httpStatus";
import { Ticket } from "../models/ticket";
import {
    getAllTickets,
    getTicketById,
} from "../services/ticketService";

// GET /api/v1/tickets
export function getTicketsController(
    _req: Request,
    res: Response
): void {
    const tickets: Ticket[] = getAllTickets();

    res.status(HttpStatus.OK).json({
        message: "Tickets retrieved successfully",
        count: tickets.length,
        data: tickets,
    });
}

// GET /api/v1/tickets/:id
export function getTicketByIdController(
    req: Request,
    res: Response
): void {
    const id: number = Number(req.params.id);
    const ticket: Ticket | undefined = getTicketById(id);

    if (!ticket) {
        res.status(HttpStatus.NOT_FOUND).json({
            message: "Ticket not found",
        });
        return;
    }

    res.status(HttpStatus.OK).json({
        message: "Ticket retrieved successfully",
        data: ticket,
    });
}